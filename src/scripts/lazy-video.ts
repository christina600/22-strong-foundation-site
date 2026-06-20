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

function buildVideo(trigger: HTMLElement) {
  const src = trigger.dataset.videoSrc;
  if (!src) return;

  const shell = trigger.closest<HTMLElement>("[data-lazy-video]");
  if (!shell) return;

  const video = document.createElement("video");
  video.className = "testimonial-video";
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.autoplay = true;
  video.tabIndex = -1;

  const poster = trigger.dataset.videoPoster;
  if (poster) video.poster = poster;

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  video.append(source);

  const fallback = document.createElement("a");
  fallback.href = src;
  fallback.textContent = "Watch Luke's testimonial";
  video.append(fallback);

  shell.replaceChildren(video);
  video.focus({ preventScroll: true });
  void video.play().catch(() => {
    // Autoplay can be blocked even after a click in some browsers; controls remain visible.
  });
}

function initLazyVideos() {
  if (lazyVideoListenerAttached) return;
  lazyVideoListenerAttached = true;

  document.addEventListener("click", (event) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const trigger = target.closest<HTMLElement>(TRIGGER_SELECTOR);
    if (!trigger) return;

    buildVideo(trigger);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLazyVideos, { once: true });
} else {
  initLazyVideos();
}
