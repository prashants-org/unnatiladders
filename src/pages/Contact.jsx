import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon, { WhatsAppIcon } from "../components/Icon";
import { PageHero, useReveal } from "../components/Sections";
import { brands, contact } from "../data";

// Enquiries are emailed via Web3Forms (free). Create an access key at https://web3forms.com
// using info@unnatiladder.com, then put it in a .env file:  VITE_WEB3FORMS_KEY=your-key
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const INTERESTS = ["Taking a franchise", "Running multiple brands", "Launching my own brand", "Investing as a partner", "Something else"];

export default function Contact() {
  useReveal();
  const [params] = useSearchParams();
  const preset = params.get("brand") || "";
  const [status, setStatus] = useState("idle");
  // Controlled and set in an effect: the page is pre-rendered without the ?brand= query, and
  // React doesn't patch a server/browser mismatch in a select's initial value when hydrating.
  const [interest, setInterest] = useState("");
  const [brand, setBrand] = useState("");
  useEffect(() => {
    if (!preset) return;
    setBrand(preset);
    setInterest((current) => current || INTERESTS[0]);
  }, [preset]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    if (!WEB3FORMS_KEY) {
      setStatus("not-configured");
      return;
    }
    setStatus("sending");
    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `New enquiry from ${data.get("name")} (unnatiladder.com)`);
    data.append("from_name", "Unnati Ladder website");
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.reset();
        setInterest("");
        setBrand("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's plan your next business.">
        Call, WhatsApp or send your details. A consultant will get in touch to understand your goals. No cost, no
        obligation.
      </PageHero>
      <section className="section section-soft">
        <div className="container contact-grid">
          <div className="contact-info reveal">
            <a className="contact-tile" href={contact.phoneHref}>
              <span className="icon-chip"><Icon name="phone" /></span>
              <span>
                <strong>Call us</strong>
                {contact.phone}
              </span>
            </a>
            <a className="contact-tile whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer">
              <span className="icon-chip"><WhatsAppIcon size={22} /></span>
              <span>
                <strong>WhatsApp</strong>
                Quick questions, same number
              </span>
            </a>
            <a className="contact-tile" href={`mailto:${contact.email}`}>
              <span className="icon-chip"><Icon name="mail" /></span>
              <span>
                <strong>Email</strong>
                {contact.email}
              </span>
            </a>
            <div className="contact-tile">
              <span className="icon-chip"><Icon name="pin" /></span>
              <span>
                <strong>Office</strong>
                {contact.address[0]}, {contact.address[1]}
              </span>
            </div>
            <div className="contact-tile">
              <span className="icon-chip"><Icon name="clock" /></span>
              <span>
                <strong>Hours</strong>
                {contact.hours}
              </span>
            </div>
          </div>

          <div className="card form-card reveal reveal-delay-1">
            {status === "sent" ? (
              <div className="form-success" role="status">
                <span className="icon-chip solid"><Icon name="check" /></span>
                <h2>Thanks, we've got it!</h2>
                <p className="muted">A consultant will contact you soon. For anything urgent, call or WhatsApp us.</p>
                <button className="btn btn-line" onClick={() => setStatus("idle")}>Send another enquiry</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div>
                  <h2>Get a free consultation</h2>
                  <p className="muted">Tell us a little about yourself and what you're looking for.</p>
                </div>
                <input type="checkbox" name="botcheck" className="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true" />
                <div className="field-row">
                  <label>
                    Full name
                    <input name="name" required autoComplete="name" placeholder="Your name" />
                  </label>
                  <label>
                    Phone
                    <input name="phone" type="tel" required autoComplete="tel" pattern="[0-9+\s\-]{10,15}" placeholder="+91" />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    Email
                    <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
                  </label>
                  <label>
                    City
                    <input name="city" autoComplete="address-level2" placeholder="e.g. Pune" />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    I'm interested in
                    <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} required>
                      <option value="" disabled>Choose one</option>
                      {INTERESTS.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </label>
                  <label>
                    Brand
                    <select name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                      <option value="">Not sure yet</option>
                      {brands.map((b) => <option key={b.slug}>{b.name}</option>)}
                    </select>
                  </label>
                </div>
                <label>
                  Message
                  <textarea name="message" rows="4" placeholder="Budget, timeline, or anything you'd like us to know" />
                </label>
                {status === "error" && <p className="form-error">Sorry, that didn't go through. Please call or WhatsApp us instead.</p>}
                {status === "not-configured" && (
                  <p className="form-error">The enquiry form isn't connected yet. Please call or WhatsApp us on {contact.phone}.</p>
                )}
                {import.meta.env.DEV && !WEB3FORMS_KEY && (
                  <p className="dev-note">Preview only: add VITE_WEB3FORMS_KEY to a .env file to have enquiries emailed to you.</p>
                )}
                <button className="btn btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send enquiry"} <Icon name="arrow" size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="container">
          <iframe className="map reveal" title="Unnati Ladder office location" src={contact.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}
