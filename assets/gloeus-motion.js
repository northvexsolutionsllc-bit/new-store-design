/* ============================================================================
   GLOEUS · Motion engine  (one entrance authority, editor-safe, rule-gated)
   ----------------------------------------------------------------------------
   Rule 2  : window.__boot is the FIRST statement. One authority adds `.gloeus-in`
             after DOMContentLoaded + double-rAF + a <=350ms font grace. A tiny
             inline fallback in theme.liquid releases at 1600ms if we never boot.
   Rule 4  : viewport math uses documentElement.clientHeight — never innerHeight,
             never a "vh" string. CSS carries the svh heights.
   Rule 5  : opacity + transform only; no filter/blur touched here.
   Rule 6  : hover-only behaviours (magnetic) bind only on hover:hover+pointer:fine.
   Editor  : re-arms cleanly on shopify:section:load / :select (no dead/double).
   ========================================================================== */
window.__boot = true;

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* viewport height — Rule 4 (clientHeight, not innerHeight) */
  function vh() { return doc.documentElement.clientHeight; }

  /* ---------------------------------------------------------------- reveals */
  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    : null;

  function observeReveals(scope) {
    var els = (scope || doc).querySelectorAll('.g-reveal, .g-shimmer');
    els.forEach(function (el) {
      if (el.__grev) return;
      el.__grev = true;
      if (io) io.observe(el); else el.classList.add('is-in');
    });
  }

  /* ----------------------------------------------- scroll-scrub How-It-Works */
  var hiws = [];
  function initHiw(scope) {
    (scope || doc).querySelectorAll('.g-hiw').forEach(function (sec) {
      if (sec.__hiw) return;
      sec.__hiw = true;
      hiws.push(sec);
    });
  }
  function updateHiw() {
    if (!hiws.length) return;
    var h = vh();
    for (var i = 0; i < hiws.length; i++) {
      var sec = hiws[i];
      var rect = sec.getBoundingClientRect();
      var span = sec.offsetHeight - h;
      var p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      sec.style.setProperty('--p', p.toFixed(4));
      var dots = sec.querySelectorAll('.g-hiw-dot');
      if (dots.length) {
        var active = Math.min(dots.length - 1, Math.floor(p * dots.length + 0.0001));
        for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('on', d === active);
      }
    }
  }

  /* --------------------------------------------------- parallax (bottle etc) */
  var paras = [];
  function initPara(scope) {
    if (reduce) return;
    (scope || doc).querySelectorAll('[data-parallax]').forEach(function (el) {
      if (el.__gpara) return;
      el.__gpara = true;
      paras.push(el);
    });
  }
  function updatePara() {
    if (!paras.length) return;
    var h = vh();
    for (var i = 0; i < paras.length; i++) {
      var el = paras[i];
      var r = el.getBoundingClientRect();
      var rel = ((r.top + r.height / 2) - h / 2) / h; /* ~ -1..1 */
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      el.style.transform = 'translate3d(0,' + (rel * speed * -100).toFixed(2) + 'px,0)';
    }
  }

  /* ------------------------------------------------------------- petal drift */
  function initPetals(scope) {
    if (reduce) return;
    (scope || doc).querySelectorAll('.g-petals').forEach(function (box) {
      if (box.__gpetal) return;
      box.__gpetal = true;
      var n = parseInt(box.getAttribute('data-count'), 10) || 10;
      var frag = doc.createDocumentFragment();
      for (var i = 0; i < n; i++) {
        var p = doc.createElement('span');
        p.className = 'g-petal';
        var size = 8 + Math.random() * 16;
        p.style.left = (Math.random() * 100).toFixed(2) + '%';
        p.style.setProperty('--s', size.toFixed(1) + 'px');
        p.style.setProperty('--x', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
        p.style.setProperty('--d', (11 + Math.random() * 12).toFixed(1) + 's');
        p.style.setProperty('--delay', (-Math.random() * 16).toFixed(1) + 's');
        p.style.background = 'currentColor';
        p.style.borderRadius = '0 100% 0 100%';
        frag.appendChild(p);
      }
      box.appendChild(frag);
    });
  }

  /* --------------------------------------------------------- magnetic hover */
  function initMagnetic(scope) {
    if (!canHover || reduce) return;
    (scope || doc).querySelectorAll('.g-magnetic').forEach(function (el) {
      if (el.__gmag) return;
      el.__gmag = true;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        var my = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.setProperty('--mx', mx.toFixed(1) + 'px');
        el.style.setProperty('--my', my.toFixed(1) + 'px');
        el.classList.add('g-mag-active');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* ------------------------------------------------------- sticky ATC bar */
  function initStickyAtc() {
    var bar = doc.querySelector('[data-sticky-atc]');
    if (!bar) return;
    var anchor = doc.getElementById('gloeus-atc-anchor');
    if (anchor && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          bar.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
        });
      }, { threshold: 0 }).observe(anchor);
    }
    var add = bar.querySelector('[data-sticky-add]');
    if (add && !add.__gwired) {
      add.__gwired = true;
      add.addEventListener('click', function (ev) {
        /* commerce logic untouched: click the real product-form submit */
        var real = doc.querySelector(
          'product-form button[name="add"]:not([disabled]), product-form [type="submit"]:not([disabled])'
        );
        if (real) { ev.preventDefault(); real.click(); }
        /* else: let the anchor href fall through to the product page */
      });
    }
  }

  /* --------------------------------------------------------- boot authority */
  var released = false;
  function releaseEntrance() {
    if (released) return;
    released = true;
    root.classList.add('gloeus-in');
    /* nudge scrubbers now that layout is final */
    updateHiw();
    updatePara();
  }

  function whenReady(cb) {
    var dbl = function () { requestAnimationFrame(function () { requestAnimationFrame(cb); }); };
    if (doc.fonts && doc.fonts.ready) {
      var graced = false;
      var g = setTimeout(function () { graced = true; dbl(); }, 350); /* font grace <=350ms */
      doc.fonts.ready.then(function () { if (graced) return; clearTimeout(g); dbl(); });
    } else {
      dbl();
    }
  }

  /* ------------------------------------------------------------- scroll loop */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateHiw(); updatePara(); ticking = false; });
  }

  /* ------------------------------------------------------------------ arming */
  function arm(scope) {
    observeReveals(scope);
    initHiw(scope);
    initPara(scope);
    initPetals(scope);
    initMagnetic(scope);
  }

  function boot() {
    try {
      arm(doc);
      initStickyAtc();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { updateHiw(); updatePara(); }, { passive: true });
      updateHiw();
      updatePara();
      whenReady(releaseEntrance);
    } catch (err) {
      /* never strand content: force full reveal */
      root.classList.add('gloeus-in', 'gloeus-allin');
      if (window.console) console.warn('[gloeus] motion boot failed, revealed all:', err);
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  /* -------- Theme Editor: re-arm cleanly, no dead or double animation ------ */
  function onSectionLoad(e) {
    var scope = e.target || doc;
    /* entrance is already globally released (gloeus-in on <html>), so newly
       injected .g-enter elements are simply visible — never stuck, never re-run. */
    arm(scope);
    initStickyAtc();
    updateHiw();
    updatePara();
  }
  doc.addEventListener('shopify:section:load', onSectionLoad);
  doc.addEventListener('shopify:section:select', onSectionLoad);
})();
