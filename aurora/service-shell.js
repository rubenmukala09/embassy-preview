(function () {
  "use strict";

  var header = document.querySelector("[data-service-header]");
  var footer = document.querySelector("[data-service-footer]");

  if (header) {
    header.innerHTML =
      '<div class="gov-banner"><div class="container"><span class="gov-flag" aria-hidden="true"></span><svg class="gov-seal" aria-hidden="true"><use href="#crest"/></svg><span class="gov-text">Embassy website preview — services and information under review</span><button class="gov-how" type="button" aria-expanded="false">About this preview</button></div></div>' +
      '<div class="topbar"><div class="container"><div class="ti"><span><a href="https://www.google.com/maps/search/?api=1&query=1100+Connecticut+Avenue+NW%2C+Suite+725%2C+Washington%2C+DC+20036">1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036</a></span><span><a href="tel:+12022347690">+1 (202) 234-7690</a></span><span><a href="mailto:info@ambadrcusa.org">info@ambadrcusa.org</a></span></div><div class="tr"><span class="lang">🌐 EN ▾</span></div></div></div>' +
      '<header class="site-head"><div class="container"><a class="brand" href="/embassy-preview/"><svg class="crest"><use href="#crest"/></svg><span><b>EMBASSY OF THE DRC</b><span class="brand-full">Democratic Republic of the Congo</span><span>Washington, D.C.</span></span></a><nav class="mainnav"><a href="/embassy-preview/">Home</a><a href="/embassy-preview/the-embassy.html">The Embassy</a><a href="/embassy-preview/dr-congo.html">DR Congo</a><a class="active" aria-current="page" href="/embassy-preview/consular-services.html">Consular Services</a><a href="/embassy-preview/digital-services.html">Digital Services</a><a href="/embassy-preview/news-events.html">News &amp; Events</a><a href="/embassy-preview/contact.html">Contact Us</a></nav><div class="head-cta"><a class="btn btn-gold btn-sm" href="/embassy-preview/portal.html">Appointment guidance</a></div></div></header>' +
      '<div class="announce"><div class="container"><span class="tag">Service notice</span><div class="ticker"><div class="scrolling"><a href="/embassy-preview/consular-services.html">Verify current consular instructions before visiting or sending documents.</a></div></div><a class="ann-emergency" href="tel:+12022347690">Call the Embassy</a></div></div>';
  }

  if (footer) {
    footer.innerHTML =
      '<footer class="foot"><div class="container"><div class="grid"><div><svg class="crest" aria-hidden="true"><use href="#crest"/></svg><b class="ft">EMBASSY OF THE DRC</b><span class="ft-sub">Washington, D.C.</span><p class="blurb">Serving Congolese citizens and strengthening the DRC–United States partnership.</p><div class="foot-contact"><p>1100 Connecticut Avenue NW, Suite 725, Washington, DC 20036</p><p>Tel <a href="tel:+12022347690">+1 (202) 234-7690</a> · <a href="mailto:info@ambadrcusa.org">info@ambadrcusa.org</a></p></div></div><div><h5>The Embassy</h5><a class="fl" href="/embassy-preview/the-embassy.html">About the Embassy</a><a class="fl" href="/embassy-preview/dr-congo.html">Discover the DRC</a></div><div><h5>Priority services</h5><a class="fl" href="/embassy-preview/consular-services.html">Consular Services</a><a class="fl" href="/embassy-preview/portal.html">Appointment guidance</a><a class="fl" href="/embassy-preview/contact.html">Contact Us</a></div><div><h5>Stay informed</h5><p>Read verified service notices, Embassy news and event announcements.</p><a class="btn btn-gold btn-sm" href="/embassy-preview/news-events.html">News &amp; notices</a></div></div><div class="bar"><span>© 2026 Embassy of the Democratic Republic of the Congo, Washington, D.C.</span><span class="ft-legal"><a href="/embassy-preview/terms.html">Terms</a> · <a href="/embassy-preview/privacy.html">Privacy</a> · <a href="/embassy-preview/accessibility.html">Accessibility</a></span></div></div></footer>';
  }
})();

