# Landing Page 14all-First Restructure — Design

- **Date:** 2026-07-29
- **Status:** awaiting operator review
- **Amends:** `docs/superpowers/specs/2026-07-28-ai-creed-landing-redesign-design.md`
  (page structure, hero, and two guard thresholds; everything else in that
  spec — tokens, guard suite, project pages, zero-JS contract — stands)
- **Approved mockup:** `2026-07-29-landing-14all-first-restructure-mockup.html`
  (same directory; canonical copy at
  `~/.ai-pref-nsync/local-docs/ai-creed/brainstorm/2026-07-29-landing-restructure-mockup-a.html`)

## 1. Motivation

Operator critique of the shipped homepage: (1) five coral download CTAs in
one viewport, all doing one job; (2) the hero feels unpolished and
undersells the products (CSS fake-UI cards, duplicated between hero and
chapter 01); (3) a first-time reader can't tell what ai-14all is or how it
works — no "want to try" pull. Comparative research across 8 agent-tool
landing pages (Linear, Warp, Zed, Raycast, Cursor, Conductor, Vibe Kanban,
Sculptor — see
`~/.ai-pref-nsync/local-docs/ai-creed/knowledge-references/landing-research.md`)
found: every site sells exactly one product in the hero, one filled primary
CTA, real product imagery or none (0/8 fake CSS UI), and how-it-works as a
labeled section below the hero.

## 2. Decisions

1. **14all-first hero.** The hero sells the one downloadable product;
   xavier and samantha demote to a compact "the loop extends" section.
2. **Option A — full restructure** of the top of the page: hero →
   how-it-works → features → loop-extends. Sections below are unchanged.
3. **Hero visual = click-to-play guided camera tour** of the real app
   (scripted zoom: full app → sidebar → parallel agents → inline review),
   replacing the CSS fake-UI trio.
4. **Interim vs production video.** Ship now with the scripted-camera tour
   rendered from the existing 7.5s recording. Production replacement comes
   later from the fixture-driven e2e pipeline in the ai-14all repo (handoff
   seed:
   `~/.ai-pref-nsync/local-docs/ai-14all/brainstorm/2026-07-29-hero-video-e2e-fixture-handoff.md`).
   The homepage treats the video as an interface (§5); swapping the asset
   later is not a page change.
