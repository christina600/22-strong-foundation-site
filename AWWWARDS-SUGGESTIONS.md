# Awwwards CSS Review — 22Strong Foundation
*Comprehensive design & CSS suggestions to reach award-worthy quality*

---

## Executive Summary

The CSS codebase is genuinely impressive — 11 well-organized files, a thoughtful token system, real scroll-driven animation, and strong accessibility discipline. The foundation is solid enough that the gap between "good" and "Awwwards-worthy" is mostly about **depth of craft**, not a rebuild. Awwwards judges score on: Design (40%), Usability (20%), Creativity (20%), and Content (20%). The suggestions below are organized by impact tier.

---

## 🔴 Critical — These are the gaps that will cost the most points

### 1. Typography is the biggest missed opportunity

**Current state:** Both `--display-face` and `--logo-face` fall back to system UI fonts. The logo stack (`DIN Condensed → Impact → system-ui`) is fine for the brand mark, but the body/heading stack is entirely system fonts. Awwwards winners almost universally use custom type as a primary design element.

**What to do:**
```css
/* In home-premium-theme.css :root */

/* Option A — Free via Google Fonts (add to <head>) */
/* Import: Bebas Neue (display) + Inter (body) */
--display-face: "Bebas Neue", "DIN Condensed", ui-sans-serif, sans-serif;
--body-face: "Inter", ui-sans-serif, system-ui, sans-serif;

/* Option B — Premium feel (Fontshare, free) */
/* Import: Clash Display (display) + Satoshi (body) */
--display-face: "Clash Display", "DIN Condensed", ui-sans-serif, sans-serif;
--body-face: "Satoshi", ui-sans-serif, system-ui, sans-serif;

/* Option C — Most editorial (matches the military/recovery tone) */
/* Import: Barlow Condensed (display) + Barlow (body) */
--display-face: "Barlow Condensed", "DIN Condensed", ui-sans-serif, sans-serif;
--body-face: "Barlow", ui-sans-serif, system-ui, sans-serif;
```

**Also fix:** The hero h1 uses `font-stretch: condensed` on a system font — this has no effect unless the font actually has a condensed axis. With a real variable font, you can do:
```css
.hero h1 {
  font-variation-settings: "wdth" 75, "wght" 900;
}
```

**Impact:** Typography alone accounts for ~30% of the visual impression on Awwwards. This is the single highest-ROI change.

---

### 2. The hero is dark but not *dramatic*

**Current state:** The hero uses a CSS `::before` pseudo-element with a background image and a mask gradient. This is clever, but the result is a static photo with a text overlay — the same pattern as 90% of nonprofit sites.

**What's missing:** The hero has no sense of *depth* or *motion*. The `hero-mark` (the logo block) just fades in. The headline lines rise up. But there's no spatial relationship between layers.

**Suggestions:**

```css
/* Add a parallax depth layer to the hero image */
.hero::before {
  /* existing styles... */
  will-change: transform;
  /* JS adds: transform: translateY(calc(var(--scroll-y, 0) * 0.28px)) */
}

/* Give the hero a more dramatic vignette — current one is too subtle */
.hero::after {
  /* Replace the current 0.4 opacity with a stronger, more directional vignette */
  opacity: 1; /* was 0.4 */
  background:
    radial-gradient(ellipse 80% 60% at 20% 50%, transparent 30%, rgba(17, 22, 16, .72) 100%),
    linear-gradient(180deg, rgba(17, 22, 16, .18) 0%, rgba(17, 22, 16, .08) 40%, rgba(17, 22, 16, .72) 100%);
}

/* The hero-mark needs more presence — it's currently just a dark box */
.hero-mark {
  /* Add a subtle orange glow to make it feel alive */
  box-shadow:
    0 24px 68px rgba(0, 0, 0, .4),
    0 0 0 1px rgba(185, 85, 36, .28),
    inset 0 1px 0 rgba(255, 250, 240, .08);
  
  /* Add a very subtle warm gradient instead of flat #2b2a27 */
  background: linear-gradient(160deg, #2f2e2b 0%, #232220 100%);
}

/* The orange rule in the mark should glow */
.hero-mark-rule {
  box-shadow: 0 0 12px rgba(185, 85, 36, .6), 0 0 28px rgba(185, 85, 36, .3);
}
```

