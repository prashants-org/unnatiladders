// Runs first in `npm run build`. The /admin editor commits straight to main, so this is what
// stops a bad save from going live: on an error the deploy fails and the last good version
// stays up. Allowed industries and models are read from public/admin/config.yml so the two
// can't drift apart.
import { existsSync, readFileSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(f, "utf8"));
const config = readFileSync("public/admin/config.yml", "utf8");
const yamlList = (anchor) => {
  const m = new RegExp(`&${anchor}\\s*\\[([^\\]]*)\\]`).exec(config);
  if (!m) throw new Error(`public/admin/config.yml has no &${anchor} list`);
  return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
};
const INDUSTRIES = yamlList("industries");
const MODELS = yamlList("models");

const errors = [];
const warnings = [];
const inCI = !!process.env.GITHUB_ACTIONS;
const error = (file, msg) => errors.push([file, msg]);
const warn = (file, msg) => warnings.push([file, msg]);
const text = (v) => typeof v === "string" && v.trim() !== "";
const publicFile = (p) => typeof p === "string" && p.startsWith("/") && existsSync(`public${decodeURI(p)}`);

// ---------------------------------------------------------------- website brands
{
  const f = "src/content/brands.json";
  const { brands } = read(f);
  if (!Array.isArray(brands) || brands.length === 0) error(f, "has no brands");
  const slugs = new Set();
  (brands || []).forEach((b, i) => {
    const at = `brand ${i + 1}${text(b.name) ? ` (“${b.name}”)` : ""}`;
    if (!text(b.name)) return error(f, `${at} has no name`);
    const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (slugs.has(slug)) error(f, `${at} is listed twice`);
    slugs.add(slug);
    if (!INDUSTRIES.includes(b.category)) error(f, `${at} has unknown industry “${b.category}”`);
    if (!publicFile(b.image)) error(f, `${at} image “${b.image}” doesn't exist in public/`);
    if (b.image_type && !["logo", "photo"].includes(b.image_type)) error(f, `${at} has image_type “${b.image_type}”`);
    if (b.featured !== undefined && typeof b.featured !== "boolean") error(f, `${at} “featured” must be true or false`);
  });
  const featured = (brands || []).filter((b) => b.featured).length;
  if (featured === 0) warn(f, "no brand is ticked “Show on homepage”, so Featured franchises will be empty");
  else if (featured > 6) warn(f, `${featured} brands are featured on the homepage; 6 looks best`);
}

// ---------------------------------------------------------------- company profile
{
  const f = "profile/content.json";
  const p = read(f);
  const c = p.contact || {};
  if (!text(c.phone) || c.phone.replace(/\D/g, "").length < 10) error(f, `contact phone “${c.phone}” needs at least 10 digits`);
  if (!/^\d{10,13}$/.test(c.whatsapp || "")) error(f, `WhatsApp number “${c.whatsapp}” must be 10–13 digits, e.g. 919326950999`);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email || "")) error(f, `email “${c.email}” isn't valid`);
  if (!text(c.address)) error(f, "office address is empty");
  else if (c.address.split(",").length < 2 || !/\b\d{6}\b/.test(c.address))
    warn(f, "office address should be comma-separated and end with the city and PIN code, e.g. “…, Viman Nagar, Pune 411014”");
  if (!text(c.hours)) error(f, "office hours are empty");
  else if (!/(\d{1,2}):(\d{2})\s*(am|pm)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(am|pm)/i.test(c.hours))
    warn(f, `office hours “${c.hours}” can't be read for Google; use the form “Mon – Sat, 9:00 AM – 6:00 PM”`);
  if (!/^\d+/.test(p.numbers?.years || "")) error(f, `“Years in business” must start with a number, e.g. 20+ (got “${p.numbers?.years}”)`);
  const fd = p.founder || {};
  for (const k of ["name", "title", "bio"]) if (!text(fd[k])) error(f, `founder ${k} is empty`);
  if (!publicFile(fd.photo)) error(f, `founder photo “${fd.photo}” doesn't exist in public/`);
  if (!Array.isArray(fd.highlights)) error(f, "founder highlights must be a list");
}

// ---------------------------------------------------------------- profile catalogue
{
  const f = "profile/catalogue.json";
  const { industries } = read(f);
  let rows = 0;
  (industries || []).forEach((ind, i) => {
    if (!INDUSTRIES.includes(ind.name)) error(f, `industry ${i + 1} “${ind.name}” isn't in the admin's industry list`);
    (ind.rows || []).forEach((r, j) => {
      rows++;
      const at = `${ind.name}, row ${j + 1}`;
      if (!text(r.brand)) error(f, `${at} has no brand name`);
      if (r.model && !MODELS.includes(r.model)) error(f, `${at} (“${r.brand}”) has unknown model “${r.model}”`);
    });
  });
  if (rows > 110) warn(f, `${rows} catalogue rows; about 110 fit on the two catalogue pages`);
}

// ---------------------------------------------------------------- report
const print = (level, [file, msg]) =>
  console.log(inCI ? `::${level} file=${file}::${msg}` : `${level === "error" ? "✗" : "!"} ${file}: ${msg}`);
warnings.forEach((w) => print("warning", w));
errors.forEach((e) => print("error", e));
if (errors.length) {
  console.log(`\nContent check failed with ${errors.length} error(s). In a deploy this stops the update, so the live site stays as it was.`);
  process.exit(1);
}
console.log(`Content OK${warnings.length ? ` (${warnings.length} warning(s))` : ""}`);
