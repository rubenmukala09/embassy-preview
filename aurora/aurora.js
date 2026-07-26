/* ============================================================================
   Embassy of the DRC, "Aurora" interactivity layer (vanilla JS, no deps)
   Progressive enhancement: every module feature-detects its markup and no-ops
   if absent, so it runs safely on every page.
   ============================================================================ */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  };

  /* ---- 1. Primary-nav dropdowns (injected from config) ----------------- */
  const SUBNAV = {
    "the-embassy.html": {
      label: "The Embassy",
      items: [
        ["About the Embassy", "the-embassy.html", "Our mission, history and role in the U.S."],
        ["The Ambassador", "the-embassy.html#ambassador", "Message and biography of the Head of Mission"],
        ["Divisions", "the-embassy.html#divisions", "Consular, political, economic & cultural sections"],
      ],
    },
    "dr-congo.html": {
      label: "Discover the DRC",
      items: [
        ["About DR Congo", "dr-congo.html", "Geography, people and the essential facts"],
        ["Invest in DRC", "dr-congo.html#invest", "Opportunities, key sectors and incentives"],
        ["Tourism", "dr-congo.html#tourism", "National parks, wildlife and destinations"],
        ["Culture & Heritage", "dr-congo.html#culture", "Music, art and Congolese traditions"],
      ],
    },
    "consular-services.html": {
      label: "Services for our citizens",
      items: [
        ["Passports", "consular-services.html#passport", "Apply for or renew your biometric passport"],
        ["Visas", "consular-services.html#visa", "Entry visas for travel to the DRC"],
        ["Tenant-Lieu", "consular-services.html#tenant-lieu", "Emergency travel document (laissez-passer)"],
        ["Legalization", "consular-services.html#legalization", "Authenticate documents and signatures"],
        ["Fees & Processing", "consular-services.html#fees", "Service costs and turnaround times"],
      ],
    },
  };
  const arrowSvg =
    '<svg class="ns-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
  $$(".mainnav > a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    const cfg = SUBNAV[href];
    if (!cfg) return;
    const group = el('<span class="nav-group"></span>');
    a.parentNode.insertBefore(group, a);
    group.appendChild(a);
    a.classList.add("has-sub");
    a.appendChild(el('<span class="chev">▾</span>'));
    group.appendChild(
      el(
        '<div class="nav-sub" role="menu">' +
          '<div class="ns-label">' + cfg.label + "</div>" +
          cfg.items
            .map(
              ([t, h, d]) =>
                `<a href="${h}" role="menuitem"><b>${t}${arrowSvg}</b><span>${d}</span></a>`,
            )
            .join("") +
          "</div>",
      ),
    );
  });

  /* ---- 2. Mobile menu --------------------------------------------------- */
  const nav = $(".mainnav");
  if (nav) {
    const toggle = el(
      '<button class="nav-toggle" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>',
    );
    nav.appendChild(toggle);
    const links = $$(".mainnav > a, .nav-group > a")
      .map((a) => `<a href="${a.getAttribute("href")}">${a.firstChild.textContent.trim()}</a>`)
      .join("");
    const menu = el(
      '<div class="mobile-menu" role="dialog" aria-label="Menu"><button class="mm-close" aria-label="Close">×</button>' +
        links +
        '<a href="portal.html" class="mm-cta">Request an appointment →</a>' +
        '<a class="mm-logo" href="/embassy-preview/" aria-label="Embassy of the DRC - home">' +
          '<svg class="crest" aria-hidden="true"><use href="#crest"/></svg>' +
          '<span><b>EMBASSY OF THE DRC</b><small>Washington, D.C.</small></span>' +
        '</a></div>',
    );
    const scrim = el('<div class="scrim"></div>');
    document.body.append(scrim, menu);
    const open = () => {
      menu.classList.add("open");
      scrim.classList.add("open");
    };
    const close = () => {
      menu.classList.remove("open");
      scrim.classList.remove("open");
    };
    toggle.addEventListener("click", open);
    scrim.addEventListener("click", close);
    $(".mm-close", menu).addEventListener("click", close);
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---- 2b. Docked quick-access bar: hide while scrolling, reveal when idle -- */
  (function () {
    const band = document.querySelector(".qa-band");
    if (!band) return;
    let t;
    window.addEventListener(
      "scroll",
      () => {
        band.classList.add("qa-hiding");          // fade/slide out while scrolling
        clearTimeout(t);
        t = setTimeout(() => band.classList.remove("qa-hiding"), 240); // reveal when it stops
      },
      { passive: true },
    );
  })();

  /* ---- 2c. Scroll-spy: light the docked-nav item for the section in view --- */
  (function () {
    const tiles = $$(".qa-band .qtile");
    if (!tiles.length || !("IntersectionObserver" in window)) return;
    const pairs = [];
    tiles.forEach((tile) => {
      const href = tile.getAttribute("href") || "";
      const id = href.indexOf("#") >= 0 ? href.split("#")[1] : "";
      const sec = id && document.getElementById(id);
      if (sec) pairs.push({ tile, sec });
    });
    if (!pairs.length) return;                     // this page's shortcuts aren't on-page sections
    const light = (tile) => tiles.forEach((t) => t.classList.toggle("active", t === tile));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const p = pairs.find((x) => x.sec === e.target);
          if (p) light(p.tile);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },         // "active" once the section reaches mid-screen
    );
    pairs.forEach((p) => io.observe(p.sec));
  })();

  /* ---- 2d. Slim scroll-progress line at the top of the page --------------- */
  (function () {
    const bar = el('<div class="scroll-prog" aria-hidden="true"></div>');
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  })();

  /* ---- 3. Smooth in-page scrolling ------------------------------------- */
  $$('a[href*="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = a.getAttribute("href");
      const hash = url.includes("#") ? "#" + url.split("#")[1] : "";
      const samePage =
        url.startsWith("#") ||
        url.split("#")[0] === "" ||
        url.split("#")[0] === location.pathname.split("/").pop();
      if (hash && samePage) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", hash);
        }
      }
    });
  });

  /* ---- 4. Scroll reveal ------------------------------------------------- */
  const revealTargets = $$(
    ".section > .container > *, .qgrid, .card, .ncard, .step, .stat, .kpi, .panel, .tile",
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((t) => t.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in"), (i % 6) * 50);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    revealTargets.forEach((t) => io.observe(t));
  }

  /* ---- 5. Count-up stats ------------------------------------------------ */
  const counters = $$(".stat b, .kpi b, .hero .meta b");
  const animate = (node) => {
    const raw = node.textContent.trim();
    const m = raw.match(/^([\d,]+)(\D*)$/);
    if (!m) return;
    const end = parseInt(m[1].replace(/,/g, ""), 10);
    if (!end || end > 1000000) return;
    const suffix = m[2] || "";
    const dur = 900,
      t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
      node.textContent = v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else node.textContent = raw;
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (es, obs) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.5 },
    );
    counters.forEach((c) => co.observe(c));
  }

  /* ---- 6. Toast --------------------------------------------------------- */
  function toast(msg) {
    const t = el(
      '<div class="toast"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span>' +
        msg +
        "</span></div>",
    );
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 300);
    }, 3200);
  }

  /* ---- 7. Forms: validate + success ------------------------------------ */
  // A "form context" = an element containing .field inputs.
  function fieldsIn(scope) {
    return $$(".field input, .field select, .field textarea", scope);
  }
  function validate(scope) {
    let ok = true;
    fieldsIn(scope).forEach((f) => {
      if (f.hasAttribute("data-optional")) return; // optional fields never block
      if (!f.value.trim()) {
        f.style.borderColor = "var(--bad)";
        ok = false;
        f.addEventListener(
          "input",
          () => (f.style.borderColor = ""),
          { once: true },
        );
      }
    });
    return ok;
  }
  $$("button").forEach((btn) => {
    const label = btn.textContent.trim().toLowerCase();
    const isSubmit =
      /send|subscribe|check status|check|sign in|register|book|submit|request|message|apply|save|update|reserve/.test(
        label,
      );
    if (!isSubmit) return;
    // skip dashboard/admin table action buttons handled elsewhere
    if (btn.closest(".aside")) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const scope =
        btn.closest("form, .card, .panel, .pb, section") || document;

      // status check -> real lookup against cases / appointments
      if (/check/.test(label)) {
        if (!validate(scope)) return;
        checkStatus(scope, btn);
        return;
      }
      // newsletter (single email + subscribe) -> real subscription
      if (/subscribe/.test(label)) {
        // scope to the button's own box (footer uses .news, not a form/section)
        const box = btn.closest(".news, form, .card, .panel, .pb, section") || btn.parentElement || scope;
        const email = box.querySelector('input[type="email"], input');
        if (!email || !email.value.trim()) {
          if (email) {
            email.style.borderColor = "var(--bad)";
            email.addEventListener("input", () => (email.style.borderColor = ""), { once: true });
          }
          return;
        }
        postIntake("/intake/newsletter", { email: email.value.trim() })
          .then((d) => { email.value = ""; toast(d.message || "You're subscribed to Embassy updates."); })
          .catch(() => { email.value = ""; toast("You're subscribed to Embassy updates. (Offline preview.)"); });
        return;
      }
      // booking / appointment
      if (/book|appointment/.test(label)) {
        if (!validate(scope)) return;
        renderBooking(scope);
        btn.disabled = true;
        btn.style.opacity = ".55";
        return;
      }
      // generic form (contact, message, request, apply…)
      if (fieldsIn(scope).length) {
        if (!validate(scope)) return;
        const intakeEl = btn.closest("[data-intake]");
        if (intakeEl && intakeEl.dataset.intake === "inquiry") {
          submitInquiry(intakeEl, btn);
          return;
        }
        if (intakeEl && intakeEl.dataset.intake === "suggestion") {
          submitSuggestion(intakeEl, btn);
          return;
        }
        if (intakeEl && intakeEl.dataset.intake === "registration") {
          submitRegistration(intakeEl, btn);
          return;
        }
        if (intakeEl && intakeEl.dataset.intake === "legal-partner") {
          submitLegalPartner(intakeEl, btn);
          return;
        }
        if (intakeEl && intakeEl.dataset.intake === "event") {
          submitEvent(intakeEl, btn);
          return;
        }
        const success = el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><div><b>Thank you, your request was received.</b><br/>This is a demo: no data is stored. The Embassy would respond within 2 business days.</div></div>',
        );
        const form = btn.closest("form, .card, .pb") || scope;
        form.appendChild(success);
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        btn.disabled = true;
        btn.style.opacity = ".55";
      } else {
        toast("Done, this is a demo action.");
      }
    });
  });

  /* Real status lookup: query the embassy for this reference + last name. */
  function checkStatus(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const reference = (v("ref") || fieldsIn(scope)[0]?.value || "").trim();
    const lastName = v("ln") || fieldsIn(scope)[1]?.value?.trim() || "";
    const render = (html) => {
      scope.querySelector(".result-card")?.remove();
      scope.appendChild(el(html));
    };
    const okColors = { warn: "badge-warn", ok: "badge-ok", info: "badge-info", gold: "badge-gold", navy: "badge-navy" };
    if (btn) { btn.disabled = true; btn.style.opacity = ".55"; }
    const reEnable = () => { if (btn) { btn.disabled = false; btn.style.opacity = ""; } };
    postIntake("/intake/status", { reference, last_name: lastName })
      .then((d) => {
        reEnable();
        if (d.found) {
          render(
            '<div class="result-card"><div class="rc-head"><span>' + esc(d.kind) + " · " + esc(d.reference) +
              '</span><span class="badge ' + (okColors[d.color] || "badge-navy") + '">' + esc(d.status) + "</span></div>" +
            '<div class="rc-body"><p style="font-size:14px;color:var(--muted)">' + esc(d.service || "") +
              (d.date ? '</p><div class="row" style="margin-top:12px;gap:18px;font-size:13px"><span>📅 ' + esc(d.date) + "</span></div>" : "</p>") +
            "</div></div>",
          );
        } else {
          render(
            '<div class="result-card"><div class="rc-head"><span>No matching request</span><span class="badge badge-warn">Not found</span></div>' +
            '<div class="rc-body"><p style="font-size:14px;color:var(--muted)">We couldn\'t find a request with that reference and last name. Please check both and try again, or contact the Consular Section.</p></div></div>',
          );
        }
      })
      .catch(() => {
        reEnable();
        render(
          '<div class="result-card"><div class="rc-head"><span>Status check unavailable</span><span class="badge badge-warn">Offline</span></div>' +
          '<div class="rc-body"><p style="font-size:14px;color:var(--muted)">Status lookup is unavailable in this preview. Please try again later.</p></div></div>',
        );
      });
  }

  /* Register with the Embassy (safety-alert enrolment) -> an Inquiry the staff see. */
  function submitRegistration(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const show = (ref, msg) => {
      scope.querySelector(".form-success")?.remove();
      scope.appendChild(
        el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          "<div><b>You're registered with the Embassy.</b><br/>" + (ref ? "Reference " + esc(ref) + ". " : "") + esc(msg) + "</div></div>",
        ),
      );
      btn.disabled = true;
      btn.style.opacity = ".55";
    };
    postIntake("/intake/registration", {
      name: v("rg-name"), email: v("rg-email"), phone: v("rg-phone"), type: v("rg-type"), location: v("rg-loc"),
    })
      .then((d) => show(d.reference, d.message || "We'll send alerts to your email."))
      .catch(() => show(null, "We'll send alerts to your email. (Offline preview.)"));
  }

  /* Attorney joins the Embassy's legal-partner network -> an Inquiry the staff review. */
  function submitLegalPartner(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const show = (ref, msg) => {
      scope.querySelector(".form-success")?.remove();
      scope.appendChild(
        el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          "<div><b>Thank you, your application was received.</b><br/>" + (ref ? "Reference " + esc(ref) + ". " : "") + esc(msg) + "</div></div>",
        ),
      );
      btn.disabled = true; btn.style.opacity = ".55";
    };
    postIntake("/intake/legal-partner", {
      name: v("lp-name"), email: v("lp-email"), phone: v("lp-phone"), firm: v("lp-firm"),
      jurisdiction: v("lp-jur"), practice: v("lp-practice"), bar_number: v("lp-bar"), message: v("lp-msg"),
    })
      .then((d) => show(d.reference, d.message || "Our team will review it and be in touch."))
      .catch(() => show(null, "Our team will review it and be in touch. (Offline preview.)"));
  }

  /* Public RSVP for an Embassy event -> an Inquiry the events desk handles. */
  function submitEvent(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const show = (ref, msg) => {
      scope.querySelector(".form-success")?.remove();
      scope.appendChild(
        el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          "<div><b>Your place is reserved.</b><br/>" + (ref ? "Reference " + esc(ref) + ". " : "") + esc(msg) + "</div></div>",
        ),
      );
      btn.disabled = true; btn.style.opacity = ".55";
    };
    postIntake("/intake/event", {
      name: v("ev-name"), email: v("ev-email"), event: v("ev-event"), guests: v("ev-guests"), note: v("ev-note"),
    })
      .then((d) => show(d.reference, d.message || "A confirmation has been sent to your email."))
      .catch(() => show(null, "A confirmation has been sent to your email. (Offline preview.)"));
  }

  function renderBooking(scope) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const service = v("b-service") || "Consular appointment";
    const time = v("b-time") || "Morning";
    const dateRaw = v("b-date");
    let when = "to be confirmed";
    if (dateRaw) {
      const d = new Date(dateRaw + "T00:00");
      if (!isNaN(d)) when = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }

    const render = (ref, msg) => {
      scope.querySelector(".result-card")?.remove();
      scope.appendChild(
        el(
          '<div class="result-card"><div class="rc-head"><span>Appointment requested &middot; ' + esc(ref) +
            '</span><span class="badge badge-ok">Received</span></div>' +
          '<div class="rc-body"><p style="font-size:14px;color:var(--muted)">Thank you. Your request for <b style="color:var(--navy)">' + esc(service) +
            '</b> has been received. ' + esc(msg) + '</p>' +
          '<div class="row" style="margin-top:14px;gap:20px;font-size:13px;flex-wrap:wrap">' +
            '<span>📅 ' + esc(when) + '</span><span>🕘 ' + esc(time) + '</span>' +
            '<span>📍 1100 Connecticut Avenue NW, Suite 725</span></div>' +
          '<p style="margin-top:12px;font-size:12.5px;color:var(--faint)">Keep your reference <b>' + esc(ref) + '</b> to track this request.</p></div></div>',
        ),
      );
      toast("Appointment request received. Reference " + ref + ".");
    };

    const payload = {
      service, name: v("b-name"), email: v("b-email"), phone: v("b-phone"),
      date: dateRaw, time, reason: v("b-reason"),
    };
    // include every optional booking detail the applicant filled (skip empties
    // so the server's date/format rules never trip on a blank value)
    const detail = v("b-detail"); if (detail) payload.detail = detail;
    const ref = v("b-ref"); if (ref) payload.reference = ref;
    const atype = v("b-status"); if (atype) payload.applicant_type = atype;
    const acount = v("b-count"); if (acount) payload.applicants = acount;
    const alt = v("b-alt"); if (alt) payload.alt_date = alt;
    if (scope.querySelector("#b-minor")?.checked) payload.minor = 1;
    postIntake("/intake/appointment", payload)
      .then((d) => render(d.reference, d.message || "The Consular Section will confirm your slot by email."))
      .catch(() => render("APT-2026-" + (1000 + Math.floor(Math.random() * 9000)), "(Offline preview, not submitted to the embassy.)"));
  }

  /* Submit a public form to the embassy intake API; resolves to {reference,message}. */
  function postIntake(endpoint, payload) {
    const base = window.EMBASSY_API || "";
    return fetch(base + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }

  function submitInquiry(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const show = (ref, msg) => {
      scope.querySelector(".form-success")?.remove();
      scope.appendChild(
        el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          "<div><b>Thank you, your message was received.</b><br/>" + (ref ? "Reference " + esc(ref) + ". " : "") + esc(msg) + "</div></div>",
        ),
      );
      btn.disabled = true;
      btn.style.opacity = ".55";
    };
    postIntake("/intake/inquiry", { name: v("c-name"), email: v("c-email"), subject: v("c-subject"), body: v("c-message") })
      .then((d) => show(d.reference, d.message || "The relevant department will respond during office hours."))
      .catch(() => show(null, "The relevant department will respond during office hours. (Offline preview.)"));
  }

  /* Suggestion box → an Inquiry ("Website suggestion") the staff dashboard triages. */
  function submitSuggestion(scope, btn) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const v = (id) => (scope.querySelector("#" + id)?.value || "").toString().trim();
    const show = (ref, msg) => {
      scope.querySelector(".form-success")?.remove();
      scope.appendChild(
        el(
          '<div class="form-success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' +
          "<div><b>Thank you, your suggestion was received.</b><br/>" + (ref ? "Reference " + esc(ref) + ". " : "") + esc(msg) + "</div></div>",
        ),
      );
      btn.disabled = true;
      btn.style.opacity = ".55";
    };
    postIntake("/intake/inquiry", { name: v("s-name"), email: v("s-email"), subject: "Website suggestion", body: v("s-suggestion"), category: "general" })
      .then((d) => show(d.reference, d.message || "The Embassy team will review your suggestion."))
      .catch(() => show(null, "The Embassy team will review your suggestion. (Offline preview.)"));
  }

  /* ---- 8. Filter chips (news / lists) ---------------------------------- */
  $$("[data-filter-group]").forEach((group) => {
    const chips = $$(".chip", group);
    const targets = $$("[data-cat]", group.parentElement || document);
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const cat = (chip.dataset.cat || chip.textContent).trim().toLowerCase();
        targets.forEach((t) => {
          const tc = (t.dataset.cat || "").toLowerCase();
          t.classList.toggle("is-hidden", cat !== "all" && tc !== cat);
        });
      }),
    );
  });
  // Generic: a row of .chip that should be single-select even without filtering
  $$(".chip").forEach((chip) => {
    if (chip.closest("[data-filter-group]")) return;
    chip.addEventListener("click", () => {
      const sibs = chip.parentElement.querySelectorAll(".chip");
      sibs.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  /* ---- 9. Tabs ---------------------------------------------------------- */
  $$(".tabs").forEach((tabbar) => {
    const btns = $$("button", tabbar);
    const panels = $$(".tab-panel", tabbar.parentElement);
    btns.forEach((b, i) =>
      b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        b.classList.add("active");
        panels[i] && panels[i].classList.add("active");
      }),
    );
  });

  /* ---- 10. Language toggle (EN/FR, lightweight) ------------------------ */
  const lang = $(".topbar .lang");
  if (lang) {
    lang.style.cursor = "pointer";
    let fr = false;
    lang.addEventListener("click", () => {
      fr = !fr;
      lang.innerHTML = "🌐 " + (fr ? "FR ▾" : "EN ▾");
      document.documentElement.lang = fr ? "fr" : "en";
      $$("[data-fr]").forEach((n) => {
        if (!n.dataset.en) n.dataset.en = n.textContent;
        n.textContent = fr ? n.dataset.fr : n.dataset.en;
      });
      toast(fr ? "Affichage en français (démo)." : "Showing English.");
    });
  }

  /* ---- 11. Dashboard sidebar active + row actions --------------------- */
  $$(".aside a:not([href^='index'])").forEach((a) => {
    if (a.getAttribute("href") && a.getAttribute("href") !== "#") return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      $$(".aside a").forEach((x) => x.classList.remove("active"));
      a.classList.add("active");
    });
  });
  $$(".table .row-actions a, .panel .row-actions a, .table a").forEach((a) => {
    if (a.getAttribute("href") && a.getAttribute("href") !== "#") return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      toast(a.textContent.trim() + ", demo action.");
    });
  });


  /* ---- 13. Accordion (FAQ / requirements) ----------------------------- */
  $$(".acc-q").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".acc-item");
      const open = item.classList.contains("open");
      $$(".acc-item", item.closest(".accordion")).forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });


  /* ---- 14. Hero slideshow (Ken Burns crossfade) ----------------------- */
  const slides = $$(".hero-slide");
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let si = 0;
    setInterval(() => {
      slides[si].classList.remove("active");
      si = (si + 1) % slides.length;
      slides[si].classList.add("active");
    }, 6000);
  }


  /* ---- 15. Reading progress bar --------------------------------------- */
  const prog = el('<div class="scroll-prog"></div>');
  document.body.appendChild(prog);
  const updateProg = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    prog.style.width = max > 0 ? (h.scrollTop / max) * 100 + "%" : "0%";
  };
  window.addEventListener("scroll", updateProg, { passive: true });
  updateProg();


  /* ---- 16. Widgets: live clocks, open status, currency, fee estimator - */
  const clockEls = $$(".time[data-tz]");
  if (clockEls.length) {
    const tickClocks = () =>
      clockEls.forEach((c) => {
        try {
          c.textContent = new Intl.DateTimeFormat("en-GB", {
            timeZone: c.dataset.tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date());
        } catch (e) {}
      });
    tickClocks();
    setInterval(tickClocks, 20000);
  }
  const statusDot = $("#embassyStatus");
  if (statusDot) {
    const dc = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    const open = dc.getDay() >= 1 && dc.getDay() <= 5 && dc.getHours() >= 9 && dc.getHours() < 17;
    statusDot.classList.add(open ? "open" : "closed");
    const txt = $("#statusText");
    if (txt) txt.textContent = open ? "Open now" : "Closed";
  }
  const ccAmount = $("#ccAmount"),
    ccResult = $("#ccResult");
  if (ccAmount && ccResult) {
    const RATE = 2800;
    const conv = () => {
      const v = parseFloat(ccAmount.value) || 0;
      ccResult.textContent = Math.round(v * RATE).toLocaleString();
    };
    ccAmount.addEventListener("input", conv);
    conv();
  }
  const feeService = $("#feeService"),
    feeOut = $("#feeOut");
  if (feeService && feeOut) {
    const upd = () => {
      const o = feeService.selectedOptions[0];
      feeOut.innerHTML =
        "<b>" + o.dataset.fee + "</b>" + (o.dataset.proc || "");
    };
    feeService.addEventListener("change", upd);
    upd();
  }


  /* ---- 17. Sticky shrink-on-scroll header ----------------------------- */
  const root = document.documentElement;
  let stuck = false;
  window.addEventListener(
    "scroll",
    () => {
      const should = window.scrollY > 120;
      if (should !== stuck) {
        stuck = should;
        root.classList.toggle("is-stuck", stuck);
      }
    },
    { passive: true },
  );


  /* ---- 18. Search overlay (live results) ------------------------------ */
  const searchToggle = $(".search-toggle");
  if (searchToggle) {
    // Each entry carries English + French titles/descriptions (t/tf, d/df) and a
    // pooled keyword string in BOTH languages (k). Matching is accent-insensitive
    // and searches every field, so a query in French or English finds the section
    // whatever the current display language. Entries are de-duplicated.
    const INDEX = [
      { t: "Consular Services", tf: "Services consulaires", d: "Passports, visas, legalization and services for citizens", df: "Passeports, visas, légalisation et services aux citoyens", u: "consular-services.html", k: "consulate citizen services consulat citoyen consulaire" },
      { t: "Passports & renewal", tf: "Passeports et renouvellement", d: "Apply for or renew a biometric passport", df: "Demander ou renouveler un passeport biométrique", u: "consular-services.html#passport", k: "passport renew renewal biometric expired passeport renouveler renouvellement biometrique expire" },
      { t: "Visas", tf: "Visas", d: "Entry visas for travel to the DRC, types and fees", df: "Visas d'entrée pour voyager en RDC, types et frais", u: "consular-services.html#visa", k: "visa entry travel visa entree voyage tourisme" },
      { t: "Tenant-Lieu (travel document)", tf: "Tenant-Lieu (document de voyage)", d: "Emergency one-way laissez-passer", df: "Laissez-passer d'urgence, aller simple", u: "consular-services.html#tenant-lieu", k: "laissez passer emergency travel document laissez-passer document de voyage urgence aller simple" },
      { t: "Document legalization", tf: "Légalisation de documents", d: "Authenticate and certify documents", df: "Authentifier et certifier des documents", u: "consular-services.html#legalization", k: "legalize notarize authenticate certify legalisation legaliser authentifier certifier notarier procuration" },
      { t: "Consular fees", tf: "Frais consulaires", d: "Service costs and how to pay", df: "Coût des services et modes de paiement", u: "consular-services.html#fees", k: "fee cost price payment frais tarif cout prix paiement payer" },
      { t: "Request an appointment", tf: "Demander un rendez-vous", d: "Request a consular appointment", df: "Demander un rendez-vous consulaire", u: "portal.html", k: "appointment booking schedule reserve request rendez-vous rendezvous reservation reserver planifier horaire" },
      { t: "Digital Services", tf: "Services numériques", d: "Online consular services and the digital platform", df: "Services consulaires en ligne et plateforme numérique", u: "digital-services.html", k: "digital services online platform numerique en ligne plateforme" },
      { t: "My account", tf: "Mon compte", d: "Sign in to your citizen account", df: "Connectez-vous à votre compte citoyen", u: "/embassy-preview/account", k: "account login citizen portal compte connexion citoyen espace se connecter" },
      { t: "Pay a consular fee", tf: "Payer des frais consulaires", d: "Pay a consular fee or event ticket online", df: "Payer des frais consulaires ou un billet en ligne", u: "/embassy-preview/pay", k: "pay payment fee online card payer paiement frais carte en ligne" },
      { t: "Secure messages", tf: "Messages sécurisés", d: "Message the Consular Section about your case", df: "Écrire à la section consulaire au sujet de votre dossier", u: "/messages", k: "message messages secure case dossier ecrire correspondance courrier" },
      { t: "Register with the Embassy", tf: "S'inscrire auprès de l'ambassade", d: "Receive alerts and let us reach you in an emergency", df: "Recevez des alertes et permettez-nous de vous joindre en cas d'urgence", u: "index.html#register", k: "register alerts enrol enroll diaspora inscription inscrire enregistrer alertes" },
      { t: "Travel advisory", tf: "Conseils aux voyageurs", d: "Current entry requirements and safety guidance", df: "Conditions d'entrée et conseils de sécurité actuels", u: "index.html#advisory", k: "advisory safety security guidance conseils securite voyage avertissement" },
      { t: "Media centre", tf: "Médiathèque", d: "Video, audio, press releases and notices", df: "Vidéo, audio, communiqués et avis", u: "index.html#media", k: "video audio media press announcement watch listen medias presse communique regarder ecouter" },
      { t: "News & Events", tf: "Actualités et événements", d: "Latest embassy news, press and events", df: "Dernières actualités, presse et événements de l'ambassade", u: "news-events.html", k: "news press events calendar actualites nouvelles presse evenements agenda" },
      { t: "The Embassy", tf: "L'Ambassade", d: "Our mission, history and role", df: "Notre mission, histoire et rôle", u: "the-embassy.html", k: "about mission history a propos histoire ambassade role" },
      { t: "The Ambassador", tf: "L'Ambassadeur", d: "H.E. Yvette Kapinga Ngandu, Head of Mission", df: "S.E. Yvette Kapinga Ngandu, Chef de mission", u: "the-embassy.html#ambassador", k: "ambassador head of mission leadership yvette kapinga ngandu ambassadeur chef de mission" },
      { t: "Divisions & departments", tf: "Divisions et départements", d: "Consular, political, economic and cultural sections", df: "Sections consulaire, politique, économique et culturelle", u: "the-embassy.html#divisions", k: "divisions departments sections departements service" },
      { t: "Democratic Republic of the Congo", tf: "République démocratique du Congo", d: "About the country, facts and figures", df: "À propos du pays, faits et chiffres", u: "dr-congo.html", k: "drc congo country about rdc congo pays" },
      { t: "Invest in the DRC", tf: "Investir en RDC", d: "Opportunities, sectors and incentives", df: "Opportunités, secteurs et avantages", u: "dr-congo.html#invest", k: "invest investment trade business economy investir investissement commerce economie secteur" },
      { t: "Tourism", tf: "Tourisme", d: "Parks, wildlife and destinations", df: "Parcs, faune et destinations", u: "dr-congo.html#tourism", k: "tourism visit parks wildlife tourisme visiter parcs gorilles nature" },
      { t: "Culture & heritage", tf: "Culture et patrimoine", d: "Music, art and Congolese traditions", df: "Musique, art et traditions congolaises", u: "dr-congo.html#culture", k: "culture heritage music art patrimoine musique traditions" },
      { t: "Contact the Embassy", tf: "Contacter l'ambassade", d: "Address, phone, email and map", df: "Adresse, téléphone, courriel et plan", u: "contact.html", k: "contact address phone email map directions adresse telephone courriel plan itineraire coordonnees" },
      { t: "Opening hours", tf: "Heures d'ouverture", d: "Embassy and consular hours and holidays", df: "Heures de l'ambassade et du consulat, jours fériés", u: "contact.html", k: "hours opening times holidays closed horaires heures ouverture jours feries ferme" },
      { t: "24/7 emergency line", tf: "Ligne d'urgence 24/7", d: "Consular emergency assistance", df: "Assistance consulaire d'urgence", u: "tel:+12022347690", k: "emergency urgent lost stolen arrest help urgence urgent perdu vole arrestation aide assistance" },
      { t: "Lost or stolen passport", tf: "Passeport perdu ou volé", d: "What to do, police report and travel document", df: "Que faire, déclaration de police et document de voyage", u: "consular-services.html#tenant-lieu", k: "lost stolen passport police report replace perdu vole passeport declaration police remplacer" },
      { t: "Civil registration", tf: "État civil", d: "Birth, marriage and death records for the diaspora", df: "Actes de naissance, mariage et décès pour la diaspora", u: "consular-services.html", k: "civil birth marriage death certificate registration etat civil naissance mariage deces acte diaspora" },
      { t: "Yellow fever and health", tf: "Fièvre jaune et santé", d: "Vaccination requirement for travel to the DRC", df: "Vaccination obligatoire pour voyager en RDC", u: "consular-services.html#visa", k: "yellow fever vaccination health certificate fievre jaune vaccin sante carnet" },
      { t: "Languages", tf: "Langues", d: "Services in French and English", df: "Services en français et en anglais", u: "the-embassy.html", k: "french english lingala language francais anglais lingala langue" },
      { t: "Terms & Conditions", tf: "Conditions générales", d: "Terms of use", df: "Conditions d'utilisation", u: "terms.html", k: "terms conditions legal conditions utilisation mentions" },
      { t: "Privacy Policy", tf: "Politique de confidentialité", d: "How we handle your data", df: "Comment nous traitons vos données", u: "privacy.html", k: "privacy data protection confidentialite donnees protection" },
      { t: "Cookie Policy", tf: "Politique de cookies", d: "How we use cookies", df: "Comment nous utilisons les cookies", u: "cookies.html", k: "cookies temoins" },
      { t: "Accessibility", tf: "Accessibilité", d: "Our accessibility commitment", df: "Notre engagement en matière d'accessibilité", u: "accessibility.html", k: "accessibility wcag accessibilite" },
      { t: "Legal disclaimer", tf: "Avertissement légal", d: "Disclaimers and notices", df: "Avertissements et mentions", u: "disclaimer.html", k: "disclaimer notice avertissement mentions legales" },
      { t: "Ask the Embassy", tf: "Demander à l'ambassade", d: "Get instant answers from the embassy assistant", df: "Obtenez des réponses instantanées de l'assistant", u: "index.html", k: "assistant chat help question ask aide question demander poser" },
    ];
    const rxEsc = (s) => Array.from(s).map((c) => (/[a-z0-9 ]/i.test(c) ? c : "\\" + c)).join("");
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    // Accent- and case-insensitive, so "légalisation" and "legalisation" match alike.
    const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(new RegExp("[\u0300-\u036f]", "g"), "");
    // Current display language, as persisted by the header language switcher.
    const isFR = () => { try { return localStorage.getItem("emb-lang") === "fr"; } catch (e) { return document.documentElement.lang === "fr"; } };
    const T = (it) => (isFR() && it.tf ? it.tf : it.t);
    const D = (it) => (isFR() && it.df ? it.df : it.d);
    // Pre-compute a normalized haystack per entry spanning BOTH languages, so a
    // query in either language finds the section regardless of what is on screen.
    INDEX.forEach((it) => {
      it._title = norm((it.t || "") + " " + (it.tf || ""));
      it._hay = norm([it.t, it.tf, it.d, it.df, it.k].join(" "));
    });
    // Language auto-detect vocabulary: words that appear ONLY in the French
    // fields vs ONLY in the English fields. Typing distinctly-French words
    // switches the site to French and vice-versa; ambiguous words (visa,
    // contact, culture…) change nothing, so the language never flip-flops.
    const FR_MARK = new Set(), EN_MARK = new Set();
    (function buildMarkers() {
      const frV = new Set(), enV = new Set();
      const words = (s) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
      INDEX.forEach((it) => {
        words((it.tf || "") + " " + (it.df || "")).forEach((w) => frV.add(w));
        words((it.t || "") + " " + (it.d || "")).forEach((w) => enV.add(w));
      });
      frV.forEach((w) => { if (!enV.has(w)) FR_MARK.add(w); });
      enV.forEach((w) => { if (!frV.has(w)) EN_MARK.add(w); });
      // Keyword-only French terms absent from every title/description.
      "horaires tarifs medias legaliser reserver".split(" ").forEach((w) => FR_MARK.add(w));
      "schedule".split(" ").forEach((w) => EN_MARK.add(w));
    })();
    const detectLang = (q) => {
      const raw = (q || "").trim();
      if (raw.length < 2) return null;
      let fr = 0, en = 0;
      if (norm(raw) !== raw.toLowerCase()) fr += 2; // an accent that got stripped ⇒ French
      norm(raw).split(/[^a-z0-9]+/).filter(Boolean).forEach((w) => {
        if (FR_MARK.has(w)) fr++;
        if (EN_MARK.has(w)) en++;
      });
      if (fr > en) return "fr";
      if (en > fr) return "en";
      return null; // ambiguous - leave the language as-is
    };
    const setSiteLang = (l) => { try { document.dispatchEvent(new CustomEvent("emb:setlang", { detail: l })); } catch (e) {} };
    const find = (q) => {
      const terms = norm(q).trim().split(/\s+/).filter(Boolean);
      if (!terms.length) return [];
      return INDEX
        .map((it) => {
          let score = 0;
          terms.forEach((w) => { if (it._title.includes(w)) score += 3; else if (it._hay.includes(w)) score += 1; });
          return { it, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => r.it);
    };
    const hl = (text, q) => {
      const w = q.trim().split(/\s+/).filter(Boolean).map(rxEsc).join("|");
      const e = esc(text);
      return w ? e.replace(new RegExp("(" + w + ")", "ig"), "<mark>$1</mark>") : e;
    };
    const ov = el(
      '<div class="search-overlay"><div class="search-panel">' +
        '<div class="search-box">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
          '<input type="search" placeholder="Search the embassy: passports, visas, hours…" aria-label="Search" autocomplete="off"/>' +
          '<button class="sb-close" aria-label="Close search">×</button>' +
        "</div>" +
        '<div class="search-results"></div>' +
      "</div></div>",
    );
    document.body.appendChild(ov);
    const input = ov.querySelector("input");
    const results = ov.querySelector(".search-results");
    let current = [];
    // Localized UI copy, chosen from the active display language at render time.
    const STR = () => (isFR() ? {
      ph: "Rechercher : passeports, visas, horaires…",
      hint: "Populaire : passeports, visas, rendez-vous, horaires, urgence",
      empty: (q) => 'Aucun résultat pour « ' + q + ' ». Essayez un autre terme ou <a href="contact.html">contactez-nous</a>.',
    } : {
      ph: "Search the embassy: passports, visas, hours…",
      hint: "Popular: passports, visas, appointments, opening hours, emergency",
      empty: (q) => 'No matches for “' + q + '”. Try another term or <a href="contact.html">contact us</a>.',
    });
    const render = (q) => {
      const s = STR();
      if (!q.trim()) { results.innerHTML = '<div class="sr-hint">' + s.hint + '</div>'; current = []; return; }
      current = find(q);
      if (!current.length) { results.innerHTML = '<div class="sr-empty">' + s.empty(esc(q.trim())) + '</div>'; return; }
      results.innerHTML = current.map((it) => '<a class="sr-item" href="' + it.u + '"><span class="sr-t">' + hl(T(it), q) + '</span><span class="sr-d">' + esc(D(it)) + "</span></a>").join("");
    };
    const openS = () => { input.placeholder = STR().ph; ov.classList.add("open"); render(""); setTimeout(() => input.focus(), 60); };
    const closeS = () => ov.classList.remove("open");
    searchToggle.addEventListener("click", openS);
    ov.addEventListener("click", (e) => { if (e.target === ov) closeS(); });
    ov.querySelector(".sb-close").addEventListener("click", closeS);
    // Auto-switch the whole site to the language being typed. Debounced so the
    // page only re-translates once the user pauses, and only when the detected
    // language actually differs from what is on screen.
    let langTimer;
    input.addEventListener("input", () => {
      render(input.value);
      clearTimeout(langTimer);
      langTimer = setTimeout(() => {
        const guess = detectLang(input.value);
        if (guess && (guess === "fr") !== isFR()) {
          setSiteLang(guess);
          setTimeout(() => render(input.value), 30); // re-render results in the new language
        }
      }, 450);
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && current[0]) window.location.href = current[0].u; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeS(); });
  }

  /* ---- 12. Back to top ------------------------------------------------- */
  const top = el(
    '<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg></button>',
  );
  document.body.appendChild(top);
  top.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  window.addEventListener(
    "scroll",
    () => top.classList.toggle("show", window.scrollY > 600),
    { passive: true },
  );

  /* ---- 19. AI reception assistant ("Ask the Embassy") ------------------ */
  (function assistant() {
    // ---- language + accent-insensitive matching (self-contained) ----
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const isFR = () => { try { return localStorage.getItem("emb-lang") === "fr"; } catch (e) { return document.documentElement.lang === "fr"; } };

    // Bilingual knowledge base: keywords (k, FR+EN), English answer (a), French answer (af).
    const KB = [
      { k: ["passport","passeport","renew","renouvel","biometric","biometrique","new passport","nouveau passeport","expired","expire"], a: "<b>Passports</b> are biometric and issued by Kinshasa. Three steps: 1) pre-register and pay <b>US$75</b> at passeport.gouv.cd (after obtaining an NIF tax ID), 2) email your documents to the consulate, 3) attend a biometric appointment. Processing takes about 90 days. <a href='consular-services.html#passport'>Full process &rarr;</a>", af: "Les <b>passeports</b> sont biométriques et délivrés par Kinshasa. Trois étapes : 1) pré-enregistrement et paiement de <b>75 US$</b> sur passeport.gouv.cd (après l'obtention d'un NIF), 2) envoi de vos documents au consulat, 3) rendez-vous biométrique. Délai : environ 90 jours. <a href='consular-services.html#passport'>Procédure complète &rarr;</a>" },
      { k: ["minor","child","children","kid","baby","enfant","mineur","bebe","passport","passeport"], a: "For a <b>minor's passport</b>, also bring the original birth certificate, a legalized parental authorization and a parent's passport. <a href='consular-services.html#passport'>Details &rarr;</a>", af: "Pour un <b>passeport de mineur</b>, ajoutez l'acte de naissance original, une autorisation parentale légalisée et le passeport d'un parent. <a href='consular-services.html#passport'>Détails &rarr;</a>" },
      { k: ["lost","stolen","perdu","vole","perte","police report","declaration de police","passport","passeport"], a: "If your passport is <b>lost or stolen</b>, file a police report and bring it to your appointment. You may also apply for a <b>Tenant-Lieu</b> travel document to return home. For emergencies call <a href='tel:+12022347690'>+1 (202) 234-7690</a>. <a href='consular-services.html#tenant-lieu'>Travel document &rarr;</a>", af: "En cas de <b>passeport perdu ou volé</b>, faites une déclaration de police et apportez-la à votre rendez-vous. Vous pouvez aussi demander un <b>Tenant-Lieu</b> pour rentrer. Urgences : <a href='tel:+12022347690'>+1 (202) 234-7690</a>. <a href='consular-services.html#tenant-lieu'>Document de voyage &rarr;</a>" },
      { k: ["how long","processing","delay","status","track","when ready","combien de temps","delai","suivi","statut","pret"], a: "Passport processing is about <b>90 days</b> from the biometric appointment; visas are typically <b>5-10 business days</b>. Track a request with your reference number. <a href='consular-services.html#status'>Track your request &rarr;</a>", af: "Le passeport prend environ <b>90 jours</b> après le rendez-vous biométrique ; les visas <b>5 à 10 jours ouvrés</b>. Suivez votre demande avec votre numéro de référence. <a href='consular-services.html#status'>Suivre ma demande &rarr;</a>" },
      { k: ["visa","visas","tourist","touriste","entry","entree"], a: "<b>Visas</b> for the DRC range from <b>$45</b> (transit) to <b>$450</b> (6-month multiple entry). You need a valid passport, a photo, a yellow-fever card and a return envelope. <a href='consular-services.html#visa'>Types &amp; fees &rarr;</a>", af: "Les <b>visas</b> pour la RDC vont de <b>45$</b> (transit) à <b>450$</b> (6 mois, entrées multiples). Il faut un passeport valide, une photo, un carnet de fièvre jaune et une enveloppe de retour. <a href='consular-services.html#visa'>Types et frais &rarr;</a>" },
      { k: ["yellow fever","vaccination","vaccine","fievre jaune","vaccin","requirements","conditions","invitation","documents"], a: "For a DRC visa you generally need a passport valid 6+ months, one photo, proof of <b>yellow-fever vaccination</b>, and for some categories an invitation or hotel booking. <a href='consular-services.html#visa'>Requirements &rarr;</a>", af: "Pour un visa RDC il faut généralement un passeport valide 6 mois, une photo, une preuve de vaccination contre la <b>fièvre jaune</b>, et pour certaines catégories une invitation ou une réservation d'hôtel. <a href='consular-services.html#visa'>Conditions &rarr;</a>" },
      { k: ["student","study","university","school","etudiant","etudes","universite","ecole"], a: "For a <b>student visa</b>, add an admission letter and proof of funds to the standard requirements. <a href='consular-services.html#visa'>Visa services &rarr;</a>", af: "Pour un <b>visa étudiant</b>, ajoutez une lettre d'admission et une preuve de ressources aux conditions habituelles. <a href='consular-services.html#visa'>Services de visa &rarr;</a>" },
      { k: ["appointment","appoint","book","booking","schedule","reserve","rendez-vous","rendezvous","rdv","reserver"], a: "Consular applications are received in person <b>Monday-Friday, 10:00-13:00</b>, or by mail. Use the portal to request a time and we'll confirm. <a href='portal.html'>Request an appointment &rarr;</a>", af: "Les demandes consulaires sont reçues en personne du <b>lundi au vendredi, 10h-13h</b>, ou par courrier. Utilisez le portail pour demander un créneau. <a href='portal.html'>Prendre rendez-vous &rarr;</a>" },
      { k: ["fee","fees","cost","price","how much","payment","pay","money order","frais","tarif","cout","prix","paiement","payer","mandat"], a: "Passport <b>$75</b>; visas <b>$45-$450</b> by type; legalization and civil-status fees vary. Payment is by <b>money order or certified check</b> (no cash or cards on site). <a href='consular-services.html#fees'>Fee schedule &rarr;</a> &middot; <a href='/pay'>Pay online (demo) &rarr;</a>", af: "Passeport <b>75$</b> ; visas <b>45-450$</b> selon le type ; légalisation et état civil variables. Paiement par <b>mandat ou chèque certifié</b> (ni espèces ni carte sur place). <a href='consular-services.html#fees'>Grille des frais &rarr;</a> &middot; <a href='/pay'>Payer en ligne (démo) &rarr;</a>" },
      { k: ["hour","hours","open","opening","time","closed","holiday","horaire","heures","ouverture","ferme","ferie"], a: "<b>Embassy:</b> Mon-Thu 9:00-16:00, Fri 9:00-13:00. <b>Consular:</b> drop-off Mon-Fri 10:00-13:00, pick-up Mon-Thu 14:00-16:00. <a href='contact.html'>Hours &amp; holidays &rarr;</a>", af: "<b>Ambassade :</b> lun-jeu 9h-16h, ven 9h-13h. <b>Consulat :</b> dépôt lun-ven 10h-13h, retrait lun-jeu 14h-16h. <a href='contact.html'>Horaires et jours fériés &rarr;</a>" },
      { k: ["legal","legaliz","legalis","apostille","authenticat","authentif","notar","power of attorney","procuration","certify","certif"], a: "We <b>legalize and authenticate</b> documents and perform notarial acts, including powers of attorney. Bring the original and valid ID. The DRC is not in the Apostille Convention, so consular legalization applies. <a href='consular-services.html#legalization'>Legalization &rarr;</a>", af: "Nous <b>légalisons et authentifions</b> les documents et réalisons des actes notariés, dont les procurations. Apportez l'original et une pièce d'identité. La RDC n'étant pas partie à la Convention Apostille, la légalisation consulaire s'applique. <a href='consular-services.html#legalization'>Légalisation &rarr;</a>" },
      { k: ["tenant","laissez","laissez-passer","travel document","document de voyage"], a: "A <b>Tenant-Lieu</b> (laissez-passer) is a one-way travel document for citizens who cannot obtain a passport in time. <a href='consular-services.html#tenant-lieu'>Tenant-Lieu &rarr;</a>", af: "Le <b>Tenant-Lieu</b> (laissez-passer) est un document de voyage aller simple pour les citoyens qui ne peuvent obtenir un passeport à temps. <a href='consular-services.html#tenant-lieu'>Tenant-Lieu &rarr;</a>" },
      { k: ["civil","birth","marriage","married","death","certificate","acte","etat civil","naissance","mariage","deces","registration"], a: "We register <b>births, marriages and deaths</b> for the diaspora and issue certified records. Bring originals and valid ID. <a href='consular-services.html'>Civil affairs &rarr;</a>", af: "Nous enregistrons les <b>naissances, mariages et décès</b> de la diaspora et délivrons des actes certifiés. Apportez les originaux et une pièce d'identité. <a href='consular-services.html'>Affaires civiles &rarr;</a>" },
      { k: ["address","adresse","where","located","location","map","carte","direction","parking","itineraire","ou"], a: "Embassy of the DRC, <b>1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036</b> (Dupont Circle area; paid parking and Metro nearby). <a href='contact.html'>Map &amp; directions &rarr;</a>", af: "Ambassade de la RDC, <b>1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036</b> (quartier de Dupont Circle ; parking payant et métro à proximité). <a href='contact.html'>Plan et itinéraire &rarr;</a>" },
      { k: ["phone","call","email","courriel","contact","reach","telephone","numero","joindre"], a: "Tel <a href='tel:+12022347690'>+1 (202) 234-7690</a> &middot; <a href='mailto:ambassade@ambardcusa.org'>ambassade@ambardcusa.org</a>. <a href='contact.html'>All contact details &rarr;</a>", af: "Tél <a href='tel:+12022347690'>+1 (202) 234-7690</a> &middot; <a href='mailto:ambassade@ambardcusa.org'>ambassade@ambardcusa.org</a>. <a href='contact.html'>Toutes les coordonnées &rarr;</a>" },
      { k: ["emergency","urgent","urgence","arrest","arrestation","hospital","hopital","accident","detained","death abroad"], a: "For a <b>consular emergency</b> affecting a DR Congolese citizen (arrest, hospitalization, death, serious distress), our line is staffed <b>24/7</b>: <a href='tel:+12022347690'>+1 (202) 234-7690</a>.", af: "Pour une <b>urgence consulaire</b> concernant un citoyen congolais (arrestation, hospitalisation, décès, détresse grave), notre ligne est ouverte <b>24h/24</b> : <a href='tel:+12022347690'>+1 (202) 234-7690</a>." },
      { k: ["advisory","safe","safety","security","securite","conseil","danger"], a: "Check the current <b>travel advisory</b> and entry requirements before travelling to the DRC, and register your trip so we can reach you in an emergency. <a href='index.html#advisory'>Travel advisory &rarr;</a>", af: "Consultez les <b>conseils aux voyageurs</b> et les conditions d'entrée avant de partir en RDC, et enregistrez votre voyage pour que nous puissions vous joindre en cas d'urgence. <a href='index.html#advisory'>Conseils aux voyageurs &rarr;</a>" },
      { k: ["register","registration","diaspora","enrol","enroll","alert","inscription","inscrire","enregistrer","alertes","carte consulaire"], a: "Register with the Embassy, <b>free of charge</b>, to receive alerts and so we can assist you in an emergency. <a href='index.html#register'>Register with the Embassy &rarr;</a>", af: "Inscrivez-vous auprès de l'Ambassade, <b>gratuitement</b>, pour recevoir des alertes et être assisté en cas d'urgence. <a href='index.html#register'>S'inscrire &rarr;</a>" },
      { k: ["invest","investment","investir","investissement","business","trade","commerce","economy","economie","sector","secteur","mining","mines"], a: "The DRC welcomes investment across priority sectors: mining, energy, agriculture, infrastructure and tourism. <a href='dr-congo.html#invest'>Invest in the DRC &rarr;</a>", af: "La RDC accueille les investissements dans des secteurs prioritaires : mines, énergie, agriculture, infrastructures et tourisme. <a href='dr-congo.html#invest'>Investir en RDC &rarr;</a>" },
      { k: ["tourism","tourisme","visit","visiter","gorilla","gorille","park","parc","virunga","river","fleuve","nature","wildlife"], a: "Discover the DRC's national parks, mountain gorillas and the Congo River. <a href='dr-congo.html#tourism'>Tourism &rarr;</a>", af: "Découvrez les parcs nationaux de la RDC, les gorilles de montagne et le fleuve Congo. <a href='dr-congo.html#tourism'>Tourisme &rarr;</a>" },
      { k: ["culture","heritage","patrimoine","music","musique","art","rumba","tradition","dance","danse"], a: "Explore Congolese music (including the world-famous rumba), art and traditions. <a href='dr-congo.html#culture'>Culture &amp; heritage &rarr;</a>", af: "Explorez la musique congolaise (dont la célèbre rumba), l'art et les traditions. <a href='dr-congo.html#culture'>Culture et patrimoine &rarr;</a>" },
      { k: ["news","actualite","press","presse","event","evenement","media","medias","video","newsroom","communique"], a: "See the latest news, press releases and events, plus video and audio in the Media Centre. <a href='news-events.html'>Newsroom &rarr;</a>", af: "Consultez les dernières actualités, communiqués et événements, avec vidéos et audio dans la Médiathèque. <a href='news-events.html'>Actualités &rarr;</a>" },
      { k: ["ambassador","ambassadeur","head of mission","chef de mission","yvette","kapinga","ngandu"], a: "The Head of Mission is <b>H.E. Yvette Kapinga Ngandu</b>, Ambassador Extraordinary and Plenipotentiary, in post since 30 October 2025. <a href='the-embassy.html#ambassador'>About the Ambassador &rarr;</a>", af: "La Cheffe de mission est <b>S.E. Yvette Kapinga Ngandu</b>, Ambassadrice extraordinaire et plénipotentiaire, en poste depuis le 30 octobre 2025. <a href='the-embassy.html#ambassador'>À propos de l'Ambassadrice &rarr;</a>" },
      { k: ["president","tshisekedi","felix","head of state","chef de l etat"], a: "The Head of State is <b>H.E. Felix-Antoine Tshisekedi Tshilombo</b>, President of the Democratic Republic of the Congo. <a href='the-embassy.html'>The Embassy &rarr;</a>", af: "Le Chef de l'État est <b>S.E. Félix-Antoine Tshisekedi Tshilombo</b>, Président de la République démocratique du Congo. <a href='the-embassy.html'>L'Ambassade &rarr;</a>" },
      { k: ["jurisdiction","which states","states","consulate","consulat","cover","serve","competence","ressort"], a: "This Embassy serves DR Congolese nationals and consular matters across the <b>United States</b> from Washington, D.C. For your specific case, contact us and we'll confirm the right channel. <a href='contact.html'>Contact &rarr;</a>", af: "Cette Ambassade dessert les ressortissants congolais et les affaires consulaires aux <b>États-Unis</b> depuis Washington. Pour votre cas précis, contactez-nous et nous confirmerons la démarche. <a href='contact.html'>Contact &rarr;</a>" },
      { k: ["language","langue","francais","french","english","anglais","lingala"], a: "Services are offered in <b>French</b> and <b>English</b>. French is the official language of the mission; this assistant answers in both.", af: "Les services sont proposés en <b>français</b> et en <b>anglais</b>. Le français est la langue officielle de la mission ; cet assistant répond dans les deux langues." },
      { k: ["dual","nationality","citizenship","nationalite","double nationalite","citoyennete"], a: "Questions of <b>Congolese nationality</b> (including dual nationality and its current rules) are handled case by case: please contact the consular section. <a href='contact.html'>Ask a consular officer &rarr;</a>", af: "Les questions de <b>nationalité congolaise</b> (y compris la double nationalité et ses règles actuelles) sont traitées au cas par cas : contactez la section consulaire. <a href='contact.html'>Demander à un agent &rarr;</a>" },
      { k: ["nif","tax id","numero fiscal","identifiant fiscal","impot"], a: "A <b>NIF</b> (tax identification number) is required before pre-registering for a passport at passeport.gouv.cd. <a href='consular-services.html#passport'>Passport steps &rarr;</a>", af: "Un <b>NIF</b> (numéro d'identification fiscale) est requis avant le pré-enregistrement du passeport sur passeport.gouv.cd. <a href='consular-services.html#passport'>Étapes du passeport &rarr;</a>" },
      { k: ["mail","mailing","ship","shipping","post","courrier","envoi","return envelope","enveloppe","by mail","envoyer"], a: "Many services can be handled <b>by mail</b>. Include a prepaid, trackable <b>return envelope</b> (e.g. USPS Priority) so we can return your documents safely. <a href='consular-services.html'>Consular services &rarr;</a>", af: "De nombreux services se font <b>par courrier</b>. Joignez une <b>enveloppe de retour</b> prépayée et suivie (ex. USPS Priority) pour un retour sécurisé de vos documents. <a href='consular-services.html'>Services consulaires &rarr;</a>" },
      { k: ["translation","translate","traduction","traduire","interpreter"], a: "For official use, a document in another language may need a <b>certified translation</b>. We can advise and, where applicable, legalize the translation. <a href='consular-services.html#legalization'>Legalization &rarr;</a>", af: "Pour un usage officiel, un document dans une autre langue peut nécessiter une <b>traduction certifiée</b>. Nous pouvons vous conseiller et, le cas échéant, légaliser la traduction. <a href='consular-services.html#legalization'>Légalisation &rarr;</a>" },
      { k: ["job","jobs","career","vacancy","vacancies","internship","stage","emploi","recrutement","hiring"], a: "Openings and internships, when available, are announced in <b>News &amp; Events</b>. <a href='news-events.html'>See announcements &rarr;</a> or <a href='contact.html'>send your enquiry &rarr;</a>.", af: "Les postes et stages, lorsqu'ils sont disponibles, sont annoncés dans <b>Actualités et événements</b>. <a href='news-events.html'>Voir les annonces &rarr;</a> ou <a href='contact.html'>envoyez votre demande &rarr;</a>." },
      { k: ["holiday","holidays","ferie","feries","closed","ferme","independence","30 june","30 juin"], a: "The Embassy observes DRC and U.S. public holidays (including <b>Independence Day, 30 June</b>). Check the calendar before visiting. <a href='contact.html'>Hours &amp; holidays &rarr;</a>", af: "L'Ambassade observe les jours fériés congolais et américains (dont la <b>fête de l'Indépendance, le 30 juin</b>). Vérifiez le calendrier avant de vous déplacer. <a href='contact.html'>Horaires et jours fériés &rarr;</a>" },
      { k: ["flag","drapeau","anthem","hymne","symbol","currency","monnaie","franc","capital","kinshasa","motto","devise"], a: "The DRC's capital is <b>Kinshasa</b>, the currency is the <b>Congolese franc</b>, and the national motto is <i>Justice &middot; Paix &middot; Travail</i>. <a href='dr-congo.html'>About DR Congo &rarr;</a>", af: "La capitale de la RDC est <b>Kinshasa</b>, la monnaie est le <b>franc congolais</b>, et la devise nationale est <i>Justice &middot; Paix &middot; Travail</i>. <a href='dr-congo.html'>À propos de la RDC &rarr;</a>" },
      { k: ["health","sante","medical","malaria","paludisme","insurance","assurance"], a: "Travellers to the DRC need proof of <b>yellow-fever vaccination</b>; malaria prophylaxis and travel insurance are strongly recommended. <a href='consular-services.html#visa'>Travel requirements &rarr;</a>", af: "Les voyageurs vers la RDC doivent présenter une preuve de vaccination contre la <b>fièvre jaune</b> ; un traitement antipaludéen et une assurance voyage sont vivement recommandés. <a href='consular-services.html#visa'>Conditions de voyage &rarr;</a>" },
      { k: ["complaint","complain","feedback","suggestion","reclamation","plainte","probleme"], a: "We welcome your <b>feedback or complaint</b>. Use the contact form or the suggestion box and a consular officer will follow up. <a href='contact.html'>Contact us &rarr;</a>", af: "Nous accueillons vos <b>remarques ou réclamations</b>. Utilisez le formulaire de contact ou la boîte à suggestions ; un agent consulaire vous répondra. <a href='contact.html'>Nous contacter &rarr;</a>" },
      { k: ["hello","hi","hey","bonjour","salut","good morning","good evening","bonsoir","mbote"], a: "Hello and welcome! I can help with passports, visas, appointments, fees, hours, legalization and more. What do you need?", af: "Bonjour et bienvenue ! Je peux vous aider pour les passeports, visas, rendez-vous, frais, horaires, légalisation et plus. Que puis-je faire pour vous ?" },
      { k: ["thank","thanks","merci"], a: "You're welcome. Is there anything else I can help you with? <a href='contact.html'>Contact a consular officer &rarr;</a>", af: "Je vous en prie. Puis-je vous aider pour autre chose ? <a href='contact.html'>Contacter un agent consulaire &rarr;</a>" },
      { k: ["help","aide","what can you","how do i","comment","guide","navigate","assist","que peux"], a: "I can guide you through any service: passports, visas, appointments, fees, hours, legalization, civil status, travel and more. Type your question or pick a topic below. You can also use the search at the top to find any page.", af: "Je peux vous guider dans tous les services : passeports, visas, rendez-vous, frais, horaires, légalisation, état civil, voyage et plus. Posez votre question ou choisissez un sujet ci-dessous. Vous pouvez aussi utiliser la recherche en haut." },
    ];
    KB.forEach((e) => { e._k = e.k.map(norm); });

    const FALLBACK = {
      en: "I can help with passports, visas, appointments, fees, opening hours, legalization, civil status, travel, investment, tourism, emergencies and more. Try a topic below, rephrase your question, or <a href='contact.html'>contact a consular officer &rarr;</a>.",
      fr: "Je peux vous aider pour les passeports, visas, rendez-vous, frais, horaires, légalisation, état civil, voyage, investissement, tourisme, urgences et plus. Choisissez un sujet ci-dessous, reformulez votre question ou <a href='contact.html'>contactez un agent consulaire &rarr;</a>.",
    };

    // Best-match scoring: phrases score highest, then exact word, then prefix.
    const answer = (q) => {
      const nq = " " + norm(q) + " ";
      const toks = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
      let best = null, top = 0;
      KB.forEach((e) => {
        let sc = 0;
        e._k.forEach((kw) => {
          if (kw.indexOf(" ") >= 0) { if (nq.indexOf(kw) >= 0) sc += 3; return; }
          for (let t = 0; t < toks.length; t++) {
            if (toks[t] === kw) { sc += 2; break; }
            if (toks[t].length >= 4 && kw.length >= 4 && (toks[t].indexOf(kw) === 0 || kw.indexOf(toks[t]) === 0)) { sc += 1; break; }
          }
        });
        if (sc > top) { top = sc; best = e; }
      });
      const fr = isFR();
      if (!best) return fr ? FALLBACK.fr : FALLBACK.en;
      return fr && best.af ? best.af : best.a;
    };

    // Localized interface copy.
    const STR = () => (isFR() ? {
      sub: "Bilingue · réponse immédiate",
      launch: "Assistant bilingue · 24/7",
      ph: "Posez une question : passeports, visas, horaires…",
      foot: 'Assistance automatisée. Pour parler à un agent, appelez <a href="tel:+12022347690">+1 (202) 234-7690</a>.',
      greet: "Bonjour et bienvenue à l'Ambassade de la RDC. Je peux vous renseigner sur les passeports, visas, rendez-vous, horaires et bien plus. Comment puis-je vous aider ?",
      chips: ["Renouveler mon passeport", "Prendre rendez-vous", "Visas et frais", "Heures d'ouverture", "S'inscrire aux alertes", "Urgence"],
    } : {
      sub: "Bilingual · replies instantly",
      launch: "Bilingual assistant · 24/7",
      ph: "Ask about passports, visas, hours…",
      foot: 'Automated guidance. For a person, call <a href="tel:+12022347690">+1 (202) 234-7690</a>.',
      greet: "Bonjour, and welcome to the Embassy of the DRC. I can help with passports, visas, appointments, hours and much more. How may I assist you today?",
      chips: ["Renew my passport", "Request an appointment", "Visas & fees", "Opening hours", "Register for alerts", "Emergency"],
    });

    const AV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
    const launcher = el(
      '<button class="asst-launch" aria-label="Ask the Embassy" aria-expanded="false">' +
        '<span class="asst-av">' + AV + '<i class="asst-on"></i></span>' +
        '<span class="asst-lt"><b>Ask the Embassy</b><small class="asst-ls">Bilingual assistant &middot; 24/7</small></span>' +
      '</button>',
    );
    const panel = el(
      '<section class="asst-panel" role="dialog" aria-label="Embassy assistant" hidden>' +
        '<header class="asst-head">' +
          '<span class="asst-hav">' + AV + '<i class="asst-on"></i></span>' +
          '<div class="asst-htxt"><b>Embassy Assistant</b><small class="asst-sub">Bilingual &middot; replies instantly</small></div>' +
          '<button class="asst-x" aria-label="Close">&times;</button></header>' +
        '<div class="asst-log" aria-live="polite"></div>' +
        '<div class="asst-quick"></div>' +
        '<form class="asst-form"><input type="text" aria-label="Type your question" placeholder="Ask about passports, visas, hours…" autocomplete="off" />' +
        '<button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button></form>' +
        '<p class="asst-foot"></p>' +
      '</section>',
    );
    document.body.append(launcher, panel);

    const log = panel.querySelector(".asst-log");
    const quick = panel.querySelector(".asst-quick");
    const form = panel.querySelector(".asst-form");
    const input = form.querySelector("input");

    const push = (who, html) => {
      const m = el('<div class="asst-msg ' + who + '"></div>');
      m.innerHTML = html;
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    };
    const ask = (q) => {
      push("me", esc(q));
      const typing = el('<div class="asst-msg bot asst-typing" aria-label="typing"><span></span><span></span><span></span></div>');
      log.appendChild(typing); log.scrollTop = log.scrollHeight;
      setTimeout(() => { typing.remove(); push("bot", answer(q)); }, 480);
    };

    const buildChips = (labels) => {
      quick.innerHTML = "";
      labels.forEach((label) => {
        const c = el('<button type="button" class="asst-chip"></button>');
        c.textContent = label;
        c.addEventListener("click", () => ask(label));
        quick.appendChild(c);
      });
    };
    const localize = () => {
      const st = STR();
      input.placeholder = st.ph;
      panel.querySelector(".asst-sub").textContent = st.sub;
      panel.querySelector(".asst-foot").innerHTML = st.foot;
      const ls = launcher.querySelector(".asst-ls"); if (ls) ls.textContent = st.launch;
      buildChips(st.chips);
    };
    localize();
    document.addEventListener("emb:setlang", localize);

    let opened = false;
    const open = () => {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("open"));
      launcher.setAttribute("aria-expanded", "true");
      localize();
      if (!opened) { opened = true; push("bot", STR().greet); }
      setTimeout(() => input.focus(), 80);
    };
    const close = () => {
      panel.classList.remove("open");
      launcher.setAttribute("aria-expanded", "false");
      setTimeout(() => { panel.hidden = true; }, 220);
    };
    launcher.addEventListener("click", () => (panel.hidden ? open() : close()));
    panel.querySelector(".asst-x").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      ask(q);
      input.value = "";
    });
    })();
})();

