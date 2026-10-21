/* =============================================================
   Comportamentos da página: menu, scroll-spy, reveal, bindings
   ============================================================= */
(function () {
  'use strict';

  var DATA = window.CATSITTER_DATA || {};

  /* ---------- header ao rolar ---------- */
  function bindHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- drawer mobile ---------- */
  function bindDrawer() {
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;

    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      drawer.hidden = false;
      window.requestAnimationFrame(function () {
        drawer.classList.add('is-open');
      });
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () {
        drawer.hidden = true;
      }, 220);
      if (lastFocused) lastFocused.focus();
    }

    burger.addEventListener('click', open);

    drawer.addEventListener('click', function (event) {
      if (event.target.closest('[data-drawer-close]') || event.target.closest('a[href^="#"]')) {
        close();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992 && drawer.classList.contains('is-open')) close();
    });
  }

  /* ---------- link ativo (scroll-spy) ---------- */
  function bindScrollSpy() {
    var links = document.querySelectorAll('.nav__link, .drawer__list a');
    if (!links.length) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = document.querySelector(id);
      if (!section) return;
      if (!map[id]) {
        map[id] = [];
        sections.push({ id: id, element: section });
      }
      map[id].push(link);
    });

    function update() {
      var line = window.scrollY + window.innerHeight * 0.4;
      var current = null;

      for (var i = 0; i < sections.length; i++) {
        var top = sections[i].element.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = sections[i].id;
      }

      links.forEach(function (link) {
        link.classList.remove('is-active');
      });

      if (current) {
        (map[current] || []).forEach(function (link) {
          link.classList.add('is-active');
        });
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- reveal on scroll ---------- */
  function bindReveal() {
    var targets = document.querySelectorAll('.card, .step, .gallery__item, .post, .area-group, .price, .split > *');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) {
        t.classList.add('is-visible');
      });
      return;
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      targets.forEach(function (t) {
        t.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (!entry.isIntersecting) return;
          var delay = Math.min(index * 60, 240);
          window.setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    targets.forEach(function (target) {
      target.classList.add('reveal');
      observer.observe(target);
    });
  }

  /* ---------- bindings de configuração ---------- */
  function bindSiteData() {
    var fields = document.querySelectorAll('[data-site]');
    fields.forEach(function (node) {
      var key = node.getAttribute('data-site');
      var value = DATA[key];
      if (value == null || value === '') return;

      if (node.tagName === 'A' && key === 'email') {
        node.setAttribute('href', 'mailto:' + value);
        node.textContent = value;
      } else {
        node.textContent = value;
      }
    });

    var socials = document.querySelectorAll('[data-social]');
    socials.forEach(function (node) {
      var key = node.getAttribute('data-social');
      var url = DATA[key];
      if (!url) return;
      node.setAttribute('href', url);
      if (!/^https?:/i.test(url)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });

    var year = document.getElementById('ano');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------- ano eStats ---------- */
  function bindStats() {
    var stats = DATA.stats || [];
    if (!stats.length) return;

    var container = document.querySelector('[data-stats]');
    if (!container) return;

    stats.forEach(function (stat) {
      if (stat.value == null) return;
      var box = document.createElement('div');
      var value = document.createElement('span');
      value.className = 'stat__value';
      value.textContent = stat.value;
      var label = document.createElement('span');
      label.className = 'stat__label';
      label.textContent = stat.label;
      box.appendChild(value);
      box.appendChild(label);
      container.appendChild(box);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindHeader();
    bindDrawer();
    bindScrollSpy();
    bindReveal();
    bindSiteData();
    bindStats();
  });
})();
