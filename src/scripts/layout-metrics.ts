/**
 * Shared layout metric for same-page scrolling.
 *
 * The nav highlighter needs to know how much sticky header chrome sits above
 * the fold so anchor jumps land in the right place. Keeping the math in one
 * spot stops callers from drifting out of sync.
 */

export function getHeaderOffset() {
  const header = document.querySelector("header");
  return Math.ceil(header?.getBoundingClientRect().height || 0) + 10;
}
