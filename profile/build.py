"""Build the Unnati Ladder company profile PDF.

Content lives in profile/content.json and profile/catalogue.json (edited via /admin).
Partner logos come from src/content/brands.json. Output: public/Unnati-Ladder-Profile.pdf
and public/admin/pdf/index.html (the click-to-edit profile editor).

Usage:  python profile/build.py   (needs Google Chrome/Chromium; `pip install qrcode` for QR codes)
"""
import html, json, os, re, shutil, subprocess, sys
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PUBLIC = os.path.join(ROOT, "public")
OUT_DIR = os.path.join(HERE, "build")
PDF_OUT = os.path.join(PUBLIC, "Unnati-Ladder-Profile.pdf")
EDITOR_DIR = os.path.join(PUBLIC, "admin", "pdf")


def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


content = load(os.path.join(HERE, "content.json"))
# Flatten the sectioned content.json into the simple keys used below
C = {
    "year": content["cover"]["year"],
    "cover_headline": content["cover"]["headline"],
    "cover_headline_accent": content["cover"]["headline_accent"],
    "cover_lead": content["cover"]["intro"],
    "about_title": content["about"]["title"],
    "about_paragraphs": content["about"]["paragraphs"],
    "years": content["numbers"]["years"],
    "clients": content["numbers"]["clients"],
    "offices": content["numbers"]["offices"],
    "founder_name": content["founder"]["name"],
    "founder_title": content["founder"]["title"],
    "founder_photo": content["founder"]["photo"],
    "founder_bio": content["founder"]["bio"],
    "founder_tags": content["founder"]["highlights"],
    "commercials": content["commercials"],
    "catalogue_note": content["catalogue_note"],
    **content["contact"],
}
# Catalogue is grouped by industry; flatten to rows with a "group" key
catalogue = load(os.path.join(HERE, "catalogue.json"))
rows = [dict(r, group=ind["name"], _ind=i, _path=f"industries.{i}.rows.{j}")
        for i, ind in enumerate(catalogue["industries"]) for j, r in enumerate(ind.get("rows") or [])]
IND_INDEX = {ind["name"]: i for i, ind in enumerate(catalogue["industries"])}
site_brands = load(os.path.join(ROOT, "src", "content", "brands.json"))["brands"]
groups = OrderedDict()
for r in rows:
    groups.setdefault(r["group"], []).append(r)

e = html.escape
PHONE, PHONE2 = C["phone"], C.get("phone2") or ""
EMAIL, WEB = C["email"], C["website"]
ADDRESS = C["address"]


EDIT = False  # True while rendering the click-to-edit version


def asset(public_path):
    """Image path: relative to profile/build/ for the PDF, site-absolute for the editor."""
    return "/" + public_path.lstrip("/") if EDIT else "../../public/" + public_path.lstrip("/")


def ed(path, value, multiline=False):
    """Escaped text; in edit mode wrapped so the editor knows which JSON field it is."""
    if not EDIT:
        return e(value)
    return f'<span class="ed" data-path="{path}"{" data-ml" if multiline else ""}>{e(value)}</span>'


def ed_list(path, items, sep):
    """A list shown as joined text (e.g. office cities); the editor splits it back."""
    text = e(sep.join(items))
    return f'<span class="ed" data-path="{path}" data-sep="{e(sep)}">{text}</span>' if EDIT else text


def make_qr(name, data):
    try:
        import qrcode
        import qrcode.image.svg
    except ImportError:
        print("qrcode not installed: skipping QR codes (pip install qrcode)")
        return None
    path = os.path.join(OUT_DIR, name + ".svg")
    qrcode.make(data, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1).save(path)
    return name + ".svg"


os.makedirs(OUT_DIR, exist_ok=True)
QR_WA = make_qr("qr-whatsapp", f"https://wa.me/{C['whatsapp']}")
QR_WEB = make_qr("qr-website", f"https://{ed("contact.website", WEB)}")

