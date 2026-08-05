(function () {
  "use strict";

  const EVENTS = [
    { id:"new-year", month:1, day:1, type:"society", en:"New Year’s Day", fr:"Jour de l’An", den:"The first legal holiday of the calendar year.", dfr:"Le premier jour férié légal de l’année civile." },
    { id:"martyrs", month:1, day:4, type:"memory", en:"Martyrs of Independence Day", fr:"Journée des Martyrs de l’Indépendance", den:"National remembrance of those who advanced the struggle for independence.", dfr:"Commémoration nationale de celles et ceux qui ont fait avancer la lutte pour l’indépendance." },
    { id:"kabila", month:1, day:16, type:"memory", en:"Laurent-Désiré Kabila National Heroes Day", fr:"Journée du héros national Laurent-Désiré Kabila", den:"National remembrance of President Laurent-Désiré Kabila.", dfr:"Commémoration nationale du Président Laurent-Désiré Kabila." },
    { id:"lumumba", month:1, day:17, type:"memory", en:"Patrice Emery Lumumba National Heroes Day", fr:"Journée du héros national Patrice Emery Lumumba", den:"National remembrance of independence leader Patrice Emery Lumumba.", dfr:"Commémoration nationale du leader de l’indépendance Patrice Emery Lumumba." },
    { id:"kimbangu", month:4, day:6, type:"culture", en:"Simon Kimbangu and African Consciousness Day", fr:"Journée du combat de Simon Kimbangu et de la conscience africaine", den:"A legal holiday honoring Simon Kimbangu’s struggle and African consciousness.", dfr:"Jour férié légal honorant le combat de Simon Kimbangu et la conscience africaine." },
    { id:"labour", month:5, day:1, type:"society", en:"Labour Day", fr:"Fête du Travail", den:"National observance of work, dignity and social progress.", dfr:"Célébration nationale du travail, de la dignité et du progrès social." },
    { id:"armed-forces", month:5, day:17, type:"state", en:"Armed Forces Day", fr:"Journée des Forces Armées", den:"National observance honoring the Armed Forces of the DRC.", dfr:"Commémoration nationale en hommage aux Forces armées de la RDC." },
    { id:"independence", month:6, day:30, type:"state", en:"Independence Day", fr:"Journée de l’Indépendance", den:"The DRC commemorates independence proclaimed on 30 June 1960.", dfr:"La RDC commémore l’indépendance proclamée le 30 juin 1960." },
    { id:"parents", month:8, day:1, type:"society", en:"Parents’ Day", fr:"Fête des Parents", den:"A national day honoring parents, family and intergenerational bonds.", dfr:"Une journée nationale dédiée aux parents, à la famille et aux liens intergénérationnels." },
    { id:"christmas", month:12, day:25, type:"culture", en:"Christmas Day", fr:"Noël", den:"Christmas is observed as a legal holiday across the DRC.", dfr:"Noël est observé comme jour férié légal sur toute l’étendue de la RDC." }
  ];

  const SOURCE = "https://acp.cd/nation/combat-de-simon-kimbangu-le-6-avril-decrete-jour-ferie-legal-en-rdc/";
  const currentYear = new Date().getFullYear();
  const utcDate = (year, event) => new Date(Date.UTC(year, event.month - 1, event.day));
  const dayStart = () => { const n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); };
  const lang = () => document.documentElement.lang === "fr" || (() => { try { return localStorage.getItem("emb-lang") === "fr"; } catch (_) { return false; } })();
  const locale = () => lang() ? "fr-CD" : "en-US";
  const text = (en, fr) => lang() ? fr : en;
  const name = event => lang() ? event.fr : event.en;
  const description = event => lang() ? event.dfr : event.den;
  const iso = date => date.toISOString().slice(0, 10);
  const daysUntil = date => Math.max(0, Math.ceil((date.getTime() - dayStart()) / 86400000));
  const dateLabel = date => new Intl.DateTimeFormat(locale(), { weekday:"long", month:"long", day:"numeric", year:"numeric", timeZone:"UTC" }).format(date);
  const monthLabel = date => new Intl.DateTimeFormat(locale(), { month:"long", timeZone:"UTC" }).format(date);
  const monthShort = date => new Intl.DateTimeFormat(locale(), { month:"short", timeZone:"UTC" }).format(date).replace(".", "").toUpperCase();
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

  function localizeStatic(root) {
    root.querySelectorAll("[data-en][data-fr]").forEach(element => {
      element.textContent = lang() ? element.dataset.fr : element.dataset.en;
    });
  }

  function nextOccurrence() {
    const today = dayStart();
    const candidates = [];
    [currentYear, currentYear + 1].forEach(year => EVENTS.forEach(event => candidates.push({ event, date:utcDate(year, event) })));
    return candidates.filter(item => item.date.getTime() >= today).sort((a,b) => a.date - b.date)[0];
  }

  function typeLabel(type) {
    const labels = {
      memory:["Nation & memory","Nation et mémoire"], culture:["Culture & heritage","Culture et patrimoine"],
      society:["Society & family","Société et famille"], state:["State & service","État et service"]
    };
    return text(labels[type][0], labels[type][1]);
  }

  function renderFull(root) {
    let selectedYear = Number(root.querySelector("[data-annual-year]")?.value || currentYear);
    let selectedType = root.dataset.filter || "all";
    const next = nextOccurrence();
    const nextName = root.querySelector("[data-next-name]");
    const nextDate = root.querySelector("[data-next-date]");
    const nextCount = root.querySelector("[data-next-count]");
    if (nextName) nextName.textContent = name(next.event);
    if (nextDate) nextDate.textContent = dateLabel(next.date);
    if (nextCount) {
      const count = daysUntil(next.date);
      nextCount.innerHTML = count === 0 ? `<b>${text("Today","Aujourd’hui")}</b>` : `<b>${count}</b> ${text(count === 1 ? "day away" : "days away", count === 1 ? "jour restant" : "jours restants")}`;
    }

    const yearSelect = root.querySelector("[data-annual-year]");
    if (yearSelect && !yearSelect.options.length) {
      for (let year = currentYear - 1; year <= currentYear + 3; year++) {
        const option = document.createElement("option"); option.value = year; option.textContent = String(year); if (year === currentYear) option.selected = true; yearSelect.appendChild(option);
      }
      selectedYear = currentYear;
      yearSelect.addEventListener("change", () => renderFull(root));
    }

    const currentLabel = root.querySelector("[data-current-year]");
    if (currentLabel) currentLabel.textContent = String(selectedYear);
    const calendar = root.querySelector("[data-annual-calendar]");
    if (!calendar) return;
    const visible = EVENTS.filter(event => selectedType === "all" || event.type === selectedType);
    const groups = new Map();
    visible.forEach(event => { if (!groups.has(event.month)) groups.set(event.month, []); groups.get(event.month).push(event); });
    const today = dayStart();
    calendar.innerHTML = Array.from(groups.entries()).map(([month, events]) => {
      const probe = utcDate(selectedYear, events[0]);
      const items = events.map(event => {
        const date = utcDate(selectedYear, event); const past = date.getTime() < today; const isNext = event.id === next.event.id && selectedYear === next.date.getUTCFullYear();
        const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
        return `<article class="annual-event${past ? " is-past" : ""}${isNext ? " is-next" : ""}" data-date="${iso(date)}">
          <time class="annual-date" datetime="${iso(date)}"><b>${event.day}</b><span>${escapeHtml(monthShort(date))}</span></time>
          <div><h3>${escapeHtml(name(event))}</h3><p>${escapeHtml(description(event))}${weekend ? " " + escapeHtml(text("A separate annual notice may adjust the non-working day.","Un communiqué annuel distinct peut adapter le jour chômé.")) : ""}</p></div>
          <div class="annual-event-meta"><span class="annual-kind">${escapeHtml(typeLabel(event.type))}</span><span class="annual-state${isNext ? " next" : ""}">${isNext ? escapeHtml(text("Next observance","Prochaine commémoration")) : escapeHtml(dateLabel(date))}</span></div>
        </article>`;
      }).join("");
      return `<section class="annual-month"><h3 class="annual-month-label">${escapeHtml(monthLabel(probe))}</h3><div class="annual-month-events">${items}</div></section>`;
    }).join("") || `<p class="annual-empty">${text("No observances match this filter.","Aucune commémoration ne correspond à ce filtre.")}</p>`;

    root.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.filter === selectedType);
      button.setAttribute("aria-pressed", String(button.dataset.filter === selectedType));
      if (!button.dataset.bound) { button.dataset.bound = "true"; button.addEventListener("click", () => { root.dataset.filter = button.dataset.filter; renderFull(root); }); }
    });
  }

  function renderCompact(root) {
    const today = dayStart(); const items = [];
    [currentYear, currentYear + 1].forEach(year => EVENTS.forEach(event => { const date=utcDate(year,event); if (date.getTime() >= today) items.push({event,date}); }));
    const nextThree = items.sort((a,b) => a.date - b.date).slice(0,3);
    root.innerHTML = nextThree.map(({event,date}) => `<article class="home-annual-event"><time class="annual-date" datetime="${iso(date)}"><b>${event.day}</b><span>${escapeHtml(monthShort(date))}</span></time><div><h3>${escapeHtml(name(event))}</h3><p>${escapeHtml(dateLabel(date))}</p></div><span>${daysUntil(date)} ${escapeHtml(text(daysUntil(date) === 1 ? "day" : "days", daysUntil(date) === 1 ? "jour" : "jours"))}</span></article>`).join("");
  }

  function downloadCalendar() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Embassy DRC Preview//Annual Calendar//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:DRC Annual Observances"];
    EVENTS.forEach(event => {
      const mm=String(event.month).padStart(2,"0"), dd=String(event.day).padStart(2,"0");
      lines.push("BEGIN:VEVENT",`UID:${event.id}@embassy-preview`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${currentYear}${mm}${dd}`, `RRULE:FREQ=YEARLY;BYMONTH=${event.month};BYMONTHDAY=${event.day}`, `SUMMARY:${name(event).replace(/,/g,"\\,")}`, `DESCRIPTION:${text("Recurring legal holiday in the Democratic Republic of the Congo. Confirm annual government and Embassy notices.","Jour férié légal récurrent en République démocratique du Congo. Confirmez les avis annuels du Gouvernement et de l’Ambassade.")}`, `URL:${SOURCE}`, "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], {type:"text/calendar;charset=utf-8"});
    const url=URL.createObjectURL(blob), link=document.createElement("a"); link.href=url; link.download="drc-annual-observances.ics"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  function renderAll() {
    document.querySelectorAll("[data-localized]").forEach(localizeStatic);
    document.querySelectorAll("[data-annual-events]").forEach(renderFull);
    document.querySelectorAll("[data-annual-compact]").forEach(renderCompact);
  }

  function start() {
    renderAll();
    document.querySelectorAll("[data-download-annual]").forEach(button => button.addEventListener("click", downloadCalendar));
    new MutationObserver(mutations => { if (mutations.some(m => m.attributeName === "lang")) renderAll(); }).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
