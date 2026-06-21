/**
 * Build-time integrity check for homepage content references.
 *
 * This catches the easy-to-miss wiring bugs that happen when content changes:
 * missing stat groups, missing testimonial keys, duplicate section ids, and
 * local media paths that no longer exist in public/.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const homePath = join(rootDir, "src", "content", "home.json");
const publicDir = join(rootDir, "public");
const home = JSON.parse(readFileSync(homePath, "utf8"));
const errors = [];
const warnings = [];

const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object ?? {}, key);

function validateAudiences() {
  const ids = new Set();

  for (const [index, group] of (home.audiences ?? []).entries()) {
    const label = group.id || `audiences[${index}]`;

    if (!group.id) addError(`Audience ${index} is missing an id.`);
    if (group.id && ids.has(group.id)) addError(`Duplicate audience id: ${group.id}`);
    if (group.id) ids.add(group.id);

    if (!hasOwn(home.stats, group.statsKey)) {
      addError(`${label} uses missing statsKey: ${group.statsKey}`);
    } else if (!Array.isArray(home.stats[group.statsKey]) || home.stats[group.statsKey].length === 0) {
      addError(`${label} uses empty statsKey: ${group.statsKey}`);
    }

    if (group.video?.testimonialKey && !hasOwn(home.testimonials, group.video.testimonialKey)) {
      addError(`${label} video uses missing testimonialKey: ${group.video.testimonialKey}`);
    }

    if (group.voicesKey && !Array.isArray(home[group.voicesKey])) {
      addError(`${label} uses missing voicesKey array: ${group.voicesKey}`);
    }

    for (const [voiceIndex, voice] of (group.voices ?? []).entries()) {
      if (voice.testimonialKey && !hasOwn(home.testimonials, voice.testimonialKey)) {
        addError(`${label} voice ${voiceIndex} uses missing testimonialKey: ${voice.testimonialKey}`);
      }
    }

    if (!group.video && !group.voicesKey && (!Array.isArray(group.voices) || group.voices.length === 0)) {
      addWarning(`${label} has no voices configured.`);
    }
  }
}

function validateServicePath() {
  const servicePath = home.howItWorks;
  if (!servicePath) {
    addError("Missing howItWorks content.");
    return;
  }

  if (!Array.isArray(servicePath.heading) || servicePath.heading.length === 0) {
    addError("howItWorks.heading must include at least one line.");
  }

  if (!Array.isArray(servicePath.steps) || servicePath.steps.length === 0) {
    addError("howItWorks.steps must include at least one step.");
  }

  for (const [index, step] of (servicePath.steps ?? []).entries()) {
    if (!step.number || !step.heading || !step.body) {
      addError(`howItWorks.steps[${index}] must include number, heading, and body.`);
    }
  }

  if (!servicePath.funding) {
    addError("howItWorks.funding is missing.");
    return;
  }

  if (!Array.isArray(servicePath.funding.items) || servicePath.funding.items.length === 0) {
    addError("howItWorks.funding.items must include at least one item.");
  }

  for (const [index, item] of (servicePath.funding.items ?? []).entries()) {
    if (!item.heading || !item.body) {
      addError(`howItWorks.funding.items[${index}] must include heading and body.`);
    }
  }
}

function validateContact() {
  const contact = home.contact;
  if (!contact) {
    addError("Missing contact content.");
    return;
  }

  if (!Array.isArray(contact.paths) || contact.paths.length === 0) {
    addError("contact.paths must include at least one path.");
  }

  for (const [index, path] of (contact.paths ?? []).entries()) {
    if (!path.heading || !path.body) {
      addError(`contact.paths[${index}] must include heading and body.`);
    }
  }

  if (!Array.isArray(contact.reasons) || contact.reasons.length === 0) {
    addError("contact.reasons must include at least one option.");
  }
}

function validateFooter() {
  const footer = home.footer;
  if (!footer) {
    addError("Missing footer content.");
    return;
  }

  if (!Array.isArray(footer.sections) || footer.sections.length === 0) {
    addError("footer.sections must include at least one section.");
  }

  for (const [sectionIndex, section] of (footer.sections ?? []).entries()) {
    if (!section.title) addError(`footer.sections[${sectionIndex}] is missing a title.`);
    if (!Array.isArray(section.links) || section.links.length === 0) {
      addError(`footer.sections[${sectionIndex}].links must include at least one link.`);
    }

    for (const [linkIndex, link] of (section.links ?? []).entries()) {
      if (!link.label || !link.href) {
        addError(`footer.sections[${sectionIndex}].links[${linkIndex}] must include label and href.`);
      }
    }
  }
}

function validateLocalAssets(value, path = "home") {
  if (typeof value === "string") {
    if (isLocalAssetPath(value)) {
      const assetPath = join(publicDir, value.slice(1));
      if (!existsSync(assetPath)) addError(`${path} points to missing public asset: ${value}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => validateLocalAssets(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      validateLocalAssets(child, `${path}.${key}`);
    }
  }
}

function isLocalAssetPath(value) {
  return value.startsWith("/")
    && !value.startsWith("//")
    && /\.[a-z0-9]+$/i.test(value);
}

validateAudiences();
validateServicePath();
validateContact();
validateFooter();
validateLocalAssets(home);

console.log("Checking homepage content references...\n");

for (const warning of warnings) console.log(`  [warn] ${warning}`);
for (const error of errors) console.log(`  [error] ${error}`);

if (errors.length === 0) {
  console.log(warnings.length === 0 ? "All clear - homepage content references are valid." : "Homepage content references are valid with warnings.");
} else {
  console.log(`Found ${errors.length} homepage content reference error(s).`);
  process.exit(1);
}