ICONS = {
    "store": "M3 9l1.5-5h15L21 9M3 9h18M3 9v1a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0V9M5 13v7h14v-7M10 20v-4h4v4",
    "layers": "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
    "spark": "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6",
    "chart": "M4 20V10M10 20V4M16 20v-7M22 20H2",
    "handshake": "M11 17l2 2a1 1 0 103-3M14 14l2.5 2.5a1 1 0 103-3l-3.88-3.88a3 3 0 00-4.24 0l-.88.88a1 1 0 11-3-3l2.81-2.81a5.79 5.79 0 017.06-.87l.47.28a2 2 0 001.42.25L21 4M21 3l1 11h-2M3 3L2 14l6.5 6.5a1 1 0 103-3M3 4h8",
    "compass": "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5 5-2z",
    "key": "M7.5 16a4 4 0 110-8 4 4 0 010 8zM11.5 12H21M18 12v3M21 12v2",
    "users": "M16 20v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 11a4 4 0 100-8 4 4 0 000 8zM22 20v-1a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
    "badge": "M12 15a6 6 0 100-12 6 6 0 000 12zM8.5 14L7 22l5-3 5 3-1.5-8",
    "bulb": "M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z",
    "phone": "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z",
    "mail": "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6",
    "pin": "M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    "globe": "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18",
    "clock": "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    "check": "M5 12.5l4.5 4.5L19 7.5",
}


def icon(name, size=22):
    return (f'<svg class="ic" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="{ICONS[name]}"/></svg>')


TOTAL_PAGES = 10


def footer(n, dark=False):
    return (f'<footer class="pf {"on-dark" if dark else ""}"><span>Unnati Ladder · Company Profile</span>'
            f'<span>{ed("contact.website", WEB)}</span><span>{n:02d} / {TOTAL_PAGES:02d}</span></footer>')


