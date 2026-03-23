import type { CarouselSlide } from './sperrkonto';

const slides: CarouselSlide[] = [
  // Slide 1 — Cover
  {
    type: 'cover',
    icon: '🏥',
    title: '<span class="cb-gold">SEGURO MÉDICO</span> en Alemania: todo lo que necesitas saber',
    subtitle: 'Guía paso a paso →',
  },
  // Slide 2 — ¿Es obligatorio?
  {
    type: 'content',
    icon: '⚖️',
    title: '¿Es <span class="cb-gold">obligatorio</span>?',
    cardContent:
      '<span class="cb-gold">Sí, por ley.</span> No puedes registrarte, abrir cuenta bancaria ni trabajar en Alemania sin seguro médico.<br><br>Es lo primero que te pedirán en casi todos los trámites.',
  },
  // Slide 3 — Público vs Privado
  {
    type: 'content',
    icon: '🔄',
    title: '<span class="cb-gold">Público</span> vs <span class="cb-gold">Privado</span>',
    steps: [
      { num: '🏛️', text: 'Público (GKV): lo usa el 90% de la población. Cuota según tu salario.' },
      { num: '🔒', text: 'Privado (PKV): solo si ganas +69.300€/año o eres autónomo.' },
      { num: '⚠️', text: 'Volver del privado al público es muy difícil. Elige bien.' },
    ],
  },
  // Slide 4 — ¿Cuánto cuesta?
  {
    type: 'content',
    icon: '💰',
    title: '¿Cuánto <span class="cb-gold">cuesta</span>?',
    amountCard: {
      label: 'Tu parte (seguro público)',
      amount: '~280€',
      sub: 'al mes',
      note: '<span class="cb-gold">14,6% + suplemento</span> de tu salario bruto.<br>Tu empleador paga la otra mitad.',
    },
  },
  // Slide 5 — Aseguradoras populares
  {
    type: 'content',
    icon: '⭐',
    title: 'Aseguradoras <span class="cb-gold">populares</span>',
    steps: [
      { num: '1', text: 'TK (Techniker) — La más grande, buen servicio online' },
      { num: '2', text: 'AOK — Amplia red, buena atención presencial' },
      { num: '3', text: 'Barmer — Buena app, trámites digitales' },
    ],
    tipCard: {
      icon: '💡',
      text: 'Todas las GKV cubren lo mismo por ley. La diferencia está en el <span class="cb-gold">servicio y extras</span>.',
    },
  },
  // Slide 6 — Recién llegados y estudiantes
  {
    type: 'content',
    icon: '🎒',
    title: '¿Recién llegado o <span class="cb-gold">estudiante</span>?',
    cardContent:
      'Necesitas un <span class="cb-gold">seguro temporal</span> desde el primer día. <span class="cb-gold">Expatrio</span> ofrece paquetes que incluyen seguro médico junto con tu Sperrkonto.',
    affiliateLink: {
      url: 'https://www.expatrio.com/?p=rutaalemania',
      label: 'Abrir Expatrio →',
      logo: '/logos/expatrio-icon.png',
    },
  },
  // Slide 7 — ¿Qué cubre?
  {
    type: 'content',
    icon: '✅',
    title: '¿Qué <span class="cb-gold">cubre</span>?',
    steps: [
      { num: '✓', text: 'Médico general y especialistas' },
      { num: '✓', text: 'Hospital, cirugía y urgencias' },
      { num: '✓', text: 'Medicamentos (copago mínimo ~5-10€)' },
    ],
    checkmark: 'Cobertura completa desde el día 1',
  },
  // Slide 8 — CTA final
  {
    type: 'cta',
    icon: '🚀',
    title: '¿Listo para asegurar tu <span class="cb-gold">salud</span> en Alemania?',
    ctaButtons: [
      {
        text: 'Seguro + Sperrkonto con Expatrio',
        sub: 'Paquete completo para recién llegados',
        url: 'https://www.expatrio.com/?p=rutaalemania',
      },
      {
        text: 'rutaalemania.com',
        sub: 'Guía completa para emigrar',
        url: 'https://rutaalemania.com',
      },
    ],
  },
];

export default slides;
