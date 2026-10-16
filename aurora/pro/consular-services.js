/* Consular Services page: "On this page" scrollspy + click-to-load video.
   - Scrollspy marks the contents link for the section being read with
     aria-current="true". It never scrolls the page itself (no smooth-scroll
     hijacking); in-page jumps keep the browser / shared-site behaviour.
   - The third-party YouTube walkthrough loads only when the visitor asks for
     it, from youtube-nocookie.com (allowed by the page CSP frame-src). */
(function () {
  "use strict";

  /* ---- 1. On this page: scrollspy ------------------------------------- */
  var toc = document.querySelector(".cs-toc");
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var pairs = [];
    links.forEach(function (a) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) pairs.push({ link: a, target: target });
    });

    var setCurrent = function (link) {
      links.forEach(function (l) {
        if (l === link) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
    };

    if (pairs.length && "IntersectionObserver" in window) {
      var visible = [];
      var pick = function () {
        // First section (in document order) crossing the reading band wins.
        for (var i = 0; i < pairs.length; i++) {
          if (visible.indexOf(pairs[i].target) !== -1) { setCurrent(pairs[i].link); return; }
        }
        // Nothing in the band: above the first section, clear; otherwise keep
        // the last section read (the gap between two sections).
        if (pairs[0].target.getBoundingClientRect().top > window.innerHeight * 0.3) setCurrent(null);
      };
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var at = visible.indexOf(e.target);
          if (e.isIntersecting && at === -1) visible.push(e.target);
          if (!e.isIntersecting && at !== -1) visible.splice(at, 1);
        });
        pick();
      }, { rootMargin: "-22% 0px -68% 0px", threshold: 0 });
      pairs.forEach(function (p) { io.observe(p.target); });
    }

    // A chosen link is current straight away, whatever the scroll behaviour.
    links.forEach(function (a) {
      a.addEventListener("click", function () { setCurrent(a); });
    });
  }

  /* ---- 2. Click-to-load video ------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll(".cs-video-facade[data-yt]"), function (a) {
    a.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return; // let "open in new tab" work
      e.preventDefault();
      var id = a.getAttribute("data-yt");
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
        "?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=en&hl=" + (document.documentElement.lang === "fr" ? "fr" : "en");
      frame.title = a.getAttribute("data-yt-title") || "Video";
      frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      a.parentNode.replaceChild(frame, a);
      frame.focus();
    });
  });
})();
