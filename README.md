# Unnati Ladder Website

Static copy of **[unnatiladder.com](https://unnatiladder.com)**, the website of **Unnati Ladder**, a Pune-based franchise and business consultancy (*"Growing Together"*).

Unnati Ladder helps clients get franchises of established brands, build their own brands, and find investment opportunities. Its services include franchising, strategic planning, leasing, sales training, branding and idea validation. It was founded by Prashant Srivastava.

## About this repo

The site was originally built on WordPress (Flatsome theme). In September 2024 it was mirrored to plain static files with [HTTrack](https://www.httrack.com/), and it is now served from this repo by **GitHub Pages**. There is no build step and no server-side code.

### Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about-us/index.html` |
| Contact Us | `contact-us/index.html` |

### Layout

```
├── index.html            # Home page
├── about-us/             # About page
├── contact-us/           # Contact page
├── wp-content/           # Theme CSS/JS, plugin assets and uploaded images
├── wp-includes/          # WordPress core front-end scripts
├── fonts.googleapis.com/ # Mirrored Google Fonts CSS
├── urgd.in/              # Mirrored external assets (logo)
├── hts-cache/, hts-log.txt, backblue.gif, fade.gif   # HTTrack mirror files
└── CNAME                 # Custom domain: unnatiladder.com
```

Some files are leftovers from the WordPress mirror and aren't needed by the static site, such as `feed/`, `comments/`, `wp-json/`, `xmlrpc*.php`, the `index*.html` variants and the HTTrack files. They can be removed later if needed.

## Local preview

Open `index.html` in a browser, or run a local server so relative links work:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Editing and deployment

- Edit the HTML/CSS in place. The pages are WordPress output, so expect long, minified markup.
- Commit to `main`. GitHub Pages publishes it automatically, and the custom domain comes from the `CNAME` file.

## Contact

Unnati Ladder · LG-03, East Court, Phoenix Market City, Viman Nagar, Pune 411014 · [info@unnatiladder.com](mailto:info@unnatiladder.com) · +91 93269 50999