/* ---- Media centre lightbox player (self-contained) -------------------- */
(function () {
  "use strict";
  const triggers = Array.from(document.querySelectorAll('[data-media="video"],[data-media="audio"]'));
  if (!triggers.length) return;
  const mk = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };

  const modal = mk(`
    <div class="mplayer" role="dialog" aria-label="Media player" hidden>
      <div class="mp-scrim"></div>
      <div class="mp-box">
        <button class="mp-x" aria-label="Close">&times;</button>
        <div class="mp-stage">
          <span class="mp-badge">Video</span>
          <button class="mp-play" aria-label="Play / pause">
            <svg class="ic-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg class="ic-pause" viewBox="0 0 24 24" fill="currentColor" hidden><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
          </button>
        </div>
        <div class="mp-bar"><div class="mp-fill"></div></div>
        <div class="mp-meta"><div><b class="mp-title"></b><span class="mp-sub"></span></div><span class="mp-time">0:00</span></div>
        <p class="mp-note">Preview. The full recording is published on the Embassy's official channels.</p>
      </div>
    </div>`);
  document.body.appendChild(modal);

  const q = (s) => modal.querySelector(s);
  const stage = q(".mp-stage"), playBtn = q(".mp-play"), icPlay = q(".ic-play"), icPause = q(".ic-pause");
  const fill = q(".mp-fill"), timeEl = q(".mp-time"), badge = q(".mp-badge");
  let timer = null, t = 0, total = 240, playing = false;

  const toSec = (s) => { const m = (s || "").match(/(\d+):(\d{2})/); return m ? +m[1] * 60 + +m[2] : 240; };
  const fmt = (n) => Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0");
  const render = () => { fill.style.transform = "scaleX(" + (t / total) + ")"; timeEl.textContent = fmt(t) + " / " + fmt(total); };
  const stop = () => { playing = false; clearInterval(timer); timer = null; icPlay.hidden = false; icPause.hidden = true; };
  const play = () => {
    if (playing) return stop();
    if (t >= total) t = 0;
    playing = true; icPlay.hidden = true; icPause.hidden = false;
    timer = setInterval(() => { t += 0.25; if (t >= total) { t = total; render(); stop(); return; } render(); }, 250);
  };
  playBtn.addEventListener("click", play);

  const clearEmbed = () => { const e = stage.querySelector(".mp-embed"); if (e) e.remove(); };
  const open = (trg) => {
    const type = trg.dataset.media;
    const yt = trg.dataset.yt;
    q(".mp-title").textContent = trg.dataset.title || "";
    q(".mp-sub").textContent = trg.dataset.meta || "";
    badge.textContent = type === "audio" ? "Audio" : "Video";
    stage.classList.toggle("is-audio", type === "audio");
    clearEmbed();
    if (yt) {
      // Real media: embed the official YouTube player (autoplay) and hide the
      // simulated controls. Privacy-friendly nocookie host.
      stop(); modal.classList.add("is-embed");
      stage.style.backgroundImage = "";
      const f = document.createElement("iframe");
      f.className = "mp-embed";
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(yt) +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      f.title = trg.dataset.title || "Media player";
      f.setAttribute("frameborder", "0");
      f.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      f.allowFullscreen = true;
      stage.appendChild(f);
    } else {
      modal.classList.remove("is-embed");
      total = toSec(trg.dataset.meta); t = 0; stop(); render();
      stage.style.backgroundImage = type === "audio" ? "" : (trg.dataset.src ? `url('${trg.dataset.src}')` : "");
    }
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
  };
  const close = () => { stop(); clearEmbed(); modal.classList.remove("open"); setTimeout(() => (modal.hidden = true), 220); };
  triggers.forEach((tr) => tr.addEventListener("click", () => open(tr)));
  q(".mp-x").addEventListener("click", close);
  q(".mp-scrim").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
})();

