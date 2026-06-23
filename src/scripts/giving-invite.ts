/**
 * Strong Circle giving invite.
 *
 * A restrained, non-blocking corner card that invites monthly giving after the
 * visitor has met the mission — when the testimonial video ends, or when they
 * scroll past the testimonials. Shows once per session, respects reduced
 * motion, and never traps the screen. "Join" presets the donation widget to
 * monthly $22; "Give once" presets it to one-time.
 */

const INVITE_SELECTOR = "[data-giving-invite]";
const STORAGE_KEY = "givingInviteSeen";
const VISIBLE_CLASS = "is-visible";

function initGivingInvite() {
  const invite = document.querySelector<HTMLElement>(INVITE_SELECTOR);
  if (!invite) return;

  let seen = false;
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

  // Trigger 2: the visitor scrolls past the testimonials section.
  const section = document.getElementById("veteran-voices");
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
    el.addEventListener("click", hide);
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
