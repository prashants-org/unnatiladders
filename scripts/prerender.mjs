// Runs after the client and server builds. Renders every route to static HTML with
// src/entry-server.jsx and writes it to dist/<route>/index.html, with that page's title,
// description and canonical URL, so visitors see content before any JavaScript runs and
// crawlers and link previews get the full page. The browser then hydrates it (src/main.jsx).
// 404.html is the pre-rendered "not found" page that GitHub Pages serves for unknown URLs.
// Also adds the business details for Google (JSON-LD), built from profile/content.json.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { SITE_URL, canonicalUrl, pageMeta } from "../src/meta.js";

const { render: renderApp } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);

const profile = JSON.parse(readFileSync("profile/content.json", "utf8"));

const DAYS = { mon: "Mo", tue: "Tu", wed: "We", thu: "Th", fri: "Fr", sat: "Sa", sun: "Su" };
const to24h = (h, m, ampm) => `${String((Number(h) % 12) + (/pm/i.test(ampm) ? 12 : 0)).padStart(2, "0")}:${m}`;

/** "Mon – Sat, 9:00 AM – 6:00 PM" -> "Mo-Sa 09:00-18:00", or undefined if it can't be read. */
function openingHours(text) {
  const days = /\b(mon|tue|wed|thu|fri|sat|sun)\w*\s*[–-]\s*(mon|tue|wed|thu|fri|sat|sun)/i.exec(text);
  const times = /(\d{1,2}):(\d{2})\s*(am|pm)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(am|pm)/i.exec(text);
  if (!days || !times) return undefined;
  const range = `${to24h(times[1], times[2], times[3])}-${to24h(times[4], times[5], times[6])}`;
  return `${DAYS[days[1].toLowerCase()]}-${DAYS[days[2].toLowerCase()]} ${range}`;
}

function businessJsonLd() {
  const { contact, cover } = profile;
  // "LG-03, East Court, Phoenix Market City, Viman Nagar, Pune 411014"
  const parts = contact.address.split(/,\s*/);
  const cityPart = parts.pop();
  const postalCode = /\b\d{6}\b/.exec(cityPart)?.[0];
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Unnati Ladder",
    slogan: "Growing Together",
    description: cover.intro,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og-image.png`,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: parts.join(", "),
      addressLocality: cityPart.replace(postalCode ?? "", "").trim(),
      postalCode,
      addressCountry: "IN",
    },
    openingHours: openingHours(contact.hours),
  };
  // Escape "<" so the JSON can't close the <script> element early
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

const escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Preload the Latin subsets of both fonts so they arrive with the page. Otherwise the hero
// heading reflows when Sora swaps in, which was the only layout shift on the homepage.
const fontPreloads = readdirSync("dist/assets")
  .filter((f) => /^(inter|sora)-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);
if (fontPreloads.length !== 2) throw new Error(`Expected 2 Latin font files in dist/assets, found ${fontPreloads.length}`);

const template = readFileSync("dist/index.html", "utf8").replace(
  "</head>",
  `  ${fontPreloads.join("\n    ")}\n    ${businessJsonLd()}\n  </head>`
);

const ROOT = '<div id="root"></div>';
if (!template.includes(ROOT)) throw new Error(`index.html is missing ${ROOT}`);

function render(path, { title, description }, { noindex = false } = {}) {
  const url = canonicalUrl(path);
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`],
    [/(<meta\s+name="description"\s+content=")[^"]*/, `$1${escape(description)}`],
    [/(<meta\s+property="og:title"\s+content=")[^"]*/, `$1${escape(title)}`],
    [/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${escape(description)}`],
    [/(<meta\s+property="og:url"\s+content=")[^"]*/, `$1${url}`],
    [/(<link\s+rel="canonical"\s+href=")[^"]*/, `$1${url}`],
  ];
  let html = template.replace(ROOT, `<div id="root">${renderApp(path)}</div>`);
  for (const [pattern, replacement] of swaps) {
    if (!pattern.test(html)) throw new Error(`index.html is missing ${pattern}`);
    html = html.replace(pattern, replacement);
  }
  if (noindex) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/, "").replace("</title>", '</title>\n    <meta name="robots" content="noindex" />');
  }
  return html;
}

for (const [path, meta] of Object.entries(pageMeta)) {
  const dir = path === "/" ? "dist" : `dist${path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, render(path, meta));
}
// Any path that isn't a route renders the NotFound page
const notFound = { title: "Page not found | Unnati Ladder", description: pageMeta["/"].description };
writeFileSync("dist/404.html", render("/404", notFound, { noindex: true }));

console.log(`Pre-rendered ${Object.keys(pageMeta).length} pages and 404.html`);
