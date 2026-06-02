/**
 * Form handling — intercepts form submissions.
 *
 * In the template, forms show a placeholder alert reminding the
 * client to connect their form handler (Netlify Forms, Formspree, etc.).
 *
 * Replace this with real submission logic before launch.
 *
 * Includes honeypot check: if the hidden "website" field has a value,
 * the submission is silently ignored (it was filled by a bot).
 *
 * Uses event delegation on document, so it only needs to be
 * attached once (persists across View Transitions).
 */

let formListenerAttached = false;

function initForms() {
  if (formListenerAttached) return;
  formListenerAttached = true;

  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form.id === "contactFormEl" || form.id === "newsletterFormEl") {
      event.preventDefault();

      // Honeypot check — bots fill this in, humans never see it
      const honeypot = form.querySelector<HTMLInputElement>("input[name='website']");
      if (honeypot && honeypot.value) {
        // Silently discard — don't reveal that we caught a bot
        return;
      }

      // Until a form handler is connected, fail gracefully without sending.
      alert("Thanks for reaching out! Our online form isn't connected just yet, so your message wasn't sent. Please try again soon — the team will get back to you.");
    }
  });
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", initForms);
