/**
 * Micro-interactions for Phase 2 aesthetic upgrades.
 * Native implementation — no external dependencies.
 */

(() => {
  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Magnetic hover effect for CTA buttons.
   */
  const initMagneticButtons = (): void => {
    if (reducedMotion()) return;

    const buttons = document.querySelectorAll<HTMLElement>(
      '.pill.primary, .btn-donate, .strong-circle-trigger'
    );

    const RADIUS = 100;
    const PULL = 0.15;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const me = e as MouseEvent;
        const dx = me.clientX - cx;
        const dy = me.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const f = (1 - dist / RADIUS) * PULL;
          btn.style.transform = `translate(${dx * f}px, ${dy * f}px) scale(1.02)`;
          btn.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
          btn.style.transform = '';
          btn.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  };

  /**
   * Ripple effect on CTA buttons (Material Design pattern).
   */
  const initRippleEffect = (): void => {
    if (reducedMotion()) return;

    const buttons = document.querySelectorAll<HTMLElement>(
      '.pill, .btn-donate, .strong-circle-trigger, .amount-button, .testimonial-reel-button'
    );

    buttons.forEach((btn) => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';

      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 1.4;
        const me = e as MouseEvent;
        const x = me.clientX - r.left - size / 2;
        const y = me.clientY - r.top - size / 2;

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  };

  /**
   * Staggered entry animation for stats.
   */
  const initStaggeredStats = (): void => {
    if (reducedMotion()) return;

    const statElements = document.querySelectorAll<HTMLElement>(
      '[data-stat-stagger]'
    );

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(
              el.getAttribute('data-stat-stagger') || '0',
              10
            );
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition =
        'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      el.setAttribute('data-stat-stagger', String(index * 150));
      obs.observe(el);
    });
  };

  /**
   * Image blur-to-sharp loader.
   */
  const initBlurLoaders = (): void => {
    if (reducedMotion()) return;

    const images = document.querySelectorAll<HTMLImageElement>(
      '[data-blur-load]'
    );

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.complete) {
              img.style.filter = 'none';
            } else {
              img.addEventListener('load', () => {
                img.style.filter = 'none';
              });
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    images.forEach((img) => {
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.6s ease-out';
      obs.observe(img);
    });
  };

  /**
   * Progress ring animation for stats.
   */
  const initProgressRings = (): void => {
    if (reducedMotion()) return;

    const rings = document.querySelectorAll<SVGElement>('[data-progress-ring]');

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const svg = entry.target as SVGElement;
            const circle = svg.querySelector('circle') as SVGCircleElement;
            if (!circle) return;
            const progress = parseInt(
              svg.getAttribute('data-progress-ring') || '0',
              10
            );
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (progress / 100) * circumference;

            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${offset}`;
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    rings.forEach((svg) => obs.observe(svg));
  };

  // Initialize all micro-interactions when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMagneticButtons();
      initRippleEffect();
      initStaggeredStats();
      initBlurLoaders();
      initProgressRings();
    });
  } else {
    initMagneticButtons();
    initRippleEffect();
    initStaggeredStats();
    initBlurLoaders();
    initProgressRings();
  }
})();