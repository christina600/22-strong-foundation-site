# 22STRONG Donation and Monthly-Giving Benchmark

**Research date:** July 13, 2026  
**Project:** 22STRONG Foundation website  
**Benchmark source:** [Elevation's “50 Best Nonprofit Websites” list](https://www.elevationweb.org/best-nonprofit-websites/)  
**Purpose:** Preserve the donation audit, the monthly-giving crawl, and the recommended through-line for 22STRONG and the Strong Circle.

## Decision summary

The strongest recurring-giving experiences do not present monthly giving as a billing setting. They make it a named, ongoing relationship with a clear reason to exist.

22STRONG already has the right strategic idea: **Strong Circle** is more memorable and more ownable than a generic “Monthly” toggle. The site should preserve that identity, give it a real landing page, and connect it to a simple operational promise:

> Steady monthly support lets 22STRONG approve the next recovery session before care stalls.

The recommended donor journey is:

1. Understand the recovery-care gap.
2. See one real person and one credible outcome.
3. Understand why predictable monthly funding matters.
4. See the concrete equation: **nine members at $22/month cover one $190 recovery session.**
5. Choose one of four simple amounts.
6. Complete a monthly-default checkout without losing visual continuity or trust.
7. Receive an honest, sustainable cadence of impact updates after joining.

This should remain distinct from the one-time donation ask. One-time giving closes a current gap; Strong Circle gives 22STRONG the dependable base to respond to the next one.

## Scope and methodology

The review covered:

- The organizations linked from Elevation's benchmark article.
- Homepage and primary-navigation visibility of donating and monthly giving.
- Donation-page hierarchy, form behavior, recurring-gift defaults, amount choices, impact framing, visual treatment, trust signals, and stewardship promises.
- Dedicated recurring programs, donor societies, sponsorship models, and simple checkout-only monthly toggles.
- The current 22STRONG implementation in this repository.

### Audit limitations

- All 50 listed organizations were reviewed. Forty-eight exposed a donor-facing transaction path or enough public source evidence to assess it. Puffin Cultural Forum does not solicit donations, and Colorado Lab did not expose a public donor portal; those are intentional/non-comparable cases rather than crawl failures.
- Several portals use bot checks or JavaScript-only embeds. Where a rendered form was unavailable, the audit used the organization's public page copy, link destinations, embed source, and platform markup. This affected Junior Achievement of Southern California, Treatment Advocacy Center, National Scleroderma Foundation, Prevention Network, Poet Lore, and Time Out Youth most visibly.
- The Hunger Project and Doctors Without Borders did not expose every current checkout state consistently to automated inspection, so their platform and surface observations should be treated as directional.
- Several third-party donation platforms render most form content with JavaScript. In those cases, a monthly option may exist even when the public page does not expose a recurring-giving proposition.
- “Not found” means no credible monthly-giving proposition was visible in the reviewed public journey; it does not prove the organization cannot process recurring gifts.
- The article describes the organizations as Elevation's favorites of 2024 even though its current title says 2025.
- The Student Conservation Association and Quechua Benefit sites exposed apparent spam/injected content during the broader crawl. They should not be used as implementation references until their current site integrity is verified.
- Colorado Lab displayed a placeholder-style EIN (`12-3456789`) in the reviewed donation/trust content. That is a useful reminder to verify every legal and trust detail before launch.

## Part I — General donation findings

### What the strongest donation experiences have in common

#### 1. A donation action is always recognizable

The strongest sites keep a visually distinct **Donate**, **Give**, or **Give Now** action in the header, usually at the upper right. Mission-specific language can appear deeper in the journey, but the primary action does not make visitors decode a clever label.

**Apply to 22STRONG:** Keep the rust Donate control visually distinct. In the dropdown, use plain-language labels alongside the program name:

- Give Once
- Join Strong Circle — Give Monthly

#### 2. The ask follows enough story to create meaning

The better experiences establish the problem, show a real person or outcome, and then present the controls. They do not interrupt the visitor with an immediate donation popup before trust exists. Elevation itself recommends an end-of-page donation panel instead of an early popup.

**Apply to 22STRONG:** Preserve the current sequence of recovery gap → human proof → donation control. Keep Adam Folker's attribution clear and place any beneficiary image outside the actual control surface.

#### 3. Amounts are decisions, not decorative cards

Effective forms use a small number of flat, high-contrast options with one unmistakable selected state. They avoid halos, multiple “featured” treatments, or pricing-table styling that competes with the user's choice.

**Apply to 22STRONG:** Use four primary one-time choices, keep `$190` as the default session amount, add a clear custom amount field, and ensure only one amount looks selected.

#### 4. Presets explain impact

The most persuasive amount choices connect money to an understandable outcome. The description is short enough to scan and credible enough to defend.

**Apply to 22STRONG:** Continue grounding amounts in session and care-plan costs. Avoid implying precision the organization cannot document.

#### 5. The final CTA repeats the decision

Dynamic labels such as “Give $190 securely” reduce ambiguity and confirm the selected amount and frequency.

**Apply to 22STRONG:** Keep the checkout button synchronized with the amount. For monthly giving, use “Join at $22/month” rather than a generic “Submit.”

#### 6. Trust sits next to the moment of commitment

Good forms show a compact trust line near the CTA: secure checkout, tax status, EIN, receipt expectations, and links to financial or impact information. Ratings and seals help only when current and verified.

**Apply to 22STRONG:** Keep the EIN, 501(c)(3) status, tax-deductibility statement, receipt expectation, and transparency link close to the form. Do not add badge clutter.

#### 7. Checkout continuity matters

Focused checkout pages reduce or remove navigation, retain recognizable branding, and avoid making the visitor feel sent to an unrelated company.

**Apply to 22STRONG:** Prefer an embedded Givebutter widget if it performs accessibly. If the project continues linking out, pass amount, frequency, and source parameters and make the destination visually consistent. See Givebutter's documentation for [website widgets](https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website) and [URL/HTML parameters](https://help.givebutter.com/en/articles/4868782-how-to-leverage-url-and-html-parameters).

### General donation anti-patterns

- Early donation popups before visitors know the organization.
- False countdowns, invented scarcity, or unsupported urgency.
- Stock imagery where authentic program imagery is available.
- Multiple buttons or cards that all appear selected.
- Large badge walls that compete with the action.
- Monthly giving buried as an unexplained checkbox.
- A third-party checkout that feels visually or verbally unrelated.
- Impact claims that are not backed by current financial data.

## Part II — Monthly-giving crawl

### The central finding

Only a minority of the benchmark sites make monthly giving obvious from the homepage or main navigation. Many can technically process a recurring gift but reveal it only inside checkout.

That produces three distinct maturity levels:

1. **Frequency only:** “One time / Monthly” appears in the form.
2. **Dedicated proposition:** the site explains why monthly support is useful and links to a monthly-default form.
3. **Named relationship:** the recurring program has a name, identity, promise, and ongoing donor experience.

The third model is the strongest fit for 22STRONG. Strong Circle should not be reduced to a frequency toggle.

### Strong recurring-giving patterns

#### A. Give the relationship a name

Strong examples include:

- [Thorn Builders](https://www.thorn.org/donate/) — monthly donors are one rung in a coherent supporter-community architecture.
- [Mercy Corps Partner in Possibility](https://www.mercycorps.org/donate/become-monthly-giver) — dependable support is framed as an ongoing partnership.
- [Second Harvest Sustainers' Circle](https://donate.secondharvestsw.org/give/336342/) — recurring giving is connected to planning, community, and ongoing access.
- [The Nature Conservancy's Conservation Champions](https://www.nature.org/en-us/membership-and-giving/donate-to-our-mission/give-monthly/) — reliable support, flexibility, and efficiency are explained before the form.
- National Park Sustainers — steady support plus member communications.
- Land Trust Alliance's Stewards of the Land — a year-round relationship tied to a long horizon.
- [Reconciling Ministries Network's Wellspring](https://rmnetwork.org/wellspring/) — the program metaphor and language reinforce the idea of a steady current.
- [Playworks Joymakers](https://www.playworks.org/colorado/about/playworks-joymakers-program/) — a named monthly community with tiers, updates, invitations, and recognition.

**Lesson:** The program name should express belonging and continuity, while a plain-language subtitle still says “monthly giving.”

#### B. Explain the operational value of predictability

The best programs explain why recurring revenue changes the organization's ability to work: it is dependable, efficient, easier to plan around, and available when needs emerge.

Mercy Corps explains effectiveness, ease, efficiency, and community. The Nature Conservancy uses easy, flexible, and efficient. Second Harvest emphasizes planning. These are more convincing than simply asking a donor to repeat a transaction.

**Lesson for 22STRONG:** The strongest argument is not “monthly is convenient.” It is “predictable support lets us approve care before a recovery plan stops.”

#### C. Use a concrete, repeatable impact equation

Examples commonly connect a monthly amount to food, shelter, a protected place, a wish, or a recurring service. [Covenant House](https://www.covenanthouse.org/spts-donate-monthly) uses `$19/month` and a safe place to sleep. [The Humane League](https://thehumaneleague.org/) presents a compact, monthly-default amount module. [Humane World for Animals](https://www.humaneworld.org/en) separates a `$19+` monthly ask from one-time giving.

**Lesson for 22STRONG:** “Nine members at $22/month cover one $190 session” is an unusually strong program mechanic. It should become the central visual and verbal proof point.

#### D. Use real people before the controls

The better dedicated pages place an authentic beneficiary, supporter, or field image near the top and use the form after the visitor understands the story. Mercy Corps and the [American Lung Association](https://www.lung.org/get-involved/ways-to-give/donate-monthly) do this especially well.

**Lesson for 22STRONG:** Use one real recovery story, not a collage. Keep video optional and user-controlled. A vertical testimonial video can sit inside a conventional 16:9 frame using a blurred-motion background derived from the same footage; the sharp portrait video remains centered and fully visible.

#### E. Make flexibility explicit

Successful pages reduce the perceived commitment risk with simple statements such as “change or cancel anytime,” “automatic,” and “annual tax statement.” This belongs next to checkout, not buried in legal copy.

**Lesson for 22STRONG:** Keep “Monthly. Cancel anytime.” Add the receipt expectation and a clear method for changing or ending the gift.

#### F. Promise only the stewardship the organization can sustain

Thorn offers webinars, newsletters, quarterly impact reports, and other benefits. Playworks offers updates, invitations, connection, and recognition. These are effective because they turn recurring giving into an ongoing relationship, but they also create operational obligations.

**Lesson for 22STRONG:** Impact updates matter more than merchandise. Confirm that “updates from Travis,” invitations, and “a first look at what's next” can actually be delivered on a defined schedule before publishing them as benefits.

### Visual through-lines worth applying

#### 1. Give monthly giving a related but distinct visual mode

Use the same typography, photography, spacing, and texture as the rest of 22STRONG, but let teal own Strong Circle while rust remains the primary transactional/action color. This distinguishes the program without making it look like a separate organization.

#### 2. Turn the Strong Circle mark into an explanatory device

The nine-segment mark should do more than decorate the page. Each segment can represent one `$22/month` member; the completed ring represents enough support to cover one `$190` session. Use the motif sparingly at the hero, impact equation, and confirmation state.

#### 3. Keep amount controls flat and calm

Monthly tiers should not resemble software pricing plans. Use four simple options—`$22`, `$50`, `$100`, and `$190`—with one selected state, a one-line impact note, and a custom option.

#### 4. Keep authentic imagery around the form, not inside every choice

One strong image or testimonial creates emotional context. Repeating photos inside every tier makes the choice harder to scan and can feel promotional.

#### 5. Preserve visual continuity through checkout

If Givebutter remains external, the landing state should already reflect the selected monthly amount. If embedded, the widget should inherit the page's spacing and hierarchy without being over-skinned or made inaccessible.

## Monthly-giving benchmark matrix

### Legend

- **Prominent:** visible from the homepage or primary navigation.
- **Dedicated:** a recurring-giving page or named program exists, but it is not necessarily homepage-prominent.
- **Form only:** monthly giving is primarily a frequency choice or checkout capability.
- **Not found:** no credible recurring-giving proposition was found in the reviewed public journey.
- **Blocked:** the public site did not permit a reliable inspection.

| # | Organization | Observed monthly model | Most useful takeaway |
|---:|---|---|---|
| 1 | Malala Fund | Dedicated monthly campaign; one-time/monthly form | A timely story can lead into a monthly-default ask without inventing a separate society. |
| 2 | Girls Who Code | Form only; frequency selector | Strong program-specific amounts, but recurring giving is not a distinct relationship. |
| 3 | Phillips University Legacy Foundation | Form/FAQ only | Convenience, annual statement, and easy pause/stop reduce commitment anxiety. |
| 4 | Thorn | Dedicated, named **Thorn Builders** | Excellent supporter ladder, benefits, testimonials, and recurring-community identity. |
| 5 | Global Citizen | Not found | Engagement and action are more central than a public monthly-giving proposition. |
| 6 | Prevention Network | Not found | No monthly program surfaced in the reviewed path. |
| 7 | The Hunger Project | Blocked | Site challenge prevented a reliable current-form audit. |
| 8 | Ronald McDonald House Charities | Form-level/locally variable | Concise donation content; recurring strategy appears chapter/platform dependent. |
| 9 | Second Harvest Foodbank of Southern Wisconsin | Dedicated, named **Sustainers' Circle** | Concrete food impact, planning value, community, events, and fewer mailings. |
| 10 | CARE | Prominent; **Partners for Change** language | Header splits Give Once and Give Monthly; continuity is framed month after month. |
| 11 | Mercy Corps | Prominent, named **Partner in Possibility** | One of the best story → reasons → form → trust sequences. |
| 12 | Doctors Without Borders | Blocked | 403 response prevented a reliable current monthly audit. |
| 13 | World Vision | Dedicated monthly child sponsorship | Strongest example of turning recurrence into an understandable relationship and identity. |
| 14 | Girl Scouts | Not prominent; council dependent | Recurring requests exist locally, but the national journey does not present one unified program. |
| 15 | HerStart / Youth Challenge International | Not found | Story and newsletter engagement are more visible than monthly giving. |
| 16 | Junior Achievement of Southern California | Form/platform level | Qgiv integration supports transactions; no strong public recurring identity surfaced. |
| 17 | Student Conservation Association | Not found | Do not use as a current model until apparent injected/spam content is investigated. |
| 18 | Children's Defense Fund | Form level | Strong trust/footer system; recurring proposition is not homepage-led. |
| 19 | Weekend Backpacks | Not found | Donation integration is clear, but monthly giving was not surfaced as a program. |
| 20 | Playworks | Dedicated; regional **Joymakers** program | Clear tiers, belonging, updates, invitations, recognition, and recurring-default checkout. |
| 21 | YMCA of the USA | Not prominent; local programs vary | National giving is simple; local Ys may operate named recurring societies such as the 1887 Society. |
| 22 | Humane World for Animals | Prominent dedicated ask | A separate `$19+` monthly block and explicit “Start Your Monthly Gift” CTA. |
| 23 | The Humane League | Prominent embedded monthly module | Compact presets, explicit monthly repetition, direct CTA, and trust immediately below. |
| 24 | World Wildlife Fund | Prominent in giving navigation/campaigns | Monthly giving is often packaged through TV response, membership, or symbolic adoption. |
| 25 | Kinder Ground | Not found | Strong donation guarantee and trust, but no monthly proposition surfaced. |
| 26 | National Aquarium | Not found as recurring donation | Membership and ticketing dominate; support is broader than a monthly-donor program. |
| 27 | Puffin Cultural Forum | Not found | The site prioritizes events and information over direct recurring fundraising. |
| 28 | Poet Lore | Not found as donation | Subscription is the ongoing relationship, not recurring philanthropy. |
| 29 | Quechua Benefit | Not found | Do not use as a current model until apparent injected/spam content is investigated. |
| 30 | National Geographic Society | Dedicated **Sustaining Member** campaigns | Campaign-specific monthly presets, matching, benefits, and strong brand continuity. |
| 31 | The Nature Conservancy | Prominent, named **Conservation Champions** | Story, reliable support, easy/flexible/efficient reasons, benefits, then trust. |
| 32 | Conservation International | Dedicated campaign **Sustaining Member** | Ties predictable monthly support to one concrete conservation initiative. |
| 33 | National Park Foundation | Prominent, named **National Park Sustainers** | Steady-resource language, member access, communications, presets, and trust. |
| 34 | Land Trust Alliance | Prominent, named **Stewards of the Land** | Year-round support and a long-term horizon create meaning beyond frequency. |
| 35 | David Suzuki Foundation | Prominent dedicated monthly path | Separate image cards for monthly/one-time and a monthly-default, step-based checkout. |
| 36 | League of Women Voters | Prominent form toggle | Good frequency visibility, but no distinct recurring-community proposition. |
| 37 | Freedom House | Not found | No credible monthly-giving proposition surfaced in the reviewed public path. |
| 38 | World Resources Institute | Dedicated support-page mention/form | Explains one-time vs monthly capability clearly; trust ratings sit on the support page. |
| 39 | Colorado Lab | Not found | Not a useful donation benchmark; verify all legal/trust data because placeholder-style EIN copy appeared. |
| 40 | Make-A-Wish America | Dedicated/chapter dependent; some use **Wishing Well** | Strong “all year long” language; named chapter programs turn repetition into replenished hope. |
| 41 | Children's Organ Transplant Association | Not found | Individual-family fundraising is the clearer public mechanism. |
| 42 | Personal Genetics Education Project | Not found | Education/events are more central than a recurring donor journey. |
| 43 | American Heart Association | Prominent | Header directly separates Donate Once and Donate Monthly. |
| 44 | American Lung Association | Prominent dedicated page | Authentic images, mission reasons, donor testimony, flexibility, and strong financial trust. |
| 45 | National Scleroderma Foundation | Form only | Monthly is supported, but it is not developed into a distinct public relationship. |
| 46 | The Advocacy Center | Not found | No monthly proposition surfaced in the reviewed journey. |
| 47 | Covenant House | Prominent dedicated page | Specific `$19/month` impact, authentic youth imagery, and reassuring trust/FAQ content. |
| 48 | Habitat for Humanity of Lake County | Form/platform level | Donation trust is strong; no named recurring program surfaced. |
| 49 | Time Out Youth | Not found | A legacy recognition community exists, but no public monthly program surfaced. |
| 50 | Reconciling Ministries Network | Dedicated, named **The Wellspring** | Strong metaphor, belonging, repeated-action language, and a focused embedded form. |

## Part III — Donation portal and transaction-box audit

### Coverage and method

This pass focused on the transaction surface rather than the broader donation story. It reviewed the first usable donation state for all 50 organizations and recorded:

- Whether the gift form stayed on the nonprofit's site, opened in a modal, used an embedded third-party frame, or handed off to a hosted portal.
- Frequency controls, preset amounts, selected states, custom amounts, and visible form depth.
- Mission imagery, impact copy, trust language, credentials, payment options, and secondary choices.
- Dedications, fee coverage, employer matching, anonymity, donor-advised funds, and alternate giving paths when visible.
- Technical platform signals in page, script, iframe, and checkout markup.

Forty-eight organizations exposed a donor-facing transaction path. Puffin Cultural Forum is privately funded and explicitly says it does not solicit donations. Colorado Lab, which is housed at the University of Denver, did not expose a public donation action and is not a useful transaction benchmark.

The numeric findings below are conservative lower bounds because cross-origin frames and later checkout steps do not expose every option to an automated first-step review:

- **At least 33 of 48** donor-facing paths visibly exposed both one-time and recurring language.
- **At least 32 of 48** exposed preset amount buttons in the first rendered state.
- Public checkout content exposed privacy language on 37 paths, tax/501(c)(3) language on 31, and explicit secure/encrypted language on 23. The more important finding is placement: the strongest examples put reassurance beside the decision rather than only in a footer.
- Tribute or dedication controls appeared on at least 30 paths. Fee coverage appeared on 8, employer matching on 4, anonymity on 6, and donor-advised-fund language on 5 during the initial visible journey.
- Third-party technology was normal, not exceptional. Fundraise Up, Blackbaud/Luminate, Classy, Qgiv, Funraise, Network for Good/Bonterra, DonorPerfect, Little Green Light, Kindful/Bloomerang, Springboard, and institution-specific giving systems all appeared. The platform mattered less than whether the nonprofit preserved brand and context around it.

### The four dominant transaction models

#### 1. Branded, persistent split page

Examples such as Malala Fund, The Humane League, Humane World for Animals, and WWF place one authentic image or a concise story beside a stable form card. This model is strongest when the image provides emotional context and the form remains quiet, rectangular, and easy to scan.

**Best feature:** The donor can see the mission and the decision at the same time.

**Main risk:** Large story blocks, thank-you merchandise, or extra giving choices can push payment too far down the page.

#### 2. Branded modal or overlay

Fundraise Up implementations at Land Trust Alliance, American Heart Association, American Lung Association, and similar sites keep the visitor on the originating page while presenting a focused two-panel checkout. The best versions include one image, one short impact statement, frequency, amounts, and a single action.

**Best feature:** Strong continuity with less navigation distraction.

**Main risk:** An unsolicited popup shown before the visitor asks to donate feels interruptive. Cookie banners can also obscure the modal and create two competing overlays.

#### 3. Embedded third-party widget

Qgiv, Classy, Kindful, DonorPerfect, Little Green Light, and other widgets let the nonprofit surround checkout with its own story, impact, and trust content. Junior Achievement of Southern California is a strong conceptual example: a real-person visual and mission copy lead into an embedded Qgiv form.

**Best feature:** The organization controls the narrative and page hierarchy.

**Main risk:** A generic-looking iframe, slow loader, or abrupt typography change makes the transaction feel bolted on.

#### 4. Hosted campaign or institutional portal

Second Harvest uses a branded Classy campaign destination; Weekend Backpacks uses Network for Good; PGED hands off to Harvard's institutional giving portal; National Scleroderma Foundation uses Blackbaud/Luminate. A hosted portal can work when the domain, logo, colors, and selected gift remain continuous.

**Best feature:** Operational simplicity and mature payment handling.

**Main risk:** Loss of mission context, visual discontinuity, a surprise domain, or a long form that asks for too much before payment.

### Visual and strategic through-lines

#### Put the transaction beside one piece of human proof

The most persuasive forms use one strong image and a short mission statement. The Humane League, Humane World for Animals, Malala Fund, Conservation International, Land Trust Alliance, and American Lung Association all demonstrate versions of this pattern. A collage or a photo inside every amount choice is less effective.

#### Keep the control surface calmer than the surrounding campaign

Effective forms use a white or near-white card, a restrained border, generous spacing, and a single strong selection color. The emotional energy belongs in the image and headline; the transaction itself should feel stable and safe.

#### Treat frequency as a primary choice

The clearest forms use two equally legible controls—**Give once** and **Monthly**—near the top. Humane World for Animals, The Humane League, WWF, Conservation International, and Land Trust Alliance default visibly to monthly. One-time-led pages such as American Heart Association and American Lung Association still keep monthly immediately available.

#### Explain monthly in one sentence at the point of choice

Small prompts such as “save animals year-round” or “make a lasting difference” work because they explain the operational meaning without adding another paragraph. This supports the broader Strong Circle story; it does not replace it.

#### Use four to six presets and one obvious custom amount

Most effective controls show four to six flat amount buttons. Larger matrices, mixed denominations, and outlier amounts make comparison harder. A custom amount should look like an intentional option, not a faint leftover field.

#### Show impact after selection, not inside every button

Ronald McDonald House Charities uses a selected amount followed by a compact impact statement. This keeps the buttons scannable while still giving the donor evidence. It is a better fit for 22STRONG than multi-line pricing cards.

#### Place trust in a narrow reassurance layer

“Secure donation,” tax status, EIN, receipt expectations, change/cancel guidance, and one verified transparency link are enough. Nature Conservancy, Playworks, American Heart Association, and American Lung Association show useful trust cues, but the badge-heavy examples also demonstrate why credentials should not compete with the amount choice.

#### Reduce the first step to amount, frequency, and action

The shortest modern modal forms defer personal and payment details to a later step. Legacy forms that show title, address, designation, tribute, public-name, matching, and payment fields at once feel longer even when they contain the same information.

#### Preserve alternative payment methods without making them the headline

Payment flexibility reduces abandonment, but cards, ACH, PayPal, and compatible wallets should appear only when relevant. Givebutter currently supports cards, ACH, PayPal, Cash App Pay, DAFs, and compatible digital wallets; Venmo is not available for recurring plans. Apple Pay on an embedded widget requires registering the site's domain. See Givebutter's [payment-method documentation](https://help.givebutter.com/en/articles/1726573-how-to-configure-payment-methods-on-givebutter) and [recurring-plan documentation](https://help.givebutter.com/en/articles/3216251-how-to-enable-and-manage-recurring-plans).

### Transaction-box matrix: all 50 benchmark organizations

| # | Organization / observed portal | Transaction approach | Visual or strategic lesson |
|---:|---|---|---|
| 1 | [Malala Fund](https://malala.org/donate?sc=header) | Branded split page; one-time/monthly; `$25–$250` presets | Excellent authentic image and mission/form continuity; the form begins slightly low in the first viewport. |
| 2 | [Girls Who Code](https://give.girlswhocode.com/campaign/689554/donate) | Branded hosted campaign form with payment processing; one-time/monthly; four presets | Clear amount selection and tax language; the campaign shell is more generic than the main site's visual system. |
| 3 | [Phillips University Legacy Foundation](https://www.pulf.org/donate/) | Embedded Qgiv; one-time-first; `$25–$200` presets | Functional and accessible, but the visible field count makes the form feel administrative. |
| 4 | [Thorn](https://info.thorn.org/donate) | Embedded Funraise; one-time/monthly; four presets | Strong two-column story/control balance and calm selected states; cookie consent obscures the action in the first viewport. |
| 5 | [Global Citizen](https://www.globalcitizen.org/en/involved/donate/usa/) | Fundraise Up-backed on-site donation path | Keeps the action close to the brand, but the public form state exposes limited impact detail before checkout. |
| 6 | [Prevention Network](https://www.preventionnetwork.org/donate/) | Embedded Little Green Light form; impact amounts explained above it | The `$25–$500` impact list and EIN are useful; the legacy embed feels less visually integrated than the surrounding site. |
| 7 | [The Hunger Project](https://thp.org/?form=give-now) | Fundraise Up-triggered page/modal | Fast path from a persistent “Give Now” action; avoid letting the cookie banner become a second competing transaction layer. |
| 8 | [Ronald McDonald House Charities](https://ronaldmcdonaldhouse.org/donate) | On-brand embedded form; one-time/monthly; `$25–$500` presets | Selected amount immediately produces a compact impact statement; alternative giving information is useful but lengthens the page. |
| 9 | [Second Harvest Foodbank of Southern Wisconsin](https://donate.secondharvestsw.org/give/415822/#!/donation/checkout) | Branded Classy checkout; one-time/monthly; `$25–$200` presets | Strong food-impact sentence and helpful FAQ panel; the full personal-information form creates a long first screen. |
| 10 | [CARE](https://my.care.org/site/Donation2?df_id=51720&mfc_pref=T&51720.donation=form1) | Blackbaud/Luminate campaign page; one-time/monthly; high-value presets | Powerful urgent image and quantified impact; the actual controls are pushed below a long campaign story. |
| 11 | [Mercy Corps](https://www.mercycorps.org/donate) | Branded on-site form; one-time/monthly; five presets | Strong trust and alternate-giving coverage; keep the initial field set shorter than the legacy implementation. |
| 12 | [Doctors Without Borders](https://donate.doctorswithoutborders.org/) | Focused Springboard donation experience | Reduced navigation and strong transaction focus are worth copying; bot protection limited full automated state inspection. |
| 13 | [World Vision](https://www.worldvision.org/donate) | Embedded branded form; one-time/monthly; four presets | Trust credentials and program context support the ask without overdecorating the amount buttons. |
| 14 | [Girl Scouts](https://www.girlscouts.org/en/support-us/donate/donate-now.html) | Embedded Blackbaud/Luminate; one-time/recurring; `$25`, `$100`, `$250` | Frequency and anonymity are clear, but oversized whitespace delays the actual transaction. |
| 15 | [HerStart / Youth Challenge International](https://yci.akaraisin.com/ui/CirclesofImpact) | Externally hosted Aka Raisin campaign | Operationally straightforward; the handoff loses more of the source site's identity and story than the strongest examples. |
| 16 | [Junior Achievement of Southern California](https://jasocal.org/donate/) | Embedded Qgiv in a custom donation page | Strong use of a real-person visual, mission copy, impact sections, and alternate giving around the form; bot checks affect load reliability. |
| 17 | [Student Conservation Association](https://thesca.donorsupport.co/page/FUNUKJZAJVA) | Hosted/embedded Fundraise Up-style form; one-time/monthly; six presets | Compact selection and payment support; do not use as a reference until the broader site's apparent injected content is resolved. |
| 18 | [Children's Defense Fund](https://www.childrensdefense.org/donate/) | Branded on-site transaction page | Security and tax language are present; the public transaction path is more functional than emotionally differentiated. |
| 19 | [Weekend Backpacks](https://weekendbackpacks.networkforgood.com/projects/152542-general-donations) | External Network for Good checkout; one-time/monthly/annual | Simple presets and reliable processing; the generic hosted shell weakens visual continuity. |
| 20 | [Playworks](https://donate.playworks.org/give/46209#!/donation/checkout) | Branded Classy checkout; one-time/monthly; four presets | Authentic image, mission bullets, FAQ, and verified badges build trust; the visible form becomes long. |
| 21 | [YMCA](https://www.ymca.org/donate) | Embedded national giving form | The national path is direct and restrained; local-chapter variability makes impact and recurring language less unified. |
| 22 | [Humane World for Animals](https://secure.humaneworld.org/page/160634/donate/1) | Fully branded split page; monthly default; presets and payment methods visible | One of the strongest examples: real image, monthly rationale, employer-match search, secure label, and wallets all remain scannable. |
| 23 | [The Humane League](https://donate.thehumaneleague.org/donate) | Fully branded split page; monthly default; `$8–$36/month` | Excellent visual integration, compact monthly framing, one selected state, and security directly below the CTA. |
| 24 | [World Wildlife Fund](https://protect.worldwildlife.org/page/98678/donate/1) | Full branded page; monthly default; `$10–$50/month` | Strong monthly explanation and wildlife image; thank-you-gift merchandise adds extra decisions that 22STRONG does not need. |
| 25 | [KinderGround](https://kinderground.networkforgood.com/projects/216875-support-kinder-ground) | External Network for Good checkout; frequency dropdown; five presets | Full-bleed mission image is emotionally strong; designation, donor-scroll note, and other options make the transaction denser. |
| 26 | [National Aquarium](https://aqua.org/support/donate) | Branded support/donation page with embedded processing | Maintains the aquarium identity, but membership, tickets, and other support modes are more central than a focused recurring transaction. |
| 27 | [Puffin Cultural Forum](https://www.puffinculturalforum.org/) | No public donation portal; the privately funded foundation says it does not solicit donations | Not a transaction reference; its inclusion in the design list should not be interpreted as a fundraising benchmark. |
| 28 | [Poet Lore](https://www.poetlore.com/donate/) | DonorPerfect iframe below editorial story and tax copy | The mission case is concise and relevant; the generic iframe breaks typography and visual continuity. |
| 29 | [Quechua Benefit](https://www.quechuabenefit.org/donate/) | On-page form with Stripe signals | Transaction basics are present, but apparent injected content elsewhere on the site disqualifies it as a current implementation model. |
| 30 | [National Geographic Society](https://give.nationalgeographic.org/page/102996/donate/1) | Branded hosted donation page; one-time/monthly; `$35–$1,000` | Strong institutional continuity and recognizable imagery; keep benefit/membership choices from crowding the core gift. |
| 31 | [The Nature Conservancy](https://preserve.nature.org/page/80429/donate/1) | Branded full page; one-time default with immediate monthly option | Hero, credential, story, and form feel trustworthy; a small handwritten monthly nudge works better than another paragraph. |
| 32 | [Conservation International](https://give.conservation.org/page/EVER-WEB-TOPNAV) | Fundraise Up form; monthly default; `$5–$250` presets | Excellent split between a real landscape image and a very calm secure form; recent-donor feed is optional noise. |
| 33 | [National Park Foundation](https://give.nationalparks.org/site/Donation2?df_id=12721&12721.donation=form1) | Blackbaud/Luminate; one-time/monthly; six presets | Familiar and trustworthy, but the classic long-form model exposes more decisions and fields than necessary. |
| 34 | [Land Trust Alliance](https://landtrustalliance.org/?form=GainingGround) | Fundraise Up modal; monthly default; `$5–$200` presets | Gold-standard modal composition: image and short story on the left, secure amount decision on the right, minimal distraction. |
| 35 | [David Suzuki Foundation](https://secure.davidsuzuki.org/page/107577/donate/1) | Branded step-based form; one-time/monthly | Strong separation of giving paths and good brand continuity; step progression is preferable to showing every field at once. |
| 36 | [League of Women Voters](https://donate.lwv.org/page/84107/donate/1) | Branded hosted form; one-time/monthly; six presets | Frequency is easy to find, but dense fields and secondary options create a more institutional than human experience. |
| 37 | [Freedom House](https://connect.clickandpledge.com/w/Form/bff8aefe-8dd8-4ec4-84cd-96d55f9b5fa1) | Click & Pledge form; one-time/monthly/annual; unusually high presets | Useful for major-gift audiences, but the high opening amounts and long field set are wrong for 22STRONG's accessible entry point. |
| 38 | [World Resources Institute](https://giving.wri.org/campaign/694046/donate) | Branded hosted campaign; one-time/monthly; `$50–$1,000` | A straightforward institutional transaction; the story could be more tightly coupled to the selected amount. |
| 39 | [Colorado Lab](https://coloradolab.org/) | No public donor transaction observed | Not a donor-conversion benchmark; it functions primarily as a university-based research partnership. |
| 40 | [Make-A-Wish America](https://wish.org/?donate=100-000) | Modal/embedded fundraising flow with Fundraise Up and Blackbaud signals | Keeps the donor near the source story; ensure match or campaign urgency remains verifiable and current. |
| 41 | [Children's Organ Transplant Association](https://cota.org/give-to-cota/) | Embedded form; one-time/monthly; `$100–$2,500` presets | Clear mission context, specific-family route, and recurring option; high presets and cramped controls feel tuned to a different donor profile. |
| 42 | [Personal Genetics Education Project](https://community.alumni.harvard.edu/give/89071054) | External Harvard Alumni giving portal; one-time-first; `$50–$1,000` presets | Institutional trust is high, but PGED's identity and program story largely disappear at handoff. |
| 43 | [American Heart Association](https://www.heart.org/?form=FUNELYZXFBW) | Fundraise Up modal; one-time default; six presets | Excellent image, accreditation, match multiplier, and focused amount card; the match claim needs disciplined campaign maintenance. |
| 44 | [American Lung Association](https://www.lung.org/?form=FUNLTWAXLLP) | Fundraise Up modal; one-time default; six presets | Excellent two-panel modal with real-person image, concise mission copy, badges, dedication, and one action. |
| 45 | [National Scleroderma Foundation](https://scleroderma.org/ways-to-give/) | Blackbaud/Luminate checkout plus PayPal and multiple alternate-giving routes | Broad donor choice is strong, but online, PayPal, stock, DAF, workplace, tribute, and legacy paths need a clearer priority hierarchy. |
| 46 | [Treatment Advocacy Center](https://www.tac.org/?form=FUNTUJMNQTQ) | Fundraise Up-triggered donation flow plus a separate ways-to-give page | A direct URL-triggered form supports campaign links; bot checks make the initial experience feel fragile during automated testing. |
| 47 | [Covenant House](https://www.covenanthouse.org/get-involved/ways-to-give/donate-now) | Embedded/modal form with Fundraise Up and EveryAction signals; one-time/monthly | Strong youth story, trust, and employer matching; keep campaign urgency from overwhelming the amount decision. |
| 48 | [Habitat for Humanity of Lake County](https://habitatlmc.org/donate/) | Embedded Blackbaud/Luminate; one-time/monthly; impact-led presets | Amounts tied to concrete building outcomes are persuasive; the form styling is less refined than the surrounding brand. |
| 49 | [Time Out Youth](https://timeoutyouth.org/donate/) | Embedded Kindful/Bloomerang form above broader giving content | Good stewardship and alternate-giving context; the embed's loading state and generic transaction styling create friction. |
| 50 | [Reconciling Ministries Network](https://rmnetwork.org/donate/) | Embedded form; one-time/monthly/annual | The wider Wellspring program gives the frequency meaning; keep the embedded control visually aligned with that named relationship. |

### Donation-control plan for 22STRONG

#### Keep the current Strong Circle selector as the visual decision layer

The implemented `$22`, `$50`, `$100`, and `$190` controls already follow the dominant benchmark pattern: four calm options, one selected state, one custom field, and a CTA that repeats amount and frequency. The surrounding page supplies the authentic image, impact equation, testimonial, flexibility, and trust that a generic checkout cannot.

#### Test a Givebutter widget or click-triggered modal at the same point in the page

The next improvement should remove the visual handoff without introducing an unsolicited popup. Two acceptable paths are:

1. **Current low-risk path:** keep the selector and send the donor to Givebutter with amount, monthly frequency, and source parameters preserved.
2. **Preferred after testing:** open an accessible Givebutter widget/modal only after the donor presses the Strong Circle CTA, or replace the custom selector with the widget if duplicate controls cannot be avoided.

Givebutter supports preselected amount and frequency parameters for hosted pages and widgets. See its [URL and HTML parameter guide](https://help.givebutter.com/en/articles/4868782-how-to-leverage-url-and-html-parameters) and [widget guide](https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website).

#### Strong Circle should remain monthly-default, not frequency-neutral

The monthly page should open with monthly selected and `$22` selected. A small secondary link can say “Prefer a one-time gift?” and return to the one-time donation section. Do not give one-time and monthly equal visual weight inside the Strong Circle identity.

#### Use one compact impact confirmation

After an amount is selected, show one line beneath the controls:

- `$22/month` — anchors the Strong Circle.
- `$50/month` — helps fund follow-through care.
- `$100/month` — keeps recovery plans moving.
- `$190/month` — can cover one complete recovery session.

This follows the Ronald McDonald House pattern: flat buttons first, selected-impact confirmation second.

#### Keep trust adjacent and narrow

The transaction card should retain:

> Secure checkout · Tax-deductible · EIN 99-1232582

Below it, link to the transparency page and explain that Givebutter emails receipts and provides a recurring-plan management link. Avoid a wall of unverified ratings or logos.

#### Enable useful payment methods and test them in context

For recurring gifts, confirm cards, ACH, PayPal, Cash App Pay, and compatible wallets in the actual 22STRONG campaign. Register `22strongfoundation.com` with Givebutter before expecting Apple Pay to appear in an embedded widget. Do not promise Venmo for Strong Circle because Givebutter does not currently support Venmo for recurring plans.

#### Keep optional fees transparent

Givebutter's current fee/tip model can materially change what the donor sees. The client should choose intentionally between optional tips and platform-fee handling, then review the actual checkout language. Do not require fee coverage or surprise the donor with a defaulted extra amount without explicit approval.

#### Preserve the post-gift relationship

The confirmation and receipt should say **Welcome to Strong Circle**, repeat the amount and monthly schedule, link to change/cancel instructions, and state the realistic impact-update cadence. The transaction is the start of the named relationship, not the end of the landing page.

### Transaction anti-patterns to avoid on 22STRONG

- Opening checkout before a visitor asks to donate.
- A cookie banner covering the CTA or competing with a donation modal.
- Repeating the amount/frequency selector in both custom UI and an embedded widget.
- More than four primary presets for Strong Circle.
- Large merchandise, thank-you gifts, designations, or public donor feeds in the core path.
- Required title, phone, mailing address, comments, or tribute fields before payment unless operationally necessary.
- An unexplained redirect to a generic third-party domain.
- High-pressure match multipliers, countdowns, or urgency that the organization cannot substantiate.
- Badge walls or privacy/legal copy that visually outweigh the action.
- A fee/tip choice that appears only after the donor thinks the total is settled.

## Recommended Strong Circle through-line

### Core positioning

**Program name:** Strong Circle  
**Plain-language descriptor:** 22STRONG's monthly-giving community  
**Primary promise:** Keep recovery moving when coverage stops short.  
**Operational reason:** Predictable monthly support lets 22STRONG approve the next session before care stalls.  
**Proof mechanic:** Nine members at `$22/month` provide `$198`, enough to cover one `$190` recovery session.  
**Primary CTA:** Join Strong Circle at `$22/month`  
**Flexibility line:** Monthly. Change or cancel anytime.  

### Recommended page sequence

1. **Hero** — “Keep recovery moving, month after month.” Use the Strong Circle mark and one real recovery image.
2. **One-sentence mechanism** — State the recovery gap and why dependable funding changes response time.
3. **Impact equation** — Animate or progressively reveal nine `$22` segments completing the ring and covering one `$190` session.
4. **Human proof** — One concise veteran or athlete story with verified attribution.
5. **Four amount choices** — `$22`, `$50`, `$100`, `$190`, plus custom; one selected state.
6. **Monthly-default checkout** — Embedded Givebutter if accessible and reliable; otherwise a parameterized handoff.
7. **Three reasons to join** — Dependable care, faster approvals, flexible commitment.
8. **Member relationship** — State the realistic update cadence and any invitations the organization can sustain.
9. **Trust and FAQ** — 501(c)(3), EIN, receipt, security, transparency, change/cancel instructions.
10. **Mission boundary** — Explain the origin of “22” without implying that 22STRONG is a suicide-crisis provider; retain the Veterans Crisis Line direction in a calm, clearly separate support note.

### Suggested copy skeleton

> **Monthly giving**  
> # Keep recovery moving, month after month.
>
> Strong Circle members give 22STRONG a dependable base to approve recovery care before an insurance gap becomes a stopped plan.
>
> **9 members × $22/month = enough to cover one $190 recovery session.**
>
> **Join Strong Circle at $22/month**
>
> Monthly. Change or cancel anytime. Your receipt is emailed automatically.

### Visual system

- **Teal:** Strong Circle identity, ring, supporting highlights, selected-state accent.
- **Rust:** Primary transaction CTA and decisive action.
- **Warm cream:** Main headline and high-empathy copy over dark imagery.
- **Photography:** Real recovery environments, veterans, athletes, and providers; avoid generic charity imagery.
- **Motion:** Restrained ring completion or progress motion; never autoplay testimonial audio/video.
- **Vertical video:** Center the full portrait crop in a 16:9 player and fill side space with a darkened, blurred, motion-matched duplicate of the same footage. Maintain captions, visible controls, and adequate text contrast.
- **Controls:** Flat choices, large tap targets, one selected state, no pricing-table look.

## Current 22STRONG implementation findings

### What is already aligned

- The site distinguishes one-time giving from Strong Circle.
- The header has a Give Once / Give Monthly split.
- Strong Circle already has a nine-segment visual mechanic.
- The monthly tiers are `$22`, `$50`, `$100`, and `$190`.
- The `$22` and `$190` relationship is concrete and understandable.
- The page includes tax/EIN trust language, cancellation reassurance, a testimonial, and the Veterans Crisis Line boundary.
- Givebutter links already accept amount/frequency parameters in the site code.

### Status after the Strong Circle implementation

- `/strong-circle/` is now the canonical monthly-giving landing page.
- `/ways-to-support/` keeps a shorter Strong Circle preview instead of duplicating the full program page.
- The navigation's monthly action routes internally to Strong Circle.
- The landing page defaults to monthly and presents `$22`, `$50`, `$100`, `$190`, and a custom amount as a focused decision module.
- Amount, frequency, source, and campaign parameters are passed into Givebutter, preserving donor intent through the hosted handoff.
- The page includes the nine-member impact equation, EIN and tax language, receipt and change/cancel reassurance, testimonial proof, and a clear boundary between recovery support and crisis-response services.
- The current page structure has been checked at desktop and mobile layouts.

### Remaining transaction work

#### Priority 0 — Test the actual Givebutter checkout in context

Compare the current hosted handoff with a click-triggered Givebutter widget or modal in staging. Preserve the custom selector only if the donor does not have to repeat amount and frequency inside the widget.

#### Priority 1 — Confirm campaign and payment configuration

Verify that the live Strong Circle campaign opens with monthly and the selected amount preserved. Confirm the payment methods actually available for recurring gifts and register the 22STRONG domain if Apple Pay will be used in an embedded widget.

#### Priority 2 — Review tips and fee coverage

Decide whether optional donor tips and fee coverage fit the organization's policy. Review the final total and disclosure language on mobile so no extra amount feels defaulted or surprising.

#### Priority 3 — Finish the post-gift experience

Use a Strong Circle-specific confirmation and receipt, state the monthly schedule, include the recurring-plan management link, and define a realistic stewardship cadence before promising updates or benefits.

#### Priority 4 — Complete measurement and verification

Track landing-page visits, amount selection, checkout starts, completed gifts, and recurring retention. Confirm the EIN, `$190` session cost, `$850` average care-plan cost, tax language, cancellation process, provider relationship, testimonial attribution, and donor communications before launch.

## Recommended next implementation order

1. Test the current Givebutter handoff and a click-triggered widget/modal in staging.
2. Choose the version with the least repeated input and strongest visual continuity.
3. Verify recurring payment methods and Apple Pay domain configuration.
4. Decide and document tip and fee-coverage behavior.
5. Configure the Strong Circle thank-you state, receipt, and recurring-plan management link.
6. Add checkout-start, completed-gift, and recurring-retention measurement.
7. Complete one real end-to-end test gift on desktop and mobile.
8. Obtain client approval for legal, impact, attribution, and stewardship claims.

## Acceptance criteria

- A visitor can identify monthly giving from the main navigation without opening checkout.
- “Strong Circle” is always paired with a plain-language monthly-giving descriptor on first mention.
- No `/strong-circle/` link returns a 404.
- The page explains the operational benefit of predictable funding before showing tiers.
- The nine-at-`$22` mechanic is mathematically accurate and visually understandable.
- Exactly one monthly amount is selected at a time.
- Checkout opens with the selected amount and monthly frequency preserved.
- The donor does not have to repeat the amount or frequency after opening checkout.
- The page states tax status, EIN, receipt behavior, and change/cancel instructions.
- Every testimonial and impact claim has verified source/approval.
- Video is user-controlled, captioned, and usable with reduced motion.
- The “22” origin statement does not imply crisis-response services and includes appropriate Veterans Crisis Line direction.

## Primary source links

- [Elevation benchmark article](https://www.elevationweb.org/best-nonprofit-websites/)
- [Malala Fund monthly-gift page](https://malala.org/donate/monthly-gifts?sc=X)
- [Thorn donation and donor-community page](https://www.thorn.org/donate/)
- [Mercy Corps monthly-giving page](https://www.mercycorps.org/donate/become-monthly-giver)
- [Second Harvest Sustainers' Circle](https://donate.secondharvestsw.org/give/336342/)
- [Playworks Joymakers](https://www.playworks.org/colorado/about/playworks-joymakers-program/)
- [Humane World for Animals](https://www.humaneworld.org/en)
- [The Humane League](https://thehumaneleague.org/)
- [The Nature Conservancy monthly-giving page](https://www.nature.org/en-us/membership-and-giving/donate-to-our-mission/give-monthly/)
- [American Lung Association monthly-giving page](https://www.lung.org/get-involved/ways-to-give/donate-monthly)
- [Covenant House monthly-giving page](https://www.covenanthouse.org/spts-donate-monthly)
- [National Geographic Society donation form](https://give.nationalgeographic.org/)
- [Conservation International Surf Conservation](https://www.conservation.org/projects/surf-conservation)
- [World Resources Institute support page](https://www.wri.org/support)
- [Make-A-Wish Wishing Well example](https://wish.org/mokan/wishing-well)
- [Reconciling Ministries Network Wellspring](https://rmnetwork.org/wellspring/)
- [World Vision child-sponsorship FAQ](https://www.worldvision.org/sponsor-a-child/support-center/child-sponsorship-faqs)
- [Givebutter widget documentation](https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website)
- [Givebutter URL and HTML parameters](https://help.givebutter.com/en/articles/4868782-how-to-leverage-url-and-html-parameters)
- [Givebutter payment-method configuration](https://help.givebutter.com/en/articles/1726573-how-to-configure-payment-methods-on-givebutter)
- [Givebutter recurring-plan management](https://help.givebutter.com/en/articles/3216251-how-to-enable-and-manage-recurring-plans)
- [Givebutter standard pricing and optional-tip model](https://help.givebutter.com/en/articles/1512762-givebutter-standard-pricing-explained)
