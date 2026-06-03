/**
 * Contact form preview handling.
 *
 * Until a live handler is configured, submissions are intercepted and shown as
 * inline status messages.
 */

let formListenerAttached = false;

const CONTACT_FORM_ID = "contactFormEl";
const NOT_CONNECTED_MESSAGE =
  "Thanks for checking in. This preview form is not connected yet, so your message was not sent.";

function setStatus(form: HTMLFormElement, message: string) {
  const status = form.querySelector<HTMLElement>(".form-status");
  if (!status) return;
  status.textContent = message;
  status.hidden = false;
}

function hideStatus(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>(".form-status");
  if (!status) return;
  status.hidden = true;
  status.textContent = "";
}

function initForms() {
  if (formListenerAttached) return;
  formListenerAttached = true;

  document.addEventListener("submit", (event) => {
    if (!(event.target instanceof HTMLFormElement) || event.target.id !== CONTACT_FORM_ID) {
      return;
    }

    event.preventDefault();

    const honeypot = event.target.querySelector<HTMLInputElement>("input[name='website']");
    if (honeypot?.value) return;

    setStatus(event.target, NOT_CONNECTED_MESSAGE);
  });

  document.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const form = event.target.closest<HTMLFormElement>(`#${CONTACT_FORM_ID}`);
    if (form) hideStatus(form);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initForms, { once: true });
} else {
  initForms();
}
