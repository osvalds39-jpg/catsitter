/* =============================================================
   Conteúdo renderizado a partir de data/*.js
   ============================================================= */
(function () {
  'use strict';

  var DATA = window.CATSITTER_DATA || {};
  var POSTS = window.CATSITTER_POSTS || [];
  var TESTIMONIALS = window.CATSITTER_TESTIMONIALS || [];

  /* ---------- helpers ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function picture(src, webp, alt, className, width, height) {
    var pic = document.createElement('picture');
    if (webp) {
      var source = document.createElement('source');
      source.srcset = webp;
      source.type = 'image/webp';
      pic.appendChild(source);
    }
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (className) img.className = className;
    if (width) img.width = width;
    if (height) img.height = height;
    pic.appendChild(img);
    return pic;
  }

  function formatDate(value) {
    if (!value) return '';
    var parts = String(value).split('-');
    if (parts.length !== 3) return value;
    var months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return Number(parts[2]) + ' de ' + months[Number(parts[1]) - 1] + ' de ' + parts[0];
  }

  function initials(name) {
    var parts = String(name || '?')
      .trim()
      .split(/\s+/)
      .slice(0, 2);
    return parts
      .map(function (p) {
        return p.charAt(0).toUpperCase();
      })
      .join('');
  }

  /* ---------- preços ---------- */
  function renderPrices() {
    var box = document.getElementById('price-list');
    if (!box) return;

    var prices = DATA.prices || [];

    if (!prices.length) {
      var empty = el('div', 'price-empty');
      empty.appendChild(
        el(
          'p',
          null,
          'Os valores dependem do tempo de visita e da quantidade de gatos. Envie seu pedido que eu retorno com o valor exato.'
        )
      );
      var link = el('a', 'btn btn--ghost', 'Pedir valores pelo WhatsApp');
      link.setAttribute('href', 'https://wa.me/' + String(DATA.whatsapp || '').replace(/\D/g, ''));
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      empty.appendChild(link);
      box.appendChild(empty);
      return;
    }

    prices.forEach(function (item) {
      var card = el('div', 'price' + (item.featured ? ' price--destaque' : ''));
      card.appendChild(el('span', 'price__label', item.label));
      card.appendChild(el('span', 'price__value', item.price));
      if (item.note) card.appendChild(el('span', 'price__note', item.note));
      if (item.featured) card.appendChild(el('span', 'price__flag', 'Mais pedido'));
      box.appendChild(card);
    });
  }

  /* ---------- galeria ---------- */
  var galleryItems = [];

  function renderGallery() {
    var box = document.getElementById('gallery');
    if (!box) return;

    var items = DATA.gallery || [];
    galleryItems = items;

    items.forEach(function (item, index) {
      var button = el('button', 'gallery__item');
      button.type = 'button';
      button.setAttribute('aria-label', 'Ampliar: ' + (item.caption || item.alt || 'foto da visita'));
      button.appendChild(picture(item.src, item.webp, item.alt, '', 1000, 750));

      var badge = el('span', 'gallery__badge');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        item.type === 'video'
          ? 'M8 5v14l11-7L8 5Z'
          : 'M4 7h3l1.5-2h7L17 7h3v12H4V7Zm8 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z'
      );
      svg.appendChild(path);
      badge.appendChild(svg);
      badge.appendChild(document.createTextNode(item.type === 'video' ? 'Vídeo da visita' : 'Foto da visita'));
      button.appendChild(badge);

      button.addEventListener('click', function () {
        openLightbox(index);
      });

      box.appendChild(button);
    });
  }

  /* ---------- lightbox ---------- */
  var lightboxIndex = 0;

  function openLightbox(index) {
    var dialog = document.getElementById('lightbox');
    var media = document.getElementById('lightbox-media');
    var caption = document.getElementById('lightbox-caption');
    if (!dialog || !media || !galleryItems.length) return;

    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[lightboxIndex];

    media.innerHTML = '';

    if (item.type === 'video' && /\.(mp4|webm)$/i.test(item.src || '')) {
      var video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.poster = item.webp || '';
      media.appendChild(video);
    } else {
      media.appendChild(picture(item.src, item.webp, item.alt, '', 1000, 750));
    }

    caption.textContent = item.caption || '';

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeLightbox() {
    var dialog = document.getElementById('lightbox');
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  function bindLightbox() {
    var dialog = document.getElementById('lightbox');
    if (!dialog) return;

    var close = dialog.querySelector('[data-lightbox-close]');
    var prev = dialog.querySelector('[data-lightbox-prev]');
    var next = dialog.querySelector('[data-lightbox-next]');

    if (close) close.addEventListener('click', closeLightbox);
    if (prev) prev.addEventListener('click', function () { openLightbox(lightboxIndex - 1); });
    if (next) next.addEventListener('click', function () { openLightbox(lightboxIndex + 1); });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeLightbox();
    });

    document.addEventListener('keydown', function (event) {
      if (!dialog.open) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
      if (event.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
    });
  }

  /* ---------- feed de atualizações ---------- */
  function renderFeed() {
    var box = document.getElementById('feed');
    if (!box) return;

    if (!POSTS.length) {
      box.appendChild(el('p', 'muted', 'Ainda não há atualizações publicadas. Volte em breve.'));
      return;
    }

    var types = { visita: 'Visita', depoimento: 'Depoimento', artigo: 'Artigo' };

    POSTS.forEach(function (post) {
      var card = el('article', 'post');

      if (post.cover) {
        card.appendChild(picture(post.cover, post.webp, post.alt || post.title || '', 'post__cover', 1000, 563));
      }

      var body = el('div', 'post__body');

      var meta = el('div', 'post__meta');
      meta.appendChild(el('span', 'post__type', types[post.type] || 'Atualização'));
      meta.appendChild(document.createTextNode(formatDate(post.date)));
      body.appendChild(meta);

      body.appendChild(el('h4', 'post__title', post.title));
      body.appendChild(el('p', 'post__text', post.body));

      if (post.placeholder) {
        body.appendChild(el('span', 'post__flag', 'Conteúdo de exemplo'));
      }

      if (post.tags && post.tags.length) {
        var tags = el('div', 'chips mt-sm');
        post.tags.forEach(function (tag) {
          tags.appendChild(el('span', 'tag', tag));
        });
        body.appendChild(tags);
      }

      card.appendChild(body);
      box.appendChild(card);
    });
  }

  /* ---------- depoimentos ---------- */
  function renderTestimonials() {
    var box = document.getElementById('testimonials');
    if (!box) return;

    if (!TESTIMONIALS.length) {
      box.appendChild(el('p', 'muted', 'Os depoimentos dos tutores serão publicados aqui.'));
      return;
    }

    TESTIMONIALS.forEach(function (item) {
      var card = el('article', 'testimonial');
      card.appendChild(el('p', 'testimonial__quote', item.quote));

      var who = el('div', 'testimonial__who');
      who.appendChild(el('span', 'testimonial__avatar', initials(item.name)));

      var info = el('div');
      info.appendChild(el('span', 'testimonial__name', item.name));
      info.appendChild(el('span', 'testimonial__where', item.neighborhood || 'São Paulo'));
      if (item.placeholder || !item.authorized) {
        info.appendChild(el('span', 'testimonial__flag', 'Exemplo — aguardando autorização'));
      }
      who.appendChild(info);

      card.appendChild(who);
      box.appendChild(card);
    });
  }

  /* ---------- carrossel ---------- */
  function bindCarousel() {
    var track = document.getElementById('testimonials');
    if (!track) return;

    function scrollBy(direction) {
      var card = track.querySelector('.testimonial');
      var amount = card ? card.getBoundingClientRect().width + 20 : 320;
      track.scrollBy({ left: amount * direction, behavior: 'smooth' });
    }

    var prev = document.querySelector('[data-carousel="prev"]');
    var next = document.querySelector('[data-carousel="next"]');

    if (prev) prev.addEventListener('click', function () { scrollBy(-1); });
    if (next) next.addEventListener('click', function () { scrollBy(1); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderPrices();
    renderGallery();
    renderFeed();
    renderTestimonials();
    bindLightbox();
    bindCarousel();
  });
})();
