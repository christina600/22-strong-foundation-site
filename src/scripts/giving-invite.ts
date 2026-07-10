/**
 * 22STRONG Circle giving invite.
 *
 * A restrained, non-blocking corner card that invites monthly giving after the
 * visitor has met the mission — when the testimonial video ends, or when they
 * scroll past the testimonials. Shows once per session, respects reduced
 * motion, and never traps the screen. "Join" opens the support page;
 * "Give once" presets the donation widget to one-time.
 */

import { DONATION_PRESET_EVENT } from "./events";

const INVITE_SELECTOR = "[data-giving-invite]";
const STORAGE_KEY = "givingInviteSeen";
const VISIBLE_CLASS = "is-visible";
const DONATION_HASHES = new Set(["#donate"]);
const SUPPORT_PATHS = new Set(["/ways-to-support/", "/strong-circle/"]);

function isGivingFlowLocation() {
  const pathname = window.location.pathname.endsWith("/")
    ? window.location.pathname
    : `${window.location.pathname}/`;
  return DONATION_HASHES.has(window.location.hash) || SUPPORT_PATHS.has(pathname);
}

function initGivingInvite() {
  const invite = document.querySelector<HTMLElement>(INVITE_SELECTOR);
  if (!invite) return;
  if (isGivingFlowLocation()) return;

  let seen: boolean;
  try {
    seen = sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    seen = false;
  }
  if (seen) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let shown = false;
  let observer: IntersectionObserver | null = null;

  const show = () => {
    if (shown) return;
    if (isGivingFlowLocation()) return;
    shown = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Private mode — fail open, still show once this load.
    }
    invite.hidden = false;
    requestAnimationFrame(() => invite.classList.add(VISIBLE_CLASS));
    observer?.disconnect();
  };

  const hide = () => {
    invite.classList.remove(VISIBLE_CLASS);
    window.setTimeout(() => {
      invite.hidden = true;
    }, reduceMotion ? 0 : 300);
    observer?.disconnect();
  };

  // Trigger 1: the testimonial video finishes (best emotional timing).
  document.addEventListener("testimonial-video-ended", show, { once: true });

  // Trigger 2: the visitor scrolls past the point where they've met the
  // mission. Preferred anchor is the testimonials section; fall back to the
  // impact stats, then How It Works, so a section rename can't silently
  // leave the invite with no trigger again.
  const section = ["veteran-voices", "impact", "how-it-works"]
    .map((id) => document.getElementById(id))
    .find(Boolean);
  if (section && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) show();
        }
      },
      { threshold: 0 },
    );
    observer.observe(section);
  }

  invite.querySelectorAll<HTMLElement>("[data-giving-invite-dismiss]").forEach((el) => {
    el.addEventListener("click", hide);
  });
  invite.querySelectorAll<HTMLElement>("[data-giving-invite-join], [data-giving-invite-once]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.hasAttribute("data-giving-invite-join")) {
        hide();
        return;
      }

      const preset = { frequency: "one-time" };
      document.dispatchEvent(new CustomEvent(DONATION_PRESET_EVENT, { detail: preset }));
      hide();
    });
  });
  window.addEventListener("hashchange", () => {
    if (isGivingFlowLocation() && !invite.hidden) hide();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !invite.hidden) hide();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGivingInvite, { once: true });
} else {
  initGivingInvite();
}
