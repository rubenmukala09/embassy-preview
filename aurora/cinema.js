/* Hero films: mount ambient video only when the visitor's settings
   invite motion. Reduced-motion and Save-Data users keep the photo
   hero untouched; everyone else gets the film once it can play. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var conn = navigator.connection;
  if (conn && conn.saveData) return;

  var mounts = document.querySelectorAll('[data-film]');
  if (!mounts.length) return;

  var wide = window.matchMedia('(min-width: 768px)').matches;

  /* Build lazily: a film mounts only once its section approaches the
     viewport, so below-the-fold films cost nothing until needed. */
  function buildFilm(mount) {
    if (mount.querySelector('video.film-layer')) return;
    var src = wide
      ? mount.getAttribute('data-film')
      : (mount.getAttribute('data-film-sm') || mount.getAttribute('data-film'));
    if (!src) return;

    var v = document.createElement('video');
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;
    v.preload = 'auto';
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.setAttribute('tabindex', '-1');
    v.className = 'film-layer';
    v.src = src;

    v.addEventListener('playing', function () {
      mount.classList.add('film-live');
    }, { once: true });

    mount.appendChild(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* photo hero remains */ });
  }

  if ('IntersectionObserver' in window) {
    var mountIo = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          buildFilm(en.target);
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '1600px 0px' });
    mounts.forEach(function (m) { mountIo.observe(m); });
  } else {
    mounts.forEach(buildFilm);
  }

  /* Opened in a background tab? Resume when it becomes visible. */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    mounts.forEach(function (m) {
      var v = m.querySelector('video.film-layer');
      if (v && v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      }
    });
  });

  /* Scrolled past the hero? Stop spending the battery. */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video.film-layer');
        if (!v) return;
        if (e.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.05 });
    mounts.forEach(function (m) { io.observe(m); });
  }
})();

/* The preview notice stays tucked away. It appears when the reader
   deliberately scrolls back UP twice - a single flick will not do it -
   and then fades in and stays. */
