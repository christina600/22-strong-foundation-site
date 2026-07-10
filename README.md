# 22Strong Foundation

Astro site for the 22Strong Foundation nonprofit.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm test
npm run test:hygiene
npm run test:launch
npm run test:e2e
```

Use `npm run check` for the full non-browser gate: lint, unit tests, content
checks, hygiene checks, launch-content checks, and build.

## Deployment

Static output in `dist/`. Deploy anywhere (Netlify, Vercel, Cloudflare Pages, etc.)

## Content

Edit `src/content/home.json` for copy, `src/content/site.json` for config.

## Known Issues

- Contact form is static/local-only and does not send messages.
- Donation flow routes through the local donation module until an approved processor is configured.
- Video transcript content still needs to be supplied.
