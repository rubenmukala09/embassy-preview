/* ============================================================================
   case-workflow.html: working model for the proposed staff case-management
   tool. Renders a stage overview and one readable file table from invented
   sample files. Nothing is saved, sent or recorded; reloading restores the
   sample. Text follows the site language (html[lang]) and re-renders when the
   visitor switches between English and French.

   Facts used here (hours, payment method, turnaround, checklists) match the
   Embassy guidance published elsewhere on this site, so the model never
   contradicts the public pages.
   ============================================================================ */
(function () {
  "use strict";

  var app = document.getElementById("cwp-app");
  if (!app) return;

  function lang() {
    return (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "fr" ? "fr" : "en";
  }
  function t(o) { return o[lang()] || o.en; }

  var UI = {
    deskLabel: { en: "Show files held by", fr: "Afficher les dossiers détenus par" },
    reset: { en: "Reset sample", fr: "Réinitialiser l’exemple" },
    pipeline: { en: "Files by stage", fr: "Dossiers par étape" },
    sStage: { en: "Stage", fr: "Étape" },
    sDesk: { en: "Held by", fr: "Poste" },
    sFiles: { en: "Files", fr: "Dossiers" },
    sOldest: { en: "Oldest file", fr: "Plus ancien" },
    sOldestM: { en: "oldest: {age}", fr: "plus ancien : {age}" },
    sideStep: { en: "Paused until the applicant replies", fr: "Suspendu jusqu’à la réponse du demandeur" },
    file: { en: "file", fr: "dossier" },
    files: { en: "files", fr: "dossiers" },
    caption: { en: "Sample files", fr: "Dossiers fictifs" },
    cRef: { en: "Reference", fr: "Référence" },
    cSvc: { en: "Service", fr: "Service" },
    cStage: { en: "Stage", fr: "Étape" },
    cDays: { en: "Days open", fr: "Jours écoulés" },
    cTarget: { en: "Published target", fr: "Délai publié" },
    cStatus: { en: "Status", fr: "Situation" },
    today: { en: "Today", fr: "Aujourd’hui" },
    day: { en: "day", fr: "jour" },
    days: { en: "days", fr: "jours" },
    within: { en: "Within target", fr: "Dans les délais" },
    due: { en: "Due today", fr: "Échéance aujourd’hui" },
    past: { en: "Past target", fr: "Délai dépassé" },
    none: { en: "No fixed target", fr: "Pas de délai fixe" },
    closed: { en: "Closed", fr: "Clôturé" },
    empty: { en: "No files are held by this desk.", fr: "Aucun dossier n’est détenu par ce poste." },
    checklist: { en: "Checklist", fr: "Liste des pièces" },
    history: { en: "History", fr: "Historique" },
    next: { en: "Next step", fr: "Étape suivante" },
    applicant: { en: "Applicant", fr: "Demandeur" },
    received: { en: "received", fr: "reçue" },
    outstanding: { en: "outstanding", fr: "manquante" },
    waiting: { en: "Waiting on the applicant for:", fr: "En attente du demandeur pour :" },
    isClosed: { en: "This file is closed.", fr: "Ce dossier est clôturé." },
    elsewhere: { en: "Held by {desk}. Choose that desk to act on it.", fr: "Détenu par : {desk}. Choisissez ce poste pour agir sur le dossier." },
    moved: { en: "{ref} moved to {stage}. Nothing was saved.", fr: "{ref} : étape « {stage} ». Rien n’a été enregistré." },
    shown: { en: "{desk}: {n} open {files} shown.", fr: "{desk} : {n} {files} à l’écran." },
    restored: { en: "Sample restored to its starting position.", fr: "Exemple rétabli dans sa position de départ." },
    start: { en: "Sample starting point", fr: "Point de départ de l’exemple" },
    sumOpen: { en: "open", fr: "ouverts" },
    sumOpen1: { en: "open", fr: "ouvert" },
    sumHold: { en: "with the applicant", fr: "en attente du demandeur" },
    sumDue: { en: "due today", fr: "à échéance aujourd’hui" },
    closedSub: { en: "Collected or posted", fr: "Retiré ou expédié" }
  };

  var DESKS = [
    { id: "all", name: { en: "All desks", fr: "Tous les postes" },
      duty: { en: "Every open file, whichever desk holds it.", fr: "Tous les dossiers ouverts, quel que soit le poste qui les détient." } },
    { id: "frontdesk", name: { en: "Front desk", fr: "Accueil" },
      duty: { en: "Takes files in, checks them against the published checklist and asks applicants for anything missing.", fr: "Reçoit les dossiers, les vérifie au regard de la liste officielle et demande aux demandeurs les pièces manquantes." } },
    { id: "accounts", name: { en: "Accounts", fr: "Comptabilité" },
      duty: { en: "Verifies the money order or the online passport payment. Fees are non-refundable.", fr: "Vérifie le mandat ou le paiement en ligne du passeport. Les frais ne sont pas remboursables." } },
    { id: "officer", name: { en: "Case officer", fr: "Agent instructeur" },
      duty: { en: "Assesses the file and recommends a decision.", fr: "Instruit le dossier et propose une décision." } },
    { id: "signing", name: { en: "Signing officer", fr: "Agent signataire" },
      duty: { en: "Signs the decision. Visa issuance, validity and number of entries remain at the discretion of DRC immigration services.", fr: "Signe la décision. La délivrance, la validité et le nombre d’entrées des visas relèvent des services d’immigration de la RDC." } },
    { id: "collection", name: { en: "Collection desk", fr: "Guichet de retrait" },
      duty: { en: "Hands files back during pick-up hours, or posts them in the applicant’s prepaid envelope.", fr: "Remet les dossiers pendant les heures de retrait ou les renvoie dans l’enveloppe prépayée du demandeur." } }
  ];

  var STAGES = [
    { id: "received", desk: "frontdesk", name: { en: "Received", fr: "Reçu" } },
    { id: "checking", desk: "frontdesk", name: { en: "Checking documents", fr: "Vérification des pièces" } },
    { id: "hold", desk: "frontdesk", name: { en: "With the applicant", fr: "En attente du demandeur" }, side: true },
    { id: "payment", desk: "accounts", name: { en: "Payment check", fr: "Contrôle du paiement" } },
    { id: "review", desk: "officer", name: { en: "Under review", fr: "En instruction" } },
    { id: "signature", desk: "signing", name: { en: "Awaiting signature", fr: "En attente de signature" } },
    { id: "ready", desk: "collection", name: { en: "Ready", fr: "Prêt" } },
    { id: "closed", desk: null, name: { en: "Closed", fr: "Clôturé" } }
  ];

  var MONEY = { en: "Fee by blank money order", fr: "Frais par mandat (money order) en blanc" };
  var ENVELOPE = { en: "Prepaid, tracked return envelope", fr: "Enveloppe retour prépayée et suivie" };
  var FORM = { en: "Application form, completed, dated and signed", fr: "Formulaire de demande rempli, daté et signé" };
  var PHOTO = { en: "One recent 2 × 2 inch photograph", fr: "Une photo récente de 2 × 2 pouces" };
  var PASSPORT_OK = { en: "Passport valid six months, with two blank visa pages", fr: "Passeport valide six mois, avec deux pages visa vierges" };
  var FEVER = { en: "Yellow-fever vaccination card copy", fr: "Copie du carnet de vaccination contre la fièvre jaune" };
  var FLIGHT = { en: "Flight itinerary copy", fr: "Copie de l’itinéraire de vol" };
  var SIGNED = { en: "Completed and signed form", fr: "Formulaire rempli et signé" };
  var PCOPY = { en: "Passport copy", fr: "Copie du passeport" };

  /* target: number of days for the status check, or null when no fixed figure is published */
  var SERVICES = {
    passport: { name: { en: "Passport", fr: "Passeport" }, target: 90,
      label: { en: "About 90 days", fr: "Environ 90 jours" },
      note: { en: "Pre-registered on passeport.gouv.cd; US $75 fee paid through the Equity BCDC link.", fr: "Préinscription sur passeport.gouv.cd ; frais de 75 USD réglés au moyen du lien Equity BCDC." },
      list: [
        { en: "Biometric information sheet from the online pre-registration", fr: "Fiche de renseignements biométriques issue de la préinscription en ligne" },
        { en: "Note de Perception and proof of payment", fr: "Note de perception et justificatif de paiement" },
        { en: "Current or previous passport, or a police report", fr: "Passeport actuel ou précédent, ou déclaration de police" },
        { en: "Proof of Congolese nationality", fr: "Justificatif de nationalité congolaise" },
        { en: "Valid U.S. residence document", fr: "Titre de séjour américain valide" },
        ENVELOPE ] },
    visaUS: { name: { en: "Visa, U.S. citizen", fr: "Visa, citoyen américain" }, target: 2,
      label: { en: "1–2 business days", fr: "1 à 2 jours ouvrables" },
      note: { en: "Two-year reciprocity visa, US $185.", fr: "Visa de réciprocité de deux ans, 185 USD." },
      list: [FORM, PHOTO, PASSPORT_OK, FEVER, FLIGHT, MONEY] },
    visaNat: { name: { en: "Visa, Congolese national", fr: "Visa, ressortissant congolais" }, target: 1,
      label: { en: "1 business day", fr: "1 jour ouvrable" },
      note: { en: "No host invitation required.", fr: "Aucune invitation n’est exigée." },
      list: [FORM, PHOTO, PASSPORT_OK, FEVER, FLIGHT, ENVELOPE] },
    visaDip: { name: { en: "Visa, diplomatic or official", fr: "Visa diplomatique ou officiel" }, target: 1,
      label: { en: "Same day, within 24 hours", fr: "Le jour même, sous 24 heures" },
      note: { en: "Fee waived.", fr: "Frais exonérés." },
      list: [FORM, PHOTO, { en: "Official U.S. Department of State letter stating the purpose of travel", fr: "Lettre officielle du Département d’État américain précisant l’objet du voyage" }, FEVER, FLIGHT, PASSPORT_OK] },
    visaOther: { name: { en: "Visa, other traveller", fr: "Visa, autre voyageur" }, target: 2,
      label: { en: "2 business days", fr: "2 jours ouvrables" },
      note: { en: "Notarized invitation required.", fr: "Invitation notariée exigée." },
      list: [FORM, PHOTO, { en: "Notarized invitation from the host", fr: "Invitation notariée de l’hôte" }, { en: "Company letter, for business travel", fr: "Lettre de l’entreprise, pour un voyage d’affaires" }, FEVER, PASSPORT_OK, { en: "Permanent Resident Card, or U.S. visa and I‑94, for non-U.S. citizens", fr: "Carte de résident permanent, ou visa américain et formulaire I‑94, pour les non-Américains" }] },
    tenantLieu: { name: { en: "Tenant-Lieu", fr: "Tenant-Lieu" }, target: null,
      label: { en: "A few business days", fr: "Quelques jours ouvrables" },
      note: { en: "One-way travel document to the DRC.", fr: "Document de voyage aller simple vers la RDC." },
      list: [{ en: "Tenant-Lieu application form", fr: "Formulaire de demande de Tenant-Lieu" }, { en: "Copy of the current or previous passport, or a police report", fr: "Copie du passeport actuel ou précédent, ou déclaration de police" }, { en: "Two 2 × 2 inch photographs", fr: "Deux photos de 2 × 2 pouces" }, { en: "Proof of valid U.S. residence", fr: "Justificatif de résidence valide aux États-Unis" }, ENVELOPE] },
    legalization: { name: { en: "Legalization", fr: "Légalisation" }, target: null,
      label: { en: "A few business days", fr: "Quelques jours ouvrables" },
      note: { en: "Requirements differ by document.", fr: "Les exigences varient selon le document." },
      list: [SIGNED, PCOPY, { en: "Original document issued in the DRC", fr: "Document original délivré en RDC" }, MONEY] },
    civil: { name: { en: "Civil-status record", fr: "Acte d’état civil" }, target: null,
      label: { en: "Not published", fr: "Non publié" },
      note: { en: "Birth, marriage or inheritance record.", fr: "Acte de naissance, de mariage ou d’hérédité." },
      list: [SIGNED, PCOPY, { en: "Supporting record issued in the DRC", fr: "Acte justificatif délivré en RDC" }, MONEY] }
  };

  var SEED = [
    { ref: "DEMO-2026-0311", who: "K. M.", svc: "visaDip", stage: "review", days: 1, done: 6 },
    { ref: "DEMO-2026-0310", who: "A. T.", svc: "visaUS", stage: "signature", days: 1, done: 6 },
    { ref: "DEMO-2026-0309", who: "B. L.", svc: "visaOther", stage: "payment", days: 1, done: 5 },
    { ref: "DEMO-2026-0307", who: "N. K.", svc: "visaNat", stage: "checking", days: 0, done: 3 },
    { ref: "DEMO-2026-0305", who: "J. I.", svc: "passport", stage: "review", days: 41, done: 6 },
    { ref: "DEMO-2026-0298", who: "M. W.", svc: "legalization", stage: "hold", days: 12, done: 2,
      holdFor: { en: "Original marriage certificate issued in the DRC", fr: "Acte de mariage original délivré en RDC" } },
    { ref: "DEMO-2026-0296", who: "P. B.", svc: "civil", stage: "ready", days: 4, done: 4 },
    { ref: "DEMO-2026-0288", who: "R. N.", svc: "tenantLieu", stage: "received", days: 0, done: 0 },
    { ref: "DEMO-2026-0274", who: "S. E.", svc: "passport", stage: "payment", days: 6, done: 3 },
    { ref: "DEMO-2026-0261", who: "D. A.", svc: "visaOther", stage: "review", days: 1, done: 6 }
  ];

  var ACTIONS = {
    received: [{ to: "checking", label: { en: "Start the document check", fr: "Commencer la vérification des pièces" }, note: { en: "Check started at the front desk", fr: "Vérification commencée à l’accueil" } }],
    checking: [
      { to: "payment", label: { en: "Checklist complete: send to Accounts", fr: "Dossier complet : transmettre à la comptabilité" }, note: { en: "Checked against the published checklist", fr: "Vérifié selon la liste officielle" } },
      { to: "hold", alt: true, label: { en: "Ask the applicant for a document", fr: "Demander une pièce au demandeur" }, note: { en: "Applicant asked for a missing document", fr: "Pièce manquante demandée au demandeur" } }],
    hold: [{ to: "checking", label: { en: "Document received: resume the check", fr: "Pièce reçue : reprendre la vérification" }, note: { en: "Missing document received", fr: "Pièce manquante reçue" } }],
    payment: [{ to: "review", label: { en: "Payment verified: send for review", fr: "Paiement vérifié : transmettre pour instruction" }, note: { en: "Payment verified by Accounts", fr: "Paiement vérifié par la comptabilité" } }],
    review: [
      { to: "signature", label: { en: "Recommend a decision", fr: "Proposer une décision" }, note: { en: "Decision recommended by the case officer", fr: "Décision proposée par l’agent instructeur" } },
      { to: "hold", alt: true, label: { en: "Ask the applicant for a document", fr: "Demander une pièce au demandeur" }, note: { en: "Applicant asked for a missing document", fr: "Pièce manquante demandée au demandeur" } }],
    signature: [{ to: "ready", label: { en: "Sign and mark ready", fr: "Signer et marquer comme prêt" }, note: { en: "Decision signed", fr: "Décision signée" } }],
    ready: [{ to: "closed", label: { en: "Handed over or posted", fr: "Remis ou expédié" }, note: { en: "Collected at the counter or posted back", fr: "Retiré au guichet ou renvoyé par courrier" } }]
  };

  var cases = [];
  var desk = "all";
  var open = null;
  var live = "";

  function reset() {
    cases = SEED.map(function (c) {
      var copy = {};
      for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) copy[k] = c[k];
      copy.history = [{ stage: c.stage, note: UI.start }];
      return copy;
    });
    open = null;
  }

  function stage(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i];
    return STAGES[0];
  }
  function deskById(id) {
    for (var i = 0; i < DESKS.length; i++) if (DESKS[i].id === id) return DESKS[i];
    return DESKS[0];
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function fmt(tpl, map) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return map[k]; });
  }
  function daysText(n) {
    if (n === 0) return t(UI.today);
    return n + " " + (n === 1 ? t(UI.day) : t(UI.days));
  }
  function status(c) {
    if (c.stage === "closed") return { key: "closed", text: t(UI.closed) };
    var target = SERVICES[c.svc].target;
    if (target === null) return { key: "none", text: t(UI.none) };
    var left = target - c.days;
    if (left > 0) return { key: "within", text: t(UI.within) };
    if (left === 0) return { key: "due", text: t(UI.due) };
    return { key: "past", text: t(UI.past) };
  }
  function visible(c) {
    return desk === "all" || stage(c.stage).desk === desk;
  }
  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="/embassy-preview/aurora/icons.svg#i-' + name + '"/></svg>';
  }

  /* ------------------------------------------------------------ Render */
  function render(focusSel) {
    var L = lang();
    var shown = cases.filter(visible);
    var html = "";

    // Toolbar: desk filter (segmented on wide screens, select on phones) + reset
    html += '<div class="cwp-toolbar">';
    html += '<div class="cwp-desks"><span class="cwp-desks-label" id="cwp-desk-label">' + esc(t(UI.deskLabel)) + "</span>";
    html += '<div class="cwp-seg" role="group" aria-labelledby="cwp-desk-label">';
    DESKS.forEach(function (d) {
      html += '<button type="button" class="cwp-seg-btn" data-desk="' + d.id + '" aria-pressed="' + (d.id === desk) + '">' + esc(t(d.name)) + "</button>";
    });
    html += "</div>";
    html += '<select class="cwp-select" aria-labelledby="cwp-desk-label">';
    DESKS.forEach(function (d) {
      html += '<option value="' + d.id + '"' + (d.id === desk ? " selected" : "") + ">" + esc(t(d.name)) + "</option>";
    });
    html += "</select></div>";
    html += '<button type="button" class="cwp-reset">' + esc(t(UI.reset)) + "</button>";
    html += "</div>";
    html += '<p class="cwp-duty">' + esc(t(deskById(desk).duty)) + "</p>";

    // Stage overview: one compact table (Stage | Held by | Files | Oldest file)
    html += '<div class="cwp-stages-wrap"><table class="cwp-stages"><caption>' + esc(t(UI.pipeline)) + "</caption><thead><tr>" +
      '<th scope="col">' + esc(t(UI.sStage)) + "</th>" +
      '<th scope="col" class="cwp-st-desk">' + esc(t(UI.sDesk)) + "</th>" +
      '<th scope="col" class="cwp-num">' + esc(t(UI.sFiles)) + "</th>" +
      '<th scope="col" class="cwp-num cwp-st-old">' + esc(t(UI.sOldest)) + "</th></tr></thead><tbody>";
    STAGES.forEach(function (st) {
      var inStage = cases.filter(function (c) { return c.stage === st.id; });
      var n = inStage.length;
      var oldest = -1;
      inStage.forEach(function (c) { if (c.days > oldest) oldest = c.days; });
      var rowCls = desk === "all" ? "" : (st.desk === desk ? "is-mine" : "is-dim");
      var sub = st.desk ? t(deskById(st.desk).name) : t(UI.closedSub);
      var age = n && st.id !== "closed" ? daysText(oldest) : "–";
      html += '<tr class="' + rowCls + (n ? "" : " is-empty") + '">' +
        '<th scope="row"><span class="cwp-st-name">' + esc(t(st.name)) + "</span>" +
        (st.side ? '<span class="cwp-st-note">' + esc(t(UI.sideStep)) + "</span>" : "") +
        '<span class="cwp-st-desk-m">' + esc(sub) + (age !== "–" ? " · " + esc(fmt(t(UI.sOldestM), { age: age.toLowerCase() })) : "") + "</span></th>" +
        '<td class="cwp-st-desk">' + esc(sub) + "</td>" +
        '<td class="cwp-num"><b>' + n + "</b></td>" +
        '<td class="cwp-num cwp-st-old">' + esc(age) + "</td></tr>";
    });
    html += "</tbody></table></div>";

    // Summary line (neutral text, no alarm counters)
    var openN = shown.filter(function (c) { return c.stage !== "closed"; }).length;
    var holdN = shown.filter(function (c) { return c.stage === "hold"; }).length;
    var dueN = shown.filter(function (c) { return status(c).key === "due"; }).length;
    var fileWord = openN === 1 ? t(UI.file) : t(UI.files);
    var openWord = openN === 1 ? t(UI.sumOpen1) : t(UI.sumOpen);
    html += '<p class="cwp-summary" tabindex="-1">' +
      "<span><b>" + openN + "</b> " + esc(L === "fr" ? fileWord + " " + openWord : openWord + " " + fileWord) + "</span>" +
      "<span><b>" + holdN + "</b> " + esc(t(UI.sumHold)) + "</span>" +
      "<span><b>" + dueN + "</b> " + esc(t(UI.sumDue)) + "</span></p>";

    // File table
    var cols = [UI.cRef, UI.cSvc, UI.cStage, UI.cDays, UI.cTarget, UI.cStatus];
    html += '<div class="cwp-table-wrap"><table class="cwp-files"><caption class="cwp-sr">' + esc(t(UI.caption)) + "</caption><thead><tr>";
    cols.forEach(function (c, i) {
      html += '<th scope="col"' + (i === 3 ? ' class="cwp-num"' : "") + ">" + esc(t(c)) + "</th>";
    });
    html += "</tr></thead><tbody>";

    var order = STAGES.map(function (s) { return s.id; });
    var rows = shown.slice().sort(function (a, b) {
      return order.indexOf(a.stage) - order.indexOf(b.stage) || b.days - a.days;
    });
    if (!rows.length) {
      html += '<tr class="cwp-empty"><td colspan="6">' + esc(t(UI.empty)) + "</td></tr>";
    }
    rows.forEach(function (c) {
      var svc = SERVICES[c.svc];
      var st = status(c);
      var isOpen = open === c.ref;
      var did = "cwp-d-" + c.ref.replace(/\W/g, "");
      html += '<tr class="cwp-row' + (isOpen ? " is-open" : "") + '">' +
        '<th scope="row" data-label="' + esc(t(UI.cRef)) + '"><button type="button" class="cwp-open" data-ref="' + c.ref + '" aria-expanded="' + isOpen + '" aria-controls="' + did + '">' +
        "<span>" + esc(c.ref) + "</span>" + icon("chevron-down") + "</button></th>" +
        '<td data-label="' + esc(t(UI.cSvc)) + '">' + esc(t(svc.name)) + "</td>" +
        '<td data-label="' + esc(t(UI.cStage)) + '">' + esc(t(stage(c.stage).name)) + "</td>" +
        '<td class="cwp-num" data-label="' + esc(t(UI.cDays)) + '">' + esc(daysText(c.days)) + "</td>" +
        '<td data-label="' + esc(t(UI.cTarget)) + '">' + esc(t(svc.label)) + "</td>" +
        '<td data-label="' + esc(t(UI.cStatus)) + '"><span class="cwp-status is-' + st.key + '">' + esc(st.text) + "</span></td></tr>";
      if (isOpen) html += '<tr class="cwp-detail-row" id="' + did + '"><td colspan="6">' + detail(c) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    html += '<p class="cwp-live" role="status" aria-live="polite">' + esc(live) + "</p>";

    app.innerHTML = html;
    if (focusSel) {
      var f = app.querySelector(focusSel);
      if (f) f.focus();
    }
  }

  function detail(c) {
    var svc = SERVICES[c.svc];
    var st = stage(c.stage);
    var h = '<div class="cwp-detail">';
    h += '<div class="cwp-detail-head"><h3 tabindex="-1">' + esc(c.ref) + "</h3><p>" +
      esc(t(svc.name)) + " · " + esc(t(UI.applicant)) + " " + esc(c.who) + " · " + esc(t(svc.note)) + "</p></div>";

    h += '<div class="cwp-detail-cols">';
    // Checklist
    h += '<div class="cwp-dcol"><h4>' + esc(t(UI.checklist)) + '</h4><ul class="cwp-check">';
    svc.list.forEach(function (item, i) {
      var ok = i < c.done;
      h += '<li class="' + (ok ? "is-ok" : "is-todo") + '">' + icon(ok ? "circle-check" : "clock") +
        "<span>" + esc(t(item)) + '<span class="cwp-sr"> (' + esc(ok ? t(UI.received) : t(UI.outstanding)) + ")</span></span></li>";
    });
    h += "</ul>";
    if (c.stage === "hold" && c.holdFor) {
      h += '<p class="cwp-hold">' + esc(t(UI.waiting)) + " <strong>" + esc(t(c.holdFor)) + "</strong></p>";
    }
    h += "</div>";

    // History
    h += '<div class="cwp-dcol"><h4>' + esc(t(UI.history)) + '</h4><ol class="cwp-hist">';
    c.history.forEach(function (e) {
      h += "<li><b>" + esc(t(stage(e.stage).name)) + "</b><span>" + esc(t(e.note)) + "</span></li>";
    });
    h += "</ol></div>";

    // Next step (gated on the desk that holds the file)
    h += '<div class="cwp-dcol cwp-dcol-act"><h4>' + esc(t(UI.next)) + "</h4>";
    var acts = ACTIONS[c.stage] || [];
    if (!acts.length) {
      h += '<p class="cwp-muted">' + esc(t(UI.isClosed)) + "</p>";
    } else if (desk !== "all" && st.desk !== desk) {
      h += '<p class="cwp-muted">' + esc(fmt(t(UI.elsewhere), { desk: t(deskById(st.desk).name) })) + "</p>";
    } else {
      h += '<div class="cwp-acts">';
      acts.forEach(function (a, i) {
        h += '<button type="button" class="btn ' + (a.alt ? "btn-outline" : "btn-navy") + ' cwp-act" data-ref="' + c.ref + '" data-act="' + i + '">' + esc(t(a.label)) + "</button>";
      });
      h += "</div>";
    }
    h += "</div></div></div>";
    return h;
  }

  function deskLive() {
    var n = cases.filter(function (c) { return visible(c) && c.stage !== "closed"; }).length;
    return fmt(t(UI.shown), { desk: t(deskById(desk).name), n: n, files: n === 1 ? t(UI.file) : t(UI.files) });
  }

  function find(ref) {
    for (var i = 0; i < cases.length; i++) if (cases[i].ref === ref) return cases[i];
    return null;
  }

  /* ------------------------------------------------------------ Events */
  app.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b || !app.contains(b)) return;

    if (b.classList.contains("cwp-seg-btn")) {
      desk = b.getAttribute("data-desk");
      open = null;
      live = deskLive();
      render('.cwp-seg-btn[data-desk="' + desk + '"]');
    } else if (b.classList.contains("cwp-reset")) {
      reset();
      desk = "all";
      live = t(UI.restored);
      render(".cwp-reset");
    } else if (b.classList.contains("cwp-open")) {
      var ref = b.getAttribute("data-ref");
      open = open === ref ? null : ref;
      render(open ? ".cwp-detail h3" : '.cwp-open[data-ref="' + ref + '"]');
    } else if (b.classList.contains("cwp-act")) {
      var c = find(b.getAttribute("data-ref"));
      var a = c && (ACTIONS[c.stage] || [])[Number(b.getAttribute("data-act"))];
      if (!c || !a) return;
      c.stage = a.to;
      if (a.to === "checking" && c.done < 2) c.done = 2;
      if (a.to === "review") c.done = SERVICES[c.svc].list.length;
      c.history.push({ stage: a.to, note: a.note });
      live = fmt(t(UI.moved), { ref: c.ref, stage: t(stage(a.to).name) });
      var stillShown = visible(c);
      if (!stillShown) open = null;
      render(stillShown ? ".cwp-detail h3" : ".cwp-summary");
    }
  });

  app.addEventListener("change", function (e) {
    if (e.target && e.target.classList.contains("cwp-select")) {
      desk = e.target.value;
      open = null;
      live = deskLive();
      render(".cwp-select");
    }
  });

  // Follow the site language switch (aurora.js sets html[lang]).
  new MutationObserver(function () { live = ""; render(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  reset();
  render();
})();
