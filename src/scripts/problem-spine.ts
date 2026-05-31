/**
 * Problem spine — scroll-driven activation of the theory-of-change.
 *
 * As the reader scrolls through the Problem section, the flow connectors
 * and the if → then → impact chain switch on when they cross a focus
 * line near the lower third of the viewport. The chain's left → right
 * build is handled in CSS (staggered transition-delays); this script
 * only decides WHEN a block becomes active.
 *
 * Modeled on journey.ts: one passive scroll listener, cleaned up across
 * View Transition navigations. Respects prefers-reduced-motion by
 * activating everything immediately (the CSS then shows the final state).
 *
 * Only runs on pages that contain a .problem-section.
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let scrollHandler: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;

function initProblemSpine() {
  // Tear down listeners from a previous page before re-binding.
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }

  const section = document.querySelector<HTMLElement>(".problem-section");
  if (!section) return;

  const flows = Array.from(section.querySelectorAll<HTMLElement>(".problem-flow"));
  const chains = Array.from(section.querySelectorAll<HTMLElement>(".turn-chain"));
  const blocks = [...flows, ...chains];
  if (!blocks.length) return;

  // Reduced motion: switch everything on once and stop.
  if (prefersReducedMotion.matches) {
    blocks.forEach((el) => el.classList.add("is-active"));
    return;
  }

  function update() {
    const focusY = (window.innerHeight || 1) * 0.72;
    for (const el of blocks) {
      el.classList.toggle("is-active", el.getBoundingClientRect().top < focusY);
    }
  }

  update();
  scrollHandler = update;
  resizeHandler = update;
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

// Run on initial load and every View Transition navigation.
document.addEventListener("astro:page-load", initProblemSpine);
