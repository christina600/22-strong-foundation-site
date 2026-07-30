# Advisory Council — DRAFT (pulled from the site, edit before restoring)

Pulled out of the site on 2026-07-29 so Christina can edit before publishing.
These three bios were in `src/content/home.json` under `"advisors"`. That array is now empty,
and the render block is already commented out in `src/pages/about/index.astro` (plus the nav link
in `src/components/sections/SiteHeader.astro`). To put the panel back later: edit the bios below,
paste them back into the `"advisors"` array in home.json, then un-comment those two blocks.

## ⚠️ Accuracy flags to resolve first

- **John Baca — "Medal of Honor recipient":** flagged as WRONG in an earlier review. This advisor
  is not confirmed to be the Medal of Honor recipient John Baca, and there was no source document
  for this bio. Verify the person and the claim, or drop the bio, before it ever goes live.
- **Ramon Rodriguez — "A bill in Congress would award him the Medal of Honor":** he is *nominated*
  (bill HR 1596), not awarded. The current wording hedges correctly — keep it that way; don't let
  it drift into "Medal of Honor recipient."
- Ramon and Mark had sources on file in the past; John Baca did not.

---

## 1. CSM (R) Ramon Rodriguez — Advisor
Initials: RR
Credentials: 3 Silver Stars · 5 Purple Hearts · Ranger Hall of Fame inductee

One of the most decorated combat soldiers of the Vietnam War. Ramon served with the U.S. Army's
101st Airborne Division and Special Forces and retired a Command Sergeant Major after 23 years.
A bill in Congress would award him the Medal of Honor. He has spent the years since working for
veterans across Southern California.

## 2. SGT Mark Miller — Advisor
Initials: MM
Credentials: Bronze Star with "V" · U.S. Army Airborne Ranger

Mark ran long-range reconnaissance patrols in Vietnam with Company E, 20th Infantry (Airborne).
He was awarded the Bronze Star with "V" for rescuing an injured team member while under fire.

## 3. John Baca — Advisor   ⚠️ verify or remove (see flag above)
Initials: JB
Credentials: Medal of Honor recipient · U.S. Army 1st Cavalry Division

John received the Medal of Honor for his actions in Vietnam in 1970, when he covered a grenade
with his helmet and his own body, saving eight men. He has spent the decades since serving
veterans in Southern California, where a Huntington Beach park carries his name.
