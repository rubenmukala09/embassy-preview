/* Legal & policy documents: contents list behaviour.
   - Wide screens (>= 1100px): the contents list is a sticky sidebar that stays open.
   - Narrower screens: it collapses behind its "Contents" summary and closes again
     once a section has been chosen.
   - The entry for the section being read is marked with aria-current. */
(function () {
  "use strict";
  var fold = document.querySelector("main > section.lg .lg-toc-fold");
  if (!fold) return;
  var summary = fold.querySelector("summary");
  var wide = window.matchMedia("(min-width: 1100px)");

  function sync() {
    fold.open = wide.matches;
    if (summary) {
      if (wide.matches) summary.setAttribute("tabindex", "-1");
      else summary.removeAttribute("tabindex");
    }
  }
  sync();
  if (wide.addEventListener) wide.addEventListener("change", sync);
  else if (wide.addListener) wide.addListener(sync);

  if (summary) {
    summary.addEventListener("click", function (e) {
      if (wide.matches) e.preventDefault();
    });
  }
  // Capture phase: the list must collapse before the shared smooth-scroll
  // handler (bound to each link) measures where the section is.
  fold.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("a[href^='#']") : null;
    if (!link) return;
    if (!wide.matches) fold.open = false;
    var section = document.getElementById(link.getAttribute("href").slice(1));
    var heading = section && section.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      setTimeout(function () { heading.focus({ preventScroll: true }); }, 0);
    }
  }, true);

  var links = Array.prototype.slice.call(fold.querySelectorAll("a[href^='#']"));
  var headings = links.map(function (a) {
    var s = document.getElementById(a.getAttribute("href").slice(1));
    return s ? (s.querySelector("h2") || s) : null;
  });
  if (!headings.some(Boolean)) return;

  var current = -1;
  function mark(index) {
    if (index === current) return;
    current = index;
    links.forEach(function (a, i) {
      if (i === index) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  // The section being read is the last one whose heading has passed the
  // reading line (35% down the viewport); nothing is marked above the first.
  function update() {
    var line = window.innerHeight * 0.35;
    var index = -1;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i] && headings[i].getBoundingClientRect().top <= line) index = i;
    }
    mark(index);
  }
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
