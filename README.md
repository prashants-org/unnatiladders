# Unnati Ladder Website

Source for **[unnatiladder.com](https://unnatiladder.com)**, the website of **Unnati Ladder** (*"Growing Together"*), a Pune-based franchise and business consultancy.

Built with **React 19 + Vite**, deployed to **GitHub Pages** by GitHub Actions. Includes a private admin at `/admin/` for editing brands and the company profile PDF.

## Pages

| Route | Page |
|---|---|
| `/` | Home: hero, featured franchises, process, services, client stories, FAQ |
| `/services` | The six services in detail |
| `/franchises` | Brand catalogue with industry filter and search |
| `/about` | Company story and founder |
| `/contact` | Enquiry form, contact details, map |
| `/admin/` | Private editor (not linked, not indexed). See below. |

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
```

## Editing content

| What | Where |
|---|---|
| Brands (Franchises page and homepage) | `src/content/brands.json`, or via `/admin/` |
| Company profile text and contacts | `profile/content.json`, or via `/admin/` |
| Profile franchise catalogue | `profile/catalogue.json`, or via `/admin/` |
| Other site text (services, FAQ, steps…) | `src/data.js` |
| Logos and brand images | `public/brands/` |

## Admin (`/admin/`)

The admin uses [Sveltia CMS](https://github.com/sveltia/sveltia-cms). It isn't linked anywhere on the site and is excluded from search engines. Saving requires a GitHub account with write access to this repository, so visitors who find the URL can't change anything.

**To sign in:**

1. Create a GitHub **fine-grained personal access token**: GitHub → Settings → Developer settings → Fine-grained tokens → *Generate new token*.
   - Resource owner: **prashants-org**. Repository access: **only `unnatiladders`**.
   - Permissions: **Contents: Read and write**.
   - Set an expiry date (e.g. 90 days).
2. Open **https://unnatiladder.com/admin/**, choose **Sign In Using Access Token** and paste the token.

The browser remembers the token. Only sign in on your own devices, and use *Log out* on shared computers.

**What happens when you save:** each save is committed to `main`. The **Deploy site** workflow then regenerates the company profile PDF, rebuilds the site and publishes it, which takes about 2 minutes.

## Company profile PDF

`profile/build.py` turns `profile/content.json`, `profile/catalogue.json` and the brand logos into `public/Unnati-Ladder-Profile.pdf` (10 pages, landscape A4). The deploy workflow runs it automatically. To build it locally:

```bash
pip install qrcode
python profile/build.py      # needs Google Chrome or Microsoft Edge installed
```

## Enquiry form

The contact form sends enquiries by email through [Web3Forms](https://web3forms.com). Create a free access key for `info@unnatiladder.com`, then add it as a repository secret named `VITE_WEB3FORMS_KEY` (Settings → Secrets and variables → Actions). Until then, the form asks visitors to call or WhatsApp instead.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install → build the profile PDF → build the site → deploy to GitHub Pages. In **Settings → Pages**, the source must be **GitHub Actions**. The custom domain comes from `public/CNAME`.

## Contact

Unnati Ladder · LG-03, East Court, Phoenix Market City, Viman Nagar, Pune 411014 · [info@unnatiladder.com](mailto:info@unnatiladder.com) · +91 93269 50999
