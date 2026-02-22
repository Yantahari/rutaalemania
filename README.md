# RutaAlemania.com

Guía práctica para hispanohablantes que quieren trabajar en Alemania. Sitio estático construido con Astro + Tailwind CSS, desplegado en Netlify.

## Stack técnico

- **Astro** — Generador de sitios estáticos
- **Tailwind CSS** — Estilos utility-first
- **Netlify** — Hosting gratuito con CDN global
- **Markdown** — Artículos del blog

## Estructura del proyecto

```
rutaalemania/
├── public/               # Archivos estáticos (favicon, robots.txt)
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SEO.astro
│   │   ├── CalculadoraChancenkarte.astro
│   │   └── SimuladorVida.astro
│   ├── data/             # Datos JSON del simulador
│   │   └── simulator-data.json
│   ├── layouts/          # Layouts de página
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── pages/            # Páginas y rutas
│   │   ├── index.astro          # Landing page
│   │   ├── blog/                # Artículos del blog (Markdown)
│   │   ├── recursos/            # Página de recursos
│   │   ├── sobre-mi/            # Sobre Carlos
│   │   ├── impressum/           # Aviso legal (DE)
│   │   ├── datenschutz/         # Privacidad RGPD
│   │   └── disclaimer/          # Disclaimer
│   └── styles/
│       └── global.css           # Estilos globales + Tailwind
├── astro.config.mjs      # Config de Astro
├── tailwind.config.mjs   # Config de Tailwind
├── netlify.toml          # Config de deploy en Netlify
└── package.json
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Cómo añadir nuevos artículos al blog

1. Crea un archivo `.md` en `src/pages/blog/` con el nombre del slug deseado:

```
src/pages/blog/mi-nuevo-articulo.md
```

2. Añade el frontmatter obligatorio al inicio del archivo:

```markdown
---
layout: ../../layouts/BlogLayout.astro
title: "Título del artículo"
description: "Descripción breve para SEO (máx. 160 caracteres)"
date: "2026-03-15"
keywords: "palabra clave 1, palabra clave 2, palabra clave 3"
---

Aquí va el contenido del artículo en Markdown...
```

3. El artículo aparecerá automáticamente en:
   - La lista del blog (`/blog/`)
   - Los últimos artículos de la landing page
   - El sitemap XML

4. Haz commit y push. Netlify desplegará automáticamente.

## Cómo actualizar los datos del simulador

Los datos del simulador están en `src/data/simulator-data.json`. El archivo tiene tres secciones:

### Salarios por profesión y ciudad

```json
"professions": {
  "software_engineer": {
    "name": "Ingeniero/a de Software",
    "salaries": {
      "berlin": { "min": 48000, "median": 58000, "max": 75000 }
    }
  }
}
```

- Fuentes recomendadas: [Entgeltatlas](https://entgeltatlas.arbeitsagentur.de), [StepStone Gehaltsreport](https://www.stepstone.de/gehaltsreport/), [Glassdoor](https://www.glassdoor.de)
- Los valores son salarios **brutos anuales** en euros

### Costes de vida por ciudad

```json
"cities": {
  "berlin": {
    "name": "Berlín",
    "rent_1bed": 850,      // Alquiler mensual 1 habitación (Warmmiete)
    "groceries": 350,       // Alimentación mensual
    "transport": 49,         // Deutschlandticket
    "utilities": 40,         // Internet + móvil
    "misc": 200              // Otros gastos
  }
}
```

- Fuentes: [Numbeo](https://www.numbeo.com), [Immobilienscout24](https://www.immobilienscout24.de)

### Salarios medios por país (para comparación)

```json
"countries": {
  "colombia": { "name": "Colombia", "avg_professional_salary_eur": 550 }
}
```

- El valor es el salario medio **mensual neto** de un profesional en euros

### Para añadir una nueva profesión o ciudad

Añade una nueva entrada al JSON siguiendo la misma estructura. No necesitas cambiar ningún código — el simulador lee los datos dinámicamente.

## Cómo sustituir los placeholders de afiliados

Los enlaces de afiliado están marcados con placeholders en todo el proyecto. Para reemplazarlos:

### En el código (componentes Astro)

Busca y reemplaza estos textos en los archivos `.astro`:

| Placeholder | Reemplazar por | Archivos donde aparece |
|---|---|---|
| `#AFILIADO_EXPATRIO` | Tu enlace de afiliado de Expatrio | Calculadora, Simulador, Recursos |
| `#AFILIADO_LINGODA` | Tu enlace de afiliado de Lingoda | Calculadora, Simulador, Recursos |
| `#AFILIADO_WISE` | Tu enlace de afiliado de Wise | Calculadora, Simulador, Recursos |
| `#AFILIADO_LINGOKING` | Tu enlace de afiliado de Lingoking | Recursos |

