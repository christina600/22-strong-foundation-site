/**
 * Homepage scrollytelling and reveal behavior.
 *
 * Self-contained for the homepage and respects reduced-motion preferences.
 * Motion is intentionally limited to a short, single reveal per content block.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const HIDDEN_REVEAL_SELECTOR = `${REVEAL_SELECTOR}:not(.is-visible)`;
const VISIBLE_REVEAL_DELAYS = [180, 700];
const REVEAL_FALLBACK_DELAY = 2000;
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
  VISIBLE_REVEAL_DELAYS.forEach((delay) => {
    window.setTimeout(() => revealVisible(targets), delay);
  });
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
    { rootMargin: "80px 0px -5% 0px", threshold: 0.08 }
  );

  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const rect = el.getBoundingClientRect();
    // Anything already on-screen or about to enter reveals right away.
    // Extended threshold: top of element is below viewport but within 200px
    if (rect.top < window.innerHeight * 0.96 + 100 && rect.bottom > -40) {
      reveal(el);
    } else {
      observer.observe(el);
    }
  });

  scheduleVisibleReveal(targets);
  ensureHashRevealListener();
  window.setTimeout(revealHidden, REVEAL_FALLBACK_DELAY);
}

prefersReducedMotion.addEventListener?.("change", revealHidden);

/* ── Hero video autoplay fallback ───────────────────────────────
   Browsers in power-saving states (iPhone Low Power Mode, Chrome
   Energy Saver) block muted autoplay and leave the hero on its
   first frame. Retry on the first user gesture, which those
   browsers accept. Skipped under reduced-motion so a blocked
   autoplay stays still for users who asked for less movement.
   ──────────────────────────────────────────────────────────── */
function initHeroVideoFallback() {
  if (prefersReducedMotion.matches) return;

  const video = document.querySelector<HTMLVideoElement>(".hero-media video");
  if (!video) return;

  const kick = () => {
    if (video.paused) void video.play().catch(() => {});
  };

  window.addEventListener("pointerdown", kick, { once: true });
  window.addEventListener("scroll", kick, { once: true, passive: true });
}

function initHomePageMotion() {
  initHomeReveal();
  initHeroVideoFallback();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePageMotion, { once: true });
} else {
  window.requestAnimationFrame(initHomePageMotion);
}
