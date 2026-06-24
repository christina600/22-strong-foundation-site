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
 */

// Scroll reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-scroll-reveal
document.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
  observer.observe(el);
});

// Animated stat counters
const animateCounter = (element: HTMLElement) => {
  const target = parseInt(element.getAttribute('data-count') || '0');
  const duration = 2000; // 2 seconds
  const start = performance.now();
  
  const update = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
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

// Observe stat counters
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target as HTMLElement);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach((el) => {
  statObserver.observe(el);
});

