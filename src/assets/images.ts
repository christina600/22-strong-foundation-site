/**
 * Image assets for Astro's <Image> component. Imported here so components can
 * look them up by path (e.g. "/images/adam-folker-uci.webp") while still
 * benefiting from build-time optimization.
 *
 * Keep this file in sync: if you add a new image to src/assets/images/, export
 * it here and add it to the lookup map below.
 */

import aboutRedLightTherapy from "./images/about-red-light-therapy.webp";
import adamFolkerUci from "./images/adam-folker-uci.webp";
import drVas from "./images/dr-vas.webp";
import heroBattleRopes from "./images/hero-battle-ropes.webp";
import lukePoster from "./images/luke-poster.jpg";
import storyAdaptiveDeadlift from "./images/story-adaptive-deadlift.webp";
import storyAnkleWrap from "./images/story-ankle-wrap.webp";
import storyAssistedRehab from "./images/story-assisted-rehab.webp";
import storyTreatmentRoom from "./images/story-treatment-room.webp";
import storySmartMirrorCoaching from "./images/story-smart-mirror-coaching.webp";
import storyTrxTraining from "./images/story-trx-training.webp";
import storyVeteranConversation from "./images/story-veteran-conversation.webp";
import storyVeteranLegTherapy from "./images/story-veteran-leg-therapy.webp";
import storyYouthDugout from "./images/story-youth-dugout.jpg";
import storyYouthHuddle from "./images/story-youth-huddle.webp";
import youthBasketballPlayer from "./images/youth-basketball-player.webp";
import tomBoscamp from "./images/tom-boscamp.jpg";
import travisMayfield from "./images/travis-mayfield.jpg";

import type { ImageMetadata } from "astro";

export const imageMap: Record<string, ImageMetadata> = {
  "/images/about-red-light-therapy.webp": aboutRedLightTherapy,
  "/images/adam-folker-uci.webp": adamFolkerUci,
  "/images/story-smart-mirror-coaching.webp": storySmartMirrorCoaching,
  "/images/story-trx-training.webp": storyTrxTraining,
  "/images/story-veteran-leg-therapy.webp": storyVeteranLegTherapy,
  "/images/dr-vas.webp": drVas,
  "/images/luke-poster.jpg": lukePoster,
  "/images/story-adaptive-deadlift.webp": storyAdaptiveDeadlift,
  "/images/story-ankle-wrap.webp": storyAnkleWrap,
  "/images/story-assisted-rehab.webp": storyAssistedRehab,
  "/images/story-treatment-room.webp": storyTreatmentRoom,
  "/images/story-veteran-conversation.webp": storyVeteranConversation,
  "/images/story-youth-dugout.jpg": storyYouthDugout,
  "/images/story-youth-huddle.webp": storyYouthHuddle,
  "/images/youth-basketball-player.webp": youthBasketballPlayer,
  "/images/tom-boscamp.jpg": tomBoscamp,
  "/images/travis-mayfield.jpg": travisMayfield,
};

/** Former hero photo — kept solely as the og:image social-share thumbnail. */
export { heroBattleRopes };

export function getImageByPath(path: string): ImageMetadata | undefined {
  return imageMap[path];
}
