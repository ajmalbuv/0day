document.addEventListener("DOMContentLoaded", () => {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
  );

  if (typeof particlesJS !== "undefined") {
    particlesJS.load("particles-js", "js/particlesjs.json");
  }
});
