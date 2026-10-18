(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var WA = 'https://wa.me/5547991545265';
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- abertura: ripas sobem e revelam a obra ---------- */
  var intro = $('#intro');
  var hero = $('#hero');
  var started = false;
  function go() {
    if (started) return;
    started = true;
    hero.classList.add('go');
  }
  function endIntro() {
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    root.classList.add('no-intro');
    try { sessionStorage.setItem('prIntro', '1'); } catch (e) {}
  }
  if (intro && !root.classList.contains('no-intro')) {
    setTimeout(go, 2250);
    setTimeout(endIntro, 3100);
    $('#introSkip').addEventListener('click', function () {
      intro.classList.add('is-skipped');
      go();
      endIntro();
    });
  } else {
    if (intro) intro.parentNode.removeChild(intro);
    go();
  }

  /* ---------- cabeçalho, botão flutuante ---------- */
  var hdr = $('#hdr'), fab = $('#fab'), ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      hdr.classList.toggle('is-solid', y > 24);
      fab.classList.toggle('is-on', y > window.innerHeight * 0.8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- ripas nas imagens da seção Obras ---------- */
  $$('.rev').forEach(function (r) {
    var n = 6, frag = doc.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = doc.createElement('span');
      s.className = 'sl';
      s.style.setProperty('--i', i);
      s.style.setProperty('--n', n);
      frag.appendChild(s);
    }
    r.appendChild(frag);
  });

  /* ---------- revelar ao rolar ---------- */
  var targets = $$('.rv, .ripas, .rev, .sec-head .ln, .orc h2 .ln');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el, i) {
      if (el.classList.contains('rv')) el.style.setProperty('--rd', (i % 3) * 0.07 + 's');
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- etapas: a linha ativa troca a imagem do palco ---------- */
  var rows = $$('.row');
  var stage = $('.stage');
  var imgs = stage ? $$('.stage__frame img') : [];
  var current = 0, busy = false, want = 0;
  function showImg(i) {
    imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
  }
  function swap(i) {
    want = i;
    if (busy || i === current) return;
    busy = true;
    stage.classList.add('cover');
    setTimeout(function () {
      current = want;
      showImg(current);
      stage.classList.remove('cover');
      setTimeout(function () {
        busy = false;
        if (want !== current) swap(want);
      }, 560);
    }, 520);
  }
  if (rows.length && 'IntersectionObserver' in window) {
    rows[0].classList.add('is-on');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = rows.indexOf(en.target);
        rows.forEach(function (r) { r.classList.toggle('is-on', r === en.target); });
        if (stage && getComputedStyle(stage).display !== 'none') swap(i);
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    rows.forEach(function (r) { rio.observe(r); });
  } else {
    rows.forEach(function (r) { r.classList.add('is-on'); });
  }

  /* ---------- vídeos: tocam só quando visíveis ---------- */
  var vids = $$('.clip video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- WhatsApp ---------- */
  var base = 'Olá! Vim pelo site da Padrão Refinatto e gostaria de um orçamento.';
  $$('[data-wa]').forEach(function (a) { a.href = WA + '?text=' + encodeURIComponent(base); a.target = '_blank'; a.rel = 'noopener'; });
  var form = $('#form');
  function join(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' e ' + list[list.length - 1];
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var amb = $$('input[name=amb]:checked', form).map(function (i) { return i.value; });
    var txt = form.elements.txt.value.trim();
    var msg = 'Olá! Vim pelo site da Padrão Refinatto e gostaria de um orçamento' + (amb.length ? ' de ' + join(amb) : '') + '.';
    if (txt) msg += '\n\n' + txt;
    window.open(WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* ---------- status de atendimento (horário de Brasília) ---------- */
  (function () {
    var el = $('#status'), label = $('span', el);
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    var open = day >= 1 && day <= 5 && mins >= 510 && mins < 1050;
    if (open) { el.classList.add('is-open'); label.textContent = 'Atendendo agora. Fecham às 17h30.'; return; }
    var when;
    if (day >= 1 && day <= 5 && mins < 510) when = 'hoje às 8h30';
    else if (day >= 1 && day <= 4) when = 'amanhã às 8h30';
    else when = 'segunda-feira às 8h30';
    label.textContent = 'Fechados agora. Sua mensagem fica salva e eles respondem ' + when + '.';
  })();
})();
