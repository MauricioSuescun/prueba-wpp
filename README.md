# Reto técnico - Banners dinámicos WPP

Este repositorio contiene una aplicación de ejemplo para crear y visualizar anuncios en formato de banners dinámicos. El desafío solicitaba adaptar varios formatos (Facebook video post, Instagram carrusel, weather y dinámico) con eventos de interacción, métricas de backend y animaciones llamativas.

## Estructura del proyecto

```
client/
  dynamic-banner/        # UI para alimentar el catálogo y previsualizar ads
  facebook-banner/       # banners 300x600, 320x480 (video post)
  instagram-banner/      # banners 300x600, 320x480 (carrusel)
  weather-banner/        # banners 300x250, 300x600 (clima)
  utils/                 # helpers compartidos (tracking)
server/
  routes/                # APIs: ads.js (dinámico), weather.js
  services/              # integración con OpenAI
  server.js              # servidor Express estático + rutas
```

Todos los banners incluyen un panel de métricas en el cliente y despachan eventos a `/api/track`.

### Tecnologías usadas

- **Frontend**: HTML5, CSS moderno, JavaScript modular con `<script type="module">`.
- **Backend**: Node.js con Express (`type: module`), sin base de datos (métricas en memoria).
- **OpenAI**: generación de texto para anuncios dinámicos mediante prompt personalizado.
- **Deployment**: Any static/Node host (Vercel sugerido).

## Requisitos implementados

1. **Facebook – Video Post** (300×600 y 320×480)
   - Video interactivo con controles (play, pause, volumen, mute) que no bloquean el clic del banner.
   - Clic en todo el banner (excepto controles) redirige a URL.
   - Eventos de interacción (play, pause, mute, unmute, seek, banner_click) rastreados y mostrados en panel.

2. **Instagram – Carousel Post** (300×600 y 320×480)
   - Carrusel con flechas y puntos de navegación.
   - Cada imagen es un enlace distinto.
   - Registro de clics en flechas, imágenes y banner.

3. **Weather Banner** (300×250 y 300×600)
   - Consulta a API de clima (open-meteo.com) para varias ciudades colombianas.
   - Rotación automática de ciudades cada 5 segundos.
   - Animaciones CSS y efectos adicionales según condición (sol, nubes, lluvia).
   - Marca visible y texto promocional.
   - Interacciones de impresión y clics (banner y CTA).

4. **Dynamic Banner** (300×250 y 300×600)
   - Conexión a endpoint `/api/ads/random` que devuelve un anuncio aleatorio de un pool de 20‑30 registros.
   - Pool pre‑cargado con anuncios generados por IA y alimentable mediante UI (`/` principale).
   - Cada recarga muestra contenido nuevo con imagen de producto y fondo de marca.
   - Métricas globales y por anuncio (`adId`).
   - Página de administración simple permite generar con IA usando OpenAI y agregar al pool.

5. **Backend metrics**
   - API `/api/track` acumula eventos en memoria.
   - Endpoint `/api/metrics` devuelve estadísticas globales y por anuncio.
   - Las rutas estáticas sirven todos los banners; la página principal `/` es el hub.

6. **Diseño y frontend**
   - Adaptaciones visuales cercanas a referencias (Facebook, Instagram, etc.).
   - Animaciones avanzadas para llamar la atención.
   - Panel de selección (`/`) reorganizado elegantemente con tarjetas y header.
   - Secciones no funcionales ocultas con CSS hasta su reparación.

## Archivos importantes

- `server/routes/ads.js`: lógica de anuncios dinámicos, tracking y métricas.
- `server/routes/weather.js`: integración con Open-Meteo API.
- `server/services/openaiService.js`: genera contenido de anuncios con OpenAI.
- `client/*/*.html`: bannners específicos y scripts.
- `client/dynamic-banner/index.html`: hub con formulario y enlaces.

## Instalación y ejecución local

```bash
cd server
npm install
# establecer variable de entorno con tu clave OpenAI
export OPENAI_API_KEY="sk-..."      # Windows PowerShell: $env:OPENAI_API_KEY="..."
node server.js
```

### Endpoints de interés

- `/` → UI principal (hub de banners). (feed + preview están temporalmente ocultos)
- `/dynamic-banner/300x250` y `/dynamic-banner/300x600` → banners dinámicos.
- `/facebook-banner/300x600`, `/facebook-banner/320x480` → video post.
- `/instagram-banner/300x600`, `/instagram-banner/320x480` → carousel.
- `/weather-banner/300x250`, `/weather-banner/300x600` → clima.
- `/api/ads/random` → GET anuncio aleatorio.
- `/api/ads/generate-and-add` → POST generar anuncio IA y añadir.
- `/api/track` → POST métricas.
- `/api/metrics` → GET métricas agregadas.
- `/api/weather` (parámetro `city`) → GET datos de clima.
