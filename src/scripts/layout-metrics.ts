/**
 * Shared layout metrics for same-page scrolling.
 *
 * The nav highlighter and the mission rail both need to know how much sticky
 * chrome (header + visible mission rail) sits above the fold, so anchor jumps
 * land in the right place and both agree on the active section. Keeping the
 * math in one spot stops the two from drifting out of sync.
 */

export const MISSION_RAIL_SELECTOR = "[data-mission-rail]";

function getVisibleMissionRailHeight() {
  const rail = document.querySelector<HTMLElement>(MISSION_RAIL_SELECTOR);
  if (!rail || rail.closest("header") || window.getComputedStyle(rail).display === "none") return 0;
  return Math.ceil(rail.getBoundingClientRect().height || 0);
}

export function getHeaderOffset() {
  const header = document.querySelector("header");
  return Math.ceil(header?.getBoundingClientRect().height || 0) + getVisibleMissionRailHeight() + 10;
}
