/**
 * Lenis smooth scroll — matches the editorial inertia scroll feel of radiatinghope.org
 *
 * Uses window-wrapper mode (the default). In this mode Lenis intercepts wheel/touch
 * events and interpolates window.scrollTop each frame — it does NOT wrap content in
 * a translated div, so position: sticky and position: fixed on the header work fine.
 *
 * The global window.lenisInstance is exposed so site-navigation.ts can route
 * anchor-link clicks through Lenis instead of native window.scrollTo(), giving
 * every section jump the same buttery inertia feeling.
 *
 * Settings match radiatinghope.org:
 *   lerp: 0.085     — lower = more inertia / "heavier" feel
 *   syncTouch: false — keep native scroll on touch devices (matches radiatinghope.org)
 */

import Lenis from '@studio-freight/lenis';

declare global {
  interface Window {
    lenisInstance: Lenis | null;
  }
}

window.lenisInstance = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const lenis = new Lenis({
    lerp: 0.085,      // Inertia coefficient — matches radiatinghope.org editorial feel
    syncTouch: false, // Native scroll on touch (radiatinghope.org setting)
  });

  // Disable CSS scroll-behavior: smooth — Lenis is now the sole owner of scroll
  // animation. Without this, anchor clicks get double-smoothed (CSS + Lenis).
  document.documentElement.style.setProperty('scroll-behavior', 'auto');

  window.lenisInstance = lenis;

  // Drive the Lenis tick from the browser's native animation loop
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
