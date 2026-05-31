/**
 * Count-up animation — stat numbers tick from zero to their value
 * when scrolled into view.
 *
 * Skips anything that is not a single clean number (e.g. "24/7").
 * Respects prefers-reduced-motion: leaves numbers as written.
 *
 * Re-initializes on every page load for View Transitions compatibility.
 */

interface CountItem {
  el: HTMLElement;
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  useComma: boolean;
  raw: string;
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setupCountUps() {
  const els = Array.from(document.querySelectorAll<HTMLElement>(
    ".metric > strong, .audit-tile > strong, .hero-proof-strip strong, .stat-figure-value > strong"
  ));

  const items: CountItem[] = [];
  els.forEach(el => {
    // Skip elements already animated (from a previous page load)
    if ((el as any)._countedUp) return;
    const raw = el.textContent?.trim() || "";
    const match = raw.match(/\d[\d,]*(?:\.\d+)?/);
    if (!match) return;
    const before = raw.slice(0, match.index);
    const after = raw.slice((match.index || 0) + match[0].length);
    if (/\d/.test(before) || /\d/.test(after)) return; // more than one number
    const target = parseFloat(match[0].replace(/,/g, ""));
    if (!isFinite(target)) return;
    const decimals = (match[0].split(".")[1] || "").length;
    const useComma = match[0].includes(",") || target >= 1000;
    items.push({ el, prefix: before, suffix: after, target, decimals, useComma, raw });
  });

  if (!items.length) return;

  const format = (value: number, it: CountItem): string => {
    let n = it.decimals ? value.toFixed(it.decimals) : String(Math.round(value));
    if (it.useComma) {
      n = Number(n).toLocaleString("en-US", {
        minimumFractionDigits: it.decimals,
        maximumFractionDigits: it.decimals
      });
    }
    return it.prefix + n + it.suffix;
  };

  // Reduced motion or no IntersectionObserver: leave numbers as written
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  // Zero out numbers
  items.forEach(it => { it.el.textContent = format(0, it); });

  const run = (it: CountItem) => {
    const duration = 1300;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      it.el.textContent = format(it.target * easeOut(t), it);
      if (t < 1) requestAnimationFrame(step);
      else {
        it.el.textContent = it.raw;
        (it.el as any)._countedUp = true;
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = items.find(it => it.el === entry.target);
        if (item) run(item);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  items.forEach(it => {
    const rect = it.el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      run(it);
    } else {
      observer.observe(it.el);
    }
  });
}

// Run on initial load and every View Transition navigation
document.addEventListener("astro:page-load", setupCountUps);
