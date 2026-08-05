(function () {
  'use strict';

  var items = [
    { index: '01', label: 'Home', href: '/embassy-preview/', match: ['/', '/index.html'] },
    { index: '02', label: 'Embassy', href: '/embassy-preview/the-embassy.html', match: ['/the-embassy.html'] },
    { index: '03', label: 'Services', href: '/embassy-preview/consular-services.html', match: ['/consular-services.html', '/digital-services.html', '/portal.html', '/account/', '/documents/', '/pay/'] },
    { index: '04', label: 'DR Congo', href: '/embassy-preview/dr-congo.html', match: ['/dr-congo.html', '/invest-in-drc.html', '/official-links.html'] },
    { index: '05', label: 'News', href: '/embassy-preview/news-events.html', match: ['/news-events.html', '/congo-shining.html', '/ambience.html'] },
    { index: '06', label: 'Contact', href: '/embassy-preview/contact.html', match: ['/contact.html'] }
  ];

  function normalizedPath() {
    var path = window.location.pathname.replace(/^\/embassy-preview/, '') || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.startsWith('/')) path = '/' + path;
    return path;
  }

  function isCurrent(item, path) {
    return item.match.some(function (candidate) {
      if (candidate === '/') return path === '/';
      if (candidate.endsWith('/')) return path === candidate;
      return path === candidate;
    });
  }

  function mount() {
    if (document.querySelector('.mobile-os-nav')) return;
    var path = normalizedPath();
    var nav = document.createElement('nav');
    nav.className = 'mobile-os-nav';
    nav.setAttribute('aria-label', 'Primary mobile navigation');
    nav.dataset.currentPath = path;

    items.forEach(function (item) {
      var link = document.createElement('a');
      link.href = item.href;
      link.dataset.index = item.index;
      link.setAttribute('aria-label', item.label);
      if (isCurrent(item, path)) link.setAttribute('aria-current', 'page');
      var label = document.createElement('span');
      label.textContent = item.label;
      link.appendChild(label);
      nav.appendChild(link);
    });

    document.body.appendChild(nav);
    document.documentElement.classList.add('mobile-os-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}());
