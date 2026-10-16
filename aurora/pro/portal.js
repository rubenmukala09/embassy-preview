/* ============================================================================
   portal.html: prototype of a proposed online appointment request.
   One question per screen, then "Check your answers" and the published
   requirements for the chosen service. Nothing is sent, stored or logged:
   the answers live only in this page's radio buttons. All visible text is
   already in the HTML with data-emb-en / data-emb-fr, so the site language
   switch keeps working; answers are shown by cloning the chosen label.
   ============================================================================ */
(function () {
  "use strict";

  var flow = document.querySelector("[data-ps-flow]");
  if (!flow) return;

  var current = 1;

  function $(sel) { return flow.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(flow.querySelectorAll(sel)); }

  function checked(name) {
    var el = flow.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function setError(step, on) {
    var q = $('.ps-q[data-ps-step="' + step + '"]');
    if (!q) return;
    var err = q.querySelector(".ps-error");
    q.classList.toggle("is-error", on);
    if (err) err.hidden = !on;
    q.querySelectorAll("input").forEach(function (i) {
      if (on) i.setAttribute("aria-invalid", "true");
      else i.removeAttribute("aria-invalid");
    });
  }

  function showAnswer(slot, value) {
    var dd = $('[data-ps-answer="' + slot + '"]');
    var src = flow.querySelector('[data-ps-label="' + value + '"]');
    if (!dd) return;
    dd.textContent = "";
    if (src) {
      var copy = src.cloneNode(true);
      copy.removeAttribute("data-ps-label");
      copy.className = "ps-answer-txt";
      dd.appendChild(copy);
    }
  }

  function buildResult() {
    var service = checked("ps-service");
    var child = checked("ps-child") === "yes";
    showAnswer("service", service);
    showAnswer("child", checked("ps-child"));

    var hasSpecificChild = false;
    $all(".ps-plan").forEach(function (plan) {
      var on = plan.getAttribute("data-ps-for") === service;
      plan.hidden = !on;
      var note = plan.querySelector("[data-ps-child]");
      if (note) {
        note.hidden = !(on && child);
        if (on) hasSpecificChild = true;
      }
    });
    var generic = $("[data-ps-child-generic]");
    if (generic) generic.hidden = !(child && !hasSpecificChild);
  }

  function go(step, focus) {
    current = step;
    $all("[data-ps-step]").forEach(function (el) {
      el.hidden = Number(el.getAttribute("data-ps-step")) !== step;
    });
    $all("[data-ps-count]").forEach(function (el) {
      el.hidden = Number(el.getAttribute("data-ps-count")) !== step;
    });
    if (step === 3) buildResult();
    if (focus !== false) {
      var target = step === 3 ? $(".ps-result-title") : $('.ps-q[data-ps-step="' + step + '"] .ps-legend');
      if (target) {
        target.focus({ preventScroll: true });
        var r = flow.getBoundingClientRect();
        if (r.top < 0 || r.top > window.innerHeight * 0.6) {
          flow.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    }
  }

  flow.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t || !flow.contains(t)) return;

    if (t.hasAttribute("data-ps-next")) {
      var step = Number(t.getAttribute("data-ps-next"));
      var name = step === 1 ? "ps-service" : "ps-child";
      if (!checked(name)) {
        setError(step, true);
        var first = flow.querySelector('input[name="' + name + '"]');
        if (first) first.focus();
        return;
      }
      setError(step, false);
      go(step + 1);
    } else if (t.hasAttribute("data-ps-back")) {
      go(Number(t.getAttribute("data-ps-back")));
    } else if (t.hasAttribute("data-ps-restart")) {
      $all("input[type=radio]").forEach(function (i) { i.checked = false; });
      setError(1, false);
      setError(2, false);
      go(1);
    }
  });

  flow.addEventListener("change", function (e) {
    if (e.target && e.target.name === "ps-service") setError(1, false);
    if (e.target && e.target.name === "ps-child") setError(2, false);
  });

  go(1, false);
})();
