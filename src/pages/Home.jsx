import { useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { BrandCard, CountUp, CtaBand, Faq, Testimonials, usePauseOffscreen, useReveal, visibleTestimonials } from "../components/Sections";
import { brandImage } from "../image";
import { brands, contact, featured, founder, paths, services, stats, steps } from "../data";

function HeroColumns() {
  // Three columns of brand tiles drifting in opposite directions.
  const cols = [0, 1, 2].map((c) => brands.filter((_, i) => i % 3 === c));
  const ref = useRef(null);
  usePauseOffscreen(ref);
  return (
    <div ref={ref} className="hero-columns" aria-hidden="true">
      {cols.map((col, i) => (
        <div key={i} className={`hero-col ${i === 1 ? "down" : ""}`}>
          <div className="hero-col-track">
            {[...col, ...col].map((b, j) => (
              <div key={j} className={`hero-tile ${b.kind}`}>
                <img {...brandImage(b.image, "(max-width: 880px) 30vw, 160px")} alt="" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero dark">
      <div className="container hero-grid">
        <div>
          <p className="badge-pill">
            <b>Pune</b> Franchise & business consultancy
          </p>
          <h1>
            Own a brand that's <span className="accent">already winning.</span>
          </h1>
          <p className="lead">
            Skip the guesswork of starting from zero. We match you with franchise brands people already love, then
            handle the planning, paperwork and launch alongside you.
          </p>
          <div className="hero-actions">
            <Link to="/franchises" className="btn btn-gold">
              Explore franchises <Icon name="arrow" size={18} />
            </Link>
            <a href={contact.phoneHref} className="btn btn-line-light">
              <Icon name="phone" size={18} /> {contact.phone}
            </a>
          </div>
          <dl className="stat-row">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>
                  <CountUp value={s.value} suffix={s.suffix} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroColumns />
      </div>
    </section>
  );
}

function LogoMarquee() {
  const logos = brands.filter((b) => b.kind === "logo");
  const ref = useRef(null);
  usePauseOffscreen(ref);
  return (
    <div ref={ref} className="marquee-band" aria-label="Brands we work with">
      <div className="marquee">
        <div className="marquee-track">
          {[...logos, ...logos].map((b, i) => (
            <div key={i} className="marquee-item">
              <img {...brandImage(b.image, "110px")} alt={i < logos.length ? b.name : ""} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useReveal();

  return (
    <>
      <Hero />
      <LogoMarquee />

      {/* Ways to start */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Four ways up</p>
            <h2>Pick the path that fits where you are today.</h2>
            <p>First business or fifth outlet, ready-made brand or your own idea: there's a route for you.</p>
          </div>
          <div className="paths">
            {paths.map((p, i) => (
              <article key={p.title} className={`card hoverable path-card reveal reveal-delay-${i}`}>
                <span className="path-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="icon-chip">
                  <Icon name={p.icon} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured franchises */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">Featured franchises</p>
              <h2>Brands ready for new partners.</h2>
            </div>
            <Link to="/franchises" className="btn btn-line">
              See all {brands.length} brands <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="brand-grid three">
            {featured.map((b, i) => (
              <BrandCard key={b.slug} brand={b} className={`reveal reveal-delay-${i % 3}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section dark">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">How it works</p>
            <h2>From first call to open doors, in five clear steps.</h2>
          </div>
          <ol className="timeline">
            {steps.map((s, i) => (
              <li key={s.title} className={`reveal reveal-delay-${i % 4}`}>
                <span className="timeline-dot">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services bento */}
      <section className="section">
        <div className="container">
          <div className="section-head split reveal">
            <div>
              <p className="eyebrow">What we do</p>
              <h2>Six ways we help you grow.</h2>
            </div>
            <Link to="/services" className="text-link">
              Explore services <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="bento">
            {services.map((s, i) => (
              <Link key={s.id} to={`/services#${s.id}`} className={`card reveal reveal-delay-${i % 3}`}>
                <span className="icon-chip">
                  <Icon name={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="text-link">
                  Learn more <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (hidden until there is at least one real quote) */}
      {visibleTestimonials.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="section-head center reveal">
              <p className="eyebrow">Client stories</p>
              <h2>Entrepreneurs who took the next step.</h2>
            </div>
            <Testimonials />
          </div>
        </section>
      )}

      {/* Founder */}
      <section className="section dark">
        <div className="container founder">
          <div className="founder-media reveal">
            <img src={founder.photo} alt={`${founder.name}, founder of Unnati Ladder`} loading="lazy" decoding="async" />
          </div>
          <div className="reveal reveal-delay-1">
            <p className="eyebrow">Meet the founder</p>
            <h2 className="founder-statement">Advice that puts your requirements first. Always relevant, always transparent.</h2>
            <p className="founder-name">
              {founder.name}, {founder.title}
            </p>
            <ul className="creds">
              {founder.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <Link to="/about" className="text-link">
              Our story <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container faq-wrap">
          <div className="section-head reveal">
            <p className="eyebrow">FAQ</p>
            <h2>Questions, answered.</h2>
            <p>
              Still unsure? <Link to="/contact">Talk to a consultant</Link>. It's free.
            </p>
          </div>
          <div className="reveal reveal-delay-1">
            <Faq />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
