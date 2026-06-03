/**
 * Same-page navigation behavior.
 *
 * Keeps anchor jumps aligned below the sticky header and marks the active
 * section in the nav. This also avoids deep links landing too low after the
 * page has skipped ahead through image-heavy sections.
 */

const ACTIVE_CLASS = "is-active";
const ANCHOR_SELECTOR = 'a[href^="#"]';
const TRACKED_SECTIONS = [
  "top",
  "how-it-works",
  "strong-circle",
  "serve",
  "serve-veterans",
  "serve-athletes",
  "serve-cancer",
  "serve-others",
  "leadership",
  "featured",
  "donate",
  "contact"
];

let navListenerAttached = false;
let activeUpdateQueued = false;

function getVisibleMissionRailHeight() {
  const rail = document.querySelector<HTMLElement>("[data-mission-rail]");
  if (!rail || window.getComputedStyle(rail).display === "none") return 0;
  return Math.ceil(rail.getBoundingClientRect().height || 0);
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  return Math.ceil(header?.getBoundingClientRect().height || 0) + getVisibleMissionRailHeight() + 10;
}

function getHashTarget(hash: string) {
  if (!hash.startsWith("#") || hash.length < 2) return null;

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return document.getElementById(hash.slice(1));
  }
}

function revealTargetArea(target: Element) {
  if (target.matches("[data-reveal]")) target.classList.add("is-visible");
  target.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
}

function normaliseActiveHash(hash: string) {
  return hash.startsWith("#serve-") ? "#serve" : hash;
}

function linkMatchesActiveHash(linkHash: string, activeHash: string) {
  const normalisedLinkHash = normaliseActiveHash(linkHash);
  return normalisedLinkHash === activeHash;
}

function updateActiveLinks(hash: string) {
  const activeHash = normaliseActiveHash(hash || "#top");

  document.querySelectorAll<HTMLAnchorElement>(ANCHOR_SELECTOR).forEach((link) => {
    if (link.matches("[data-story-link]")) return;

    const linkHash = link.getAttribute("href") || "";
    const isActive = linkMatchesActiveHash(linkHash, activeHash);

    link.classList.toggle(ACTIVE_CLASS, isActive);
    if (link.closest("nav") && isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getScrollTopForTarget(target: HTMLElement) {
  if (target.id === "top") return 0;
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset());
}

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const target = getHashTarget(hash);
  if (!target) return false;

  revealTargetArea(target);
  window.scrollTo({
    top: getScrollTopForTarget(target),
    behavior
  });
  updateActiveLinks(hash);
  return true;
}

function queueActiveUpdate() {
  if (activeUpdateQueued) return;
  activeUpdateQueued = true;

  window.requestAnimationFrame(() => {
    activeUpdateQueued = false;

    let activeHash = "#top";
    const offset = getHeaderOffset() + 8;
    const activeThreshold = offset + Math.min(260, window.innerHeight * 0.36);
    const hashTarget = window.location.hash ? getHashTarget(window.location.hash) : null;

    if (hashTarget) {
      const hashRect = hashTarget.getBoundingClientRect();
      if (hashRect.top >= 0 && hashRect.top <= activeThreshold) {
        activeHash = window.location.hash;
      }
    }

    if (activeHash === "#top") {
      for (const sectionId of TRACKED_SECTIONS) {
        const section = document.getElementById(sectionId);
        if (!section) continue;

        if (section.getBoundingClientRect().top <= activeThreshold) {
          activeHash = `#${sectionId}`;
        }
      }
    }

    updateActiveLinks(activeHash);
  });
}

function handleAnchorClick(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(ANCHOR_SELECTOR);
  const hash = link?.getAttribute("href");
  if (!hash || !getHashTarget(hash)) return;

  event.preventDefault();
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }
  scrollToHash(hash);
}

function syncHashNavigation(behavior: ScrollBehavior = "auto") {
  if (window.location.hash && getHashTarget(window.location.hash)) {
    scrollToHash(window.location.hash, behavior);
    return;
  }

  if (!window.location.hash) {
    window.scrollTo({ top: 0, behavior });
    updateActiveLinks("#top");
  }
}

function initNavigation() {
  if (navListenerAttached) return;
  navListenerAttached = true;

  document.addEventListener("click", handleAnchorClick);
  window.addEventListener("scroll", queueActiveUpdate, { passive: true });
  window.addEventListener("resize", queueActiveUpdate);
  window.addEventListener("hashchange", () => syncHashNavigation("auto"));
  window.addEventListener("popstate", () => syncHashNavigation("auto"));
  window.addEventListener("load", () => syncHashNavigation("auto"), { once: true });

  if (window.location.hash) {
    window.requestAnimationFrame(() => syncHashNavigation("auto"));
    window.setTimeout(() => syncHashNavigation("auto"), 220);
    window.setTimeout(() => syncHashNavigation("auto"), 900);
  } else {
    updateActiveLinks("#top");
  }
  queueActiveUpdate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavigation, { once: true });
} else {
  initNavigation();
}
