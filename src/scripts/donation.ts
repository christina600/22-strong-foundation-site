/**
 * Donation widget controls.
 *
 * Document-level listeners support each donation module on the homepage.
 */

import { getEventElement } from "./dom-target";
import { DONATION_PRESET_EVENT } from "./events";

let donationListenerAttached = false;

const ACTIVE_CLASS = "active";
const UPDATING_CLASS = "is-updating";
const AMOUNT_SELECTOR = "[data-amount]";
const FREQUENCY_SELECTOR = "[data-frequency-control]";
const MODULE_SELECTOR = ".donation-module";
const DEFAULT_AMOUNT = "100";
const UPDATE_PULSE_MS = 450;

type DonationPresetDetail = {
  amount?: string;
  frequency?: string;
};

type DonationImpactMap = {
  monthly?: Record<string, string>;
  oneTime?: Record<string, string>;
};

const impactMapCache = new WeakMap<HTMLElement, DonationImpactMap | null>();

function formatGiftAmount(amount: string | number) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return "0";

  return numericAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function setActiveOption(module: HTMLElement, selector: string, activeOption: HTMLElement) {
  module.querySelectorAll<HTMLElement>(selector).forEach((option) => {
    const isActive = option === activeOption;
    option.classList.toggle(ACTIVE_CLASS, isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });
}

function clearActiveOptions(module: HTMLElement, selector: string) {
  module.querySelectorAll<HTMLElement>(selector).forEach((option) => {
    option.classList.remove(ACTIVE_CLASS);
    option.setAttribute("aria-pressed", "false");
  });
}

function parseCustomAmount(value: string) {
  const amount = Number(value.trim().replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getActiveFrequency(module: HTMLElement) {
  return module.querySelector<HTMLElement>(`${FREQUENCY_SELECTOR}.${ACTIVE_CLASS}`)?.dataset.frequency
    || module.dataset.frequency
    || "one-time";
}

function getActiveGrid(module: HTMLElement) {
  return module.querySelector<HTMLElement>(`.amount-grid[data-grid="${getActiveFrequency(module)}"]`);
}

function getDefaultAmount(module: HTMLElement, frequency = getActiveFrequency(module)) {
  return (frequency === "monthly" ? module.dataset.defaultMonthly : module.dataset.defaultOnetime) || DEFAULT_AMOUNT;
}

function getDefaultAmountOption(module: HTMLElement) {
  const grid = getActiveGrid(module);
  if (!grid) return null;
  const defaultAmount = getDefaultAmount(module);
  const options = Array.from(grid.querySelectorAll<HTMLElement>(AMOUNT_SELECTOR));
  return options.find((option) => option.dataset.amount === defaultAmount) || options[0];
}

function findDataOption(module: HTMLElement, selector: string, dataKey: string, value: string) {
  const options = Array.from(module.querySelectorAll<HTMLElement>(selector));
  return options.find((option) => option.dataset[dataKey] === value);
}

function getGiftAmount(module: HTMLElement): string {
  const custom = module.querySelector<HTMLInputElement>(".other-amount-input")?.value || "";
  const customNumber = parseCustomAmount(custom);
  if (customNumber > 0) return String(customNumber);
  const grid = getActiveGrid(module);
  return grid?.querySelector<HTMLElement>(`${AMOUNT_SELECTOR}.${ACTIVE_CLASS}`)?.dataset.amount || getDefaultAmount(module);
}

function getPresetDetail(detail: unknown): DonationPresetDetail {
  if (!detail || typeof detail !== "object") return {};

  const preset = detail as Record<string, unknown>;
  return {
    amount: typeof preset.amount === "string" ? preset.amount : undefined,
    frequency: typeof preset.frequency === "string" ? preset.frequency : undefined,
  };
}

function applyDonationPreset(module: HTMLElement, detail: DonationPresetDetail) {
  if (detail.frequency) {
    const frequency = findDataOption(module, FREQUENCY_SELECTOR, "frequency", detail.frequency);
    if (frequency) setActiveOption(module, FREQUENCY_SELECTOR, frequency);
    module.dataset.frequency = detail.frequency;
  }

  if (detail.amount) {
    const grid = getActiveGrid(module);
    const amount = grid?.querySelector<HTMLElement>(`${AMOUNT_SELECTOR}[data-amount="${detail.amount}"]`);
    const otherAmount = module.querySelector<HTMLInputElement>(".other-amount-input");
    if (grid && amount) {
      setActiveOption(grid, AMOUNT_SELECTOR, amount);
      if (otherAmount) otherAmount.value = "";
    } else if (otherAmount) {
      clearActiveOptions(module, AMOUNT_SELECTOR);
      otherAmount.value = detail.amount;
    }
  }

  updateGiftSummary(module);
}

function getImpactMap(module: HTMLElement) {
  if (impactMapCache.has(module)) return impactMapCache.get(module);

  const raw = module.dataset.impactMap;
  if (!raw) {
    impactMapCache.set(module, null);
    return null;
  }

  try {
    const map = JSON.parse(raw) as DonationImpactMap;
    impactMapCache.set(module, map);
    return map;
  } catch {
    impactMapCache.set(module, null);
    return null;
  }
}

function getImpactTemplate(map: DonationImpactMap, frequency: string, amount: string) {
  const freqMap = frequency === "monthly" ? map.monthly : map.oneTime;
  if (!freqMap || typeof freqMap !== "object") return "";

  return freqMap[amount] ?? freqMap.default ?? "";
}

function updateGiftSummary(module: HTMLElement, pulse = false) {
  const activeAmount = getGiftAmount(module);
  const activeFrequency = getActiveFrequency(module);
  const formattedAmount = formatGiftAmount(activeAmount);

  const summary = module.querySelector(".gift-summary");
  const detail = module.querySelector(".gift-detail");
  const small = module.querySelector(".impact-line small");
  const eyebrow = module.querySelector<HTMLElement>(".impact-line .eyebrow");
  const card = module.querySelector(".donation-card-main");

  if (summary) {
    summary.textContent = activeFrequency === "monthly"
      ? `$${formattedAmount}/mo`
      : `$${formattedAmount}`;
  }
  if (detail) {
    const map = getImpactMap(module);
    const template = map ? getImpactTemplate(map, activeFrequency, activeAmount) : "";
    if (template) {
      const annual = formatGiftAmount(Number(activeAmount) * 12);
      const text = template
        .replace(/\{amount\}/g, formatGiftAmount(activeAmount))
        .replace(/\{annual\}/g, annual);
      detail.textContent = text;
    }
  }
  if (small) {
    const annual = formatGiftAmount(Number(activeAmount) * 12);
    small.textContent = activeFrequency === "monthly"
      ? `Monthly gift. Annual commitment: $${annual}.`
      : "One-time gift.";
  }
  if (eyebrow) {
    // Swap the impact-line label so one-time mode never reads "monthly".
    const label = activeFrequency === "monthly" ? eyebrow.dataset.labelMonthly : eyebrow.dataset.labelOnetime;
    if (label) eyebrow.textContent = label;
  }

  const donateBtn = module.querySelector<HTMLAnchorElement>(".btn-donate");
  if (donateBtn) {
    // Monthly checks out to the 22 Strong Circle campaign, one-time to Fund
    // Recovery Care; fall back to the other base, then the rendered href.
    const oneTimeBase = donateBtn.dataset.donateOnetime || "";
    const monthlyBase = donateBtn.dataset.donateMonthly || "";
    const base =
      (activeFrequency === "monthly" ? monthlyBase || oneTimeBase : oneTimeBase)
      || donateBtn.getAttribute("href") || "";
    if (/^https?:\/\//i.test(base)) {
      const sep = base.includes("?") ? "&" : "?";
      // Givebutter's frequency param accepts once|monthly|quarterly|yearly.
      const gbFrequency = activeFrequency === "monthly" ? "monthly" : "once";
      donateBtn.href =
        `${base}${sep}amount=${encodeURIComponent(activeAmount)}&frequency=${gbFrequency}`;
      const labelTemplate = activeFrequency === "monthly"
        ? donateBtn.dataset.labelMonthly
        : donateBtn.dataset.labelOnetime;
      if (labelTemplate) {
        const label = labelTemplate.replace(/\{amount\}/g, `$${formattedAmount}`);
        donateBtn.textContent = label;
        donateBtn.setAttribute("aria-label", label);
      }
    }
  }

  if (pulse && card) {
    card.classList.remove(UPDATING_CLASS);
    requestAnimationFrame(() => {
      card.classList.add(UPDATING_CLASS);
      setTimeout(() => card.classList.remove(UPDATING_CLASS), UPDATE_PULSE_MS);
    });
  }
}

function initDonation() {
  if (donationListenerAttached) return;
  donationListenerAttached = true;

  document.addEventListener("click", (event) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const amountButton = target.closest<HTMLElement>(AMOUNT_SELECTOR);
    const frequencyButton = target.closest<HTMLElement>(FREQUENCY_SELECTOR);

    if (amountButton) {
      const module = amountButton.closest<HTMLElement>(MODULE_SELECTOR);
      const grid = amountButton.closest<HTMLElement>(".amount-grid");
      if (!module || !grid) return;
      setActiveOption(grid, AMOUNT_SELECTOR, amountButton);
      const otherAmount = module.querySelector<HTMLInputElement>(".other-amount-input");
      if (otherAmount) otherAmount.value = "";
      updateGiftSummary(module);
    }

    if (frequencyButton) {
      const module = frequencyButton.closest<HTMLElement>(MODULE_SELECTOR);
      if (!module) return;
      setActiveOption(module, FREQUENCY_SELECTOR, frequencyButton);
      module.dataset.frequency = frequencyButton.dataset.frequency || "one-time";
      const otherAmount = module.querySelector<HTMLInputElement>(".other-amount-input");
      if (otherAmount) otherAmount.value = "";
      updateGiftSummary(module);
    }
  });

  document.addEventListener("input", (event) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const input = target.closest<HTMLInputElement>(".other-amount-input");
    if (!input) return;
    const module = input.closest<HTMLElement>(MODULE_SELECTOR);
    if (!module) return;
    if (parseCustomAmount(input.value) > 0) {
      clearActiveOptions(module, AMOUNT_SELECTOR);
    } else {
      const grid = getActiveGrid(module);
      const defaultOption = getDefaultAmountOption(module);
      if (grid && defaultOption) setActiveOption(grid, AMOUNT_SELECTOR, defaultOption);
    }
    updateGiftSummary(module);
  });

  document.addEventListener(DONATION_PRESET_EVENT, (event) => {
    if (!(event instanceof CustomEvent)) return;

    const detail = getPresetDetail(event.detail);
    document.querySelectorAll<HTMLElement>(MODULE_SELECTOR).forEach((module) => {
      applyDonationPreset(module, detail);
    });
  });
}

function initDonationPage() {
  initDonation();
  document.querySelectorAll<HTMLElement>(MODULE_SELECTOR).forEach((module) => updateGiftSummary(module, false));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDonationPage, { once: true });
} else {
  initDonationPage();
}
