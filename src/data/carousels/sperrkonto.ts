export interface CarouselSlide {
  type: 'cover' | 'content' | 'cta';
  icon: string;
  title: string;
  subtitle?: string;
  stepBadge?: string;
  cardContent?: string;
  amountCard?: {
    label: string;
    amount: string;
    sub: string;
    note: string;
  };
  steps?: { num: string; text: string }[];
  timeBadge?: string;
  tipCard?: { icon: string; text: string };
  affiliateLink?: { url: string; label: string; logo?: string };
  checkmark?: string;
  ctaButtons?: { text: string; sub: string; url?: string }[];
}

const slides: CarouselSlide[] = [
  // Slide 1 — Cover
  {
    type: 'cover',
    icon: '🏦',
    title: '¿Qué es el <span class="cb-gold">SPERRKONTO</span> y por qué lo necesitas?',
    subtitle: 'Guía paso a paso →',
  },
  // Slide 2 — ¿Qué es el Sperrkonto?
  {
    type: 'content',
    icon: '🔒',
    title: '¿Qué es el <span class="cb-gold">Sperrkonto</span>?',
    cardContent:
      'Es una <span class="cb-gold">cuenta bancaria bloqueada</span> que demuestra que tienes fondos suficientes para vivir en Alemania.<br><br>Es <span class="cb-gold">obligatorio</span> para obtener tu visado de estudiante o Chancenkarte.',
  },
  // Slide 3 — ¿Cuánto dinero necesitas?
  {
    type: 'content',
    icon: '💰',
    title: '¿Cuánto dinero <span class="cb-gold">necesitas</span>?',
    amountCard: {
      label: 'Importe mínimo',
      amount: '11.904€',
      sub: 'al año',
      note: 'Son <span class="cb-gold">992€/mes × 12</span>.<br>Se desbloquea mensualmente<br>una vez estés en Alemania.',
    },
  },
  // Slide 4 — Paso 1: Elige proveedor
  {
    type: 'content',
    icon: '📋',
    title: 'Elige un <span class="cb-gold">proveedor</span>',
    stepBadge: 'Paso 1',
    cardContent:
      'El proveedor más usado por hispanohablantes es <span class="cb-gold">Expatrio</span>: proceso 100% online, en español, y con soporte dedicado.',
    affiliateLink: {
      url: 'https://www.expatrio.com?p=rutaalemania',
      label: 'Abrir Expatrio →',
      logo: '/logos/expatrio-icon.png',
    },
  },
  // Slide 5 — Paso 2: Regístrate y sube documentos
  {
    type: 'content',
    icon: '📄',
    title: 'Regístrate y sube <span class="cb-gold">documentos</span>',
    stepBadge: 'Paso 2',
    steps: [
      { num: '1', text: 'Crea tu cuenta en Expatrio' },
      { num: '2', text: 'Sube tu pasaporte' },
      { num: '3', text: 'Carta de admisión (si es visado de estudiante)' },
    ],
    timeBadge: 'Tarda solo <span class="cb-gold">10-15 minutos</span>',
  },
  // Slide 6 — Paso 3: Transfiere el dinero
  {
    type: 'content',
    icon: '💸',
    title: 'Transfiere el <span class="cb-gold">dinero</span>',
    stepBadge: 'Paso 3',
    cardContent:
      'Haz la transferencia de los <span class="cb-gold">11.904€</span> a la cuenta indicada por Expatrio.',
    tipCard: {
      icon: '💡',
      text: 'Usa <span class="cb-gold">Wise</span> para ahorrar en comisiones de cambio de divisa.',
    },
    affiliateLink: {
      url: 'https://wise.prf.hn/click/camref:1110lAp2W',
      label: 'Abrir Wise →',
      logo: '/logos/wise.svg',
    },
  },
  // Slide 7 — Paso 4: Recibe tu certificado
  {
    type: 'content',
    icon: '📜',
    title: 'Recibe tu <span class="cb-gold">certificado</span>',
    stepBadge: 'Paso 4',
    cardContent:
      'Una vez recibido el dinero, Expatrio te envía el <span class="cb-gold">certificado del Sperrkonto</span>.<br><br>Este documento es el que presentas en la <span class="cb-gold">embajada</span> para tu visado.',
    checkmark: 'Listo para tu visado',
  },
  // Slide 8 — CTA final
  {
    type: 'cta',
    icon: '🚀',
    title: '¿Listo para abrir tu <span class="cb-gold">Sperrkonto</span>?',
    ctaButtons: [
      {
        text: 'Abre tu cuenta con Expatrio',
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
