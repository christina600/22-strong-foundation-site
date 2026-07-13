const ROOT_SELECTOR = "[data-testimonial-video]";
const PLAY_SELECTOR = "[data-testimonial-play]";
const FOREGROUND_SELECTOR = "[data-testimonial-foreground]";
const BACKDROP_SELECTOR = "[data-testimonial-backdrop]";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

function canUseMovingBackdrop(root: HTMLElement) {
  const connection = (navigator as NavigatorWithConnection).connection;
  return root.dataset.motionBackdrop === "true"
    && window.matchMedia("(min-width: 760px)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && !connection?.saveData;
}

function syncBackdrop(foreground: HTMLVideoElement, backdrop: HTMLVideoElement) {
  if (!Number.isFinite(foreground.currentTime)) return;
  if (Math.abs(backdrop.currentTime - foreground.currentTime) > .2) {
    backdrop.currentTime = foreground.currentTime;
  }
}

function initTestimonial(root: HTMLElement) {
  if (root.dataset.testimonialReady === "true") return;
  root.dataset.testimonialReady = "true";

  const playButton = root.querySelector<HTMLButtonElement>(PLAY_SELECTOR);
  const foreground = root.querySelector<HTMLVideoElement>(FOREGROUND_SELECTOR);
  const backdrop = root.querySelector<HTMLVideoElement>(BACKDROP_SELECTOR);
  if (!playButton || !foreground) return;

  const useMovingBackdrop = Boolean(backdrop) && canUseMovingBackdrop(root);

  const startBackdrop = () => {
    if (!backdrop || !useMovingBackdrop) return;
    syncBackdrop(foreground, backdrop);
    backdrop.muted = true;
    root.classList.add("has-motion-backdrop");
    void backdrop.play().catch(() => {
      root.classList.remove("has-motion-backdrop");
    });
  };

  const pauseBackdrop = () => {
    backdrop?.pause();
  };

  playButton.addEventListener("click", () => {
    foreground.controls = true;
    root.classList.add("is-playing");
    playButton.hidden = true;
    foreground.focus({ preventScroll: true });
    // If browser policy or codec support blocks programmatic playback, keep
    // native controls exposed so the visitor can still start it directly.
    void foreground.play().catch(() => {});
  });

  foreground.addEventListener("play", startBackdrop);
  foreground.addEventListener("pause", pauseBackdrop);
  foreground.addEventListener("seeking", () => {
    if (backdrop && useMovingBackdrop) syncBackdrop(foreground, backdrop);
  });
  foreground.addEventListener("timeupdate", () => {
    if (backdrop && useMovingBackdrop) syncBackdrop(foreground, backdrop);
  });
  foreground.addEventListener("ended", () => {
    pauseBackdrop();
    if (backdrop) backdrop.currentTime = 0;
    foreground.controls = false;
    root.classList.remove("is-playing", "has-motion-backdrop");
    playButton.hidden = false;
    foreground.load();
  });
}

function initTestimonialVideos() {
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach(initTestimonial);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTestimonialVideos, { once: true });
} else {
  initTestimonialVideos();
}
