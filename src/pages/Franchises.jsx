import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { BrandCard, CtaBand, PageHero, useReveal } from "../components/Sections";
import { brands } from "../data";

const ALL = "All";

export default function Franchises() {
  useReveal();
  const [cat, setCat] = useState(ALL);
  const [q, setQ] = useState("");
  const categories = useMemo(() => [ALL, ...new Set(brands.map((b) => b.category))], []);
  const list = brands.filter(
    (b) => (cat === ALL || b.category === cat) && b.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <>
      <PageHero eyebrow="Franchise opportunities" title="Find the brand you'll be proud to run.">
        Food & beverage, automotive, healthcare and home services. Filter by industry, then enquire to get investment
        details and availability in your city.
      </PageHero>
      <section className="section section-soft">
        <div className="container">
          <div className="filters">
            {/* Toggle buttons, not tabs: there are no tab panels, just one filtered list */}
            <div className="chips" role="group" aria-label="Filter by industry">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cat === c}
                  className={`chip ${cat === c ? "is-active" : ""}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                  <span className="chip-count">
                    {c === ALL ? brands.length : brands.filter((b) => b.category === c).length}
                  </span>
                </button>
              ))}
            </div>
            <label className="search">
              <Icon name="search" size={18} />
              <input
                type="search"
                placeholder="Search brands"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search brands"
              />
            </label>
          </div>

          <h2 className="sr-only" aria-live="polite">
            {cat === ALL ? "All brands" : cat}: {list.length} {list.length === 1 ? "brand" : "brands"}
          </h2>
          {list.length ? (
            <div className="brand-grid">
              {list.map((b) => (
                <BrandCard key={b.slug} brand={b} />
              ))}
            </div>
          ) : (
            <p className="empty">No brands match “{q}”. Try another name or industry.</p>
          )}

          <div className="note-card">
            <Icon name="spark" size={28} />
            <p>
              <strong>Looking for something else?</strong> We work with franchises in almost every leading industry and
              the list keeps growing.
            </p>
            <Link to="/contact" className="btn btn-gold btn-sm">
              Tell us what you want <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
