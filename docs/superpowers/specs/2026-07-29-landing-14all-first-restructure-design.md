# Landing Page 14all-First Restructure — Design

- **Date:** 2026-07-29 · revised 2026-07-30 (SDD reviewer findings)
- **Status:** approved implementation contract — SDD workflow
  `wf_c56df324a73d473a`. No operator gate remains: §2 decision 5 is
  resolved on recorded operator direction, and every §11 criterion has an
  autonomous evidence path.
- **Amends:** `docs/superpowers/specs/2026-07-28-ai-creed-landing-redesign-design.md`
  (page structure, hero, two guard thresholds, and the §10
  human-participant validation items — superseded per §11 below;
  everything else in that spec — tokens, guard suite, project pages,
  zero-JS contract, and §10's automated/visual checks — stands)
- **Approved mockup:** `2026-07-29-landing-14all-first-restructure-mockup.html`
  (same directory; canonical copy at
  `~/.ai-pref-nsync/local-docs/ai-creed/brainstorm/2026-07-29-landing-restructure-mockup-a.html`).
  Self-contained from its committed location: the token/base subset of
  `global.css` is inlined, and the hero media are stand-ins pointing at the
  committed `public/ai-14all/` source recording via relative paths (the
  approved prototype tour render was session-temporary; §5 regenerates it).

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
   treatment; their cards are text-first for now. This **supersedes** the
   recorded constraint
   `mem-2026-07-28-all-three-flagship-products-need-addd26` ("do not
   reduce xavier or samantha to text-only cards") for the interim, on the
   authority of explicit operator direction already on record (2026-07-29:
   "we can do the restructure now … replacing the hero video later (along
   with real hero for other apps: phone and samantha)"). The research
   verdict (real imagery or none — never fake CSS UI) removes the old CSS
   visuals, and real footage for both doesn't exist yet. Resolution —
   durable, no further sign-off required: the duo cards are interim
   text-first with a designed-in visual slot (§4.4); the constraint memory
   has been amended to this resolved form; and restoring full
   product-specific visual presence via real posters/footage is committed
   follow-up work tracked by the deferred memory
   `mem-2026-07-29-restore-real-xavier-samantha-visual-2b271c` (revisit:
   fixture pipeline delivers production masters, real footage otherwise
   exists, or the operator asks).

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

Content model (inherited §7.1 — project positioning stays in
frontmatter): the h1 and sub render from the ai-14all entry's
`homepage.headline` / `homepage.summary`; the §4.1 strings above are the
values to write into `ai-14all.mdx`. The eyebrow framing, fine-line
suffix, and caption are section-structural copy and live in the
component; only the availability word is frontmatter-derived.

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

Content model (single source of truth, resolving the inherited §7.1
contract against the new CTAs): the duo cards render from frontmatter,
never hardcoded copy — chip from `homepage.availability`, pitch from
`homepage.headline`, body from `homepage.summary`, ghost CTA label/href
from `homepage.desktopCta` (`mobileCta` must be identical; the
desktop/mobile split is meaningless for non-14all flagships). The card
copy above is binding as the **values to write into**
`ai-xavier.mdx` / `ai-samantha.mdx` frontmatter. Homepage duo CTAs route
to project pages; prefilled `mailto:` interest links live **only** on the
project pages (which already carry them). `src/lib/flagships.ts` is
amended to enforce the chosen model: for non-14all flagships,
`desktopCta` and `mobileCta` must be **identical in both label and
href** (deep equality, so a stale or divergent mobile label cannot
survive the build), both hrefs must equal `/projects/<id>` exactly
(replacing today's must-be-mailto rule, so no contradictory frontmatter
can survive either), labels non-empty, and the xavier
no-install-destination patterns stay. No `content.config.ts` schema change is needed — the existing
`cta` shape already fits. The recorded mobile-CTAs-route decision's
intent is preserved: a project-page route never implies a
phone-installable desktop app.

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
- **Media guard compliance** (`check:media`, extended): the committed
  guard enforces `controls`, `preload="none"`, `poster`, and no
  `autoplay`, but does **not** check `playsinline` today —
  `scripts/check-media.mjs` gains an explicit video-only assertion that
  every `<video>` in dist carries `playsinline` (audio elements exempt).
  The mp4 is excluded from the byte budget (preload="none"); the poster
  is counted.

## 6. Navigation and anchors

`LandingHeader.astro`, both desktop nav and the mobile `<details>` menu:

- how it works → `#how` (replaces "the system" → `#system`)
- the ecosystem → `#ecosystem` (replaces "products" → `#products`)
- north star → `#north-star` (unchanged)
- creed → `#creed` (unchanged)
- download CTA: unchanged.

Nav enforcement (`check:copy`, §8), asserted per variant — not
globally, because both legacy ids intentionally remain valid targets:
in `header.lh .nav-desktop` and in `header.lh .nav-mobile nav` alike,
the fragment links must be **exactly** the four entries above, in
order, with label→href equality (whitespace-normalized `textContent`
"how it works" paired with `href="#how"`, and so on for all four) and
exact cardinality — no fifth fragment link and no leftover
"the system"/"products" entry in either variant. An unchanged mobile
menu therefore fails even though its fragments still resolve.

Legacy anchor preservation (inbound links must not break): `id="system"`
stays on the hero section; an in-flow, visually-empty anchor with
`id="products"` sits at the top of the LoopExtends section. Anchor
integrity is machine-enforced, not a plan step, by the new `check:copy`
guard (§8) in two parts: (a) generic — any in-page `href="#…"` in
`dist/index.html` without a matching `id` fails; (b) explicit and
**positional** — `id="system"` must be the id of the hero section
element itself (also independently forced by the §11.3 `#system h1`
copy assertion, which cannot match unless the hero h1 sits inside
`#system`), and the `id="products"` anchor must be the **first element
child of `#ecosystem`** (the LoopExtends section), so inbound
`#products` links land at the top of that region. Existence alone is
not sufficient — either id present but outside its required position
(e.g. moved to the footer) fails. Clause (b) is required because the
revised nav no longer links to those fragments; they protect
**external** inbound links, which the generic href→id check cannot see.

## 7. File impact

- **Create:** `src/components/Hero14all.astro`, `HowItWorks.astro`,
  `HomeFeatures.astro`, `LoopExtends.astro`;
  `scripts/generate-hero-tour.mjs`; `scripts/check-homepage-copy.mjs`
  (the `check:copy` guard, §8); `public/ai-14all/hero-tour.mp4`,
  `hero-tour-poster.jpg`;
  `docs/superpowers/evidence/2026-07-29-landing-restructure/` screenshots
  (§11.5).
- **Modify:** `src/pages/index.astro` (new composition; CHAPTER_COPY and
  VISUALS maps go away), `src/components/LandingHeader.astro` (nav labels,
  §6), `src/content/projects/ai-14all.mdx` (`homepage.headline` /
  `homepage.summary` take the §4.1 h1/sub values),
  `src/content/projects/ai-xavier.mdx` and `ai-samantha.mdx`
  (`homepage.headline`/`homepage.summary` take the §4.4 pitch/body values;
  `desktopCta`/`mobileCta` become the §4.4 project-page CTAs),
  `src/lib/flagships.ts` (non-14all CTA rule: both hrefs exactly
  `/projects/<id>`, §4.4), `scripts/generate-posters.mjs` (real-frame
  variant), `scripts/check-homepage-budget.mjs` (§8),
  `scripts/check-media.mjs` (video-only `playsinline` assertion, §5),
  `scripts/check-a11y.mjs` (first-viewport CTA assertion, §8),
  `lighthouserc.json` (§8), `package.json` (wire `check:copy`),
  `.github/workflows/deploy.yml` (run `check:copy` in the deploy gate
  beside the other guards). No `src/content.config.ts` change (§4.4).
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
- **`check:copy` (new guard).** `scripts/check-homepage-copy.mjs`, wired
  as `pnpm check:copy` and into the deploy gate
  (`.github/workflows/deploy.yml`) beside the other guards. Rendered-DOM
  assertions against the built homepage in **headless chromium** over
  the same static-server pattern as `check-a11y.mjs` — a static HTML
  parser is not acceptable, because the guard must evaluate computed
  visibility; never regex substring matching. It renders at both
  1440×900 and 390×844 and asserts: the §11.2 per-region and total
  markup-layer download-CTA counts, the §11.3 selector-scoped
  verbatim-copy table (every entry computed-visibility checked), the
  §11.3 video `aria-label` attribute equality, and the §11.4 anchor and
  nav checks (generic href→id, positional legacy-id assertions, and
  per-variant §6 nav label→href equality with exact cardinality).
- **`check:a11y` (extended).** Adds homepage visibility assertions
  (§11.2): at 1440×900, exactly 2 coral download CTAs visible in the
  viewport at scroll 0; and at each of 1440×900 and 390×844, exactly 3
  download CTAs visible over the **complete page** — an element counts
  only when actually rendered visible, so the hidden half of each
  responsive desktop/mobile pair must not count and a pair leaking both
  variants fails. All existing checks unchanged, must stay green.
- **`check:media` (extended).** Adds the video-only `playsinline`
  assertion (§5). All existing checks unchanged, must stay green.
- **`check:downloads`:** unchanged, must stay green.

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

Every criterion has an autonomous evidence path; none blocks on a human.
Operator judgment is welcome post-ship but does not gate this workflow.

Inherited-validation supersession: the 2026-07-28 spec's §10
human-participant items — the "at least 7 of 10 agentic-coding
developers" five-second comprehension test and the ≥70% scenario-routing
study — are **superseded for this amendment and its workflow** by
criterion 5 below (reviewer-judged screenshot evidence). They were
obligations of the previous, operator-gated effort; no human-participant
study is an acceptance obligation of this autonomous workflow. The
inherited §10 automated checks, visual checks, the
two-actions-to-download rule, and the claims-traceability rule are
untouched and remain in force.

1. All six guards green: `check:media` (extended, §5/§8), `check:budget`
   (amended ceiling), `check:downloads`, `check:a11y` (extended, §8),
   `check:copy` (new, §8), `lighthouse` (amended LCP, ratcheted).
2. Download-CTA counts, machine-asserted at two layers. Markup layer
   (`check:copy`), asserted **per region and in total**: each of the
   three regions — `header.lh`, the hero (`#system`), and the closing
   CTA section (`section.closing`) — must contain exactly one
   module-fed desktop link with `data-dl-origin="ai14all-downloads"`
   and exactly one coral mobile link with
   `href="/projects/ai-14all#download"` (the header's `a.cta`; the
   hero's and closing's `.btn.primary` mobile variants); document-wide
   totals are therefore exactly 3 of each, with nothing else
   coral-download on the page. Global totals alone are not sufficient —
   a region missing its pair while another region duplicates one fails.
   Rendered layer (`check:a11y`, which owns visibility): exactly 2
   coral download CTAs visible in the 1440×900 viewport at scroll 0,
   and exactly 3 download CTAs visible over the complete page at each
   of 1440×900 and 390×844 — so a responsive pair leaking both variants
   (four visible full-page CTAs) fails even while every markup count
   passes.
3. Verbatim copy, machine-asserted at the rendered semantic layer.
   `check:copy` carries the binding §4 strings (hero eyebrow, h1, sub,
   fine line, caption; the hero primary and ghost CTA labels; the three
   step bodies; the three feature cards; section titles; duo pitches,
   bodies, chips, and CTA labels) as a **selector → expected-text
   table**: each string is asserted as whitespace-normalized
   `textContent` equality on the specific semantic element that must
   carry it (e.g. `#system h1`; the step-02 `<p>` normalized across its
   status spans; the samantha card's ghost CTA link), each with an
   expected occurrence count (1 unless the table states otherwise — the
   hero primary label's responsive desktop/mobile pair is the recorded
   exception). Every table entry is additionally **computed-visibility
   checked** in chromium: the matched element must be rendered visible
   (not `display:none` / `visibility:hidden` / zero-sized /
   `.visually-hidden`) at both 1440×900 and 390×844, except entries the
   table marks as a responsive variant, which must be visible at the
   viewport the table names and hidden at the other. A hidden h1 with no
   visible h1 therefore fails. Separately, the hero `<video>`'s
   `aria-label` **attribute** must equal the §4.1 string exactly
   (attribute equality — `textContent` cannot see it). Substring
   presence anywhere in the file is never sufficient — hidden,
   duplicated, or wrong-section text fails.
4. Anchor and nav integrity, machine-asserted. `check:copy` fails if
   (a) any in-page `href="#…"` in `dist/index.html` lacks a matching
   `id`; (b) either legacy id is absent **or out of position** —
   `system` must be the hero section's own id and `products` must be
   the first element child of `#ecosystem` (§6), so an id parked
   elsewhere (e.g. the footer) fails; or (c) either nav variant
   deviates from §6 — in `header.lh .nav-desktop` and
   `header.lh .nav-mobile nav` alike, the fragment links must be
   exactly the four §6 entries, in order, with label→href equality and
   no extra or leftover fragment link. Clause (c) exists because both
   legacy ids intentionally remain valid targets, so fragment-validity
   alone would let an unchanged mobile menu pass.
5. Comprehension, evidence-reviewed. The implementation commits
   full-page screenshots of the built homepage at 1440×900 and 390×844
   to `docs/superpowers/evidence/2026-07-29-landing-restructure/`; the
   workflow reviewer judges from them that a first-time reader can
   answer "what is 14all" and "how does it work" and feels the
   want-to-try pull within the first two viewports. The operator may
   overrule after shipping; that judgment does not block this workflow.
