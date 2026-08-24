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
    document.querySelectorAll('[style*="background-image"], [style*="--ed-photo"]').forEach(function (el) {
      var raw = el.getAttribute('style') || '';
      var re = /url\(\s*['"]?([^'")]+?)['"]?\s*\)/g, m;
      while ((m = re.exec(raw))) urls.push(m[1]);
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
