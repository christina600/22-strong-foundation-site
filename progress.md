# Progress — 22 Strong Foundation

## Latest: Fix nav bar jump after Lenis smooth-scroll install

**Date:** June 23, 2026

### Problem
After installing [Lenis](https://lenis.studiofreight.com/) for smooth scrolling and enabling scroll-triggered reveal animations (commit `fd9894d`), the sticky site header lost its `position: sticky` behavior and anchor-link jumps shifted to the wrong vertical offset.

### Root Cause
Lenis' default config wraps page content in a new `<div>` and applies CSS `transform` to it. That creates a new stacking context, which **breaks `position: sticky`** on descendants (including the `<header>`) and changes the scroll container that `scroll-margin-top` is measured against.

### Fix
Two targeted changes restored the nav to its pre-Lenis behavior without losing smooth scrolling:

1. **`src/scripts/smooth-scroll.ts`** — Passed `wrapper: document.documentElement` to `new Lenis()` so Lenis attaches to `<html>` instead of wrapping the DOM tree.
2. **`src/styles/home-base.css`** — Added Lenis' official CSS helpers:
   - `html.lenis, html.lenis body { height: auto; }`
   - `.lenis.lenis-smooth { scroll-behavior: auto !important; }` (prevents native smooth-scroll from fighting Lenis)
   - `.lenis.lenis-stopped { overflow: hidden; }`
   - `.lenis.lenis-scrolling { overflow: clip; }`

### Files Changed
| File | Change |
| --- | --- |
| `src/scripts/smooth-scroll.ts` | Added `wrapper: document.documentElement` option to the Lenis constructor |
| `src/styles/home-base.css` | Added Lenis helper rules after the base `html` block |

### Result
- Sticky header stays pinned correctly at the top of the viewport.
- Anchor links scroll smoothly to the right offset (respects `scroll-margin-top`).
- Scroll reveal animations (`data-scroll-reveal`) and stat counters (`data-count`) still fire normally.
- Mobile nav (`initMobileNav`) unaffected.

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