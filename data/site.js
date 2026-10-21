/* =============================================================
   Configuração geral do site — edite aqui
   ============================================================= */
window.CATSITTER_DATA = {
  brand: 'catsitter',
  city: 'São Paulo',

  /* Contato: troque pelo número real (somente dígitos, com DDI) */
  whatsapp: '5511999999999',
  whatsappDisplay: '(11) 99999-9999',
  email: 'contato@catsitter.com.br',
  instagram: 'https://instagram.com/catsitter',
  facebook: 'https://facebook.com/catsitter',

  /* Capacidade operacional (specs/descoberta.md) */
  capacity: {
    visitsPerDay: 3,
    daysPerWeek: 5,
    maxDistanceKm: 3,
    advanceNoticeHours: 48,
  },

  /* Números exibidos na seção de destaques.
     Deixe value: null para ocultar enquanto não houver número real. */
  stats: [
    { value: 3, label: 'visitas por dia' },
    { value: 5, label: 'dias por semana' },
    { value: 3, label: 'km a partir do metrô' },
    { value: null, label: 'visitas realizadas' },
  ],

  /* -----------------------------------------------------------------
     PREÇOS — seção escondida enquanto a lista estiver vazia.
     Preencha quando os valores estiverem definidos.
     Exemplo:
     prices: [
       { id: '30min', label: 'Visita de 30 minutos', price: 'R$ 45', note: 'Alimentação e caixa de areia' },
       { id: '45min', label: 'Visita de 45 minutos', price: 'R$ 60', note: 'Inclui brincadeira e vídeo da visita', featured: true },
       { id: '60min', label: 'Visita de 1 hora', price: 'R$ 75', note: 'Ideal para gatos tímidos ou clustering', featured: true },
     ]
     ----------------------------------------------------------------- */
  prices: [],

  /* Galeria de visitas: fotos e vídeos reais.
     type: 'foto' | 'video'. Para vídeo, informe src com o arquivo em assets/video/. */
  gallery: [
    { type: 'foto', src: 'assets/img/cat-2.jpg', webp: 'assets/img/cat-2.webp', alt: 'Dois gatos brincando juntos durante a visita', caption: 'Brincadeira monitorada — cada gato no seu tempo.' },
    { type: 'foto', src: 'assets/img/cat-4.jpg', webp: 'assets/img/cat-4.webp', alt: 'Gato observing a casa pela janela', caption: 'Vigiando a janela enquanto a casa se mantém tranquila.' },
    { type: 'foto', src: 'assets/img/cat-5.jpg', webp: 'assets/img/cat-5.webp', alt: 'Gata tricolor descansando em ambiente familiar', caption: 'Ambiente preservado: o gato escolhe onde ficar.' },
    { type: 'foto', src: 'assets/img/cat-6.jpg', webp: 'assets/img/cat-6.webp', alt: 'Gato descansando após a visita', caption: 'Depois da brincadeira, o descanso do dia.' },
    { type: 'foto', src: 'assets/img/cat-1.jpg', webp: 'assets/img/cat-1.webp', alt: 'Filhote de gato junto à janela', caption: 'Filhotes pedem mais atenção — o horário é combinado com o tutor.' },
    { type: 'foto', src: 'assets/img/cat-7.jpg', webp: 'assets/img/cat-7.webp', alt: 'Dois gatos juntos no quintal', caption: 'Casas com mais de um gato são bem-vindas.' },
  ],
};
