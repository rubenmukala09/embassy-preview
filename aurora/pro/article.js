/* Article pages (aurora/pro/article.css): highlight the current section in the
   "On this page" list while reading. No scroll hijacking; respects the user's
   own scrolling and works without JS (the links are plain anchors). */
(function () {
  "use strict";
  var toc = document.querySelector("main > section.ar .ar-toc");
  if (!toc || !("IntersectionObserver" in window)) return;
  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function (a) {
    return document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
  }).filter(Boolean);
  if (!targets.length) return;
  var visible = new Map();
  function update() {
    var best = null;
    targets.forEach(function (t) {
      if (visible.get(t) && !best) best = t;
    });
    if (!best) return;
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + best.id;
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); });
    update();
  }, { rootMargin: "-100px 0px -60% 0px", threshold: 0 });
  targets.forEach(function (t) { io.observe(t); });
})();
