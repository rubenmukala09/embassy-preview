/* Bilingual alt/title attributes for content below the hero.
   aurora.js swaps textContent and placeholders only. Elements that carry
   data-emb-alt-fr / data-emb-title-fr get the French value while the page is in
   French and their original English value back in English. */
(function () {
  "use strict";
  var ATTRS = ["alt", "title"];

  function isFR() {
    var l = document.documentElement.lang;
    if (l === "fr" || l === "en") return l === "fr";
    try { return localStorage.getItem("emb-lang") === "fr"; } catch (e) { return false; }
  }

  function apply() {
    var fr = isFR();
    ATTRS.forEach(function (a) {
      var nodes = document.querySelectorAll("[data-emb-" + a + "-fr]");
      Array.prototype.forEach.call(nodes, function (el) {
        var enKey = "data-emb-" + a + "-en";
        if (!el.hasAttribute(enKey)) el.setAttribute(enKey, el.getAttribute(a) || "");
        var v = el.getAttribute(fr ? "data-emb-" + a + "-fr" : enKey);
        if (el.getAttribute(a) !== v) el.setAttribute(a, v);
      });
    });
  }

  function start() {
    apply();
    new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
