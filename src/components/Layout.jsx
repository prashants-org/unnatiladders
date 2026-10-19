import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Icon, { WhatsAppIcon } from "./Icon";
import { contact } from "../data";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Services" },
  { to: "/franchises", label: "Franchises" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/** Spinning gradient ring laid over the badge border (Gemini-style). Place inside a .brand box. */
function LogoRing() {
  return (
    <>
      <span className="logo-glow" aria-hidden="true">
        <span className="logo-ring" />
      </span>
      <span className="logo-ring" aria-hidden="true" />
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${solid ? "is-solid" : ""} ${open ? "menu-open" : ""}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Unnati Ladder home">
          <img className="logo-light" src="/logo-light.svg" alt="Unnati Ladder – Growing Together" />
          <img className="logo-dark" src="/logo.svg" alt="" aria-hidden="true" />
          <LogoRing />
        </Link>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn-gold btn-sm nav-cta">
            Book a free consultation
          </Link>
        </nav>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand" aria-label="Unnati Ladder home">
            <img src="/logo-light.svg" alt="Unnati Ladder – Growing Together" />
            <LogoRing />
          </Link>
          <p>Franchise and business consultancy helping entrepreneurs own proven brands and build new ones.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
            <li>
              <a href="/Unnati-Ladder-Profile.pdf" target="_blank" rel="noreferrer">
                Company profile (PDF)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <p>
            {contact.address[0]}
            <br />
            {contact.address[1]}
          </p>
          <p>{contact.hours}</p>
        </div>
        <div>
          <h4>Talk to us</h4>
          <ul>
            <li>
              <a href={contact.phoneHref}>{contact.phone}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Unnati Ladder. All rights reserved.</span>
        <span>Growing Together</span>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <a className="whatsapp-fab" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon />
      </a>
    </>
  );
}
