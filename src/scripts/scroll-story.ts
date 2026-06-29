/**
 * Phase 3: Scroll-Driven Storytelling.
 *
 * Three subsystems:
 * 1. Horizontal scroll — pins "How It Works" while scrolling through steps
 * 2. Text reveal — splits headings into words for staggered fade-up
 * 3. Background transitions — gradient shifts, grain overlay, geometric morphs
 *
 * All animations respect `prefers-reduced-motion: reduce`.
 * Uses IntersectionObserver + requestAnimationFrame where possible.
 * Zero external dependencies.
 */

(() => {
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── 1. Horizontal Scroll ───

  function setHeaderHeightVar() {
    // The site header is a <header> element directly (no .site-header class)
    const header = document.querySelector<HTMLElement>("header") || 
                   document.querySelector<HTMLElement>(".site-header");
    if (header) {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      );
    }
  }

  function initHorizontalScroll() {
    const outer = document.querySelector<HTMLElement>(".horiz-scroll-outer");
    if (!outer) return;

    const track = outer.querySelector<HTMLElement>(".horiz-scroll-track");
    const spacer = outer.querySelector<HTMLElement>(".horiz-scroll-spacer");
    const dots = outer.querySelectorAll<HTMLDivElement>(".horiz-dot");
    const steps = outer.querySelectorAll<HTMLDivElement>(".horiz-step");

    if (!track || !spacer || steps.length === 0) return;

    // Set dynamic scroll distance based on step count
    // Each step needs approximately 1 viewport width of scroll distance
    const stepCount = steps.length;
    document.documentElement.style.setProperty(
      "--horiz-scroll-distance",
      `calc(${stepCount} * 100vh)`
    );

    // Set header height CSS custom property
    setHeaderHeightVar();

    // On mobile/tablet, the CSS handles horizontal swipe natively
    if (window.innerWidth <= 920) return;

    let ticking = false;
    let currentStep = 0;

    const updateDots = (activeIndex: number) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
        dot.classList.toggle("is-visited", i < activeIndex);
      });
    };

    const updateStepHighlight = (activeIndex: number) => {
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === activeIndex);
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const outerRect = outer.getBoundingClientRect();
        const outerTop = outerRect.top;
        const spacerHeight = spacer.offsetHeight;
        const trackWidth = track.scrollWidth;
        const viewWidth = window.innerWidth;

        // How far we've scrolled into the horizontal section (0 → 1)
        const scrollProgress = Math.max(0, Math.min(1,
          -outerTop / (spacerHeight - window.innerHeight)
        ));

        // How far the track needs to move horizontally
        const maxTranslate = trackWidth - viewWidth + 48; // 48px padding buffer
        const translateX = scrollProgress * maxTranslate;

        track.style.transform = `translateX(-${translateX}px)`;

        // Determine which step is most visible
        const stepCount = steps.length;
        const newStep = Math.min(stepCount - 1, Math.floor(scrollProgress * stepCount));

        if (newStep !== currentStep) {
          currentStep = newStep;
          updateDots(currentStep);
          updateStepHighlight(currentStep);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial state
    updateDots(0);
    updateStepHighlight(0);
    onScroll();

    // Announce for screen readers
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);";
    outer.appendChild(liveRegion);

    const announceStep = (index: number) => {
      const step = steps[index];
      const heading = step?.querySelector("h3");
      if (heading) {
        liveRegion.textContent = `Step ${index + 1} of ${steps.length}: ${heading.textContent}`;
      }
    };

    const dotObserver = new MutationObserver(() => {
      const activeDot = outer.querySelector(".horiz-dot.is-active");
      if (activeDot) {
        const index = Array.from(dots).indexOf(activeDot as HTMLDivElement);
        announceStep(index);
      }
    });

    dots.forEach((dot) => {
      dotObserver.observe(dot, { attributes: true, attributeFilter: ["class"] });
    });
  }

  // ─── 2. Text Reveal — Split-Word Animation ───

  function initTextReveal() {
    const elements = document.querySelectorAll<HTMLElement>("[data-split-reveal]");

    elements.forEach((el) => {
      const text = el.textContent || "";
      const words = text.split(/\s+/).filter(Boolean);

      el.innerHTML = words
        .map((word) => `<span class="split-word" aria-hidden="true">${word}</span>`)
        .join(" ");

      // Keep original text for screen readers
      el.setAttribute("aria-label", text);
      el.setAttribute("role", "text");
    });

    if (prefersReducedMotion()) {
      // Show all words immediately
      document.querySelectorAll(".split-word").forEach((w) => {
        w.classList.add("is-visible");
      });
      return;
    }

    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll(".split-word");
          words.forEach((word) => word.classList.add("is-visible"));
          wordObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -60px 0px" });

    elements.forEach((el) => wordObserver.observe(el));
  }

  // ─── 3. Scroll-Linked Text Size Changes ───

  function initTextGrow() {
    if (prefersReducedMotion()) return;

    const growElements = document.querySelectorAll<HTMLElement>("[data-text-grow]");

    const growObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-scrolled-past", !entry.isIntersecting);
      });
    }, { threshold: 0.5, rootMargin: "0px 0px -30% 0px" });

    growElements.forEach((el) => growObserver.observe(el));
  }

  // ─── 4. Color Transitions on Scroll ───

  function initColorTransitions() {
    if (prefersReducedMotion()) return;

    const colorElements = document.querySelectorAll<HTMLElement>("[data-color-shift]");

    const colorObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        const midpoint = window.innerHeight / 2;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;

        if (elCenter < midpoint) {
          el.setAttribute("data-color-state", "orange");
        } else {
          el.setAttribute("data-color-state", "teal");
        }
      });
    }, { threshold: Array.from({ length: 10 }, (_, i) => i / 9) });

    colorElements.forEach((el) => {
      el.setAttribute("data-color-state", "teal");
      colorObserver.observe(el);
    });
  }

  // ─── 5. Background Gradient Shifts ───

  function initBackgroundShifts() {
    const shiftSections = document.querySelectorAll<HTMLElement>("[data-bg-shift]");

    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      });
    }, { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" });

    shiftSections.forEach((el) => {
      el.classList.add("section-bg-shift");
      bgObserver.observe(el);
    });
  }

  // ─── 6. Mobile Horizontal Scroll Observer ───
  // For tablets, sync dots with native scroll-snap

  function initMobileHorizScroll() {
    const outer = document.querySelector<HTMLElement>(".horiz-scroll-outer");
    if (!outer) return;

    if (window.innerWidth > 920) return;

    const trackWrap = outer.querySelector<HTMLElement>(".horiz-scroll-track-wrap");
    const steps = outer.querySelectorAll<HTMLDivElement>(".horiz-step");
    const dots = outer.querySelectorAll<HTMLDivElement>(".horiz-dot");

    if (!trackWrap || steps.length === 0) return;

    let mobileTicking = false;

    const updateMobileDots = () => {
      if (mobileTicking) return;
      mobileTicking = true;

      requestAnimationFrame(() => {
        const wrapRect = trackWrap.getBoundingClientRect();
        const wrapCenter = wrapRect.left + wrapRect.width / 2;

        let closestIndex = 0;
        let closestDist = Infinity;

        steps.forEach((step, i) => {
          const stepRect = step.getBoundingClientRect();
          const stepCenter = stepRect.left + stepRect.width / 2;
          const dist = Math.abs(stepCenter - wrapCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle("is-active", i === closestIndex);
          dot.classList.toggle("is-visited", i < closestIndex);
        });

        steps.forEach((step, i) => {
          step.classList.toggle("is-active", i === closestIndex);
        });

        mobileTicking = false;
      });
    };

    trackWrap.addEventListener("scroll", updateMobileDots, { passive: true });
    updateMobileDots();
  }

  // ─── Initialize ───

  function init() {
    initTextReveal();
    initTextGrow();
    initColorTransitions();
    initBackgroundShifts();

    // Horizontal scroll — desktop or mobile
    if (window.innerWidth > 920) {
      initHorizontalScroll();
    } else {
      initMobileHorizScroll();
    }
  }

  // Run after DOM is interactive
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();