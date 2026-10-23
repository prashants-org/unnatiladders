// Runs after `vite build`. Gives each route its own index.html (so /franchises/ etc. return 200
// on GitHub Pages) with that page's title, description and canonical URL already in the HTML,
// for search engines and link previews that don't run JavaScript. 404.html catches the rest.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { canonicalUrl, pageMeta } from "../src/meta.js";

const template = readFileSync("dist/index.html", "utf8");

const escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render(path, { noindex = false } = {}) {
  const { title, description } = pageMeta[path];
  const url = canonicalUrl(path);
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`],
    [/(<meta\s+name="description"\s+content=")[^"]*/, `$1${escape(description)}`],
    [/(<meta\s+property="og:title"\s+content=")[^"]*/, `$1${escape(title)}`],
    [/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${escape(description)}`],
    [/(<meta\s+property="og:url"\s+content=")[^"]*/, `$1${url}`],
    [/(<link\s+rel="canonical"\s+href=")[^"]*/, `$1${url}`],
  ];
  let html = template;
  for (const [pattern, replacement] of swaps) {
    if (!pattern.test(html)) throw new Error(`index.html is missing ${pattern}`);
    html = html.replace(pattern, replacement);
  }
  if (noindex) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/, "").replace("</title>", '</title>\n    <meta name="robots" content="noindex" />');
  }
  return html;
}

for (const path of Object.keys(pageMeta)) {
  const dir = path === "/" ? "dist" : `dist${path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, render(path));
}
writeFileSync("dist/404.html", render("/", { noindex: true }));

console.log(`Wrote ${Object.keys(pageMeta).length} route pages and 404.html`);
