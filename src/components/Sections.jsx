import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { faqs, testimonials } from "../data";
import { brandImage } from "../image";

/** Adds .is-visible to every .reveal element once it scrolls into view. Re-runs on route change. */
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}

/**
 * Pauses the CSS animations inside `ref` while it is off-screen. Endless animations that
 * keep running out of view make the browser redo layer work on every scroll frame.
 */
export function usePauseOffscreen(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-paused", !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

export function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return undefined;
    }
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / 1200, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </section>
  );
}

export function BrandCard({ brand, className = "" }) {
  return (
    <article className={`card hoverable brand-card ${className}`}>
      <div className={`brand-media ${brand.kind}`}>
        <img {...brandImage(brand.image, "(max-width: 600px) 92vw, 380px")} alt={brand.name} loading="lazy" decoding="async" />
        <span className="tag">{brand.category}</span>
      </div>
      <div className="brand-body">
        <h3>{brand.name}</h3>
        <div className="brand-meta">
          <div>
            <span>Investment</span>
            <strong className={brand.investment ? "" : "pending"}>{brand.investment || "Shared on enquiry"}</strong>
          </div>
          <div>
            <span>Format</span>
            <strong className={brand.format ? "" : "pending"}>{brand.format || "Ask us"}</strong>
          </div>
        </div>
        <Link to={`/contact?brand=${encodeURIComponent(brand.name)}`} className="btn btn-line btn-sm">
          Enquire now <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}

// Placeholders show in `npm run dev` as a reminder, never on the live site.
export const visibleTestimonials = import.meta.env.DEV ? testimonials : testimonials.filter((t) => !t.placeholder);

export function Testimonials() {
  return (
    <div className="quotes">
      {visibleTestimonials.map((t, i) => (
        <figure key={i} className={`card quote-card reveal reveal-delay-${i} ${t.placeholder ? "is-placeholder" : ""}`}>
          {t.placeholder && <span className="placeholder-flag">Placeholder</span>}
          <div className="quote-mark" aria-hidden="true">“</div>
          <blockquote>{t.quote}</blockquote>
          <figcaption className="quote-person">
            <span className="avatar" aria-hidden="true">
              {t.name.charAt(0)}
            </span>
            <span>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? "is-open" : ""}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{f.q}</span>
            <span className="faq-toggle">
              <Icon name="plus" size={18} />
            </span>
          </button>
          <div className="faq-body">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-box reveal">
          <div>
            <p className="eyebrow">Free consultation</p>
            <h2>Your next business is one conversation away.</h2>
            <p>Tell us your budget and goals. We'll come back with brands that fit, and a clear plan to get you open.</p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-gold">
              Book a free consultation <Icon name="arrow" size={18} />
            </Link>
            <a href="/Unnati-Ladder-Profile.pdf" className="btn btn-line-light" target="_blank" rel="noreferrer">
              <Icon name="download" size={18} /> Download company profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
