/**
 * Homepage scrollytelling — reveals [data-reveal] elements as they scroll
 * into view, staggering siblings so rows of cards cascade in.
 *
 * Self-contained (the homepage uses home.css, not the global animation
 * stack). Respects prefers-reduced-motion. Re-inits on every View
 * Transition navigation. Includes a safety net so nothing stays hidden.
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let cleanupStoryMotion: (() => void) | undefined;

function reveal(el: Element) {
  el.classList.add("is-visible");
}

function initHomeReveal() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!targets.length) return;

  // Stagger by sibling order within each parent, so grids cascade.
  const groupCounts = new Map<Node, number>();
  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const parent = el.parentNode;
    if (!parent) return;
    const order = groupCounts.get(parent) || 0;
    groupCounts.set(parent, order + 1);
    const delay = Math.min(order * 90, 360);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  // No-motion / no-observer: show everything immediately.
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

  // Safety net: never leave content stuck hidden.
  window.setTimeout(() => {
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(reveal);
  }, 4500);
}

function initStoryMotion() {
  cleanupStoryMotion?.();
  cleanupStoryMotion = undefined;

  if (prefersReducedMotion.matches) return;

  const panels = Array.from(
    document.querySelectorAll<HTMLElement>(
      "#serve-veterans, #serve-athletes, #serve-cancer, #serve-veterans + .proof-stat, #serve-athletes + .proof-stat, .quote-wrap"
    )
  );
  if (!panels.length) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const viewportCenter = window.innerHeight / 2;
    const viewportRange = Math.max(window.innerHeight, 1);

    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const panelCenter = rect.top + rect.height / 2;
      const delta = Math.max(-1, Math.min(1, (panelCenter - viewportCenter) / viewportRange));
      const isQuote = panel.classList.contains("quote-wrap");

      panel.style.setProperty("--story-text-y", `${(-delta * (isQuote ? 14 : 18)).toFixed(2)}px`);
      panel.style.setProperty("--story-media-y", `${(delta * (isQuote ? 18 : 24)).toFixed(2)}px`);
      panel.style.setProperty("--story-frame-y", `${(delta * 8).toFixed(2)}px`);
    });
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  cleanupStoryMotion = () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

prefersReducedMotion.addEventListener?.("change", () => {
  document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(reveal);
  initStoryMotion();
});

document.addEventListener("astro:page-load", () => {
  initHomeReveal();
  initStoryMotion();
});
