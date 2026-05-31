/**
 * Scroll reveal — elements fade/slide in as they enter the viewport.
 *
 * Uses IntersectionObserver for efficiency. Elements get staggered
 * delays within their parent group so a row of cards cascades in
 * one after another.
 *
 * Respects prefers-reduced-motion: everything shows immediately.
 *
 * Re-initializes on every page load for View Transitions compatibility.
 * Hero entrance runs ONCE on initial load only (Leo audit fix).
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Track whether the hero entrance has already played this session
let heroEntrancePlayed = false;

// Element types that should use the simpler .reveal-plain class
// (no micro-scale, just opacity).
const REVEAL_PLAIN_SELECTOR = ".section-image, .support-photo, .image-card, .photo-pane, .split-pane-image, .full-bleed-bg";

// All element types that get scroll-reveal treatment
const REVEAL_SELECTORS = [
  ".metrics > .metric",
  ".audit-grid > .audit-tile",
  ".step",
  ".program-card",
  ".proof-row",
  ".grid > .card",
  ".trust-note",
  ".alert-note",
  ".donation-module",
  ".section-image",
  ".support-photo",
  ".image-card",
  ".photo-pane",
  ".split-pane-image",
  ".full-bleed-bg",
  ".footer-group",
  ".reveal-feature",
  ".testimonial-entry",
  ".recognition-seal",
  ".stat-card",
  ".gap-item"
].join(", ");

function revealElement(element: Element) {
  element.classList.add("is-visible");
}

function setupScrollReveals() {
  const targets = Array.from(document.querySelectorAll(REVEAL_SELECTORS));
  if (!targets.length) return;

  // Add scroll-dynamic class and stagger delays by sibling position
  const groupCounts = new Map<Node, number>();
  targets.forEach(element => {
    // Skip elements already revealed from a previous page load
    if (element.classList.contains("is-visible")) return;
    element.classList.add("scroll-dynamic");
    if (element.matches(REVEAL_PLAIN_SELECTOR)) {
      element.classList.add("reveal-plain");
    }
    const parent = element.parentNode;
    if (!parent) return;
    const order = groupCounts.get(parent) || 0;
    groupCounts.set(parent, order + 1);
    // Aries: keep the cascade brisk — content shouldn't queue behind a long
    // stagger. Tighter step, lower ceiling, so later siblings land sooner.
    const delay = Math.min(order * 70, 320);
    (element as HTMLElement).style.setProperty("--scroll-delay", `${delay}ms`);
  });

  // Get only the newly added scroll-dynamic elements that are not yet visible
  const unrevealed = targets.filter(el =>
    el.classList.contains("scroll-dynamic") && !el.classList.contains("is-visible")
  );

  // Reduced motion or no IntersectionObserver: show everything immediately
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    unrevealed.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  // Elements already in view get revealed immediately
  unrevealed.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
      revealElement(element);
    } else {
      observer.observe(element);
    }
  });
}

// Orchestrated hero entrance: eyebrow -> headline -> lead -> actions
// cascade in on load. Runs ONCE on initial page load, not on every
// navigation (fixes Leo audit issue).
function orchestrateHeroEntrance() {
  if (heroEntrancePlayed) return;
  heroEntrancePlayed = true;

  const hero = document.querySelector(".hero-home, .hero");
  if (!hero) return;

  const sequence: { el: Element; delay: number }[] = [];
  const push = (selector: string, delay: number) => {
    const el = hero.querySelector(selector);
    if (el) sequence.push({ el, delay });
  };
  push(".eyebrow", 80);
  push("h1", 180);
  push(".lead", 420);
  push(".actions, .hero-actions, .button-row", 560);
  push(".hero-proof-strip", 700);
  push(".hero-home-donation", 320);

  if (prefersReducedMotion.matches) {
    sequence.forEach(({ el }) => el.classList.add("scroll-dynamic", "is-visible"));
    return;
  }

  sequence.forEach(({ el, delay }) => {
    el.classList.add("scroll-dynamic");
    (el as HTMLElement).style.setProperty("--scroll-delay", `${delay}ms`);
  });
  // Trigger on the next two frames so the initial hidden state paints first
  requestAnimationFrame(() => requestAnimationFrame(() => {
    sequence.forEach(({ el }) => el.classList.add("is-visible"));
  }));
}

// Listen for reduced-motion changes
prefersReducedMotion.addEventListener?.("change", () => {
  document.querySelectorAll(".scroll-dynamic:not(.is-visible)").forEach(revealElement);
});

function initScrollReveal() {
  orchestrateHeroEntrance();
  setupScrollReveals();

  // Safety net: force any still-hidden elements visible after 4 seconds
  window.setTimeout(() => {
    document.querySelectorAll(".scroll-dynamic:not(.is-visible)").forEach(el => {
      el.classList.add("is-visible");
    });
  }, 4000);
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", initScrollReveal);