**Also consider:** Adding a subtle animated noise/grain texture specifically to the hero (not the whole page) at higher opacity (0.06–0.08) to give the dark field a tactile, printed quality.

---

### 3. The scroll-reveal system is generic

**Current state:** `[data-scroll-reveal]` uses a simple `translateY(30px) → 0` with `opacity 0 → 1`. This is the most common scroll animation pattern on the web. The `home-motion.css` version is slightly better (18px + scale(.994)) but still very standard.

**What Awwwards winners do:** They use *character-specific* entrances. Each type of element has its own choreography.

```css
/* Replace the generic data-scroll-reveal with element-specific entrances */

/* Headlines: clip-path reveal (text appears to be "cut" into view) */
.js [data-reveal="headline"] {
  clip-path: inset(0 0 100% 0);
  transform: translateY(8px);
  transition:
    clip-path .72s cubic-bezier(.19, .72, .2, 1),
    transform .72s cubic-bezier(.19, .72, .2, 1);
}
.js [data-reveal="headline"].is-visible {
  clip-path: inset(0 0 0% 0);
  transform: none;
}

/* Stats: scale from 0.6 with a spring overshoot */
.js [data-reveal="stat"] {
  opacity: 0;
  transform: scale(.6) translateY(20px);
  transition:
    opacity .6s ease,
    transform .8s cubic-bezier(.34, 1.56, .64, 1); /* spring */
}
.js [data-reveal="stat"].is-visible {
  opacity: 1;
  transform: none;
}

/* Cards: stagger with a slight rotation */
.js [data-reveal="card"] {
  opacity: 0;
  transform: translateY(32px) rotate(.4deg);
  transition:
    opacity .6s ease,
    transform .7s cubic-bezier(.22, .61, .36, 1);
}
.js [data-reveal="card"].is-visible {
  opacity: 1;
  transform: none;
}

/* Images: blur-in from slightly zoomed */
.js [data-reveal="image"] {
  opacity: 0;
  transform: scale(1.04);
  filter: blur(6px);
  transition:
    opacity .8s ease,
    transform .9s cubic-bezier(.22, .61, .36, 1),
    filter .7s ease;
}
.js [data-reveal="image"].is-visible {
  opacity: 1;
  transform: none;
  filter: none;
}
```

---

## 🟠 High Impact — Will significantly elevate the visual quality

### 4. The color system needs a "wow" moment

**Current state:** The palette is warm and cohesive (paper/ink/orange/teal/olive) but it never *surprises*. Every section uses the same warm cream background with slight gradient variations. There's no section that makes you stop scrolling.

**Suggestions:**

```css
/* Add a "mission statement" section with a full-bleed dark treatment */
/* The donate section does this, but it needs more drama */
.donate-section {
  /* Current background is good but the overlay is too uniform */
  /* Add a more dramatic light leak from the top-left */
  background:
    radial-gradient(ellipse 60% 40% at 0% 0%, rgba(185, 85, 36, .32) 0%, transparent 60%),
    linear-gradient(135deg, rgba(17, 22, 16, .97), rgba(45, 58, 38, .94)),
    var(--camo-field, transparent),
    url("/images/stock-veteran-brotherhood.webp") center / cover no-repeat;
}

/* The stat-beat section should feel more impactful */
/* Currently it's just a light cream band — make the number feel massive */
.stat-beat-number {
  /* Add a very subtle text shadow that bleeds into the background */
  text-shadow:
    0 0 80px rgba(185, 85, 36, .18),
    0 0 160px rgba(185, 85, 36, .08);
  
  /* The number should be larger — it's the hero of this section */
  font-size: clamp(4rem, 9vw, 8rem); /* was clamp(2.8rem, 6vw, 5rem) */
}

/* Add a "color accent" moment — a thin full-width band of pure orange */
/* between the credibility strip and the narrative scene */
/* This acts as a visual "breath" and signals a chapter change */
.story-proofline {
  /* Upgrade the existing proofline to be more visible */
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--mission-orange) 20%, 
    var(--teal) 80%, 
    transparent 100%
  );
  border: 0;
  box-shadow: 0 0 20px rgba(185, 85, 36, .3);
}
```

