/* News & Events: small page enhancement.
   annual-events.js (shared) renders each holiday as an <h3> under an <h3>
   month label, with the full date repeated under the name. After every render
   (first load, year change, language change) this script:
     1. turns each holiday name into an <h4>, so the outline reads
        H2 Public holidays > H3 month > H4 holiday;
     2. replaces the repeated full date with the weekday only, since the day
        chip and the month heading already give the date, and prefixes past
        dates with "Past ·" / "Passé ·" so the state is not colour-only;
     3. labels the next row "Next public holiday" / "Prochain jour férié" and
        capitalises the date in the navy "Next public holiday" block.
   It also hides the lead-story figure if its image fails to load, so the card
   never shows an empty box with a broken-image glyph. */
(function () {
  "use strict";

  var media = document.querySelector("#published-news .nw-lead-media");
  var img = media && media.querySelector("img");
  if (img) {
    var fail = function () { media.hidden = true; };
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    img.addEventListener("error", fail);
  }

  var list = document.querySelector("#annual-calendar [data-annual-calendar]");
  if (!list) return;
  var nextDate = document.querySelector("#annual-calendar [data-next-date]");

  function isFr() {
    if (document.documentElement.lang === "fr") return true;
    try { return localStorage.getItem("emb-lang") === "fr"; } catch (e) { return false; }
  }

  function capitalise(value) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  function tidy() {
    var fr = isFr();
    var weekday;
    try {
      weekday = new Intl.DateTimeFormat(fr ? "fr-CD" : "en-US", { weekday: "long", timeZone: "UTC" });
    } catch (e) {
      weekday = new Intl.DateTimeFormat(fr ? "fr" : "en", { weekday: "long", timeZone: "UTC" });
    }

    list.querySelectorAll(".annual-event").forEach(function (event) {
      var name = event.querySelector(":scope > div > h3");
      if (name) {
        var heading = document.createElement("h4");
        heading.className = "annual-name";
        heading.textContent = name.textContent;
        name.replaceWith(heading);
      }

      var state = event.querySelector(".annual-state");
      if (!state) return;
      if (state.classList.contains("next")) {
        state.textContent = fr ? "Prochain jour férié" : "Next public holiday";
        return;
      }
      var iso = event.getAttribute("data-date");
      if (!iso) return;
      var date = new Date(iso + "T00:00:00Z");
      if (isNaN(date.getTime())) return;
      var day = capitalise(weekday.format(date));
      if (event.classList.contains("is-past")) day = (fr ? "Passé · " : "Past · ") + day;
      state.textContent = day;
    });

    if (nextDate) {
      var text = nextDate.textContent.trim();
      var cap = capitalise(text);
      if (cap !== text) nextDate.textContent = cap;
    }
  }

  tidy();
  /* The shared script replaces the list's children on every render; watching
     direct children only means our own edits inside each row never re-trigger. */
  new MutationObserver(tidy).observe(list, { childList: true });
})();
