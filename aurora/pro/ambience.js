/* ============================================================================
   AMBIENCE: gallery lightbox and bilingual alt text.
   Lightbox: PhotoSwipe 5.4.4 (MIT, https://github.com/dimsemenov/PhotoSwipe),
   self-hosted in aurora/vendor/photoswipe and loaded before this file.
   The gallery markup carries no [data-zoom] attributes, so the older shared
   lightbox in aurora.js never binds to it. Without JavaScript each card is a
   plain link to the full-size photograph.
   ============================================================================ */
(function () {
  "use strict";

  var gallery = document.getElementById("amb-gallery");
  if (!gallery) return;

  var root = document.documentElement;
  function isFr() {
    return (root.getAttribute("lang") || "").toLowerCase().indexOf("fr") === 0;
  }

  /* ---- Bilingual alt text -------------------------------------------------
     The site language switch rewrites text, not attributes, so each image
     keeps its French description in data-alt-fr and follows <html lang>. */
  var imgs = Array.prototype.slice.call(gallery.querySelectorAll("img[data-alt-fr]"));
  imgs.forEach(function (img) {
    if (!img.hasAttribute("data-alt-en")) img.setAttribute("data-alt-en", img.getAttribute("alt") || "");
  });
  function syncAlt() {
    var key = isFr() ? "data-alt-fr" : "data-alt-en";
    imgs.forEach(function (img) {
      var v = img.getAttribute(key);
      if (v !== null && img.getAttribute("alt") !== v) img.setAttribute("alt", v);
    });
  }
  syncAlt();
  if ("MutationObserver" in window) {
    new MutationObserver(syncAlt).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  /* ---- Lightbox ---------------------------------------------------------- */
  var Lightbox = window.PhotoSwipeLightbox;
  var Core = window.PhotoSwipe;
  if (typeof Lightbox !== "function" || typeof Core !== "function") return;

  var STR = {
    en: {
      close: "Close",
      zoom: "Zoom",
      prev: "Previous photograph",
      next: "Next photograph",
      error: "The photograph could not be loaded.",
      label: "Illustrative photography"
    },
    fr: {
      close: "Fermer",
      zoom: "Zoomer",
      prev: "Photographie précédente",
      next: "Photographie suivante",
      error: "La photographie n’a pas pu être chargée.",
      label: "Photographie d’illustration"
    }
  };
  function strings() { return STR[isFr() ? "fr" : "en"]; }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lightbox = new Lightbox({
    gallery: "#amb-gallery",
    children: "a.amb-link",
    pswpModule: Core,
    mainClass: "amb-pswp",
    bgOpacity: 1,
    showHideAnimationType: reduceMotion ? "none" : "zoom",
    showAnimationDuration: 220,
    hideAnimationDuration: 200,
    returnFocus: true,
    paddingFn: function (viewport) {
      var wide = viewport.x >= 900;
      return {
        top: wide ? 64 : 56,
        bottom: wide ? 132 : 150,
        left: wide ? 88 : 0,
        right: wide ? 88 : 0
      };
    }
  });

  /* UI labels in the visitor's language, set before the UI is built. */
  lightbox.on("beforeOpen", function () {
    var pswp = lightbox.pswp;
    if (!pswp) return;
    var s = strings();
    pswp.options.closeTitle = s.close;
    pswp.options.zoomTitle = s.zoom;
    pswp.options.arrowPrevTitle = s.prev;
    pswp.options.arrowNextTitle = s.next;
    pswp.options.errorMsg = s.error;
  });

  /* Caption: the card title and the image's description (its alt text). */
  lightbox.on("uiRegister", function () {
    var pswp = lightbox.pswp;
    if (!pswp || !pswp.ui) return;
    pswp.ui.registerElement({
      name: "ambCaption",
      className: "amb-pswp-caption",
      order: 9,
      isButton: false,
      appendTo: "root",
      html: "",
      onInit: function (el, instance) {
        var label = document.createElement("p");
        var title = document.createElement("p");
        var desc = document.createElement("p");
        label.className = "amb-pswp-label";
        title.className = "amb-pswp-title";
        desc.className = "amb-pswp-desc";
        el.appendChild(label);
        el.appendChild(title);
        el.appendChild(desc);
        el.setAttribute("aria-live", "polite");

        function update() {
          var slide = instance.currSlide;
          var link = slide && slide.data && slide.data.element;
          var img = link && link.querySelector("img");
          var fig = link && link.closest("figure");
          var ttl = fig && fig.querySelector(".amb-cap-ttl");
          label.textContent = strings().label;
          title.textContent = ttl ? ttl.textContent.trim() : "";
          desc.textContent = img ? (img.getAttribute("alt") || "") : "";
        }
        instance.on("change", update);
        update();
      }
    });
  });

  lightbox.init();
})();
