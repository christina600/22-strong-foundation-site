/**
 * Smooth scroll + staggered reveal timing.
 *
 * Uses native CSS `scroll-behavior: smooth` (set in home-base.css) instead of
 * a transform-based smooth-scroll library. Transform wrappers create a new CSS
 * containing block, which breaks `position: sticky` and `position: fixed` on the
 * header and nav — they would scroll with the page instead of staying pinned.
 */

/**
 * Staggered reveal timing for section content
 * Creates a cascading reveal effect within sections for better pacing.
 * The delay is consumed by the `[style*="--stagger-delay"]` rule in
 * home-radiatinghope-extras.css.
 */
function initStaggeredReveals() {
  const staggerGroups = document.querySelectorAll<HTMLElement>(
    '.audience-copy, .about-intro, .donate-wrap > div:first-child, .circle-intro'
  );

  staggerGroups.forEach((group) => {
    const children = group.querySelectorAll<HTMLElement>('[data-reveal]');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', String(index));
      child.style.setProperty('--stagger-delay', `${index * 80}ms`);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStaggeredReveals, { once: true });
} else {
  initStaggeredReveals();
}
