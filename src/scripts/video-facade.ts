/**
 * Video facade — swap the styled poster for the real YouTube embed
 * only after the visitor clicks. No autoloaded iframe (faster, calmer,
 * privacy-friendlier), and no dead black box before interaction.
 *
 * Re-binds on every page load for View Transitions compatibility.
 */

function initVideoFacades() {
  const facades = document.querySelectorAll<HTMLButtonElement>(".testimonial-video-facade");

  facades.forEach(button => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", () => {
      const id = button.dataset.videoId;
      const frame = button.closest(".testimonial-video-frame");
      if (!id || !frame) return;

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
      iframe.title = button.getAttribute("aria-label") || "Video testimonial";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      frame.replaceChildren(iframe);
    });
  });
}

document.addEventListener("astro:page-load", initVideoFacades);
