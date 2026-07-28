# ai-creed landing redesign

**Date:** 2026-07-28  
**Status:** proposed design, visually approved in desktop and mobile mockups  
**Research source:** `docs/plans/2026-07-28-ai-creed-landing-redesign-report.md`

## 1. Outcome

Redesign the ai-creed homepage from a flat project index into the public
brand-and-routing layer for one agentic engineering ecosystem.

A first-time visitor should understand within one screen:

1. ai-creed helps developers supervise agentic coding.
2. ai-14all, ai-xavier, and ai-samantha are essential parts of one system.
3. ai-14all is the available entry point today.
4. the system is being built toward a human-governed autonomous engineering
   loop.
5. the next action is to get ai-14all or follow an earlier-stage product.

The primary conversion is an ai-14all download. Secondary outcomes are
understanding the ecosystem, expressing interest in ai-xavier or ai-samantha,
and remembering the creed.

## 2. Audience

The homepage is for any developer using agentic coding tools, from someone
working with one coding agent to an experienced operator running agents in
parallel.

The first screen may assume the visitor knows what a coding agent is. It must
not assume familiarity with worktrees, PTYs, supervision loops, or any
ai-creed product name. Technical terms appear later as proof, after the value
is clear.

## 3. Approved strategic decisions

### 3.1 Product hierarchy

The hierarchy is asymmetric in conversion, not importance.

- **ai-14all** is the control plane, shipping product, and primary CTA.
- **ai-xavier** is the mobile presence layer.
- **ai-samantha** is the ambient supervision layer.
- All three receive meaningful, product-specific visuals in the hero and a
  substantial product chapter.
- ai-xavier and ai-samantha must never collapse into text-only cards, small
  badges, or minor add-ons around ai-14all.
- the featured flagship set is exactly ai-14all, ai-xavier, and ai-samantha;
  the homepage build fails on any other set (§7.1).

### 3.2 Narrative

The page begins with the present:

> your coding agents. under your command.

It then explains the three surfaces:

- at your desk: control through ai-14all;
- in your pocket: presence through ai-xavier;
- out loud: supervision through ai-samantha.

After the products are understood individually, the page reveals the
destination:

> describe the outcome tonight. return to decisions, not busywork.

The autonomous engineering loop is a major homepage chapter and the
ecosystem's explicit north star. Its copy is future-tensed and must not imply
that unattended end-to-end autonomy ships today.

### 3.3 Availability honesty

Public availability labels are:

- ai-14all: `shipping`
- ai-xavier: `coming soon`
- ai-samantha: `early access`

Distribution status and marketing availability are separate concepts.
`public`, `private`, `stable`, and `archived` remain repository/distribution
metadata. The warmer public-facing availability labels describe what a
visitor can do.

Availability labels are consistent across every routed destination. Each
flagship's project page renders the same public availability label as the
homepage, from the same frontmatter source, so the labels cannot drift
apart. `/projects/ai-samantha` currently introduces itself as coming soon;
this redesign updates that page's status and copy to `early access`. Build
validation fails when flagship page content contradicts its canonical label
(§7.1).

### 3.4 Claims

These rules are binding across homepage copy, metadata, product chapters, and
social previews:

- ai-14all, ai-xavier, and ai-samantha are **source-available**, never
  described as open source.
- ai-xavier may claim watching live terminals, answering prompts, steering,
  and interrupting. It may not claim approvals or a kill switch.
- ai-xavier has no public install, App Store, or TestFlight destination.
- ai-samantha may claim fully local speech recognition and speech synthesis.
  It may not imply that its complete AI stack or LLM inference is fully local.
- Naming lore remains implicit.
- The autonomous-loop vision may be paraphrased but is not cited to private
  or offline strategy material.

## 4. Visual direction

The approved direction is **one loop, three rooms** with a
product-forward balance.

### 4.1 Shared world

The site uses calm dark neutral chrome. Coral `#ff8163` is the only brand and
interactive hue. It appears on:

- primary CTAs;
- interactive focus and hover states;
- editorial numerals and emphasis;
- the shared system connections;
- the single attention pulse.

Coral is not a status color. Shipping, ready, warning, error, and informational
states use the ecosystem's separate status palette and always include text.

### 4.2 Product rooms

Each flagship has a restrained atmosphere:

- ai-14all: cool slate, square geometry, dense mono data;
- ai-xavier: warm taupe, rounded device geometry, human-scale spacing;
- ai-samantha: deep plum, soft glow, orb and voice waveform.

