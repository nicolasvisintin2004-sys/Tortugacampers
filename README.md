# Tortuga Campers — demo de sitio

Demo para Tortuga Campers hecha por Visintin Studio: home, una página por modelo y un configurador por modelo que arma el presupuesto y lo manda por WhatsApp.

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion.

## Cómo correrlo

```bash
npm install
npm run dev
```

Build de producción y lint:

```bash
npm run build
npm run lint
```

## Dónde se cambia el contenido

Todo vive en un solo archivo tipado: [`content/site.ts`](content/site.ts).

- **WhatsApp:** `site.whatsapp` (formato internacional, sin `+` ni espacios). Hoy tiene el número que pasó Martín. Si queda vacío, los botones abren WhatsApp con el mensaje armado y dejan elegir el contacto.
- **Modelos, specs y precios:** `models`. Un dato en `null` se muestra como `[A confirmar]`; un precio con `status: "ejemplo"` se marca como valor de ejemplo.
- **Opcionales del configurador:** `options`. La lista sale de la propuesta del Discover DC; los precios son de ejemplo salvo los marcados `priceStatus: "publicado"` (el tray). Los del mismo `group` se excluyen entre sí. Con todos los precios reales, pasar `examplePricing` a `false`.
- **FAQ, proceso, comparativa, "Tortuga en ruta":** al final del mismo archivo.

Las páginas `/modelos/[slug]` y `/configurador/[slug]` se generan desde ese archivo con `generateStaticParams`.

## Fotos y video

Están en `public/images/ig/` (fotos y cuadros de los reels del Instagram de Tortuga) y `public/video/`. Al cambiar la foto principal de un modelo, regenerar las imágenes Open Graph y los íconos:

```bash
node scripts/build-og.mjs
```

## Configurador

El estado va en la URL, así una configuración se puede compartir:

```
/configurador/t-350?marca=toyota&pickup=hilux&cabina=doble&op=toldo,calefactor&paso=3
```

Los datos de contacto (nombre, provincia, plazo) no se guardan ni viajan en la URL: solo entran en el mensaje de WhatsApp.

## Deploy en Netlify

Todo está configurado en `netlify.toml`: comando `npm run build`, Node 22 y cabeceras. Netlify detecta Next.js e instala solo su runtime. **No hace falta ninguna variable de entorno**: la URL del sitio (para Open Graph y los links de "compartir") se toma de la que asigna Netlify. Si después se usa un dominio propio y querés forzarlo, cargá `NEXT_PUBLIC_SITE_URL=https://tu-dominio` en *Site configuration → Environment variables*.

### Opción A: desde GitHub (recomendada, se redeploya en cada push)

```bash
git commit -m "Demo Tortuga Campers"
git remote add origin https://github.com/<usuario>/tortuga-campers.git
git push -u origin main
```

En Netlify: *Add new project → Import an existing project → GitHub* → elegir el repo. Los valores de build se leen del `netlify.toml`; no hay que tocar nada. *Deploy*.

### Opción B: desde la terminal, sin GitHub

```bash
npx netlify-cli login
npx netlify-cli deploy --build --prod
```

La primera vez pregunta si crear un sitio nuevo: elegí *Create & configure a new project* y un nombre (por ejemplo `tortuga-campers-demo`).

> El arrastrar-y-soltar de una carpeta en app.netlify.com **no sirve** para este sitio: Next.js necesita el runtime de Netlify (imágenes optimizadas, páginas generadas). Usá A o B.

### Después del primer deploy

- Probá el configurador hasta el final y mandá un WhatsApp de prueba: tiene que llegarle a Martín (`site.whatsapp`).
- Revisá la vista previa del link pegándolo en WhatsApp: debe mostrar la foto Open Graph.
- Es una demo: va con `noindex` en metadata (`app/layout.tsx`), `app/robots.ts` y la cabecera `X-Robots-Tag` del `netlify.toml`. Para publicar el sitio real hay que quitar las tres cosas.