---

### 5. The navigation is functional but not distinctive

**Current state:** The nav uses a pill-shaped link container with a frosted glass effect. This is a popular pattern (used on thousands of sites). The brand mark has a gradient underline. The overall nav is clean but forgettable.

**What would make it memorable:**

```css
/* Option 1: Make the nav-links pill feel more premium */
.nav-links {
  /* Current: rgba(255,255,255,.05) background */
  /* Upgrade: add a very subtle inner glow and sharper border */
  background: rgba(255, 255, 255, .04);
  border-color: rgba(255, 255, 255, .10);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .08),
    inset 0 -1px 0 rgba(0, 0, 0, .12),
    0 4px 16px rgba(0, 0, 0, .24);
}

/* Option 2: Active nav item gets a more distinctive treatment */
.nav-links a.is-active {
  /* Instead of just a bottom underline, use a pill highlight */
  background: rgba(185, 85, 36, .16);
  color: rgba(255, 250, 240, .96);
  box-shadow: inset 0 0 0 1px rgba(185, 85, 36, .28);
}

/* Option 3: The brand mark deserves more presence */
.brand {
  /* Add a very subtle letter-spacing animation on hover */
  transition: letter-spacing .3s ease, opacity .2s ease;
}
.brand:hover {
  letter-spacing: .04em;
}

/* The nav should shrink on scroll — currently only on mobile */
/* Add this for desktop too */
header {
  transition: height .3s ease, box-shadow .3s ease, background .3s ease;
}
header.nav-shrunk {
  height: 60px; /* from 82px */
  box-shadow: 0 4px 24px rgba(0, 0, 0, .32);
}
```

---

### 6. Cards need more material depth

**Current state:** Cards use `var(--shadow-panel)` which is a 3-layer shadow. This is good. But the cards feel flat because the shadow is the same on all sides — real objects cast directional shadows.

```css
/* Replace the generic shadow-panel with directional, material shadows */
:root {
  /* Light source: top-left, 45 degrees */
  --shadow-card: 
    0 1px 0 rgba(255, 255, 255, .72) inset,  /* top highlight */
    0 -1px 0 rgba(0, 0, 0, .04) inset,        /* bottom inner shadow */
    1px 0 0 rgba(255, 255, 255, .32) inset,   /* left highlight */
    0 2px 4px rgba(29, 33, 29, .04),           /* contact shadow */
    0 8px 16px rgba(29, 33, 29, .06),          /* mid shadow */
    0 24px 48px rgba(29, 33, 29, .08),         /* ambient shadow */
    0 48px 80px rgba(29, 33, 29, .04);         /* far ambient */
}

/* Leadership cards specifically — they're the most prominent cards */
#leadership .card {
  /* Add a very subtle warm tint to the top edge */
  border-top-color: rgba(185, 85, 36, .18);
  
  /* The ::before accent bar should be thicker and more visible */
  /* Currently 3px — upgrade to 4px with a glow */
}
#leadership .card::before {
  height: 4px;
  background: linear-gradient(90deg, var(--mission-orange), var(--olive), transparent);
  box-shadow: 0 2px 8px rgba(185, 85, 36, .24);
}

/* Featured publication sheets — the hover state is good but the default is too flat */
.featured-sheet {
  /* Add a subtle warm tint to the background */
  background: linear-gradient(180deg, #fff 0%, #fdfaf5 100%);
}
```

---

### 7. The `::selection` color is a missed branding moment

**Current state:**
```css
::selection {
  background: var(--teal);
  color: var(--paper);
}
```

This is fine but teal is the secondary color. The primary brand color is orange. More importantly, the selection style should feel *intentional* and premium.

