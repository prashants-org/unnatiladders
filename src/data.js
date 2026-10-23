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

// DRAFT testimonials, written to be sent to real clients for approval. They are NOT real
// clients: the names and cities are examples. Before publishing one, get the client's written
// OK, change the name, role and city to theirs, edit the wording to match what they said,
// then set placeholder: false. Publishing invented testimonials as real is a fake review
// under India's consumer protection rules.
// Entries marked placeholder show in `npm run dev` only. The homepage hides the
// "Client stories" section entirely until at least one approved quote is added.
export const testimonials = [
  {
    placeholder: true,
    quote:
      "I had savings and wanted my own business, but no idea where to begin. The team shortlisted three food brands that fit my budget, explained the numbers honestly, and handled the paperwork. We opened in about four months.",
    name: "Rohan Deshmukh",
    role: "Franchise owner · Nashik",
  },
  {
    placeholder: true,
    quote:
      "We had a recipe people loved and nothing else. Unnati Ladder helped us test the idea, build the name and look, and plan a proper launch. They told us what wouldn't work too, which saved us money.",
    name: "Sneha Kulkarni",
    role: "Brand founder · Pune",
  },
  {
    placeholder: true,
    quote:
      "I already ran one outlet and wanted to add a second brand without spreading myself thin. Their advice on picking a non-competing category and the right location made the decision much easier.",
    name: "Amit Agarwal",
    role: "Multi-brand operator · Bangalore",
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
