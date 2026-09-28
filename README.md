# TISEF Website

Static front-end website for TISEF (Thrive Integrated Safety and Empowerment Foundation).

**Tech stack:** plain HTML, CSS, and JavaScript — no build step, no server required. This means it can be hosted for free on GitHub Pages.

## Files

```
tisef-website/
├── index.html      → the whole site (single page)
├── styles.css       → all styling
├── script.js        → nav, stage tabs, quick exit, contact form
├── assets/
│   ├── emblem.svg     → vector emblem (nav + favicon; hero uses an animated inline copy)
│   ├── logo-full.png  → full lockup (footer)
│   ├── logo-original.jpg → your original logo file
│   └── favicon.png
└── README.md
```

## How to host this for free on GitHub Pages

1. **Create a repository.** On github.com, click "New repository." Name it anything (e.g. `tisef-website`). Keep it Public. Don't add a README (you already have one here).
2. **Upload the files.** On the new repo page, click "uploading an existing file" and drag in `index.html`, `styles.css`, `script.js`, `README.md`, and the `assets` folder (with the logo files inside it) — keep the same folder structure. Commit the changes.
3. **Turn on Pages.** Go to the repo's **Settings** tab → **Pages** (left sidebar) → under "Build and deployment," set **Source** to "Deploy from a branch," pick branch **main** and folder **/ (root)**, then click **Save**.
4. **Wait about a minute**, then refresh that Pages settings page — it will show your live URL, something like:
   `https://<your-github-username>.github.io/tisef-website/`
5. Any time you edit a file and commit the change, the live site updates automatically within a minute or two.

### Using a custom domain (optional)
If TISEF buys a domain later, add it in the same Pages settings screen under "Custom domain," and point the domain's DNS to GitHub Pages following [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## What's not wired up yet

- **Contact form:** currently opens the visitor's email app with the message pre-filled (no server needed). To make it functional for free, the easiest option is [Formspree](https://formspree.io) (free tier) — sign up, get a form endpoint, and change the submit handler in `script.js` to POST there instead of opening the visitor's email app.
- **Blog / CMS / donations / portals:** this site covers the informational front-end only, matching Phase 0 of the project scope. Later phases (CMS, e-commerce, secure portals) will need a backend and database, which GitHub Pages cannot host — that would need separate hosting.

## Editing content

All page content lives in `index.html` — headings, program descriptions, and contact details are plain text in the HTML, easy to update without touching the CSS or JS. Colors (sampled from the logo) and fonts are defined once at the top of `styles.css` under `:root` if the brand palette ever needs adjusting.
