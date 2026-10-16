/* Home page: the fee estimator output (#feeOut) is written by aurora.js as
   "$185". In French, show the same published amount as "185 USD", matching the
   French body copy. Amounts are not changed, only their typography. */
(function () {
  "use strict";
  var out = document.getElementById("feeOut");
  if (!out) return;

  function fr() { return document.documentElement.lang === "fr"; }

  function fix() {
    var b = out.querySelector("b");
    if (!b) return;
    if (!b.hasAttribute("data-amount")) {
      var m = /\$\s*([\d,]+)/.exec(b.textContent);
      if (!m) return;
      b.setAttribute("data-amount", m[1].replace(/,/g, ""));
    }
    var n = parseInt(b.getAttribute("data-amount"), 10);
    var v = fr() ? n.toLocaleString("fr-FR") + "\u00a0USD" : "$" + n.toLocaleString("en-US");
    if (b.textContent !== v) b.textContent = v;
  }

  new MutationObserver(fix).observe(out, { childList: true });
  new MutationObserver(fix).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  fix();
})();
