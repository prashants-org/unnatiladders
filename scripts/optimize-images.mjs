// Runs after `vite build`. Brand logos and photos are uploaded through /admin as JPG/PNG of any
// size and quality, so they're optimized here on every build rather than by hand:
//   - the original is re-encoded in place (same path, so links and the profile PDF keep working)
//   - name.webp (up to 500 px wide) and name-250.webp are added for the site's srcset
// src/image.js must agree with the file names written here.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const FULL = 500;
const SMALL = 250;
const IMAGE = /\.(jpe?g|png)$/i;

const files = ["dist/brands", "dist/uploads"].flatMap((dir) => {
  try {
    return readdirSync(dir).filter((f) => IMAGE.test(f)).map((f) => join(dir, f));
  } catch {
    return [];
  }
});

let before = 0;
let after = 0;
for (const file of files) {
  // From a buffer: on Windows sharp keeps a file it reads open, and the original is overwritten below
  const input = sharp(readFileSync(file), { failOn: "none" }).rotate();
  const { width } = await input.metadata();
  const base = file.replace(IMAGE, "");
  const isPng = /\.png$/i.test(file);
  before += statSync(file).size;

  const original = await input
    .clone()
    .resize({ width: Math.min(width, FULL * 2), withoutEnlargement: true })
    [isPng ? "png" : "jpeg"](isPng ? { compressionLevel: 9, palette: true } : { quality: 80, mozjpeg: true })
    .toBuffer();
  // Only replace the original when re-encoding actually made it smaller
  if (original.length < statSync(file).size) writeFileSync(file, original);
  after += statSync(file).size;

  for (const [w, suffix] of [[FULL, ""], [SMALL, "-250"]]) {
    await input
      .clone()
      .resize({ width: Math.min(width, w), withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${base}${suffix}.webp`);
  }
}

console.log(`Optimized ${files.length} images: originals ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB, plus WebP versions`);
