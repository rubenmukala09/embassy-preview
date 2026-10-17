/* ============================================================================
   PAYMENT GUIDANCE (pay/index.html): "Check a fee" helper.
   Reads the fee schedule table on the page (single source of truth), builds
   the service list from it and shows the published amount for the chosen
   service. It shows only the single published amount (no totals the
   Embassy has not published). Nothing is submitted or stored; there is no
   form element. Follows the site language switch (aurora.js sets <html lang>).
   ============================================================================ */
(function () {
  'use strict';

  var finder = document.querySelector('[data-fee-finder]');
  var table = document.querySelector('[data-fee-table]');
  if (!finder || !table) return;

  var tool = finder.querySelector('.sp-finder-tool');
  var fallback = finder.querySelector('.sp-finder-fallback');
  var select = finder.querySelector('select');
  var labelEl = finder.querySelector('[data-fee-label]');
  var amountEl = finder.querySelector('[data-fee-amount]');
  var detailEl = finder.querySelector('[data-fee-detail]');
  if (!tool || !select || !amountEl || !detailEl) return;

  var TEXT = {
    en: {
      choose: 'Choose a service',
      label: 'Published fee',
      empty: 'Choose a service to see its fee.',
      money: 'Money order, cashier’s check or certified check addressed to the Embassy; the Embassy also asks for a blank money order only. Confirm the method before you pay.',
      legal: 'Money order, certified check or company-issued check, payable in U.S. dollars to the Embassy.',
      online: 'Paid online through the Equity BCDC link sent after pre-registration on passeport.gouv.cd. The total may vary with bank charges.'
    },
    fr: {
      choose: 'Choisissez un service',
      label: 'Montant publié',
      empty: 'Choisissez un service pour afficher son montant.',
      money: 'Mandat, chèque de banque ou chèque certifié à l’ordre de l’Ambassade ; l’Ambassade demande aussi un mandat en blanc uniquement. Vérifiez le mode de paiement avant de payer.',
      legal: 'Mandat, chèque certifié ou chèque d’entreprise, libellé en dollars américains à l’ordre de l’Ambassade.',
      online: 'Paiement en ligne au moyen du lien Equity BCDC reçu après la préinscription sur passeport.gouv.cd. Le total peut varier selon les frais bancaires.'
    }
  };

  function lang() {
    return (document.documentElement.getAttribute('lang') || 'en').slice(0, 2) === 'fr' ? 'fr' : 'en';
  }

  // English: $185. French: 185 USD, as in the French body copy.
  function money(n, L) {
    return L === 'fr' ? n.toLocaleString('fr-FR') + ' USD' : '$' + n.toLocaleString('en-US');
  }

  function rowName(tr, L) {
    var cell = tr.querySelector('td[data-emb-en]');
    if (!cell) return tr.id;
    return cell.getAttribute(L === 'fr' ? 'data-emb-fr' : 'data-emb-en') || cell.textContent.trim();
  }

  function build() {
    var L = lang();
    var current = select.value;
    while (select.firstChild) select.removeChild(select.firstChild);

    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = TEXT[L].choose;
    select.appendChild(placeholder);

    Array.prototype.forEach.call(table.tBodies, function (tbody) {
      var head = tbody.querySelector('[data-group]');
      var group = document.createElement('optgroup');
      if (head) group.label = head.getAttribute(L === 'fr' ? 'data-emb-fr' : 'data-emb-en') || head.textContent.trim();
      Array.prototype.forEach.call(tbody.querySelectorAll('tr[data-fee][id]'), function (tr) {
        var opt = document.createElement('option');
        opt.value = tr.id;
        opt.textContent = rowName(tr, L);
        group.appendChild(opt);
      });
      select.appendChild(group);
    });

    select.value = current;
    if (select.value !== current) select.value = '';
    update();
  }

  function update() {
    var L = lang();
    var t = TEXT[L];
    var row = select.value ? document.getElementById(select.value) : null;

    if (!row) {
      finder.classList.remove('has-fee');
      if (labelEl) labelEl.textContent = t.label;
      amountEl.textContent = '—';
      detailEl.textContent = t.empty;
      return;
    }

    var fee = parseFloat(row.getAttribute('data-fee')) || 0;
    var route = row.getAttribute('data-route');
    finder.classList.add('has-fee');
    if (labelEl) labelEl.textContent = t.label;
    amountEl.textContent = money(fee, L);
    detailEl.textContent = route === 'online' ? t.online : (route === 'legal' ? t.legal : t.money);
  }

  select.addEventListener('change', update);

  // Rebuild labels when the site language changes.
  if ('MutationObserver' in window) {
    new MutationObserver(build).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  build();
  tool.hidden = false;
  if (fallback) fallback.hidden = true;
  finder.classList.add('is-ready');
})();