```css
/* Make selection feel like a brand moment */
::selection {
  background: var(--mission-orange);
  color: #fffaf0;
  text-shadow: none; /* prevent double-rendering artifacts */
}

/* Different selection for dark sections */
.donate-section ::selection,
.hero ::selection,
.circle-panel ::selection {
  background: rgba(255, 250, 240, .28);
  color: #fffaf0;
}
```

---

## 🟡 Medium Impact — Polish that separates good from great

### 8. The grain overlay needs to be animated

**Current state:** `home-scroll-story.css` has a `.grain-overlay` with a static SVG noise pattern at `opacity: 0.04`. Static grain looks like a texture; *animated* grain looks like film.

```css
/* Animate the grain to create a film-grain effect */
.grain-overlay {
  /* Keep existing styles, add animation */
  animation: grain-shift 0.12s steps(1) infinite;
}

@keyframes grain-shift {
  0%   { background-position: 0% 0%; }
  10%  { background-position: -5% -10%; }
  20%  { background-position: -15% 5%; }
  30%  { background-position: 7% -25%; }
  40%  { background-position: -5% 25%; }
  50%  { background-position: -15% 10%; }
  60%  { background-position: 15% 0%; }
  70%  { background-position: 0% 15%; }
  80%  { background-position: 3% 35%; }
  90%  { background-position: -10% 10%; }
  100% { background-position: 0% 0%; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .grain-overlay {
    animation: none;
  }
}
```

**Note:** Keep the opacity at 0.04 or lower — the goal is subliminal texture, not visible noise.

---

### 9. The `eyebrow` component is underutilized

**Current state:** The eyebrow uses a 28px orange line + uppercase text. This is a common pattern. The premium theme upgrades it to 34px. But the eyebrow never *animates* — it just appears.

```css
/* Give the eyebrow a draw-in animation */
.js .eyebrow::before {
  transform-origin: left;
  transform: scaleX(0);
  transition: transform .6s cubic-bezier(.19, .72, .2, 1);
}

.js .eyebrow.is-visible::before {
  transform: scaleX(1);
}

/* Also: the eyebrow text should fade in slightly after the line draws */
.js .eyebrow {
  opacity: 0;
  transition: opacity .4s ease .3s; /* delay matches line draw */
}
.js .eyebrow.is-visible {
  opacity: 1;
}

/* Upgrade the eyebrow line to feel more premium */
.eyebrow::before {
  width: 34px;
  height: 2px; /* was 1px — too thin to read as intentional */
  background: linear-gradient(90deg, var(--mission-orange), rgba(185, 85, 36, .15));
}
```

---

### 10. The step spine animation is incomplete

**Current state:** `home-premium-layout.css` has a `story-line-grow` animation that scales the `.steps--path::before` spine from 12% to 100% using `animation-timeline: view()`. This is great — but it only works in Chrome/Edge. The fallback (no animation) means the spine just appears instantly.

```css
/* Add a JS-driven fallback for the spine animation */
/* In home-motion.css, add: */

/* Fallback: animate the spine height via CSS custom property */
.steps--path::before {
  /* Default: full height (no-JS / no-support fallback) */
  transform: scaleY(1);
  transform-origin: top center;
}

/* JS-enhanced: start collapsed, grow on scroll */
.js .steps--path::before {
  transform: scaleY(.08);
  transition: transform 1.4s cubic-bezier(.22, .61, .36, 1);
}

.js .steps--path.is-visible::before {
  transform: scaleY(1);
}

/* Also: each step number should pulse when the spine reaches it */
.step-number {
  transition: 
    transform .4s cubic-bezier(.34, 1.56, .64, 1),
    box-shadow .4s ease;
}

.step.is-active .step-number {
  transform: scale(1.12);
  box-shadow: 0 0 0 6px rgba(185, 85, 36, .16), 0 0 0 12px rgba(185, 85, 36, .06);
}
```

---

### 11. Focus states are inconsistent and some are too subtle

**Current state:** Most interactive elements use `outline: 2px solid var(--ink)` or `outline: 2px solid var(--teal)`. The pill uses `outline: 2px solid var(--ink)` with `outline-offset: 2px`. These are accessible but not *designed*.