def build_pages():
    pages = []


    def sec(num, label):
        return f'<div class="sec"><span class="sec-label">{label}</span><span class="sec-num">{num}</span></div>'


    def lakhs(v):
        """Lower bound of an investment string in lakh, e.g. '₹1.5–2 Cr' -> 150."""
        import re
        m = re.match(r"₹([\d.]+)", v)
        if not m:
            return None
        n = float(m.group(1))
        return n * 100 if "Cr" in v else n


    min_inv = min(x for x in (lakhs(r["investment"]) for r in rows) if x)
    min_inv_txt = f"₹{min_inv:g} L"

    # 1. Cover --------------------------------------------------------------
    logo_brands = [b for b in site_brands if b.get("image_type", "logo") == "logo"]
    cover_brands = (sorted(logo_brands, key=lambda b: not b.get("featured")) * 2)[:9]
    tiles = "".join(f'<div class="tile"><img src="{asset(b["image"])}"></div>' for b in cover_brands)
    pages.append(f"""
    <section class="page dark cover">
      <div class="grid-bg"></div>
      <img class="cover-logo" src="{asset('/logo-light.svg')}">
      <div class="cover-copy">
        <p class="eyebrow">Company Profile · {ed("cover.year", C["year"])}</p>
        <h1>{ed("cover.headline", C["cover_headline"])} <span class="accent">{ed("cover.headline_accent", C["cover_headline_accent"])}</span></h1>
        <p class="lead">{ed("cover.intro", C["cover_lead"], True)}</p>
      </div>
      <div class="cover-stats"><span><b>{ed("numbers.years", C["years"])}</b> years</span><span><b>{ed("numbers.clients", C["clients"])}</b> clients</span><span><b>{len(rows)}</b> franchise formats</span><span><b>{len(groups)}</b> industries</span></div>
      <div class="ladder"><i></i><i></i><i></i><i></i></div>
      <div class="cover-tiles">{tiles}</div>
      <div class="cover-contact">
        <span>{icon('phone', 16)} {ed("contact.phone", PHONE)}</span><span>{icon('mail', 16)} {ed("contact.email", EMAIL)}</span><span>{icon('globe', 16)} {ed("contact.website", WEB)}</span>
      </div>
    </section>""")

    # 2. About + founder ------------------------------------------------------
    pages.append(f"""
    <section class="page inner">
      {sec("01", "About")}
      <div class="two-col about">
        <div>
          <p class="eyebrow">About us</p>
          <h2>{ed("about.title", C["about_title"])}</h2>
          {''.join(f'<p class="body">{ed(f"about.paragraphs.{i}", p, True)}</p>' for i, p in enumerate(C["about_paragraphs"]))}
          <div class="stats">
            <div><b>{ed("numbers.years", C["years"])}</b><span>years in business strategy</span></div>
            <div><b>{ed("numbers.clients", C["clients"])}</b><span>clients across India</span></div>
            <div><b>{len(rows)}</b><span>franchise formats in our catalogue</span></div>
            <div><b>{len(C["offices"])}</b><span>associate offices: {ed_list("numbers.offices", C["offices"], ", ")}</span></div>
          </div>
        </div>
        <div class="founder">
          <img src="{asset(C["founder_photo"])}"{' data-img="founder.photo"' if EDIT else ''}>
          <div class="founder-body">
            <p class="eyebrow">{ed("founder.title", C["founder_title"])}</p>
            <h3>{ed("founder.name", C["founder_name"])}</h3>
            <p>{ed("founder.bio", C["founder_bio"], True)}</p>
            <ul class="chips">{''.join(f'<li>{ed(f"founder.highlights.{i}", t)}</li>' for i, t in enumerate(C["founder_tags"]))}</ul>
          </div>
        </div>
      </div>
      {footer(2)}
    </section>""")

    # 3. Ways to start + franchise models ------------------------------------
    paths = [
        ("store", "Take a franchise", "Run an established brand from day one. We find the right fit and get you registered."),
        ("layers", "Run multiple brands", "Add outlets or new brands across industries, all through one partner."),
        ("spark", "Launch your own brand", "We test your idea, build the brand and plan a launch that gets noticed."),
        ("chart", "Invest as a partner", "Back a growing brand at the right moment, as investor or business partner."),
    ]
    models = [
        ("FOFO", "Franchise Owned, Franchise Operated", ["You own and run the outlet", "Full ownership and control", "Brand provides systems and training"]),
        ("FOCO", "Franchise Owned, Company Operated", ["One-time investment", "The brand runs branding and operations", "A hands-off model for investors"]),
        ("Lease", "Brand Leasing", ["Use the brand for a set duration", "Use the brand in a set location", "Build on its experience for your own brand"]),
    ]
    pages.append(f"""
    <section class="page inner">
      {sec("02", "Paths")}
      <p class="eyebrow">Four ways up</p>
      <h2>Pick the path that fits where you are today.</h2>
      <div class="cards four">{''.join(f'<div class="card"><span class="chip-ic">{icon(i)}</span><span class="num">0{n+1}</span><h3>{t}</h3><p>{d}</p></div>' for n,(i,t,d) in enumerate(paths))}</div>
      <h3 class="sub">Franchise models we work with</h3>
      <div class="cards three models">{''.join(f'<div class="card model"><span class="model-tag">{k}</span><h4>{t}</h4><ul>{"".join(f"<li>{icon(chr(99)+"heck",14)}{p}</li>" for p in pts)}</ul></div>' for k,t,pts in models)}</div>
      {footer(3)}
    </section>""")

    # 4. Services -------------------------------------------------------------
    services = [
        ("handshake", "Franchising", "We match you with the right brand, then take you through registration and the franchise agreement, step by step."),
        ("compass", "Strategic Planning", "A practical plan for your market, sales and marketing, end to end, with support through execution."),
        ("key", "Brand Leasing", "Lease an established brand and reach the market faster, backed by sales methods that have already worked."),
        ("users", "Sales Training", "Hands-on training for you and your sales team, built on the tactics leading brands use."),
        ("badge", "Branding", "Name, identity, concept design and launch marketing that give a new business real presence."),
        ("bulb", "Idea Validation", "Before you invest, we test the idea against the market and help turn it into a go-to-market plan."),
    ]
    expertise = ["Ongoing branding consultancy", "Sales growth consulting", "Training sales teams",
                 "Strategic planning and execution", "Idea creation and concept design", "Go-to-market plans and support"]
    pages.append(f"""
    <section class="page inner">
      {sec("03", "Services")}
      <div class="head-split">
        <div><p class="eyebrow">What we do</p><h2>Six ways we help you grow.</h2></div>
        <p class="body narrow">More than getting you started: we stay with you through execution with a ready package of
          consulting for the areas that matter most.</p>
      </div>
      <div class="bento">{''.join(f'<div class="card {"feature" if n==0 else ""}"><span class="chip-ic">{icon(i)}</span><h3>{t}</h3><p>{d}</p></div>' for n,(i,t,d) in enumerate(services))}</div>
      <div class="expertise"><b>Our expertise also covers</b>{''.join(f'<span>{icon("check",14)}{x}</span>' for x in expertise)}</div>
      {footer(4)}
    </section>""")

    # 5. Process + commercials ---------------------------------------------------
    steps = [("Discover", "Your goals, budget, city and the business you want to run."),
             ("Shortlist", "Brands and models that genuinely fit, compared side by side."),
             ("Secure", "Registration, agreements and planning with our advisors and legal team."),
             ("Launch", "Branding, marketing and sales training so you open with momentum."),
             ("Scale", "Support as you grow: more outlets, more brands, new investments.")]
    pages.append(f"""
    <section class="page dark">
      <div class="grid-bg soft"></div>
      {sec("04", "Process")}
      <p class="eyebrow">How it works</p>
      <h2>From first call to open doors, in five clear steps.</h2>
      <ol class="timeline">{''.join(f'<li><span class="dot">0{n+1}</span><h3>{t}</h3><p>{d}</p></li>' for n,(t,d) in enumerate(steps))}</ol>
      <div class="commercials">
        <div><p class="eyebrow">Commercials</p><h3>Simple, transparent fees.</h3>
          <p class="muted">No surprises: you know what you pay and who pays it before we begin.</p></div>
        <table>
          <thead><tr><th>Service</th><th>Fee</th><th>Charged to</th></tr></thead>
          <tbody>
            {''.join(f'<tr><td>{ed(f"commercials.{i}.service", x["service"])}</td><td>{ed(f"commercials.{i}.fee", x["fee"])}</td><td>{ed(f"commercials.{i}.charged_to", x["charged_to"])}</td></tr>' for i, x in enumerate(C["commercials"]))}
          </tbody>
        </table>
      </div>
      {footer(5, dark=True)}
    </section>""")

    # 6. Brand partners -------------------------------------------------------------
    partners = site_brands
    industries = list(groups.keys())
    pages.append(f"""
    <section class="page inner">
      {sec("05", "Partners")}
      <div class="head-split">
        <div><p class="eyebrow">Our brand partners</p><h2>Brands people already know and love.</h2></div>
        <p class="body narrow">A selection of the brands we work with. The full catalogue of {len(rows)} franchise formats
          across {len(industries)} industries follows on the next pages.</p>
      </div>
      <div class="logo-wall">{''.join(f'<div class="logo-cell {"photo" if b.get("image_type") == "photo" else ""}"><img src="{asset(b["image"])}"></div>' for b in partners[:13])}
        <div class="logo-cell more"><b>{max(len(rows) - min(len(partners), 13), 0)}+</b><span>more formats</span></div>
      </div>
      <div class="industries">{''.join(f'<span>{e(g)} <i>{len(v)}</i></span>' for g,v in groups.items())}</div>
      <div class="numbers">
        <div><b>{len(rows)}</b><span>franchise formats</span></div>
        <div><b>{len(groups)}</b><span>industries</span></div>
        <div><b>{min_inv_txt}</b><span>starting investment</span></div>
        <div><b>{ed("numbers.clients", C["clients"])}</b><span>clients served</span></div>
      </div>
      {footer(6)}
    </section>""")

    # 7-8. Catalogue ------------------------------------------------------------------
    lines = []
    for g, items in groups.items():
        lines.append(("group", g, len(items)))
        lines.extend(("row", r, None) for r in items)
    CAP = 32  # lines per column
    cols = []
    cur = []
    for ln in lines:
        if len(cur) >= CAP or (ln[0] == "group" and len(cur) >= CAP - 2):
            cols.append(cur)
            cur = []
        if not cur and ln[0] == "row":
            # continuing group header on a new column
            cur.append(("group", ln[1]["group"] + " (cont.)", None))
        cur.append(ln)
    cols.append(cur)


    def col_html(c):
        out = ['<table class="cat"><thead><tr><th>Brand</th><th>Area</th><th>Franchise fee</th><th>Investment</th><th>Model</th></tr></thead><tbody>']
        for kind, v, n in c:
            if kind == "group":
                name = ed(f"industries.{IND_INDEX[v]}.name", v) if n else e(v)
                out.append(f'<tr class="grp"><td colspan="5">{name}{f" <i>{n}</i>" if n else ""}</td></tr>')
            else:
                pth = v["_path"]
                attrs = f' data-row="{pth}" data-ind="{v["_ind"]}"' if EDIT else ""
                out.append(f'<tr{attrs}><td class="b">{ed(pth + ".brand", v["brand"])}</td><td>{ed(pth + ".area", v["area"])}</td>'
                           f'<td>{ed(pth + ".fee", v["fee"])}</td><td class="inv">{ed(pth + ".investment", v["investment"])}</td>'
                           f'<td>{ed(pth + ".model", v["model"])}</td></tr>')
        out.append("</tbody></table>")
        return "".join(out)


    cat_pages = [cols[i:i + 2] for i in range(0, len(cols), 2)]
    if len(cat_pages) != 2:
        sys.exit(f"Catalogue needs {len(cat_pages)} pages but the layout fits 2 (about 120 lines). Remove some rows or add a third catalogue page.")
    for pi, pair in enumerate(cat_pages):
        title = ("Franchise catalogue", "Find your format.") if pi == 0 else ("Franchise catalogue (continued)", "More formats, more industries.")
        pages.append(f"""
    <section class="page inner catalogue">
      {sec("06", "Catalogue")}
      <div class="head-split tight">
        <div><p class="eyebrow">{title[0]}</p><h2>{title[1]}</h2></div>
        <p class="note">{ed("catalogue_note", C["catalogue_note"], True)}
          FOFO: franchise owned, franchise operated. FOCO: franchise owned, company operated. L = lakh, Cr = crore.</p>
      </div>
      <div class="cat-cols">{''.join(col_html(c) for c in pair)}</div>
      {footer(7 + pi)}
    </section>""")

    # 9. Why us -------------------------------------------------------------------
    why = [("check", "You come first", "We put your requirements ahead of the deal. Every recommendation is relevant to you and explained transparently."),
           ("users", "One team, every skill", "Marketers, advisors and lawyers work together on your business, so nothing falls between the cracks."),
           ("compass", "Guided start to finish", "From understanding your idea to marketing your brand, an expert oversees every step, and your input shapes the plan.")]
    pages.append(f"""
    <section class="page inner">
      {sec("07", "Why us")}
      <p class="eyebrow">Why Unnati Ladder</p>
      <h2>What makes us different.</h2>
      <div class="cards three why">{''.join(f'<div class="card"><span class="chip-ic">{icon(i)}</span><h3>{t}</h3><p>{d}</p></div>' for i,t,d in why)}</div>
      <div class="faq">
        <div><h4>How much do I need to invest?</h4><p>It depends on the brand and format. Our catalogue starts from a few lakh for kiosks and mobile formats.</p></div>
        <div><h4>I've never run a business. Can I still do this?</h4><p>Yes. Many of our clients are first-time entrepreneurs; a franchise comes with a proven system, and we train you.</p></div>
        <div><h4>What happens after I get in touch?</h4><p>A consultant calls to understand your goals and budget, then shortlists options for you. No obligation.</p></div>
      </div>
      <div class="cta-strip"><div><h3>Ready to take the next step?</h3><p>Book a free, no-obligation consultation with our team.</p></div>
        <span class="pill">{icon('phone', 16)} {ed("contact.phone", PHONE)}</span></div>
      {footer(9)}
    </section>""")

    # 10. Back cover ----------------------------------------------------------------
    pages.append(f"""
    <section class="page dark back">
      <div class="grid-bg"></div>
      <div class="back-copy">
        <p class="eyebrow">Free consultation</p>
        <h1 class="smaller">Your next business is one conversation away.</h1>
        <p class="lead">Tell us your budget and goals. We'll come back with brands that fit, and a clear plan to get you open.</p>
      </div>
      <div class="contact-grid">
        <div>{icon('phone')}<span><b>Call / WhatsApp</b>{ed("contact.phone", PHONE)}{"<br>" + ed("contact.phone2", PHONE2) if PHONE2 else ""}</span></div>
        <div>{icon('mail')}<span><b>Email</b>{ed("contact.email", EMAIL)}</span></div>
        <div>{icon('globe')}<span><b>Website</b>{ed("contact.website", WEB)}</span></div>
        <div>{icon('pin')}<span><b>Office</b>{ed("contact.address", ADDRESS, True)}</span></div>
        <div>{icon('clock')}<span><b>Hours</b>{ed("contact.hours", C["hours"])}</span></div>
        <div>{icon('users')}<span><b>Associate offices</b>{ed_list("numbers.offices", C["offices"], " · ")}</span></div>
      </div>
      <img class="back-logo" src="{asset('/logo-light.svg')}">
      <div class="qrs">
        {f'<div class="qr"><img src="{QR_WA}"><span><b>Chat on WhatsApp</b>Scan to message us</span></div>' if QR_WA else ''}
        {f'<div class="qr"><img src="{QR_WEB}"><span><b>Visit our website</b>{ed("contact.website", WEB)}</span></div>' if QR_WEB else ''}
      </div>
    </section>""")

    assert len(pages) == TOTAL_PAGES, len(pages)
    return pages



