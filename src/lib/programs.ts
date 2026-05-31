/**
 * Programs — single source of truth.
 *
 * Reads programs.json and resolves each program's display `background`
 * (a real image if supplied, otherwise a rotating gradient placeholder).
 * Both the program CARD (ProgramsList) and the program detail HERO
 * (ProgramHero) read from here, so the View Transition morph between
 * them lines up on an identical background.
 */

import programs from "../content/programs.json";

// Rotating placeholder gradients so cards read as distinct "photos"
// before real imagery is dropped in. Swap takes effect automatically
// once a program's `image` field is filled in programs.json.
//
// Choosing program photos (Cancer / dignity): pick images where the
// people you serve have agency — looking forward, in connection, doing
// something — not isolated or framed as objects of pity. Use real,
// diverse faces so an arriving visitor thinks "someone like me belongs
// here." This applies to the visible photo, not just the alt text.
const placeholders = [
  "linear-gradient(135deg, var(--field-green), var(--charcoal))",
  "linear-gradient(135deg, var(--burnt-orange), var(--sandstone))",
  "linear-gradient(135deg, var(--pale-sage), var(--field-green))",
  "linear-gradient(135deg, var(--sandstone), var(--charcoal))",
  "linear-gradient(135deg, var(--charcoal), var(--field-green))",
  "linear-gradient(135deg, var(--light-tan), var(--burnt-orange))",
  "linear-gradient(135deg, var(--field-green), var(--burnt-orange))",
];

export interface Program {
  title: string;
  text: string;
  tag: string;
  image: string;
  imageAlt: string;
  page: string;
  hook?: string;
  outcome?: string;
  outcomeSource?: string;
  whoFor?: string;
  includes?: string[];
  limits?: string;
  howToStart?: string;
  index: number;
  /** Full CSS background-image value — image url() or gradient. */
  background: string;
}

export const programList: Program[] = (programs as Omit<Program, "index" | "background">[]).map(
  (p, i) => ({
    ...p,
    index: i,
    background: p.image ? `url('${p.image}')` : placeholders[i % placeholders.length],
  })
);

export function getProgram(slug: string): Program | undefined {
  return programList.find((p) => p.page === slug);
}
