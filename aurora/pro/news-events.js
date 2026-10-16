/* News & Events: small page enhancement for the national calendar.
   annual-events.js (shared) renders each holiday as an <h3> under an <h3>
   month label, with the full date repeated under the name. After every render
   (first load, year change, language change) this script:
     1. turns each holiday name into an <h4>, so the outline reads
        H2 Public holidays > H3 month > H4 holiday;
     2. replaces the repeated full date with the weekday only, since the day
        chip and the month heading already give the date.
   The "Next observance" label is left as rendered. */
(function () {
  "use strict";

  var list = document.querySelector("#annual-calendar [data-annual-calendar]");
  if (!list) return;

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
      var iso = event.getAttribute("data-date");
      if (state && iso && !state.classList.contains("next")) {
        var date = new Date(iso + "T00:00:00Z");
        if (!isNaN(date.getTime())) state.textContent = capitalise(weekday.format(date));
      }
    });
  }

  tidy();
  /* The shared script replaces the list's children on every render; watching
     direct children only means our own edits inside each row never re-trigger. */
  new MutationObserver(tidy).observe(list, { childList: true });
})();
