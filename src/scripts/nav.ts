/**
 * Navigation — mobile drawer toggle and dropdown close behavior.
 *
 * The desktop dropdowns use native <details> elements for
 * no-JS accessibility. This script adds two enhancements:
 *   1. Click outside a dropdown to close it.
 *   2. Open one dropdown closes any other that was open.
 *   3. Mobile menu toggle with focus management.
 *
 * After a View Transition the header DOM may be replaced, so we
 * use data-nav-bound markers on individual elements rather than a
 * single module-level boolean. The document-level click handler is
 * attached only once since it delegates via querySelector.
 */

let documentClickBound = false;

function closeAllDropdowns(except?: HTMLDetailsElement) {
  document.querySelectorAll<HTMLDetailsElement>(".desktop-nav details[open]").forEach(detail => {
    if (detail !== except) detail.removeAttribute("open");
  });
}

function initNav() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");

  // Close mobile drawer on navigation (user expects it closed on new page)
  if (mobileDrawer && mobileDrawer.classList.contains("open")) {
    mobileDrawer.classList.remove("open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  // Close any open desktop dropdowns on navigation
  closeAllDropdowns();

  // Attach per-element listeners — skip elements that already have them
  document.querySelectorAll<HTMLDetailsElement>(".desktop-nav details").forEach(detail => {
    if (detail.dataset.navBound) return;
    detail.dataset.navBound = "true";
    detail.addEventListener("toggle", () => {
      if (detail.open) closeAllDropdowns(detail);
    });
  });

  // Document-level click handler — only attach once (survives navigation)
  if (!documentClickBound) {
    documentClickBound = true;
    document.addEventListener("click", (event) => {
      if (!(event.target as HTMLElement).closest(".desktop-nav")) {
        closeAllDropdowns();
      }
    });
  }

  // Mobile drawer toggle — skip if already bound
  if (menuToggle && mobileDrawer && !menuToggle.dataset.navBound) {
    menuToggle.dataset.navBound = "true";
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        const firstLink = mobileDrawer.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });
  }
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", initNav);