5. **Xavier/samantha real hero visuals come later** with the same
   treatment; their cards are text-first for now. This knowingly and
   temporarily overrides the recorded constraint
   `mem-2026-07-28-all-three-flagship-products-need-addd26` ("do not
   reduce xavier or samantha to text-only cards"): the research verdict
   (real imagery or none — never fake CSS UI) removes the old CSS visuals,
   and real footage for both doesn't exist yet. Resolution: the duo cards
   are interim text-first with a designed-in visual slot (§4.4); restoring
   full product-specific visual presence via real posters/footage is a
   committed follow-up, not an option. Flagged for operator sign-off in
   spec review.

## 3. Page composition

| #   | Current (top → bottom)                                                       | New                                   |
| --- | ---------------------------------------------------------------------------- | ------------------------------------- |
| 1   | LandingHeader                                                                | LandingHeader (nav labels change, §6) |
| 2   | EcosystemHero (ecosystem pitch + CSS trio)                                   | **Hero14all** (§4.1)                  |
| 3   | FlagshipChapter ×3 (incl. 3 platform downloads)                              | **HowItWorks** (§4.2)                 |
| 4   | —                                                                            | **HomeFeatures** (§4.3)               |
| 5   | —                                                                            | **LoopExtends** (§4.4)                |
| 6   | AutonomousLoop → RecentlyShipped → Creed → EngineRoom → closing CTA → footer | unchanged                             |

Coral download-CTA count: first viewport at 1440×900 goes 5 → 2 (header +
hero). Whole page goes 5 → 3 (header, hero, closing). Per-platform download
buttons live only on `/projects/ai-14all#download`.

## 4. Sections (copy is verbatim and binding)

All lowercase, as written. Section titles use the display font (Fraunces);
everything else stays mono.

### 4.1 Hero (`Hero14all.astro`, section keeps `id="system"`)

Centered column, copy above the video frame; frame spans the wide
container (1120px).

- Eyebrow (`ai-14all` emphasized): **ai-14all** · desktop mission control
  for coding agents
- H1 (display): ship with a fleet, not a single agent.
- Sub: run claude, codex, and more in parallel — each agent in its own git
  worktree, with its own branch and terminal. see who needs you at a
  glance, review diffs inline, stay in one window.
- CTAs: primary **download ai-14all** using the existing dual pattern
  (desktop: `Ai14allReleaseLink kind="releasePage"` — the sole allowed
  renderer of release hrefs, never a hand-written release URL; mobile
  routes to `/projects/ai-14all#download`, preserving the recorded
  mobile-CTAs-route decision); ghost **see how it works** → `#how`.
- Fine line: shipping now · source-available · macOS universal + windows
  x64 — "shipping now" derives from the ai-14all entry's
  `homepage.availability` in the projects content collection; the rest is
  static.
- Video frame: 1px `--border`, 6px radius, layered shadow with faint coral
  glow (as mocked). The element:

    ```html
    <video
    	src="/ai-14all/hero-tour.mp4"
    	poster="/ai-14all/hero-tour-poster.jpg"
    	controls
    	playsinline
    	preload="none"
    	aria-label="guided tour of the real ai-14all app: worktree sidebar, parallel agent terminals, inline review"
    ></video>
    ```

    No JS, no HTML play-button overlay — the play affordance is baked into
    the poster (§5). CSS `aspect-ratio: 1600 / 844` on the video reserves
    layout (CLS guard).

- Caption below frame (fs-xs, muted): click to play — a 21-second guided
  tour of the real app: worktrees → parallel agents → inline review

### 4.2 How it works (`HowItWorks.astro`, `id="how"`)

Label: how it works · Title (display): three moves, one window. · Three
numbered steps (coral numerals; grid 3-up, stacking at 899px):

- **01 fan out** — hand one task to three agents — or three tasks to three
  agents. each runs in its own git worktree: own branch, own terminal, no
  collisions.
- **02 stay oriented** — the sidebar is mission control: working · quiet,
  ready · tests passed, waiting · needs a decision. glance, don't babysit.
  The three status phrases are colored spans (`--status-idle`,
  `--status-done`, `--status-waiting`); the words carry the meaning, color
  is reinforcement only.
- **03 review inline** — highlight a line in the diff, leave a comment —
  the agent picks it up and fixes in place. no PR round-trip, no
  copy-paste.

### 4.3 Features (`HomeFeatures.astro`)

Label: and while they work · No title. Three bordered cards on
`--bg-raised` (grid 3-up, stacking at 899px). Deliberately only the three
capabilities the hero and steps have NOT already told:

- **browse and verify without leaving** — file view, diff review, and
  jump-to-symbol built in.
- **compose the ecosystem** — ai-cortex remembers your codebase,
  ai-whisper runs autonomous workflows.
- **track what agents cost** — estimated per-session token and spend
  telemetry.

### 4.4 The loop extends (`LoopExtends.astro`, `id="ecosystem"` + legacy `id="products"` anchor)

Label: the loop extends · Title (display): 14all is the desk. the loop
follows you off it. · Two tinted room cards (grid 2-up, stacking at
899px). Availability chips derive from each project's
`homepage.availability` field, styled `--status-waiting` (coming soon) /
`--status-ready` (early access).

- **ai-xavier** (taupe: `rgba(var(--tint-xavier), 0.05)` wash, `0.2`
  border) — chip: coming soon — pitch: your phone is presence. — body:
  watch live terminals, answer the prompt that is blocking an agent,
  steer, or interrupt — from anywhere. — ghost CTA: **learn about
  ai-xavier** → `/projects/ai-xavier`. No install/App Store/TestFlight
  link exists — the project page is the only destination.
- **ai-samantha** (plum: same alphas with `--tint-samantha`) — chip: early
  access — pitch: supervision, out loud. — body: she watches the same
  sessions you do and answers out loud — speech recognition and voice
  synthesis run fully on your machine. — ghost CTA: **request early
  access** → `/projects/ai-samantha` (that page carries the actual
  request links). Claims boundary: fully-local claim applies to _speech_
  only, exactly as worded above — never "fully local AI".

Both cards are built with a **visual slot**: the card layout must accept a
future poster image or click-to-play video above the pitch without
restructuring (an optional named slot / prop in the component). Interim
state ships the slot empty — see decision §2.5 and the follow-up
commitment there.

### 4.5 Unchanged

AutonomousLoop, RecentlyShipped, Creed, EngineRoom, the closing CTA
section, and LandingFooter render exactly as today, in today's order.

## 5. Video and poster assets

- **`public/ai-14all/hero-tour.mp4` (interim).** 21s scripted camera tour
  rendered from `public/ai-14all/hero-demo.mp4` (looped 3×): full app
  (hold 2.5s) → sidebar → agent tabs + terminal → review pane → pull back;
  smoothstep-eased zoompan, 1600×844 @ 30fps, h264 crf 26–28, no audio,
  `+faststart`, target ≤ 4,000,000 bytes. Known interim flaw (accepted):
  brief content jumps at the two loop seams.
- **`scripts/generate-hero-tour.mjs` (new).** The keyframed zoompan
  generator + ffmpeg render, adapted from the prototype; the full working
  script is preserved verbatim in the handoff seed named in §2 decision 4.
  Run manually like the
  other generators (requires ffmpeg on PATH); the rendered asset is
  committed. When the fixture pipeline delivers a production master, this
  script re-targets it or retires.
- **`public/ai-14all/hero-tour-poster.jpg`.** A real frame from the tour's
  establishing shot (not a title card) with the coral play-ring and
  "click to play the demo" hint baked in — extend
  `scripts/generate-posters.mjs` with a real-frame compositing variant
  (Playwright page: frame image as backdrop + ring overlay, screenshot).
  Same aspect as the video (1600×844 or a scaled equivalent), ≤ 150,000
  bytes.
- **Media guard compliance** (`check:media`, unchanged): `controls`,
  `playsinline`, `preload="none"`, `poster`, no `autoplay`. The mp4 is
  excluded from the byte budget (preload="none"); the poster is counted.

## 6. Navigation and anchors

`LandingHeader.astro`, both desktop nav and the mobile `<details>` menu:

- how it works → `#how` (replaces "the system" → `#system`)
- the ecosystem → `#ecosystem` (replaces "products" → `#products`)
- north star → `#north-star` (unchanged)
- creed → `#creed` (unchanged)
- download CTA: unchanged.

Legacy anchor preservation (inbound links must not break): `id="system"`
stays on the hero section; an in-flow, visually-empty anchor with
`id="products"` sits at the top of the LoopExtends section. After build,
no in-page `href="#…"` in dist may lack a matching id — no guard checks
this today, so the implementation plan must include an explicit
grep-dist verification step (or add the check to `check-a11y.mjs`).

## 7. File impact

- **Create:** `src/components/Hero14all.astro`, `HowItWorks.astro`,
  `HomeFeatures.astro`, `LoopExtends.astro`;
  `scripts/generate-hero-tour.mjs`; `public/ai-14all/hero-tour.mp4`,
  `hero-tour-poster.jpg`.
- **Modify:** `src/pages/index.astro` (new composition; CHAPTER_COPY and
  VISUALS maps go away), `src/components/LandingHeader.astro` (nav labels,
  §6), `scripts/generate-posters.mjs` (real-frame variant),
  `scripts/check-homepage-budget.mjs` (§8), `lighthouserc.json` (§8).
- **Delete:** `src/components/EcosystemHero.astro`,
  `src/components/FlagshipChapter.astro` (verified: referenced only by
  `index.astro`). `Ai14allVisual` / `XavierVisual` / `SamanthaVisual`
  leave the homepage; delete each only if a repo-wide grep shows no other
  route uses it, otherwise keep for the project pages.

## 8. Guard and threshold amendments

- **`check:budget`:** `LIMIT` 102,400 → **262,144 bytes** (256 KiB gzip);
  update the script's header comment to name the new ceiling and its
  reason (real hero poster). Expected footprint: ~30 KB current payload +
  ≤150 KB poster ≈ 180 KB — headroom stays.
- **Lighthouse LCP:** the poster becomes the likely LCP element under
  simulated throttling; 1499 ms no longer represents this page.
  `largest-contentful-paint` maxNumericValue 1499 → **2499 provisional**;
  implementation measures the real 3-run median on the built page and
  commits median × 1.15 (rounded up) as the final threshold, never above 2499. Keep `categories:performance ≥ 0.95` and CLS ≤ 0.019 unchanged —
  both binding.
- **`check:media`, `check:a11y`, `check:downloads`:** unchanged, must stay
  green.

## 9. Accessibility

- Native video controls (keyboard-operable); `aria-label` verbatim from
  §4.1; the caption is visible text, not a replacement for the label.
- Step-02 status spans and duo-card body text (`--fg-dim` on 0.05 tint
  washes) must hold ≥ 4.5:1 — axe-gated by `check:a11y`; if a status token
  fails on `--bg`, darken the wash, not the meaning.
- Heading order per section: h1 only in the hero; h2 section titles; h3
  step/card/room headings. Nav and CTA targets keep the ≥ 44px padding
  pattern.

## 10. Out of scope

The fixture-driven video pipeline (ai-14all repo, separate brainstorm);
real hero visuals for xavier and samantha; any project-page changes; the
closing CTA section and footer; dependency upgrades.

## 11. Success criteria

1. All five guards green: `check:media`, `check:budget` (amended ceiling),
   `check:downloads`, `check:a11y`, `lighthouse` (amended LCP, ratcheted).
2. Exactly 2 coral download CTAs in the 1440×900 first viewport; 3 on the
   full page.
3. Rendered copy matches §4 verbatim.
4. All nav anchors and legacy `#system`/`#products` inbound anchors
   resolve in dist.
5. Qualitative (operator judges on the built page): a first-time reader
   can answer "what is 14all", "how does it work", and feels the
   want-to-try pull within the first two viewports.
