/**
 * Lazy testimonial video loader.
 *
 * Keeps the large MP4 out of the active media element until a visitor chooses
 * to play it. This preserves the inline testimonial while avoiding eager video
 * work during initial page load.
 */

import { getEventElement } from "./dom-target";

let lazyVideoListenerAttached = false;

const TRIGGER_SELECTOR = "[data-lazy-video-trigger]";
const SHELL_SELECTOR = "[data-lazy-video]";
const AUTOPLAY_SELECTOR = "[data-lazy-video-autoplay]";
const TESTIMONIAL_REEL_SELECTOR = "[data-testimonial-reel]";

type BuildVideoOptions = {
  focus?: boolean;
  muted?: boolean;
};

function buildVideo(trigger: HTMLElement, options: BuildVideoOptions = {}) {
  const src = trigger.dataset.videoSrc;
  if (!src) return null;

  const shell = trigger.closest<HTMLElement>(SHELL_SELECTOR);
  if (!shell) return null;

  const video = document.createElement("video");
  video.className = "testimonial-video";
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.autoplay = true;
  video.muted = Boolean(options.muted);
  video.tabIndex = -1;

  const poster = trigger.dataset.videoPoster;
  if (poster) video.poster = poster;

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  video.append(source);

  const fallback = document.createElement("a");
  fallback.href = src;
  // Use the trigger's aria-label for the fallback text, stripping the leading "Play ".
  const triggerLabel = trigger.getAttribute("aria-label") || "";
  fallback.textContent = triggerLabel.replace(/^Play\s+/i, "Watch ") || "Watch testimonial";
  video.append(fallback);

  shell.replaceChildren(video);
  video.addEventListener("ended", () => {
    const reel = video.closest<HTMLElement>(TESTIMONIAL_REEL_SELECTOR);
    if (!reel) return;

    reel.classList.add("is-video-complete");
    reel.dispatchEvent(new CustomEvent("testimonial-video-ended", { bubbles: true }));
  }, { once: true });

  if (options.focus) video.focus({ preventScroll: true });
  void video.play().catch(() => {
    // Autoplay can still be blocked in some browsers; controls remain visible.
  });

  return video;
}

function initViewportAutoplay() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const autoplayShells = document.querySelectorAll<HTMLElement>(AUTOPLAY_SELECTOR);
  if (!autoplayShells.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < .45) return;

        const shell = entry.target as HTMLElement;
        observer.unobserve(shell);

        const trigger = shell.querySelector<HTMLElement>(TRIGGER_SELECTOR);
        if (!trigger) return;

        buildVideo(trigger, { muted: true });
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: [.45, .6]
    }
  );

  autoplayShells.forEach((shell) => observer.observe(shell));
}

function initLazyVideos() {
  if (lazyVideoListenerAttached) return;
  lazyVideoListenerAttached = true;

  document.addEventListener("click", (event) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const trigger = target.closest<HTMLElement>(TRIGGER_SELECTOR);
    if (!trigger) return;

    buildVideo(trigger, { focus: true });
  });

  initViewportAutoplay();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLazyVideos, { once: true });
} else {
  initLazyVideos();
}