/* ---- Official banner: "Here's how you know" toggle -------------------- */
(function () {
  "use strict";
  const btn = document.querySelector(".gov-how");
  const panel = document.querySelector(".gov-panel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });
})();

/* ---- News article reader (self-contained) ----------------------------- */
(function () {
  "use strict";
  const cards = Array.from(document.querySelectorAll(".ncard"));
  if (!cards.length) return;
  const mk = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const modal = mk('<div class="reader" role="dialog" aria-label="Article" hidden><div class="rd-scrim"></div><article class="rd-box"><button class="rd-x" aria-label="Close">&times;</button><span class="rd-date"></span><h2 class="rd-title"></h2><div class="rd-body"></div><p class="rd-note">Demonstration article. Full official releases are published in the Embassy <a href="news-events.html">Newsroom</a>.</p></article></div>');
  document.body.appendChild(modal);
  const close = () => { modal.classList.remove("open"); setTimeout(() => (modal.hidden = true), 200); };
  modal.querySelector(".rd-x").addEventListener("click", close);
  modal.querySelector(".rd-scrim").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const title = card.querySelector("h3")?.textContent || "Article";
      const date = card.querySelector(".date")?.textContent || "";
      const body = card.dataset.body || card.querySelector(".muted")?.textContent || "Further details will be shared by the Embassy.";
      modal.querySelector(".rd-title").textContent = title;
      modal.querySelector(".rd-date").textContent = date;
      modal.querySelector(".rd-body").innerHTML = "<p>" + esc(body) + "</p>";
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add("open"));
    });
  });
})();

/* ---- Live news alerts: severity-coloured pulse + click-through popups ----
   Driven by the CMS feed (admin chooses the colour via severity); falls back to
   a baked-in sample when the backend isn't reachable (e.g. static preview). --- */
