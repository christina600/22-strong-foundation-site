/**
 * Homepage scrollytelling and reveal behavior.
 *
 * Self-contained for the homepage and respects reduced-motion preferences.
 * Also drives the hero parallax effect via a CSS custom property on .hero::before.
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

/* ── Hero parallax ──────────────────────────────────────────────
   Moves the hero::before photo layer at 28% of scroll speed,
   creating a depth separation between the text and the image.
   Uses a CSS custom property so the transform stays in CSS and
   the JS only updates a single number per frame.
   ──────────────────────────────────────────────────────────── */
function initHeroParallax() {
  if (prefersReducedMotion.matches) return;

  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;

  // Only run while the hero is in the viewport — bail early once scrolled past.
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroBottom = hero!.offsetTop + hero!.offsetHeight;

    if (scrollY > heroBottom) {
      // Hero is fully scrolled past — stop updating.
      return;
    }

    // 0.28 = 28% parallax factor. Negative so the image moves up (slower than scroll).
    const offset = -(scrollY * 0.28);
    hero!.style.setProperty("--hero-parallax-y", `${offset}px`);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Clean up if reduced-motion preference changes mid-session.
  prefersReducedMotion.addEventListener("change", (e) => {
    if (e.matches) {
      window.removeEventListener("scroll", onScroll);
      hero!.style.removeProperty("--hero-parallax-y");
    }
  });
}

/* ── Section parallax ───────────────────────────────────────────
   Bounded vertical parallax for full-width photo bands. The media
   layer is over-scanned (15% taller than its frame in CSS), so the
   transform below never exposes an edge. Pure transform keeps it on
   the GPU; bails entirely under reduced-motion.
   ──────────────────────────────────────────────────────────── */
function initSectionParallax() {
  if (prefersReducedMotion.matches) return;

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax]")
  );
  if (sections.length === 0) return;

  // Travel as a fraction of section height. Must stay under the media
  // over-scan (15%) so edges never show; 12% leaves a safe margin.
  const TRAVEL = 0.12;
  let ticking = false;

  function update() {
    ticking = false;
    const viewportH = window.innerHeight;
    sections.forEach((section) => {
      const media = section.querySelector<HTMLElement>("[data-parallax-media]");
      if (!media) return;
      const rect = section.getBoundingClientRect();
      // Skip work when the band is well outside the viewport.
      if (rect.bottom < -200 || rect.top > viewportH + 200) return;
      const sectionCenter = rect.top + rect.height / 2;
      const range = viewportH / 2 + rect.height / 2;
      const progress = Math.max(-1, Math.min(1, (sectionCenter - viewportH / 2) / range));
      const offset = -progress * rect.height * TRAVEL;
      media.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  prefersReducedMotion.addEventListener("change", (e) => {
    if (e.matches) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      sections.forEach((section) =>
        section
          .querySelector<HTMLElement>("[data-parallax-media]")
          ?.style.removeProperty("--parallax-y")
      );
    }
  });
}

function initHomePageMotion() {
  initHomeReveal();
  initHeroParallax();
  initSectionParallax();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePageMotion, { once: true });
} else {
  window.requestAnimationFrame(initHomePageMotion);
}
