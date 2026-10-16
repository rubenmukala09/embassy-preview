/* ============================================================================
   Search plus: full-text results for the existing search palette.

   The palette in aurora.js searches a hand-curated list of ~50 destinations.
   Real queries ("apostille", "NIF", "laissez-passer") often matched nothing.
   This file adds Pagefind (https://github.com/Pagefind/pagefind, MIT), a static
   full-text index generated from the published pages, underneath the curated
   results. It does not replace or edit aurora.js: it listens to the palette's
   input and appends a "From the website" group.

   Rebuild the index after content changes (from the repo root):
     npx pagefind@1.5.2 --site . --output-path pagefind
   Only <main data-pagefind-body> is indexed; frozen chrome is excluded.
   ============================================================================ */
(function () {
  "use strict";

  var BASE = "/embassy-preview/";
  var MAX = 6;
  var pagefind = null;
  var loading = null;
  var lastQuery = "";
  var lastHtml = "";
  var token = 0;

  function isFR() {
    try { return localStorage.getItem("emb-lang") === "fr"; } catch (e) { return document.documentElement.lang === "fr"; }
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function load() {
    if (pagefind) return Promise.resolve(pagefind);
    if (loading) return loading;
    loading = import(BASE + "pagefind/pagefind.js")
      .then(function (pf) {
        return Promise.resolve(pf.options({ baseUrl: BASE, excerptLength: 22 })).then(function () {
          pf.init();
          pagefind = pf;
          return pf;
        });
      })
      .catch(function () { loading = null; return null; });
    return loading;
  }

  // Pagefind pads weak queries with highlights on tiny words ("a"). A result is
  // kept only if a highlighted word really matches the start of a query word.
  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function relevant(excerpt, q) {
    var marks = (String(excerpt || "").match(/<mark>([^<]*)<\/mark>/gi) || []).map(function (m) {
      return fold(m.replace(/<\/?mark>/gi, ""));
    });
    var terms = fold(q).split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 2; });
    return marks.some(function (m) {
      if (m.length < 2) return false;
      return terms.some(function (w) {
        var n = Math.min(4, w.length, m.length);
        return m.slice(0, n) === w.slice(0, n) && (m.length >= 3 || w.length <= 3);
      });
    });
  }

  // Pagefind excerpts are already-escaped page text plus bare <mark> tags.
  // Drop any other tag outright (defence in depth; entities stay as they are).
  function safeExcerpt(x) {
    return String(x || "").replace(/<(?!\/?mark>)[^>]*>?/gi, "");
  }

  function cleanTitle(t) {
    // Page titles end with the long Embassy suffix; keep the page name.
    return String(t || "").split(/\s[|,·-]\s|, Embassy of/)[0].trim() || t;
  }

  function group(results, q) {
    var label = isFR() ? "Sur le site" : "From the website";
    var html = '<div class="sr-pf-head" aria-hidden="true">' + label + "</div>";
    html += results.map(function (r, i) {
      var url = r.url || BASE;
      var title = esc(cleanTitle(r.meta && r.meta.title));
      var sub = r.sub_results && r.sub_results[0];
      if (sub && sub.url && sub.title && sub.url.indexOf("#") > -1) {
        url = sub.url;
        title += ' <span class="sr-pf-sub">› ' + esc(sub.title) + "</span>";
      }
      return '<a class="sr-item sr-pf" id="sr-pf-' + i + '" role="option" aria-selected="false" href="' + esc(url) + '">' +
        '<span class="sr-t">' + title + "</span>" +
        '<span class="sr-d">' + safeExcerpt(r.excerpt) + "</span></a>";
    }).join("");
    return html;
  }

  function attach(ov) {
    var input = ov.querySelector("input");
    var box = ov.querySelector(".search-results");
    if (!input || !box) return;

    function paint(html) {
      if (!html) return;
      if (box.querySelector(".sr-pf")) return;
      var empty = box.querySelector(".sr-empty");
      var hasCurated = box.querySelector(".sr-item:not(.sr-pf)");
      if (empty) empty.remove();
      box.setAttribute("role", "listbox");
      input.setAttribute("aria-expanded", "true");
      box.insertAdjacentHTML("beforeend", (hasCurated ? '<div class="sr-pf-sep" aria-hidden="true"></div>' : "") + html);
    }

    function run() {
      var q = input.value.trim();
      var my = ++token;
      if (q.length < 2) { lastQuery = ""; lastHtml = ""; return; }
      load().then(function (pf) {
        if (!pf || my !== token) return null;
        return pf.debouncedSearch(q, {}, 180);
      }).then(function (search) {
        if (!search || my !== token) return null;
        return Promise.all(search.results.slice(0, MAX).map(function (r) { return r.data(); }));
      }).then(function (data) {
        if (!data || my !== token || input.value.trim() !== q) return;
        var curatedHrefs = Array.prototype.map.call(box.querySelectorAll(".sr-item:not(.sr-pf)"), function (a) { return a.getAttribute("href"); });
        // Keep only pages where the query actually appears (Pagefind highlights it);
        // loose stem/prefix matches with nothing highlighted are noise.
        var fresh = data.filter(function (d) {
          return curatedHrefs.indexOf(d.url) === -1 && relevant(d.excerpt, q);
        });
        lastQuery = q;
        lastHtml = fresh.length ? group(fresh, q) : "";
        paint(lastHtml);
      });
    }

    // aurora.js re-renders the list on every keystroke and after a language
    // switch; put our group back whenever the list is rebuilt for the same query.
    new MutationObserver(function () {
      if (lastHtml && input.value.trim() === lastQuery && !box.querySelector(".sr-pf")) paint(lastHtml);
    }).observe(box, { childList: true });

    input.addEventListener("input", run);
    input.addEventListener("focus", function () { load(); }, { once: true });

    // Enter on one of our options: aurora.js only knows its curated array.
    ov.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var id = input.getAttribute("aria-activedescendant");
      var opt = id && document.getElementById(id);
      if (opt && opt.classList.contains("sr-pf")) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = opt.getAttribute("href");
      } else if (!box.querySelector(".sr-item:not(.sr-pf)") && box.querySelector(".sr-pf")) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = box.querySelector(".sr-pf").getAttribute("href");
      }
    }, true);
  }

  function start() {
    var ov = document.querySelector(".search-overlay");
    if (ov) { attach(ov); return; }
    var mo = new MutationObserver(function () {
      var o = document.querySelector(".search-overlay");
      if (o) { mo.disconnect(); attach(o); }
    });
    mo.observe(document.body, { childList: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
