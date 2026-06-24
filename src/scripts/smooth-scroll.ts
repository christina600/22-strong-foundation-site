import Lenis from 'lenis';

// Initialize smooth scroll
// Use documentElement as wrapper so Lenis does NOT restructure the DOM,
// which would break `position: sticky` on the header and anchor jumps.
const lenis = new Lenis({
  wrapper: document.documentElement,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
});

// Animation frame loop
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

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

// Export lenis for external control if needed
export { lenis };