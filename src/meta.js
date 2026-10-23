// Title and description for each page. Used in the browser (usePageMeta) and at build time
// (scripts/route-pages.mjs) so every route's HTML carries its own title, description and canonical URL.

export const SITE_URL = "https://unnatiladder.com";

export const pageMeta = {
  "/": {
    title: "Unnati Ladder | Franchise & Business Consultancy, Pune",
    description:
      "Own a proven brand without the guesswork. Unnati Ladder matches entrepreneurs with franchise brands and handles planning, paperwork and launch. Pune, India.",
  },
  "/services": {
    title: "Services | Unnati Ladder",
    description:
      "Franchising, strategic planning, brand leasing, sales training, branding and idea validation. One team with you from the first idea to opening day.",
  },
  "/franchises": {
    title: "Franchise Opportunities | Unnati Ladder",
    description:
      "Browse franchise brands in food & beverage, automotive, healthcare and home services. Enquire for investment details and availability in your city.",
  },
  "/about": {
    title: "About Us | Unnati Ladder",
    description:
      "Founded by Prashant Srivastava, Unnati Ladder brings 20+ years of business strategy to entrepreneurs taking a franchise or building their own brand.",
  },
  "/contact": {
    title: "Contact | Unnati Ladder",
    description:
      "Book a free consultation with Unnati Ladder. Call, WhatsApp or send an enquiry, or visit our office in Viman Nagar, Pune.",
  },
};

/** Canonical URL for a route. Routes other than home end in "/", matching the sitemap. */
export const canonicalUrl = (path) => SITE_URL + (path === "/" ? "/" : `${path}/`);