```css
/* Upgrade focus states to feel intentional, not just compliant */

/* Primary CTAs — orange focus ring matches the button color */
.pill.primary:focus-visible,
.btn-donate:focus-visible {
  outline: 2px solid var(--mission-orange);
  outline-offset: 3px;
  box-shadow:
    var(--action-shadow),
    0 0 0 5px rgba(185, 85, 36, .18); /* soft glow outside the outline */
}

/* Secondary/ghost buttons — ink ring */
.pill:not(.primary):focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

/* Nav links — teal ring (matches the active state color) */
.nav-links a:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
  border-radius: 999px;
}

/* Form inputs — orange ring on focus (currently uses border-color only) */
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid rgba(185, 85, 36, .55);
  outline-offset: 0;
  box-shadow:
    0 0 0 4px rgba(185, 85, 36, .10),
    0 1px 0 rgba(255, 255, 255, .82) inset;
}
```

---

### 12. The footer is an afterthought

**Current state:** The footer is `background: rgba(235, 224, 204, .75)` with a 3-column grid. It's functional but has no visual weight or closure. Awwwards judges look at the full page — a weak footer signals incomplete craft.

```css
/* Upgrade the footer to feel like a proper page closure */
footer {
  /* Remove the light cream — use a dark treatment for contrast */
  background:
    linear-gradient(180deg, rgba(17, 22, 16, .96), rgba(10, 12, 10, .98));
  color: rgba(255, 250, 240, .82);
  border-top: 0; /* remove the gradient border — replace with something better */
  padding: 72px 24px 48px;
  
  /* Add a top accent */
  position: relative;
}

footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--teal) 0%, 
    var(--mission-orange) 50%, 
    var(--teal) 100%
  );
}

/* Update footer text colors for dark background */
.footer-title {
  color: #fffaf0;
}

.links a {
  color: rgba(255, 250, 240, .62);
  transition: color .2s ease;
}

.links a:hover {
  color: rgba(255, 250, 240, .92);
}
```

**Alternative:** Keep the light footer but add a full-bleed dark "mission statement" band above it with the 22Strong logo large and centered — a common Awwwards pattern for nonprofit/cause sites.

---

### 13. The `split-word` stagger delays are hardcoded and too long

**Current state:** `home-scroll-story.css` has 17 hardcoded `nth-child` rules with delays up to 1280ms. A 16-word headline takes 1.28 seconds to fully reveal — that's too slow and will feel sluggish.

```css
/* Replace hardcoded delays with a CSS custom property approach */
/* This also allows JS to set --word-index dynamically */

.split-word {
  opacity: 0;
  transform: translateY(10px); /* was 12px — slightly tighter */
  transition:
    opacity .4s cubic-bezier(.16, 1, .3, 1),  /* was .5s */
    transform .4s cubic-bezier(.16, 1, .3, 1);
  transition-delay: calc(var(--word-index, 0) * 50ms); /* was 80ms */
}

/* Remove all the nth-child rules and replace with: */
/* JS sets style="--word-index: N" on each .split-word */
```

**Also:** The `translateY(12px)` is too much for a word-level reveal. Words should feel like they're *appearing*, not *flying in*. Use 6–8px max.

---

### 14. The `body::after` texture layer is fighting itself

**Current state:** `home-premium-layout.css` has a `body::after` with `--field-sand` and a repeating grid at `opacity: 0.20`. But `home-premium-theme.css` also has a `body::before` with a grid at `opacity: 0.34`. And `home-base.css` has the original `body::before` grid. These three texture layers are stacking and creating visual mud.

```css
/* Audit and consolidate the body texture layers */

/* Keep only ONE texture layer — the most refined one from home-premium-layout.css */
/* Remove or comment out the body::before in home-base.css and home-premium-theme.css */

/* The single texture should be: */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: .18; /* unified, lower than any individual layer */
  background-image:
    var(--field-paper-grain),
    repeating-linear-gradient(90deg, rgba(53, 70, 50, .015) 0 1px, transparent 1px 24px),
    repeating-linear-gradient(0deg, rgba(53, 70, 50, .010) 0 1px, transparent 1px 24px);
  background-size: 132px 118px, 24px 24px, 24px 24px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,.28), transparent 60%);
}

/* Remove body::after entirely — the grain-overlay in scroll-story handles this */
```

