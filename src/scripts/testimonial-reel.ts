const REEL_SELECTOR = "[data-testimonial-reel]";
const TRACK_SELECTOR = "[data-testimonial-reel-track]";
const SLIDE_SELECTOR = "[data-testimonial-slide]";
const DOT_SELECTOR = "[data-testimonial-dot]";

function getActiveIndex(track: HTMLElement, slides: HTMLElement[]) {
  const trackLeft = track.scrollLeft;
  let activeIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const distance = Math.abs(slide.offsetLeft - track.offsetLeft - trackLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      activeIndex = index;
    }
  });

  return activeIndex;
}

// Gentle eased scroll — softer than the browser's default smooth. Snap is
// turned off mid-animation so the mandatory snap doesn't fight the per-frame
// scroll, then restored so it still rests cleanly on a slide.
function smoothScrollTo(track: HTMLElement, to: number, duration: number) {
  const start = track.scrollLeft;
  const change = to - start;
  if (Math.abs(change) < 1) return;
  track.style.scrollSnapType = "none";
  const startTime = performance.now();
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const step = (now: number) => {
    const p = Math.min(1, (now - startTime) / duration);
    track.scrollLeft = start + change * ease(p);
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      track.style.scrollSnapType = "";
    }
  };
  requestAnimationFrame(step);
}

function initTestimonialReels() {
  const reels = document.querySelectorAll<HTMLElement>(REEL_SELECTOR);
  if (!reels.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  reels.forEach((reel) => {
    const track = reel.querySelector<HTMLElement>(TRACK_SELECTOR);
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
    const dots = Array.from(reel.querySelectorAll<HTMLButtonElement>(DOT_SELECTOR));
    const previous = reel.querySelector<HTMLButtonElement>("[data-testimonial-prev]");
    const next = reel.querySelector<HTMLButtonElement>("[data-testimonial-next]");
    if (!slides.length) return;

    let activeIndex = 0;
    let frame = 0;

    const setActive = (index: number) => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      reel.dataset.activeSlide = String(activeIndex);

      previous?.toggleAttribute("disabled", activeIndex === 0);
      next?.toggleAttribute("disabled", activeIndex === slides.length - 1);

      dots.forEach((dot, dotIndex) => {
        if (dotIndex === activeIndex) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const goTo = (index: number) => {
      const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
      if (!target) return;

      const left = target.offsetLeft - track.offsetLeft;
      if (prefersReducedMotion) {
        track.scrollLeft = left;
      } else {
        smoothScrollTo(track, left, 850);
      }
      setActive(index);
    };

    previous?.addEventListener("click", () => goTo(activeIndex - 1));
    next?.addEventListener("click", () => goTo(activeIndex + 1));

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.slideIndex ?? 0);
        goTo(index);
      });
    });

    track.addEventListener("scroll", () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setActive(getActiveIndex(track, slides));
      });
    }, { passive: true });

    // Auto-advance once the testimonial video finishes; stop on any user input.
    let autoTimer = 0;
    const stopAuto = () => {
      if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = 0;
      }
    };
    const startAuto = () => {
      if (prefersReducedMotion) return;
      stopAuto();
      autoTimer = window.setInterval(() => {
        // Loop continuously: after the last testimonial, wrap back to the start.
        const nextIndex = activeIndex >= slides.length - 1 ? 0 : activeIndex + 1;
        goTo(nextIndex);
      }, 8000);
    };

    previous?.addEventListener("click", stopAuto);
    next?.addEventListener("click", stopAuto);
    dots.forEach((dot) => dot.addEventListener("click", stopAuto));
    track.addEventListener("pointerdown", stopAuto, { passive: true });
    track.addEventListener("wheel", stopAuto, { passive: true });
    track.addEventListener("keydown", stopAuto);

    reel.addEventListener("testimonial-video-ended", () => {
      goTo(Math.min(1, slides.length - 1));
      startAuto();
    });

    setActive(0);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTestimonialReels, { once: true });
} else {
  initTestimonialReels();
}
