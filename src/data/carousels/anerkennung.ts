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
      { num: '⚖️', text: 'Profesión REGULADA (medicina, enfermería, derecho…) → sí, para ejercer' },
      { num: '💻', text: 'Profesión NO regulada (IT, marketing, diseño…) → la profesión no lo exige' },
      { num: '', text: 'Pero puede darte 4 puntos para la Chancenkarte (vía de puntos)' },
    ],
    tipCard: {
      icon: '⚠️',
      text: 'Ejercer y entrar <span class="cb-gold">no son lo mismo</span>: con formación profesional, el <span class="cb-gold">visado</span> (§ 18a) exige equivalencia plena aunque tu oficio no esté regulado.',
    },
  },
  // Slide 3 — Paso 1: Consulta Anabin
  {
    type: 'content',
    icon: '🔍',
    title: 'Consulta <span class="cb-gold">Anabin</span>',
    stepBadge: 'Paso 1',
    steps: [
      { num: '1', text: 'Entra en anabin.kmk.org' },
      { num: '2', text: 'Busca tu universidad → el estatus H+ es la comprobación práctica' },
      { num: '3', text: 'Busca tu título → Anabin no emite nada: el impreso lo sacas tú' },
    ],
    tipCard: {
      icon: '💡',
      text: 'Para la Blue Card hacen falta <span class="cb-gold">tres cosas a la vez</span>: uni H+, título «Entspricht/gleichwertig», y que conste impartido por esa uni. Si falla una → Zeugnisbewertung de la ZAB.',
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
      { num: '3', text: 'Apostilla de La Haya (⚠️ no vale para todos los países) + CV detallado' },
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
      note: 'Preparar documentos: <span class="cb-gold">2-6 semanas</span><br>Evaluación oficial: <span class="cb-gold">3 meses</span> desde el expediente completo (§ 6 Abs. 3 BQFG) — <span class="cb-gold">prorrogables una vez</span>.<br>Empieza cuanto antes.',
    },
  },
  // Slide 7 — Resultados posibles
  {
    type: 'content',
    icon: '',
    title: 'Resultados <span class="cb-gold">posibles</span>',
    steps: [
      { num: '', text: 'Equivalencia PLENA → puedes ejercer sin restricciones' },
      { num: '🔶', text: 'Equivalencia PARCIAL → 4 puntos Chancenkarte + opción Nachqualifizierung' },
      { num: '📝', text: 'Con MEDIDA DE COMPENSACIÓN (curso o examen) → fue la salida más frecuente en 2024' },
    ],
    tipCard: {
      icon: '',
      text: 'El rechazo total es <span class="cb-gold">raro</span>: en torno al <span class="cb-gold">1 %</span> de las resoluciones de 2024.',
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
