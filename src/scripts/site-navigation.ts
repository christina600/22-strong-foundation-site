/**
 * Same-page navigation behavior.
 *
 * Keeps anchor jumps aligned below the sticky header and marks the active
 * section in the nav. This also avoids deep links landing too low after the
 * page has skipped ahead through image-heavy sections.
 */

import { getEventElement } from "./dom-target";
import { getHeaderOffset } from "./layout-metrics";

const ACTIVE_CLASS = "is-active";
const ANCHOR_SELECTOR = 'a[href^="#"]';
const ACTIVE_LINK_SELECTOR = 'header nav a[href^="#"], footer .links a[href^="#"]';
const HASH_SYNC_DELAYS = [220, 900];
const TRACKED_SECTIONS = [
  "top",
  "about",
  "story",
  "serve",
  "serve-veterans",
  "veteran-voices",
  "serve-athletes",
  "how-it-works",
  "featured",
  "leadership",
  "strong-circle",
  "donate",
  "contact"
];

let navListenerAttached = false;
let activeUpdateQueued = false;

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
  if (hash === "#story") return "#about";
  return hash.startsWith("#serve-") ? "#serve" : hash;
}

function linkMatchesActiveHash(linkHash: string, activeHash: string) {
  const normalisedLinkHash = normaliseActiveHash(linkHash);
  return normalisedLinkHash === activeHash;
}

function updateActiveLinks(hash: string) {
  const activeHash = normaliseActiveHash(hash || "#top");

  document.querySelectorAll<HTMLAnchorElement>(ACTIVE_LINK_SELECTOR).forEach((link) => {
    if (link.classList.contains("brand")) return;

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

  const target = getEventElement(event.target);
  if (!target) return;

  const link = target.closest<HTMLAnchorElement>(ANCHOR_SELECTOR);
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

function initMobileNav() {
  const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  const navLinks = document.querySelector<HTMLElement>(".nav-links");
  
  if (!toggle || !navLinks) return;

  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let scrollPosition = 0;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    // Restore scroll position
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
      scrollPosition = 0;
    }
  };

  const openMenu = () => {
    // Save current scroll position
    scrollPosition = window.scrollY;
    toggle.setAttribute("aria-expanded", "true");
    navLinks.classList.add("is-open");
    document.body.classList.add("nav-open");
    
    // Focus first link after animation
    setTimeout(() => {
      const firstLink = navLinks.querySelector<HTMLAnchorElement>("a");
      if (firstLink) firstLink.focus();
    }, 100);
  };

  const toggleMenu = () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      toggle.focus();
    } else {
      openMenu();
    }
  };

  toggle.addEventListener("click", toggleMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("is-open")) return;
    const target = e.target as Element;
    if (!navLinks.contains(target) && !toggle.contains(target)) {
      closeMenu();
    }
  });

  // Close menu on scroll (with debounce)
  let scrollTimeout: number;
  window.addEventListener("scroll", () => {
    if (!navLinks.classList.contains("is-open")) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      closeMenu();
    }, 150);
  }, { passive: true });

  // Close menu on window resize (orientation change)
  window.addEventListener("resize", () => {
    if (navLinks.classList.contains("is-open")) {
      closeMenu();
    }
  });

  // Focus trap: keep focus within menu when open
  navLinks.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !navLinks.classList.contains("is-open")) return;

    const focusableElements = navLinks.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on first element, wrap to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

function updateScrollState() {
  const header = document.querySelector<HTMLElement>("header");
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 60);
}

function updateReadingProgress() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollTotal <= 0) return;
  const progress = Math.min(1, window.scrollY / scrollTotal);
  document.documentElement.style.setProperty("--nav-progress", progress.toFixed(4));
}

function initNavigation() {
  if (navListenerAttached) return;
  navListenerAttached = true;

  document.addEventListener("click", handleAnchorClick);
  window.addEventListener("scroll", queueActiveUpdate, { passive: true });
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", queueActiveUpdate);
  window.addEventListener("resize", updateReadingProgress);
  window.addEventListener("hashchange", () => syncHashNavigation("auto"));
  window.addEventListener("popstate", () => syncHashNavigation("auto"));
  window.addEventListener("load", () => syncHashNavigation("auto"), { once: true });

  if (window.location.hash) {
    window.requestAnimationFrame(() => syncHashNavigation("auto"));
    HASH_SYNC_DELAYS.forEach((delay) => {
      window.setTimeout(() => syncHashNavigation("auto"), delay);
    });
  } else {
    updateActiveLinks("#top");
  }
  queueActiveUpdate();

  // Set initial scroll state and reading progress on load
  updateScrollState();
  updateReadingProgress();

  // Initialize mobile nav toggle
  initMobileNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavigation, { once: true });
} else {
  initNavigation();
}