(function () {
  var de = document.documentElement;
  if (!document.querySelector('.gov-banner')) return;

  var RUN = 60;        /* px of upward travel before a gesture counts */
  var GESTURES = 2;    /* how many separate up-scrolls are needed */
  var GAP = 220;       /* ms of stillness that ends one gesture */

  var lastY = window.scrollY || de.scrollTop || 0;
  var run = 0, count = 0, idle = null, done = false;

  function endGesture() {
    idle = null;
    if (run >= RUN) {
      count++;
      if (count >= GESTURES && !done) {
        done = true;
        de.classList.add('gov-shown');
        window.removeEventListener('scroll', onScroll);
      }
    }
    run = 0;
  }

  function onScroll() {
    var y = window.scrollY || de.scrollTop || 0;
    var d = lastY - y;
    lastY = y;
    if (d > 0) {
      run += d;
      if (idle) clearTimeout(idle);
      idle = setTimeout(endGesture, GAP);
    } else if (d < -4) {
      if (idle) { clearTimeout(idle); endGesture(); }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ------------------------------------------------------------------
   Warm-up: CSS background images are only fetched when the element is
   painted, which is what made galleries and thumbnails appear late.
   Nothing here is lazy - after first paint we walk the document in
   reading order and pull every background into cache during idle
   time, so by the time a band scrolls up it is already decoded.
   ------------------------------------------------------------------ */
(function () {
  var seen = {}, queue = [];

  function collect() {
    var urls = [];
    // An image-set offers a 1x and a 2x file; fetch only the one this
    // screen will paint (phones get the 1x via editorial.css rule 67),
    // never both.
    var phone = window.matchMedia && matchMedia('(max-width: 760px)').matches;
    var want2x = !phone && (window.devicePixelRatio || 1) > 1;
    document.querySelectorAll('[style*="background-image"], [style*="--ed-photo"]').forEach(function (el) {
      var raw = el.getAttribute('style') || '';
      var re = /url\(\s*['"]?([^'")]+?)['"]?\s*\)/g, m, found = [];
      while ((m = re.exec(raw))) found.push(m[1]);
      if (raw.indexOf('image-set') !== -1) {
        var pick = found.filter(function (u) { return (u.indexOf('@2x.') !== -1) === want2x; });
        if (pick.length) found = pick;
      }
      found.forEach(function (u) { urls.push(u); });
    });
    urls.forEach(function (u) {
      if (!u || seen[u]) return;
      seen[u] = 1;
      queue.push(u);
    });
  }

  function pump(deadline) {
    while (queue.length && (!deadline || deadline.timeRemaining() > 4)) {
      var img = new Image();
      img.decoding = 'async';
      if ('fetchPriority' in img) img.fetchPriority = 'low';
      img.src = queue.shift();
    }
    if (queue.length) schedule();
  }

  function schedule() {
    if (window.requestIdleCallback) requestIdleCallback(pump, { timeout: 1200 });
    else setTimeout(function () { pump(null); }, 200);
  }

  function start() { collect(); schedule(); }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();

/* ------------------------------------------------------------------
   Live office status in the top bar. Computed in Washington time
   (America/New_York, DST-aware via Intl) so a visitor in Kinshasa or
   Paris sees the Embassy's real state, not their own clock. Wording
   stays honest: it reflects the published office hours, and the
   tooltip says holidays and closures may differ.
   ------------------------------------------------------------------ */
(function () {
  var bar = document.querySelector('.topbar .ti');
  if (!bar || !window.Intl || !Intl.DateTimeFormat) return;
  if (bar.querySelector('.emb-status')) return;

  /* Published office hours, Washington time: [open, close) in minutes. */
  var HOURS = { 1: [540, 960], 2: [540, 960], 3: [540, 960], 4: [540, 960], 5: [540, 780] };
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var FR_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  var fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) { return; }

  function nowET() {
    var p = {};
    fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var h = parseInt(p.hour, 10);
    /* Engines that ignore hour12/hourCycle still report a dayPeriod. */
    if (p.dayPeriod) { h = h % 12; if (/p/i.test(p.dayPeriod)) h += 12; }
    return { day: DAYS.indexOf(p.weekday), min: (h % 24) * 60 + parseInt(p.minute, 10) };
  }
  function fr() {
    if (document.documentElement.lang === 'fr') return true;
    try { return localStorage.getItem('emb-lang') === 'fr'; } catch (e) { return false; }
  }
  function clockEN(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12; return h12 + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + ' ' + ap; }
  function clockFR(m) { var h = Math.floor(m / 60), mm = m % 60; return h + ' h' + (mm ? ' ' + (mm < 10 ? '0' : '') + mm : ''); }

  function state() {
    var n = nowET();
    if (n.day < 0) return null;
    var today = HOURS[n.day];
    if (today && n.min >= today[0] && n.min < today[1]) return { open: true, until: today[1] };
    if (today && n.min < today[0]) return { open: false, inDays: 0, day: n.day, at: today[0] };
    for (var d = 1; d <= 7; d++) {
      var wd = (n.day + d) % 7;
      if (HOURS[wd]) return { open: false, inDays: d, day: wd, at: HOURS[wd][0] };
    }
    return null;
  }

  function text(s) {
    if (fr()) {
      if (s.open) return 'Horaires d’ouverture · jusqu’à ' + clockFR(s.until) + ' (HE)';
      var w = s.inDays === 0 ? '' : s.inDays === 1 ? 'demain ' : FR_DAYS[s.day] + ' ';
      return 'Hors horaires · reprise ' + w + 'à ' + clockFR(s.at) + ' (HE)';
    }
    if (s.open) return 'Within office hours · until ' + clockEN(s.until) + ' ET';
    var when = s.inDays === 0 ? '' : s.inDays === 1 ? 'tomorrow ' : DAYS[s.day] + ' ';
    return 'Office hours resume ' + when + clockEN(s.at) + ' ET';
  }
  function note() {
    return fr()
      ? 'Selon les horaires publi\u00e9s de l\u2019Ambassade (heure de Washington). Jours f\u00e9ri\u00e9s et fermetures peuvent diff\u00e9rer \u2014 v\u00e9rifiez avant votre visite.'
      : 'Based on the Embassy\u2019s published office hours (Washington, D.C. time). Public holidays and closures may differ \u2014 confirm before visiting.';
  }

  var chip = document.createElement('span');
  chip.className = 'emb-status';
  chip.setAttribute('data-localized', '');
  chip.innerHTML = '<i aria-hidden="true"></i><a href="/embassy-preview/contact.html"></a>';
  var link = chip.querySelector('a');
  bar.appendChild(chip);

  var last = '';
  function paint() {
    var s = state();
    if (!s) { chip.hidden = true; return; }
    var t = text(s), key = t + (fr() ? 'fr' : 'en');
    if (key === last) return;
    last = key;
    chip.hidden = false;
    chip.classList.toggle('is-open', !!s.open);
    link.textContent = t;
    link.title = note();
  }

  paint();
  setInterval(paint, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) paint(); });
  if (window.MutationObserver) new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