---

### 15. The `--radius` token is underused

**Current state:** `--radius: 8px` is defined but many elements hardcode their own border-radius values (6px, 7px, 8px, 10px, 14px, 16px, 999px). This inconsistency creates visual noise.

```css
/* Establish a proper radius scale */
:root {
  --radius-sm: 6px;    /* buttons, inputs, small chips */
  --radius-md: 8px;    /* cards, panels (current --radius) */
  --radius-lg: 12px;   /* large cards, modals */
  --radius-xl: 16px;   /* hero mark, featured sheets */
  --radius-pill: 999px; /* nav links, tags, badges */
}

/* Then audit and replace hardcoded values:
   6px  → var(--radius-sm)
   7px  → var(--radius-sm)  (the toggle-row buttons)
   8px  → var(--radius-md)
   10px → var(--radius-lg)  (circle-panel)
   14px → var(--radius-lg)  (giving-invite)
   16px → var(--radius-xl)  (horiz-step)
   999px → var(--radius-pill)
*/
```

---

## 🟢 Refinements — The 1% details that Awwwards judges notice

### 16. Cursor: the most visible missing Awwwards feature

**Current state:** Default browser cursor throughout. This is the #1 most common feature on Awwwards-winning sites.

```css
/* Add to home-premium-layout.css or a new home-cursor.css */

/* Hide default cursor on desktop */
@media (hover: hover) and (pointer: fine) {
  * {
    cursor: none !important;
  }
}

/* Custom cursor element (injected by JS) */
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
  
  /* The dot */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fffaf0;
  transform: translate(-50%, -50%);
  transition: transform .1s ease, width .3s ease, height .3s ease;
  will-change: transform;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  pointer-events: none;
  
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 250, 240, .6);
  transform: translate(-50%, -50%);
  transition: transform .18s ease, width .3s ease, height .3s ease, opacity .3s ease;
  will-change: transform;
}

/* Hover state on interactive elements */
.cursor.is-hovering {
  width: 6px;
  height: 6px;
}

.cursor-ring.is-hovering {
  width: 56px;
  height: 56px;
  border-color: var(--mission-orange);
  opacity: .7;
}

/* Text cursor state */
.cursor.is-text {
  width: 2px;
  height: 24px;
  border-radius: 1px;
  mix-blend-mode: normal;
  background: var(--mission-orange);
}

@media (prefers-reduced-motion: reduce) {
  .cursor, .cursor-ring {
    display: none;
  }
  * { cursor: auto !important; }
}
```

---

### 17. The `vv-quote::before` open-quote is using a Unicode character

**Current state:**
```css
.vv-quote::before {
  content: "\201C";
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.2rem;
  line-height: .4;
  color: var(--mission-orange, #b95524);
}
```

This is fine functionally, but the Georgia serif quote mark looks out of place in an otherwise sans-serif design. Either:

**Option A:** Use a custom SVG quote mark (more control, matches brand):
```css
.vv-quote::before {
  content: "";
  display: block;
  width: 32px;
  height: 24px;
  margin-bottom: 14px;
  background: var(--mission-orange);
  /* SVG quote mark as mask */
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 24'%3E%3Cpath d='M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.2 6.4 6.4 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0L36 2.4C30.4 3.6 27.2 6.4 26.4 10.4H32V24H20z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 24'%3E%3Cpath d='M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.2 6.4 6.4 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0L36 2.4C30.4 3.6 27.2 6.4 26.4 10.4H32V24H20z'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
```

**Option B:** Use the display font for the quote mark (more cohesive):
```css
.vv-quote::before {
  font-family: var(--display-face); /* matches the rest of the design */
  font-size: 4rem;
  font-weight: 900;
  line-height: .5;
  color: rgba(185, 85, 36, .32); /* more subtle — let the quote text be the hero */
}
```

