import type { CarouselSlide } from './sperrkonto';

const slides: CarouselSlide[] = [
  // Slide 1 — Cover
  {
    type: 'cover',
    icon: '🇩🇪',
    title: 'Tus primeros <span class="cb-gold">30 DÍAS</span> en Alemania',
    subtitle: 'Checklist completa →',
  },
  // Slide 2 — Semana 1: Lo urgente
  {
    type: 'content',
    icon: '⚡',
    title: '<span class="cb-gold">Semana 1:</span> Lo urgente',
    cardContent:
      'Los primeros 7 días son los más críticos. Hay trámites con <span class="cb-gold">plazo legal</span> y otros que, si no los haces, <span class="cb-gold">retrasan todo lo demás</span>.',
  },
  // Slide 3 — Anmeldung
  {
    type: 'content',
    icon: '🏠',
    title: 'Haz el <span class="cb-gold">Anmeldung</span>',
    stepBadge: 'Día 2-4',
    cardContent:
      'Tienes <span class="cb-gold">14 días</span> para registrar tu domicilio en la Bürgeramt.<br><br>Sin la Meldebescheinigung <span class="cb-gold">no puedes hacer nada más</span>: ni cuenta bancaria, ni contrato, ni seguro.',
  },
  // Slide 4 — Cuenta bancaria
  {
    type: 'content',
    icon: '🏦',
    title: 'Abre <span class="cb-gold">cuenta bancaria</span>',
    stepBadge: 'Día 3-7',
    cardContent:
      'Abre <span class="cb-gold">N26</span> o <span class="cb-gold">Vivid</span> al instante desde el móvil. Para recibir tu salario, pagar alquiler y domiciliar servicios.',
    tipCard: {
      icon: '💡',
      text: 'Usa <span class="cb-gold">Wise</span> para transferir dinero desde tu país con el mejor tipo de cambio.',
    },
    affiliateLink: {
      url: 'https://wise.prf.hn/click/camref:1110lAp2W',
      label: 'Abrir Wise →',
    },
  },
  // Slide 5 — Seguro médico + Sperrkonto
  {
    type: 'content',
    icon: '🏥',
    title: 'Seguro médico y <span class="cb-gold">Sperrkonto</span>',
    stepBadge: 'Día 5-7',
    cardContent:
      'El seguro es <span class="cb-gold">obligatorio</span>. Elige TK, AOK o Barmer.<br><br>Activa tu Sperrkonto con <span class="cb-gold">Expatrio</span> para liberar los fondos mensuales.',
    affiliateLink: {
      url: 'https://www.expatrio.com?p=rutaalemania',
      label: 'Abrir Expatrio →',
    },
  },
  // Slide 6 — Semana 2: Lo importante
  {
    type: 'content',
    icon: '📋',
    title: '<span class="cb-gold">Semana 2:</span> Lo importante',
    steps: [
      { num: '1', text: 'Espera tu Steuer-ID (número fiscal)' },
      { num: '2', text: 'Empieza un curso de alemán (Lingoda)' },
      { num: '3', text: 'Pide cita en Ausländerbehörde' },
    ],
  },
  // Slide 7 — Semanas 3-4: Instálate
  {
    type: 'content',
    icon: '🏡',
    title: '<span class="cb-gold">Semanas 3-4:</span> Instálate',
    steps: [
      { num: '1', text: 'Busca piso definitivo' },
      { num: '2', text: 'Contrata internet en casa' },
      { num: '3', text: 'Aprende el reciclaje (Mülltrennung)' },
    ],
    checkmark: '¡Ya tienes la base!',
  },
  // Slide 8 — CTA final
  {
    type: 'cta',
    icon: '🚀',
    title: '¿Listo para tus primeros <span class="cb-gold">30 días</span>?',
    ctaButtons: [
      {
        text: 'Abre tu Sperrkonto con Expatrio',
        sub: 'Proceso 100% online',
        url: 'https://www.expatrio.com?p=rutaalemania',
      },
      {
        text: 'rutaalemania.com',
        sub: 'Checklist completa para emigrar',
        url: 'https://rutaalemania.com',
      },
    ],
  },
];

export default slides;
