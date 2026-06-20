# 22 Strong Foundation Site

Static Astro site for 22 Strong Foundation. The site builds to plain HTML, CSS, and JavaScript in `dist/` and can be deployed to any static host.

## Commands

```sh
npm install
npm run dev
npm run check-templates
npm run build
```

`npm run dev` starts the local Astro server. If port `4321` is already in use, Astro will choose the next open port.

## Project Structure

```text
public/                         Static images, videos, fonts, favicon, robots.txt
src/content/home.json            Homepage copy, stats, testimonials, and section data
src/content/site.json            Organization config, donation amounts, URLs, analytics flags
src/content/strings/en.json      Reused interface labels
src/components/Analytics.astro   Optional GA4/Plausible script loader
src/components/sections/         Homepage section components
src/layouts/HomeBase.astro       HTML shell, metadata, styles, and homepage scripts
src/pages/index.astro            Single-page homepage
src/scripts/dom-target.ts        Shared delegated-event target normalizer
src/scripts/events.ts            Shared browser event names
src/scripts/                     Donation, nav, form, modal, reveal, and video behavior
src/styles/                      Foundation styles plus premium visual layers
src/utils/config.ts              Shared guard for optional config values
scripts/check-templates.mjs      Build guard for unfinished TEMPLATE: content
```

## Content And Config

Most editable site content lives in `src/content/home.json`.

Operational settings live in `src/content/site.json`:

- `donateUrl`: leave empty until the secure giving platform is ready. The donation button routes to contact while this is blank.
- `donationAmounts` and `defaultAmountIndex`: control the suggested gift buttons.
- `donationImpact`: controls the impact line shown in the donation module.
- `analyticsProvider` and `analyticsId`: leave empty to keep analytics disabled. Supported providers are `ga4` and `plausible`.
- `siteUrl`: used for canonical metadata and sitemap output.

Run `npm run check-templates` before publishing. It fails if any content JSON value still starts with `TEMPLATE:`.

## Styling Notes

The CSS is layered intentionally:

- `home-foundation*.css`: base layout, section structure, and non-premium defaults.
- `home-premium*.css`: polished visual layer, accessibility refinements, and responsive adjustments.
- `home-motion.css`: reveal and reduced-motion behavior.

Keep new visual changes close to the section they affect, and prefer existing custom properties in `home-premium-theme.css` before adding new values.

The old one-off `home-premium-polish.css` layer has been retired. Premium refinements should live in the relevant section file or in the existing premium accessibility/responsive layers.

## Verification

Before handing off changes, run:

```sh
npm run check-templates
npm run build
git diff --check
```

For visual work, also verify the local preview on desktop and mobile widths.
