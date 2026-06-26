# Progress — 22 Strong Foundation

## Latest: Revert Horizontal Scroll & Fix Hidden Evidence Stats

**Date:** June 23, 2026

### Problem
1. **Empty gap under "2026" numbers section** — The horizontal scroll implementation created a large invisible spacer element (`.horiz-scroll-spacer` with `height: calc(4 * 100vh)`) that left a huge empty gap on the page.
2. **Missing $190 and 58% evidence stats** — The stats in the About section (below "SO FAR IN 2026" impact band) were not visible.

### Root Cause Analysis

**Issue 1: Horizontal Scroll Spacer**
The Phase 3 horizontal scroll feature used a sticky pin layout with a scroll spacer to provide vertical scroll distance for horizontal card movement. This spacer was 4x viewport height (400vh) and created an empty gap when scrolling past the "How It Works" section.

**Issue 2: CSS/JS Animation Mismatch**
The `.about-evidence-stat` elements had `opacity: 0` set in `home-micro-interactions.css`. The JavaScript in `micro-interactions.ts` was supposed to animate them in by targeting `[data-stat-stagger]` elements — but the `EvidenceStat.astro` component never adds this attribute. Result: stats were permanently invisible.

### Fix Applied

1. **`src/components/sections/ServicePathSection.astro`** — Reverted from horizontal scroll layout back to vertical steps:
   - Removed `horiz-scroll-outer`, `horiz-scroll-pin`, `horiz-scroll-track` classes
   - Removed the `.horiz-scroll-spacer` element
   - Restored `.steps--path` vertical timeline with numbered circles (1, 2, 3) and checkmark outcome
   - Added `padding-inline: var(--space-page-x)` for proper spacing

2. **`src/styles/home-micro-interactions.css`** — Fixed evidence stats visibility:
   - Changed `.about-evidence-stat` default from `opacity: 0` to `opacity: 1`
   - Stats now visible by default; animation enhancement is optional, not required

### Key Lessons Learned

1. **Animation defaults should be visible, not hidden** — When adding fade-in animations, set the CSS default to `opacity: 1` and let JS enhance with animation. If CSS defaults to `opacity: 0`, any mismatch between CSS selectors and JS triggers will leave elements permanently invisible.

2. **Verify JS selectors match component output** — The JS targeted `[data-stat-stagger]` but the Astro component never added this attribute. Always verify that JS selectors match the actual DOM output.

3. **Horizontal scroll creates layout complexity** — Sticky positioning + scroll spacers + transform animations add significant complexity. For a 4-step process, a simple vertical timeline is clearer and avoids the empty gap problem.

4. **Test with actual rendered output** — Reading source files isn't enough; always verify the visual result. The CSS/JS mismatch wasn't apparent until viewing the rendered page.

### Files Changed
| File | Change |
| --- | --- |
| `src/components/sections/ServicePathSection.astro` | Reverted to vertical steps layout, removed scroll spacer |
| `src/styles/home-micro-interactions.css` | Fixed `.about-evidence-stat` opacity default |

---

## Previous: Phase 3 Scroll-Driven Storytelling

**Date:** June 23, 2026

### What Was Implemented
Phase 3 scroll-driven storytelling effects across the site:

1. **`src/scripts/scroll-story.ts`** — New script with:
   - Horizontal scroll pinning for "How It Works" section (desktop)
   - Native swipe scroll-snap for mobile/tablet
   - Progress indicator dots synced to scroll position
   - Split-text word-by-word fade-up (80ms stagger, max 1280ms)
   - Scroll-linked text color transitions (teal → orange)
   - Grain texture overlay injection (opacity 0.04, static noise)
   - SVG geometric shape morphs that evolve on scroll
   - `aria-live` announcements for screen readers on step changes

2. **`src/styles/home-scroll-story.css`** — New stylesheet with:
   - Sticky pin layout for horizontal scroll (desktop)
   - Step card styles with active/transition states
   - Progress dot indicators
   - Word-by-word split reveal with staggered delays
   - Background gradient shift transitions (500ms crossfade)
   - Grain overlay positioning (`mix-blend-mode: overlay`)
   - Geometric morph SVG containers and paths
   - Full `prefers-reduced-motion` support
   - Responsive breakpoints for mobile swipe

