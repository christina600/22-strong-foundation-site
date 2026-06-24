# Progress — 22 Strong Foundation

## Latest: Remove Lenis, fix nav bar positioning

**Date:** June 23, 2026

### Problem
After installing [Lenis](https://lenis.studiofreight.com/) for smooth scrolling (commit `fd9894d`), the sticky site header lost its `position: sticky` behavior, the Donate/Contact buttons floated out of place, and a white gap appeared above the dark header.

### Root Cause
Lenis applies `transform: translate3d()` to the scroll container (`<html>` or `<body>`). This creates a **new CSS containing block**, which fundamentally breaks `position: sticky` and `position: fixed` on all descendants — the header scrolls with the page instead of staying pinned. No Lenis config option avoids this; the transform is core to how Lenis works.

Additionally, the `.nav-toggle` hamburger button had no default `display: none`, so it was visible on desktop/tablet, pushing the nav-actions buttons out of their grid slot.

### Fix
Removed Lenis entirely and reverted to native CSS `scroll-behavior: smooth` (already configured in `home-base.css`).

1. **`src/scripts/smooth-scroll.ts`** — Removed Lenis import and initialization. Kept IntersectionObservers for scroll-reveal animations and stat counters (they work independently).
2. **`src/scripts/site-navigation.ts`** — Removed all `lenis` imports. Reverted scroll functions to `window.scrollY` and `window.scrollTo()`. Reverted mobile nav to CSS-based `body.nav-open` scroll-lock.
3. **`src/styles/home-base.css`** — Removed Lenis CSS helpers. Added `.nav-toggle { display: none }` default so the hamburger only appears on mobile (≤560px).
4. **`package.json`** — Removed `lenis` dependency via `npm uninstall`.

### Files Changed
| File | Change |
| --- | --- |
| `src/scripts/smooth-scroll.ts` | Removed Lenis; kept scroll-reveal and stat counter observers |
| `src/scripts/site-navigation.ts` | Removed lenis imports; reverted to native `window.scrollY` / `window.scrollTo()` |
| `src/styles/home-base.css` | Removed Lenis CSS helpers; added `.nav-toggle { display: none }` default |
| `package.json` / `package-lock.json` | Removed `lenis` dependency |

### Result
- Sticky header stays pinned at the top of the viewport.
- Donate/Contact buttons properly aligned in the nav grid.
- No white gap above the header.
- Anchor links scroll smoothly (native CSS `scroll-behavior: smooth`).
- Scroll-reveal animations and stat counters still work (IntersectionObserver-based).
- Mobile menu still works (CSS `nav-open` class handles scroll-lock).

---

## Cumulative Phase 1 Recap (for context)
Recent commits leading to this point:

1. **`1f70fb9`** — Give CTAs a distinctive signature (tracking).
2. **`4e900f5`** — Mobile performance & aesthetic improvements.
3. **`d67c251`** — Implement fully functional mobile navigation (focus trap, escape-to-close, body-scroll-lock, Lenis pause/resume).
4. **`3f1202e`** — Technical improvements and accessibility enhancements.
5. **`803c051`** — Optimize all images through the Astro Image pipeline (WebP).
6. **`e39fcfb`** — Consolidate CSS from 28 → 11 files, project hygiene (Prettier, EditorConfig).
7. **`918250e`** — Add ESLint, Vitest unit tests, CI workflow, strip verbose comments.
8. **`fd9894d`** — Add Lenis smooth scroll and scroll-triggered reveal animations. ← *what broke the nav*
9. **This fix** — Restore sticky header and anchor offsets post-Lenis.