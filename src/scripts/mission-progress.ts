/**
 * Mission progress rail.
 *
 * Gives the single-page story a visible chapter spine and updates the active
 * section as visitors scroll. Kept separate from navigation so the ordinary
 * anchor behavior remains simple.
 */

import { getHeaderOffset, MISSION_RAIL_SELECTOR } from "./layout-metrics";

const STORY_LINK_SELECTOR = "[data-story-link]";
const STORY_SECTION_SELECTOR = "[data-story-section]";
const STORY_BEAT_SELECTOR = "[data-story-beat]";
const ACTIVE_CLASS = "is-story-active";
const ACTIVE_BEAT_CLASS = "is-story-beat-active";

let missionProgressAttached = false;
let progressQueued = false;

function getTargetFromLink(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") || "";
  if (!href.startsWith("#")) return null;
  return document.getElementById(href.slice(1));
}

function setStoryProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  document.documentElement.style.setProperty("--story-progress", progress.toFixed(4));
}

function setActiveStory() {
  const rail = document.querySelector<HTMLElement>(MISSION_RAIL_SELECTOR);
  if (!rail) return;

  const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>(STORY_LINK_SELECTOR));
  const sections = Array.from(document.querySelectorAll<HTMLElement>(STORY_SECTION_SELECTOR));
  const threshold = getHeaderOffset() + Math.min(240, window.innerHeight * 0.30);

  let activeId = links[0]?.hash.slice(1) || "top";
  links.forEach((link) => {
    const target = getTargetFromLink(link);
    if (!target) return;
    if (target.getBoundingClientRect().top <= threshold) {
      activeId = target.id;
    }
  });

  links.forEach((link) => {
    const isActive = link.hash === `#${activeId}`;
    link.classList.toggle(ACTIVE_CLASS, isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  sections.forEach((section) => {
    section.classList.toggle(ACTIVE_CLASS, section.id === activeId);
  });
}

function setActiveStoryBeat() {
  const beats = Array.from(document.querySelectorAll<HTMLElement>(STORY_BEAT_SELECTOR));
  if (!beats.length) return;

  const threshold = getHeaderOffset() + Math.min(340, window.innerHeight * 0.48);
  let activeBeat = beats[0];

  beats.forEach((beat) => {
    if (beat.getBoundingClientRect().top <= threshold) {
      activeBeat = beat;
    }
  });

  beats.forEach((beat) => {
    beat.classList.toggle(ACTIVE_BEAT_CLASS, beat === activeBeat);
  });
}

function updateMissionProgress() {
  progressQueued = false;
  setStoryProgress();
  setActiveStory();
  setActiveStoryBeat();
}

function queueMissionProgress() {
  if (progressQueued) return;
  progressQueued = true;
  window.requestAnimationFrame(updateMissionProgress);
}

function initMissionProgress() {
  if (missionProgressAttached || !document.querySelector(MISSION_RAIL_SELECTOR)) return;
  missionProgressAttached = true;

  window.addEventListener("scroll", queueMissionProgress, { passive: true });
  window.addEventListener("resize", queueMissionProgress);
  window.addEventListener("hashchange", queueMissionProgress);
  window.addEventListener("load", queueMissionProgress, { once: true });
  queueMissionProgress();
  window.setTimeout(queueMissionProgress, 300);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMissionProgress, { once: true });
} else {
  initMissionProgress();
}
