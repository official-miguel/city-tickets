(function () {
  // ---- Event catalogue: add or edit matches here. Times are Nairobi (+03:00). ----
  // Source: official FKF fixtures page (fkfleagues.co.ke/fixtures/kpl2627). Prices are placeholders
  // until each organiser confirms theirs. Times are Nairobi (+03:00).
  var KPL = [
    { id: "reg", name: "Regular",  note: "General entry",   price: 300 },
    { id: "std", name: "Covered",  note: "Covered seating", price: 500 },
    { id: "vip", name: "VIP",      note: "VIP stand",       price: 1000 }
  ];
  var C = "FKF Premier League";
  var EVENTS = [
    { id: 1, sport: "Football", home: "Murang'a Seal", away: "Migori Youth",   venue: "St. Sebastian Park",    city: "Murang'a", iso: "2026-11-15T13:00:00+03:00", comp: C, cats: KPL },
    { id: 2, sport: "Football", home: "APS Bomet",       away: "Mara Sugar",     venue: "Bomet Stadium",         city: "Bomet",    iso: "2027-02-21T13:00:00+03:00", comp: C, cats: KPL },
    { id: 3, sport: "Football", home: "3K FC",           away: "Tusker FC",      venue: "Embu Stadium",          city: "Embu",     iso: "2027-04-11T13:00:00+03:00", comp: C, cats: KPL },
    { id: 4, sport: "Football", home: "Ulinzi Stars",    away: "Posta Rangers",  venue: "Ulinzi Sports Complex", city: "Nairobi",  iso: "2027-04-25T13:00:00+03:00", comp: C, cats: KPL },
    { id: 5, sport: "Football", home: "KCB FC",          away: "Bandari FC",     venue: "Police Stadium",        city: "Nairobi",  iso: "2027-05-02T13:00:00+03:00", comp: C, cats: KPL },
    { id: 6, sport: "Football", home: "Ulinzi Stars",    away: "Bandari FC",     venue: "Ulinzi Sports Complex", city: "Nairobi",  iso: "2027-05-30T13:00:00+03:00", comp: C, cats: KPL },
    { id: 7, sport: "Football", home: "Mara Sugar",      away: "Kakamega Homeboyz", venue: "Green Stadium, Awendo", city: "Awendo", iso: "2027-06-27T13:00:00+03:00", comp: C, cats: KPL }
  ];
  var MAX = 8;

  var $ = function (s) { return document.querySelector(s); };
  var money = function (n) { return 'KES ' + n.toLocaleString('en-KE'); };
  var dlg = $('#dlg'), s1 = $('#step1'), s2 = $('#step2'), s3 = $('#step3');
  var list = $('#eventList');
  var state = { ev: null, cat: null, qty: 1, sport: 'All', q: '' };

  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function parts(iso) {
    var d = new Date(iso);
    // Show times as Nairobi time regardless of viewer's zone
    var n = new Date(d.getTime() + 3 * 3600000);
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return { d: pad(n.getUTCDate()), m: MON[n.getUTCMonth()], w: DAY[n.getUTCDay()], y: n.getUTCFullYear(),
             t: pad(n.getUTCHours()) + ':' + pad(n.getUTCMinutes()), dn: n.getUTCDate() };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function minPrice(e) { return Math.min.apply(null, e.cats.map(function (c) { return c.price; })); }
  function title(e) { return e.home + ' vs ' + e.away; }

  $('#yr').textContent = new Date().getFullYear();

  // Mobile menu
  var mb = document.querySelector('.menu-btn'), nav = $('#nav');
  mb.addEventListener('click', function () { mb.setAttribute('aria-expanded', nav.classList.toggle('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });

  // Upcoming only, soonest first
  var upcoming = EVENTS.filter(function (e) { return new Date(e.iso) > new Date(); })
    .sort(function (a, b) { return new Date(a.iso) - new Date(b.iso); });

  // Sport chips
  var sports = ['All'];
  upcoming.forEach(function (e) { if (sports.indexOf(e.sport) < 0) sports.push(e.sport); });
  var chips = $('#chips');
  if (sports.length < 3) chips.hidden = true;
  sports.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip' + (s === 'All' ? ' on' : ''); b.textContent = s; b.dataset.s = s;
    b.setAttribute('aria-pressed', s === 'All');
    chips.appendChild(b);
  });
  chips.addEventListener('click', function (e) {
    if (!e.target.dataset.s) return;
    state.sport = e.target.dataset.s;
    chips.querySelectorAll('.chip').forEach(function (c) {
      var on = c === e.target; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on);
    });
    render();
  });
  $('#search').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });

  function render() {
    var rows = upcoming.filter(function (e) {
      if (state.sport !== 'All' && e.sport !== state.sport) return false;
      if (!state.q) return true;
      return (title(e) + ' ' + e.venue + ' ' + e.city + ' ' + e.sport + ' ' + e.comp).toLowerCase().indexOf(state.q) > -1;
    });
    list.innerHTML = rows.map(function (e) {
      var p = parts(e.iso);
      return '<li class="fx"><div class="fx-date"><b>' + p.d + '</b><span>' + p.m + '</span><small>' + p.w + '</small></div>' +
        '<div class="fx-main"><span class="tag">' + esc(e.sport) + ' · ' + esc(e.comp) + '</span>' +
        '<h3>' + esc(e.home) + ' <em>vs</em> ' + esc(e.away) + '</h3>' +
        '<p>' + esc(e.venue) + ', ' + esc(e.city) + ' · Kick-off ' + p.t + '</p></div>' +
        '<div class="fx-buy"><span class="from">From ' + money(minPrice(e)) + '</span>' +
        '<button class="btn btn-green buy" data-id="' + e.id + '" aria-label="Buy tickets for ' + esc(title(e)) + '">Buy tickets</button></div></li>';
    }).join('');
    $('#noEv').hidden = rows.length > 0;
    $('#count').textContent = rows.length + (rows.length === 1 ? ' match' : ' matches');
  }
  render();
  injectSchema();

  // SEO: event structured data from the catalogue
  function injectSchema() {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(upcoming.map(function (e) {
      return {
        '@context': 'https://schema.org', '@type': 'SportsEvent', name: title(e), sport: e.sport, startDate: e.iso,
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Place', name: e.venue, address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'KE' } },
        offers: { '@type': 'Offer', url: 'https://www.talantacity.com/#events', price: String(minPrice(e)), priceCurrency: 'KES', availability: 'https://schema.org/InStock' }
      };
    }));
    document.head.appendChild(s);
  }

  // ---- Ticket dialog ----
  var catBox = $('#cats');
  function update() {
    $('#qty').textContent = state.qty;
    $('#total').textContent = money(state.cat.price * state.qty);
  }
  list.addEventListener('click', function (e) {
    var b = e.target.closest('.buy'); if (!b) return;
    state.ev = upcoming.filter(function (x) { return x.id == b.dataset.id; })[0];
    state.cat = state.ev.cats[0]; state.qty = 1;
    var p = parts(state.ev.iso);
    $('#dlgTitle').textContent = title(state.ev);
    $('#dlgMeta').textContent = p.w + ' ' + p.dn + ' ' + p.m + ' ' + p.y + ' · ' + p.t + ' · ' + state.ev.venue;
    catBox.innerHTML = state.ev.cats.map(function (c, i) {
      return '<label class="cat"><span><input type="radio" name="cat" value="' + c.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        c.name + '<small>' + c.note + '</small></span><b>' + money(c.price) + '</b></label>';
    }).join('');
    update(); show(1); s2.reset(); $('#err').textContent = '';
    dlg.showModal();
  });
  catBox.addEventListener('change', function (e) {
    state.cat = state.ev.cats.filter(function (c) { return c.id === e.target.value; })[0]; update();
  });
  $('#minus').onclick = function () { if (state.qty > 1) { state.qty--; update(); } };
  $('#plus').onclick = function () { if (state.qty < MAX) { state.qty++; update(); } };
  function show(n) { s1.hidden = n !== 1; s2.hidden = n !== 2; s3.hidden = n !== 3; }

  $('#toStep2').onclick = function () {
    $('#sum').textContent = title(state.ev) + ' · ' + state.qty + ' × ' + state.cat.name + ' · ' + money(state.cat.price * state.qty);
    show(2);
  };
  $('#back').onclick = function () { show(1); };
  $('#done').onclick = function () { dlg.close(); };
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  s2.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = s2.elements, err = $('#err'), bad = null;
    ['name', 'email', 'phone'].forEach(function (n) { f[n].classList.remove('bad'); });
    var name = f.name.value.trim(), email = f.email.value.trim(), phone = f.phone.value.replace(/[\s-]/g, '');
    if (name.length < 2) bad = f.name;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad = f.email;
    else if (!/^(\+?254|0)?[17]\d{8}$/.test(phone)) bad = f.phone;
    if (bad) { bad.classList.add('bad'); bad.focus(); err.textContent = 'Please check the highlighted field.'; return; }
    if (!f.terms.checked) { err.textContent = 'Please accept the terms to continue.'; return; }
    err.textContent = '';

    var p = parts(state.ev.iso);
    var ref = 'TCS-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
    $('#tMatch').textContent = title(state.ev);
    $('#tDate').textContent = p.w + ' ' + p.dn + ' ' + p.m + ' ' + p.y;
    $('#tTime').textContent = p.t;
    $('#tVenue').textContent = state.ev.venue + ', ' + state.ev.city;
    $('#tCat').textContent = state.cat.name;
    $('#tQty').textContent = state.qty;
    $('#tName').textContent = name;
    $('#tTotal').textContent = money(state.cat.price * state.qty);
    $('#tRef').textContent = ref;
    $('#tMail').textContent = email;
    drawCode($('#qr'), ref);
    show(3);
  });

  // Decorative code derived from the reference (not a standards-compliant QR)
  function drawCode(cv, text) {
    var c = cv.getContext('2d'), n = 21, s = cv.width / n, h = 2166136261;
    for (var i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    function rnd() { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }
    c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#0b3d2e';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      if ((x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)) continue;
      if (rnd() > 0.5) c.fillRect(x * s, y * s, s, s);
    }
    [[0, 0], [14, 0], [0, 14]].forEach(function (q) {
      c.fillStyle = '#0b3d2e'; c.fillRect(q[0] * s, q[1] * s, 7 * s, 7 * s);
      c.fillStyle = '#fff'; c.fillRect((q[0] + 1) * s, (q[1] + 1) * s, 5 * s, 5 * s);
      c.fillStyle = '#0b3d2e'; c.fillRect((q[0] + 2) * s, (q[1] + 2) * s, 3 * s, 3 * s);
    });
  }
})();
