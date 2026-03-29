import type { CarouselSlide } from './sperrkonto';

const slides: CarouselSlide[] = [
  // Slide 1 — Cover
  {
    type: 'cover',
    icon: '🎓',
    title: 'Cómo <span class="cb-gold">HOMOLOGAR</span> tu título en Alemania',
    subtitle: 'Guía completa Anerkennung →',
  },
  // Slide 2 — ¿Lo necesitas?
  {
    type: 'content',
    icon: '🤔',
    title: '¿Necesitas <span class="cb-gold">homologar</span>?',
    steps: [
      { num: '⚖️', text: 'Profesión REGULADA (medicina, enfermería, derecho…) → SÍ, obligatorio' },
      { num: '💻', text: 'Profesión NO regulada (IT, marketing, diseño…) → NO obligatorio' },
      { num: '', text: 'Pero puede darte puntos para la Chancenkarte o Blue Card' },
    ],
  },
  // Slide 3 — Paso 1: Consulta Anabin
  {
    type: 'content',
    icon: '🔍',
    title: 'Consulta <span class="cb-gold">Anabin</span>',
    stepBadge: 'Paso 1',
    steps: [
      { num: '1', text: 'Entra en anabin.kmk.org' },
      { num: '2', text: 'Busca tu universidad → necesitas estatus H+' },
      { num: '3', text: 'Busca tu título → verifica la equivalencia' },
    ],
    tipCard: {
      icon: '💡',
      text: 'Si tu uni tiene <span class="cb-gold">H+</span> y tu título equivalencia directa, puede bastar para la Blue Card.',
    },
  },
  // Slide 4 — Paso 2: Autoridad competente
  {
    type: 'content',
    icon: '🏛️',
    title: 'Encuentra tu <span class="cb-gold">autoridad</span>',
    stepBadge: 'Paso 2',
    cardContent:
      'Usa el <span class="cb-gold">Anerkennungs-Finder</span> en anerkennung-in-deutschland.de (disponible en español).<br><br>Te dice exactamente a quién dirigirte según tu profesión y estado federado.',
  },
  // Slide 5 — Paso 3: Documentos
  {
    type: 'content',
    icon: '📄',
    title: 'Prepara los <span class="cb-gold">documentos</span>',
    stepBadge: 'Paso 3',
    steps: [
      { num: '1', text: 'Título universitario + expediente académico' },
      { num: '2', text: 'Traducción jurada al alemán' },
      { num: '3', text: 'Apostilla de La Haya + CV detallado' },
    ],
    tipCard: {
      icon: '',
      text: 'Coste total orientativo: <span class="cb-gold">300–1.500€</span> (tasas + traducciones)',
    },
  },
  // Slide 6 — Plazos
  {
    type: 'content',
    icon: '⏳',
    title: '¿Cuánto <span class="cb-gold">tarda</span>?',
    amountCard: {
      label: 'Plazo realista total',
      amount: '3-6',
      sub: 'meses',
      note: 'Preparar documentos: <span class="cb-gold">2-6 semanas</span><br>Evaluación oficial: <span class="cb-gold">1-3 meses</span><br>Empieza cuanto antes.',
    },
  },
  // Slide 7 — Resultados posibles
  {
    type: 'content',
    icon: '',
    title: 'Resultados <span class="cb-gold">posibles</span>',
    steps: [
      { num: '', text: 'Completo → puedes ejercer sin restricciones' },
      { num: '🔶', text: 'Parcial → 4 puntos Chancenkarte + opción Nachqualifizierung' },
      { num: '', text: 'No reconocido → poco frecuente si tu uni tiene H+' },
    ],
    tipCard: {
      icon: '',
      text: 'La mayoría obtiene al menos un <span class="cb-gold">reconocimiento parcial</span>.',
    },
  },
  // Slide 8 — CTA final
  {
    type: 'cta',
    icon: '🚀',
    title: '¿Listo para <span class="cb-gold">homologar</span> tu título?',
    ctaButtons: [
      {
        text: 'Calculadora Chancenkarte',
        sub: 'Comprueba si cumples los requisitos',
        url: 'https://rutaalemania.com/#calculadora',
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