3. **`src/components/sections/ServicePathSection.astro`** — Rebuilt as horizontal scroller:
   - Pinned header + horizontal card track + progress dots
   - Scroll spacer for desktop translate animation
   - Screen-reader fallback ordered list preserved

4. **Section data attributes added:**
   - `data-split-reveal` on NarrativeScene h2, AudienceSection h2, How It Works h2
   - `data-color-shift` on How It Works h2
   - `data-bg-shift` on NarrativeScene, AudienceSection chapters, How It Works
   - `geo-morph` decorations on HeroSection and How It Works

5. Imports wired up in:
   - `src/styles/home.css` (CSS import)
   - `src/layouts/HomeBase.astro` (script import)

### How to Use Phase 3 Features
- **Horizontal scroll**: automatically activates on `.horiz-scroll-outer` sections
- **Split-text headings**: add `data-split-reveal` to any element; words split and fade up on view
- **Color transitions**: add `data-color-shift`; text transitions teal→orange as it scrolls past center
- **Background gradient shift**: add `data-bg-shift` to any section; gradient fades in when visible
- **Grain overlay**: automatically injected on desktop (>560px) at `opacity: 0.04`
- **Geometric morphs**: add `.geo-morph` containers; SVG shape evolves on each intersection

### Technical Notes
- Zero new dependencies
- All animations respect `prefers-reduced-motion: reduce` (immediate reveal, no motion)
- Mobile: horizontal scroll uses native CSS scroll-snap instead of JS-driven transform
- Screen readers: `aria-live` announcements for step changes; original ordered list preserved in `.sr-only`
- JS bundle: ~4KB gzipped additional (scroll-story.ts)
- Grain overlay uses inline SVG data URI (no external asset fetch)

---

## Previous: Phase 2 Micro-Interactions (Partial)

**Date:** June 23, 2026

### What Was Implemented
Phase 2 micro-interactions were partially implemented with a focus on non-testimonial elements:

1. **`src/scripts/micro-interactions.ts`** — New script with:
   - Magnetic hover effect for CTA buttons (100px attraction radius)
   - Ripple click effect on buttons (Material Design pattern)
   - Staggered entry animations (150ms delay between elements)
   - Blur-to-sharp image loaders
   - Progress ring SVG animations

2. **`src/styles/home-micro-interactions.css`** — New stylesheet with:
   - Ripple keyframes and button-specific ripple colors
   - Shine gradient sweep on `.card` hover (leadership cards only)
   - Enhanced CTA button hover shadows
   - Portrait hover zoom in leadership section
   - Full `prefers-reduced-motion` support

3. **`src/styles/home.css`** — Added import for `home-micro-interactions.css`
4. **`src/layouts/HomeBase.astro`** — Added import for `micro-interactions.ts`

### What Was Reverted
All testimonial-specific changes were reverted per client preference:
- 3D tilt effect removed from `.vv-card`
- Shine gradient sweep removed from `.vv-card`
- Hover zoom removed from `.vv-photo`

Testimonials remain unchanged from Phase 1.

### How to Use New Features
- **Magnetic/ripple** work automatically on `.pill.primary`, `.btn-donate`, `.strong-circle-trigger`
- **Shine on hover** works automatically on `.card` (leadership cards)
- **Staggered stats**: Add `data-stat-stagger` attribute to elements
- **Blur-to-sharp**: Add `data-blur-load` attribute to `<img>` tags
- **Progress rings**: Add `data-progress-ring="75"` to SVG with a `<circle>` child

### Technical Notes
- Zero new dependencies
- All animations respect `prefers-reduced-motion: reduce`
- JS bundle: ~22KB gzipped (well within 150KB budget)

---

## Previous: Remove Lenis, fix nav bar positioning

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

---

## Awwwards Aesthetic Phases Plan

**Goal:** Transform the site into an award-worthy experience while preserving performance (91/100 mobile) and accessibility (WCAG AA).

### Phase 1: Foundation (Complete - Commit `fd9894d`)
- [x] Scroll-reveal animations on section entry
- [x] Staggered fade-in for cards (leadership, testimonials)
- [x] Stat counter animations with IntersectionObserver
- [x] Parallax hero image (subtle 30px offset)

