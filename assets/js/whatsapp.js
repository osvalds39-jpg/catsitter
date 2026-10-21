/* =============================================================
   WhatsApp: links de contato e formulário de pedido
   ============================================================= */
(function () {
  'use strict';

  var DATA = window.CATSITTER_DATA || {};
  var NUMBER = String(DATA.whatsapp || '').replace(/\D/g, '');

  var DEFAULT_MSG = 'Olá! Vim pelo site e gostaria de saber a disponibilidade para o meu gato.';

  function waLink(message) {
    var base = 'https://wa.me/' + NUMBER;
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }

  function linkFor(el) {
    var label = el.getAttribute('data-wa-label');
    return waLink(label ? 'Olá! ' + label + '.' : DEFAULT_MSG);
  }

  /* Todos os botões de WhatsApp da página */
  function bindLinks() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.setAttribute('href', linkFor(el));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  }

  /* Mensagem montada a partir do formulário */
  function buildMessage() {
    var get = function (id) {
      var el = document.getElementById(id);
      return el && el.value.trim() ? el.value.trim() : '';
    };

    var lines = ['Olá! Gostaria de agendar visitas para o meu gato.'];

    var bairro = get('bairro');
    if (bairro) lines.push('Bairro: ' + bairro);

    var datas = get('datas');
    if (datas) lines.push('Datas: ' + datas);

    lines.push('Quantidade de gatos: ' + (get('gatos') || '1 gato'));
    lines.push('Preferência de horário: ' + (get('horario') || 'A combinar'));

    var nome = get('nome');
    if (nome) lines.push('Nome: ' + nome);

    var nec = get('necessidades');
    if (nec) lines.push('Necessidades: ' + nec);

    return lines.join('\n');
  }

  function setStatus(text) {
    var status = document.getElementById('form-status');
    if (status) status.textContent = text;
  }

  function bindForm() {
    var form = document.getElementById('form-pedido');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var url = waLink(buildMessage());
      setStatus('Abrindo o WhatsApp…');
      window.open(url, '_blank', 'noopener');
      setStatus('Se o WhatsApp não abriu, use o botão “Copiar mensagem”.');
    });

    var copy = document.getElementById('copiar-msg');
    if (!copy) return;

    copy.addEventListener('click', function () {
      var text = buildMessage();

      function done() {
        setStatus('Mensagem copiada. Cole no WhatsApp.');
        copy.textContent = 'Copiado!';
        window.setTimeout(function () {
          copy.textContent = 'Copiar mensagem';
        }, 2500);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand('copy');
          done();
        } catch (err) {
          setStatus('Não foi possível copiar. Envie pelo botão do WhatsApp.');
        }
        document.body.removeChild(area);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindLinks();
    bindForm();
  });
})();
