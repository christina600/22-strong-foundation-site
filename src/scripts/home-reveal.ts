/**
 * Homepage scrollytelling and reveal behavior.
 *
 * Self-contained for the homepage and respects reduced-motion preferences.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const HIDDEN_REVEAL_SELECTOR = `${REVEAL_SELECTOR}:not(.is-visible)`;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let hashRevealListenerAttached = false;

function reveal(el: Element) {
  el.classList.add("is-visible");
}

function revealHidden() {
  document.querySelectorAll(HIDDEN_REVEAL_SELECTOR).forEach(reveal);
}

function revealVisible(targets: HTMLElement[]) {
  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98 && rect.bottom > -32) {
      reveal(el);
    }
  });
}

function scheduleVisibleReveal(targets: HTMLElement[]) {
  window.requestAnimationFrame(() => revealVisible(targets));
  window.setTimeout(() => revealVisible(targets), 180);
  window.setTimeout(() => revealVisible(targets), 700);
}

function ensureHashRevealListener() {
  if (hashRevealListenerAttached) return;
  hashRevealListenerAttached = true;

  window.addEventListener("hashchange", () => {
    scheduleVisibleReveal(Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)));
  });
}

function initHomeReveal() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
  if (!targets.length) return;

  if (window.location.hash) {
    targets.forEach(reveal);
    ensureHashRevealListener();
    return;
  }

  // Stagger by sibling order within each parent, so grids cascade.
  const groupCounts = new Map<Node, number>();
  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const parent = el.parentNode;
    if (!parent) return;
    const order = groupCounts.get(parent) || 0;
    groupCounts.set(parent, order + 1);
    const delay = Math.min(order * 65, 260);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );

  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const rect = el.getBoundingClientRect();
    // Anything already on-screen at load reveals right away.
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      reveal(el);
    } else {
      observer.observe(el);
    }
  });

  scheduleVisibleReveal(targets);
  ensureHashRevealListener();
  window.setTimeout(revealHidden, 4500);
}

prefersReducedMotion.addEventListener?.("change", revealHidden);

function initHomePageMotion() {
  initHomeReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePageMotion, { once: true });
} else {
  window.requestAnimationFrame(initHomePageMotion);
}
