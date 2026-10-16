/* The Embassy page: localise portrait alt text with the EN/FR switch.
   The shared engine swaps text content and dictionary aria-label/title only;
   images carrying data-alt-fr get their French alt when <html lang="fr">. */
(function () {
  "use strict";
  var imgs = Array.prototype.slice.call(document.querySelectorAll("main img[data-alt-fr]"));
  if (!imgs.length) return;
  imgs.forEach(function (img) { img.setAttribute("data-alt-en", img.getAttribute("alt") || ""); });
  function sync() {
    var fr = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("fr") === 0;
    imgs.forEach(function (img) {
      var v = img.getAttribute(fr ? "data-alt-fr" : "data-alt-en");
      if (img.getAttribute("alt") !== v) img.setAttribute("alt", v);
    });
  }
  sync();
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