The room hue is limited to a low-alpha background wash, border tint, and
product visual. It does not recolor shared controls or create three unrelated
themes.

### 4.3 Type roles

- Display: self-hosted, subset Fraunces for the hero, major chapters, creed,
  and closing statement.
- UI: system sans stack.
- Data: existing system mono stack with tabular numbers.

Only the display face adds a font asset. Production does not load Google
Fonts. The serif falls back to Georgia/system serif if the font fails.

### 4.4 Motion

Motion is functional and sparse:

- one slow breathing attention indicator in the ai-14all visual;
- 150 ms hover/focus transitions;
- no parallax, carousels, scroll-jacking, or scroll-triggered entrances;
- `prefers-reduced-motion` disables the breathing animation and shortens
  transitions to zero.

### 4.5 Product imagery

The hero depicts the complete system in one composition:

- ai-14all: a readable control window with quiet, ready, and needs-you
  sessions plus an inline-review cue;
- ai-xavier: a phone showing a real agent prompt and answer/interrupt context;
- ai-samantha: the orb, a spoken status, and a restrained waveform.

Each later product chapter gets a larger version of its visual. Product
moments show one understandable interaction, not a full-screen recording with
illegible interface text.

Media is click-to-play behind a poster with `preload="none"`. The initial
page never autoloads product video; §10's markup and network guards enforce
this.

## 5. Homepage architecture

### 5.1 Header

Contents:

- ai-creed wordmark;
- the system;
- products;
- north star;
- creed;
- desktop download CTA.

The mobile header collapses to the wordmark and a menu button. The navigation
has an accessible label and a visible keyboard focus state. A skip link
precedes it. The mobile menu uses a native `<details>` disclosure so it works
without JavaScript.

### 5.2 Hero

Copy:

> **your coding agents. under your command.**
>
> one system keeps you in the loop—from parallel work at your desk, to
> decisions from your phone, to a voice that has been watching with you.

Desktop actions:

- primary: `download ai-14all`
- secondary: `see the engineering loop`

Mobile actions:

- primary: `get ai-14all`
- secondary: `see the engineering loop`

The desktop primary CTA opens the stable ai-14all release-page URL from the
downloads module (§5.3) and never embeds a version. The
mobile primary CTA routes to `/projects/ai-14all#download`; it must not imply
that the desktop app installs on the phone.

The proof line states availability, not hand-maintained version numbers:

> ai-14all shipping now · xavier coming soon · samantha early access

The hero visual gives all three products meaningful presence. ai-14all is
larger because it is the entry point, but xavier and samantha remain
recognizable product surfaces rather than decorations.

### 5.3 Product chapter: ai-14all

Section label:

> 01 · control · at your desk

Headline:

> parallel agents. one place to stay oriented.

The section explains attention states, real worktrees and terminals, and
inline review. A large product visual demonstrates a session that has passed
tests and needs one human decision.

Actions:

- desktop: macOS download, Windows download, product details;
- mobile: `view desktop downloads`, product details.

Download destinations resolve from exactly one source: a typed
`src/data/ai14all-downloads.ts` module exporting the current `version`, the
per-platform asset URLs, and the stable release-page URL ending in
`releases/latest`. The hero and closing primary CTAs use the release-page
URL; this chapter's macOS and Windows actions use the per-platform asset
URLs; `/projects/ai-14all#download` renders from the same module. No
download URL or version is hand-written in MDX or homepage source, and CI
validates the module against the latest published release (§10).

### 5.4 Product chapter: ai-xavier

Section label:

> 02 · presence · in your pocket

Headline:

> the agent needs you. you left the desk.

The visual is a phone showing:

- a live ai-14all session;
- an agent waiting for an answer;
- a concise prompt;
- allowed interactions such as answer, wait, or interrupt.

The copy states that execution and authority remain on the desktop.

Initial CTA:

> get notified

Until a real waitlist exists, the primary CTA uses a prefilled contact email.
A secondary `learn about ai-xavier` action routes to
`/projects/ai-xavier`. It does not link to an install, App Store, or private
TestFlight; this prohibition is build-enforced (§7.1).

### 5.5 Product chapter: ai-samantha

Section label:

> 03 · supervision · out loud

Headline:

> ask what's happening. she has been watching.

The visual combines the existing orb language with a concrete supervision
answer:

> two sessions are quiet. one needs your decision.

