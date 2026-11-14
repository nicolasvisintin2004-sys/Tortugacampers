/**
 * Genera las imágenes Open Graph (1200×630) y los íconos del sitio
 * a partir de las fotos reales y el logo de public/images/ig.
 *
 *   node scripts/build-og.mjs
 *
 * Volver a correrlo cuando cambie la foto principal de un modelo.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ig = path.join(root, "public/images/ig");
const out = path.join(root, "public/og");
const BLACK = "#0c0c0d";

const W = 1200;
const H = 630;
const PHOTO_W = 520;

/** Mitad izquierda negra con el logo, mitad derecha con la foto. */
async function og(name, photo, position = "centre") {
  const img = await sharp(path.join(ig, photo))
    .resize({ width: PHOTO_W, height: H, fit: "cover", position })
    .toBuffer();
  const logo = await sharp(path.join(ig, "logo.png")).resize({ width: 460 }).toBuffer();
  const logoMeta = await sharp(logo).metadata();

  await sharp({ create: { width: W, height: H, channels: 3, background: BLACK } })
    .composite([
      { input: img, left: W - PHOTO_W, top: 0 },
      { input: logo, left: Math.round((W - PHOTO_W - 460) / 2), top: Math.round((H - logoMeta.height) / 2) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(out, `${name}.jpg`));
  console.log("og:", name);
}

/** Ícono: la T roja centrada sobre negro. */
async function icon(file, size) {
  const mark = await sharp(path.join(ig, "logo-t.png"))
    .resize({ height: Math.round(size * 0.66) })
    .toBuffer();
  const meta = await sharp(mark).metadata();
  await sharp({ create: { width: size, height: size, channels: 3, background: BLACK } })
    .composite([
      { input: mark, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) },
    ])
    .png()
    .toFile(path.join(root, "app", file));
  console.log("icon:", file);
}

await mkdir(out, { recursive: true });
await og("home", "discover-dc/hero.jpg", "top");
await og("discover-dc", "discover-dc/exterior.jpg", "center");
await og("t-350", "t-350/exterior.jpg", "bottom");
await icon("icon.png", 512);
await icon("apple-icon.png", 180);
