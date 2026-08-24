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
    }, { rootMargin: '700px 0px' });
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