---

### 18. The `about-evidence-number` counter animation is missing a unit

**Current state:** `scroll-reveal.css` sets `font-variant-numeric: tabular-nums` on `[data-count]`. The JS presumably counts up to the number. But the CSS doesn't account for the visual weight change as the number grows.

```css
/* Add a subtle scale animation as the number counts up */
[data-count] {
  font-variant-numeric: tabular-nums;
  display: inline-block; /* needed for transform */
  transition: transform .1s ease;
}

/* The "counted" pulse in home-micro-interactions.css is good but too subtle */
/* Upgrade it: */
@keyframes stat-pulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.06); }
  70%  { transform: scale(.98); }
  100% { transform: scale(1); }
}

[data-count].counted {
  animation: stat-pulse .6s cubic-bezier(.34, 1.56, .64, 1); /* was .4s */
}
```

---

### 19. The `goal-fill` animation starts at 0% but the goal is 22%

**Current state:** `home-motion.css` animates `.goal-fill` from `width: 0` to `width: 22%`. This is correct. But the bar has no visual indicator of the target — it just fills to an arbitrary-looking 22% and stops.

```css
/* Add a target marker to the goal bar */
.goal-bar {
  position: relative; /* needed for the marker */
}

/* Add a subtle "goal" marker at 100% */
.goal-bar::after {
  content: "";
  position: absolute;
  right: 0;
  top: -3px;
  bottom: -3px;
  width: 2px;
  background: rgba(255, 255, 255, .4);
  border-radius: 1px;
}

/* Make the fill gradient more dynamic */
.goal-fill {
  background: linear-gradient(90deg, 
    var(--mission-orange) 0%, 
    rgba(201, 96, 31, .9) 100%
  );
  /* Add a shimmer animation to the fill */
  position: relative;
  overflow: hidden;
}

.goal-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, .28) 50%, 
    transparent 100%
  );
  animation: goal-shimmer 2.4s ease 1.4s 1; /* runs once after fill completes */
  transform: translateX(-100%);
}

@keyframes goal-shimmer {
  to { transform: translateX(100%); }
}
```

---

### 20. The `nav-links a::after` underline animation direction is wrong

**Current state:**
```css
.nav-links a::after {
  transform: scaleX(.35);
  transform-origin: left;
  transition: opacity .22s ease, transform .26s cubic-bezier(.22, .61, .36, 1);
}
.nav-links a.is-active::after,
.nav-links a:hover::after {
  opacity: 1;
  transform: scaleX(1);
}
```

The underline always grows from the left. This is fine for the initial hover, but when moving between nav items, it should grow from the direction of travel (left-to-right or right-to-left). This requires JS to detect direction, but the CSS can be prepared:

```css
/* Prepare for directional underline */
.nav-links a::after {
  transform-origin: var(--underline-origin, left);
  /* JS sets --underline-origin: left or right based on mouse direction */
}

/* Also: the underline should be slightly thicker */
.nav-links a::after {
  height: 2.5px; /* was 2px */
  bottom: 4px;   /* was 5px — slightly closer to the text */
}
```

---

## 📋 CSS Architecture Suggestions

### 21. Consolidate the duplicate `:root` declarations

**Current state:** `:root` is declared in:
- `home-base.css` (full token set)
- `home-premium-theme.css` (overrides most of them)
- `home-premium-layout.css` (adds story tokens, then adds accessibility tokens at the bottom)
- `home-premium-responsive-tablet.css` (overrides in media query)
- `home-premium-responsive-mobile.css` (overrides in media query)

The `home-premium-layout.css` file has TWO separate `:root` blocks — one for story tokens and one for accessibility/readability tokens. These should be merged.

**Recommendation:** Create a single `home-tokens.css` that contains all `:root` declarations in one place, organized by category. This makes the token system auditable and prevents accidental overrides.

---

### 22. The `will-change` usage needs auditing