The copy explicitly limits the local claim to speech recognition and voice
synthesis.

Initial CTA:

> request early access

The CTA uses a prefilled contact email until a dedicated interest flow exists.

### 5.6 Autonomous engineering loop

Headline:

> describe the outcome tonight. return to decisions, not busywork.

Desktop presents a horizontal five-step system:

1. frame — ai-samantha;
2. command — ai-14all;
3. execute — ai-whisper;
4. remember — ai-cortex;
5. decide — the developer.

ai-xavier appears as the presence layer spanning the loop, not as a sixth
linear step.

Mobile renders the same model vertically. Every connection uses future or
current tense accurately. Shipped integrations may be labeled as shipped;
future edges remain clearly directional.

### 5.7 Recently shipped

A compact list supplies proof of momentum:

- date;
- product;
- concise shipped outcome;
- release or changelog link.

The strip is sourced from local structured content at build time. It does not
fetch GitHub at runtime and does not require client JavaScript. Entries link
to release notes or project history. Version numbers are optional and, when
shown, come from the same structured source rather than prose.

The initial source is a typed `src/data/recently-shipped.ts` module with
`date`, `project`, `summary`, and `href` fields. Entries remain editorially
selected; the homepage does not attempt unreliable runtime release discovery.

### 5.8 The creed

The creed is the main editorial moment:

> **the agent works for you. never the other way around.**

Four tenets:

1. your machine remains the authority;
2. you stay the gatekeeper at meaningful decisions;
3. the pieces compose without becoming a black box;
4. code and systems you can read end-to-end.

### 5.9 Engine room

Supporting projects appear in a compact collection-derived grid after the
flagship story:

- name;
- one-line job;
- distribution status;
- project link.

The grid is generated from non-featured project content rather than a second
hard-coded catalog. The first meaningful mention of ai-ezio links to its
project page. Archived projects remain visibly labeled and sorted last.

### 5.10 Closing and footer

Closing headline:

> run your agents in ai-14all. stay for the loop we're building.

Actions:

- desktop: download ai-14all;
- mobile: get ai-14all;
- secondary: Discord/community.

The footer exposes the three flagships, supporting projects, GitHub, bio,
contact email, and community link.

## 6. Responsive behavior

The mobile layout is intentionally adapted rather than mechanically stacked.

- The hero CTA appears before product visuals.
- The complete trio appears immediately after the hero.
- Each product chapter places the visual before its explanatory copy.
- Primary actions are full-width and at least 44 px tall.
- ai-14all download wording routes rather than pretending to install on the
  phone.
- The autonomous loop becomes a vertical sequence.
- Creed tenets use a compact two-column layout where width permits and one
  column at 320 px.
- The engine room becomes a two-column compact grid, then one column at
  narrow widths.
- No section causes horizontal scrolling at 320, 390, or 430 px.

## 7. Content and component architecture

### 7.1 Project content remains the source of truth

Extend project frontmatter with an optional nested homepage object:

```yaml
homepage:
    featured: true
    rank: 1
    role: control
    posture: at your desk
    availability: shipping
    headline: parallel agents. one place to stay oriented.
    summary: see who is working, who is ready, and who needs you.
    desktopCta:
        label: download ai-14all
        # href intentionally absent: ai-14all download destinations resolve
        # from src/data/ai14all-downloads.ts at build time (§5.3)
    mobileCta:
        label: get ai-14all
        href: /projects/ai-14all#download
```

The schema and homepage build validation enforce:

- the set of featured projects is exactly `ai-14all`, `ai-xavier`, and
  `ai-samantha` — a build with a missing, extra, or renamed flagship fails;
- flagship ranks are exactly ai-14all = 1, ai-xavier = 2, ai-samantha = 3;
- each flagship id maps to its dedicated visual component through an
  exhaustive typed map, so a flagship without its visual is a build error;
- allowed availability values, plus cross-page consistency: each flagship's
  project page renders the same availability label as the homepage from the
  same source field, and flagship MDX contains no contradicting availability
  phrase;
- a featured project has the fields required by its homepage chapter;
- ai-14all's mobile CTA href is exactly `/projects/ai-14all#download`, and
  the ai-14all project page contains the matching `download` anchor;
- ai-14all download destinations resolve exclusively from
  `src/data/ai14all-downloads.ts`; a download URL or version hand-written in
  MDX or homepage source fails the build;
