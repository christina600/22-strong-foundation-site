/**
 * Strong Circle modal controls.
 *
 * The modal opens from the "Join the Strong Circle" trigger, explains the
 * monthly gift, then sends donors to the donation module with the $22 monthly
 * option preset. It never opens on its own.
 */

let strongCircleListenerAttached = false;
let lastModalTrigger: HTMLElement | null = null;
let restoreFocusAfterClose = true;

const configuredModals = new WeakSet<HTMLDialogElement>();

const OPEN_SELECTOR = "[data-strong-circle-open]";
const CLOSE_SELECTOR = "[data-strong-circle-close]";
const JOIN_SELECTOR = "[data-strong-circle-join]";

function restoreTriggerFocus() {
  if (restoreFocusAfterClose && lastModalTrigger?.isConnected) {
    lastModalTrigger.focus({ preventScroll: true });
  }

  restoreFocusAfterClose = true;
}

function setupModalLifecycle(modal: HTMLDialogElement) {
  if (configuredModals.has(modal)) return;
  configuredModals.add(modal);
  modal.addEventListener("close", restoreTriggerFocus);
}

function closeModal(modal: HTMLDialogElement, restoreFocus = true) {
  restoreFocusAfterClose = restoreFocus;

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
    restoreTriggerFocus();
  }
}

function openModal(modal: HTMLDialogElement, trigger: HTMLElement) {
  setupModalLifecycle(modal);
  lastModalTrigger = trigger;
  restoreFocusAfterClose = true;

  if (modal.open) return;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }

  window.requestAnimationFrame(() => {
    modal.querySelector<HTMLElement>(JOIN_SELECTOR)?.focus({ preventScroll: true });
  });
}

function presetStrongCircleGift() {
  document.querySelectorAll<HTMLElement>(".donation-module").forEach((module) => {
    const monthly = module.querySelector<HTMLButtonElement>('[data-frequency="monthly"]');
    const amount = module.querySelector<HTMLButtonElement>('[data-amount="22"]');

    monthly?.click();
    amount?.click();
  });
}

function initStrongCircleModal() {
  if (strongCircleListenerAttached) return;
  strongCircleListenerAttached = true;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const modal = document.querySelector<HTMLDialogElement>(".strong-circle-modal");
    if (!modal) return;

    const openTrigger = event.target.closest<HTMLElement>(OPEN_SELECTOR);
    if (openTrigger) {
      event.preventDefault();
      openModal(modal, openTrigger);
      return;
    }

    if (event.target.closest(JOIN_SELECTOR)) {
      presetStrongCircleGift();
      closeModal(modal, false);
      return;
    }

    const closeTrigger = event.target.closest<HTMLElement>(CLOSE_SELECTOR);
    if (closeTrigger || event.target === modal) {
      closeModal(modal, closeTrigger?.tagName === "A" ? false : true);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStrongCircleModal, { once: true });
} else {
  initStrongCircleModal();
}