**Current state:** `will-change: transform` is set on `.pill.primary`, `.btn-donate`, `.strong-circle-trigger` in `home-micro-interactions.css`. `will-change: transform` is also set on `.horiz-scroll-track` in `home-scroll-story.css`.

**Issue:** `will-change` should only be set immediately before an animation starts (via JS) and removed after. Setting it permanently on buttons creates a new compositing layer for every button on the page, which increases GPU memory usage.

```css
/* Remove permanent will-change from buttons */
/* Instead, add it via JS just before the animation: */
/*
  element.style.willChange = 'transform';
  element.addEventListener('transitionend', () => {
    element.style.willChange = 'auto';
  }, { once: true });
*/

/* Keep will-change only on elements that are ALWAYS animating */
.horiz-scroll-track {
  will-change: transform; /* OK — this animates continuously on scroll */
}

/* Remove from: */
.pill.primary,
.btn-donate,
.strong-circle-trigger {
  will-change: auto; /* was: transform */
}
```

---

### 23. The `home-scroll-story.css` grain overlay z-index is too high

**Current state:**
```css
.grain-overlay {
  z-index: 9999;
}
```

`z-index: 9999` puts the grain above everything — including modals, tooltips, and the giving-invite card (`z-index: 60`). This is fine visually (it's transparent), but it creates a stacking context that can interfere with pointer events on overlaid elements.

```css
.grain-overlay {
  z-index: 1; /* grain should be just above the page content, below UI chrome */
  /* pointer-events: none is already set — this is safe */
}
```

---

### 24. The `home-sections.css` donation section has a hardcoded `width: 22%` on `.goal-fill`

**Current state:**
```css
.goal-fill {
  width: 22%;
}
```

This is a magic number. It should be a CSS custom property so it can be updated from the component without touching the stylesheet:

```css
.goal-fill {
  width: var(--goal-progress, 22%);
}
```

Then in the Astro component:
```html
<div class="goal-fill" style="--goal-progress: 22%"></div>
```

---

## 🏆 The Awwwards Checklist

Based on the full CSS review, here's what the site has vs. what it needs:

| Feature | Status | Notes |
|---|---|---|
| Custom typography | ❌ Missing | System fonts only — highest priority fix |
| Custom cursor | ❌ Missing | Expected on Awwwards submissions |
| Scroll-driven animations | ✅ Good | `animation-timeline: view()` used |
| Entrance animations | ⚠️ Generic | `translateY(30px)` is too common |
| Grain/texture overlay | ✅ Good | Static — animate it |
| Color system | ✅ Good | Warm, cohesive, distinctive |
| Dark sections | ✅ Good | Hero + donate section |
| Typography scale | ✅ Good | Well-considered clamp() usage |
| Micro-interactions | ⚠️ Partial | Ripple + shine present; magnetic cursor missing |
| Responsive design | ✅ Excellent | 3 breakpoints, thorough |
| Accessibility | ✅ Excellent | Reduced motion, focus states, skip link |
| Performance | ✅ Good | No heavy dependencies |
| Footer | ❌ Weak | Needs dark treatment or more presence |
| Navigation | ⚠️ Functional | Not distinctive enough |
| Card depth | ⚠️ Good | Shadows are good but not directional |
| Section transitions | ✅ Good | Story proofline, chapter markers |
| Split-text reveal | ✅ Present | Delays too long (1280ms max) |
| Hero drama | ⚠️ Good | Needs more depth/parallax |

**Priority order for maximum Awwwards impact:**
1. 🔴 Custom typeface (typography)
2. 🔴 Custom cursor
3. 🔴 More dramatic hero (parallax + vignette)
4. 🟠 Character-specific entrance animations
5. 🟠 Animated grain overlay
6. 🟠 Dark footer
7. 🟡 Eyebrow draw-in animation
8. 🟡 Directional card shadows
9. 🟡 Consolidate body texture layers
10. 🟡 Reduce split-word stagger timing

---

*Review completed June 23, 2026. All suggestions respect the existing `prefers-reduced-motion` discipline and WCAG AA accessibility requirements already in the codebase.*
