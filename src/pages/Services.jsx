import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import { CtaBand, PageHero, useReveal } from "../components/Sections";
import { services } from "../data";

export default function Services() {
  useReveal();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [hash]);

  return (
    <>
      <PageHero eyebrow="Services" title="Everything it takes to open, and keep growing.">
        One team of marketers, advisors and lawyers, with you from the first idea to the opening day and beyond.
      </PageHero>
      <section className="section section-soft">
        <div className="container service-list">
          {services.map((s, i) => (
            <article key={s.id} id={s.id} className="card service-row reveal">
              <span className="service-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="service-main">
                <span className="icon-chip">
                  <Icon name={s.icon} />
                </span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
              <ul className="ticks">
                {s.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" size={18} /> {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
