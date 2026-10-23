import brandData from "./content/brands.json";
import profile from "../profile/content.json";

// Site text lives here. Contact details, founder and key numbers come from
// profile/content.json (edited in /admin), so the website and the PDF always agree.

const c = profile.contact;
// "LG-03, East Court, Phoenix Market City, Viman Nagar, Pune 411014" -> two roughly equal lines
const addressParts = c.address.split(/,\s*/);
const addressSplit = Math.ceil(addressParts.length / 2);

export const contact = {
  phone: c.phone,
  phoneHref: `tel:+${c.phone.replace(/\D/g, "")}`,
  whatsapp: `https://wa.me/${c.whatsapp}`,
  email: c.email,
  hours: c.hours,
  address: [addressParts.slice(0, addressSplit).join(", "), addressParts.slice(addressSplit).join(", ")],
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`,
};

export const founder = profile.founder;

// "20+" -> { value: 20, suffix: "+" } so CountUp can animate it
const yearsMatch = /^(\d+)(.*)$/.exec(profile.numbers.years.trim()) || [];

export const stats = [
  { value: Number(yearsMatch[1]) || 0, suffix: yearsMatch[2] || "", label: "Years in business strategy" },
  { value: brandData.brands.length, suffix: "", label: "Partner brands" },
  { value: new Set(brandData.brands.map((b) => b.category)).size, suffix: "", label: "Industries covered" },
];

export const paths = [
  {
    icon: "store",
    title: "Take a franchise",
    text: "Run an established brand from day one. The name, the product and the playbook already exist. We find the right fit and get you registered.",
  },
  {
    icon: "layers",
    title: "Run multiple brands",
    text: "Already operating? Add outlets or new brands across food, automotive, healthcare and home services, all through one partner.",
  },
  {
    icon: "spark",
    title: "Launch your own brand",
    text: "Have your own idea? We test it, build the brand around it and plan a launch that gets you noticed.",
  },
  {
    icon: "chart",
    title: "Invest as a partner",
    text: "Back a growing brand at the right moment, as an investor or as a business partner in an existing brand.",
  },
];

export const services = [
  {
    id: "franchising",
    icon: "handshake",
    title: "Franchising",
    text: "We match you with the right brand, then take you through registration and the franchise agreement, step by step.",
    points: ["Brand matching", "Franchise registration", "Agreement guidance"],
  },
  {
    id: "strategic-planning",
    icon: "compass",
    title: "Strategic Planning",
    text: "A practical plan for your market, your sales and your marketing, whether you're opening a franchise or a brand of your own.",
    points: ["Market entry plan", "Sales & marketing strategy", "Growth roadmap"],
  },
  {
    id: "leasing",
    icon: "key",
    title: "Brand Leasing",
    text: "Lease an established brand and reach the market faster, backed by sales methods that have already worked in the real world.",
    points: ["Brand leasing", "Location advice", "Proven sales methods"],
  },
  {
    id: "sales-training",
    icon: "users",
    title: "Sales Training",
    text: "Hands-on training for you and your team, built on the tactics leading brands use to bring customers through the door.",
    points: ["Owner & team training", "Leading-brand playbooks", "Ongoing coaching"],
  },
  {
    id: "branding",
    icon: "badge",
    title: "Branding",
    text: "Name, identity and launch marketing that give a brand-new business the presence of an established one.",
    points: ["Brand identity", "Launch campaigns", "Positioning"],
  },
  {
    id: "idea-validation",
    icon: "bulb",
    title: "Idea Validation",
    text: "Before you invest, we test your idea against the market and tell you honestly whether it's worth building, and how.",
    points: ["Feasibility check", "Market research", "Go / no-go advice"],
  },
];

export const steps = [
  { title: "Discover", text: "A conversation about your goals, budget, city and the kind of business you want to run." },
  { title: "Shortlist", text: "We bring you brands and models that genuinely fit, and help you compare them." },
  { title: "Secure", text: "Registration, agreements and planning, handled with our advisors and legal team." },
  { title: "Launch", text: "Branding, marketing and sales training so you open with momentum." },
  { title: "Scale", text: "Support as you grow: more outlets, more brands, new investments." },
];

// Brands are edited through the admin (/admin) and stored in content/brands.json.
// image_type: "logo" (shown whole on white) or "photo" (fills the card).
// investment / format: leave empty to show "Shared on enquiry" / "Ask us".

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const brands = brandData.brands.map((b) => ({ ...b, slug: slugify(b.name), kind: b.image_type || "logo" }));

export const featured = brands.filter((b) => b.featured);

// PLACEHOLDERS: replace with real client quotes (with permission) and set placeholder: false.
// Entries still marked placeholder are hidden on the live site; the homepage hides the
// "Client stories" section entirely until at least one real quote is added.
export const testimonials = [
  {
    placeholder: true,
    quote: "Add a real client quote here: what they wanted, and how Unnati Ladder helped them get there.",
    name: "Client name",
    role: "Franchise owner · City",
  },
  {
    placeholder: true,
    quote: "Add a second quote here, ideally from someone who launched their own brand or runs multiple outlets.",
    name: "Client name",
    role: "Brand founder · City",
  },
  {
    placeholder: true,
    quote: "Add a third quote here, for example from an investor or a first-time entrepreneur.",
    name: "Client name",
    role: "Investor · City",
  },
];

export const faqs = [
  {
    q: "How much do I need to invest?",
    a: "It depends on the brand and format. A kiosk needs far less than a full café. Share your budget and we'll only show you brands that fit it.",
  },
  {
    q: "I've never run a business. Can I still do this?",
    a: "Yes. Many of our clients are first-time entrepreneurs. A franchise comes with a proven system, and our sales training covers the rest.",
  },
  {
    q: "Can you help me build my own brand instead?",
    a: "Absolutely. We validate the idea, create the brand and plan the launch with you, from name to opening day.",
  },
  {
    q: "What happens after I send an enquiry?",
    a: "A consultant calls you to understand your goals and budget, then shortlists options for you. There's no obligation.",
  },
  {
    q: "Where do you work?",
    a: `Our office is at ${contact.address.join(", ")}, and we work with clients and brands across India.`,
  },
];
