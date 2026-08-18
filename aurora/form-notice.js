/* ===========================================================================
   Forms that answer back
   ---------------------------------------------------------------------------
   Every form on this site is inert: there is no backend, so none of them has
   an `action` and only the assistant has a submit handler. Until now that
   meant a visitor could type their email, press Subscribe, and get nothing
   at all — no confirmation, no error, no explanation. A control that looks
   live and does nothing is worse than no control.

   This gives every unwired form an honest reply. It does not fake a
   submission: it says the preview is not connected and points at the route
   that does work, which is contacting the Embassy directly.

   The forms also get `novalidate`. Without it Chrome runs native validation
   first and refuses to fire `submit` at all when a `type="email"` field is
   empty or malformed — the submit button appears dead for a second, unrelated
   reason. Validation is done here instead so every outcome is explained.
   ======================================================================== */
(function () {
  "use strict";

  var CONTACT = "/embassy-preview/contact.html";

  function invalidFields(form) {
    var bad = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name && !el.id) return;
      if (el.disabled || el.type === "hidden" || el.type === "submit" || el.type === "button") return;
      var v = (el.value || "").trim();
      if (el.hasAttribute("required") && !v) { bad.push([el, "This field is required."]); return; }
      if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        bad.push([el, "Enter a complete email address."]);
      }
    });
    return bad;
  }

  function noticeFor(form) {
    var n = form.querySelector(".form-notice");
    if (!n) {
      n = document.createElement("p");
      n.className = "form-notice";
      n.setAttribute("role", "status");
      n.setAttribute("aria-live", "polite");
      form.appendChild(n);
    }
    return n;
  }

  function clearErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll(".is-invalid"), function (el) {
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form"), function (form) {
    // Leave anything that is genuinely wired up alone.
    if (form.hasAttribute("action") || form.classList.contains("asst-form")) return;

    form.setAttribute("novalidate", "");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);

      var bad = invalidFields(form);
      var note = noticeFor(form);

      if (bad.length) {
        bad.forEach(function (pair) {
          pair[0].classList.add("is-invalid");
          pair[0].setAttribute("aria-invalid", "true");
        });
        note.className = "form-notice is-error";
        note.textContent = bad[0][1];
        bad[0][0].focus();
        return;
      }

      note.className = "form-notice is-info";
      note.innerHTML =
        "This is a preview of the Embassy website and it is not connected, so nothing was sent. " +
        'To reach the Embassy, use the <a href="' + CONTACT + '">contact details</a> or telephone during published office hours.';
    });
  });
})();