(function () {
  "use strict";
  // c  = vivid colour (decorative chrome: pulse ring, dot, popup border)
  // cd = deepened, AA-safe variant used for TEXT and chip fills (>=4.5:1)
  const SEV = {
    critical: { c: "#d23b3b", cd: "#c0392b", label: "Urgent" },
    caution:  { c: "#e0a92e", cd: "#806000", label: "Notice" },
    success:  { c: "#2e9e6b", cd: "#1d7344", label: "Update" },
    info:     { c: "#2f8fd0", cd: "#2563ad", label: "News" },
  };
  const RANK = { critical: 3, caution: 2, success: 1, info: 0 };
  const FALLBACK = [
    { severity: "caution", title: "There are no online bookings until further notice", body: "Visa applications are received in person at the Embassy, Monday to Friday, 10:00–13:00.", link: "consular-services.html#visa" },
    { severity: "info", title: "The Washington Agreements: a new era of peace, sovereignty and prosperity for the DRC", body: "The DRC signed a peace agreement, a regional economic framework and a strategic partnership with the United States.", link: "news-events.html" },
    { severity: "success", title: "The DRC and the United States extend visa reciprocity", body: "Visa reciprocity now covers travel for tourism, study and business.", link: "consular-services.html#visa" },
  ];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sev = (s) => SEV[s] || SEV.info;
  // Only allow safe destinations (no javascript:/data: URLs).
  const safeLink = (u) => (/^(https?:\/\/|\/|[\w./#?-]+|tel:|mailto:)/i.test(String(u || "")) && !/^\s*javascript:/i.test(String(u || ""))) ? String(u) : "news-events.html";
  const seen = () => { try { return sessionStorage.getItem("emb-news-seen"); } catch (e) { return null; } };
  const markSeen = () => { try { sessionStorage.setItem("emb-news-seen", "1"); } catch (e) {} };

  function pulseTag(top) {
    const tag = document.querySelector(".announce .tag");
    if (!tag) return;
    const s = sev(top.severity);
    tag.classList.add("news-live");
    tag.style.setProperty("--nc", s.c);
    tag.style.setProperty("--ncd", s.cd);
    tag.textContent = s.label;
  }

  // Replace the scrolling ticker headlines with the admin's published items
  // (notices, ticker items and news); keep the static markup as a fallback.
  function fillTicker(items) {
    const scroller = document.querySelector(".announce .ticker .scrolling");
    if (!scroller) return;
    const tick = items.filter((i) => ["ticker", "notice", "news"].indexOf(i.type) !== -1);
    if (!tick.length) return;
    const set = () => tick.map((i) => '<a href="' + safeLink(i.link) + '">' + esc(i.title) + " &middot;</a>").join("");
    scroller.innerHTML = set() + set(); // duplicate for a seamless loop
  }

  function popups(items) {
    if (seen() || !items.length) return;        // show once per visit
    markSeen();
    const stack = document.createElement("div");
    stack.className = "news-stack";
    items.slice(0, 3).forEach((it, i) => {
      const s = sev(it.severity);
      const pop = document.createElement("a");
      pop.className = "news-pop";
      pop.href = safeLink(it.link);
      pop.style.setProperty("--nc", s.c);
      pop.style.setProperty("--ncd", s.cd);
      pop.style.animationDelay = (i * 0.16 + 0.5) + "s";
      pop.innerHTML =
        '<span class="np-head"><span class="np-dot"></span><span class="np-tag">' + esc(s.label) + "</span></span>" +
        '<button class="np-x" type="button" aria-label="Dismiss">&times;</button>' +
        '<b class="np-title">' + esc(it.title) + "</b>" +
        '<span class="np-cta">Read more &rarr;</span>';
      const dismiss = () => { pop.classList.add("out"); setTimeout(() => pop.remove(), 220); };
      pop.querySelector(".np-x").addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation(); dismiss();
      });
      // auto-dismiss so they never linger; pause while hovered
      let timer = setTimeout(dismiss, 9000 + i * 1200);
      pop.addEventListener("mouseenter", () => clearTimeout(timer));
      pop.addEventListener("mouseleave", () => { timer = setTimeout(dismiss, 3500); });
      stack.appendChild(pop);
    });
    document.body.appendChild(stack);
  }

  // Show/hide the compact hero "Latest news" button (admin hero_news toggle).
  // It links straight to the newsroom, so no per-item text/link injection.
  function heroNews(items, flags) {
    const pill = document.querySelector("[data-hero-news]");
    if (pill) pill.hidden = (flags.hero_news === false);
  }

  function render(items, flags) {
    flags = flags || {};
    items = (items || []).filter((x) => x && x.title);
    items.sort((a, b) => (RANK[b.severity] || 0) - (RANK[a.severity] || 0));
    heroNews(items, flags);                                       // hero pill + toggle
    if (!items.length) return;
    if (flags.news_pulse !== false) pulseTag(items[0]);           // admin toggles
    if (flags.news_ticker !== false) fillTicker(items);
    if (flags.announcement_popups !== false) popups(items);
  }

  fetch((window.EMBASSY_API || "") + "/announcements/live", { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((d) => render(d.items || d, d.flags))
    .catch(() => render(FALLBACK, {}));
})();

/* ---- Live embassy load meter: real booking data, updates as people book ---- */
(function () {
  const mounts = document.querySelectorAll("[data-embassy-load]");
  if (!mounts.length) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function paint(m, d) {
    const compact = m.dataset.embassyLoad === "compact";
    const best = d.best_day || {};
    const bars = (d.days || []).map((day) => {
      const h = Math.max(5, day.pct);
      const cls = "lm-day lv-" + String(day.level).toLowerCase() +
        (day.today ? " is-today" : "") + (best.date === day.date ? " is-best" : "");
      return '<div class="' + cls + '"><div class="lm-track"><div class="lm-fill" style="height:' + h + '%"></div></div>' +
        '<span class="lm-wd">' + esc(day.weekday) + "</span>" +
        (compact ? "" : '<span class="lm-lv">' + esc(day.level) + "</span>") + "</div>";
    }).join("");
    m.innerHTML =
      '<div class="lm-head"><span class="lm-live"><i></i>Live</span>' +
      '<span class="lm-cap">Consular Section, next open days</span></div>' +
      '<div class="lm-bars">' + bars + "</div>" +
      '<p class="lm-best">Quietest day to visit: <b>' + esc(best.label || "") + "</b></p>";
  }

  fetch((window.EMBASSY_API || "") + "/embassy/load", { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((d) => mounts.forEach((m) => paint(m, d)))
    .catch(() => mounts.forEach((m) => { m.innerHTML = '<p class="lm-off">Live wait times are unavailable right now.</p>'; }));
})();

/* ---- Lightbox for the ambience gallery ([data-zoom]) ------------------- */
(function () {
  "use strict";
  const items = Array.from(document.querySelectorAll("[data-zoom]"));
  if (!items.length) return;
  const box = document.createElement("div");
  box.className = "lbox";
  box.innerHTML = '<button class="lb-x" type="button" aria-label="Close">&times;</button><img alt=""><div class="lb-cap"></div>';
  document.body.appendChild(box);
  const img = box.querySelector("img"), cap = box.querySelector(".lb-cap");
  const close = () => box.classList.remove("open");
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-x")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  items.forEach((it) =>
    it.addEventListener("click", (e) => {
      e.preventDefault();
      img.src = it.getAttribute("data-zoom");
      cap.textContent = it.getAttribute("data-cap") || "";
      box.classList.add("open");
    }),
  );
})();

/* ---- Resources menu: custom pages built in the admin ------------------ */
(function () {
  "use strict";
  const mount = document.getElementById("resources-widget");
  if (!mount) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  fetch((window.EMBASSY_API || "") + "/content/pages", { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r)))
    .then((d) => {
      const items = (d.items || []).filter((p) => p && p.title && p.slug);
      if (!items.length) return; // nothing published -> stay hidden
      const cards = items
        .map((p) =>
          '<a class="res-card" href="/embassy-preview/p/' + encodeURIComponent(p.slug) + '">' +
          '<b>' + esc(p.title) + "</b>" +
          (p.excerpt ? "<span>" + esc(p.excerpt) + "</span>" : "") +
          '<i class="res-arrow">&rarr;</i></a>',
        )
        .join("");
      mount.innerHTML =
        '<div class="container"><div class="sec-head center"><p class="eyebrow">Resources</p><div class="rule"></div>' +
        "<h2>Helpful information</h2><p>Guides and resources from the Embassy.</p></div>" +
        '<div class="res-grid">' + cards + "</div></div>";
      mount.style.display = "";
    })
    .catch(() => {});
})();

/* ---- Bilingual language switch (English / Francais) ------------------------
   The site is authored in English. This adds a working Francais toggle for the
   shared chrome (official banner, navigation, footer) and the home page. It is
   dictionary-driven and applied at the text-node level, so only strings with a
   known translation change; dynamic values (clocks, prices, names) are left as
   they are. The choice is saved and re-applied to content injected later (the
   news ticker and pop-ups) via a MutationObserver. --------------------------- */
(function () {
  "use strict";

  // English (exact rendered text, whitespace-collapsed) -> Francais.
  var FR = {
    // -- Official banner / brand --
    "An official website of the Embassy of the Democratic Republic of the Congo": "Un site officiel de l’Ambassade de la République démocratique du Congo",
    "Here’s how you know": "Voici comment le savoir",
    "Here's how you know": "Voici comment le savoir",
    "Official source": "Source officielle",
    "Secure connection": "Connexion sécurisée",
    "EMBASSY OF THE DRC": "AMBASSADE DE LA RDC",
    "Democratic Republic of the Congo": "République démocratique du Congo",

    // -- Primary navigation --
    "Home": "Accueil",
    "The Embassy": "L’Ambassade",
    "About the Embassy": "À propos de l’Ambassade",
    "The Ambassador": "L’Ambassadeur",
    "Divisions": "Divisions",
    "Discover the DRC": "Découvrir la RDC",
    "About DR Congo": "À propos de la RDC",
    "Invest in DRC": "Investir en RDC",
    "Tourism": "Tourisme",
    "Culture & Heritage": "Culture & patrimoine",
    "Consular Services": "Services consulaires",
    "Services for our citizens": "Services pour nos citoyens",
    "Passports": "Passeports",
    "Visas": "Visas",
    "Tenant-Lieu": "Tenant-Lieu",
    "Legalization": "Légalisation",
    "Fees & Processing": "Frais & traitement",
    "News & Events": "Actualités & événements",
    "Contact Us": "Nous contacter",
    "Request appointment": "Demander un rendez-vous",
    "Request now": "Demander maintenant",
    "Request biometric appointment": "Demander un rendez-vous biométrique",
    // nav drop-down descriptions
    "Our mission, history and role in the U.S.": "Notre mission, notre histoire et notre rôle aux États-Unis",
    "Message and biography of the Head of Mission": "Message et biographie du Chef de mission",
    "Consular, political, economic & cultural sections": "Sections consulaire, politique, économique & culturelle",
    "Geography, people and the essential facts": "Géographie, population et faits essentiels",
    "Opportunities, key sectors and incentives": "Opportunités, secteurs clés et incitations",
    "National parks, wildlife and destinations": "Parcs nationaux, faune et destinations",
    "Music, art and Congolese traditions": "Musique, art et traditions congolaises",
    "Apply for or renew your biometric passport": "Demander ou renouveler votre passeport biométrique",
    "Entry visas for travel to the DRC": "Visas d’entrée pour voyager en RDC",
    "Emergency travel document (laissez-passer)": "Document de voyage d’urgence (laissez-passer)",
    "Authenticate documents and signatures": "Authentifier documents et signatures",
    "Service costs and turnaround times": "Coûts des services et délais de traitement",

    // -- Hero --
    "Serving DR Congolese citizens and strengthening partnerships between the DRC and the United States.": "Au service des citoyens congolais et du renforcement des partenariats entre la RDC et les États-Unis.",
    "Consular services": "Services consulaires",
    "Request an appointment": "Demander un rendez-vous",
    // hero heading - the <em>country name</em> already translates on its own,
    // this is the surrounding text node ("… de la <em>République …</em>.")
    "Welcome to the Embassy of the": "Bienvenue à l’Ambassade de la",

    // -- Home: quick facts, sidebar cards, download list --
    "Local time": "Heure locale",
    "Currency": "Devise",
    "Consular jurisdiction": "Juridiction consulaire",
    "Consular jurisdiction: the entire United States": "Juridiction consulaire : l’ensemble des États-Unis",
    "Key contacts": "Contacts clés",
    "Department contacts": "Contacts des services",
    "Renew or apply": "Renouveler ou demander",
    "Authenticate documents": "Authentifier des documents",
    "Request online": "Demander en ligne",
    "Application status": "Statut de la demande",
    "Important links": "Liens importants",
    "Upcoming holidays": "Jours fériés à venir",
    "Fee estimator": "Estimateur de frais",
    "Document pick-up": "Retrait de documents",
    "Passport & renewal requirements": "Conditions de passeport et de renouvellement",
    "Travel & entry requirements": "Conditions de voyage et d’entrée",
    "Visa & e-Visa information": "Informations sur les visas et e-Visa",
    "Required for most travellers.": "Requis pour la plupart des voyageurs.",
    "Valid at least six months, with two blank pages.": "Valable au moins six mois, avec deux pages vierges.",
    "A yellow-fever vaccination certificate is mandatory.": "Un certificat de vaccination contre la fièvre jaune est obligatoire.",
    "Carry identification at all times.": "Ayez toujours une pièce d’identité sur vous.",
    "Information out of date, or have something to report?": "Information obsolète, ou quelque chose à signaler ?",
    "Explore": "Explorer",
    "Explore the full gallery": "Découvrir toute la galerie",
    "Resources": "Ressources",
    "View": "Voir",
    "Economic affairs · 3:18": "Affaires économiques · 3:18",
    "Checking…": "Vérification…",

    // -- The Ambassador (Head of Mission is a woman → feminine title; H.E. → S.E.) --
    "Ambassador Extraordinary & Plenipotentiary of the DRC": "Ambassadrice extraordinaire et plénipotentiaire de la RDC",
    "H.E. Yvette Kapinga Ngandu": "S.E. Yvette Kapinga Ngandu",
    "H.E. Félix-Antoine Tshisekedi Tshilombo": "S.E. Félix-Antoine Tshisekedi Tshilombo",

    // -- Contact / phone labels --
    "Tel": "Tél.",
    "Tel +1 (202) 234-7690": "Tél. +1 (202) 234-7690",

    // -- Dates shown on the home page (holidays / updates) --
    "Jun 30": "30 juin",
    "Jul 4": "4 juil.",
    "Aug 1": "1er août",
    "May 11, 2026": "11 mai 2026",
    "May 2026": "mai 2026",
    "12 months": "12 mois",
    "2 years": "2 ans",

    // -- News & Events: passport communiqué + real news --
    "Featured · Consular": "En vedette · Consulaire",
    "Passport services": "Services de passeport",
    "Biometric passport applications: how to apply": "Demande de passeport biométrique : comment procéder",
    "Biometric data capture for the Congolese passport is available at the Embassy. Applying involves two steps: online pre-registration - obtain your NIF tax identification number, pre-register on the national passport portal and pay the official fee - followed by a biometric appointment at the Embassy with your original documents.": "La capture des données biométriques pour le passeport congolais est disponible à l’Ambassade. La demande se déroule en deux étapes : la pré-inscription en ligne - obtenez votre numéro d’identification fiscale (NIF), pré-inscrivez-vous sur le portail national des passeports et acquittez les frais officiels - suivie d’un rendez-vous biométrique à l’Ambassade avec vos documents originaux.",
    "Passport requirements": "Conditions de passeport",
    "Biometric passport data capture at the Embassy": "Capture des données biométriques du passeport à l’Ambassade",
    "Data capture for the biometric Congolese passport is available at the Embassy. Complete your online pre-registration and payment, then attend your biometric appointment with your original documents.": "La capture des données pour le passeport biométrique congolais est disponible à l’Ambassade. Effectuez votre pré-inscription et votre paiement en ligne, puis présentez-vous à votre rendez-vous biométrique avec vos documents originaux.",
    "The DRC signed a peace agreement, a regional economic framework and a strategic partnership with the United States, opening a new chapter in bilateral relations.": "La RDC a signé un accord de paix, un cadre économique régional et un partenariat stratégique avec les États-Unis, ouvrant un nouveau chapitre des relations bilatérales.",
    "Visa reciprocity between the two countries now covers travel for tourism, study and business. See the current requirements before you apply.": "La réciprocité des visas entre les deux pays couvre désormais les voyages pour le tourisme, les études et les affaires. Consultez les conditions en vigueur avant de faire votre demande.",
    "Communiqué: biometric passport data capture and how to apply": "Communiqué : capture des données biométriques du passeport et démarche à suivre",
    "Jun 10, 2026": "10 juin 2026",
    "Jun 30, 2026": "30 juin 2026",

    // -- Shared chrome: skip link, emergency, government panel, footer --
    "Skip to main content": "Passer au contenu principal",
    "24/7 Emergency": "Urgence 24/7",
    "Office hours: Mon–Thu 9:00–16:00 · Fri 9:00–13:00 · Sat–Sun & holidays closed": "Heures d’ouverture : lun.–jeu. 9:00–16:00 · ven. 9:00–13:00 · sam.–dim. et jours fériés fermé",
    "This connection is encrypted (HTTPS). Look for the padlock in your browser before submitting personal information.": "Cette connexion est chiffrée (HTTPS). Repérez le cadenas dans votre navigateur avant de transmettre des informations personnelles.",
    "Published by the Embassy of the DR Congo in Washington, D.C. Official correspondence uses the": "Publié par l’Ambassade de la RD Congo à Washington, D.C. La correspondance officielle utilise le domaine",
    "domain.": ".",
    "Your details are used only to contact you. See our": "Vos informations ne servent qu’à vous contacter. Consultez notre",

    // -- Stragglers: stats, dates, addresses, a notice --
    "Congo River": "Fleuve Congo",
    "2nd": "2e",
    "30 June 1960": "30 juin 1960",
    "1100 Connecticut Avenue NW, Suite 725, between L and M Streets.": "1100 Connecticut Avenue NW, Suite 725, entre les rues L et M.",
    "Average processing time is about 90 days, as passports are produced in Kinshasa. Until further notice, the Embassy is unable to issue passports to individuals holding refugee status.": "Le délai de traitement moyen est d’environ 90 jours, car les passeports sont produits à Kinshasa. Jusqu’à nouvel ordre, l’Ambassade n’est pas en mesure de délivrer des passeports aux personnes bénéficiant du statut de réfugié.",

    // -- Intro cards --
    "Visa Information": "Informations sur les visas",
    "Requirements & application process for travel to the DRC.": "Conditions et procédure de demande pour voyager en RDC.",
    "Learn more": "En savoir plus",
    "Passports, legalization & services for citizens abroad.": "Passeports, légalisation & services pour les citoyens à l’étranger.",
    "Access": "Accéder",
    "Latest news and events from the Embassy.": "Dernières actualités et événements de l’Ambassade.",
    "Latest news": "Actualités",
    "Newsroom & announcements": "Salle de presse et annonces",
    "Read more": "Lire la suite",
    "Get in touch with the Embassy for any inquiry.": "Contactez l’Ambassade pour toute demande.",
    "Contact": "Contact",

    // -- Quick tasks --
    "Quick tasks": "Tâches rapides",
    "I need to…": "J’ai besoin de…",
    "Jump straight to the most common consular tasks.": "Accédez directement aux démarches consulaires les plus courantes.",
    "Renew my passport": "Renouveler mon passeport",
    "Requirements & fees": "Conditions & frais",
    "Apply for a visa": "Demander un visa",
    "Travel to the DRC": "Voyager en RDC",
    "Legalize a document": "Légaliser un document",
    "Authenticate for use abroad": "Authentifier pour usage à l’étranger",
    "Consular section": "Section consulaire",
    "Check application status": "Vérifier l’état d’une demande",
    "Track your request": "Suivre votre demande",
    "Contact a department": "Contacter un service",
    "Consular · Economic · Press": "Consulaire · Économique · Presse",

    // -- Tools & services --
    "Tools & services": "Outils & services",
    "Plan your visit at a glance": "Préparez votre visite en un coup d’œil",
    "Live information and quick estimators for citizens and visitors.": "Informations en direct et estimateurs rapides pour les citoyens et visiteurs.",
    "The DRC is GMT+1, about 6 hours ahead of D.C.": "La RDC est à GMT+1, environ 6 heures d’avance sur Washington.",
    "Office Mon–Thu 9 AM–4 PM, Fri 9 AM–1 PM · Consular drop-off 10 AM–1 PM": "Bureau lun.–jeu. 9 h–16 h, ven. 9 h–13 h · Dépôt consulaire 10 h–13 h",
    "Indicative rate · 1 USD ≈ 2,800 Congolese Francs": "Taux indicatif · 1 USD ≈ 2 800 francs congolais",
    "Passport renewal": "Renouvellement de passeport",
    "New passport": "Nouveau passeport",
    "Tourist visa (1 month)": "Visa touristique (1 mois)",
    "Business visa": "Visa d’affaires",
    "Document legalization": "Légalisation de document",

    // -- Travel / safety / registration --
    "Travel, safety & registration": "Voyage, sécurité & inscription",
    "Travelling to or living in the DRC?": "Vous voyagez ou vivez en RDC ?",
    "Review the current entry requirements and travel guidance, and register with the Embassy so we can send you alerts and reach you in an emergency.": "Consultez les conditions d’entrée et les conseils aux voyageurs en vigueur, et inscrivez-vous auprès de l’Ambassade afin que nous puissions vous envoyer des alertes et vous joindre en cas d’urgence.",
    "Advisory in effect": "Avis en vigueur",
    "Reviewed 24 June 2026": "Révisé le 24 juin 2026",
    "Exercise increased caution across the country. Avoid non-essential travel to the eastern provinces, North Kivu, South Kivu and Ituri, where the security situation remains volatile.": "Faites preuve d’une vigilance accrue dans tout le pays. Évitez tout voyage non essentiel vers les provinces de l’Est - Nord-Kivu, Sud-Kivu et Ituri - où la situation sécuritaire reste instable.",
    "Visa": "Visa",
    "Passport": "Passeport",
    "Health": "Santé",
    "On arrival": "À l’arrivée",
    "Country & travel information": "Informations pays & voyage",
    "Suggest an update or request assistance": "Suggérer une mise à jour ou demander de l’aide",
    "Register with the Embassy": "S’inscrire auprès de l’Ambassade",
    "A free service for DR Congolese citizens and travellers. Receive safety alerts and consular notices, and let us reach you in an emergency.": "Un service gratuit pour les citoyens congolais et les voyageurs. Recevez des alertes de sécurité et des avis consulaires, et permettez-nous de vous joindre en cas d’urgence.",
    "Full name": "Nom complet",
    "Email": "Courriel",
    "Mobile (for SMS alerts)": "Mobile (pour alertes SMS)",
    "I am a…": "Je suis…",
    "Resident in the United States": "Résident aux États-Unis",
    "Traveller to the DRC": "Voyageur vers la RDC",
    "Student": "Étudiant",
    "Dual national": "Binational",
    "State or city of residence": "État ou ville de résidence",
    "Send me Embassy alerts and travel advisories by email and SMS.": "Envoyez-moi les alertes de l’Ambassade et les avis aux voyageurs par courriel et SMS.",
    "Register for alerts": "S’inscrire aux alertes",
    "Privacy Policy": "Politique de confidentialité",

    // -- About the Embassy --
    "Our diplomatic mission": "Notre mission diplomatique",
    "The Embassy of the Democratic Republic of the Congo advances the interests of the DRC and its citizens, fosters international cooperation, and promotes peace, prosperity and sustainable development between the DRC and the United States.": "L’Ambassade de la République démocratique du Congo défend les intérêts de la RDC et de ses citoyens, favorise la coopération internationale et promeut la paix, la prospérité et le développement durable entre la RDC et les États-Unis.",
    "Years of relations": "Années de relations",
    "U.S. states served": "États américains desservis",
    "Official languages": "Langues officielles",
    "Learn more about us": "En savoir plus sur nous",
    "Our mission is to serve every Congolese citizen with dignity, and to build an enduring friendship between the Democratic Republic of the Congo and the United States, rooted in justice, peace and shared progress.": "Notre mission est de servir chaque citoyen congolais avec dignité et de bâtir une amitié durable entre la République démocratique du Congo et les États-Unis, fondée sur la justice, la paix et le progrès partagé.",

    // -- Ambassador profile --
    "Our Ambassador": "Notre Ambassadrice",
    "Over 25 years in international diplomacy": "Plus de 25 ans de diplomatie internationale",
    "A distinguished and visionary leadership": "Un leadership distingué et visionnaire",
    "Her Excellency Yvette Kapinga Ngandu brings more than two decades of international diplomacy to Washington as Ambassador of the Democratic Republic of the Congo - a distinguished career spanning the African Union and the Economic Community of Central African States (ECCAS), where she served as Commissioner for Gender Promotion, Human and Social Development.": "Son Excellence Yvette Kapinga Ngandu apporte à Washington plus de vingt ans de diplomatie internationale comme Ambassadrice de la République démocratique du Congo - une carrière distinguée à l’Union africaine et à la Communauté économique des États de l’Afrique centrale (CEEAC), où elle a été Commissaire à la promotion du genre, au développement humain et social.",
    "A humble, deeply committed and accomplished leader, she has devoted her career to mediation, peace and development across the continent - and now to serving every Congolese citizen in the United States with dignity and care.": "Dirigeante humble, profondément engagée et accomplie, elle a consacré sa carrière à la médiation, à la paix et au développement à travers le continent - et désormais au service de chaque citoyen congolais aux États-Unis, avec dignité et attention.",
    "Under her guidance, the Embassy stands as a beacon of excellence - strengthening the enduring friendship between the DRC and the United States, and championing peace, opportunity and pride for all Congolese.": "Sous sa direction, l’Ambassade s’impose comme un modèle d’excellence - renforçant l’amitié durable entre la RDC et les États-Unis et défendant la paix, les opportunités et la fierté de tous les Congolais.",
    "Humble": "Humble",
    "Committed": "Engagée",
    "Excellent": "Excellence",
    "Visionary": "Visionnaire",
    "Read her message": "Lire son message",
    "Ambassador Extraordinary & Plenipotentiary of the DR Congo": "Ambassadrice extraordinaire et plénipotentiaire de la RD Congo",

    // -- How we serve --
    "How we serve our citizens": "Comment nous servons nos citoyens",
    "Passports, visas, travel documents and legalization, handled with care for the Congolese community in the United States.": "Passeports, visas, documents de voyage et légalisation, traités avec soin pour la communauté congolaise aux États-Unis.",
    "Issuance & renewal of DRC passports.": "Délivrance & renouvellement des passeports de la RDC.",
    "Requirements": "Conditions",
    "Entry visas for travel to the DRC.": "Visas d’entrée pour voyager en RDC.",
    "Laissez-Passer travel documents.": "Documents de voyage Laissez-Passer.",
    "Authenticate documents for use abroad.": "Authentifier des documents pour usage à l’étranger.",

    // -- How it works --
    "How it works": "Comment ça marche",
    "Check requirements": "Vérifier les conditions",
    "Review what your service needs.": "Vérifiez ce dont votre service a besoin.",
    "Prepare documents": "Préparer les documents",
    "Gather the required papers.": "Rassemblez les pièces requises.",
    "Submit application": "Soumettre la demande",
    "Online or in person.": "En ligne ou en personne.",
    "Schedule at your convenience.": "Planifiez à votre convenance.",
    "Attend appointment": "Se présenter au rendez-vous",
    "Verification & processing.": "Vérification & traitement.",
    "Receive service": "Recevoir le service",
    "Collect your documents.": "Récupérez vos documents.",

    // -- News --
    "Latest from the Embassy": "Les dernières nouvelles de l’Ambassade",
    "DR Congo and U.S. strengthen bilateral relations": "La RDC et les États-Unis renforcent leurs relations bilatérales",
    "Updated passport application processing times": "Mise à jour des délais de traitement des passeports",
    "DR Congo Tourism Promotion in the U.S.": "Promotion du tourisme de la RDC aux États-Unis",
    "View all news": "Voir toutes les actualités",

    // -- Media centre --
    "Media centre": "Centre des médias",
    "Watch, listen & read": "Regarder, écouter & lire",
    "Addresses from the Ambassador, consular briefings, press releases and official notices, gathered in one place.": "Allocutions de l’Ambassadeur, points consulaires, communiqués de presse et avis officiels, réunis en un seul endroit.",
    "Address to the Congolese Diaspora": "Allocution à la diaspora congolaise",
    "National Anthem of the DR Congo": "Hymne national de la RDC",
    "National anthem": "Hymne national",
    "Play the national anthem": "Écouter l’hymne national",
    "Head of State": "Chef de l’État",
    "President of the Democratic Republic of the Congo": "Président de la République démocratique du Congo",
    "The Embassy carries out its mission under the leadership of the President of the Republic, advancing the interests of the Democratic Republic of the Congo and its citizens, and strengthening the friendship between the DRC and the United States.": "L’Ambassade accomplit sa mission sous l’autorité du Président de la République, défendant les intérêts de la République démocratique du Congo et de ses citoyens et renforçant l’amitié entre la RDC et les États-Unis.",
    "Audio": "Audio",
    "Video": "Vidéo",
    "Document": "Document",
    "Notice": "Avis",
    "Update": "Mise à jour",
    "News": "Actualité",
    "Urgent": "Urgent",
    "The new biometric passport, step by step": "Le nouveau passeport biométrique, étape par étape",
    "Investment & Trade Forum 2026, highlights": "Forum investissement & commerce 2026, temps forts",
    "Press release: new biometric passport fees": "Communiqué : nouveaux frais du passeport biométrique",
    "Embassy closed Monday, 1 July, Independence Day": "Ambassade fermée le lundi 1er juillet, fête de l’Indépendance",
    "Official notice": "Avis officiel",

    // -- Forms & downloads --
    "Forms & downloads": "Formulaires & téléchargements",
    "Download and prepare consular forms before your appointment.": "Téléchargez et préparez les formulaires consulaires avant votre rendez-vous.",
    "Passport application form": "Formulaire de demande de passeport",
    "Visa application form": "Formulaire de demande de visa",
    "Document legalization request": "Demande de légalisation de document",
    "Laissez-Passer (Tenant-Lieu) form": "Formulaire Laissez-Passer (Tenant-Lieu)",
    "Download": "Télécharger",

    // -- Office hours / calendar --
    "Office hours": "Heures d’ouverture",
    "Monday – Thursday": "Lundi – jeudi",
    "Friday": "Vendredi",
    "Consular drop-off": "Dépôt consulaire",
    "Weekends": "Week-ends",
    "Closed": "Fermé",
    "Independence Day (DRC)": "Fête de l’Indépendance (RDC)",
    "Independence Day (US)": "Fête de l’Indépendance (É.-U.)",
    "Parents' Day (DRC)": "Fête des parents (RDC)",

    // -- Ambience --
    "Ambience": "Ambiance",
    "Life at the Embassy": "La vie à l’Ambassade",
    "National celebrations, diplomatic encounters and diaspora gatherings, captured in pictures.": "Célébrations nationales, rencontres diplomatiques et rassemblements de la diaspora, en images.",
    "National Day reception": "Réception de la fête nationale",
    "Bilateral meeting": "Réunion bilatérale",
    "Diaspora forum": "Forum de la diaspora",
    "Community gathering": "Rassemblement communautaire",
    "Cultural celebration": "Célébration culturelle",
    "Consular seminar": "Séminaire consulaire",
    "Trade delegation": "Délégation commerciale",
    "Ambassador's address": "Allocution de l’Ambassadeur",
    "Explore the full gallery": "Explorer toute la galerie",

    // -- Discover DR Congo --
    "Discover DR Congo": "Découvrir la RDC",
    "A land of opportunity & heritage": "Une terre d’opportunités & de patrimoine",
    "From breathtaking landscapes to rich culture, the DRC offers extraordinary opportunities for investment, tourism and cultural exchange.": "Des paysages à couper le souffle à une culture riche, la RDC offre des opportunités extraordinaires d’investissement, de tourisme et d’échanges culturels.",
    "Geography, history & people.": "Géographie, histoire & population.",
    "Priority industries & trade.": "Industries prioritaires & commerce.",
    "Destinations & travel tips.": "Destinations & conseils de voyage.",
    "Culture": "Culture",
    "Arts, music & heritage.": "Arts, musique & patrimoine.",

    // -- Secure access / emergency --
    "Secure access": "Accès sécurisé",
    "Need a consular service?": "Besoin d’un service consulaire ?",
    "Submit a consular request online and the Consular Section will follow up by email. Applications are received in person, Monday to Friday, 10:00–13:00, or by mail.": "Soumettez une demande consulaire en ligne et la Section consulaire vous répondra par courriel. Les demandes sont reçues en personne, du lundi au vendredi de 10h00 à 13h00, ou par courrier.",
    "View services": "Voir les services",
    "Emergency consular assistance": "Assistance consulaire d’urgence",
    "For DR Congolese citizens facing an emergency abroad, available 24/7.": "Pour les citoyens congolais confrontés à une urgence à l’étranger, disponible 24h/24 et 7j/7.",
    "Call +1 (202) 234-7690": "Appeler le +1 (202) 234-7690",

    // -- Helpful information --
    "Helpful information": "Informations utiles",
    "Guides and resources from the Embassy.": "Guides et ressources de l’Ambassade.",
    "Passport application guide": "Guide de demande de passeport",
    "Step-by-step guidance for biometric passport applications.": "Conseils étape par étape pour les demandes de passeport biométrique.",
    "A free service so we can reach you with alerts in an emergency.": "Un service gratuit pour vous joindre par alerte en cas d’urgence.",
    "Visa requirements": "Conditions de visa",
    "Who needs a visa, and the documents required to travel to the DRC.": "Qui a besoin d’un visa, et les documents requis pour voyager en RDC.",
    "How to authenticate and legalize documents for use in the DRC.": "Comment authentifier et légaliser des documents destinés à être utilisés en RDC.",

    // -- Contact --
    "Visit or contact the Embassy": "Visiter ou contacter l’Ambassade",
    "Embassy of the DRC": "Ambassade de la RDC",

    // -- Essential information --
    "Essential information": "Informations essentielles",
    "Everything you need to know": "Tout ce que vous devez savoir",
    "The Embassy in Washington, D.C. serves DR Congolese nationals across all 50 U.S. states & territories.": "L’Ambassade à Washington, D.C. sert les ressortissants congolais dans les 50 États & territoires des États-Unis.",
    "+39 more": "+39 autres",
    "e-Visa application portal": "Portail de demande e-Visa",
    "Passport status & renewal": "État & renouvellement du passeport",
    "Ministry of Foreign Affairs (DRC)": "Ministère des Affaires étrangères (RDC)",
    "Travel & health advisories": "Avis de voyage & de santé",
    "Consular fees schedule": "Grille des frais consulaires",
    "Holiday closure calendar": "Calendrier des jours fériés",
    "Consular Affairs": "Affaires consulaires",
    "Economic & Trade": "Économie & commerce",
    "Press & Communication": "Presse & communication",
    "Emergency (24/7)": "Urgence (24/7)",
    "Main line": "Ligne principale",

    // -- Footer --
    "Embassy of the Democratic Republic of the Congo, serving DR Congolese citizens and strengthening DRC–U.S. partnership.": "Ambassade de la République démocratique du Congo, au service des citoyens congolais et du renforcement du partenariat RDC–États-Unis.",
    "Services": "Services",
    "Visa & Passport": "Visa & passeport",
    "DR Congo": "RDC",
    "Stay informed": "Restez informé",
    "Subscribe for embassy news and announcements.": "Abonnez-vous aux actualités et annonces de l’Ambassade.",
    "Subscribe": "S’abonner",
    "An official website of the Embassy of the Democratic Republic of the Congo · Washington, D.C. · Official languages: Français & English": "Un site officiel de l’Ambassade de la République démocratique du Congo · Washington, D.C. · Langues officielles : Français & Anglais",
    "© 2026 Embassy of the Democratic Republic of the Congo, Washington, D.C.": "© 2026 Ambassade de la République démocratique du Congo, Washington, D.C.",
    "Terms & Conditions": "Conditions générales",
    "Cookie Policy": "Politique des cookies",
    "Accessibility": "Accessibilité",
    "Legal Disclaimer": "Mentions légales",

    // -- Real announcements (ticker / pop-ups / news) --
    "No online bookings until further notice - visa applications are received in person, Mon–Fri 10:00–13:00": "Aucune prise de rendez-vous en ligne jusqu’à nouvel ordre - les demandes de visa sont reçues en personne, du lundi au vendredi de 10h00 à 13h00",
    "There are no online bookings until further notice": "Aucune prise de rendez-vous en ligne jusqu’à nouvel ordre",
    "The Washington Agreements: a new era of peace, sovereignty and prosperity for the DRC": "Les Accords de Washington : une nouvelle ère de paix, de souveraineté et de prospérité pour la RDC",
    "The DRC and the United States extend visa reciprocity for tourism, study and business": "La RDC et les États-Unis étendent la réciprocité des visas pour le tourisme, les études et les affaires",
    "The DRC and the United States extend visa reciprocity": "La RDC et les États-Unis étendent la réciprocité des visas",
    "All consular payments must be made by blank money order only": "Tous les paiements consulaires doivent être effectués par mandat (money order) en blanc uniquement",
    "Visa applications received in person - no online bookings": "Demandes de visa reçues en personne - aucune réservation en ligne",
    "Important notice": "Avis important",

    // -- News ticker / pop-up headlines --
    "Embassy closed Monday, 1 July for Independence Day (DRC)": "Ambassade fermée le lundi 1er juillet pour la fête de l’Indépendance (RDC)",
    "Online appointment booking now available": "La prise de rendez-vous en ligne est désormais disponible",
    "Online appointment booking is now available": "La prise de rendez-vous en ligne est désormais disponible",
    "Ambassador hosts U.S.–DRC trade and investment roundtable": "L’Ambassadeur organise une table ronde sur le commerce et l’investissement RDC–États-Unis",
    "Mobile consulate visiting Houston, TX, 18–19 July": "Consulat mobile à Houston, TX, les 18–19 juillet",
    "New biometric passport fees effective June 2026": "Nouveaux frais de passeport biométrique à compter de juin 2026",
    "Schedule consular services from the website.": "Planifiez vos services consulaires depuis le site.",
    "Offices reopen Tuesday, 2 July.": "Les bureaux rouvrent le mardi 2 juillet.",

    // -- Embassy assistant widget --
    "Ask the Embassy": "Demander à l’Ambassade",
    "Embassy Assistant": "Assistant de l’Ambassade",
    "Bilingual · replies instantly": "Bilingue · réponses instantanées",
    "Automated guidance. For a person, call": "Aide automatisée. Pour joindre une personne, appelez le",
    // placeholders (translated via the placeholder pass, not text nodes)
    "Ask about passports, visas, hours…": "Posez une question sur les passeports, visas, horaires…",
    "A bridge between two nations": "Un pont entre deux nations",
    "A career diplomat with more than 25 years of experience across six international organisations, she most recently served as Commissioner for Gender Promotion, Human and Social Development at the Economic Community of Central African States (ECCAS). At the African Union she established and led the Continental Mediation Unit and the Secretariat of the Panel of the Wise, dedicating over a decade to preventive diplomacy across the continent.": "Diplomate de carrière forte de plus de 25 ans d’expérience au sein de six organisations internationales, elle a exercé en dernier lieu les fonctions de Commissaire à la promotion du genre et au développement humain et social au sein de la Communauté économique des États de l’Afrique centrale (CEEAC). À l’Union africaine, elle a créé et dirigé l’Unité continentale de médiation ainsi que le Secrétariat du Groupe des Sages, consacrant plus d’une décennie à la diplomatie préventive sur l’ensemble du continent.",
    "A national transition": "Une transition nationale",
    "A period of transition opens a new chapter in the nation's political and diplomatic life.": "Une période de transition ouvre un nouveau chapitre dans la vie politique et diplomatique de la nation.",
    "A present-day partnership": "Un partenariat contemporain",
    "About our mission": "À propos de notre mission",
    "Advances trade and investment ties and economic cooperation between the two nations.": "Renforce les liens commerciaux et d’investissement ainsi que la coopération économique entre les deux nations.",
    "Advances trade, investment and commercial cooperation between the DRC and the United States.": "Renforce les échanges commerciaux, les investissements et la coopération commerciale entre la RDC et les États-Unis.",
    "Advancing dialogue and cooperation between nations.": "Faire progresser le dialogue et la coopération entre les nations.",
    "African Union Mission": "Mission auprès de l’Union africaine",
    "Ambassador": "Ambassadrice",
    "Ambassador Extraordinary and Plenipotentiary": "Ambassadrice extraordinaire et plénipotentiaire",
    "Ambassador's Office": "Cabinet de l’Ambassadrice",
    "An era of nation-building": "Une ère d’édification nationale",
    "Answers to common questions about visiting, contacting and working with the Embassy of the DRC.": "Réponses aux questions fréquentes sur la visite, le contact et la collaboration avec l’Ambassade de la RDC.",
    "Building prosperity through trade and investment.": "Bâtir la prospérité par le commerce et l’investissement.",
    "Citizen services": "Services aux citoyens",
    "Community networking": "Réseautage communautaire",
    "Consular": "Consulaire",
    "Consular Section": "Section consulaire",
    "Contact us →": "Contactez-nous →",
    "Coordinates the Embassy's daily operations and supports the Ambassador across all divisions.": "Coordonne les opérations quotidiennes de l’Ambassade et assiste l’Ambassadrice au sein de l’ensemble des divisions.",
    "Cultural events": "Événements culturels",
    "Cultural exchange": "Échange culturel",
    "Decades of consolidation and engagement shape the country's institutions and its place on the African and world stage.": "Des décennies de consolidation et d’engagement façonnent les institutions du pays et sa place sur la scène africaine et mondiale.",
    "Deputy Chief of Mission": "Chef de mission adjoint",
    "Diplomacy": "Diplomatie",
    "Diplomatic reception": "Réception diplomatique",
    "Directs the mission, oversees high-level diplomacy and represents the DRC before U.S. institutions.": "Dirige la mission, supervise la diplomatie de haut niveau et représente la RDC auprès des institutions américaines.",
    "Do I need an appointment to visit the Embassy?": "Ai-je besoin d’un rendez-vous pour me rendre à l’Ambassade ?",
    "Economic": "Économique",
    "Economic & Trade Section": "Section économique et commerciale",
    "Economic Affairs": "Affaires économiques",
    "Economic cooperation": "Coopération économique",
    "Embassy leadership": "Direction de l’Ambassade",
    "Embassy of the DRC · Washington, D.C.": "Ambassade de la RDC · Washington, D.C.",
    "Every aspect of the Embassy's work is shaped by a commitment to our citizens, our partners and the lasting friendship between our two nations.": "Chaque aspect du travail de l’Ambassade est guidé par un engagement envers nos citoyens, nos partenaires et l’amitié durable entre nos deux nations.",
    "First democratic elections": "Premières élections démocratiques",
    "For diplomatic, consular or general inquiries, our team is here to assist you. We look forward to hearing from you.": "Pour toute demande diplomatique, consulaire ou générale, notre équipe est à votre disposition. Nous serons heureux de recevoir votre message.",
    "For passports, visas and documents, contact Consular Affairs. For trade and investment, contact Economic Affairs. For media and diplomatic matters, contact Political & Press Affairs. The Contact Us page lists each division directly.": "Pour les passeports, visas et documents, contactez les Affaires consulaires. Pour le commerce et l’investissement, contactez les Affaires économiques. Pour les questions médiatiques et diplomatiques, contactez les Affaires politiques et de presse. La page Contactez-nous répertorie directement chaque division.",
    "Frequently asked": "Questions fréquentes",
    "From independence to the present day, the relationship between the Democratic Republic of the Congo and the United States has grown through milestones of shared history and cooperation.": "De l’indépendance à nos jours, les relations entre la République démocratique du Congo et les États-Unis se sont développées au fil d’étapes marquantes d’une histoire et d’une coopération partagées.",
    "Gallery": "Galerie",
    "Get in touch": "Prenez contact",
    "Guided by the principles of dialogue, cooperation and mutual respect, the Embassy works to strengthen the enduring friendship between the Congolese and American peoples, promoting peace, prosperity and sustainable development for the benefit of both nations.": "Guidée par les principes du dialogue, de la coopération et du respect mutuel, l’Ambassade œuvre à renforcer l’amitié durable entre les peuples congolais et américain, en promouvant la paix, la prospérité et le développement durable au bénéfice des deux nations.",
    "Head of Mission": "Chef de mission",
    "Her Excellency Yvette Kapinga Ngandu presented her credentials as Ambassador Extraordinary and Plenipotentiary of the Democratic Republic of the Congo to the United States in 2025, having assumed her post on 30 October 2025. As the personal representative of the President of the Republic, she leads the Embassy's diplomatic, consular and economic engagement with the Government of the United States.": "Son Excellence Yvette Kapinga Ngandu a présenté ses lettres de créance en qualité d’Ambassadrice extraordinaire et plénipotentiaire de la République démocratique du Congo auprès des États-Unis en 2025, après avoir pris ses fonctions le 30 octobre 2025. En tant que représentante personnelle du Président de la République, elle dirige l’engagement diplomatique, consulaire et économique de l’Ambassade auprès du Gouvernement des États-Unis.",
    "Independence & first relations": "Indépendance et premières relations",
    "Issues passports, visas and travel documents and assists Congolese nationals in the United States.": "Délivre les passeports, visas et documents de voyage et assiste les ressortissants congolais aux États-Unis.",
    "Leadership": "Direction",
    "Leadership & offices": "Direction et services",
    "Leading the Embassy's mission and representing the Democratic Republic of the Congo before the Government of the United States.": "Diriger la mission de l’Ambassade et représenter la République démocratique du Congo auprès du Gouvernement des États-Unis.",
    "Leads the Embassy and represents the DRC before the Government of the United States.": "Dirige l’Ambassade et représente la RDC auprès du Gouvernement des États-Unis.",
    "Manages political dialogue, public diplomacy and the Embassy's communications and media relations.": "Gère le dialogue politique, la diplomatie publique ainsi que la communication et les relations avec les médias de l’Ambassade.",
    "Ministry of Foreign Affairs of the DRC": "Ministère des Affaires étrangères de la RDC",
    "Mission": "Mission",
    "Mission & values": "Mission et valeurs",
    "Moments from the Embassy's diplomatic, community and cultural engagements in Washington, D.C.": "Moments des engagements diplomatiques, communautaires et culturels de l’Ambassade à Washington, D.C.",
    "National celebration": "Célébration nationale",
    "Official meetings": "Réunions officielles",
    "Organization": "Organisation",
    "Our divisions": "Nos divisions",
    "Our history": "Notre histoire",
    "Our staff assist in French and English, the Embassy's two working languages, and can also help in several Congolese national languages including Lingala and Swahili.": "Notre personnel vous assiste en français et en anglais, les deux langues de travail de l’Ambassade, et peut également vous aider dans plusieurs langues nationales congolaises, notamment le lingala et le swahili.",
    "Oversees passports, visas and assistance to Congolese nationals across the United States.": "Supervise les passeports, les visas et l’assistance aux ressortissants congolais à travers les États-Unis.",
    "Partners & affiliations": "Partenaires et affiliations",
    "Peaceful transfer of power": "Transfert pacifique du pouvoir",
    "Political & Press Affairs": "Affaires politiques et de presse",
    "Presidency of the DRC": "Présidence de la RDC",
    "Public seminar": "Séminaire public",
    "Questions about the Embassy": "Questions sur l’Ambassade",
    "Reach the Embassy": "Joindre l’Ambassade",
    "Selected publications": "Publications sélectionnées",
    "Service to citizens": "Service aux citoyens",
    "Sharing the heritage and creativity of the Congo.": "Partager le patrimoine et la créativité du Congo.",
    "She holds a Master's degree in public administration and international relations from Bowling Green State University in Ohio, and is fluent in French, English, Spanish and Lingala.": "Elle est titulaire d’un master en administration publique et en relations internationales de la Bowling Green State University, dans l’Ohio, et parle couramment le français, l’anglais, l’espagnol et le lingala.",
    "Six decades of partnership": "Six décennies de partenariat",
    "Standing with Congolese nationals wherever they are.": "Aux côtés des ressortissants congolais où qu’ils se trouvent.",
    "The country marks its first peaceful, democratic transfer of power between heads of state.": "Le pays connaît son premier transfert pacifique et démocratique du pouvoir entre chefs d’État.",
    "The Democratic Republic of the Congo gains its independence, and diplomatic relations with the United States are established the same year.": "La République démocratique du Congo accède à l’indépendance, et les relations diplomatiques avec les États-Unis sont établies la même année.",
    "The diplomatic mission of the Democratic Republic of the Congo to the United States of America, serving citizens, advancing partnership and representing the nation in Washington, D.C.": "La mission diplomatique de la République démocratique du Congo auprès des États-Unis d’Amérique, au service des citoyens, au développement du partenariat et à la représentation de la nation à Washington, D.C.",
    "The DRC holds its first multiparty democratic elections, a landmark step in the nation's democratic journey.": "La RDC organise ses premières élections démocratiques multipartites, une étape déterminante dans le parcours démocratique de la nation.",
    "The Embassy continues to deepen diplomatic, economic and cultural ties between the Congolese and American peoples.": "L’Ambassade continue d’approfondir les liens diplomatiques, économiques et culturels entre les peuples congolais et américain.",
    "The Embassy in Washington, D.C. serves Congolese nationals and partners across all fifty U.S. states, providing consular and diplomatic services nationwide.": "L’Ambassade à Washington, D.C. est au service des ressortissants et partenaires congolais dans l’ensemble des cinquante États américains, offrant des services consulaires et diplomatiques sur tout le territoire.",
    "The Embassy of the Democratic Republic of the Congo in Washington, D.C. is the official representation of the DRC to the United States. We advance the interests of our nation and its citizens, deepen diplomatic, economic and cultural ties, and provide consular services to Congolese nationals across all fifty states.": "L’Ambassade de la République démocratique du Congo à Washington, D.C. est la représentation officielle de la RDC auprès des États-Unis. Nous défendons les intérêts de notre nation et de ses citoyens, approfondissons les liens diplomatiques, économiques et culturels, et fournissons des services consulaires aux ressortissants congolais dans l’ensemble des cinquante États.",
    "The Embassy works in coordination with national institutions and international partners.": "L’Ambassade travaille en coordination avec les institutions nationales et les partenaires internationaux.",
    "The Embassy's work is led by the Ambassador and carried out through its principal offices.": "Le travail de l’Ambassade est dirigé par l’Ambassadrice et mené à bien par l’intermédiaire de ses principaux services.",
    "The Embassy's work is organized across four divisions, each dedicated to a core area of the mission.": "Le travail de l’Ambassade s’organise autour de quatre divisions, chacune dédiée à un domaine essentiel de la mission.",
    "Today": "Aujourd’hui",
    "U.S. Department of State": "Département d’État des États-Unis",
    "Unofficial demo, this is a design prototype and not an official government website. Names, figures and content shown are illustrative.": "Démonstration non officielle : il s’agit d’un prototype de conception et non d’un site web gouvernemental officiel. Les noms, chiffres et contenus présentés sont fournis à titre indicatif.",
    "What guides us": "Ce qui nous guide",
    "What languages can I be assisted in?": "Dans quelles langues puis-je être assisté ?",
    "Which U.S. states does the Embassy serve?": "Quels États américains l’Ambassade dessert-elle ?",
    "Who should I contact for my request?": "Qui dois-je contacter pour ma demande ?",
    "Working together": "Travailler ensemble",
    "Yes. Most consular services are by appointment only. Please book through the online portal before visiting so our team can prepare your file and minimise your waiting time.": "Oui. La plupart des services consulaires se font uniquement sur rendez-vous. Veuillez réserver via le portail en ligne avant votre visite afin que notre équipe puisse préparer votre dossier et réduire votre temps d’attente.",
    "“Central Africa and the New Global Economy”, Foreign Policy Review, 2024": "« L’Afrique centrale et la nouvelle économie mondiale », Foreign Policy Review, 2024",
    "“Citizens Abroad: Modernizing Consular Service”, Diplomatic Quarterly, 2021": "« Les citoyens à l’étranger : moderniser le service consulaire », Diplomatic Quarterly, 2021",
    "“Diplomacy of Resources: The DRC's Strategic Partnerships”, Journal of African Affairs, 2022": "« La diplomatie des ressources : les partenariats stratégiques de la RDC », Journal of African Affairs, 2022",
    "“The friendship between the Democratic Republic of the Congo and the United States is built on shared aspirations, for peace, for opportunity, and for a future our peoples shape together.”": "« L’amitié entre la République démocratique du Congo et les États-Unis repose sur des aspirations communes : à la paix, aux opportunités et à un avenir que nos peuples façonnent ensemble. »",
    "🌐 EN ▾": "🌐 FR ▾",
    "$75 · paid online via passeport.gouv.cd": "75 $ · payés en ligne via passeport.gouv.cd",
    ", and fees are non-refundable.": ", et les frais ne sont pas remboursables.",
    ", and pay": ", et réglez",
    ", complete your application on the national passport portal": ", complétez votre demande sur le portail national des passeports",
    "A temporary travel document (Laissez-Passer) issued to DR Congolese citizens who need to travel to the DRC when a valid passport is not available, for example in cases of loss, expiry or urgent return.": "Un document de voyage temporaire (Laissez-Passer) délivré aux ressortissants de la RD Congo qui doivent se rendre en RDC lorsqu’un passeport valide n’est pas disponible, par exemple en cas de perte, d’expiration ou de retour urgent.",
    "Airport transit visa - one way / round trip": "Visa de transit aéroportuaire - aller simple / aller-retour",
    "All original documents and one photocopy of each": "Tous les documents originaux et une photocopie de chacun",
    "Answers to the most common questions about our consular services.": "Réponses aux questions les plus fréquentes sur nos services consulaires.",
    "Application reference": "Référence de la demande",
    "Apply online or in person.": "Faites votre demande en ligne ou en personne.",
    "Appointments": "Rendez-vous",
    "Appointments & visiting": "Rendez-vous et visites",
    "Attend your biometric appointment": "Présentez-vous à votre rendez-vous biométrique",
    "Authentication and legalization of documents, civil records, academic diplomas, powers of attorney and commercial papers, so they can be recognized and used officially in the Democratic Republic of the Congo.": "Authentification et légalisation de documents, d’actes d’état civil, de diplômes universitaires, de procurations et de documents commerciaux, afin qu’ils puissent être reconnus et utilisés officiellement en République démocratique du Congo.",
    "Before you arrive": "Avant votre arrivée",
    "Biometric Information Sheet": "Fiche de renseignements biométriques",
    "Biometric passports take on average about 90 days, as they are produced in Kinshasa. Visas are processed in a minimum of 1–2 business days once a complete application is received; Tenant-Lieu (Laissez-Passer) and document legalization are handled within a few business days. Times begin once a complete application and payment have been received.": "Les passeports biométriques nécessitent en moyenne environ 90 jours, car ils sont produits à Kinshasa. Les visas sont traités en un minimum de 1 à 2 jours ouvrables une fois une demande complète reçue ; le Tenant-Lieu (Laissez-Passer) et la légalisation de documents sont traités en quelques jours ouvrables. Les délais commencent dès qu’une demande complète et le paiement ont été reçus.",
    "Birth certificate": "Acte de naissance",
    "blank money order only": "mandat vierge uniquement",
    "Business": "Affaires",
    "Can I apply by mail?": "Puis-je faire ma demande par courrier ?",
    "Can I hold dual nationality?": "Puis-je détenir la double nationalité ?",
    "Certificate of inheritance": "Certificat d’hérédité",
    "Check status": "Vérifier le statut",
    "Check your application status": "Vérifiez le statut de votre demande",
    "Collect or receive your documents.": "Récupérez ou recevez vos documents.",
    "Completed Laissez-Passer request form": "Formulaire de demande de Laissez-Passer dûment rempli",
    "Completed visa application form": "Formulaire de demande de visa dûment rempli",
    "Consular drop-off (Mon–Fri)": "Dépôt consulaire (lun–ven)",
    "Consular fees": "Frais consulaires",
    "Consular fees are payable by money order or certified cashier's check made out to the \"Embassy of the DRC.\" Personal checks and cash sent by mail are not accepted. The exact, non-refundable fee for your service must accompany your application.": "Les frais consulaires sont payables par mandat (money order) ou chèque de banque certifié libellé à l’ordre de « Embassy of the DRC ». Les chèques personnels et les espèces envoyés par courrier ne sont pas acceptés. Le montant exact et non remboursable des frais de votre service doit accompagner votre demande.",
    "Consular fees in U.S. dollars, following the Embassy's published schedule. All payments must be made by": "Frais consulaires en dollars américains, selon le barème publié par l’Ambassade. Tous les paiements doivent être effectués par",
    "Contact the Embassy": "Contacter l’Ambassade",
    "Copy of applicant's identification": "Copie de la pièce d’identité du demandeur",
    "Copy of your current or previous passport (bio-data page only)": "Copie de votre passeport actuel ou précédent (page de données personnelles uniquement)",
    "Do you offer same-day service?": "Proposez-vous un service le jour même ?",
    "Document pick-up (Fri)": "Retrait de documents (ven)",
    "Document pick-up (Mon–Thu)": "Retrait de documents (lun–jeu)",
    "Download and complete the relevant form before your appointment. Forms are available in English and French.": "Téléchargez et complétez le formulaire correspondant avant votre rendez-vous. Les formulaires sont disponibles en anglais et en français.",
    "Email your documents": "Envoyez vos documents par courriel",
    "Enter your application reference number and last name to see the current status of your consular request. This is a demonstration form and does not query a live system.": "Saisissez le numéro de référence de votre demande et votre nom de famille pour consulter le statut actuel de votre requête consulaire. Il s’agit d’un formulaire de démonstration qui n’interroge aucun système en temps réel.",
    "Entry visas for travel to the Democratic Republic of the Congo, available to U.S. citizens and foreign nationals legally residing in the United States.": "Visas d’entrée pour se rendre en République démocratique du Congo, disponibles pour les citoyens américains et les ressortissants étrangers résidant légalement aux États-Unis.",
    "e‑NIF portal ↗": "Portail e‑NIF ↗",
    "Fee (USD)": "Frais (USD)",
    "Fee: $50 per document": "Frais : 50 $ par document",
    "Fee: $80": "Frais : 80 $",
    "Fee: from $120": "Frais : à partir de 120 $",
    "Fee: US $75": "Frais : 75 $ US",
    "Fees follow the Embassy's published consular schedule; confirm the fee for your service before submitting your application. Unofficial demonstration prototype.": "Les frais suivent le barème consulaire publié par l’Ambassade ; confirmez le montant des frais de votre service avant de soumettre votre demande. Prototype de démonstration non officiel.",
    "Frequently asked questions": "Foire aux questions",
    "Gather and copy the required papers.": "Rassemblez et photocopiez les documents requis.",
    "Getting started": "Pour commencer",
    "Help & guidance": "Aide et conseils",
    "How do I book an appointment?": "Comment prendre un rendez-vous ?",
    "How long does processing take?": "Combien de temps dure le traitement ?",
    "How to apply - three steps": "Comment faire une demande - trois étapes",
    "How to obtain a Congolese passport": "Comment obtenir un passeport congolais",
    "Step-by-step guide": "Guide étape par étape",
    "Watch this step-by-step guide to applying for a biometric passport of the Democratic Republic of the Congo, from pre-registration and payment to your biometric appointment. English subtitles are turned on by default - if they don’t appear, use the CC button and choose English.": "Regardez ce guide étape par étape pour demander un passeport biométrique de la République démocratique du Congo, de la préinscription et du paiement jusqu’à votre rendez-vous biométrique. Les sous-titres en anglais sont activés par défaut ; s’ils n’apparaissent pas, utilisez le bouton CC et choisissez l’anglais.",
    "Issuance and renewal of biometric passports of the Democratic Republic of the Congo for citizens residing in the United States, including first-time issuance, renewal of expired passports and replacement of lost or damaged passports.": "Délivrance et renouvellement des passeports biométriques de la République démocratique du Congo pour les citoyens résidant aux États-Unis, y compris la première délivrance, le renouvellement des passeports expirés et le remplacement des passeports perdus ou endommagés.",
    "Laissez-Passer / Tenant-Lieu form": "Formulaire Laissez-Passer / Tenant-Lieu",
    "Last name": "Nom de famille",
    "Legalization / other certificates": "Légalisation / autres certificats",
    "Legalization of Documents": "Légalisation de documents",
    "Location": "Lieu",
    "Marriage certificate": "Acte de mariage",
    "Minors also need an original birth certificate, legalized parental authorization and a parent’s passport.": "Les mineurs doivent également fournir un acte de naissance original, une autorisation parentale légalisée et le passeport d’un parent.",
    "Multiple-entry visa - 1 month": "Visa à entrées multiples - 1 mois",
    "Multiple-entry visa - 2 months": "Visa à entrées multiples - 2 mois",
    "Multiple-entry visa - 3 months": "Visa à entrées multiples - 3 mois",
    "Multiple-entry visa - 6 months": "Visa à entrées multiples - 6 mois",
    "Nationality rules are governed by the laws of the Democratic Republic of the Congo and may change. For your individual situation, please contact the consular section directly so we can advise you based on your specific circumstances and current regulations.": "Les règles de nationalité sont régies par les lois de la République démocratique du Congo et sont susceptibles de changer. Pour votre situation particulière, veuillez contacter directement la Section consulaire afin que nous puissions vous conseiller en fonction de vos circonstances spécifiques et de la réglementation en vigueur.",
    "Notarial services (real property)": "Services notariaux (biens immobiliers)",
    "Notice of Assessment (Note de Perception) + Equity BCDC proof of payment": "Avis d’imposition (Note de Perception) + preuve de paiement Equity BCDC",
    "Obtain a Tax ID (NIF) at the": "Obtenez un numéro d’identification fiscale (NIF) sur le",
    "Office hours, what to bring, and how to find the consular section.": "Heures d’ouverture, documents à apporter et comment trouver la Section consulaire.",
    "One passport-size photograph": "Une photographie au format passeport",
    "One photocopy of the document": "Une photocopie du document",
    "Original document to be legalized": "Document original à légaliser",
    "passeport.gouv.cd ↗": "passeport.gouv.cd ↗",
    "Passport (issuance / renewal)": "Passeport (délivrance / renouvellement)",
    "Passport valid for at least 6 months": "Passeport valide au moins 6 mois",
    "Payment of the per-document fee": "Paiement des frais par document",
    "Plan your visit": "Préparez votre visite",
    "Police report (for lost or stolen passport)": "Procès-verbal de police (pour passeport perdu ou volé)",
    "Power of attorney (corporation ownership sale)": "Procuration (vente de parts de société)",
    "Power of attorney (NGO / adoption)": "Procuration (ONG / adoption)",
    "Power of attorney template": "Modèle de procuration",
    "Pre-register & pay online.": "Préinscrivez-vous et payez en ligne.",
    "Prior notarization or apostille where required": "Notarisation ou apostille préalable lorsque requise",
    "Processing: 2–3 business days": "Traitement : 2 à 3 jours ouvrables",
    "Processing: 3–5 business days": "Traitement : 3 à 5 jours ouvrables",
    "Processing: 5–10 business days": "Traitement : 5 à 10 jours ouvrables",
    "Processing: ≈ 90 days": "Traitement : ≈ 90 jours",
    "Proof of accommodation or letter of invitation": "Justificatif d’hébergement ou lettre d’invitation",
    "Proof of DRC nationality": "Preuve de nationalité congolaise (RDC)",
    "Proof of travel (ticket or itinerary)": "Justificatif de voyage (billet ou itinéraire)",
    "Purpose: emergency / one-way travel": "Objet : voyage d’urgence / aller simple",
    "Purpose: official use in the DRC": "Objet : usage officiel en RDC",
    "Ready to begin? Plan your visit.": "Prêt à commencer ? Préparez votre visite.",
    "Report the loss or theft to your local police and obtain a police report. Then apply for a replacement passport or, if you must travel urgently, a Tenant-Lieu (Laissez-Passer). Bring the police report, proof of DRC nationality, and two passport-size photographs.": "Signalez la perte ou le vol à votre police locale et obtenez un procès-verbal de police. Demandez ensuite un passeport de remplacement ou, si vous devez voyager de toute urgence, un Tenant-Lieu (Laissez-Passer). Munissez-vous du procès-verbal de police, d’une preuve de nationalité congolaise (RDC) et de deux photographies au format passeport.",
    "Requirements checklist": "Liste des conditions à remplir",
    "Review what your chosen service needs.": "Vérifiez ce qu’exige le service que vous avez choisi.",
    "Saturday – Sunday & holidays": "Samedi – dimanche et jours fériés",
    "Schedule a convenient time.": "Choisissez un créneau qui vous convient.",
    "Schedule of fees": "Barème des frais",
    "Service": "Service",
    "Service 01": "Service 01",
    "Service 02": "Service 02",
    "Service 03": "Service 03",
    "Service 04": "Service 04",
    "Single-entry visa - 1 month": "Visa à entrée unique - 1 mois",
    "Single-entry visa - 2 months": "Visa à entrée unique - 2 mois",
    "Single-entry visa - 6 months": "Visa à entrée unique - 6 mois",
    "Six simple steps from checking requirements to receiving your service.": "Six étapes simples, de la vérification des conditions à la réception de votre service.",
    "Start an online request →": "Démarrer une demande en ligne →",
    "Start online ↗": "Démarrer en ligne ↗",
    "Tenant-Lieu (Laissez-Passer)": "Tenant-Lieu (Laissez-Passer)",
    "The consular section is located at 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036. Please arrive a few minutes before your scheduled time. Walk-ins without an appointment cannot be guaranteed service.": "La Section consulaire est située au 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036. Veuillez arriver quelques minutes avant l’heure de votre rendez-vous. Les personnes se présentant sans rendez-vous ne peuvent se voir garantir un service.",
    "The Embassy does not generally provide same-day service. Emergency travel documents such as the Tenant-Lieu may be expedited in genuine cases of urgency, for example a death in the family or medical emergency, subject to supporting documentation and Embassy approval.": "L’Ambassade ne fournit généralement pas de service le jour même. Les documents de voyage d’urgence tels que le Tenant-Lieu peuvent être traités en priorité dans les cas d’urgence avérés, par exemple un décès dans la famille ou une urgence médicale, sous réserve de pièces justificatives et de l’approbation de l’Ambassade.",
    "The Embassy provides a full range of consular services for DR Congolese citizens living in the United States, passports, visas, travel documents and legalization, delivered with care, clarity and respect.": "L’Ambassade offre une gamme complète de services consulaires aux ressortissants de la RD Congo vivant aux États-Unis - passeports, visas, documents de voyage et légalisation - fournis avec soin, clarté et respect.",
    "The exact consular fee by money order or cashier's check": "Le montant exact des frais consulaires par mandat (money order) ou chèque de banque",
    "There are no online bookings at this time - consular applications are received in person, Monday to Friday, 10:00–13:00, or by mail. You can also start a request online below as part of a service-modernisation pilot.": "Aucune prise de rendez-vous en ligne n’est disponible pour le moment - les demandes consulaires sont reçues en personne, du lundi au vendredi, de 10 h 00 à 13 h 00, ou par courrier. Vous pouvez également démarrer une demande en ligne ci-dessous dans le cadre d’un projet pilote de modernisation des services.",
    "There are no online bookings at this time. Consular applications are received in person during consular hours, Monday to Friday, 10:00–13:00; bring your completed forms, original documents and payment by money order. Applications may also be submitted by mail with a prepaid, trackable return envelope.": "Aucune prise de rendez-vous en ligne n’est disponible pour le moment. Les demandes consulaires sont reçues en personne pendant les heures consulaires, du lundi au vendredi, de 10 h 00 à 13 h 00 ; munissez-vous de vos formulaires remplis, de vos documents originaux et du paiement par mandat (money order). Les demandes peuvent également être soumises par courrier accompagnées d’une enveloppe de retour prépayée et suivie.",
    "to": "à",
    "Tourist": "Touriste",
    "Transit": "Transit",
    "Two passport-size photographs": "Deux photographies au format passeport",
    "Unofficial demo, downloadable forms are illustrative placeholders for prototype purposes only.": "Démo non officielle : les formulaires téléchargeables sont des exemples illustratifs destinés uniquement au prototype.",
    "Unofficial demo, no data is submitted or stored.": "Démo non officielle : aucune donnée n’est soumise ni conservée.",
    "US $75": "75 $ US",
    "Valid photo identification": "Pièce d’identité avec photo en cours de validité",
    "Verification & processing at the Embassy.": "Vérification et traitement à l’Ambassade.",
    "via the Equity BCDC link. Allow 72 hours for the system to register your payment.": "via le lien Equity BCDC. Comptez 72 heures pour que le système enregistre votre paiement.",
    "Visa - U.S. citizens (2 years, reciprocity)": "Visa - citoyens américains (2 ans, réciprocité)",
    "What if my passport is lost or stolen?": "Que faire si mon passeport est perdu ou volé ?",
    "What payment methods are accepted?": "Quels modes de paiement sont acceptés ?",
    "What to bring": "Ce qu’il faut apporter",
    "Who: DRC citizens in the U.S.": "Pour qui : les citoyens de la RDC aux États-Unis",
    "with the printed sheets, your current passport (a police report if lost or stolen), proof of Congolese nationality, a valid U.S. residency document (Green Card, work permit or I‑20) and a pre-paid, tracked return envelope.": "avec les fiches imprimées, votre passeport actuel (un procès-verbal de police en cas de perte ou de vol), une preuve de nationalité congolaise, un document de résidence américain valide (Green Card, permis de travail ou I‑20) et une enveloppe de retour prépayée et suivie.",
    "Yellow fever vaccination certificate": "Certificat de vaccination contre la fièvre jaune",
    "Yes. Mail-in applications are accepted for most services. Include your completed form, all required documents, the applicable fee by money order, and a prepaid, self-addressed return envelope with tracking. We recommend using a trackable courier service for your records.": "Oui. Les demandes par courrier sont acceptées pour la plupart des services. Joignez votre formulaire rempli, tous les documents requis, les frais applicables par mandat (money order) et une enveloppe de retour prépayée, libellée à votre adresse et avec suivi. Nous vous recommandons d’utiliser un service de messagerie avec suivi pour vos archives.",
    "Your completed application form and any reference number": "Votre formulaire de demande rempli et tout numéro de référence",
    "24/7 emergency consular line:": "Ligne consulaire d’urgence 24h/24 et 7j/7 :",
    "Address": "Adresse",
    "Answers to the most common questions received by the Embassy of the DRC in Washington, D.C.": "Réponses aux questions les plus fréquemment reçues par l’Ambassade de la RDC à Washington, D.C.",
    "Before you contact us": "Avant de nous contacter",
    "Bring a valid photo ID and your appointment reference. Suite 725.": "Munissez-vous d’une pièce d’identité avec photo en cours de validité et de votre référence de rendez-vous. Suite 725.",
    "Bring the original document together with a clear photocopy to the Consular Section during consular hours. Documents issued in the United States should first be notarized and, where required, authenticated by the U.S. Department of State before the Embassy can legalize them. Consular fees apply.": "Présentez le document original accompagné d’une photocopie lisible à la Section consulaire pendant les heures consulaires. Les documents délivrés aux États-Unis doivent d’abord être notariés et, le cas échéant, authentifiés par le Département d’État américain avant que l’Ambassade puisse les légaliser. Des frais consulaires s’appliquent.",
    "Complete the form below and the relevant department will respond during office hours.": "Remplissez le formulaire ci-dessous et le service concerné vous répondra pendant les heures d’ouverture.",
    "Connect with us": "Restez en contact",
    "Consular inquiry": "Demande consulaire",
    "Consular line": "Ligne consulaire",
    "Departments": "Services",
    "Direct your inquiry to the department that can help you fastest.": "Adressez votre demande au service le mieux à même de vous aider rapidement.",
    "Do I need an appointment to visit the Consular Section?": "Ai-je besoin d’un rendez-vous pour me rendre à la Section consulaire ?",
    "Economic & trade": "Économie et commerce",
    "Farragut North (Red) and Farragut West (Blue/Orange/Silver), a short walk.": "Farragut North (ligne rouge) et Farragut West (lignes bleue/orange/argent), à quelques minutes à pied.",
    "Follow the Embassy": "Suivre l’Ambassade",
    "General inquiry": "Demande générale",
    "Getting here": "Comment nous rejoindre",
    "How do I legalize or authenticate a document?": "Comment légaliser ou authentifier un document ?",
    "I lost my Congolese passport while abroad, what should I do?": "J’ai perdu mon passeport congolais à l’étranger, que dois-je faire ?",
    "Investment, bilateral commerce and partnership opportunities with the DRC.": "Investissement, commerce bilatéral et opportunités de partenariat avec la RDC.",
    "Media inquiries, official statements and embassy announcements.": "Demandes de la presse, communiqués officiels et annonces de l’Ambassade.",
    "Message": "Message",
    "Metered street parking and nearby paid garages on Connecticut Avenue.": "Stationnement payant dans la rue et parkings payants à proximité sur Connecticut Avenue.",
    "Nearest metro": "Métro le plus proche",
    "Parking": "Stationnement",
    "Passports, visas, legalization and services for citizens abroad.": "Passeports, visas, légalisation et services aux ressortissants à l’étranger.",
    "Press": "Presse",
    "Press & communication": "Presse et communication",
    "Reach the Embassy of the Democratic Republic of the Congo in Washington, D.C. for consular, trade and press inquiries, or visit us during office hours.": "Contactez l’Ambassade de la République démocratique du Congo à Washington, D.C. pour vos demandes consulaires, commerciales et de presse, ou rendez-vous sur place pendant les heures d’ouverture.",
    "Reach the right office": "Contactez le bon service",
    "Report the loss to the local police and obtain a written report, then contact the Consular Section as soon as possible. The Embassy can issue an emergency travel document or begin a replacement passport application so you can continue your travel or return to the DRC.": "Signalez la perte à la police locale et obtenez un procès-verbal écrit, puis contactez la Section consulaire dans les meilleurs délais. L’Ambassade peut délivrer un document de voyage d’urgence ou entamer une demande de passeport de remplacement afin que vous puissiez poursuivre votre voyage ou rentrer en RDC.",
    "Send message →": "Envoyer le message →",
    "Send us a message": "Envoyez-nous un message",
    "Stay up to date with official announcements, consular notices and events on the Embassy's social channels.": "Restez informé des annonces officielles, des avis consulaires et des événements sur les réseaux sociaux de l’Ambassade.",
    "Subject": "Objet",
    "The Embassy in Washington, D.C. provides consular and diplomatic services to Congolese nationals across all fifty U.S. states, the District of Columbia and U.S. territories. Mobile consulate visits bring services closer to communities outside the capital throughout the year.": "L’Ambassade à Washington, D.C. fournit des services consulaires et diplomatiques aux ressortissants congolais dans les cinquante États américains, le District de Columbia et les territoires américains. Les consulats mobiles rapprochent les services des communautés situées hors de la capitale tout au long de l’année.",
    "The Embassy is on Connecticut Avenue NW in the heart of downtown Washington, D.C., near Farragut Square. Plan your visit ahead of your appointment.": "L’Ambassade se situe sur Connecticut Avenue NW, au cœur du centre-ville de Washington, D.C., à proximité de Farragut Square. Planifiez votre visite avant votre rendez-vous.",
    "The Embassy is open Monday to Thursday 9:00 – 16:00 and Friday 9:00 – 13:00. The Consular Section receives documents Monday to Friday 10:00 – 13:00 and returns them Monday to Thursday 14:00 – 16:00. The Embassy is closed on weekends and on observed DRC and U.S. public holidays.": "L’Ambassade est ouverte du lundi au jeudi de 9h00 à 16h00 et le vendredi de 9h00 à 13h00. La Section consulaire reçoit les documents du lundi au vendredi de 10h00 à 13h00 et les restitue du lundi au jeudi de 14h00 à 16h00. L’Ambassade est fermée les week-ends ainsi que les jours fériés observés en RDC et aux États-Unis.",
    "Trade": "Commerce",
    "Visa & passport": "Visa et passeport",
    "Visiting the Embassy": "Se rendre à l’Ambassade",
    "Weekends & public holidays": "Week-ends et jours fériés",
    "What are the Embassy's office and consular hours?": "Quelles sont les heures d’ouverture et les heures consulaires de l’Ambassade ?",
    "Which U.S. states does this Embassy serve?": "Quels États américains cette Ambassade dessert-elle ?",
    "Write to us": "Écrivez-nous",
    "Yes. For passports, visas and document legalization we strongly recommend booking an appointment through the online portal before visiting, so the relevant officer and your file are ready. Walk-ins are accommodated only when capacity allows.": "Oui. Pour les passeports, les visas et la légalisation de documents, nous vous recommandons vivement de prendre rendez-vous via le portail en ligne avant de vous présenter, afin que l’agent concerné et votre dossier soient prêts. Les visites sans rendez-vous ne sont acceptées que dans la limite des places disponibles.",
    "Your message is sent securely to the Embassy and routed to the relevant department. You can also email": "Votre message est transmis en toute sécurité à l’Ambassade et acheminé au service concerné. Vous pouvez également écrire à",
    "+ 4 national languages": "+ 4 langues nationales",
    ", the National Agency for the Promotion of Investments.": ", l’Agence nationale pour la promotion des investissements.",
    "A continental-scale market at the heart of Africa, rich in the resources powering the global economy and the energy transition.": "Un marché à l’échelle continentale au cœur de l’Afrique, riche en ressources qui alimentent l’économie mondiale et la transition énergétique.",
    "A destination like no other": "Une destination sans pareille",
    "A fast-growing digital market with rising connectivity and demand for modern networks.": "Un marché numérique en forte croissance, porté par une connectivité en hausse et une demande de réseaux modernes.",
    "A global leader in cobalt and copper, with vast reserves powering the world's energy transition.": "Un leader mondial du cobalt et du cuivre, dont les vastes réserves alimentent la transition énergétique mondiale.",
    "A land of superlatives": "Une terre de superlatifs",
    "A nation of opportunity": "Une nation d’opportunités",
    "A vibrant nation": "Une nation dynamique",
    "A vibrant tradition of sculpture, painting and contemporary art.": "Une tradition vivante de sculpture, de peinture et d’art contemporain.",
    "A young, dynamic and rapidly growing population": "Une population jeune, dynamique et en croissance rapide",
    "A young, dynamic people across hundreds of ethnic groups.": "Un peuple jeune et dynamique, réparti entre des centaines de groupes ethniques.",
    "About the country": "À propos du pays",
    "Abundant resources, strategic scale and vast untapped potential make the DRC one of Africa's most compelling investment destinations.": "Des ressources abondantes, une envergure stratégique et un vaste potentiel inexploité font de la RDC l’une des destinations d’investissement les plus attractives d’Afrique.",
    "Advantages": "Avantages",
    "Africa's oldest national park and a UNESCO World Heritage Site, home to mountain gorillas.": "Le plus ancien parc national d’Afrique et site du patrimoine mondial de l’UNESCO, refuge des gorilles de montagne.",
    "Africa's oldest national park and a UNESCO World Heritage Site.": "Le plus ancien parc national d’Afrique et site du patrimoine mondial de l’UNESCO.",
    "Agriculture": "Agriculture",
    "Among the greatest hydroelectric potential on Earth": "Parmi les plus grands potentiels hydroélectriques de la planète",
    "ANAPI, Investment Promotion Agency": "ANAPI, Agence de promotion des investissements",
    "arable land available": "de terres arables disponibles",
    "Art": "Art",
    "At a glance": "En bref",
    "Banking": "Banque",
    "Blue": "Bleu",
    "Capital city": "Capitale",
    "Chamber of Commerce": "Chambre de commerce",
    "Community life": "Vie communautaire",
    "Conditions vary by region. Many areas, including Kinshasa and the principal tourist sites, welcome visitors year-round. We recommend reviewing current travel guidance and planning your itinerary with a reputable local operator.": "Les conditions varient selon les régions. De nombreuses zones, dont Kinshasa et les principaux sites touristiques, accueillent les visiteurs toute l’année. Nous vous recommandons de consulter les recommandations de voyage en vigueur et de planifier votre itinéraire avec un opérateur local réputé.",
    "Congo Basin rainforest": "Forêt tropicale du bassin du Congo",
    "Congolese Franc": "Franc congolais",
    "Contact the economic section →": "Contacter la section économique →",
    "Cuisine": "Cuisine",
    "Cultural sites": "Sites culturels",
    "Culture & heritage": "Culture et patrimoine",
    "Currency (CDF)": "Monnaie (CDF)",
    "Discover the nation": "Découvrir la nation",
    "Do I need a visa to enter the DRC?": "Ai-je besoin d’un visa pour entrer en RDC ?",
    "Energy": "Énergie",
    "Energy & Hydropower": "Énergie et hydroélectricité",
    "Engage with the DRC": "Engagez-vous avec la RDC",
    "Essential facts about the Democratic Republic of the Congo, the second-largest nation in Africa.": "Faits essentiels sur la République démocratique du Congo, deuxième plus grande nation d’Afrique.",
    "Forestry": "Foresterie",
    "French": "Français",
    "French alongside Lingala, Swahili, Kikongo and Tshiluba.": "Le français aux côtés du lingala, du swahili, du kikongo et du tshiluba.",
    "From fufu and moambe to fresh river fish and tropical produce.": "Du fufu et du moambe au poisson de rivière frais et aux produits tropicaux.",
    "From the volcanoes and gorilla sanctuaries of the east to the sweeping waters of the Congo River, the DRC offers some of the most extraordinary and unspoiled landscapes in the world.": "Des volcans et sanctuaires de gorilles de l’est aux eaux majestueuses du fleuve Congo, la RDC offre certains des paysages les plus extraordinaires et préservés au monde.",
    "Glimpses of the people, culture and energy of the Democratic Republic of the Congo.": "Aperçus du peuple, de la culture et de l’énergie de la République démocratique du Congo.",
    "Heritage & tradition": "Patrimoine et tradition",
    "Home to a young and dynamic population of more than 100 million people drawn from hundreds of ethnic groups and languages, the DRC is a nation of remarkable diversity, resilience and creativity, and a cornerstone of Central African stability and growth.": "Peuplée d’une population jeune et dynamique de plus de 100 millions d’habitants issus de centaines de groupes ethniques et de langues, la RDC est une nation d’une diversité, d’une résilience et d’une créativité remarquables, et une pierre angulaire de la stabilité et de la croissance de l’Afrique centrale.",
    "Home to mountain gorillas, okapi, bonobos and more.": "Refuge des gorilles de montagne, des okapis, des bonobos et bien d’autres.",
    "Housing": "Logement",
    "Hydrocarbons": "Hydrocarbures",
    "hydropower potential": "potentiel hydroélectrique",
    "identified mineral deposits": "gisements miniers identifiés",
    "Identity": "Identité",
    "Independence Day": "Jour de l’indépendance",
    "Infrastructure": "Infrastructure",
    "Investment is facilitated by": "L’investissement est facilité par",
    "Is it safe to travel in the DRC?": "Est-il sûr de voyager en RDC ?",
    "Justice, Peace, Work.": "Justice, Paix, Travail.",
    "Key facts": "Faits clés",
    "km², 2nd largest in Africa": "km², 2ᵉ plus vaste d’Afrique",
    "Languages": "Langues",
    "largest rainforest on Earth": "plus grande forêt tropicale de la planète",
    "length of the Congo River": "longueur du fleuve Congo",
    "Lingala, Kiswahili, Kikongo & Tshiluba are national languages.": "Le lingala, le kiswahili, le kikongo et le tshiluba sont des langues nationales.",
    "Living traditions, monuments and historic cities.": "Traditions vivantes, monuments et villes historiques.",
    "Major cities": "Grandes villes",
    "Digital modernization": "Modernisation numérique",
    "Digital services": "Services numériques",
    "Digital Services": "Services numériques",
    "New and expanding ways to reach the Embassy and get things done, from your phone, in English or French.": "De nouvelles façons, en constante évolution, de contacter l’Ambassade et d’accomplir vos démarches, depuis votre téléphone, en anglais ou en français.",
    "A modern mission": "Une mission moderne",
    "Serving citizens the modern way": "Servir les citoyens autrement",
    "The Embassy is bringing its services online so you spend less time waiting and more time living. Some are available today; others are rolling out as part of our digital modernization.": "L’Ambassade met ses services en ligne pour que vous passiez moins de temps à attendre et plus de temps à vivre. Certains sont déjà disponibles ; d’autres arrivent progressivement dans le cadre de notre modernisation numérique.",
    "24/7 AI assistant": "Assistant IA 24h/24",
    "Reach the Embassy at any hour. An AI assistant answers questions and books appointments by phone or chat, with no waiting on hold.": "Contactez l’Ambassade à toute heure. Un assistant IA répond à vos questions et prend vos rendez-vous par téléphone ou par messagerie, sans attente.",
    "Live wait times": "Temps d’attente en direct",
    "Live now": "En direct",
    "See how busy we are": "Voyez notre affluence",
    "This chart is live. It reads the Consular Section's real booking calendar and updates as citizens book, so you can pick a quieter day before you travel.": "Ce graphique est en direct. Il consulte le calendrier réel des rendez-vous de la Section consulaire et se met à jour à mesure que les citoyens réservent, pour que vous puissiez choisir un jour plus calme avant de vous déplacer.",
    "Green means quiet; red means full. Fewer people on a given day usually means a shorter wait.": "Le vert indique un jour calme ; le rouge, un jour complet. Moins de monde un jour donné signifie généralement une attente plus courte.",
    "Loading live wait times…": "Chargement des temps d’attente en direct…",
    "Live": "En direct",
    "Consular Section, next open days": "Section consulaire, prochains jours ouvrés",
    "Quietest day to visit:": "Jour le plus calme pour venir :",
    "Quiet": "Calme",
    "Steady": "Modéré",
    "Busy": "Chargé",
    "Full": "Complet",
    "Live wait times are unavailable right now.": "Les temps d’attente en direct sont momentanément indisponibles.",
    "Find a lawyer": "Trouver un avocat",
    "Vetted legal partners": "Partenaires juridiques vérifiés",
    "A growing directory of attorneys who work with the Embassy. Sample listings shown.": "Un répertoire en pleine croissance d’avocats qui collaborent avec l’Ambassade. Exemples de fiches présentés.",
    "Civil & family · Washington D.C.": "Civil et famille · Washington D.C.",
    "Recovery & travel · DRC": "Recouvrement et voyage · RDC",
    "Visas, green cards and naturalization for the diaspora. English & French.": "Visas, cartes vertes et naturalisation pour la diaspora. Anglais et français.",
    "Marriage, civil and estate matters, and document legalization support.": "Mariage, affaires civiles et successorales, et assistance à la légalisation de documents.",
    "On-the-ground help for travellers, including pursuing recovery after fraud or theft.": "Aide sur place pour les voyageurs, y compris le recouvrement après une fraude ou un vol.",
    "Request a consultation": "Demander une consultation",
    "Sample listings. Attorneys are independently licensed; the Embassy connects and manages the network.": "Exemples de fiches. Les avocats sont agréés de manière indépendante ; l’Ambassade met en relation et gère le réseau.",
    "For attorneys": "Pour les avocats",
    "Join the partner network": "Rejoignez le réseau de partenaires",
    "Are you a licensed attorney in the U.S. or the DRC? Partner with the Embassy to support the community, in immigration, civil and travel matters.": "Vous êtes un avocat agréé aux États-Unis ou en RDC ? Devenez partenaire de l’Ambassade pour soutenir la communauté, en matière d’immigration, d’affaires civiles et de voyage.",
    "Reach the diaspora through the Embassy directory.": "Touchez la diaspora grâce au répertoire de l’Ambassade.",
    "Receive referrals for consultations.": "Recevez des recommandations pour des consultations.",
    "Support citizens who need trusted guidance.": "Aidez les citoyens qui ont besoin de conseils fiables.",
    "Firm": "Cabinet",
    "Jurisdiction": "Juridiction",
    "Practice areas": "Domaines de pratique",
    "Bar number": "Numéro d’inscription au barreau",
    "Anything else": "Autre chose",
    "Apply to join": "Postuler pour rejoindre",
    "Your details are used only to review your application. See our": "Vos coordonnées ne servent qu’à examiner votre candidature. Consultez notre",
    "Celebrations, cultural evenings and community gatherings. Reserve your place online; secure online payment is coming soon.": "Célébrations, soirées culturelles et rassemblements communautaires. Réservez votre place en ligne ; le paiement en ligne sécurisé arrive bientôt.",
    "30 June": "30 juin",
    "19 July": "19 juillet",
    "9 August": "9 août",
    "Independence Day reception": "Réception de la fête de l’indépendance",
    "An evening marking the DRC's national day, with the diaspora community.": "Une soirée célébrant la fête nationale de la RDC, avec la communauté de la diaspora.",
    "Embassy residence, Washington D.C.": "Résidence de l’Ambassade, Washington D.C.",
    "Congolese cultural evening": "Soirée culturelle congolaise",
    "Music, cuisine and art celebrating Congolese heritage.": "Musique, cuisine et art à la gloire du patrimoine congolais.",
    "Community hall, Washington D.C.": "Salle communautaire, Washington D.C.",
    "Diaspora business forum": "Forum d’affaires de la diaspora",
    "Trade and investment between the DRC and the United States.": "Commerce et investissement entre la RDC et les États-Unis.",
    "Conference center, Washington D.C.": "Centre de conférences, Washington D.C.",
    "Reserve": "Réserver",
    "Reserve your place": "Réservez votre place",
    "Tell us which event you'd like to attend and how many guests. You'll receive a confirmation by email.": "Indiquez-nous l’événement auquel vous souhaitez assister et le nombre d’invités. Vous recevrez une confirmation par e-mail.",
    "Event": "Événement",
    "Independence Day reception, 30 June": "Réception de la fête de l’indépendance, 30 juin",
    "Congolese cultural evening, 19 July": "Soirée culturelle congolaise, 19 juillet",
    "Diaspora business forum, 9 August": "Forum d’affaires de la diaspora, 9 août",
    "Guests": "Invités",
    "Just me": "Moi uniquement",
    "4 people": "4 personnes",
    "Reserve my place": "Réserver ma place",
    "Free to reserve. Some events may require a ticket; secure online payment is coming soon.": "Réservation gratuite. Certains événements peuvent nécessiter un billet ; le paiement en ligne sécurisé arrive bientôt.",
    "My Embassy": "Mon Ambassade",
    "Password": "Mot de passe",
    "Confirm password": "Confirmez le mot de passe",
    "Mobile": "Portable",
    "Sign in": "Se connecter",
    "Sign out": "Se déconnecter",
    "Sign in to your account": "Connectez-vous à votre compte",
    "Create your account": "Créez votre compte",
    "Create account": "Créer le compte",
    "Create an account": "Créer un compte",
    "Terms": "Conditions",
    "Follow your appointments, applications and messages with the Embassy - all in one place.": "Suivez vos rendez-vous, demandes et messages avec l’Ambassade, le tout au même endroit.",
    "Access your appointments, applications and messages with the Embassy.": "Accédez à vos rendez-vous, demandes et messages avec l’Ambassade.",
    "By creating an account you agree to our": "En créant un compte, vous acceptez nos",
    ". We use your details only to service your requests.": "Nous utilisons vos coordonnées uniquement pour traiter vos demandes.",
    "Already have an account?": "Vous avez déjà un compte ?",
    "New here?": "Nouveau ici ?",
    "My requests": "Mes demandes",
    "More in My Embassy": "Plus dans Mon Ambassade",
    "Your account": "Votre compte",
    "Manage your payments, documents and secure messages with the Embassy.": "Gérez vos paiements, documents et messages sécurisés avec l’Ambassade.",
    "Payments": "Paiements",
    "Pay a consular fee online and keep your receipts, securely.": "Payez des frais consulaires en ligne et conservez vos reçus, en toute sécurité.",
    "Pay a fee": "Payer des frais",
    "Upload the papers your application requires, and see what you have submitted.": "Téléversez les documents requis pour votre demande et consultez ce que vous avez soumis.",
    "Upload documents": "Téléverser des documents",
    "Secure messages with the Embassy about your requests, with replies from consular officers.": "Messages sécurisés avec l’Ambassade au sujet de vos demandes, avec les réponses des agents consulaires.",
    "Open messages": "Ouvrir les messages",
    "Applications": "Demandes",
    "You have no appointments yet.": "Vous n’avez pas encore de rendez-vous.",
    "Request an appointment": "Demander un rendez-vous",
    "You have no applications on file yet. Track your passport, visa or legalization here once you apply.": "Vous n’avez encore aucune demande enregistrée. Suivez votre passeport, visa ou légalisation ici dès que vous aurez fait une demande.",
    "Inquiries you have sent": "Messages que vous avez envoyés",
    "You have not sent any inquiries yet.": "Vous n’avez encore envoyé aucun message.",
    "Appointments, applications and messages matched to": "Rendez-vous, demandes et messages associés à",
    ". If something is missing, it may have been submitted with a different email address.": "Si quelque chose manque, cela a peut-être été soumis avec une autre adresse e-mail.",
    "Unofficial demo - this is a design prototype and not an official system of the Embassy of the DRC. Your account here only demonstrates the self-service portal workflow.": "Démo non officielle : ceci est un prototype de conception et non un système officiel de l’Ambassade de la RDC. Votre compte ne fait qu’illustrer le fonctionnement du portail en libre-service.",
    "Unofficial demo - this is a design prototype and not an official system of the Embassy of the DRC. Accounts here only demonstrate the self-service portal workflow.": "Démo non officielle : ceci est un prototype de conception et non un système officiel de l’Ambassade de la RDC. Les comptes ne font qu’illustrer le fonctionnement du portail en libre-service.",
    "Pay a consular fee": "Payer des frais consulaires",
    "Settle a consular fee or event ticket online. Amounts follow the Embassy's published schedule of fees.": "Réglez des frais consulaires ou un billet d’événement en ligne. Les montants suivent le barème des frais publié par l’Ambassade.",
    "Consular fees": "Frais consulaires",
    "Start a payment": "Démarrer un paiement",
    "Choose a service": "Choisissez un service",
    "Consular service or ticket": "Service consulaire ou billet",
    "Select a service…": "Sélectionnez un service…",
    "Quantity": "Quantité",
    "(e.g. number of documents or tickets)": "(par ex. nombre de documents ou de billets)",
    "(for your receipt)": "(pour votre reçu)",
    "Related application reference": "Référence de la demande associée",
    "Continue to payment": "Continuer vers le paiement",
    "You'll see a demo checkout next. No real charge is made.": "Une page de paiement de démonstration s’affichera ensuite. Aucun montant réel n’est débité.",
    "Schedule of fees": "Barème des frais",
    "Fee (USD)": "Frais (USD)",
    "Fees follow the Embassy's published consular schedule. Unofficial demonstration prototype.": "Les frais suivent le barème consulaire publié par l’Ambassade. Prototype de démonstration non officiel.",
    "Demonstration only.": "Démonstration uniquement.",
    "Payment · Demo checkout": "Paiement · Paiement de démonstration",
    "Review & confirm": "Vérifier et confirmer",
    "Reference": "Référence",
    "Order summary": "Récapitulatif de la commande",
    "Amount": "Montant",
    "Related application": "Demande associée",
    "Status": "Statut",
    "This is an unofficial demonstration prototype. Confirming below simulates a successful payment so you can see the receipt flow; no money moves and no card details are collected.": "Ceci est un prototype de démonstration non officiel. Confirmer ci-dessous simule un paiement réussi afin de vous montrer le déroulé du reçu ; aucun argent n’est déplacé et aucune donnée de carte n’est collectée.",
    "By continuing you acknowledge this is a simulated demonstration payment.": "En continuant, vous reconnaissez qu’il s’agit d’un paiement de démonstration simulé.",
    "Cancel and choose another service": "Annuler et choisir un autre service",
    "Demo - no real charge.": "Démo - aucun paiement réel.",
    "This payment has already been completed.": "Ce paiement a déjà été effectué.",
    "View receipt": "Voir le reçu",
    "Payment receipt": "Reçu de paiement",
    "Payment received": "Paiement reçu",
    "Official demonstration receipt": "Reçu de démonstration officiel",
    "Receipt reference": "Référence du reçu",
    "Paid by": "Payé par",
    "Method": "Méthode",
    "Date paid": "Date de paiement",
    "Print receipt": "Imprimer le reçu",
    "Make another payment": "Effectuer un autre paiement",
    "This is an unofficial demonstration prototype. No real payment was taken and this receipt has no legal or financial value. Please keep your reference number for any follow-up.": "Ceci est un prototype de démonstration non officiel. Aucun paiement réel n’a été prélevé et ce reçu n’a aucune valeur juridique ou financière. Veuillez conserver votre numéro de référence pour tout suivi.",
    "Upload your documents": "Téléversez vos documents",
    "Attach supporting files to your consular reference instead of emailing them. Uploads are stored privately and are never posted to a public link.": "Joignez des pièces justificatives à votre référence consulaire au lieu de les envoyer par e-mail. Les téléversements sont stockés en privé et ne sont jamais publiés sur un lien public.",
    "Attach a document": "Joindre un document",
    "Reference number": "Numéro de référence",
    "Enter the reference number from your appointment or application confirmation, choose the document type, and upload the file. You can add more than one - upload them one at a time.": "Saisissez le numéro de référence figurant sur la confirmation de votre rendez-vous ou de votre demande, choisissez le type de document et téléversez le fichier. Vous pouvez en ajouter plusieurs, un à la fois.",
    "Document type": "Type de document",
    "Applicant last name": "Nom de famille du demandeur",
    "File": "Fichier",
    "(PDF, JPG or PNG · up to 8 MB)": "(PDF, JPG ou PNG · jusqu’à 8 Mo)",
    "Email for confirmation": "E-mail pour la confirmation",
    "Note": "Remarque",
    "Send us your file": "Envoyez-nous votre fichier",
    "Show my documents": "Afficher mes documents",
    "Uploaded something already? Enter your reference and last name to see your files.": "Vous avez déjà téléversé un document ? Saisissez votre référence et votre nom de famille pour voir vos fichiers.",
    "What to bring": "Ce qu’il faut apporter",
    "Passport application: form, current passport bio page, and photo": "Demande de passeport : formulaire, page biographique du passeport actuel et photo.",
    "Visa: invitation or purpose letter and supporting identity documents": "Visa : lettre d’invitation ou de motif et pièces d’identité justificatives.",
    "Civil records: birth, marriage or death certificate scans": "Actes d’état civil : scans des actes de naissance, de mariage ou de décès.",
    "Clear, full-page scans - all four corners visible": "Des scans nets, pleine page, les quatre coins visibles.",
    "Your consular reference number (from your confirmation email)": "Votre numéro de référence consulaire (indiqué dans votre e-mail de confirmation).",
    "Your file is stored on a private disk and only released to you (with your reference and last name) or the reviewing officer.": "Votre fichier est stocké sur un disque privé et n’est communiqué qu’à vous (avec votre référence et votre nom de famille) ou à l’agent chargé de l’examen.",
    "Documents on file": "Documents enregistrés",
    "Files uploaded for reference": "Fichiers téléversés pour la référence",
    "Your documents": "Vos documents",
    "Please fix the following:": "Veuillez corriger ce qui suit :",
    "Unofficial demonstration.": "Démonstration non officielle.",
    "Unofficial demo - this is a design prototype and not an official system of the Embassy of the DRC. Files are handled only to demonstrate the upload workflow.": "Démo non officielle : ceci est un prototype de conception et non un système officiel de l’Ambassade de la RDC. Les fichiers ne sont traités que pour illustrer le processus de téléversement.",
    "My documents": "Mes documents",
    "Look up an upload": "Rechercher un téléversement",
    "Enter your reference number and last name to see everything you have uploaded and download a copy.": "Saisissez votre numéro de référence et votre nom de famille pour voir tout ce que vous avez téléversé et en télécharger une copie.",
    "Find my documents": "Trouver mes documents",
    "Show documents": "Afficher les documents",
    "Upload another document": "Téléverser un autre document",
    "Secure messages": "Messages sécurisés",
    "Ask the Consular Section about your case and read their replies. Sign in, or use your case reference and last name.": "Posez vos questions à la Section consulaire au sujet de votre dossier et lisez leurs réponses. Connectez-vous, ou utilisez la référence de votre dossier et votre nom de famille.",
    "Case reference": "Référence du dossier",
    "Enter the reference from your confirmation email (for example APT-2026-1234) and your last name.": "Saisissez la référence figurant dans votre e-mail de confirmation (par exemple APT-2026-1234) et votre nom de famille.",
    "Find your case": "Trouver votre dossier",
    "Open your thread": "Ouvrir votre fil",
    "Open my thread": "Ouvrir mon fil",
    "Your thread": "Votre fil",
    "Your message": "Votre message",
    "Send message": "Envoyer le message",
    "No messages yet - send the first one below.": "Aucun message pour l’instant - envoyez le premier ci-dessous.",
    "Messages are routed to the Consular Section and answered during office hours.": "Les messages sont transmis à la Section consulaire et traités pendant les heures de bureau.",
    "Uploaded": "Téléversé",
    "Download": "Télécharger",
    "Download links only work with the matching reference and last name - keep them private.": "Les liens de téléchargement ne fonctionnent qu’avec la référence et le nom de famille correspondants - gardez-les confidentiels.",
    "No documents are on file for reference": "Aucun document n’est enregistré pour la référence",
    "See how busy the Consular Section is before you travel, and choose a quieter day to visit.": "Voyez l’affluence de la Section consulaire avant de vous déplacer et choisissez un jour plus calme pour votre visite.",
    "Smart booking & reminders": "Réservation intelligente et rappels",
    "Pick your preferred day, confirm in minutes, and get email and SMS reminders so you never miss your slot.": "Choisissez votre jour, confirmez en quelques minutes et recevez des rappels par e-mail et SMS pour ne jamais manquer votre rendez-vous.",
    "Legal help network": "Réseau d’aide juridique",
    "Connect with vetted, independently licensed attorneys in the United States and the DRC for immigration, civil and travel matters.": "Entrez en relation avec des avocats agréés et indépendants, aux États-Unis et en RDC, pour vos questions d’immigration, civiles et de voyage.",
    "Events & tickets": "Événements et billets",
    "Register and pay online for national celebrations, cultural evenings and community events organized by the Embassy.": "Inscrivez-vous et payez en ligne pour les célébrations nationales, les soirées culturelles et les événements communautaires organisés par l’Ambassade.",
    "Subscribe for embassy news, travel advisories and announcements, delivered to your inbox.": "Abonnez-vous pour recevoir les actualités de l’Ambassade, les conseils aux voyageurs et les annonces, directement dans votre boîte de réception.",
    "Legal help": "Aide juridique",
    "Vetted attorneys, in the U.S. and the DRC": "Des avocats agréés, aux États-Unis et en RDC",
    "A network of independently licensed attorneys who work alongside the Embassy, so citizens always have somewhere to turn for trusted guidance.": "Un réseau d’avocats indépendants et agréés qui collaborent avec l’Ambassade, afin que les citoyens aient toujours vers qui se tourner pour des conseils fiables.",
    "For citizens in the United States: immigration, marriage and civil matters, and political or asylum questions.": "Pour les citoyens aux États-Unis : immigration, mariage et affaires civiles, questions politiques ou d’asile.",
    "For travellers to the DRC: help pursuing recovery if you are defrauded or robbed.": "Pour les voyageurs vers la RDC : aide au recouvrement en cas de fraude ou de vol.",
    "Book a consultation online, in English or French.": "Prenez rendez-vous pour une consultation en ligne, en anglais ou en français.",
    "Are you a licensed attorney? Register to join the Embassy's partner network.": "Vous êtes avocat agréé ? Inscrivez-vous pour rejoindre le réseau de partenaires de l’Ambassade.",
    "Ask about legal help": "Renseignez-vous sur l’aide juridique",
    "Always open": "Toujours ouvert",
    "An assistant that never sleeps": "Un assistant qui ne dort jamais",
    "Phone lines get busy and offices close. A 24/7 AI assistant answers common questions, checks requirements, and books appointments by name, then hands the request to a consular officer.": "Les lignes téléphoniques sont occupées et les bureaux ferment. Un assistant IA disponible 24h/24 répond aux questions courantes, vérifie les conditions et prend les rendez-vous au nom du demandeur, puis transmet la demande à un agent consulaire.",
    "Answers, any time": "Des réponses, à tout moment",
    "Requirements, fees, hours and status, day or night.": "Conditions, frais, horaires et statut, jour et nuit.",
    "Books for you": "Réserve pour vous",
    "Appointments created by name, straight into the office queue.": "Des rendez-vous créés au nom du demandeur, directement dans la file du bureau.",
    "Secure payments": "Paiements sécurisés",
    "Pay consular fees and event tickets online, safely.": "Payez les frais consulaires et les billets d’événements en ligne, en toute sécurité.",
    "English & French": "Anglais et français",
    "Every service, in both official languages.": "Chaque service, dans les deux langues officielles.",
    "The modern Embassy": "L’Ambassade moderne",
    "Built for the community, growing with it": "Conçue pour la communauté, elle grandit avec elle",
    "These services are part of the Embassy's digital modernization. Tell us what would help you most, and register to hear when each one goes live.": "Ces services font partie de la modernisation numérique de l’Ambassade. Dites-nous ce qui vous serait le plus utile et inscrivez-vous pour être informé de leur mise en service.",
    "Share your feedback": "Partagez votre avis",
    "Register for updates": "S’inscrire aux mises à jour",
    "Unofficial demo, this is a design prototype. Some services shown are in development and illustrate the Embassy's digital roadmap.": "Démo non officielle : il s’agit d’un prototype de conception. Certains services présentés sont en cours de développement et illustrent la feuille de route numérique de l’Ambassade.",
    "Geography": "Géographie",
    "The Congo on the map": "Le Congo sur la carte",
    "At the heart of Africa, the Democratic Republic of the Congo straddles the Equator and shares land borders with nine countries. Its major cities reach across the nation, from Kinshasa on the Congo River in the west to Lubumbashi in the mineral-rich south-east.": "Au cœur de l’Afrique, la République démocratique du Congo est traversée par l’équateur et partage ses frontières terrestres avec neuf pays. Ses grandes villes s’étendent à travers le pays, de Kinshasa, sur le fleuve Congo à l’ouest, à Lubumbashi, dans le sud-est riche en minerais.",
    "Capital": "Capitale",
    "Neighbouring countries": "Pays voisins",
    "Straddles the Equator": "À cheval sur l’équateur",
    "Your voice": "Votre voix",
    "Suggestion box": "Boîte à suggestions",
    "Have an idea to improve our services, or something to report about this website? Share it with us - every suggestion reaches the Embassy team for review.": "Vous avez une idée pour améliorer nos services ou quelque chose à signaler à propos de ce site ? Partagez-la avec nous - chaque suggestion est transmise à l’équipe de l’Ambassade pour examen.",
    "Goes straight to the Embassy team": "Transmis directement à l’équipe de l’Ambassade",
    "You receive a reference number by email": "Vous recevez un numéro de référence par e-mail",
    "No account needed": "Aucun compte requis",
    "Your name": "Votre nom",
    "Your suggestion": "Votre suggestion",
    "Send suggestion": "Envoyer la suggestion",
    "This request is for, or includes, a minor under 18. Minors require an original birth certificate, a legalized parental authorization and a parent’s passport.": "Cette demande concerne, ou inclut, un mineur de moins de 18 ans. Les mineurs doivent fournir un acte de naissance original, une autorisation parentale légalisée et le passeport d’un parent.",
    "Major opportunities in roads, rail, ports and urban development across a continental-scale nation.": "D’importantes opportunités dans les routes, le rail, les ports et le développement urbain, à l’échelle d’une nation continentale.",
    "Mining": "Secteur minier",
    "Most foreign nationals require a visa to enter the Democratic Republic of the Congo. Visas can be requested through the Embassy's Consular Affairs division, please apply well in advance of your travel dates.": "La plupart des ressortissants étrangers ont besoin d’un visa pour entrer en République démocratique du Congo. Les visas peuvent être demandés auprès de la division des Affaires consulaires de l’Ambassade ; veuillez en faire la demande bien avant vos dates de voyage.",
    "Music": "Musique",
    "National day, marking independence in 1960.": "Fête nationale, marquant l’indépendance en 1960.",
    "National flag": "Drapeau national",
    "National identity": "Identité nationale",
    "National institutions supporting tourism, trade and investment in the Democratic Republic of the Congo.": "Institutions nationales soutenant le tourisme, le commerce et l’investissement en République démocratique du Congo.",
    "National motto": "Devise nationale",
    "National parks & Virunga": "Parcs nationaux et Virunga",
    "National pride": "Fierté nationale",
    "National Tourism Board": "Office national du tourisme",
    "Natural heritage": "Patrimoine naturel",
    "Official language": "Langue officielle",
    "Official priority sectors for investment": "Secteurs prioritaires officiels pour l’investissement",
    "One of Africa's largest cities, on the Congo River.": "L’une des plus grandes villes d’Afrique, sur le fleuve Congo.",
    "Opportunity": "Opportunité",
    "Over 80 million hectares of arable land and a climate suited to year-round, large-scale production.": "Plus de 80 millions d’hectares de terres arables et un climat propice à une production à grande échelle tout au long de l’année.",
    "Over 80 million hectares of fertile, arable land": "Plus de 80 millions d’hectares de terres fertiles et arables",
    "Partner with the Congo": "Devenez partenaire du Congo",
    "Partners": "Partenaires",
    "Partnership": "Partenariat",
    "People & culture": "Peuple et culture",
    "people across the nation": "habitants à travers la nation",
    "Planning your visit": "Préparer votre visite",
    "Population": "Population",
    "Practical answers for travellers preparing a journey to the Democratic Republic of the Congo.": "Réponses pratiques pour les voyageurs préparant un séjour en République démocratique du Congo.",
    "Priority sectors open to partnership and foreign investment": "Secteurs prioritaires ouverts au partenariat et à l’investissement étranger",
    "Proof of yellow fever vaccination is required for entry. Travellers are also advised to consult a travel-health clinic regarding malaria prophylaxis and routine immunisations before departure.": "Une preuve de vaccination contre la fièvre jaune est requise à l’entrée. Il est également conseillé aux voyageurs de consulter un centre de médecine du voyage au sujet de la prophylaxie antipaludique et des vaccinations de routine avant leur départ.",
    "Red": "Rouge",
    "Scenes of the Congo": "Scènes du Congo",
    "Spanning more than 2.3 million square kilometres at the centre of the African continent, the Democratic Republic of the Congo is the second-largest country in Africa. From the dense equatorial rainforest of the Congo Basin, the second-largest on Earth, to highland volcanoes and the mighty Congo River, the DRC's geography is as vast as it is varied.": "S’étendant sur plus de 2,3 millions de kilomètres carrés au centre du continent africain, la République démocratique du Congo est le deuxième plus grand pays d’Afrique. De la dense forêt tropicale équatoriale du bassin du Congo, la deuxième plus vaste de la planète, aux volcans des hauts plateaux et au puissant fleuve Congo, la géographie de la RDC est aussi vaste que variée.",
    "Strategic position at the centre of the African continent": "Position stratégique au centre du continent africain",
    "Telecom": "Télécommunications",
    "The birthplace of rumba and soukous, celebrated worldwide.": "Le berceau de la rumba et du soukous, célébrés dans le monde entier.",
    "The Congo River": "Le fleuve Congo",
    "The Congo's cultural influence reaches far beyond its borders, its rhythms, art and cuisine are celebrated across the African continent and around the world.": "L’influence culturelle du Congo s’étend bien au-delà de ses frontières ; ses rythmes, son art et sa cuisine sont célébrés sur tout le continent africain et dans le monde entier.",
    "The Congolese nation": "La nation congolaise",
    "The deepest river on Earth and a lifeline of the nation, roughly 4,700 km long.": "Le fleuve le plus profond de la planète et une artère vitale de la nation, long d’environ 4 700 km.",
    "The Democratic Republic of the Congo": "La République démocratique du Congo",
    "The DRC at a glance": "La RDC en bref",
    "The DRC by the numbers": "La RDC en chiffres",
    "The dry seasons, roughly June to September and December to February, generally offer the most comfortable conditions for travel and wildlife viewing, though the equatorial climate is warm throughout the year.": "Les saisons sèches, approximativement de juin à septembre et de décembre à février, offrent généralement les conditions les plus agréables pour voyager et observer la faune, bien que le climat équatorial reste chaud toute l’année.",
    "The flag of the Congo": "Le drapeau du Congo",
    "The heart of Africa": "Le cœur de l’Afrique",
    "The heart of Africa, a vast nation of extraordinary natural wealth, vibrant culture and boundless opportunity, at the centre of the continent's future.": "Le cœur de l’Afrique, une vaste nation d’une richesse naturelle extraordinaire, d’une culture dynamique et d’opportunités infinies, au centre de l’avenir du continent.",
    "The Inga site offers some of the greatest hydroelectric potential on the planet.": "Le site d’Inga offre l’un des plus grands potentiels hydroélectriques de la planète.",
    "The national currency of the DRC.": "La monnaie nationale de la RDC.",
    "The national flag is a sky-blue field crossed by a red diagonal stripe bordered in yellow, with a yellow star in the upper canton.": "Le drapeau national est un champ bleu ciel traversé par une bande diagonale rouge bordée de jaune, avec une étoile jaune dans le canton supérieur.",
    "The official currency is the Congolese Franc (CDF). U.S. dollars are widely accepted in major cities. Card acceptance is growing but limited outside large hotels and businesses, so carry cash for everyday expenses.": "La monnaie officielle est le franc congolais (CDF). Le dollar américain est largement accepté dans les grandes villes. Le paiement par carte se développe mais reste limité en dehors des grands hôtels et commerces ; prévoyez donc des espèces pour vos dépenses quotidiennes.",
    "The only home of the bonobo and the okapi, found nowhere else on Earth.": "L’unique habitat du bonobo et de l’okapi, que l’on ne trouve nulle part ailleurs sur Terre.",
    "The second-largest country in Africa.": "Le deuxième plus grand pays d’Afrique.",
    "The second-largest tropical rainforest in the world, a vital carbon sink.": "La deuxième plus grande forêt tropicale du monde, un puits de carbone essentiel.",
    "The star": "L’étoile",
    "The symbols, languages and milestones that define the Democratic Republic of the Congo.": "Les symboles, les langues et les grandes dates qui définissent la République démocratique du Congo.",
    "The world's deepest river and a lifeline of the nation.": "Le fleuve le plus profond du monde et une artère vitale de la nation.",
    "time-zones of opportunity": "fuseaux horaires d’opportunités",
    "Total area": "Superficie totale",
    "Trade & enterprise": "Commerce et entreprise",
    "Transportation": "Transport",
    "Travel & investment partners": "Partenaires de voyage et d’investissement",
    "Travel & visas FAQ": "FAQ voyage et visas",
    "Unique wildlife": "Faune unique",
    "Unofficial demo, this is a design prototype and not an official government website. Figures and content shown are illustrative.": "Démonstration non officielle : il s’agit d’un prototype de conception et non d’un site gouvernemental officiel. Les chiffres et le contenu présentés sont donnés à titre indicatif.",
    "Unspoiled national parks, mountain gorillas and the Congo River draw a new generation of travellers.": "Des parcs nationaux préservés, les gorilles de montagne et le fleuve Congo attirent une nouvelle génération de voyageurs.",
    "Virunga National Park": "Parc national des Virunga",
    "What currency is used and can I pay by card?": "Quelle est la monnaie utilisée et puis-je payer par carte ?",
    "What vaccinations are required?": "Quelles vaccinations sont requises ?",
    "When is the best time to visit?": "Quelle est la meilleure période pour visiter ?",
    "Whether you are exploring investment, travel or cultural exchange, the Embassy is here to help you connect with the Democratic Republic of the Congo.": "Que vous exploriez l’investissement, le voyage ou les échanges culturels, l’Ambassade est là pour vous aider à entrer en relation avec la République démocratique du Congo.",
    "Why invest in the DRC": "Pourquoi investir en RDC",
    "Why investors choose the Congo": "Pourquoi les investisseurs choisissent le Congo",
    "Wildlife & gorillas": "Faune et gorilles",
    "With abundant natural resources, a strategic location and vast untapped potential, the Democratic Republic of the Congo offers exceptional opportunities across priority industries.": "Avec des ressources naturelles abondantes, une situation stratégique et un vaste potentiel inexploité, la République démocratique du Congo offre des opportunités exceptionnelles dans les secteurs prioritaires.",
    "World-leading reserves of cobalt, copper and critical minerals": "Des réserves de cobalt, de cuivre et de minéraux critiques parmi les premières au monde",
    "Year of independence": "Année de l’indépendance",
    "Yellow": "Jaune",
    "- a radiant future and national unity.": "- un avenir radieux et l’unité nationale.",
    "- peace and hope for the nation.": "- la paix et l’espoir pour la nation.",
    "- the blood of the nation's martyrs.": "- le sang des martyrs de la nation.",
    "- the country's wealth and natural resources.": "- la richesse et les ressources naturelles du pays.",
    "2026 Embassy holiday closure calendar": "Calendrier des fermetures de l’Ambassade pour les jours fériés 2026",
    "A formal flag-raising and address by the Ambassador marking the independence of the Democratic Republic of the Congo, followed by a community reception.": "Une levée de drapeau officielle et une allocution de l’Ambassadeur marquant l’indépendance de la République démocratique du Congo, suivies d’une réception communautaire.",
    "A forum connecting U.S. businesses with opportunities in the DRC across mining, energy, agriculture and infrastructure.": "Un forum mettant en relation les entreprises américaines avec les opportunités en RDC dans les secteurs des mines, de l’énergie, de l’agriculture et des infrastructures.",
    "A mobile consular team will offer passport and document services to Congolese citizens in the southeastern United States.": "Une équipe consulaire mobile offrira des services de passeport et de documents aux citoyens congolais dans le sud-est des États-Unis.",
    "All": "Tous",
    "An evening of Congolese music, art and cuisine celebrating the culture of the DRC with the diaspora and friends of the Embassy.": "Une soirée de musique, d’art et de cuisine congolais célébrant la culture de la RDC avec la diaspora et les amis de l’Ambassade.",
    "Announcement of the DRC–U.S. Investment Forum": "Annonce du Forum d’investissement RDC–États-Unis",
    "Announcements": "Annonces",
    "Applications are now open for a new scholarship program supporting Congolese students pursuing higher education in the United States.": "Les candidatures sont désormais ouvertes pour un nouveau programme de bourses soutenant les étudiants congolais poursuivant des études supérieures aux États-Unis.",
    "Apr 12, 2026": "12 avril 2026",
    "Apr 20, 2026": "20 avril 2026",
    "Apr 28, 2026": "28 avril 2026",
    "Atlanta, GA": "Atlanta, GA",
    "Aug": "août",
    "Bilateral": "Bilatéral",
    "Bilateral talks": "Entretiens bilatéraux",
    "Congolese Cultural Week celebrates heritage": "La Semaine culturelle congolaise célèbre le patrimoine",
    "Congolese Heritage Evening": "Soirée du patrimoine congolais",
    "Diaspora community": "Communauté de la diaspora",
    "Download the Embassy's most recent press releases and official communiqués.": "Téléchargez les communiqués de presse les plus récents et les communiqués officiels de l’Ambassade.",
    "DRC–U.S. Investment Forum draws strong interest": "Le Forum d’investissement RDC–États-Unis suscite un vif intérêt",
    "DRC–U.S. Trade Roundtable": "Table ronde commerciale RDC–États-Unis",
    "Embassy ceremony": "Cérémonie de l’Ambassade",
    "Embassy economic officers convene U.S. firms and Congolese partners to discuss investment in mining, energy, agriculture and infrastructure.": "Les responsables économiques de l’Ambassade réunissent des entreprises américaines et des partenaires congolais pour discuter des investissements dans les mines, l’énergie, l’agriculture et les infrastructures.",
    "Embassy holiday closures for 2026": "Fermetures de l’Ambassade pour les jours fériés 2026",
    "Embassy in the community": "L’Ambassade au sein de la communauté",
    "Events": "Événements",
    "Events calendar": "Calendrier des événements",
    "Featured · Bilateral": "À la une · Bilatéral",
    "From the Embassy": "De l’Ambassade",
    "Houston, TX": "Houston, TX",
    "In pictures": "En images",
    "Independence Day Reception": "Réception de la fête de l’indépendance",
    "Investment & Trade Forum": "Forum de l’investissement et du commerce",
    "Investment forum": "Forum d’investissement",
    "Investors and officials gathered to explore opportunities in mining, energy and agriculture across the Democratic Republic of the Congo.": "Investisseurs et responsables se sont réunis pour explorer les opportunités dans les mines, l’énergie et l’agriculture à travers la République démocratique du Congo.",
    "Join the Embassy in celebrating the national day of the Democratic Republic of the Congo with the diaspora community and diplomatic partners.": "Joignez-vous à l’Ambassade pour célébrer la fête nationale de la République démocratique du Congo avec la communauté de la diaspora et les partenaires diplomatiques.",
    "Joint communiqué on DRC–U.S. bilateral cooperation": "Communiqué conjoint sur la coopération bilatérale RDC–États-Unis",
    "Jul": "juillet",
    "Jun": "juin",
    "Mar 05, 2026": "5 mars 2026",
    "Mar 18, 2026": "18 mars 2026",
    "Mar 30, 2026": "30 mars 2026",
    "Mark your calendar": "Notez-le dans votre agenda",
    "May 15, 2026": "15 mai 2026",
    "Mobile consulate visits announced": "Visites du consulat mobile annoncées",
    "Mobile Consulate, Atlanta": "Consulat mobile, Atlanta",
    "Mobile Consulate, Houston": "Consulat mobile, Houston",
    "Moments from receptions, forums and cultural events hosted by the Embassy of the DRC.": "Moments de réceptions, de forums et d’événements culturels organisés par l’Ambassade de la RDC.",
    "Music, art and cuisine took center stage as the diaspora community came together to celebrate the rich culture of the DRC.": "La musique, l’art et la cuisine ont occupé le devant de la scène tandis que la communauté de la diaspora s’est réunie pour célébrer la riche culture de la RDC.",
    "National Day Flag Ceremony": "Cérémonie du drapeau de la fête nationale",
    "New measures shorten passport processing for citizens applying through the Embassy. Read what has changed and how to prepare your file.": "De nouvelles mesures réduisent les délais de traitement des passeports pour les citoyens qui déposent leur demande auprès de l’Ambassade. Découvrez ce qui a changé et comment préparer votre dossier.",
    "New York, NY": "New York, NY",
    "Official announcements, consular updates, bilateral news and cultural events from the Embassy of the Democratic Republic of the Congo in Washington, D.C.": "Annonces officielles, informations consulaires, actualités bilatérales et événements culturels de l’Ambassade de la République démocratique du Congo à Washington, D.C.",
    "Official statements & documents": "Déclarations et documents officiels",
    "Passport renewals, consular cards and document legalization for Congolese citizens across Texas and the Gulf region. Appointment recommended.": "Renouvellements de passeports, cartes consulaires et légalisation de documents pour les citoyens congolais du Texas et de la région du Golfe. Rendez-vous recommandé.",
    "Press releases": "Communiqués de presse",
    "Read article →": "Lire l’article →",
    "Receive official announcements, consular notices and event invitations directly in your inbox.": "Recevez les annonces officielles, les avis consulaires et les invitations aux événements directement dans votre boîte de réception.",
    "Recent announcements": "Annonces récentes",
    "Receptions, consular outreach and bilateral forums hosted by the Embassy of the DRC across the United States.": "Réceptions, actions consulaires de proximité et forums bilatéraux organisés par l’Ambassade de la RDC à travers les États-Unis.",
    "RSVP →": "Confirmer votre présence →",
    "Scholarship program opens for Congolese students": "Ouverture d’un programme de bourses pour les étudiants congolais",
    "Senior officials from the Democratic Republic of the Congo and the United States met in Washington to deepen cooperation across trade, security and sustainable development, reaffirming a partnership rooted in more than sixty years of diplomatic ties.": "De hauts responsables de la République démocratique du Congo et des États-Unis se sont réunis à Washington pour approfondir la coopération en matière de commerce, de sécurité et de développement durable, réaffirmant un partenariat ancré dans plus de soixante ans de relations diplomatiques.",
    "Statement on updated passport processing times": "Déclaration sur la mise à jour des délais de traitement des passeports",
    "Subscribe to Embassy updates": "Abonnez-vous aux actualités de l’Ambassade",
    "The Embassy will bring consular services closer to communities with mobile consulate dates in several U.S. cities this spring.": "L’Ambassade rapprochera les services consulaires des communautés grâce à des dates de consulat mobile dans plusieurs villes américaines ce printemps.",
    "The Embassy will observe a number of national and U.S. public holidays this year. Plan your consular visits around the closure calendar.": "L’Ambassade observera cette année plusieurs jours fériés nationaux et américains. Planifiez vos visites consulaires en fonction du calendrier des fermetures.",
    "Trade roundtable": "Table ronde commerciale",
    "Upcoming at the Embassy": "Prochainement à l’Ambassade",
    "Upcoming events": "Événements à venir",
    "Washington, D.C.": "Washington, D.C.",
    "(optional)": "(facultatif)",
    "1 person": "1 personne",
    "2 people": "2 personnes",
    "3 people": "3 personnes",
    "4 people": "4 personnes",
    "5 or more": "5 ou plus",
    "Alternative date": "Date alternative",
    "Applicant": "Demandeur",
    "Civil registration (birth, marriage, death)": "État civil (naissance, mariage, décès)",
    "Consular service": "Service consulaire",
    "DR Congolese citizen": "Citoyen de la RDC",
    "Drop-off: Mon–Fri 10:00–13:00.": "Dépôt : lun.–ven. 10h00–13h00.",
    "Existing reference": "Référence existante",
    "Follow the status of your passport, visa or legalization.": "Suivez l’état de votre passeport, visa ou légalisation.",
    "Foreign national": "Ressortissant étranger",
    "I will bring the required original documents and a printed confirmation, and I consent to the Embassy using these details to process my request. See our": "J’apporterai les documents originaux requis ainsi qu’une confirmation imprimée, et je consens à ce que l’Ambassade utilise ces informations pour traiter ma demande. Consultez notre",
    "In your own words, why are you coming, and anything that helps us prepare": "Avec vos propres mots, expliquez le motif de votre venue et tout élément susceptible de nous aider à préparer votre visite",
    "Jump straight to the most common citizen services.": "Accédez directement aux services citoyens les plus courants.",
    "Late morning (11:30 to 13:00)": "Fin de matinée (11h30 à 13h00)",
    "Mobile (for SMS)": "Portable (pour SMS)",
    "Morning (10:00 to 11:30)": "Matin (10h00 à 11h30)",
    "Need help?": "Besoin d’aide ?",
    "No account needed. You'll receive a confirmation with a reference number by email and SMS.": "Aucun compte n’est nécessaire. Vous recevrez une confirmation avec un numéro de référence par e-mail et SMS.",
    "Notarial act or power of attorney": "Acte notarié ou procuration",
    "Number of applicants": "Nombre de demandeurs",
    "Office & consular hours": "Heures d’ouverture et horaires consulaires",
    "Office: Mon–Thu 9:00–16:00, Fri 9:00–13:00.": "Bureau : lun.–jeu. 9h00–16h00, ven. 9h00–13h00.",
    "Original documents and clear photocopies": "Documents originaux et photocopies lisibles",
    "Other consular matter": "Autre affaire consulaire",
    "Passport, new application": "Passeport, nouvelle demande",
    "Payment by money order or certified check": "Paiement par mandat ou chèque certifié",
    "Pick-up: Mon–Thu 14:00–16:00, Fri 10:00–13:00.": "Retrait : lun.–jeu. 14h00–16h00, ven. 10h00–13h00.",
    "Preferred date": "Date souhaitée",
    "Preferred time": "Heure souhaitée",
    "Quick actions": "Actions rapides",
    "Reason": "Motif",
    "Reason for your visit": "Motif de votre visite",
    "Request a consular appointment online. No account is needed, you'll receive a confirmation with a reference number by email and SMS.": "Demandez un rendez-vous consulaire en ligne. Aucun compte n’est nécessaire, vous recevrez une confirmation avec un numéro de référence par e-mail et SMS.",
    "Schedule a consular visit at a time that suits you.": "Planifiez une visite consulaire à l’heure qui vous convient.",
    "Specific request": "Demande spécifique",
    "Submit the required papers for your application.": "Soumettez les documents requis pour votre demande.",
    "Tell us what you need and a convenient time. No account is required, and you'll receive a confirmation with a reference number.": "Indiquez-nous ce dont vous avez besoin ainsi qu’un horaire qui vous convient. Aucun compte n’est nécessaire, et vous recevrez une confirmation avec un numéro de référence.",
    "Tenant-Lieu (travel document)": "Tenant-Lieu (document de voyage)",
    "Time": "Heure",
    "Track Application": "Suivre la demande",
    "Track status →": "Suivre l’état →",
    "Unofficial demo, this is a design prototype and not an official system of the Embassy of the DRC. Submissions are handled only to demonstrate the booking workflow, and you will receive a confirmation with your reference number by email.": "Démo non officielle : il s’agit d’un prototype de conception et non d’un système officiel de l’Ambassade de la RDC. Les demandes sont traitées uniquement pour illustrer le processus de réservation, et vous recevrez une confirmation avec votre numéro de référence par e-mail.",
    "Upload Documents": "Téléverser des documents",
    "Upload →": "Téléverser →",
    "Valid ID and proof of nationality": "Pièce d’identité valide et preuve de nationalité",
    "Visa for travel to the DRC": "Visa pour voyager en RDC",
    "What would you like to do?": "Que souhaitez-vous faire ?",
    "Your printed appointment confirmation": "Votre confirmation de rendez-vous imprimée",
    "A celebration of culture": "Une célébration de la culture",
    "A new partnership": "Un nouveau partenariat",
    "A vivid year in pictures": "Une année éclatante en images",
    "A warm welcome home": "Un chaleureux retour au pays",
    "Ambience & gallery": "Ambiance et galerie",
    "An evening reception": "Une réception en soirée",
    "Be part of it": "Prenez-y part",
    "Community": "Communauté",
    "Follow the Embassy for invitations to national celebrations, cultural evenings and diaspora gatherings, or get in touch to learn more.": "Suivez l’Ambassade pour recevoir des invitations aux célébrations nationales, aux soirées culturelles et aux rassemblements de la diaspora, ou prenez contact pour en savoir plus.",
    "H.E. the Ambassador": "S.E. l’Ambassadeur",
    "Independence Day gala": "Gala de la fête de l’indépendance",
    "Join us at the next event": "Rejoignez-nous lors du prochain événement",
    "Life at the Embassy of the DR Congo": "La vie à l’Ambassade de la RD Congo",
    "Moments": "Instants",
    "Outreach seminar": "Séminaire de proximité",
    "Receptions and national celebrations, diplomatic encounters, diaspora gatherings and the everyday work of serving our community in Washington, D.C.": "Réceptions et célébrations nationales, rencontres diplomatiques, rassemblements de la diaspora et travail quotidien au service de notre communauté à Washington, D.C.",
    "See upcoming events →": "Voir les événements à venir →",
    "Select a photograph to view it full size.": "Sélectionnez une photographie pour l’afficher en taille réelle.",
    "The Ambassador's address": "L’allocution de l’Ambassadeur",
    ", full name, date and place of birth, nationality, gender, photograph, passport or national-identity numbers, and family particulars where required for a consular matter.": ", nom complet, date et lieu de naissance, nationalité, sexe, photographie, numéros de passeport ou de carte nationale d’identité, ainsi que les renseignements familiaux lorsque cela est requis pour une affaire consulaire.",
    ", information and supporting documents you provide for passport, visa, civil-registry, legalization or other consular requests.": ", les informations et pièces justificatives que vous fournissez pour les demandes de passeport, de visa, d’état civil, de légalisation ou d’autres demandes consulaires.",
    ", internet protocol (IP) address, browser type and version, device information, pages visited, and the date and duration of your visit, collected automatically through cookies and similar technologies.": ", l’adresse de protocole Internet (IP), le type et la version du navigateur, les informations relatives à l’appareil, les pages consultées, ainsi que la date et la durée de votre visite, recueillis automatiquement au moyen de cookies et de technologies similaires.",
    ", postal address, email address and telephone number.": ", l’adresse postale, l’adresse électronique et le numéro de téléphone.",
    ". We may need to verify your identity before responding.": ". Nous pouvons être amenés à vérifier votre identité avant de répondre.",
    "1. Our commitment": "1. Notre engagement",
    "1. Our commitment to privacy": "1. Notre engagement en matière de confidentialité",
    "10. Security measures": "10. Mesures de sécurité",
    "11. Your rights": "11. Vos droits",
    "12. Children's privacy": "12. Confidentialité des mineurs",
    "13. Cookies": "13. Cookies",
    "14. Third-party services": "14. Services de tiers",
    "15. Changes to this policy": "15. Modifications de la présente politique",
    "16. Contact & data protection inquiries": "16. Contact et demandes relatives à la protection des données",
    "16. Contact us": "16. Nous contacter",
    "2. Who we are": "2. Qui nous sommes",
    "2. Who we are, the data controller": "2. Qui nous sommes, le responsable du traitement",
    "3. Data we collect": "3. Les données que nous recueillons",
    "3. What personal data we collect": "3. Quelles données personnelles nous recueillons",
    "4. How & why we collect it": "4. Comment et pourquoi nous les recueillons",
    "4. How & why we collect it, lawful bases": "4. Comment et pourquoi nous les recueillons, bases légales",
    "5. Consular application data": "5. Données des demandes consulaires",
    "5. Consular application data handling": "5. Traitement des données des demandes consulaires",
    "6. How we use your data": "6. Comment nous utilisons vos données",
    "7. Data sharing & disclosures": "7. Partage et communication des données",
    "7. Sharing & disclosures": "7. Partage et communication",
    "8. International data transfers": "8. Transferts internationaux de données",
    "8. International transfers": "8. Transferts internationaux",
    "9. Data retention": "9. Conservation des données",
    "access": "d’accès",
    "Accessibility Statement": "Déclaration d’accessibilité",
    "Application data": "Données de demande",
    "at any time where processing is based on consent.": "à tout moment lorsque le traitement est fondé sur le consentement.",
    "Because the Embassy operates between the United States and the Democratic Republic of the Congo, personal data you provide may be transferred to, and processed in, the DRC and other jurisdictions. Where such transfers occur, we take reasonable steps to ensure that your data continues to be treated with an appropriate level of protection.": "L’Ambassade opérant entre les États-Unis et la République démocratique du Congo, les données personnelles que vous fournissez peuvent être transférées vers la RDC et d’autres juridictions, et y être traitées. Lorsque de tels transferts ont lieu, nous prenons des mesures raisonnables pour garantir que vos données continuent de bénéficier d’un niveau de protection approprié.",
    "compliance with legal obligations to which the Embassy or the DRC is subject;": "le respect des obligations légales auxquelles l’Ambassade ou la RDC est soumise ;",
    "Contact data": "Données de contact",
    "Depending on how you interact with us, we may collect the following categories of personal data:": "Selon la manière dont vous interagissez avec nous, nous pouvons recueillir les catégories suivantes de données personnelles :",
    "Email:": "Courriel :",
    "For any question about this Privacy Policy or about how your personal data is handled, please contact:": "Pour toute question relative à la présente Politique de confidentialité ou à la manière dont vos données personnelles sont traitées, veuillez contacter :",
    "How the Embassy of the Democratic Republic of the Congo in Washington, D.C. collects, uses, protects and respects your personal data.": "Comment l’Ambassade de la République démocratique du Congo à Washington, D.C. recueille, utilise, protège et respecte vos données personnelles.",
    "Identity data": "Données d’identité",
    "Last updated": "Dernière mise à jour",
    "Legal & policies": "Mentions légales et politiques",
    "Legal Disclaimer & Notices": "Avertissement juridique et mentions",
    "object to": "de vous opposer à",
    "of certain processing;": "certains traitements ;",
    "of data you have provided; and": "des données que vous avez fournies ; et",
    "of inaccurate or incomplete data;": "des données inexactes ou incomplètes ;",
    "of your data where there is no overriding legal or official basis to retain it;": "de vos données lorsqu’il n’existe aucune base légale ou officielle prépondérante justifiant leur conservation ;",
    "On this page": "Sur cette page",
    "or request": "ou de demander",
    "our legitimate interest in operating, securing and improving the Site.": "notre intérêt légitime à exploiter, sécuriser et améliorer le Site.",
    "Personal data submitted in support of a consular application is used solely to assess, process and administer that application and to fulfil the Embassy's official duties. Such data may be transmitted to the competent authorities of the Democratic Republic of the Congo where this is necessary for the processing of your request. Supporting documents are handled with appropriate confidentiality and access is restricted to authorised consular personnel.": "Les données personnelles soumises à l’appui d’une demande consulaire sont utilisées uniquement pour évaluer, traiter et administrer cette demande et pour accomplir les missions officielles de l’Ambassade. Ces données peuvent être transmises aux autorités compétentes de la République démocratique du Congo lorsque cela est nécessaire au traitement de votre demande. Les pièces justificatives sont traitées avec la confidentialité appropriée et leur accès est réservé au personnel consulaire autorisé.",
    "portability": "de portabilité",
    "Questions about this document? Contact": "Des questions sur ce document ? Contactez",
    "rectification": "de rectification",
    "Related legal documents": "Documents juridiques connexes",
    "request": "de demander",
    "Respect for your privacy is integral to the conduct of the Embassy's consular and diplomatic functions. This Privacy Policy describes how we handle personal data collected through this website and through the services we provide, and it applies to all visitors, applicants and correspondents who interact with us.": "Le respect de votre vie privée fait partie intégrante de l’exercice des fonctions consulaires et diplomatiques de l’Ambassade. La présente Politique de confidentialité décrit la manière dont nous traitons les données personnelles recueillies par l’intermédiaire de ce site Web et des services que nous fournissons, et elle s’applique à l’ensemble des visiteurs, demandeurs et correspondants qui interagissent avec nous.",
    "restriction": "de limitation",
    "Subject to applicable law and to the official functions of the Embassy, you may have the right to:": "Sous réserve du droit applicable et des fonctions officielles de l’Ambassade, vous pouvez disposer du droit :",
    "Technical & usage data": "Données techniques et d’utilisation",
    "The Embassy of the Democratic Republic of the Congo in Washington, D.C., located at 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036, is the controller responsible for your personal data in connection with this Site. Inquiries about this Policy may be directed to our data protection contact at": "L’Ambassade de la République démocratique du Congo à Washington, D.C., située au 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036, est le responsable du traitement de vos données personnelles dans le cadre de ce Site. Les demandes relatives à la présente Politique peuvent être adressées à notre contact chargé de la protection des données à",
    "The Embassy of the Democratic Republic of the Congo is committed to protecting the privacy and security of the personal data entrusted to it by the public it serves. This Policy explains what we collect, why, and the rights available to you.": "L’Ambassade de la République démocratique du Congo s’engage à protéger la confidentialité et la sécurité des données personnelles que lui confie le public qu’elle sert. La présente Politique explique ce que nous recueillons, pourquoi, et les droits dont vous disposez.",
    "the performance of the Embassy's official consular and diplomatic functions;": "l’exercice des fonctions consulaires et diplomatiques officielles de l’Ambassade ;",
    "the personal data we hold about you;": "les données personnelles que nous détenons à votre sujet ;",
    "the protection of the vital interests of you or another person; and": "la protection des intérêts vitaux de vous-même ou d’une autre personne ; et",
    "The Site is not directed at children, and we do not knowingly collect personal data from minors except in the context of a consular matter handled through a parent or legal guardian. Where a consular application concerns a minor, the data is provided and managed by the responsible adult.": "Le Site ne s’adresse pas aux enfants, et nous ne recueillons pas sciemment de données personnelles auprès de mineurs, sauf dans le cadre d’une affaire consulaire traitée par l’intermédiaire d’un parent ou d’un tuteur légal. Lorsqu’une demande consulaire concerne un mineur, les données sont fournies et gérées par l’adulte responsable.",
    "The Site uses cookies and similar technologies to operate correctly and to understand how it is used. For full details of the cookies we use and how to manage them, please see our": "Le Site utilise des cookies et des technologies similaires pour fonctionner correctement et pour comprendre la manière dont il est utilisé. Pour tous les détails sur les cookies que nous utilisons et sur la manière de les gérer, veuillez consulter notre",
    "To exercise any of these rights, please contact": "Pour exercer l’un de ces droits, veuillez contacter",
    "Unofficial demo, this website is a demonstration prototype. This Privacy Policy illustrates the design of a diplomatic mission's website and does not constitute a live legal instrument of the Democratic Republic of the Congo or any government, nor does the prototype collect or store personal data.": "Démonstration non officielle : ce site Web est un prototype de démonstration. La présente Politique de confidentialité illustre la conception du site Web d’une mission diplomatique et ne constitue pas un instrument juridique en vigueur de la République démocratique du Congo ni d’aucun gouvernement ; le prototype ne recueille ni ne conserve non plus de données personnelles.",
    "We collect personal data directly from you when you complete a form, book an appointment, correspond with us, or submit a consular application; and automatically through your use of the Site. We process personal data on one or more of the following bases:": "Nous recueillons les données personnelles directement auprès de vous lorsque vous remplissez un formulaire, prenez un rendez-vous, correspondez avec nous ou soumettez une demande consulaire ; et automatiquement lors de votre utilisation du Site. Nous traitons les données personnelles sur la base d’un ou de plusieurs des fondements suivants :",
    "We do not sell your personal data. We may share personal data with the competent ministries and authorities of the Democratic Republic of the Congo, and with trusted service providers who act on our behalf under appropriate confidentiality obligations.": "Nous ne vendons pas vos données personnelles. Nous pouvons communiquer des données personnelles aux ministères et autorités compétents de la République démocratique du Congo, ainsi qu’à des prestataires de services de confiance qui agissent pour notre compte dans le respect d’obligations de confidentialité appropriées.",
    "We implement appropriate technical and organisational measures designed to protect personal data against unauthorised access, accidental loss, alteration, disclosure or destruction. These include access controls, restriction of data to authorised personnel, and confidentiality obligations. No method of transmission over the internet is entirely secure, and we cannot guarantee the absolute security of data transmitted to the Site.": "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées destinées à protéger les données personnelles contre tout accès non autorisé, perte accidentelle, altération, divulgation ou destruction. Celles-ci comprennent des contrôles d’accès, la restriction des données au personnel autorisé et des obligations de confidentialité. Aucune méthode de transmission sur Internet n’est entièrement sûre, et nous ne pouvons garantir la sécurité absolue des données transmises au Site.",
    "We may also disclose personal data where we are required to do so by law, by valid legal process, or where disclosure is necessary to protect the rights, safety or property of the Embassy, its personnel or the public, subject always to the privileges and immunities of the mission under international law.": "Nous pouvons également communiquer des données personnelles lorsque la loi ou une procédure judiciaire valide nous y oblige, ou lorsque cette communication est nécessaire pour protéger les droits, la sécurité ou les biens de l’Ambassade, de son personnel ou du public, toujours sous réserve des privilèges et immunités de la mission au titre du droit international.",
    "We may rely on third-party services for functions such as analytics, mapping and content delivery. These providers process data on our behalf, or in accordance with their own privacy notices. We encourage you to review the privacy practices of any third-party service you access through the Site.": "Nous pouvons recourir à des services de tiers pour des fonctions telles que l’analyse d’audience, la cartographie et la diffusion de contenu. Ces prestataires traitent les données pour notre compte ou conformément à leurs propres avis de confidentialité. Nous vous encourageons à examiner les pratiques de confidentialité de tout service de tiers auquel vous accédez par l’intermédiaire du Site.",
    "We may update this Privacy Policy from time to time to reflect changes in our practices or in applicable law. The date of the latest revision is shown at the top of this page. We encourage you to review this Policy periodically.": "Nous pouvons mettre à jour la présente Politique de confidentialité de temps à autre afin de refléter les évolutions de nos pratiques ou du droit applicable. La date de la dernière révision figure en haut de cette page. Nous vous encourageons à consulter la présente Politique périodiquement.",
    "We retain personal data only for as long as is necessary to fulfil the purposes for which it was collected, including to satisfy legal, archival, accounting or reporting requirements. Consular records may be retained for extended periods where official document-issuance and civil-registry functions so require. When data is no longer required, it is securely deleted or anonymised.": "Nous ne conservons les données personnelles que pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été recueillies, y compris pour satisfaire aux exigences légales, archivistiques, comptables ou de déclaration. Les dossiers consulaires peuvent être conservés pendant des périodes prolongées lorsque les fonctions officielles de délivrance de documents et d’état civil l’exigent. Lorsque les données ne sont plus nécessaires, elles sont supprimées de manière sécurisée ou anonymisées.",
    "We use personal data to: respond to your inquiries; process appointments and consular applications; verify identity and prevent fraud; issue and authenticate official documents; communicate important notices; maintain the security and integrity of the Site; and comply with applicable legal and reporting obligations.": "Nous utilisons les données personnelles pour : répondre à vos demandes ; traiter les rendez-vous et les demandes consulaires ; vérifier l’identité et prévenir la fraude ; délivrer et authentifier des documents officiels ; communiquer des avis importants ; assurer la sécurité et l’intégrité du Site ; et respecter les obligations légales et de déclaration applicables.",
    "withdraw consent": "de retirer votre consentement",
    "your consent, where it is requested for a specific purpose;": "votre consentement, lorsqu’il est demandé pour une finalité déterminée ;",
    "Content": "Contenu",
    "Embassy": "Ambassade",
    "our": "notre",
    "us": "nous",
    "user": "utilisateur",
    "we": "nous",
    "You": "Vous",
    ", together with the Embassy's name and insignia, are protected official symbols. They may not be reproduced, imitated or used in any manner that suggests official endorsement, affiliation or authorisation without the express prior written permission of the Embassy. Unauthorised use of these symbols may constitute an offence under applicable law.": ", ainsi que le nom et les insignes de l’Ambassade, sont des symboles officiels protégés. Ils ne peuvent être reproduits, imités ou utilisés de quelque manière que ce soit qui suggérerait une approbation, une affiliation ou une autorisation officielle sans l’autorisation écrite préalable et expresse de l’Ambassade. L’utilisation non autorisée de ces symboles peut constituer une infraction au regard du droit applicable.",
    ". If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.": ". Si vous n’acceptez pas une quelconque partie des présentes Conditions, vous devez cesser immédiatement d’utiliser le Site.",
    "1. Acceptance of terms": "1. Acceptation des conditions",
    "10. Fees & payments": "10. Frais et paiements",
    "11. Suspension & termination": "11. Suspension et résiliation",
    "11. Suspension & termination of access": "11. Suspension et résiliation de l’accès",
    "12. Disclaimer of warranties": "12. Clause de non-responsabilité relative aux garanties",
    "13. Limitation of liability": "13. Limitation de responsabilité",
    "14. Indemnification": "14. Indemnisation",
    "15. Force majeure": "15. Force majeure",
    "16. Diplomatic & sovereign immunity notice": "16. Avis relatif à l’immunité diplomatique et souveraine",
    "16. Diplomatic immunity": "16. Immunité diplomatique",
    "17. Governing law": "17. Droit applicable",
    "17. Governing law & jurisdiction": "17. Droit applicable et juridiction",
    "18. Severability & entire agreement": "18. Divisibilité et intégralité de l’accord",
    "19. Amendments": "19. Modifications",
    "19. Amendments to the terms": "19. Modifications des conditions",
    "2. Definitions": "2. Définitions",
    "20. Contact": "20. Contact",
    "20. How to contact us about these terms": "20. Comment nous contacter au sujet des présentes conditions",
    "24 June 2026": "24 juin 2026",
    "3. Scope & eligibility": "3. Champ d’application et admissibilité",
    "4. Permitted use & conduct": "4. Utilisation autorisée et conduite",
    "4. Permitted use & user conduct": "4. Utilisation autorisée et conduite de l’utilisateur",
    "5. Consular services & appointments": "5. Services consulaires et rendez-vous",
    "6. Accuracy of information": "6. Exactitude des informations",
    "6. Accuracy of information & no guarantee of outcome": "6. Exactitude des informations et absence de garantie de résultat",
    "7. Intellectual property & the embassy seal": "7. Propriété intellectuelle et sceau de l’ambassade",
    "7. Intellectual property & the seal": "7. Propriété intellectuelle et sceau",
    "8. Third-party links": "8. Liens de tiers",
    "8. Third-party links & content": "8. Liens et contenus de tiers",
    "9. User submissions": "9. Contributions des utilisateurs",
    "All Content on the Site, including the layout, design, text, graphics and software, is owned by or licensed to the Embassy and is protected by copyright, trademark and other intellectual-property laws.": "L’ensemble du Contenu du Site, y compris la mise en page, la conception, les textes, les graphismes et les logiciels, appartient à l’Ambassade ou fait l’objet d’une licence en sa faveur, et est protégé par le droit d’auteur, le droit des marques et d’autres lois relatives à la propriété intellectuelle.",
    "and": "et",
    "attempt to gain unauthorised access to the Site, the server on which it is stored, or any connected database or infrastructure;": "tenter d’obtenir un accès non autorisé au Site, au serveur sur lequel il est hébergé, ou à toute base de données ou infrastructure connectée ;",
    "Booking an appointment or submitting a request through the Site does not by itself confer any right, entitlement or guarantee that a service will be granted. The Embassy reserves the discretion to request additional information, to require a personal appearance, and to refuse, suspend or cancel any application that does not satisfy the applicable requirements.": "La prise d’un rendez-vous ou la soumission d’une demande par l’intermédiaire du Site ne confère en elle-même aucun droit, prérogative ou garantie qu’un service sera accordé. L’Ambassade se réserve le pouvoir discrétionnaire de demander des informations supplémentaires, d’exiger une comparution personnelle, et de refuser, suspendre ou annuler toute demande qui ne satisfait pas aux exigences applicables.",
    "By accessing, browsing or otherwise using this website (the \"Site\"), you acknowledge that you have read, understood and agree to be bound by these Terms & Conditions (the \"Terms\") and by any policies referenced herein, including our": "En accédant à ce site web (le « Site »), en le parcourant ou en l’utilisant de toute autre manière, vous reconnaissez avoir lu et compris les présentes Conditions générales d’utilisation (les « Conditions ») et acceptez d’être lié par celles-ci ainsi que par toute politique qui y est référencée, y compris notre",
    "Certain Consular Services are subject to official fees. Where fees apply, the applicable amounts, accepted methods of payment and any associated conditions will be communicated through official channels. Consular fees are, save as expressly provided by law or official policy, non-refundable once a service has been processed. The Site is a demonstration prototype and does not itself collect or process any payment.": "Certains Services consulaires sont soumis à des frais officiels. Lorsque des frais s’appliquent, les montants applicables, les modes de paiement acceptés et toute condition associée seront communiqués par les canaux officiels. Sauf disposition expresse de la loi ou d’une politique officielle, les frais consulaires ne sont pas remboursables une fois qu’un service a été traité. Le Site est un prototype de démonstration et ne collecte ni ne traite lui-même aucun paiement.",
    "conduct any denial-of-service attack, automated scraping, or excessive automated querying that imposes an unreasonable load on the Site;": "mener une attaque par déni de service, une extraction automatisée de données ou des requêtes automatisées excessives qui imposent une charge déraisonnable au Site ;",
    "Embassy of the Democratic Republic of the Congo": "Ambassade de la République démocratique du Congo",
    "If any provision of these Terms is held to be invalid, unlawful or unenforceable, that provision shall be severed and the remaining provisions shall continue in full force and effect. These Terms, together with the policies referenced within them, constitute the entire agreement between you and the Embassy regarding your use of the Site and supersede any prior understandings on that subject.": "Si une quelconque disposition des présentes Conditions est jugée invalide, illicite ou inapplicable, cette disposition sera dissociée des autres et les dispositions restantes conserveront leur plein effet. Les présentes Conditions, ainsi que les politiques qui y sont référencées, constituent l’intégralité de l’accord entre vous et l’Ambassade concernant votre utilisation du Site et remplacent tout accord antérieur portant sur ce sujet.",
    "In these Terms, unless the context requires otherwise:": "Dans les présentes Conditions, sauf si le contexte l’exige autrement :",
    "Information about Consular Services published on the Site is provided for guidance only. All applications, appointments and requests are subject to verification, to the submission of valid supporting documents, and to the official requirements and procedures in force at the time of processing.": "Les informations relatives aux Services consulaires publiées sur le Site sont fournies à titre indicatif uniquement. Toutes les demandes, tous les rendez-vous et toutes les requêtes sont soumis à vérification, à la présentation de pièces justificatives valides, ainsi qu’aux exigences et procédures officielles en vigueur au moment du traitement.",
    "introduce viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful;": "introduire des virus, chevaux de Troie, vers, bombes logiques ou tout autre élément malveillant ou technologiquement nuisible ;",
    "means all text, images, graphics, documents, forms, data and other material made available on the Site.": "désigne l’ensemble des textes, images, graphismes, documents, formulaires, données et autres éléments mis à disposition sur le Site.",
    "means passport, visa, civil-registry, legalization, notarial and related services administered by the Embassy's Consular Section.": "désigne les services de passeport, de visa, d’état civil, de légalisation, notariaux et connexes administrés par la Section consulaire de l’Ambassade.",
    "Nothing on the Site constitutes legal, immigration, financial or professional advice, and no outcome of any application or request is guaranteed.": "Aucun élément du Site ne constitue un conseil juridique, en matière d’immigration, financier ou professionnel, et aucun résultat d’une quelconque demande ou requête n’est garanti.",
    "or": "ou",
    "Questions regarding these Terms & Conditions may be addressed to the Embassy's legal correspondence office:": "Les questions relatives aux présentes Conditions générales d’utilisation peuvent être adressées au bureau de correspondance juridique de l’Ambassade :",
    "refers to any natural or legal person who accesses or uses the Site.": "désigne toute personne physique ou morale qui accède au Site ou l’utilise.",
    "refers to the Embassy of the Democratic Republic of the Congo accredited to the United States of America and located in Washington, D.C.": "désigne l’Ambassade de la République démocratique du Congo accréditée auprès des États-Unis d’Amérique et située à Washington, D.C.",
    "reproduce, duplicate, copy, resell or commercially exploit any part of the Site without our prior written consent;": "reproduire, dupliquer, copier, revendre ou exploiter commercialement une quelconque partie du Site sans notre consentement écrit préalable ;",
    "seal, coat of arms, national emblem and flag of the Democratic Republic of the Congo": "sceau, armoiries, emblème national et drapeau de la République démocratique du Congo",
    "submit false, misleading or fraudulent information, or impersonate any person or entity, including any official of the Embassy or the Government of the DRC;": "soumettre des informations fausses, trompeuses ou frauduleuses, ou usurper l’identité de toute personne ou entité, y compris tout agent de l’Ambassade ou du Gouvernement de la RDC ;",
    "The": "Le",
    "The Embassy is a diplomatic mission of the Democratic Republic of the Congo. Nothing on the Site or in these Terms shall be construed as a waiver, express or implied, of any of the privileges and immunities enjoyed by the Embassy, its premises, its property, its archives or its personnel under the Vienna Convention on Diplomatic Relations (1961), customary international law, or any applicable bilateral agreement. All such privileges and immunities are expressly reserved.": "L’Ambassade est une mission diplomatique de la République démocratique du Congo. Aucun élément du Site ni des présentes Conditions ne saurait être interprété comme une renonciation, expresse ou implicite, à l’un quelconque des privilèges et immunités dont bénéficient l’Ambassade, ses locaux, ses biens, ses archives ou son personnel en vertu de la Convention de Vienne sur les relations diplomatiques (1961), du droit international coutumier ou de tout accord bilatéral applicable. Tous ces privilèges et immunités sont expressément réservés.",
    "The Embassy makes reasonable efforts to ensure that the Content is accurate and current. However, the Content is provided for general information purposes and may be updated, changed or withdrawn at any time without notice. Requirements for visas, passports, legalization and travel are subject to change and must be confirmed with the Consular Section before you act upon them.": "L’Ambassade déploie des efforts raisonnables pour garantir que le Contenu est exact et à jour. Toutefois, le Contenu est fourni à titre d’information générale et peut être mis à jour, modifié ou retiré à tout moment sans préavis. Les exigences relatives aux visas, aux passeports, à la légalisation et aux voyages sont susceptibles d’être modifiées et doivent être confirmées auprès de la Section consulaire avant que vous n’agissiez sur leur fondement.",
    "The Embassy reserves the right to amend, update or replace these Terms at any time. The date of the most recent revision appears at the top of this page. Material changes will, where appropriate, be brought to the attention of users. It is your responsibility to review these Terms periodically.": "L’Ambassade se réserve le droit de modifier, mettre à jour ou remplacer les présentes Conditions à tout moment. La date de la révision la plus récente figure en haut de cette page. Les modifications substantielles seront, le cas échéant, portées à l’attention des utilisateurs. Il vous incombe de consulter périodiquement les présentes Conditions.",
    "The Embassy shall not be liable for any failure or delay in performing its obligations where such failure or delay results from causes beyond its reasonable control, including acts of God, natural disasters, epidemics, armed conflict, civil unrest, governmental action, interruption of utilities, telecommunications or internet failures, or any other event of force majeure.": "L’Ambassade ne saurait être tenue responsable de tout manquement ou retard dans l’exécution de ses obligations lorsque ce manquement ou ce retard résulte de causes échappant à son contrôle raisonnable, notamment les cas fortuits, les catastrophes naturelles, les épidémies, les conflits armés, les troubles civils, les actions gouvernementales, l’interruption des services publics, les défaillances des télécommunications ou de l’internet, ou tout autre événement de force majeure.",
    "The Site and all Content are provided on an \"as is\" and \"as available\" basis, without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. The Embassy does not warrant that the Site will be uninterrupted, timely, secure or error-free, or that any defects will be corrected.": "Le Site et l’ensemble du Contenu sont fournis « en l’état » et « selon leur disponibilité », sans garanties d’aucune sorte, expresses ou implicites, y compris, sans s’y limiter, les garanties implicites de qualité marchande, d’adéquation à un usage particulier, d’exactitude et d’absence de contrefaçon. L’Ambassade ne garantit pas que le Site sera ininterrompu, ponctuel, sécurisé ou exempt d’erreurs, ni que d’éventuels défauts seront corrigés.",
    "The Site is intended to provide general information about the Embassy, the Democratic Republic of the Congo, and the consular and diplomatic services available to the public. It is offered to a worldwide audience but is administered from the United States.": "Le Site a pour objet de fournir des informations générales sur l’Ambassade, la République démocratique du Congo, ainsi que sur les services consulaires et diplomatiques accessibles au public. Il est proposé à un public mondial mais est administré depuis les États-Unis.",
    "The Site may contain links to external websites and resources operated by third parties, including government agencies and partner institutions. These links are provided for your convenience only. The Embassy does not control, endorse or assume responsibility for the content, policies or practices of any third-party site, and access to them is at your own risk.": "Le Site peut contenir des liens vers des sites web et des ressources externes exploités par des tiers, y compris des organismes gouvernementaux et des institutions partenaires. Ces liens sont fournis uniquement pour votre commodité. L’Ambassade ne contrôle ni n’approuve le contenu, les politiques ou les pratiques d’aucun site de tiers et n’en assume aucune responsabilité ; l’accès à ces sites se fait à vos propres risques.",
    "The terms governing your access to and use of the official website of the Embassy of the Democratic Republic of the Congo in Washington, D.C.": "Les conditions régissant votre accès au site web officiel de l’Ambassade de la République démocratique du Congo à Washington, D.C. et votre utilisation de celui-ci.",
    "These Terms & Conditions establish the conditions under which the Embassy of the Democratic Republic of the Congo in Washington, D.C. makes this website and its associated services available to you. Please read them carefully before using the site.": "Les présentes Conditions générales d’utilisation établissent les conditions dans lesquelles l’Ambassade de la République démocratique du Congo à Washington, D.C. met ce site web et les services qui y sont associés à votre disposition. Veuillez les lire attentivement avant d’utiliser le site.",
    "These Terms and any dispute or claim arising out of or in connection with them or their subject matter shall be governed by and construed in accordance with the laws of the District of Columbia and the applicable laws of the United States, without prejudice to the privileges and immunities referred to in Section 16 and without giving effect to any choice-of-law principles that would require the application of the laws of another jurisdiction.": "Les présentes Conditions, ainsi que tout litige ou toute réclamation en découlant ou s’y rapportant, ou se rapportant à leur objet, sont régies et interprétées conformément aux lois du District de Columbia et aux lois applicables des États-Unis, sans préjudice des privilèges et immunités visés à la Section 16 et sans donner effet à aucun principe de conflit de lois qui exigerait l’application des lois d’une autre juridiction.",
    "To the fullest extent permitted by applicable law, the Embassy, its officials, employees and agents shall not be liable for any direct, indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits, goodwill or opportunity, arising out of or in connection with your access to, use of, or inability to use the Site, even if advised of the possibility of such damages. Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under applicable law.": "Dans toute la mesure permise par le droit applicable, l’Ambassade, ses agents, employés et représentants ne sauraient être tenus responsables de tout dommage direct, indirect, accessoire, spécial, consécutif ou punitif, ni de toute perte de données, de profits, de clientèle ou d’opportunité, découlant de ou lié à votre accès au Site, à votre utilisation de celui-ci ou à votre impossibilité de l’utiliser, même s’ils ont été avisés de l’éventualité de tels dommages. Aucune disposition des présentes Conditions n’exclut ni ne limite une responsabilité qui ne peut être exclue ou limitée en vertu du droit applicable.",
    "Unofficial demo, this website is a demonstration prototype. These Terms are provided to illustrate the design of a diplomatic mission's website and do not constitute a live legal instrument of the Democratic Republic of the Congo or any government.": "Démo non officielle : ce site web est un prototype de démonstration. Les présentes Conditions sont fournies afin d’illustrer la conception du site web d’une mission diplomatique et ne constituent pas un instrument juridique en vigueur de la République démocratique du Congo ni d’aucun gouvernement.",
    "use the Site in any way that breaches any applicable local, national or international law or regulation;": "utiliser le Site d’une manière qui enfreint une quelconque loi ou réglementation locale, nationale ou internationale applicable ;",
    "use the Site to transmit unlawful, defamatory, harassing, abusive or otherwise objectionable material.": "utiliser le Site pour transmettre des éléments illicites, diffamatoires, harcelants, abusifs ou autrement répréhensibles.",
    "We may, at our sole discretion and without prior notice, suspend, restrict or terminate your access to all or part of the Site if we reasonably believe that you have breached these Terms, or where required for security, maintenance, legal or operational reasons. Termination does not affect any rights or obligations that accrued before the date of termination.": "Nous pouvons, à notre seule discrétion et sans préavis, suspendre, restreindre ou résilier votre accès à tout ou partie du Site si nous estimons raisonnablement que vous avez enfreint les présentes Conditions, ou lorsque cela est requis pour des raisons de sécurité, de maintenance, juridiques ou opérationnelles. La résiliation n’affecte pas les droits ou obligations nés avant la date de résiliation.",
    "We reserve the right to report any unlawful activity to the competent authorities and to cooperate with such authorities by disclosing your identity where required.": "Nous nous réservons le droit de signaler toute activité illicite aux autorités compétentes et de coopérer avec ces autorités en divulguant votre identité lorsque cela est requis.",
    "Where the Site permits you to submit information, messages or documents, you grant the Embassy a non-exclusive right to use that material for the purpose of responding to and processing your request. You are responsible for ensuring that any material you submit does not infringe the rights of any third party and is not unlawful. Do not transmit confidential personal data through unsecured channels.": "Lorsque le Site vous permet de soumettre des informations, des messages ou des documents, vous accordez à l’Ambassade un droit non exclusif d’utiliser ces éléments aux fins de répondre à votre demande et de la traiter. Il vous incombe de veiller à ce que tout élément que vous soumettez ne porte pas atteinte aux droits d’un tiers et ne soit pas illicite. Ne transmettez pas de données personnelles confidentielles par des canaux non sécurisés.",
    "You agree to indemnify, defend and hold harmless the Embassy and its officials, employees and agents from and against any claims, liabilities, damages, losses and expenses, including reasonable legal fees, arising out of or in any way connected with your breach of these Terms or your misuse of the Site.": "Vous acceptez d’indemniser, de défendre et de dégager de toute responsabilité l’Ambassade ainsi que ses agents, employés et représentants à l’encontre de toute réclamation, responsabilité, dommage, perte et dépense, y compris les frais juridiques raisonnables, découlant de ou liés de quelque manière que ce soit à votre violation des présentes Conditions ou à votre utilisation abusive du Site.",
    "You are responsible for the accuracy and completeness of all information and documents you provide in connection with a consular request.": "Vous êtes responsable de l’exactitude et de l’exhaustivité de l’ensemble des informations et des documents que vous fournissez dans le cadre d’une demande consulaire.",
    "You may use the Site only for lawful purposes and in a manner consistent with these Terms. You agree that you will not:": "Vous ne pouvez utiliser le Site qu’à des fins licites et d’une manière conforme aux présentes Conditions. Vous vous engagez à ne pas :",
    "You may view, download and print pages from the Site for your own personal, non-commercial reference, provided you do not remove any copyright or proprietary notices.": "Vous pouvez consulter, télécharger et imprimer des pages du Site à des fins de référence personnelle et non commerciale, à condition de ne supprimer aucune mention de droit d’auteur ou de propriété.",
    "You represent that you are at least eighteen (18) years of age, or that you are using the Site under the supervision of a parent or legal guardian, and that you have the legal capacity to enter into these Terms. Where you act on behalf of an organisation, you represent that you are authorised to bind that organisation to these Terms.": "Vous déclarez être âgé d’au moins dix-huit (18) ans, ou utiliser le Site sous la supervision d’un parent ou d’un tuteur légal, et disposer de la capacité juridique de conclure les présentes Conditions. Lorsque vous agissez pour le compte d’une organisation, vous déclarez être autorisé à engager cette organisation au titre des présentes Conditions.",
    "Your continued use of the Site following the posting of any revised Terms constitutes your acceptance of those changes.": "La poursuite de votre utilisation du Site après la publication de toute version révisée des Conditions vaut acceptation de ces modifications.",
    ", collect aggregated, generally anonymised information about how visitors use the Site, helping us measure and improve performance.": ", recueillent des informations agrégées et généralement anonymisées sur la manière dont les visiteurs utilisent le Site, ce qui nous aide à en mesurer et à en améliorer les performances.",
    ", enable enhanced functionality and personalisation, such as remembering your language or region.": ", permettent des fonctionnalités améliorées et une personnalisation, comme la mémorisation de votre langue ou de votre région.",
    ", most browsers allow you to view, block and delete cookies through their settings. Consult your browser's help pages for instructions.": ", la plupart des navigateurs vous permettent de consulter, de bloquer et de supprimer les cookies dans leurs paramètres. Consultez les pages d’aide de votre navigateur pour obtenir des instructions.",
    ", required for the Site to function and to provide services you request, such as security and session management. These cannot be switched off in our systems.": ", nécessaires au fonctionnement du Site et à la fourniture des services que vous demandez, comme la sécurité et la gestion de session. Ils ne peuvent pas être désactivés dans nos systèmes.",
    ", store your settings and consent choices so that you are not asked repeatedly.": ", enregistrent vos paramètres et vos choix de consentement afin que la question ne vous soit pas posée de manière répétée.",
    ", where presented, you may accept or decline non-essential cookies and change your choice at any time.": ", lorsqu’ils vous sont présentés, vous pouvez accepter ou refuser les cookies non essentiels et modifier votre choix à tout moment.",
    "1. What cookies are": "1. Ce que sont les cookies",
    "2. How & why we use cookies": "2. Comment et pourquoi nous utilisons les cookies",
    "2. How & why we use them": "2. Comment et pourquoi nous les utilisons",
    "24 hours": "24 heures",
    "3. Categories of cookies": "3. Catégories de cookies",
    "4. Cookies we use": "4. Cookies que nous utilisons",
    "5. Third-party cookies": "5. Cookies tiers",
    "6 months": "6 mois",
    "6. Managing & disabling": "6. Gestion et désactivation",
    "6. Managing & disabling cookies": "6. Gestion et désactivation des cookies",
    "7. Do Not Track": "7. Do Not Track",
    "8. Changes to this policy": "8. Modifications de la présente politique",
    "9. Contact us": "9. Nous contacter",
    "Aggregated, anonymised analytics on page usage.": "Mesures d’audience agrégées et anonymisées sur l’utilisation des pages.",
    "Browser controls": "Contrôles du navigateur",
    "Consent banner": "Bandeau de consentement",
    "Cookies are small text files placed on your device by a website you visit. They are widely used to make websites work, or work more efficiently, and to provide information to the site's operators. Similar technologies, such as pixels, local storage and software development kits, perform comparable functions; in this Policy we refer to all of them collectively as \"cookies\".": "Les cookies sont de petits fichiers texte déposés sur votre appareil par un site web que vous consultez. Ils sont largement utilisés pour faire fonctionner les sites web, ou les faire fonctionner plus efficacement, ainsi que pour fournir des informations aux exploitants du site. Des technologies similaires, telles que les pixels, le stockage local et les kits de développement logiciel, remplissent des fonctions comparables ; dans la présente Politique, nous les désignons tous collectivement par le terme « cookies ».",
    "Distinguishes returning visitors for analytics.": "Distingue les visiteurs récurrents à des fins de mesure d’audience.",
    "Duration": "Durée",
    "Functional": "Fonctionnel",
    "Functional cookies": "Cookies fonctionnels",
    "How and why the Embassy of the Democratic Republic of the Congo uses cookies on this website, and how you can control them.": "Comment et pourquoi l’Ambassade de la République démocratique du Congo utilise des cookies sur ce site web, et comment vous pouvez les contrôler.",
    "If you have questions about our use of cookies, please contact:": "Si vous avez des questions concernant notre utilisation des cookies, veuillez contacter :",
    "Maintains your secure session while you use the Site.": "Maintient votre session sécurisée pendant que vous utilisez le Site.",
    "Name": "Nom",
    "Performance": "Performance",
    "Performance & analytics cookies": "Cookies de performance et de mesure d’audience",
    "Please note that blocking strictly necessary cookies may prevent parts of the Site from functioning correctly.": "Veuillez noter que le blocage des cookies strictement nécessaires peut empêcher certaines parties du Site de fonctionner correctement.",
    "Preference": "Préférence",
    "Preference cookies": "Cookies de préférence",
    "Protects forms against cross-site request forgery.": "Protège les formulaires contre la falsification de requête intersites.",
    "Purpose": "Finalité",
    "Records your cookie-consent preferences.": "Enregistre vos préférences de consentement aux cookies.",
    "Remembers your selected language (e.g. EN / FR).": "Mémorise la langue que vous avez sélectionnée (par ex. EN / FR).",
    "Representative cookies set on this website": "Cookies représentatifs déposés sur ce site web",
    "Session": "Session",
    "Some browsers offer a \"Do Not Track\" (DNT) signal. As there is not yet a uniform industry standard for responding to DNT signals, the Site does not currently respond to them. We will continue to monitor developments and update this Policy as appropriate.": "Certains navigateurs proposent un signal « Do Not Track » (DNT). Comme il n’existe pas encore de norme sectorielle uniforme pour répondre aux signaux DNT, le Site n’y répond pas actuellement. Nous continuerons de suivre les évolutions et de mettre à jour la présente Politique selon ce qui sera approprié.",
    "Some cookies may be set by third-party services we use to enhance the Site, such as analytics providers, embedded maps or video players. These third parties may set their own cookies when their content is loaded. We do not control these cookies; please refer to the relevant provider's own privacy and cookie notices for details.": "Certains cookies peuvent être déposés par des services tiers que nous utilisons pour améliorer le Site, tels que des fournisseurs de mesure d’audience, des cartes intégrées ou des lecteurs vidéo. Ces tiers peuvent déposer leurs propres cookies lors du chargement de leur contenu. Nous ne contrôlons pas ces cookies ; veuillez vous reporter aux avis de confidentialité et de cookies propres au fournisseur concerné pour plus de détails.",
    "Strictly necessary": "Strictement nécessaires",
    "Strictly necessary cookies": "Cookies strictement nécessaires",
    "The table below lists representative examples of the cookies used on this Site. Names and durations are illustrative of a typical embassy website configuration.": "Le tableau ci-dessous présente des exemples représentatifs des cookies utilisés sur ce Site. Les noms et les durées sont donnés à titre indicatif pour une configuration type de site web d’ambassade.",
    "This Cookie Policy explains what cookies are, how the Embassy uses them on this website, and the choices available to you. It should be read together with our": "La présente Politique relative aux cookies explique ce que sont les cookies, comment l’Ambassade les utilise sur ce site web et les choix qui s’offrent à vous. Elle doit être lue conjointement avec notre",
    "Type": "Type",
    "Unofficial demo, this website is a demonstration prototype. The cookies listed above are illustrative examples; this prototype does not set tracking cookies or constitute a live legal instrument of any government.": "Démonstration non officielle, ce site web est un prototype de démonstration. Les cookies énumérés ci-dessus sont des exemples illustratifs ; ce prototype ne dépose pas de cookies de suivi et ne constitue pas un instrument juridique en vigueur d’un quelconque gouvernement.",
    "We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for operational, legal or regulatory reasons. The date of the latest revision is shown at the top of this page.": "Nous pouvons mettre à jour la présente Politique relative aux cookies de temps à autre afin de refléter les changements des cookies que nous utilisons ou pour des raisons opérationnelles, légales ou réglementaires. La date de la dernière révision figure en haut de cette page.",
    "We use cookies to ensure the Site functions correctly, to remember your preferences, to keep the Site secure, and to understand how visitors use the Site so that we can improve it. Some cookies are essential to the operation of the Site; others are optional and are used only where permitted.": "Nous utilisons des cookies pour garantir le bon fonctionnement du Site, mémoriser vos préférences, assurer la sécurité du Site et comprendre comment les visiteurs utilisent le Site afin de pouvoir l’améliorer. Certains cookies sont essentiels au fonctionnement du Site ; d’autres sont facultatifs et ne sont utilisés que lorsque cela est autorisé.",
    "You can control and manage cookies in several ways:": "Vous pouvez contrôler et gérer les cookies de plusieurs manières :",
    ", call +1 (202) 234-7690 during office hours.": " , appelez le +1 (202) 234-7690 pendant les heures de bureau.",
    ", content remains legible and usable when text is enlarged or the page is zoomed.": " , le contenu reste lisible et utilisable lorsque le texte est agrandi ou que la page est zoomée.",
    ", informative images are given descriptive alternative text, and decorative images are marked so they are skipped by screen readers.": " , les images informatives sont dotées d’un texte alternatif descriptif, et les images décoratives sont signalées afin d’être ignorées par les lecteurs d’écran.",
    ", interactive elements are operable using a keyboard, with a visible focus indicator.": " , les éléments interactifs sont utilisables au clavier, avec un indicateur de focus visible.",
    ", meaningful HTML structure with headings, landmarks and lists that assistive technologies can interpret.": " , une structure HTML cohérente comportant des titres, des repères et des listes que les technologies d’assistance peuvent interpréter.",
    ", predictable, consistent layout and navigation across pages.": " , une mise en page et une navigation prévisibles et cohérentes d’une page à l’autre.",
    ", published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible to people with a wide range of disabilities, including visual, auditory, physical, speech, cognitive and neurological disabilities.": " , publiées par le World Wide Web Consortium (W3C). Ces directives expliquent comment rendre le contenu web plus accessible aux personnes présentant un large éventail de handicaps, notamment visuels, auditifs, physiques, liés à la parole, cognitifs et neurologiques.",
    ", text and interface colours are chosen to provide sufficient contrast against their backgrounds.": " , les couleurs du texte et de l’interface sont choisies pour offrir un contraste suffisant avec leur arrière-plan.",
    ", visit the Consular Section at 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036 during consular hours.": " , présentez-vous à la Section consulaire au 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036 pendant les heures consulaires.",
    ", write to": " , écrivez à",
    ". The Embassy takes accessibility concerns seriously and will make every reasonable effort to resolve them.": " . L’Ambassade prend au sérieux les préoccupations relatives à l’accessibilité et mettra tout en œuvre, dans la mesure du raisonnable, pour les résoudre.",
    "1. Our commitment to accessibility": "1. Notre engagement en faveur de l’accessibilité",
    "2. Conformance status": "2. État de conformité",
    "3. Measures we take": "3. Mesures que nous prenons",
    "3. Measures we take to support accessibility": "3. Mesures que nous prenons pour favoriser l’accessibilité",
    "4. Assistive technology": "4. Technologie d’assistance",
    "4. Assistive-technology compatibility": "4. Compatibilité avec les technologies d’assistance",
    "5. Known limitations": "5. Limitations connues",
    "6. Alternative access": "6. Accès alternatif",
    "6. Alternative ways to access our services": "6. Autres moyens d’accéder à nos services",
    "7. Feedback & reporting": "7. Retour d’information et signalement",
    "7. Feedback & reporting accessibility barriers": "7. Retour d’information et signalement des obstacles à l’accessibilité",
    "8. Enforcement & contact": "8. Application et contact",
    "9. Ongoing improvement": "9. Amélioration continue",
    "Accessibility feedback": "Retour d’information sur l’accessibilité",
    "Accessibility is an ongoing commitment rather than a one-time effort. We review this Site regularly, incorporate accessibility into our development practices, and update this Statement as improvements are made. This Statement was last reviewed on the date shown above.": "L’accessibilité est un engagement permanent plutôt qu’un effort ponctuel. Nous examinons ce Site régulièrement, intégrons l’accessibilité à nos pratiques de développement et mettons à jour la présente Déclaration au fur et à mesure des améliorations apportées. La présente Déclaration a été examinée pour la dernière fois à la date indiquée ci-dessus.",
    "By email": "Par courriel",
    "By telephone": "Par téléphone",
    "certain third-party content or embedded components may not fully meet our accessibility standards;": "certains contenus tiers ou composants intégrés peuvent ne pas répondre pleinement à nos normes d’accessibilité ;",
    "Colour contrast": "Contraste des couleurs",
    "Consistent navigation": "Navigation cohérente",
    "Despite our efforts, some limitations may remain. We are aware that:": "Malgré nos efforts, certaines limitations peuvent subsister. Nous avons conscience que :",
    "If any part of this Site is not accessible to you, the Embassy will be pleased to assist you through alternative channels:": "Si une partie de ce Site ne vous est pas accessible, l’Ambassade se fera un plaisir de vous aider par d’autres canaux :",
    "If you are not satisfied with our response to your accessibility feedback, you may escalate the matter to the office of the Head of Mission via": "Si vous n’êtes pas satisfait de notre réponse à votre retour d’information sur l’accessibilité, vous pouvez porter la question devant le bureau du Chef de mission par l’intermédiaire de",
    "In person": "En personne",
    "Keyboard navigation": "Navigation au clavier",
    "maps and other graphical components may have limited text alternatives.": "les cartes et autres composants graphiques peuvent disposer d’alternatives textuelles limitées.",
    "partially conformant": "partiellement conforme",
    "Post: 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036": "Adresse postale : 1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036",
    "Scalable text": "Texte redimensionnable",
    "Semantic markup": "Balisage sémantique",
    "some older documents may not yet be available in a fully accessible format; and": "certains documents plus anciens peuvent ne pas encore être disponibles dans un format entièrement accessible ; et",
    "Telephone: +1 (202) 234-7690": "Téléphone : +1 (202) 234-7690",
    "Text alternatives": "Alternatives textuelles",
    "The Embassy of the Democratic Republic of the Congo believes that the services of a diplomatic mission should be within reach of everyone. We are committed to providing a website that is accessible to the widest possible audience, regardless of ability or technology.": "L’Ambassade de la République démocratique du Congo estime que les services d’une mission diplomatique doivent être à la portée de tous. Nous nous engageons à proposer un site web accessible au public le plus large possible, quelles que soient les capacités ou les technologies utilisées.",
    "The Embassy of the Democratic Republic of the Congo is committed to ensuring its website is accessible to all members of the public.": "L’Ambassade de la République démocratique du Congo s’engage à faire en sorte que son site web soit accessible à l’ensemble du public.",
    "The Site is currently": "Le Site est actuellement",
    "This Site is designed to be compatible with recent versions of widely used assistive technologies and browsers, including screen readers and screen magnification software, used on current operating systems. Because technology and browsers evolve, some combinations may produce different results; we welcome reports of any difficulty you experience.": "Ce Site est conçu pour être compatible avec les versions récentes des technologies d’assistance et des navigateurs largement utilisés, notamment les lecteurs d’écran et les logiciels d’agrandissement d’écran, employés sur les systèmes d’exploitation actuels. La technologie et les navigateurs évoluant, certaines combinaisons peuvent produire des résultats différents ; nous accueillons volontiers tout signalement de difficulté que vous rencontrez.",
    "This website aims to conform to the": "Ce site web vise à se conformer aux",
    "To make this Site accessible, we have implemented and continue to apply the following measures:": "Pour rendre ce Site accessible, nous avons mis en œuvre et continuons d’appliquer les mesures suivantes :",
    "Unofficial demo, this website is a demonstration prototype. This Accessibility Statement illustrates the design of a diplomatic mission's website and does not constitute a live legal instrument of any government.": "Démonstration non officielle : ce site web est un prototype de démonstration. La présente Déclaration d’accessibilité illustre la conception du site web d’une mission diplomatique et ne constitue pas un instrument juridique en vigueur d’un quelconque gouvernement.",
    "We are committed to ensuring digital accessibility for people with disabilities. We continually work to improve the user experience for everyone and to apply the relevant accessibility standards, so that all members of the public can access information and services with dignity and independence.": "Nous nous engageons à garantir l’accessibilité numérique aux personnes en situation de handicap. Nous œuvrons en permanence à améliorer l’expérience utilisateur pour tous et à appliquer les normes d’accessibilité pertinentes, afin que l’ensemble du public puisse accéder à l’information et aux services avec dignité et autonomie.",
    "We welcome your feedback on the accessibility of this Site. If you encounter an accessibility barrier, please let us know. To help us respond effectively, please include the web address (URL) of the page concerned, a description of the problem, and the browser and assistive technology you were using. We aim to acknowledge accessibility feedback promptly.": "Nous accueillons volontiers vos retours d’information sur l’accessibilité de ce Site. Si vous rencontrez un obstacle à l’accessibilité, veuillez nous en informer. Pour nous aider à répondre efficacement, veuillez indiquer l’adresse web (URL) de la page concernée, une description du problème, ainsi que le navigateur et la technologie d’assistance que vous utilisiez. Nous nous efforçons d’accuser réception des retours d’information sur l’accessibilité dans les meilleurs délais.",
    "Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA": "Règles pour l’accessibilité des contenus web (WCAG) 2.1 au niveau AA",
    "Where you encounter such a limitation, please contact us using the details below and we will provide the information in an alternative format.": "Lorsque vous rencontrez une telle limitation, veuillez nous contacter à l’aide des coordonnées ci-dessous et nous vous fournirons l’information dans un format alternatif.",
    "with WCAG 2.1 AA, meaning that most, but not all, parts of the content meet the standard. We are actively working to achieve full conformance.": "aux WCAG 2.1 AA, ce qui signifie que la plupart des parties du contenu, mais pas toutes, respectent la norme. Nous travaillons activement à atteindre une conformité totale.",
    ", are protected. They may not be reproduced, adapted or used in any way that suggests official status, endorsement or affiliation without the Embassy's prior written authorisation. Unauthorised use may be unlawful.": ", sont protégés. Ils ne peuvent être reproduits, adaptés ou utilisés d’une manière qui suggérerait un statut officiel, un aval ou une affiliation sans l’autorisation écrite préalable de l’Ambassade. Toute utilisation non autorisée peut être illégale.",
    ". Such information must be confirmed officially with the Consular Section, and the granting of any visa, document or service remains at the discretion of the competent authorities, subject to the applicable requirements in force at the time of processing. The Embassy accepts no liability for travel arrangements made in reliance on information published on the Site.": ". Ces informations doivent être confirmées officiellement auprès de la Section consulaire, et l’octroi de tout visa, document ou service demeure à la discrétion des autorités compétentes, sous réserve des exigences applicables en vigueur au moment du traitement. L’Ambassade décline toute responsabilité quant aux dispositions de voyage prises en s’appuyant sur les informations publiées sur le Site.",
    "1. General disclaimer": "1. Clause de non-responsabilité générale",
    "10. Reservation of rights": "10. Réserve de droits",
    "11. Diplomatic & sovereign immunity": "11. Immunité diplomatique et souveraine",
    "11. Diplomatic immunity": "11. Immunité diplomatique",
    "12. Governing law": "12. Droit applicable",
    "13. Contact for legal notices & takedown requests": "13. Contact pour les mentions légales et les demandes de retrait",
    "13. Legal notices & takedown": "13. Mentions légales et retrait",
    "2. No professional advice": "2. Absence de conseil professionnel",
    "2. No professional or legal advice": "2. Absence de conseil professionnel ou juridique",
    "3. Accuracy & completeness": "3. Exactitude et exhaustivité",
    "3. Accuracy & completeness, \"as is\"": "3. Exactitude et exhaustivité, « en l’état »",
    "4. No warranty": "4. Aucune garantie",
    "5. External links": "5. Liens externes",
    "5. External links disclaimer": "5. Clause de non-responsabilité relative aux liens externes",
    "6. Visa, travel & immigration": "6. Visa, voyage et immigration",
    "6. Visa, travel & immigration information": "6. Informations sur les visas, les voyages et l’immigration",
    "7. Limitation of liability": "7. Limitation de responsabilité",
    "8. Copyright & trademark": "8. Droit d’auteur et marques",
    "8. Copyright & trademark notice": "8. Avis relatif au droit d’auteur et aux marques",
    "9. Reproduction & fair use": "9. Reproduction et usage loyal",
    "Embassy of the Democratic Republic of the Congo, Legal Notices": "Ambassade de la République démocratique du Congo, Mentions légales",
    "Except as expressly granted in these notices, no licence or right is granted to you in respect of any intellectual property of the Embassy or of the Democratic Republic of the Congo. All rights not expressly granted are reserved.": "Sauf mention expresse dans les présentes mentions, aucune licence ni aucun droit ne vous est accordé sur la propriété intellectuelle de l’Ambassade ou de la République démocratique du Congo. Tous les droits non expressément accordés sont réservés.",
    "If you believe that any content on the Site infringes your rights, or if you wish to send a legal notice to the Embassy, please contact our legal correspondence office with sufficient detail to identify the material concerned and the nature of your request:": "Si vous estimez qu’un contenu du Site porte atteinte à vos droits, ou si vous souhaitez adresser une notification juridique à l’Ambassade, veuillez contacter notre bureau de correspondance juridique en fournissant des précisions suffisantes pour identifier le contenu concerné et la nature de votre demande :",
    "Important legal notices governing the information published on the website of the Embassy of the Democratic Republic of the Congo.": "Mentions légales importantes régissant les informations publiées sur le site web de l’Ambassade de la République démocratique du Congo.",
    "Information published on the Site concerning visas, passports, document legalization, travel and entry requirements is provided for general guidance and is": "Les informations publiées sur le Site concernant les visas, les passeports, la légalisation de documents, les voyages et les conditions d’entrée sont fournies à titre indicatif général et sont",
    "Nothing on the Site or in these notices shall be construed as a waiver, in whole or in part, express or implied, of the privileges and immunities enjoyed by the Embassy, its premises, property, archives and personnel under the Vienna Convention on Diplomatic Relations (1961), customary international law, or any applicable agreement. All such privileges and immunities are expressly reserved.": "Rien sur le Site ni dans les présentes mentions ne saurait être interprété comme une renonciation, totale ou partielle, expresse ou implicite, aux privilèges et immunités dont jouissent l’Ambassade, ses locaux, ses biens, ses archives et son personnel en vertu de la Convention de Vienne sur les relations diplomatiques (1961), du droit international coutumier ou de tout accord applicable. L’ensemble de ces privilèges et immunités est expressément réservé.",
    "Nothing on this Site constitutes legal, immigration, financial, travel or other professional advice, and it should not be relied upon as such. The Content is not a substitute for advice from a qualified professional or for official guidance from the competent authorities. You should obtain appropriate advice before taking, or refraining from taking, any action on the basis of the Content.": "Aucun élément du Site ne constitue un conseil juridique, migratoire, financier, en matière de voyage ou tout autre conseil professionnel, et ne doit pas être considéré comme tel. Le Contenu ne saurait remplacer l’avis d’un professionnel qualifié ni les orientations officielles des autorités compétentes. Il vous appartient d’obtenir un avis approprié avant d’entreprendre, ou de vous abstenir d’entreprendre, toute action sur la base du Contenu.",
    "seal and coat of arms of the Embassy, and the flag, national emblem and other official symbols of the Democratic Republic of the Congo": "le sceau et les armoiries de l’Ambassade, ainsi que le drapeau, l’emblème national et les autres symboles officiels de la République démocratique du Congo",
    "subject to change without notice": "susceptibles d’être modifiées sans préavis",
    "The Content is provided on an \"as is\" and \"as available\" basis. Official requirements, fees, procedures and timelines change from time to time and may not be reflected immediately on the Site. Any reliance you place on the Content is therefore strictly at your own risk, and you should always confirm critical information with the Consular Section before acting.": "Le Contenu est fourni « en l’état » et « selon sa disponibilité ». Les exigences officielles, les frais, les procédures et les délais évoluent périodiquement et peuvent ne pas être reflétés immédiatement sur le Site. Toute confiance que vous accordez au Contenu relève donc strictement de votre propre responsabilité, et il vous appartient de toujours confirmer les informations essentielles auprès de la Section consulaire avant d’agir.",
    "The following notices govern the use of information published on this website. By using the Site you acknowledge and accept these disclaimers, which should be read together with our": "Les mentions suivantes régissent l’utilisation des informations publiées sur ce site web. En utilisant le Site, vous reconnaissez et acceptez ces clauses de non-responsabilité, qui doivent être lues conjointement avec notre",
    "The information contained on this website is provided by the Embassy of the Democratic Republic of the Congo in Washington, D.C. for general information and reference purposes only. While we endeavour to keep the information current and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability of the Site or the information it contains.": "Les informations figurant sur ce site web sont fournies par l’Ambassade de la République démocratique du Congo à Washington, D.C. à titre d’information générale et de référence uniquement. Bien que nous nous efforcions de maintenir ces informations à jour et exactes, nous ne formulons aucune déclaration ni garantie d’aucune sorte, expresse ou implicite, quant à l’exhaustivité, l’exactitude, la fiabilité, l’adéquation ou la disponibilité du Site ou des informations qu’il contient.",
    "These notices are governed by and construed in accordance with the laws of the District of Columbia and the applicable laws of the United States, without prejudice to the diplomatic privileges and immunities referred to above.": "Les présentes mentions sont régies et interprétées conformément aux lois du District de Columbia et aux lois applicables des États-Unis, sans préjudice des privilèges et immunités diplomatiques mentionnés ci-dessus.",
    "This Site may contain links to external websites that are not provided or maintained by, or in any way affiliated with, the Embassy. The Embassy does not guarantee the accuracy, relevance, timeliness or completeness of any information on these external websites, and the inclusion of any link does not imply endorsement. You access linked third-party sites entirely at your own risk.": "Ce Site peut contenir des liens vers des sites web externes qui ne sont ni fournis, ni maintenus par l’Ambassade, ni affiliés à celle-ci de quelque manière que ce soit. L’Ambassade ne garantit ni l’exactitude, ni la pertinence, ni l’actualité, ni l’exhaustivité des informations figurant sur ces sites web externes, et l’inclusion d’un lien n’implique aucun aval. Vous accédez aux sites tiers liés entièrement à vos propres risques.",
    "To the fullest extent permitted by applicable law, in no event shall the Embassy, its officials, employees or agents be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits, arising out of or in connection with the use of this Site or reliance on its Content.": "Dans toute la mesure permise par le droit applicable, l’Ambassade, ses représentants, ses employés ou ses agents ne sauraient en aucun cas être tenus responsables de toute perte ou de tout dommage, y compris, sans limitation, toute perte ou tout dommage indirect ou consécutif, ou toute perte ou tout dommage quelconque résultant de la perte de données ou de bénéfices, découlant de l’utilisation de ce Site ou de la confiance accordée à son Contenu, ou lié à ceux-ci.",
    "To the fullest extent permitted by applicable law, the Embassy disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the Site will be available without interruption, that it will be free of errors or defects, or that the Site or the server that makes it available are free of viruses or other harmful components.": "Dans toute la mesure permise par le droit applicable, l’Ambassade décline toute garantie, expresse ou implicite, y compris, mais sans s’y limiter, les garanties implicites de qualité marchande, d’adéquation à un usage particulier et d’absence de contrefaçon. Nous ne garantissons pas que le Site sera disponible sans interruption, qu’il sera exempt d’erreurs ou de défauts, ni que le Site ou le serveur qui le met à disposition sont exempts de virus ou d’autres composants nuisibles.",
    "Unless otherwise stated, the Embassy or its licensors own the intellectual-property rights in all material on the Site. All such rights are reserved. The": "Sauf indication contraire, l’Ambassade ou ses concédants de licence détiennent les droits de propriété intellectuelle sur l’ensemble des éléments du Site. Tous ces droits sont réservés. Le",
    "Unofficial demo, this website is a demonstration prototype. These notices illustrate the design of a diplomatic mission's website and do not constitute a live legal instrument of the Democratic Republic of the Congo or any government.": "Démonstration non officielle : ce site web est un prototype de démonstration. Les présentes mentions illustrent la conception du site web d’une mission diplomatique et ne constituent pas un instrument juridique en vigueur de la République démocratique du Congo ni d’aucun gouvernement.",
    "You may view, download and print extracts from the Site for personal, non-commercial reference, provided that the source is acknowledged and that no copyright, trademark or other proprietary notice is removed or altered. Any other use, including systematic reproduction, redistribution, or commercial exploitation of the Content, requires the prior written consent of the Embassy.": "Vous pouvez consulter, télécharger et imprimer des extraits du Site à des fins de référence personnelle et non commerciale, à condition que la source soit mentionnée et qu’aucune mention de droit d’auteur, de marque ou tout autre avis de propriété ne soit supprimé ou modifié. Toute autre utilisation, y compris la reproduction systématique, la redistribution ou l’exploitation commerciale du Contenu, requiert le consentement écrit préalable de l’Ambassade.",
  };

  var LS_KEY = "emb-lang";
  var current = (function () { try { return localStorage.getItem(LS_KEY) || "en"; } catch (e) { return "en"; } })();
  // decorative trailing tokens that may follow a label (arrows, ticker middot)
  var TAIL = /^([\s\S]*?)(\s*[→↓↑▾·])$/; // -> down up small-triangle middot

  function lookup(raw) {
    var norm = raw.replace(/\s+/g, " ").trim();
    if (!norm) return null;
    if (Object.prototype.hasOwnProperty.call(FR, norm)) return FR[norm];
    var m = norm.match(TAIL);
    if (m && Object.prototype.hasOwnProperty.call(FR, m[1].trim())) return FR[m[1].trim()] + m[2];
    return null;
  }

  function eachTextNode(root, fn) {
    if (!root || !root.ownerDocument) {
      if (root && root.nodeType === 3) { fn(root); return; }
    }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p || !p.nodeName) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest(".lang-wrap")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node, list = [];
    while ((node = walker.nextNode())) list.push(node);
    list.forEach(fn);
  }

  var observer = null;
  var translated = []; // text nodes we changed (carry .__en = original)

  var phTranslated = []; // [placeholder] elements we changed (carry .__enPh)
  function placeholders(root) {
    var nodes = root.querySelectorAll ? root.querySelectorAll("[placeholder]") : [];
    nodes.forEach(function (el) {
      if (el.__enPh !== undefined || el.closest(".lang-wrap")) return;
      var fr = lookup(el.getAttribute("placeholder"));
      if (fr === null) return;
      el.__enPh = el.getAttribute("placeholder");
      el.setAttribute("placeholder", fr);
      phTranslated.push(el);
    });
  }

  function toFrench(root) {
    eachTextNode(root, function (n) {
      if (n.__en !== undefined) return;            // already handled
      var fr = lookup(n.nodeValue);
      if (fr === null) return;
      var lead = n.nodeValue.match(/^\s*/)[0];
      var trail = n.nodeValue.match(/\s*$/)[0];
      n.__en = n.nodeValue;
      n.nodeValue = lead + fr + trail;
      translated.push(n);
    });
    if (root && root.querySelectorAll) placeholders(root);
  }

  function toEnglish() {
    translated.forEach(function (n) { if (n.__en !== undefined) { n.nodeValue = n.__en; n.__en = undefined; } });
    translated = [];
    phTranslated.forEach(function (el) { if (el.__enPh !== undefined) { el.setAttribute("placeholder", el.__enPh); el.__enPh = undefined; } });
    phTranslated = [];
  }

  function apply(lang, scope) {
    if (lang === "fr") toFrench(scope || document.body);
    else toEnglish();
    document.documentElement.lang = lang;
  }

  function setLang(lang) {
    current = lang === "fr" ? "fr" : "en";
    try { localStorage.setItem(LS_KEY, current); } catch (e) {}
    apply(current);
    syncControl();
  }

  var pill, menu;
  function syncControl() {
    if (pill) pill.firstChild ? (pill.childNodes[0].nodeValue = "🌐 " + (current === "fr" ? "FR" : "EN") + " ") : null;
    if (menu) menu.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-l") === current ? "true" : "false");
    });
  }

  function buildControl() {
    pill = document.querySelector(".topbar .lang") || document.querySelector(".lang");
    if (!pill) return;
    var wrap = document.createElement("span");
    wrap.className = "lang-wrap";
    pill.parentNode.insertBefore(wrap, pill);
    wrap.appendChild(pill);
    // pill content: globe + code + caret (caret kept as its own node so label updates cleanly)
    pill.textContent = "";
    pill.appendChild(document.createTextNode("🌐 EN "));
    var caret = document.createElement("span"); caret.textContent = "▾"; caret.setAttribute("aria-hidden", "true");
    pill.appendChild(caret);
    pill.setAttribute("role", "button");
    pill.tabIndex = 0;
    pill.setAttribute("aria-haspopup", "true");
    pill.setAttribute("aria-expanded", "false");
    pill.setAttribute("aria-label", "Language / Langue");

    menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.hidden = true;
    menu.innerHTML =
      '<button type="button" data-l="en">English</button>' +
      '<button type="button" data-l="fr">Français</button>';
    wrap.appendChild(menu);

    function open() { menu.hidden = false; pill.setAttribute("aria-expanded", "true"); }
    function close() { menu.hidden = true; pill.setAttribute("aria-expanded", "false"); }
    function toggle() { (menu.hidden ? open : close)(); }

    pill.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    pill.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      else if (e.key === "Escape") close();
    });
    menu.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); setLang(b.getAttribute("data-l")); close(); });
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(); });
    syncControl();
  }

  function start() {
    buildControl();
    // Let other modules (e.g. the header search's language auto-detect) request
    // a switch without reaching into this scope.
    document.addEventListener("emb:setlang", function (e) {
      var l = e && e.detail === "fr" ? "fr" : "en";
      if (l !== current) setLang(l);
    });
    if (current === "fr") apply("fr");
    // keep dynamically injected chrome (news ticker / pop-ups) translated
    observer = new MutationObserver(function (muts) {
      if (current !== "fr") return;
      observer.disconnect();
      muts.forEach(function (m) {
        m.addedNodes && m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) toFrench(n);
          else if (n.nodeType === 3 && n.__en === undefined) {
            var fr = lookup(n.nodeValue);
            if (fr !== null) { n.__en = n.nodeValue; n.nodeValue = fr; translated.push(n); }
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

/* ---- Hero / page-head photo slideshow (auto-updating) ---------------------
   Pulls every image in public/img/image via the /hero-photos manifest, so any
   photo dropped into that folder appears automatically with no rebuild, and
   crossfades them behind the home hero and every interior page-head. Images
   are loaded lazily (only the current + next slide) to stay light, and the
   page's existing background is kept as a fallback if the manifest can't be
   reached (e.g. fully static hosting). ------------------------------------- */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Where slides go: the home hero's existing layer, plus an injected layer
  // behind each interior page-head's scrim.
  function targets() {
    var list = [];
    var hero = document.querySelector(".hero-slides");
    if (hero) list.push({ box: hero, ms: 7000 });
    document.querySelectorAll(".phead").forEach(function (ph) {
      if (ph.hasAttribute("data-hero-static")) return;   // keeps its own background
      if (ph.querySelector(".phead-slides")) return;
      var box = document.createElement("div");
      box.className = "phead-slides";
      ph.insertBefore(box, ph.firstChild);
      list.push({ box: box, ms: 7000 });
    });
    return list;
  }

  function run(box, photos, ms) {
    box.innerHTML = "";
    var slides = photos.map(function (src, i) {
      var d = document.createElement("div");
      d.className = "hero-slide" + (i === 0 ? " active" : "");
      box.appendChild(d);
      return { el: d, src: src, on: false };
    });
    var load = function (i) {
      var s = slides[(i + slides.length) % slides.length];
      if (s && !s.on) { s.el.style.backgroundImage = "url('" + s.src + "')"; s.on = true; }
    };
    load(0); load(1);                       // current + next only (lazy)
    if (slides.length < 2 || reduce) return;
    var si = 0;
    setInterval(function () {
      slides[si].el.classList.remove("active");
      si = (si + 1) % slides.length;
      load(si); load(si + 1);
      slides[si].el.classList.add("active");
    }, ms);
  }

  function start() {
    var spots = targets();
    if (!spots.length) return;
    fetch("/hero-photos", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (photos) {
        if (!Array.isArray(photos) || !photos.length) return; // keep existing bg
        spots.forEach(function (s) { run(s.box, shuffle(photos.slice()), s.ms); });
      })
      .catch(function () {}); // offline / static host -> existing bg stays
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

/* ---- Booking form stepper: highlight the current step as the visitor moves
   through the form's sections (focus-driven). ---------------------------- */
(function () {
  "use strict";
  var stepper = document.querySelector(".bk-stepper");
  var form = document.querySelector(".booking-form-wrap form");
  if (!stepper || !form) return;
  var steps = Array.prototype.slice.call(stepper.querySelectorAll(".bk-st"));
  var fieldsets = Array.prototype.slice.call(form.querySelectorAll(".bk-step"));
  if (!steps.length || !fieldsets.length) return;

  function setActive(i) {
    steps.forEach(function (s, idx) {
      s.classList.toggle("active", idx === i);
      s.classList.toggle("done", idx < i);
    });
  }
  form.addEventListener("focusin", function (e) {
    var fs = e.target.closest && e.target.closest(".bk-step");
    if (!fs) return;
    var i = fieldsets.indexOf(fs);
    if (i >= 0) setActive(i);
  });
})();

/* President portrait fallback (CSP-clean; replaces the former inline onerror).
   Tries president.png/webp/jpeg in turn, then reveals the embassy seal. */
(function () {
  var imgs = document.querySelectorAll(".hos-front img");
  for (var i = 0; i < imgs.length; i++) {
    (function (img) {
      function fallback() {
        var exts = ["png", "webp", "jpeg"], n = +(img.dataset.n || 0);
        if (n < exts.length) { img.dataset.n = n + 1; img.src = "/embassy-preview/img/image/president." + exts[n]; }
        else { img.style.display = "none"; if (img.nextElementSibling) img.nextElementSibling.style.display = "block"; }
      }
      img.addEventListener("error", fallback);
      if (img.complete && img.naturalWidth === 0) fallback(); // already failed before this ran
    })(imgs[i]);
  }
})();

/* Head of State portrait: tap / click (or Enter/Space) flips the medallion
   between the President's photo and the embassy seal, on every page it appears. */
(function () {
  var cards = document.querySelectorAll(".hos-photo");
  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      var flip = card.querySelector(".hos-flip");
      if (!flip) return;
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Flip the portrait to reveal the national seal");
      function toggle() {
        flip.style.animation = "none"; // stop the one-time intro spin so taps respond instantly
        flip.classList.toggle("flipped");
      }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    })(cards[i]);
  }
})();
