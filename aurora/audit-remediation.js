(function () {
  "use strict";

  function addPreviewStatus(scope, message) {
    if (!scope || scope.querySelector(":scope > .preview-status")) return;
    var status = document.createElement("p");
    status.className = "preview-status";
    status.setAttribute("role", "note");
    status.textContent = message;
    scope.insertBefore(status, scope.firstChild);
  }

  function lockForm(form, message) {
    if (!form) return;
    form.classList.add("preview-locked");
    addPreviewStatus(form, message);
    form.querySelectorAll("input, select, textarea, button[type='submit']").forEach(function (control) {
      control.disabled = true;
    });
    form.addEventListener("submit", function (event) { event.preventDefault(); });
  }

  document.querySelectorAll("form.newsletter-form").forEach(function (form) {
    lockForm(form, "Preview only—nothing is submitted. Embassy email subscriptions are not active yet.");
  });

  document.querySelectorAll("form[data-intake]").forEach(function (form) {
    lockForm(form, "Preview only—nothing is submitted or stored. Contact the Embassy for the approved registration channel.");
  });

  document.querySelectorAll(".mainnav a[href$='news-events.html']").forEach(function (link) {
    link.textContent = "News & Notices";
  });

  document.querySelectorAll(".mobile-menu a[href$='digital-services.html'], .mobile-menu a[href='/embassy-preview/']").forEach(function (link) {
    link.remove();
  });
})();

