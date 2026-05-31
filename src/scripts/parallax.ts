/**
 * Parallax, scroll progress bar, and header condensing.
 *
 * One rAF loop handles all three effects to avoid layout thrashing.
 * Respects prefers-reduced-motion.
 *
 * Re-initializes on every page load for View Transitions compatibility.
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let parallaxTargets: HTMLElement[] = [];
let parallaxRunning = false;
let scrollProgressEl: HTMLElement | null = null;
let siteHeaderEl: HTMLElement | null = null;
let headerCondensed = false;

// Keep track of listeners so we can avoid duplicating them
let scrollListenerAttached = false;

function setupScrollChrome() {
  siteHeaderEl = document.querySelector(".site-header");
  scrollProgressEl = document.querySelector(".scroll-progress");
  updateScrollChrome();
}

function updateScrollChrome() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / max));
  if (scrollProgressEl) {
    scrollProgressEl.style.setProperty("--progress", progress.toFixed(4));
  }
  const condensed = window.scrollY > 60;
  if (siteHeaderEl && condensed !== headerCondensed) {
    headerCondensed = condensed;
    siteHeaderEl.classList.toggle("is-scrolled", condensed);
  }
}

function refreshParallaxTargets() {
  parallaxTargets = Array.from(
    document.querySelectorAll<HTMLElement>(".hero-bg, .photo-pane, .section-image, .support-photo, .image-card, .split-pane-image, .full-bleed-bg, .program-card-photo")
  );
  requestParallaxUpdate();
}

function updateParallaxPass() {
  if (prefersReducedMotion.matches) return;
  const viewportHeight = window.innerHeight || 1;

  // READ phase: gather measurements before touching styles
  const measured = parallaxTargets.map(element => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < -160 || rect.top > viewportHeight + 160) return null;
    const centerOffset = (rect.top + rect.height / 2) - viewportHeight / 2;
    const progress = centerOffset / (viewportHeight + rect.height);
    const strength = element.classList.contains("hero-bg") ? 18 : 8;
    return Math.max(-strength, Math.min(strength, progress * -strength));
  });

  // WRITE phase: apply all values together
  parallaxTargets.forEach((element, index) => {
    if (measured[index] === null) return;
    element.style.setProperty("--parallax-y", `${(measured[index] as number).toFixed(2)}px`);
  });
}

function requestParallaxUpdate() {
  if (prefersReducedMotion.matches) return;
  if (!parallaxRunning) {
    parallaxRunning = true;
    requestAnimationFrame(() => {
      parallaxRunning = false;
      updateParallaxPass();
      updateScrollChrome();
    });
  }
}

// Listen for reduced-motion changes
prefersReducedMotion.addEventListener?.("change", () => {
  parallaxTargets.forEach(element => element.style.setProperty("--parallax-y", "0px"));
  requestParallaxUpdate();
});

function initParallax() {
  setupScrollChrome();
  refreshParallaxTargets();

  // Only attach scroll/resize listeners once (they persist across navigations)
  if (!scrollListenerAttached) {
    scrollListenerAttached = true;
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
  }
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", initParallax);
