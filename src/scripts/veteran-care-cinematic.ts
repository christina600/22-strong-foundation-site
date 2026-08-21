/**
 * Veteran Care Cinematic Scroll Sequence
 * 
 * A cinematic scroll experience for the "Getting care shouldn't be another battle" section.
 * Beat 1: Image A (combat) fills viewport
 * Beat 2: Headline appears over Image A
 * Beat 3: Lateral wipe transition from Image A to Image B (paperwork/home)
 * Beat 4: Image B holds briefly
 * Beat 5: Unpin and scroll into white editorial section
 * 
 * Respects prefers-reduced-motion by showing a simplified static version.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function initCinematicSequence() {
  const section = document.querySelector("[data-cinematic-section]");
  if (!section) return;

  const pin = section.querySelector("[data-cinematic-pin]");
  const imageA = section.querySelector("[data-cinematic-image-a]");
  const imageB = section.querySelector("[data-cinematic-image-b]");
  const headline = section.querySelector("[data-cinematic-headline]");
  const overlay = section.querySelector("[data-cinematic-overlay]");

  if (!pin || !imageA || !imageB || !headline || !overlay) return;

  // If reduced motion, show simplified static version (final state)
  if (prefersReducedMotion.matches) {
    gsap.set(imageA, { opacity: 1 });
    gsap.set(imageB, { clipPath: "inset(0 0 0 0)", opacity: 1 });
    gsap.set(headline, { opacity: 1, y: 0 });
    gsap.set(overlay, { opacity: 0.45 });
    return;
  }

  // Initial state
  gsap.set(imageA, { opacity: 1, scale: 1.05 });
  gsap.set(imageB, { clipPath: "inset(0 100% 0 0)", opacity: 1 }); // Hidden off-screen right
  gsap.set(headline, { opacity: 0, y: 40 });
  gsap.set(overlay, { opacity: 0 });

  // Create timeline for the sequence
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=350%", // 3.5 viewport heights of scroll for proper timing
      pin: pin,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Beat 1: Image A settles in (subtle zoom settle)
  // 0%-15% of scroll
  tl.to(
    imageA,
    {
      scale: 1,
      duration: 0.15,
      ease: "power2.out",
    },
    0
  );

  // Beat 2: Overlay fades in for readability
  // 0%-20% of scroll (starts early so headline has good contrast)
  tl.to(
    overlay,
    {
      opacity: 0.65,
      duration: 0.2,
      ease: "power1.inOut",
    },
    0
  );

  // Beat 3: Headline fades up into place over Image A
  // 15%-32% of scroll
  tl.to(
    headline,
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    0.15 // Start at 15%
  );

  // Beat 4: Hold Image A + headline
  // 32%-45% of scroll
  tl.to({}, { duration: 0.13 }, 0.32); // Hold for 13% of scroll

  // Beat 5: Image B wipes in from right (lateral transition) - HEADLINE FADES OUT DURING THIS
  // 45%-72% of scroll
  tl.to(
    imageB,
    {
      clipPath: "inset(0 0 0 0)", // Wipe from right to left
      duration: 0.35,
      ease: "power2.inOut",
    },
    0.45 // Start at 45%
  );

  // Headline fades out during the Image B transition
  // Fade out headline during first part of Image B transition
  tl.to(
    headline,
    {
      opacity: 0,
      duration: 0.2,
      ease: "power1.inOut",
    },
    0.5 // Start fading headline at 50% scroll
  );

  // Beat 6: Adjust overlay for Image B (lighter for readability)
  // During Image B transition
  tl.to(
    overlay,
    {
      opacity: 0.45,
      duration: 0.2,
      ease: "power1.inOut",
    },
    0.55
  );

  // Beat 7: Hold Image B
  // 72%-90% of scroll
  tl.to({}, { duration: 0.18 }, 0.72); // Hold for 18% of scroll

  // Beat 8: Finish pinned sequence (unpin happens automatically at end)
  // 90%-100% of scroll - just a buffer to allow smooth unpinning
  tl.to({}, { duration: 0.1 }, 0.9);
}

// Mobile adaptation: simplified scroll with shorter pin
function initMobileCinematic() {
  const section = document.querySelector("[data-cinematic-section]");
  if (!section) return;

  const pin = section.querySelector("[data-cinematic-pin]");
  const imageA = section.querySelector("[data-cinematic-image-a]");
  const imageB = section.querySelector("[data-cinematic-image-b]");
  const headline = section.querySelector("[data-cinematic-headline]");
  const overlay = section.querySelector("[data-cinematic-overlay]");

  if (!pin || !imageA || !imageB || !headline || !overlay) return;

  // If reduced motion, show simplified static version (final state)
  if (prefersReducedMotion.matches) {
    gsap.set(imageA, { opacity: 1 });
    gsap.set(imageB, { clipPath: "inset(0 0 0 0)", opacity: 1 });
    gsap.set(headline, { opacity: 1, y: 0 });
    gsap.set(overlay, { opacity: 0.45 });
    return;
  }

  // Initial state
  gsap.set(imageA, { opacity: 1 });
  gsap.set(imageB, { clipPath: "inset(0 100% 0 0)", opacity: 1 }); // Hidden off-screen right
  gsap.set(headline, { opacity: 0, y: 20 });
  gsap.set(overlay, { opacity: 0 });

  // Shorter timeline for mobile
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=200%", // 2 viewport heights for mobile
      pin: pin,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Mobile sequence: faster beats
  // Beat 1: Overlay fades in
  tl.to(overlay, { opacity: 0.6, duration: 0.15, ease: "power1.inOut" }, 0);

  // Beat 2: Headline fades up
  tl.to(headline, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.1);

  // Beat 3: Hold Image A + headline
  tl.to({}, { duration: 0.1 }, 0.25);

  // Beat 4: Image B wipes in from right
  tl.to(
    imageB,
    {
      clipPath: "inset(0 0 0 0)",
      duration: 0.25,
      ease: "power2.inOut",
    },
    0.35
  );

  // Headline fades out during Image B transition
  tl.to(
    headline,
    {
      opacity: 0,
      duration: 0.15,
      ease: "power1.inOut",
    },
    0.4
  );

  // Adjust overlay for Image B
  tl.to(
    overlay,
    {
      opacity: 0.4,
      duration: 0.15,
      ease: "power1.inOut",
    },
    0.45
  );

  // Beat 5: Hold Image B
  tl.to({}, { duration: 0.1 }, 0.55);

  // Beat 6: Finish sequence
  tl.to({}, { duration: 0.05 }, 0.65);
}

// Initialize based on viewport
function init() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
   
  if (isMobile) {
    initMobileCinematic();
  } else {
    initCinematicSequence();
  }
}

// Wait for DOM and images
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Small delay to ensure images are loaded
    window.requestAnimationFrame(() => {
      window.setTimeout(init, 100);
    });
  });
} else {
  window.requestAnimationFrame(() => {
    window.setTimeout(init, 100);
  });
}

// Reinitialize on resize with debounce
let resizeTimeout: number;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// Clean up on reduced motion change
prefersReducedMotion.addEventListener?.("change", () => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  init();
});