- ai-xavier action links are limited to a prefilled `mailto:` and
  `/projects/ai-xavier`; any `apps.apple.com`, `testflight.apple.com`, or
  `itms-services:` destination fails the build;
- ai-samantha's primary action is a prefilled `mailto:`.

Product claims and detailed prose remain in each MDX file. Homepage-only
positioning belongs in the nested homepage object.

### 7.2 Homepage components

The page is composed from focused Astro components:

- `LandingHeader`
- `EcosystemHero`
- `FlagshipChapter`
- `Ai14allVisual`
- `XavierVisual`
- `SamanthaVisual`
- `AutonomousLoop`
- `RecentlyShipped`
- `Creed`
- `EngineRoom`
- `LandingFooter`

The three visuals are separate components because their product interfaces
and geometry are intentionally different. `FlagshipChapter` owns shared
layout, stage labels, actions, and responsive ordering. The mapping from
flagship id to visual component is an exhaustive typed map (§7.1); removing
a flagship or featuring one without its visual fails the build.

### 7.3 No client application layer

The initial redesign stays Astro-first and zero-JavaScript by default.

- Navigation anchors scroll natively.
- Product media may use the native video controls and poster behavior.
- Responsive CTA variants are separate semantic links shown at mutually
  exclusive breakpoints.
- There are no carousels, tabs, animated counters, or client-side data
  fetching.

A future copy-link enhancement or waitlist form may add a tiny progressive
island, but it is outside this redesign.

### 7.4 Metadata

The homepage receives a dedicated description and OG image built around the
three-product system. Social metadata must not contain a tool count, version,
or another hand-maintained fact likely to go stale.

`Base.astro` accepts page-specific OG assets while preserving the existing
fallback for project pages. The homepage description is:

> a local-first system for supervising coding agents—from desktop control to
> mobile presence and ambient voice.

## 8. Failure and fallback behavior

- Missing featured-product fields fail the build through the content schema.
- Missing optional product media renders the accessible CSS/HTML product
  visual without a broken empty frame.
- A video failure leaves its poster and product copy intact.
- If the display font fails, the system serif fallback preserves hierarchy.
- Download and interest links remain usable without JavaScript.
- Hidden responsive CTA variants use `display: none` so only the active link
  enters the accessibility tree and keyboard order.
- Availability and attention states always contain text; color is never the
  only signal.
- No exact version is hand-written outside the typed data modules; rendered
  versions derive from `ai14all-downloads.ts` or `recently-shipped.ts`.

## 9. Accessibility and performance constraints

Accessibility:

- visible skip link;
- labeled primary navigation;
- `:focus-visible` ring: 2 px coral, 2 px offset;
- all normal text at least 4.5:1 contrast;
- large text at least 3:1;
- interactive targets at least 44 × 44 px — links, buttons, and disclosure
  controls alike; only links inside prose paragraphs are exempt (the WCAG
  2.5.8 inline exception);
- correct heading order;
- meaningful alt text or intentionally empty alt for decorative visuals;
- full `prefers-reduced-motion` behavior;
- autoplay removed from all media;
- videos provide controls when playing.

Performance:

- homepage initial transfer at most 100 KB excluding user-initiated media;
- zero JavaScript in the initial redesign;
- one self-hosted subset display font;
- posters optimized through Astro images;
- all video `preload="none"`;
- Lighthouse mobile performance target at least 95;
- LCP target below 1.5 seconds on fast 4G, enforced under the stricter
  Lighthouse default mobile throttling (§10);
- CLS below 0.02.

## 10. Validation

Automated:

- `pnpm check`
- `pnpm lint`
- `pnpm build` — includes the schema, flagship-set, CTA, and availability
  invariants from §7.1
- `pnpm format:check`
- `pnpm check:a11y` — committed `scripts/check-a11y.mjs`, with `playwright`
  and `axe-core` pinned as devDependencies; serves `dist/`, audits `/`,
  `/projects/ai-14all/`, `/projects/ai-xavier/`, and
  `/projects/ai-samantha/` at 1440 px and 390 px viewports, and fails on any
  axe violation with impact `serious` or `critical`. At the 390 px viewport
  it also asserts, via bounding boxes, that every visible interactive
  element outside a prose paragraph measures at least 44 × 44 px. During the
  homepage audit it also records network traffic to network-idle and fails
  if any video or audio asset is requested before user interaction (§4.5).
