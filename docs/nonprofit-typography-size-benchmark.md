# Nonprofit Typography-Size Benchmark

**Research date:** July 14, 2026  
**Project:** 22STRONG Foundation website  
**Benchmark source:** [Elevation's “50 Best Nonprofit Websites” list](https://www.elevationweb.org/best-nonprofit-websites/)  
**Subject:** Rendered typography size and responsive hierarchy

## Executive conclusion

Large typography is not, by itself, a visual-design problem. The strongest sites create one dominant display moment, then step down decisively for section headings, explanatory copy, navigation, and controls.

22STRONG's homepage hero, navigation, buttons, and mobile body copy already align with the benchmark. The primary mismatch is section-heading scale: several homepage chapter headings remain close to hero size, so the hierarchy has too many visual peaks and the page feels longer than its content requires.

The recommended correction is selective:

- Preserve the homepage hero headline.
- Create separate major-chapter and standard-section heading levels.
- Reduce the largest homepage section headings by roughly 20–30%.
- Keep 20px copy for leads and emotional statements; use 17–18px for longer explanatory copy.
- Keep navigation and CTA typography essentially unchanged.

## Methodology

The audit reviewed the current public homepage of every organization linked from Elevation's benchmark article.

For each usable desktop page, the rendered/computed typography was measured at a standard 1280px browser width:

- Largest meaningful display or hero headline
- Median visible `h2` size
- Median long-form body-copy size
- Median primary navigation size
- Median donation/support CTA size

Animated numerals and short statistical counters were excluded from the display-headline aggregate when a semantic headline was available. This prevents unusually large counters from distorting the editorial typography range.

A second pass tested a 390 × 844px mobile viewport. Thirty-one sites exposed a stable mobile document suitable for measurement. Nineteen sites used redirect documents, bot protection, consent layers, or loading transitions that did not expose a reliable mobile state; those readings were excluded instead of estimated.

Exact values can change as organizations rotate campaigns or redesign their sites. The ranges are more useful than treating any individual pixel value as a permanent standard.

## Aggregate findings

| Typography role | Desktop median | Desktop middle 50% | Mobile median | Mobile middle 50% |
|---|---:|---:|---:|---:|
| Display/hero headline | 60px | 50–71.5px | 40px | 35–47px |
| Section heading | 37.5px | 31.3–45px | 31.5px | 24.8–32.8px |
| Body copy | 17.3px | 16–18px | 16px | 16–18px |
| Navigation | 16px | 14–16px | 15.9px | 14–16.6px |
| CTA/button text | 16px | 14–18px | 16px | 14–16px |

Coverage counts reinforce those medians:

- 34 of 50 sites used meaningful display headlines between 50–80px.
- 34 of 48 measurable sites kept body copy between 16–18px.
- 43 of 49 measurable sites kept navigation between 14–18px.
- 38 of 48 measurable sites kept CTA text between 14–18px.
- 17 of 31 stable mobile sites used display headlines between 35–48px.
- 21 of 29 measurable mobile sites kept body copy between 16–18px.

## Typography-size through-lines

### 1. One dominant display moment is more common than repeated giant headings

The visual peak is usually the homepage hero or one campaign statement. Later sections step down enough that users immediately understand where a new chapter begins without mistaking every chapter for a new homepage.

Expressive examples include:

- [Thorn](https://www.thorn.org/) — approximately 90px display type with 18px body copy.
- [League of Women Voters](https://www.lwv.org/) — approximately 85px display type with 19px body copy.
- [Global Citizen](https://www.globalcitizen.org/) — approximately 84px display type with 16px body copy.
- [CARE](https://www.care.org/) — approximately 68px display type with approximately 17px body copy.

More restrained sites still preserve the same hierarchy:

- [Land Trust Alliance](https://landtrustalliance.org/) — approximately 58px display type with 18px body copy.
- [Poet Lore](https://www.poetlore.com/) — approximately 49px display type with 16px body copy.
- [Personal Genetics Education Project](https://pged.org/) — approximately 38px display type with 15px body copy.

The through-line is separation, not one universal hero size.

### 2. Section headings are normally much closer to body copy than to the hero

The desktop section-heading median is 37.5px, compared with a 60px display median. This creates an approximate scale ratio of:

- Display to body: 3.5:1
- Section heading to body: 2.2:1

On mobile, those ratios compress to approximately:

- Display to body: 2.5:1
- Section heading to body: 2:1

This compression preserves hierarchy while preventing headings from consuming most of the viewport.

### 3. Body copy is intentionally stable across breakpoints

Display type falls from a 60px desktop median to 40px on mobile—a reduction of about one-third. Body copy only falls from 17.3px to 16px.

Strong responsive systems scale expression more than readability. They do not shrink paragraph text in proportion to the hero.

### 4. Navigation and CTAs share a practical 14–18px control range

Navigation and CTA medians both land at 16px. Larger buttons gain prominence through padding, color, position, and weight rather than oversized text.

This is particularly relevant for donation controls: the action can feel important without competing typographically with the story that gives it meaning.

### 5. Large text is paired with short copy and constrained line length

The largest headlines work when they are concise and held to approximately two or three lines. Long mission explanations generally move into a smaller lead style instead of forcing a 70–90px sentence across multiple screens.

### 6. Mobile headings compress; body and controls remain usable

The stable mobile sample clustered around:

- 35–47px display type
- 25–33px section headings
- 16–18px body copy
- 14–17px navigation and CTA text

Sites that retain desktop-scale section headings on phones create avoidable page length and fragmented reading.

## Desktop measurement matrix: all 50 sites

Values are rendered pixels. A dash means the page did not expose enough comparable content for that role, not that the site lacks that content.

| # | Organization | Display | Section `h2` | Body | Nav | CTA |
|---:|---|---:|---:|---:|---:|---:|
| 1 | [Malala Fund](https://malala.org/) | 50 | 37 | 20 | 13 | 14 |
| 2 | [Girls Who Code](https://girlswhocode.com/) | 78 | — | — | 16 | 16 |
| 3 | [Phillips University Legacy Foundation](https://www.pulf.org/) | 40 | — | 15 | 14 | — |
| 4 | [Thorn](https://www.thorn.org/) | 90 | 56 | 18 | 15 | 15 |
| 5 | [Global Citizen](https://www.globalcitizen.org/) | 83.8 | 12 | 16 | 14 | 14 |
| 6 | [Prevention Network](https://www.preventionnetwork.org/) | 70 | 35 | 15 | 15 | 13 |
| 7 | [The Hunger Project](https://thp.org/) | 74 | 46 | 18 | 16 | 16 |
| 8 | [Ronald McDonald House Charities](https://ronaldmcdonaldhouse.org/) | 80 | 32 | 18 | 16 | 16 |
| 9 | [Second Harvest Foodbank of Southern Wisconsin](https://www.secondharvestsw.org/) | 76 | 52 | 16 | 15 | 16 |
| 10 | [CARE](https://www.care.org/) | 68 | 48 | 16.8 | 18 | 16 |
| 11 | [Mercy Corps](https://www.mercycorps.org/) | 49.8 | 56 | 17.5 | 18 | 18 |
| 12 | [Doctors Without Borders](https://www.doctorswithoutborders.org/) | 70 | 45 | 14 | 17 | 17 |
| 13 | [World Vision](https://www.worldvision.org/) | 70 | 28 | 18 | — | 20 |
| 14 | [Girl Scouts](https://www.girlscouts.org/) | 30 | — | 16 | 16 | 16 |
| 15 | [HerStart / Youth Challenge International](https://yci.org/herstart/) | 88 | 45 | 18 | 15 | — |
| 16 | [Junior Achievement of Southern California](https://jasocal.org/) | 57 | 54 | 16 | 14 | 14 |
| 17 | [Student Conservation Association](https://thesca.org/) | 65 | 55 | 18 | 14 | 14 |
| 18 | [Children's Defense Fund](https://www.childrensdefense.org/) | 72 | 32 | 22 | 16 | 18 |
| 19 | [Weekend Backpacks](https://www.weekendbackpacks.org/) | 58 | 21 | 17 | 14 | 17 |
| 20 | [Playworks](https://www.playworks.org/) | 48 | 31 | 16 | 13.3 | 15 |
| 21 | [YMCA of the USA](https://www.ymca.org/) | 64 | 32 | 16 | 16 | 16 |
| 22 | [Humane World for Animals](https://www.humaneworld.org/) | 75 | 65 | 20 | 16 | 20 |
| 23 | [The Humane League](https://thehumaneleague.org/) | 36 | — | — | 18 | 18 |
| 24 | [World Wildlife Fund](https://www.worldwildlife.org/) | 54 | 54 | 18 | 18 | 18 |
| 25 | [Kinder Ground](https://kinderground.org/) | 80 | 65 | 20 | 20 | 22 |
| 26 | [National Aquarium](https://aqua.org/) | 64 | 18 | 16 | 14 | 14 |
| 27 | [Puffin Cultural Forum](https://www.puffinculturalforum.org/) | 50 | 45 | 17 | 17 | 17 |
| 28 | [Poet Lore](https://www.poetlore.com/) | 49 | 38 | 16 | 14 | 14.5 |
| 29 | [Quechua Benefit](https://www.quechuabenefit.org/) | 52 | 40 | 15 | 15 | 14 |
| 30 | [National Geographic Society](https://www.nationalgeographic.org/) | 60 | 39 | 16 | 16 | 16 |
| 31 | [The Nature Conservancy](https://www.nature.org/) | 60 | 40 | 16 | 13 | 14 |
| 32 | [Conservation International](https://www.conservation.org/) | 80 | 27 | 18 | 18 | 18 |
| 33 | [National Park Foundation](https://www.nationalparks.org/) | 64 | 24 | 16 | 14 | 14 |
| 34 | [Land Trust Alliance](https://landtrustalliance.org/) | 57.8 | 39.2 | 18 | 15.8 | 16.9 |
| 35 | [David Suzuki Foundation](https://davidsuzuki.org/) | 44 | 44 | 16 | 20 | 20 |
| 36 | [League of Women Voters](https://www.lwv.org/) | 85 | 25 | 19 | 17 | 20.5 |
| 37 | [Freedom House](https://freedomhouse.org/) | 68 | 28 | 18 | 15 | 16 |
| 38 | [World Resources Institute](https://www.wri.org/) | 74 | 24 | 20 | 14 | 13 |
| 39 | [Colorado Lab](https://coloradolab.org/) | 60 | 32 | 15 | 14.5 | — |
| 40 | [Make-A-Wish America](https://wish.org/) | 34 | 36 | 18 | 16 | 18 |
| 41 | [Children's Organ Transplant Association](https://cota.org/) | 66 | 48 | 20 | 16 | 20 |
| 42 | [Personal Genetics Education Project](https://pged.org/) | 38 | 18 | 15 | 14 | 14 |
| 43 | [American Heart Association](https://www.heart.org/) | 50 | 24 | 16 | 16 | 16 |
| 44 | [American Lung Association](https://www.lung.org/) | 52 | 35 | 18 | 16 | 16 |
| 45 | [National Scleroderma Foundation](https://scleroderma.org/) | 36 | — | 16 | 12 | 11 |
| 46 | [Treatment Advocacy Center](https://www.tac.org/) | 45 | 33 | 19.2 | 17 | 19.2 |
| 47 | [Covenant House](https://www.covenanthouse.org/) | 40 | 40 | 18 | 16 | 18 |
| 48 | [Habitat for Humanity of Lake County](https://habitatlmc.org/) | 59 | 36 | 16 | 16 | 14 |
| 49 | [Time Out Youth](https://timeoutyouth.org/) | 55 | 42 | 18 | 15 | 15 |
| 50 | [Reconciling Ministries Network](https://rmnetwork.org/) | 63 | 43 | 18 | 16 | 17 |

## Mobile audit limitations

Thirty-one sites produced a stable 390 × 844px mobile document. These nineteen did not expose a reliable measurement state during the responsive pass:

- Phillips University Legacy Foundation
- Second Harvest Foodbank of Southern Wisconsin
- CARE
- Mercy Corps
- Doctors Without Borders
- World Vision
- Junior Achievement of Southern California
- Student Conservation Association
- Children's Defense Fund
- Weekend Backpacks
- National Aquarium
- Puffin Cultural Forum
- Poet Lore
- Quechua Benefit
- Conservation International
- Treatment Advocacy Center
- Covenant House
- Habitat for Humanity of Lake County
- Time Out Youth

They remain included in the complete desktop audit.

## 22STRONG comparison

### Already aligned

- **Hero headline:** approximately 58px at the benchmark desktop width and approximately 42px on mobile. This sits almost exactly on the benchmark median.
- **Navigation:** approximately 15–16px. This is within the dominant control range.
- **CTA text:** approximately 15–16px. This is within the dominant control range.
- **Mobile body copy:** approximately 16px. This matches the benchmark median.

### Needs correction

- **Major chapter headings:** currently reach approximately 67–93px on desktop, depending on the section, and approximately 47–51px on mobile. Several therefore compete with the hero rather than forming a clear second tier.
- **Long-form desktop copy:** approximately 20px in several sections. This is appropriate for a lead or emotional statement, but it is at the top edge of the benchmark for explanatory paragraphs.
- **Heading repetition:** multiple oversized headings across the homepage create repeated visual peaks, increasing perceived page length.

## Recommended 22STRONG scale

This scale intentionally remains slightly more expressive than the benchmark median so the site retains its editorial, high-impact character.

| Role | Desktop target | Mobile target |
|---|---:|---:|
| Hero headline | 58–72px | 40–46px |
| Major chapter heading | 54–68px | 38–42px |
| Standard section heading | 36–48px | 30–36px |
| Lead paragraph | 20–23px | 18–20px |
| Regular body copy | 17–18px | 16–18px |
| Navigation/button | 14–17px | 14–17px |
| Label/metadata | 12–14px | 12–14px |

## Implementation guidance

1. Preserve the current hero scale and typeface.
2. Add two explicit heading tokens: major chapter and standard section.
3. Apply the major token to the homepage's primary narrative transitions.
4. Apply the standard token to conversion, contact, support, and explanatory headings.
5. Reserve 20px+ body copy for leads; keep longer paragraphs at 17–18px.
6. Keep navigation and CTA sizes unchanged.
7. Use fluid `clamp()` values that reduce display type substantially on mobile while holding body and controls steady.
8. Verify long headlines at 1280px, 768px, and 390px so no heading creates an accidental one-word line.

## Recommended design principle

> Let the hero own the largest voice. Let chapter headings organize the journey. Let body copy remain effortless to read.