### Phase 2: Micro-Interactions (Priority: High)
- [ ] **CTA Button Enhancements**
  - [ ] Magnetic hover effect (cursor attraction within 100px radius)
  - [ ] Scale pulse on hover (1.02x with cubic-bezier easing)
  - [ ] Ripple effect on click (Material Design pattern)
- [ ] **Testimonial Card Interactions**
  - [ ] 3D tilt on hover (max 5deg, perspective: 1000px)
  - [ ] Shine gradient sweep on hover (diagonal, 0.6s duration)
  - [ ] Expandable quote preview (hover to reveal full testimonial)
- [ ] **Stats Section**
  - [ ] Number counter with easing (ease-out-quart, 2s duration)
  - [ ] Progress bar or ring fill animation
  - [ ] Staggered entry (150ms delay between stats)
- [ ] **Image Galleries**
  - [ ] Hover zoom (1.05x scale, overflow: hidden, 0.4s ease)
  - [ ] Blur-to-sharp loader (filter: blur(10px) → 0)
  - [ ] Parallax depth layers (foreground, midground, background)

### Phase 3: Scroll-Driven Storytelling (Priority: Medium)
- [ ] **Horizontal Scroll Section**
  - [ ] Pin "How It Works" section while scrolling through 4 steps
  - [ ] Progress indicator dots (active state synced to scroll position)
  - [ ] Smooth snap-to-step (threshold: 50% of card width visible)
- [ ] **Text Reveal Effects**
  - [ ] Split-text animation (word-by-word fade-up, 80ms stagger)
  - [ ] Scroll-linked text size changes (clamp with viewport-based scaling)
  - [ ] Color transitions (teal → orange accent on scroll)
- [x] **Background Transitions**
  - [x] Gradient shift at section boundaries (smooth 500ms crossfade)
  - [x] Grain texture overlay (opacity: 0.04, static noise pattern)
  - [x] Geometric shape morphs (SVG path animations on scroll)

### Phase 4: Advanced Polish (Priority: Low - After Awwwards Submission)
- [ ] **Custom Cursor**
  - [ ] Default cursor hidden on desktop
  - [ ] Custom circle with blend mode: difference
  - [ ] Scale up (2x) on interactive elements
- [ ] **Audio Feedback** (Optional, opt-in)
  - [ ] Subtle click sound on CTA press
  - [ ] Scroll "whoosh" on horizontal sections
  - [ ] Mute toggle button (persisted in localStorage)
- [ ] **Easter Eggs**
  - [ ] Konami code → special animation sequence
  - [ ] Hidden messages in page source
  - [ ] Secret achievement badges (e.g., "Scrolled 100%")

### Technical Constraints (Non-Negotiable)
- [x] **Performance budget**
  - Max TTI: 3.5s on 3G (current: 1.5s)
  - Max LCP: 2.5s (current: 2.8s - need to optimize hero)
  - Max CLS: 0.1 (current: 0)
- [x] **Accessibility requirements**
  - All animations respect `prefers-reduced-motion: reduce`
  - Keyboard navigation works without animations
  - Screen reader announcements for animated content
- [x] **Bundle size limits**
  - JS budget: 150KB gzipped (current: 17KB - room to grow)
  - CSS budget: 50KB gzipped (current: 88KB raw - need to optimize)
  - No additional dependencies without code-splitting

### Implementation Approach
1. **Native CSS where possible** (custom properties, @keyframes, scroll-timeline)
2. **IntersectionObserver** for viewport-triggered animations
3. **requestAnimationFrame** for smooth scroll-linked effects
4. **CSS @media (prefers-reduced-motion)** for accessibility
5. **Progressive enhancement** (animations are bonuses, not dependencies)

### Estimated Effort
- Phase 2: 4-6 hours
- Phase 3: 6-8 hours
- Phase 4: 3-5 hours
- **Total: ~15 hours**

### Success Metrics
- Awwwards submission accepted
- Lighthouse Performance: 90+ (mobile)
- Zero accessibility violations
- Client satisfaction with "wow factor"

---

**Next steps:** Begin Phase 3 (Scroll-Driven Storytelling) — text reveal effects and background transitions.
