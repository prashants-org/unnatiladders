import Icon from "../components/Icon";
import { CtaBand, PageHero, useReveal } from "../components/Sections";
import { founder } from "../data";

const values = [
  {
    icon: "check",
    title: "You come first",
    text: "We put your requirements ahead of the deal. Every recommendation is relevant to you and explained transparently.",
  },
  {
    icon: "users",
    title: "One team, every skill",
    text: "Marketers, advisors and lawyers work together on your business, so nothing falls between the cracks.",
  },
  {
    icon: "compass",
    title: "Guided, start to finish",
    text: "From understanding your idea to marketing your brand, an expert oversees every step, and your input shapes the plan.",
  },
];

export default function About() {
  useReveal();
  return (
    <>
      <PageHero eyebrow="About Unnati Ladder" title="We help people climb, one step at a time.">
        Business and financial services for entrepreneurs who want to start strong with an established brand, or build
        a brand of their own.
      </PageHero>

      <section className="section">
        <div className="container about-grid">
          <div className="prose reveal">
            <p className="eyebrow">Our story</p>
            <h2>Start a business without starting from scratch.</h2>
            <p>
              Most new businesses spend their first year on market research, branding and trial and error. Our clients
              skip much of that. We connect them with brands that already work, and with the expertise to run them
              well.
            </p>
            <p>
              For those with an idea of their own, our legal and marketing teams help set up a new brand properly:
              validating the concept, building the identity and planning the launch. Getting a franchise, establishing
              a brand or leasing one, we've got you covered.
            </p>
            <a href="/Unnati-Ladder-Profile.pdf" className="btn btn-primary" target="_blank" rel="noreferrer">
              <Icon name="download" size={18} /> Download our company profile
            </a>
          </div>
          <aside className="card founder-card reveal reveal-delay-1">
            <img src={founder.photo} alt={founder.name} loading="lazy" decoding="async" />
            <div className="body">
              <p className="eyebrow">{founder.title}</p>
              <h3>{founder.name}</h3>
              <p className="muted">{founder.bio}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Why us</p>
            <h2>What makes Unnati Ladder different.</h2>
          </div>
          <div className="values">
            {values.map((v, i) => (
              <article key={v.title} className={`card reveal reveal-delay-${i}`}>
                <span className="icon-chip">
                  <Icon name={v.icon} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
