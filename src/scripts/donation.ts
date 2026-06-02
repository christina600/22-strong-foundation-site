/**
 * Donation widget — amount buttons, frequency toggle, summary update.
 *
 * Uses event delegation on the document so it works for both donation widgets
 * on the single-scroll homepage.
 *
 * Event delegation listeners persist across View Transitions
 * (attached once, work on all pages).
 */

let donationListenerAttached = false;

function getGiftAmount(module: Element): string {
  const custom = module.querySelector<HTMLInputElement>(".other-amount-input")?.value || "";
  const customNumber = Number(custom.replace(/[^0-9.]/g, ""));
  if (customNumber > 0) return String(Math.round(customNumber));
  return module.querySelector<HTMLElement>("[data-amount].active")?.dataset.amount || "100";
}

function updateGiftSummary(scope: Element | Document = document, pulse = true) {
  const module =
    (scope as HTMLElement).closest?.(".donation-module") ||
    scope.querySelector?.(".donation-module") ||
    document;
  if (!module) return;

  const activeAmount = getGiftAmount(module as Element);
  const activeFrequency =
    module.querySelector<HTMLElement>("[data-frequency].active")?.dataset.frequency || "monthly";

  const summary = module.querySelector(".gift-summary");
  const detail = module.querySelector(".gift-detail");
  const small = module.querySelector(".impact-line small");
  const card = module.querySelector(".donation-card-main");

  if (summary) {
    summary.textContent = activeFrequency === "monthly"
      ? `$${activeAmount}/mo`
      : `$${activeAmount}`;
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
        /* malformed map — leave the existing line untouched */
      }
    }
  }
  if (small) {
    const annual = Number(activeAmount) * 12;
    small.textContent = activeFrequency === "monthly"
      ? `Monthly gift. Annual commitment: $${annual.toLocaleString()}.`
      : "One-time gift.";
  }

  // Carry the chosen amount + frequency onto the "continue" link so the donor
  // lands on the giving platform with their selection prefilled. Only build a
  // param'd URL from a real http(s) base — TEMPLATE placeholders are left as-is.
  const donateBtn = module.querySelector<HTMLAnchorElement>(".btn-donate");
  if (donateBtn) {
    const base = donateBtn.dataset.donateBase || donateBtn.getAttribute("href") || "";
    if (/^https?:\/\//i.test(base)) {
      const sep = base.includes("?") ? "&" : "?";
      donateBtn.href =
        `${base}${sep}amount=${encodeURIComponent(activeAmount)}&frequency=${encodeURIComponent(activeFrequency)}`;
    }
  }

  // Quick visual pulse on update
  if (pulse && card) {
    card.classList.remove("is-updating");
    requestAnimationFrame(() => {
      card.classList.add("is-updating");
      setTimeout(() => card.classList.remove("is-updating"), 450);
    });
  }
}

function initDonation() {
  if (donationListenerAttached) return;
  donationListenerAttached = true;

  // Amount button clicks
  document.addEventListener("click", (event) => {
    const amountButton = (event.target as HTMLElement).closest("[data-amount]");
    const frequencyButton = (event.target as HTMLElement).closest("[data-frequency]");

    if (amountButton) {
      const module = amountButton.closest(".donation-module") || document;
      module.querySelectorAll("[data-amount]").forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      amountButton.classList.add("active");
      amountButton.setAttribute("aria-pressed", "true");
      const otherAmount = module.querySelector<HTMLInputElement>(".other-amount-input");
      if (otherAmount) otherAmount.value = "";
      updateGiftSummary(module as Element);
    }

    if (frequencyButton) {
      const module = frequencyButton.closest(".donation-module") || document;
      module.querySelectorAll("[data-frequency]").forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      frequencyButton.classList.add("active");
      frequencyButton.setAttribute("aria-pressed", "true");
      updateGiftSummary(module as Element);
    }
  });

  // Custom amount input
  document.addEventListener("input", (event) => {
    const input = (event.target as HTMLElement).closest(".other-amount-input");
    if (!input) return;
    const module = input.closest(".donation-module") || document;
    module.querySelectorAll("[data-amount]").forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    updateGiftSummary(module as Element);
  });
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", () => {
  initDonation();
  // Sync each module's continue link with its default selection (no pulse).
  document.querySelectorAll(".donation-module").forEach((mod) => updateGiftSummary(mod, false));
});
