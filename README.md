# Nonprofit Website Template

A professional, accessible, static website template built for nonprofits. Outputs pure HTML — no server required. Deploy to Netlify, Vercel, or any static host.

Built with [Astro](https://astro.build), a static site generator that turns `.astro` files into fast, SEO-friendly HTML pages.

---

## Quick Start

```sh
# 1. Install dependencies (run once, or after pulling updates)
npm install

# 2. Start the local dev server
npm run dev
```

Open **http://localhost:4321** in your browser. Changes to files will hot-reload instantly.

---

## Project Structure

```
nonprofit-template/
├── public/                 Static files copied as-is (fonts, images, favicon)
│   ├── fonts/              Self-hosted Inter + JetBrains Mono
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   ├── content/            Editable JSON data (the main place you'll work)
│   │   ├── site.json       Org name, phone, EIN, donate URL, tagline
│   │   ├── nav.json        Navigation menu structure
│   │   ├── footer.json     Footer headline, body, link groups
│   │   ├── programs.json   Program list (name, description, tags)
│   │   ├── impact.json     Impact metric numbers and labels
│   │   ├── pathway.json    Service pathway steps
│   │   ├── faqs.json       FAQ questions and answers
│   │   ├── strings/en.json UI labels (buttons, form fields, nav text)
│   │   └── pages/          One JSON file per page (title, intro, sections)
│   │
│   ├── pages/              One .astro file = one URL on the live site
│   │   ├── index.astro     Homepage (yoursite.org/)
│   │   ├── donate.astro    Donation page (yoursite.org/donate)
│   │   ├── get-help.astro  Get Help page (yoursite.org/get-help)
│   │   └── ...             48 pages total
│   │
│   ├── layouts/            HTML skeletons inherited by every page
│   │   ├── Base.astro      <html>, <head>, fonts, SEO tags, analytics
│   │   └── Page.astro      Base + Header + Hero + content slot + Footer
│   │
│   ├── components/         Reusable building blocks
│   │   ├── Header.astro    Top navigation bar
│   │   ├── Footer.astro    Bottom footer with links and legal
│   │   ├── Hero.astro      Interior page hero banner
│   │   ├── HeroHome.astro  Homepage hero with donation widget
│   │   ├── Analytics.astro Loads GA4/Plausible if configured
│   │   ├── sections/       Content sections (~30 components)
│   │   └── ui/             Small UI pieces (SectionShell, cards, etc.)
│   │
│   ├── styles/             All CSS, split by concern
│   │   ├── tokens.css      Design tokens (colors, spacing, fonts, shadows)
│   │   ├── base.css        Reset and body defaults
│   │   ├── header.css      Navigation bar styles
│   │   ├── hero.css        Hero section styles
│   │   ├── sections.css    Cards, grids, generic sections
│   │   ├── donation.css    Donation widget styles
│   │   ├── responsive.css  Tablet + mobile breakpoints
│   │   └── ...             17 files total
│   │
│   └── scripts/            Client-side JavaScript (minimal)
│       ├── donation.ts     Amount buttons, frequency toggle
│       ├── scroll-reveal.ts Fade-in animations on scroll
│       ├── nav.ts          Mobile menu toggle
│       ├── parallax.ts     Subtle parallax + scroll progress bar
│       ├── count-up.ts     Number count-up animation
│       ├── journey.ts      Service pathway scroll tracking
│       └── forms.ts        Form validation and submission
│
├── astro.config.mjs        Astro configuration (site URL, sitemap)
└── package.json            Dependencies and npm scripts
```

---

## How to Edit Content

All content lives in `src/content/` as JSON files. Open them in any text editor.

### Edit org info (name, phone, EIN, etc.)

Open `src/content/site.json` and change any value:

```json
{
  "orgName": "Your Organization Name",
  "phone": "(555) 555-1234",
  "ein": "XX-XXXXXXX",
  "donateUrl": "https://your-giving-platform.com/donate"
}
```

### Edit navigation

Open `src/content/nav.json`. Each item has a `label` (what visitors see) and a `page` (which page it links to). Items with `children` create dropdown menus.

### Edit page content

Each page's text is controlled by its JSON file in `src/content/pages/`. For example, `src/content/pages/about.json` controls the About page's headline, intro text, and section content.

### Edit UI labels (buttons, form fields)

Open `src/content/strings/en.json`. This file contains every button label, form field name, and navigation string. If you ever add another language, you'd create a parallel file (e.g., `es.json`).

---

## How to Add a New Page

1. **Create the JSON data file:**
   Copy an existing file in `src/content/pages/` and rename it (e.g., `new-program.json`). Edit the title, intro, and sections.

2. **Create the Astro page file:**
   Copy a similar page from `src/pages/` and rename it (e.g., `new-program.astro`). Update the import to point to your new JSON file.

3. **Add it to navigation (optional):**
   Open `src/content/nav.json` and add an entry pointing to your new page.

The page is live immediately at `yoursite.org/new-program`.

### How to Remove a Page

1. Delete the `.astro` file from `src/pages/`
2. Delete the matching `.json` file from `src/content/pages/`
3. Remove the entry from `src/content/nav.json`

---

## How to Add Programs

Open `src/content/programs.json` and add a new object to the array:

```json
{
  "name": "New Program Name",
  "slug": "new-program",
  "desc": "Brief description of the program.",
  "tags": ["Category"],
  "featured": false
}
```

If you want a dedicated page for it, follow the "Add a New Page" steps above.

---

## How to Update Impact Metrics

Open `src/content/impact.json`:

```json
[
  { "number": "2,400+", "label": "People served annually" },
  { "number": "96%", "label": "Client satisfaction rate" }
]
```

The numbers animate on scroll automatically.

---

## Design Tokens (Colors, Spacing)

All colors, spacing, shadows, and fonts are defined in `src/styles/tokens.css`. Change a value there and it updates everywhere:

```css
:root {
  --burnt-orange: #d9601f;   /* Primary accent color */
  --charcoal: #2d2d2d;       /* Main text color */
  --page: #fbf8f0;           /* Page background */
  --space-4: 16px;           /* Standard spacing unit */
}
```

---

## Analytics

To enable analytics, edit `src/content/site.json`:

```json
{
  "analyticsProvider": "plausible",
  "analyticsId": "yoursite.org"
}
```

Supported providers: `"ga4"` (Google Analytics 4) or `"plausible"`. Leave empty to disable analytics entirely — no tracking scripts will load.

---

## Deployment

### Netlify

1. Push your code to a GitHub repository
2. Log in to [Netlify](https://netlify.com) and click "Add new site" > "Import an existing project"
3. Connect your GitHub repo
4. Build settings are auto-detected. If not:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click "Deploy site"

Netlify will rebuild automatically every time you push changes.

### Vercel

1. Push your code to GitHub
2. Log in to [Vercel](https://vercel.com) and click "Add New Project"
3. Import your repo — Vercel auto-detects Astro
4. Click "Deploy"

### Any Static Host

Run `npm run build` locally. The `dist/` folder contains your complete website as static HTML files. Upload that folder to any web server.

---

## Commands Reference

| Command             | What it does                                    |
| :------------------ | :---------------------------------------------- |
| `npm install`       | Install dependencies (run once after cloning)   |
| `npm run dev`       | Start local dev server at localhost:4321        |
| `npm run build`     | Build production site to `./dist/`              |
| `npm run preview`   | Preview the built site locally before deploying |

---

## TEMPLATE Placeholders

Throughout the content JSON files, you'll see text starting with `TEMPLATE:`. These are placeholders that need to be replaced with your organization's real content before launch. Search for `TEMPLATE` across the project to find them all.

---

## Accessibility

This template includes:
- Semantic HTML headings and landmarks
- Keyboard navigation with visible focus states
- Skip-to-content link
- Screen reader announcements for page transitions
- `prefers-reduced-motion` support (disables all animation)
- Print stylesheet

---

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Astro Tutorial (official)](https://docs.astro.build/en/tutorial/0-introduction/)
