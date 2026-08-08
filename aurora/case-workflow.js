/* ===========================================================================
   Consular case workflow — a working model of the Embassy's counter process
   ---------------------------------------------------------------------------
   This drives the demonstration board on case-workflow.html. It is a model,
   not a system: every file is invented, nothing is persisted, and nothing
   leaves the page. Reloading restores the original board, which is stated on
   the page so nobody mistakes it for live casework.

   The stages, service turnaround targets and counter hours all follow the
   Embassy's published guidance rather than an invented process — a passport
   is measured against 90 days, a diplomatic visa against 24 hours, and
   payment can only clear by money order because that is the only method the
   Embassy accepts.

   Applicants appear as a reference number and initials. Inventing plausible
   full identities for a public demo would make the board look like real
   records, which is exactly what it must not look like.
   ======================================================================== */
(function () {
  "use strict";

  var board = document.getElementById("cw-board");
  if (!board) return;

  var detailEl = document.getElementById("cw-detail");
  var statsEl = document.getElementById("cw-stats");
  var liveEl = document.getElementById("cw-live");
  var tabsEl = document.querySelector(".cw-role-tabs");
  var dutyEl = document.getElementById("cw-role-duty");
  var resetBtn = document.getElementById("cw-reset");

  /* ---- The process ------------------------------------------------------
     Seven stages. Each names the desk that owns the file while it sits
     there, so the board answers "who is holding this?" not just "where is
     it?". `terminal` stages have no onward action. */
  var STAGES = [
    { id: "received",   name: "Received",          desk: "frontdesk", blurb: "Handed in at the counter or arrived by post." },
    { id: "checking",   name: "Checking documents", desk: "frontdesk", blurb: "Checked item by item against the published checklist." },
    { id: "payment",    name: "Awaiting payment",   desk: "accounts",  blurb: "Money order, cashier's or certified check to be verified." },
    { id: "review",     name: "Under review",       desk: "officer",   blurb: "Assessed by Consular Affairs." },
    { id: "signature",  name: "Awaiting signature", desk: "head",      blurb: "Decision taken, awaiting the Head of Consular Affairs." },
    { id: "ready",      name: "Ready",              desk: "collection", blurb: "For collection at the counter, or posting in the applicant's prepaid envelope." },
    { id: "closed",     name: "Closed",             desk: null,        blurb: "Collected or dispatched.", terminal: true }
  ];

  /* A file can also stall: the applicant has been asked for something. */
  var HOLD = { id: "hold", name: "With the applicant", desk: "frontdesk", blurb: "Waiting on a document the applicant must supply." };

  var ROLES = [
    { id: "all",        name: "Whole office", duty: "Every file in the building, whichever desk is holding it." },
    { id: "frontdesk",  name: "Front desk",   duty: "Takes files in, checks them against the checklist, issues the receipt and hands files back out." },
    { id: "accounts",   name: "Accounts",     duty: "Verifies the money order or certified check. Fees are not refundable once accepted." },
    { id: "officer",    name: "Consular officer", duty: "Assesses the file and proposes the decision." },
    { id: "head",       name: "Head of Consular Affairs", duty: "Signs the decision. Issuance, validity and number of entries stay at the discretion of DRC immigration services." },
    { id: "collection", name: "Collection desk", duty: "Hands files over Mon–Thu 14:00–16:00 and Fri 10:00–13:00, or posts them back." }
  ];

  /* Published turnaround, in working days, per service. */
  var SERVICES = {
    passport:    { name: "Passport",                    target: 90, unit: "days",     note: "Pre-registration at passeport.gouv.cd, USD 75." },
    visaUS:      { name: "Visa — U.S. citizen",         target: 2,  unit: "bus. days", note: "Two-year reciprocity visa, USD 185." },
    visaNat:     { name: "Visa — Congolese national",   target: 1,  unit: "bus. days", note: "No host invitation required." },
    visaDip:     { name: "Visa — diplomatic / official", target: 1, unit: "bus. days", note: "Fee waived. Same day where possible." },
    visaOther:   { name: "Visa — other traveller",      target: 2,  unit: "bus. days", note: "Notarized invitation required." },
    tenantLieu:  { name: "Tenant-lieu",                 target: 90, unit: "days",     note: "One-way travel document, by post." },
    legalization:{ name: "Legalization",                target: 10, unit: "days",     note: "Turnaround not published; 10 days used here." },
    civil:       { name: "Civil document",              target: 10, unit: "days",     note: "Turnaround not published; 10 days used here." }
  };

  /* Checklists, taken from the Embassy's published requirements. */
  var CHECKLISTS = {
    passport: ["Biometric information sheet from the online pre-registration", "Proof of payment", "Current or previous passport bio page, or a police report", "Proof of Congolese nationality", "Valid U.S. residency document", "Prepaid, tracked return envelope"],
    visaUS: ["Application form, completed, dated and signed", "One 2 × 2 inch photograph taken within six months", "Passport with six months' validity and two blank visa pages", "Yellow-fever vaccination card copy", "Flight itinerary copy", "Payment by money order or certified check"],
    visaNat: ["Application form, completed, dated and signed", "One 2 × 2 inch photograph taken within six months", "Passport with six months' validity and two blank visa pages", "Yellow-fever vaccination card copy", "Flight itinerary copy", "Prepaid, tracked return envelope"],
    visaDip: ["Application form, completed, dated and signed", "One 2 × 2 inch photograph taken within six months", "Official State Department letter stating the purpose of travel", "Yellow-fever vaccination card copy", "Flight itinerary copy", "Passport with six months' validity and two blank visa pages"],
    visaOther: ["Application form, completed, dated and signed", "One 2 × 2 inch photograph taken within six months", "Notarized invitation from the host", "Company letter, for business travel", "Yellow-fever vaccination card copy", "Passport with six months' validity and two blank visa pages", "Permanent Resident Card or U.S. visa and I-94, for non-U.S. citizens"],
    tenantLieu: ["Tenant-lieu application form", "Copy of the current or previous passport, or a police report", "Two 2 × 2 inch photographs taken within six months", "Proof of valid U.S. residence", "Prepaid return shipping label with tracking"],
    legalization: ["Completed and signed form", "Passport copy", "The original document issued in the DRC", "Payment by money order or certified check"],
    civil: ["Completed and signed form", "Passport copy", "Supporting certificate issued in the DRC", "Payment by money order or certified check"]
  };

  /* The starting board. Ages are in days-in-stage so the SLA colouring has
     something to bite on; two files are deliberately overdue. */
  var SEED = [
    { ref: "DEMO-2026-0311", who: "K. M.", svc: "visaDip",     stage: "review",    age: 2,  done: 6 },
    { ref: "DEMO-2026-0310", who: "A. T.", svc: "visaUS",      stage: "signature", age: 1,  done: 6 },
    { ref: "DEMO-2026-0309", who: "B. L.", svc: "visaOther",   stage: "payment",   age: 3,  done: 5 },
    { ref: "DEMO-2026-0307", who: "N. K.", svc: "visaNat",     stage: "checking",  age: 1,  done: 3 },
    { ref: "DEMO-2026-0305", who: "J. I.", svc: "passport",    stage: "review",    age: 34, done: 6 },
    { ref: "DEMO-2026-0298", who: "M. W.", svc: "legalization", stage: "hold",     age: 12, done: 2, holdFor: "Original marriage certificate issued in the DRC" },
    { ref: "DEMO-2026-0296", who: "P. B.", svc: "civil",       stage: "ready",     age: 2,  done: 4 },
    { ref: "DEMO-2026-0288", who: "R. N.", svc: "tenantLieu",  stage: "received",  age: 1,  done: 0 },
    { ref: "DEMO-2026-0274", who: "S. E.", svc: "passport",    stage: "payment",   age: 6,  done: 3 },
    { ref: "DEMO-2026-0261", who: "D. A.", svc: "visaOther",   stage: "review",    age: 4,  done: 6 }
  ];

  var cases = [];
  var role = "all";
  var selected = null;

  function reset() {
    cases = SEED.map(function (c) {
      var copy = {};
      for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) copy[k] = c[k];
      copy.history = [{ stage: copy.stage, note: "Opening position of this demonstration" }];
      return copy;
    });
    selected = null;
  }

  function stageById(id) {
    if (id === "hold") return HOLD;
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i];
    return STAGES[0];
  }

  function stageIndex(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return i;
    return -1;
  }

  /* Overdue is measured against the file's own service target, not a single
     office-wide number — that is the whole point of showing it. */
  function isOverdue(c) {
    var svc = SERVICES[c.svc];
    return !!svc && c.stage !== "closed" && c.stage !== "hold" && c.age > svc.target;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function visible(c) {
    if (role === "all") return true;
    return stageById(c.stage).desk === role;
  }

  /* ---- Rendering -------------------------------------------------------- */

  function renderRoles() {
    tabsEl.innerHTML = "";
    ROLES.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cw-role-tab" + (r.id === role ? " is-on" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", r.id === role ? "true" : "false");
      b.textContent = r.name;
      b.addEventListener("click", function () {
        role = r.id;
        selected = null;
        render();
        say("Showing " + r.name + ". " + r.duty);
      });
      tabsEl.appendChild(b);
    });
    for (var i = 0; i < ROLES.length; i++) {
      if (ROLES[i].id === role) { dutyEl.textContent = ROLES[i].duty; break; }
    }
  }

  function renderStats() {
    var shown = cases.filter(visible);
    var overdue = shown.filter(isOverdue).length;
    var onHold = shown.filter(function (c) { return c.stage === "hold"; }).length;
    var open = shown.filter(function (c) { return c.stage !== "closed"; }).length;
    statsEl.innerHTML =
      stat(open, "open with this desk") +
      stat(overdue, "past its published target", overdue ? "is-warn" : "") +
      stat(onHold, "waiting on the applicant");
  }

  function stat(n, label, cls) {
    return '<div class="cw-stat ' + (cls || "") + '"><b>' + n + "</b><span>" + esc(label) + "</span></div>";
  }

  function renderBoard() {
    board.innerHTML = "";
    var cols = STAGES.slice();
    cols.splice(2, 0, HOLD); // hold sits beside the early stages, where it happens

    cols.forEach(function (st) {
      var inCol = cases.filter(function (c) { return c.stage === st.id && visible(c); });
      var col = document.createElement("section");
      col.className = "cw-col" + (st.id === "hold" ? " is-hold" : "");
      col.setAttribute("aria-label", st.name + ", " + inCol.length + " files");

      var head = document.createElement("header");
      head.className = "cw-col-head";
      head.innerHTML = "<h3>" + esc(st.name) + "</h3><span class='cw-count'>" + inCol.length + "</span>";
      col.appendChild(head);

      var note = document.createElement("p");
      note.className = "cw-col-blurb";
      note.textContent = st.blurb;
      col.appendChild(note);

      if (!inCol.length) {
        var none = document.createElement("p");
        none.className = "cw-empty";
        none.textContent = "Nothing here.";
        col.appendChild(none);
      }

      inCol.forEach(function (c) {
        col.appendChild(card(c));
      });

      board.appendChild(col);
    });
  }

  function card(c) {
    var svc = SERVICES[c.svc];
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cw-card" + (isOverdue(c) ? " is-late" : "") + (selected === c.ref ? " is-sel" : "");
    b.setAttribute("aria-pressed", selected === c.ref ? "true" : "false");
    b.innerHTML =
      '<span class="cw-ref">' + esc(c.ref) + "</span>" +
      '<span class="cw-svc">' + esc(svc.name) + "</span>" +
      '<span class="cw-meta"><span class="cw-who">' + esc(c.who) + "</span>" +
      '<span class="cw-age">' + c.age + " " + (c.age === 1 ? "day" : "days") +
      (isOverdue(c) ? " · over target" : "") + "</span></span>";
    b.addEventListener("click", function () {
      selected = selected === c.ref ? null : c.ref;
      render();
      if (selected) {
        var h = detailEl.querySelector("h3");
        if (h) h.focus();
      }
    });
    return b;
  }

  function renderDetail() {
    if (!selected) {
      detailEl.innerHTML = '<div class="cw-detail-empty"><p>Select a file to see its checklist, where it has been and what this desk can do with it next.</p></div>';
      return;
    }
    var c = null;
    for (var i = 0; i < cases.length; i++) if (cases[i].ref === selected) c = cases[i];
    if (!c) { detailEl.innerHTML = ""; return; }

    var svc = SERVICES[c.svc];
    var st = stageById(c.stage);
    var list = CHECKLISTS[c.svc] || [];

    var html = '<div class="cw-detail-in">';
    html += '<h3 tabindex="-1">' + esc(c.ref) + "</h3>";
    html += '<p class="cw-detail-svc">' + esc(svc.name) + " · applicant " + esc(c.who) + "</p>";
    html += '<p class="cw-detail-note">' + esc(svc.note) + "</p>";

    html += '<dl class="cw-facts">';
    html += "<dt>Stage</dt><dd>" + esc(st.name) + "</dd>";
    html += "<dt>In this stage</dt><dd>" + c.age + " " + (c.age === 1 ? "day" : "days") + "</dd>";
    html += "<dt>Published target</dt><dd>" + svc.target + " " + esc(svc.unit) +
            (isOverdue(c) ? ' <span class="cw-flag">over target</span>' : "") + "</dd>";
    html += "</dl>";

    if (c.stage === "hold" && c.holdFor) {
      html += '<p class="cw-hold">Waiting on the applicant for: <strong>' + esc(c.holdFor) + "</strong></p>";
    }

    html += "<h4>Checklist</h4><ul class='cw-check'>";
    list.forEach(function (item, i) {
      var ok = i < c.done;
      html += "<li class='" + (ok ? "is-ok" : "is-todo") + "'><span aria-hidden='true'>" + (ok ? "✓" : "○") +
              "</span> " + esc(item) + "<span class='cw-sr'>" + (ok ? " — received" : " — outstanding") + "</span></li>";
    });
    html += "</ul>";

    html += "<h4>History</h4><ol class='cw-hist'>";
    c.history.forEach(function (h) {
      html += "<li><b>" + esc(stageById(h.stage).name) + "</b><span>" + esc(h.note) + "</span></li>";
    });
    html += "</ol>";

    html += '<div class="cw-do" id="cw-do"></div>';
    html += "</div>";
    detailEl.innerHTML = html;

    renderActions(c);
  }

  /* Actions are gated on the desk that owns the current stage, so switching
     role visibly changes what can be done — that is the workflow, not
     decoration. */
  function renderActions(c) {
    var wrap = detailEl.querySelector("#cw-do");
    if (!wrap) return;
    var st = stageById(c.stage);
    var mine = role === "all" || st.desk === role;

    if (st.terminal) {
      wrap.innerHTML = '<p class="cw-do-none">This file is closed.</p>';
      return;
    }
    if (!mine) {
      wrap.innerHTML = '<p class="cw-do-none">Held by the ' + esc(deskName(st.desk)) + '. Switch to that desk to act on it.</p>';
      return;
    }

    var acts = [];
    if (c.stage === "hold") {
      acts.push({ label: "Applicant supplied it", to: "checking", note: "Outstanding document received" });
    } else {
      var next = STAGES[stageIndex(c.stage) + 1];
      if (next) acts.push({ label: advanceLabel(c.stage), to: next.id, note: advanceNote(c.stage) });
      if (c.stage === "checking" || c.stage === "review") {
        acts.push({ label: "Ask the applicant for a document", to: "hold", note: "Applicant asked for a missing item", warn: true });
      }
    }

    wrap.innerHTML = "<h4>What this desk can do</h4>";
    acts.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn " + (a.warn ? "btn-ghost" : "btn-gold") + " cw-act";
      b.textContent = a.label;
      b.addEventListener("click", function () { move(c, a); });
      wrap.appendChild(b);
    });
  }

  function deskName(id) {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].id === id) return ROLES[i].name;
    return "another desk";
  }

  function advanceLabel(stage) {
    return {
      received: "Start the document check",
      checking: "Checklist complete — send to Accounts",
      payment: "Payment verified — send for review",
      review: "Recommend a decision",
      signature: "Sign and mark ready",
      ready: "Handed over / posted"
    }[stage] || "Move on";
  }

  function advanceNote(stage) {
    return {
      received: "Opened at the front desk",
      checking: "Checked against the published checklist",
      payment: "Money order verified by Accounts",
      review: "Assessed by Consular Affairs",
      signature: "Signed by the Head of Consular Affairs",
      ready: "Collected at the counter or posted back"
    }[stage] || "Moved on";
  }

  function move(c, action) {
    c.stage = action.to;
    c.age = 0;
    if (action.to === "checking" && c.done < 2) c.done = 2;
    if (action.to === "review") c.done = (CHECKLISTS[c.svc] || []).length;
    c.history.push({ stage: action.to, note: action.note });
    render();
    say(c.ref + " moved to " + stageById(action.to).name + ". Nothing was saved.");
  }

  function say(msg) {
    liveEl.textContent = msg;
  }

  function render() {
    renderRoles();
    renderStats();
    renderBoard();
    renderDetail();
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      reset();
      render();
      say("Board reset to its opening position.");
    });
  }

  reset();
  render();
})();
