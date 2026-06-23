/**
 * Image assets for Astro's <Image> component. Imported here so components can
 * look them up by path (e.g. "/images/adam-folker-uci.webp") while still
 * benefiting from build-time optimization.
 *
 * Keep this file in sync: if you add a new image to src/assets/images/, export
 * it here and add it to the lookup map below.
 */

import adamFolkerUci from "./images/adam-folker-uci.webp";
import drVas from "./images/dr-vas.webp";
import lukePoster from "./images/luke-poster.jpg";
import tomBoscamp from "./images/tom-boscamp.jpg";
import travisMayfield from "./images/travis-mayfield.jpg";
import logoUsvm from "./images/logo-usvm.jpg";

import type { ImageMetadata } from "astro";

export const imageMap: Record<string, ImageMetadata> = {
  "/images/adam-folker-uci.webp": adamFolkerUci,
  "/images/dr-vas.webp": drVas,
  "/images/luke-poster.jpg": lukePoster,
  "/images/tom-boscamp.jpg": tomBoscamp,
  "/images/travis-mayfield.jpg": travisMayfield,
  "/images/logo-usvm.jpg": logoUsvm,
};

export function getImageByPath(path: string): ImageMetadata | undefined {
  return imageMap[path];
}