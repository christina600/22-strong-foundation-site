/**
 * Journey spine — scroll-traced pathway animation.
 *
 * The fill line grows as you scroll past the journey section,
 * and each station's node lights up when you reach it.
 * Only runs on pages that have a .journey element.
 *
 * Respects prefers-reduced-motion: shows the path fully revealed.
 *
 * Re-initializes on every page load for View Transitions compatibility.
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Keep reference to current scroll listener so we can clean it up
let currentScrollHandler: (() => void) | null = null;
let currentResizeHandler: (() => void) | null = null;

function initJourney() {
  // Clean up previous listeners if navigating between pages
  if (currentScrollHandler) {
    window.removeEventListener("scroll", currentScrollHandler);
    currentScrollHandler = null;
  }
  if (currentResizeHandler) {
    window.removeEventListener("resize", currentResizeHandler);
    currentResizeHandler = null;
  }

  const journeyEl = document.getElementById("journey");
  const journeyFill = document.getElementById("journeyFill");
  const journeyStations = journeyEl
    ? Array.from(journeyEl.querySelectorAll<HTMLElement>(".journey-station"))
    : [];

  if (!journeyEl || !journeyFill) return;

  function updateJourney() {
    if (!journeyEl || !journeyFill || prefersReducedMotion.matches) return;
    const rect = journeyEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const focusY = vh * 0.55;
    const progress = Math.max(0, Math.min(1, (focusY - rect.top) / (rect.height || 1)));
    journeyFill.style.height = (progress * 100).toFixed(2) + "%";
    for (const st of journeyStations) {
      st.classList.toggle("is-active", st.getBoundingClientRect().top < focusY);
    }
  }

  if (prefersReducedMotion.matches) {
    // Reduced motion: show the path whole
    journeyFill.style.height = "100%";
    journeyStations.forEach(s => s.classList.add("is-active"));
  } else {
    updateJourney();
    currentScrollHandler = updateJourney;
    currentResizeHandler = updateJourney;
    window.addEventListener("scroll", updateJourney, { passive: true });
    window.addEventListener("resize", updateJourney);
  }
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", initJourney);
