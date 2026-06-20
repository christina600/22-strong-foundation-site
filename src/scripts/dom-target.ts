/**
 * Event targets can occasionally be text nodes. Normalize them to the nearest
 * parent element so delegated listeners behave consistently.
 */
export function getEventElement(target: EventTarget | null) {
  if (target instanceof HTMLElement) return target;
  if (target instanceof Node) return target.parentElement;
  return null;
}
