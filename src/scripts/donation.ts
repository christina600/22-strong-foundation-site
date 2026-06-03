/**
 * Donation widget controls.
 *
 * Document-level listeners support each donation module on the homepage.
 */

let donationListenerAttached = false;

const ACTIVE_CLASS = "active";
const UPDATING_CLASS = "is-updating";
const AMOUNT_SELECTOR = "[data-amount]";
const FREQUENCY_SELECTOR = "[data-frequency]";

function formatGiftAmount(amount: string | number) {
  return Number(amount).toLocaleString();
}

function setActiveOption(scope: Element | Document, selector: string, activeOption: Element) {
  scope.querySelectorAll(selector).forEach((option) => {
    const isActive = option === activeOption;
    option.classList.toggle(ACTIVE_CLASS, isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });
}

function clearActiveOptions(scope: Element | Document, selector: string) {
  scope.querySelectorAll(selector).forEach((option) => {
    option.classList.remove(ACTIVE_CLASS);
    option.setAttribute("aria-pressed", "false");
  });
}

function getGiftAmount(module: Element): string {
  const custom = module.querySelector<HTMLInputElement>(".other-amount-input")?.value || "";
  const customNumber = Number(custom.replace(/[^0-9.]/g, ""));
  if (customNumber > 0) return String(Math.round(customNumber));
  return module.querySelector<HTMLElement>(`${AMOUNT_SELECTOR}.${ACTIVE_CLASS}`)?.dataset.amount || "100";
}

function updateGiftSummary(scope: Element | Document = document, pulse = true) {
  const module =
    (scope as HTMLElement).closest?.(".donation-module") ||
    scope.querySelector?.(".donation-module") ||
    document;
  if (!module) return;

  const activeAmount = getGiftAmount(module as Element);
  const activeFrequency =
    module.querySelector<HTMLElement>(`${FREQUENCY_SELECTOR}.${ACTIVE_CLASS}`)?.dataset.frequency || "monthly";

  const summary = module.querySelector(".gift-summary");
  const detail = module.querySelector(".gift-detail");
  const small = module.querySelector(".impact-line small");
  const card = module.querySelector(".donation-card-main");

  if (summary) {
    const formattedAmount = formatGiftAmount(activeAmount);
    summary.textContent = activeFrequency === "monthly"
      ? `$${formattedAmount}/mo`
      : `$${formattedAmount}`;
  }
  if (detail) {
    // Pull the per-amount impact copy embedded by DonationModule.astro and
    // swap in the line for this amount + frequency. Tokens: {amount}, {annual}.
    const raw = (module as HTMLElement).dataset?.impactMap;
    if (raw) {
      try {
        const map = JSON.parse(raw);
        const freqMap = activeFrequency === "monthly" ? map.monthly : map.oneTime;
        const template = (freqMap && (freqMap[activeAmount] ?? freqMap.default)) || "";
        const annual = (Number(activeAmount) * 12).toLocaleString();
        const text = String(template)
          .replace(/\{amount\}/g, Number(activeAmount).toLocaleString())
          .replace(/\{annual\}/g, annual);
        if (text) detail.textContent = text; // keep server-rendered line if map is empty
      } catch {
        /* Malformed impact map: leave the existing line untouched. */
      }
    }
  }
  if (small) {
    const annual = Number(activeAmount) * 12;
    small.textContent = activeFrequency === "monthly"
      ? `Monthly gift. Annual commitment: $${annual.toLocaleString()}.`
      : "One-time gift.";
  }

  const donateBtn = module.querySelector<HTMLAnchorElement>(".btn-donate");
  if (donateBtn) {
    const base = donateBtn.dataset.donateBase || donateBtn.getAttribute("href") || "";
    if (/^https?:\/\//i.test(base)) {
      const sep = base.includes("?") ? "&" : "?";
      donateBtn.href =
        `${base}${sep}amount=${encodeURIComponent(activeAmount)}&frequency=${encodeURIComponent(activeFrequency)}`;
    }
  }

  if (pulse && card) {
    card.classList.remove(UPDATING_CLASS);
    requestAnimationFrame(() => {
      card.classList.add(UPDATING_CLASS);
      setTimeout(() => card.classList.remove(UPDATING_CLASS), 450);
    });
  }
}

function initDonation() {
  if (donationListenerAttached) return;
  donationListenerAttached = true;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const amountButton = event.target.closest(AMOUNT_SELECTOR);
    const frequencyButton = event.target.closest(FREQUENCY_SELECTOR);

    if (amountButton) {
      const module = amountButton.closest(".donation-module") || document;
      setActiveOption(module, AMOUNT_SELECTOR, amountButton);
      const otherAmount = module.querySelector<HTMLInputElement>(".other-amount-input");
      if (otherAmount) otherAmount.value = "";
      updateGiftSummary(module as Element);
    }

    if (frequencyButton) {
      const module = frequencyButton.closest(".donation-module") || document;
      setActiveOption(module, FREQUENCY_SELECTOR, frequencyButton);
      updateGiftSummary(module as Element);
    }
  });

  document.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const input = event.target.closest(".other-amount-input");
    if (!input) return;
    const module = input.closest(".donation-module") || document;
    clearActiveOptions(module, AMOUNT_SELECTOR);
    updateGiftSummary(module as Element);
  });
}

function initDonationPage() {
  initDonation();
  document.querySelectorAll(".donation-module").forEach((mod) => updateGiftSummary(mod, false));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDonationPage, { once: true });
} else {
  initDonationPage();
}
