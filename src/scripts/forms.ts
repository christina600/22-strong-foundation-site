/**
 * Contact form validation and submission handler.
 *
 * Provides client-side validation with inline error messages.
 * Static-site submissions open a prepared email when a contact address exists.
 */

import { getEventElement } from "./dom-target";

let formListenerAttached = false;

const CONTACT_FORM_ID = "contactFormEl";
const MAILTO_EVENT = "contact:mailto";
const NOT_CONNECTED_MESSAGE = "Thanks for checking in. Please email the team directly.";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

const VALIDATION_RULES: Record<string, ValidationRule[]> = {
  name: [
    { test: (v) => v.trim().length >= 2, message: "Name must be at least 2 characters" },
    { test: (v) => v.trim().length <= 100, message: "Name must be less than 100 characters" },
  ],
  email: [
    { test: (v) => v.trim().length > 0, message: "Email is required" },
    { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Please enter a valid email address" },
  ],
  reason: [
    { test: (v) => v.trim().length > 0, message: "Please select a reason for contact" },
  ],
  message: [
    { test: (v) => v.trim().length >= 10, message: "Message must be at least 10 characters" },
    { test: (v) => v.trim().length <= 2000, message: "Message must be less than 2000 characters" },
  ],
};

function setFieldError(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string) {
  const errorEl = field.closest(".form-field")?.querySelector<HTMLElement>(".field-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
  field.setAttribute("aria-invalid", "true");
  field.classList.add("is-invalid");
}

function clearFieldError(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  const errorEl = field.closest(".form-field")?.querySelector<HTMLElement>(".field-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
  field.removeAttribute("aria-invalid");
  field.classList.remove("is-invalid");
}

function validateField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
  const rules = VALIDATION_RULES[field.name];
  if (!rules) return true;

  const value = field.value;
  for (const rule of rules) {
    if (!rule.test(value)) {
      setFieldError(field, rule.message);
      return false;
    }
  }

  clearFieldError(field);
  return true;
}

function validateForm(form: HTMLFormElement): boolean {
  const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input:not([type='hidden']), textarea, select"
  );
  
  let isValid = true;
  let firstInvalid: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;

  fields.forEach((field) => {
    if (field.name === "website") return; // Skip honeypot
    
    if (!validateField(field)) {
      isValid = false;
      if (!firstInvalid) firstInvalid = field;
    }
  });

  // Focus first invalid field for accessibility
  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}

function setStatus(form: HTMLFormElement, message: string, isError = false) {
  const status = form.querySelector<HTMLElement>(".form-status");
  if (!status) return;
  status.textContent = message;
  status.hidden = false;
  status.className = `form-status ${isError ? "is-error" : "is-success"}`;
}

function hideStatus(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>(".form-status");
  if (!status) return;
  status.hidden = true;
  status.textContent = "";
  status.className = "form-status";
}

function fieldValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    return field.value.trim();
  }

  return "";
}

function buildMailtoHref(form: HTMLFormElement, email: string) {
  const name = fieldValue(form, "name");
  const replyTo = fieldValue(form, "email");
  const reason = fieldValue(form, "reason") || "Website inquiry";
  const message = fieldValue(form, "message");
  const subject = `22 Strong contact: ${reason}`;
  const body = [
    `Name: ${name}`,
    `Email: ${replyTo}`,
    `Reason: ${reason}`,
    "",
    message,
  ].join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openMailto(form: HTMLFormElement, href: string) {
  const mailtoEvent = new CustomEvent<{ href: string }>(MAILTO_EVENT, {
    bubbles: true,
    cancelable: true,
    detail: { href },
  });

  if (form.dispatchEvent(mailtoEvent)) {
    window.location.href = href;
  }
}

function initForms() {
  if (formListenerAttached) return;
  formListenerAttached = true;

  // Form submission
  document.addEventListener("submit", (event) => {
    if (!(event.target instanceof HTMLFormElement) || event.target.id !== CONTACT_FORM_ID) {
      return;
    }

    event.preventDefault();

    const honeypot = event.target.querySelector<HTMLInputElement>("input[name='website']");
    if (honeypot?.value) return;

    // Validate before submission
    if (!validateForm(event.target)) {
      setStatus(event.target, "Please correct the errors above and try again.", true);
      return;
    }

    const contactEmail = event.target.dataset.contactEmail?.trim();
    if (!contactEmail) {
      setStatus(event.target, NOT_CONNECTED_MESSAGE, true);
      return;
    }

    const mailtoHref = buildMailtoHref(event.target, contactEmail);
    setStatus(event.target, `Opening your email app to send this to ${contactEmail}.`);
    openMailto(event.target, mailtoHref);
  });

  // Real-time validation on blur
  document.addEventListener("blur", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && 
        !(target instanceof HTMLTextAreaElement) && 
        !(target instanceof HTMLSelectElement)) {
      return;
    }

    const form = target.closest<HTMLFormElement>(`#${CONTACT_FORM_ID}`);
    if (!form) return;

    // Only validate if field has been touched (has value or was focused)
    if (target.value || target.dataset.touched === "true") {
      validateField(target);
    }
  }, true);

  // Mark field as touched on focus
  document.addEventListener("focus", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target instanceof HTMLSelectElement) {
      target.dataset.touched = "true";
    }
  }, true);

  // Clear errors on input
  document.addEventListener("input", (event) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const form = target.closest<HTMLFormElement>(`#${CONTACT_FORM_ID}`);
    if (!form) return;

    hideStatus(form);

    // Clear error on input if field was invalid
    if (target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target instanceof HTMLSelectElement) {
      if (target.getAttribute("aria-invalid") === "true") {
        validateField(target);
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initForms, { once: true });
} else {
  initForms();
}