### En los artículos del blog (Markdown)

Busca y reemplaza en los archivos `.md`:

| Placeholder | Reemplazar por |
|---|---|
| `[AFILIADO_EXPATRIO]` | Tu enlace de Expatrio (ej. `?ref=rutaalemania`) |
| `[AFILIADO_LINGODA]` | Tu enlace de Lingoda |
| `[AFILIADO_WISE]` | Tu enlace de Wise |
| `[AFILIADO_LINGOKING]` | Tu enlace de Lingoking |

**Comando rápido para buscar todos los placeholders:**

```bash
grep -r "AFILIADO_" src/
```

## Cómo conectar el dominio en Netlify

1. **Entra en Netlify** > Tu sitio > Domain settings
2. Haz clic en **Add custom domain**
3. Escribe `rutaalemania.com`
4. Netlify te indicará los DNS records necesarios
5. **En tu registrador de dominio** (Namecheap, Porkbun, etc.):
   - Configura los nameservers de Netlify, **O**
   - Añade un registro `A` apuntando a `75.2.60.5` y un `CNAME` para `www` apuntando a tu URL de Netlify
6. Espera a la propagación DNS (puede tardar hasta 48h, normalmente minutos)
7. Netlify activará HTTPS automáticamente con Let's Encrypt

## Cómo solicitar Google AdSense

### Requisitos previos

- Al menos **15-20 artículos** publicados con contenido sustancial
- Páginas legales completas (Impressum, Datenschutz, Disclaimer) ✅
- Sitio web accesible y funcional
- Dominio propio conectado con HTTPS ✅
- Contenido original y de calidad
- El sitio debe llevar al menos 1-3 meses activo

### Pasos

1. Ve a [adsense.google.com](https://www.google.com/adsense/) y regístrate
2. Conecta tu sitio web (`rutaalemania.com`)
3. Google te dará un fragmento de código para verificar la propiedad
4. Añade el código en `src/layouts/BaseLayout.astro` dentro del `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

5. Espera la aprobación (puede tardar 1-4 semanas)
6. Una vez aprobado, los anuncios se mostrarán automáticamente, o puedes colocar bloques manualmente

### Espacios reservados

El sitio ya tiene espacios marcados con `[ Espacio reservado para Google AdSense ]` en la landing page. Puedes sustituirlos por bloques de AdSense reales una vez aprobado.

## Datos del Impressum

Antes de publicar, rellena los placeholders en `src/pages/impressum/index.astro`:

- `[DIRECCIÓN_CALLE]` — Tu dirección postal
- `[CÓDIGO_POSTAL]` — Tu código postal
- `[EMAIL_CONTACTO]` — Tu email de contacto
- `[TELÉFONO_CONTACTO]` — Tu teléfono (opcional)
- `[STEUERNUMMER]` — Tu número fiscal del Finanzamt

Los mismos placeholders de email y dirección aparecen en `datenschutz/index.astro`.

## Licencia

Todos los derechos reservados. Carlos Domínguez Cid, 2026.