pages = build_pages()
css = open(os.path.join(HERE, "profile.css"), encoding="utf-8").read()
doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Unnati Ladder – Company Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">
<style>{css}</style></head><body>{''.join(pages)}</body></html>"""
html_path = os.path.join(OUT_DIR, "profile.html")
with open(html_path, "w", encoding="utf-8") as fh:
    fh.write(doc)


def find_chrome():
    candidates = [os.environ.get("CHROME"), "google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
                  r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                  r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
    for c in candidates:
        if c and (shutil.which(c) or os.path.exists(c)):
            return shutil.which(c) or c
    sys.exit("Chrome/Chromium not found. Set the CHROME environment variable to its path.")


url = "file:///" + html_path.replace(os.sep, "/").lstrip("/")
cmd = [find_chrome(), "--headless=new", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
       "--virtual-time-budget=15000", "--run-all-compositor-stages-before-draw", f"--print-to-pdf={PDF_OUT}", url]
subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"Built {PDF_OUT}: {len(pages)} pages, {len(rows)} catalogue rows")


# ---------------------------------------------------------------------------- editor
# Same pages, with editable fields tagged, served at /admin/pdf/ (not linked, not indexed).
EDIT = True
editor_pages = build_pages()
os.makedirs(EDITOR_DIR, exist_ok=True)
for q in (QR_WA, QR_WEB):
    if q:
        shutil.copy(os.path.join(OUT_DIR, q), os.path.join(EDITOR_DIR, q))
snapshot = json.dumps({"content": content, "catalogue": catalogue}, ensure_ascii=False).replace("</", "<\\/")
editor_doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Company profile editor · Unnati Ladder</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">
<style>{css}</style><link rel="stylesheet" href="editor.css"></head>
<body class="pdf-editor"><div id="pages">{''.join(editor_pages)}</div>
<script id="snapshot" type="application/json">{snapshot}</script>
<script src="editor.js"></script></body></html>"""
with open(os.path.join(EDITOR_DIR, "index.html"), "w", encoding="utf-8") as fh:
    fh.write(editor_doc)
print(f"Built {os.path.join(EDITOR_DIR, 'index.html')} (click-to-edit profile)")
