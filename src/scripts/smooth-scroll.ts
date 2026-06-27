/**
 * Smooth scroll + scroll-triggered animations.
 *
 * Uses native CSS `scroll-behavior: smooth` (set in home-base.css) instead of
 * a transform-based smooth-scroll library. Transform wrappers (e.g. Lenis)
 * create a new CSS containing block, which breaks `position: sticky` and
 * `position: fixed` on the header and nav — they would scroll with the page
 * instead of staying pinned.
 *
 * The IntersectionObservers below handle scroll reveal and stat counters.
 * Enhanced pacing uses CSS scroll-snap and staggered reveal timing to
 * create a more deliberate, "paced" scroll feel similar to editorial sites.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Scroll reveal animations with staggered timing for pacing feel
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px', // Slightly earlier trigger for smoother feel
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-scroll-reveal
document.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
  revealObserver.observe(el);
});

/**
 * Enhanced animated stat counters
 * Supports: 
 * - data-count (legacy simple number)
 * - data-counter-target (new: numeric value)
 * - data-counter-prefix (new: $, £, etc.)
 * - data-counter-suffix (new: %, million, k, etc.)
 */
const animateCounter = (element: HTMLElement) => {
  // Check for new data attributes first
  const targetStr = element.getAttribute('data-counter-target') || element.getAttribute('data-count') || '0';
  const target = parseFloat(targetStr);
  const prefix = element.getAttribute('data-counter-prefix') || '';
  const suffix = element.getAttribute('data-counter-suffix') || '';

  // If it's a simple number with no prefix/suffix, use legacy animation
  if (!prefix && !suffix && element.hasAttribute('data-count')) {
    animateLegacyCounter(element, parseInt(targetStr));
    return;
  }
  
  // Determine if we have decimals
  const hasDecimal = targetStr.includes('.');
  const decimalPlaces = hasDecimal ? (targetStr.split('.')[1]?.length || 0) : 0;
  
  const duration = prefersReducedMotion.matches ? 500 : 2200; // Slightly longer for dramatic effect
  const start = performance.now();
  
  const update = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic with slight overshoot feel)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = easeOut * target;
    
    // Format the display value
    let displayValue: string;
    if (hasDecimal) {
      displayValue = current.toFixed(decimalPlaces);
    } else {
      displayValue = Math.floor(current).toLocaleString();
    }
    
    // Combine prefix, value, suffix
    element.textContent = `${prefix}${displayValue}${suffix ? ' ' + suffix : ''}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure final value is exact
      if (hasDecimal) {
        element.textContent = `${prefix}${target.toFixed(decimalPlaces)}${suffix ? ' ' + suffix : ''}`;
      } else {
        element.textContent = `${prefix}${target.toLocaleString()}${suffix ? ' ' + suffix : ''}`;
      }
    }
  };
  
  requestAnimationFrame(update);
};

// Legacy counter animation for simple numbers
const animateLegacyCounter = (element: HTMLElement, target: number) => {
  const duration = prefersReducedMotion.matches ? 500 : 2000;
  const start = performance.now();
  
  const update = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  };
  
  requestAnimationFrame(update);
};

// Observe stat counters (both legacy data-count and new data-counter)
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target as HTMLElement);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 }); // Slightly earlier threshold for better UX

// Observe elements with counter data attributes
document.querySelectorAll('[data-count], [data-counter]').forEach((el) => {
  statObserver.observe(el);
});

/**
 * Progressive pacing enhancement
 * Adds subtle scroll-snap behavior to major sections to create
 * a more deliberate reading rhythm without breaking native scroll.
 */
function initScrollPacing() {
  // Only apply on larger screens where scroll-snap makes sense
  if (window.innerWidth < 920 || prefersReducedMotion.matches) return;
  
  // Add data attributes to sections for CSS scroll-snap targeting
  const sections = document.querySelectorAll<HTMLElement>(
    'main > section, main > .story-serve-intro, main > .audience-voices--combined'
  );
  
  sections.forEach((section, index) => {
    // Mark sections for potential scroll-snap behavior
    section.dataset.scrollSection = String(index);
  });
}

/**
 * Staggered reveal timing for section content
 * Creates a cascading reveal effect within sections for better pacing
 */
function initStaggeredReveals() {
  const staggerGroups = document.querySelectorAll<HTMLElement>(
    '.audience-copy, .about-intro, .donate-wrap > div:first-child, .circle-intro'
  );
  
  staggerGroups.forEach((group) => {
    const children = group.querySelectorAll<HTMLElement>('[data-reveal]');
    children.forEach((child, index) => {
      // Add stagger delay via CSS custom property
      child.style.setProperty('--stagger-index', String(index));
      child.style.setProperty('--stagger-delay', `${index * 80}ms`);
    });
  });
}

// Initialize enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollPacing();
    initStaggeredReveals();
  }, { once: true });
} else {
  initScrollPacing();
  initStaggeredReveals();
}

