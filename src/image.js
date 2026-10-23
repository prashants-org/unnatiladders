// <img> props for brand images. In production builds, scripts/optimize-images.mjs writes
// name.webp (500 px) and name-250.webp next to each uploaded JPG/PNG; the dev server
// only has the originals, so it gets the plain path.
const OPTIMIZED = /^\/(brands|uploads)\/[^?#]+\.(jpe?g|png)$/i;

export function brandImage(path, sizes) {
  if (!import.meta.env.PROD || !OPTIMIZED.test(path)) return { src: path };
  const base = path.replace(/\.(jpe?g|png)$/i, "");
  return { src: `${base}.webp`, srcSet: `${base}-250.webp 250w, ${base}.webp 500w`, sizes };
}