- `pnpm check:media` — committed `scripts/check-media.mjs`; parses every
  built HTML page and fails when a `<video>` lacks `preload="none"`,
  `poster`, or `controls`, when any `<video>` or `<audio>` carries
  `autoplay`, or when an `<audio>` lacks `preload="none"`
- `pnpm check:downloads` — committed script; fails when a downloads-module
  asset URL does not resolve successfully, when the module `version` differs
  from the latest published ai-14all release tag, or when a built download
  link bypasses the module. Network-dependent by design; runs in CI before
  every deploy and on demand locally.
- `pnpm check:budget` — committed `scripts/check-homepage-budget.mjs`; parses
  `dist/index.html` and sums the document plus every automatically fetched
  subresource: stylesheets, the font subset, `rel="preload"` targets, icon
  links plus any `/favicon.ico` fallback present in `dist`, and images
  including video posters. For `srcset`/`<source>` responsive images it
  counts the largest-byte candidate, so the measurement upper-bounds real
  transfer on every device. Only click-to-play media payloads behind
  `preload="none"` are excluded. Each asset is gzip-compressed with Node
  `zlib` defaults; the check fails when the total exceeds 102,400 bytes.
- `pnpm lighthouse` — `@lhci/cli` pinned as a devDependency with a committed
  `lighthouserc.json`: `collect.staticDistDir: "dist"`,
  `collect.numberOfRuns: 3`, median-run aggregation, and Lighthouse's
  default mobile emulation and simulated throttling (150 ms RTT, 1.6 Mbps
  down, 4× CPU slowdown — stricter than fast 4G, so the §9 LCP target is
  implied); error-level assertions: performance category `minScore` 0.95,
  `largest-contentful-paint` `maxNumericValue` 1499, and
  `cumulative-layout-shift` `maxNumericValue` 0.019 — LHCI comparisons are
  inclusive, so these values enforce §9's strict below-1500 ms and
  below-0.02 contract

The committed scripts and configs are the source of truth for these
thresholds; CI runs the full automated list before deploy.

Visual:

- desktop at 1440 px;
- laptop at 1024 px;
- mobile at 430, 390, and 320 px;
- keyboard-only walkthrough;
- reduced-motion screenshot comparison;
- no horizontal overflow;
- posters render visibly before playback; absence of pre-interaction media
  requests is enforced by `pnpm check:media` and the `check:a11y` network
  assertion, not by screenshots.

Product comprehension:

- after five seconds, at least 7 of 10 agentic-coding developers describe the
  site as a system for supervising coding agents;
- scenario routing reaches at least 70%:
    - parallel work at the desk → ai-14all;
    - agent needs an answer while away → ai-xavier;
    - status without another screen → ai-samantha;
- a visitor can reach an ai-14all download in at most two actions;
- every public claim traces to shipped product evidence or is explicitly
  future-tensed.

## 11. Scope

Included:

- homepage redesign;
- shared landing-page tokens and layout components;
- responsive CTA behavior;
- content-schema additions needed by the homepage;
- a minimal `/projects/ai-xavier` page with honest `coming soon` status,
  product explanation, and prefilled contact-interest action so the flagship
  never leads to a 404;
- aligning `/projects/ai-samantha` status and copy to `early access` so the
  routed destination matches the homepage;
- the typed `src/data/ai14all-downloads.ts` module and the
  `pnpm check:downloads` CI guard;
- the committed performance guards: `scripts/check-homepage-budget.mjs` and
  the `lighthouserc.json` Lighthouse configuration;
- the committed accessibility and media guards: `scripts/check-a11y.mjs`
  (Playwright plus axe-core) and `scripts/check-media.mjs`;
- accessibility, metadata, and media-loading fixes touched by the redesign.

Not included:

- product application redesigns;
- a full documentation system;
- pricing;
- testimonials or invented social proof;
- analytics;
- a hosted waitlist backend;
- JavaScript-heavy interactions;
- redesigning every project detail page beyond shared tokens and CTA
  compatibility.

## 12. Final acceptance

The redesign is accepted when:

1. ai-creed reads as one integrated ecosystem rather than a project grid;
2. ai-14all, ai-xavier, and ai-samantha all have substantial visual presence;
3. ai-14all remains the clearest current conversion;
4. the autonomous engineering loop is prominent and honestly future-tensed;
5. desktop and mobile CTAs match what the device can actually do;
6. supporting tools remain discoverable without competing with the
   flagships;
7. the page preserves ai-creed's terse voice, honesty, accessibility, and
   performance discipline.
