(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initializeCarousel(root) {
    const rail = root.querySelector("[data-news-rail]");
    const slides = Array.from(root.querySelectorAll("[data-news-slide]"));
    const previous = root.querySelector("[data-news-prev]");
    const next = root.querySelector("[data-news-next]");
    const status = root.querySelector("[data-news-status]");
    const progress = root.querySelector("[data-news-progress]");
    const dots = root.querySelector("[data-news-dots]");
    if (!rail || !slides.length) return;

    let activeIndex = 0;
    let frame = 0;

    const slideLabel = index => `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

    function update(index) {
      activeIndex = Math.max(0, Math.min(slides.length - 1, index));
      if (status) status.textContent = slideLabel(activeIndex);
      if (progress) progress.style.setProperty("--news-progress", `${((activeIndex + 1) / slides.length) * 100}%`);
      if (previous) previous.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === slides.length - 1;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
        slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
      });
      if (dots) dots.querySelectorAll("button").forEach((dot, dotIndex) => {
        const current = dotIndex === activeIndex;
        dot.classList.toggle("is-active", current);
        dot.setAttribute("aria-current", current ? "true" : "false");
      });
    }

    function nearestSlide() {
      const railLeft = rail.getBoundingClientRect().left;
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, index) => {
        const delta = Math.abs(slide.getBoundingClientRect().left - railLeft);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      update(nearest);
    }

    function goTo(index) {
      const target = Math.max(0, Math.min(slides.length - 1, index));
      rail.scrollTo({ left: slides[target].offsetLeft, behavior: reducedMotion.matches ? "auto" : "smooth" });
      update(target);
    }

    if (dots) {
      dots.innerHTML = slides.map((_, index) => `<button type="button" aria-label="Show featured story ${index + 1}"${index === 0 ? ' class="is-active" aria-current="true"' : ' aria-current="false"'}></button>`).join("");
      dots.querySelectorAll("button").forEach((button, index) => button.addEventListener("click", () => goTo(index)));
    }

    previous?.addEventListener("click", () => goTo(activeIndex - 1));
    next?.addEventListener("click", () => goTo(activeIndex + 1));
    rail.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(nearestSlide);
    }, { passive: true });
    rail.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") { event.preventDefault(); goTo(activeIndex + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); goTo(activeIndex - 1); }
      if (event.key === "Home") { event.preventDefault(); goTo(0); }
      if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); }
    });
    window.addEventListener("resize", nearestSlide, { passive: true });
    update(0);
  }

  function start() {
    document.querySelectorAll("[data-news-carousel]").forEach(initializeCarousel);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
