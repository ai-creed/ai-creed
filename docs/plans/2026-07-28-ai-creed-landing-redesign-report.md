# ai-creed landing-page redesign: research, critique, and recommendation

**Date:** 2026-07-28 · **Author:** research/critique agent session (no implementation performed)
**Scope:** https://ai-creed.dev/ redesigned as an ecosystem landing page foregrounding ai-14all, ai-xavier, ai-samantha.

**Method & evidence.** Live site audited at 1440px and 390px widths (screenshots in the session scratchpad under `shots/` — referenced below by filename); full source audit of `/Users/vuphan/Dev/ai-creed`; primary-source dossiers on all three flagship products (repos, strategy docs, `~/.ai-pref-nsync/local-docs/*`); the ecosystem design language (`~/.ai-pref-nsync/local-docs/ai-ecosystem/shared/DESIGN-LANGUAGE.md`) and `~/Dev/NORTH-STAR.md`; eight competitive references fetched live. Facts are cited inline; recommendations are labeled as such. One correction to internal state discovered en route: the checkout's branch `content/ai-samantha-coming-soon` is a **stale duplicate** — master independently received equivalent commits, so the samantha coming-soon video, ezio promotion, and pref-nsync archival are **already live** (verified by live screenshots and `git show master:...`).

---

## 1. Executive verdict

ai-creed.dev today is a disciplined, honest, beautifully cheap developer portfolio — a ~12KB, zero-JavaScript, terminal-styled index of six cards — and it is the wrong product for what the ecosystem has become. It answers "what repos does this person have?" when the real story, documented in shipped code, is "one engineer has built an integrated system where a desktop cockpit runs fleets of coding agents, a phone extends your command seat, and a voice companion supervises it all — locally, under your control." No visitor can currently discover that story: the hero sells a category ("local-first ai dev tooling"), the six cards have identical visual weight (the mature v1.8 flagship renders exactly like an archived preferences repo), one of the three flagships (ai-xavier) **does not exist on the site at all**, and the homepage's only conversion action is a `mailto:`. The stakes are no longer theoretical: the Show HN launches of 2026-06/07 pointed at these pages and died — ai-14all earned 1 point and 0 comments — and more launch moments (xavier reveal, samantha beta) are coming.

**The single biggest opportunity** is narrative, not cosmetic: the interconnection is real and provable (14all↔samantha supervision loop shipped 2026-07-08; 14all↔xavier phone bridge verified over 5G; cortex/whisper wired in as plugins), and the ecosystem already owns a codified design language the site simply ignores. Telling one story — *your agents, under your command, at your desk / in your pocket / out loud* — and making the site the design language's public expression would create a distinctive product brand almost entirely from assets that already exist. **The single biggest risk** is overpromise: two of the three flagships are private/pre-release, the "overnight autonomous loop" is a trajectory rather than a shipped feature, and the site's current greatest asset is its credibility. A redesign that markets the trio as a shipped suite would trade that credibility for vaporware smell; the design must therefore treat honest staging (shipping / early access / coming soon) as a first-class, designed system — and must stay cheap to keep true (the hard-pinned v1.0.0→v1.8.1 download links that went stale are the cautionary tale).

## 2. Product and audience model

| | **ai-14all** | **ai-xavier** | **ai-samantha** |
|---|---|---|---|
| **What it is** | Desktop mission-control app: parallel AI coding agents, one per git worktree, with attention signals and inline review | iPhone command seat for the same agents: watch live terminals, answer prompts, interrupt — desktop stays the authority | Local voice companion/supervisor: watches your sessions, speaks up, takes spoken commands; all speech on-device |
| **Primary audience** | Developers already running agent CLIs (Claude Code, Codex, …) who fan out parallel work and live in the terminal (repo "Who this is for") | The same developers, in away-from-desk moments — agents don't pause when you stand up | The same developers, ambient/heads-up moments; secondarily, people drawn to a warm local "presence" over a dashboard |
| **Problem solved** | "Staying oriented while parallel work continues" — juggling shells/editors/review tabs across worktrees (strategy §2) | An agent hits a permission prompt or finishes while you're out; today that means walking back to the desk | Orientation without context-switching: ask "what's happening?" instead of checking three windows (ecosystem-role doc) |
| **Distinctive promise** | "Supervised parallelism, not a swarm" — you stay the gatekeeper; real PTYs, signed/notarized, local | "Human judgment from anywhere. Local execution always." E2E-sealed, capability-gated, audited — *not* a remote desktop | "A presence, not a dashboard" — she never acts unasked; fully local speech (whisper STT + local F5-TTS) |
| **Maturity (fact)** | **Shipping.** v1.8.2, 2,099 commits, 35 releases, public repo (30★), macOS signed DMG + Windows installer, auto-update | **Pre-release.** Private repo, TestFlight internal builds, v1.0 roadmap ~60% (interactive terminal + off-LAN verified; approvals/kill-switch pending) | **Private alpha.** 770 commits, notarized dmg dogfooded daily since 2026-07-11; supervision loop vs 14all shipped; no releases |
| **Best CTA today** | **Download for macOS / Windows** → `releases/latest` (never pinned versions) + `git clone` fallback | **"Coming soon — get notified"** (email or Discord; no repo/App Store/TestFlight link exists to give) | **"Early access interest"** mailto (a notarized build exists; delivery is manual) — or plain "coming soon" |
| **Proof needed** | Fresh demo footage (current UI — existing videos are v1.0-era), dated release cadence, honest platform matrix, comparison vs Conductor/Crystal/Claude Squad | **A 30-second film of the proven moment**: phone answering a live Claude Code permission prompt over 5G. This asset does not exist yet and is the single highest-value content gap in the ecosystem | The orb footage (exists, 600KB) + a short "ask her what's happening → she answers from a real 14all session" clip |

**Assumptions, stated separately.** (1) The three flagships share **one core audience in three postures** (desk / pocket / ambient) rather than three demographics — this is an inference from NORTH-STAR's "presence surface" framing and the shared supervision domain, and it is the assumption the whole recommended architecture rests on; validate it (§11). (2) samantha's public lead should be "supervisor with a voice," not "voice assistant" — her page currently oversells voice-first while the shipped differentiator is the supervision loop (repo canon: "Voice is a *surface*, not the thesis"). (3) Copy constraints treated as fixed: ai-14all is **source-available (FSL), never "open source"** (owner's own launch notes); xavier cannot claim approvals/kill-switch (not shipped); samantha cannot imply fully-local *AI* (LLM calls default to cloud providers) — only fully-local *speech*; the *Her*/X-Men/Assassin's-Creed naming lore stays implicit (IP); NORTH-STAR.md is an offline document — paraphrase its ideas, never quote or cite it.

## 3. Current-site audit

Evidence: `home-desktop-fold.png`, `home-desktop-full.png`, `home-mobile-full.png`, `p14all-desktop-full.png`, `p14all-mobile-full.png`, `psamantha-desktop-full.png`, `pcortex-desktop-full.png`, `bio-desktop-full.png`, `xavier-404-desktop.png`; source facts from the repo audit.

**Five-second test (fold, 1440×900).** A first-timer sees: `$ local-first ai dev tooling`, "six local-first tools. one conviction: the agent works for you.", and six equal cards. They can answer *"a person's collection of AI dev tools"* — they cannot answer *what the ecosystem does, why it matters, which product is for them, or what to do next*. Three of the four mission questions fail at the fold. The one conviction line is genuinely good — it's the seed of the brand — but it's set as a dim subtitle.

**Flagship priority: fails.** ai-14all is card 1 of 6 (correct), but a card is a card: name + tagline + chip, identical container to `ai-pref-nsync [archived]`. samantha is card 5, tagged `[wip]` `[private]` — reads as "ignore me." **ai-xavier is absent entirely**: no page (`xavier-404-desktop.png` shows the live 404), no mention in `src/` (grep: zero). The hero literally counts "six tools," a number that excludes one flagship and includes an archived project. The site's implicit center of gravity is "quantity of repos," not the trio.

**Differentiation between the three: fails by omission.** Nothing on the site explains when you'd want 14all vs samantha (xavier being absent), that they're surfaces of one system, or that they interoperate — even though 14all's own feature list quietly names cortex and whisper integrations. The ecosystem's strongest fact — *these compose* — appears nowhere.

**Narrative/hierarchy.** Homepage = hero → grid → about → collab → footer. It is an index, not an argument. The about block ("The agent is a tool, not the product…") is the best copy on the site and is buried at position 3 in `--fg-dim`. There is no "why now," no "how it fits together," no proof-of-momentum module — despite 17 of the last 30 site commits being ai-14all release bumps (the momentum exists; it's just invisible).

**Visual identity.** Competent terminal minimalism: system mono, #0d0d0d, hairline borders, green `$`. It is also (a) **anonymous** — indistinguishable from a thousand dev-portfolio sites; and (b) **off-brand by the ecosystem's own law**: the canonical DESIGN-LANGUAGE mandates coral `#ff8163` as "the **only** brand hue," forbids using the accent as a status color, and defines status/type/motion contracts — the site uses green as both brand *and* status, invents its own status set, misses the type roles, and even inverts the `--fg-dim`/`--fg-muted` naming relative to the ecosystem ramps. The most on-brand moment on the entire site is the samantha orb video — the one place the real ecosystem identity (coral glow, serif "learning to hear," plum void) peeks through, and it's the 5th card's detail page.

**CTA hierarchy / conversion.** Homepage: zero product CTAs — cards navigate, the only action verb is "say hi" (mailto). The 14all page buries its download under two screenfuls, and its links are **hard-pinned to a version** (v1.8.1 at audit time; v1.8.2 was already out; `public/ai-14all/latest-mac.yml` is stuck at v1.0.0, breaking the README's checksum-verify path). Version pins on a hand-edited page are a structural bug: they *will* go stale (they already did once, v1.0.0→v1.8.1). The GitHub org (footer's only outbound trust link) shows "For a solo developer, and his friends," 7 repos, and a Discord server the site never mentions.

**Trust & evidence.** Genuinely good: honest `[wip]` notices, real demo videos, version banners on cortex/whisper/ezio pages, a bio page with real humans. Missing: any dated shipping evidence (changelog), any comparison to the named competitors (Conductor, Crystal, Claude Squad — from the launch-post drafts), platform honesty *summarized* up front, and any social layer (Discord exists; invisible). Launch-reality check: the Show HN posts pointing at these pages earned 1–3 points ("Show HN: AI-14all" — 1 point, 0 comments, 2026-07-02; two ai-whisper Show HNs — 3pt/2c and 2pt/0c; verifiable via [HN Algolia](https://hn.algolia.com/?q=ai-creed)). Launches are mostly luck — but the destination page gave a cold visitor nothing to grab.

**Desktop & mobile usability.** Solid bones: single column at 390px, readable, no horizontal scroll (`home-mobile-full.png`, `p14all-mobile-full.png`). Issues: the 14all mobile page is a very long undifferentiated mono scroll; demo videos render at 220–360px wide where their dense UI text is illegible (`p14all-desktop-full.png` shows the hero video's terminal content unreadable even at 1120px); download links are plain list items, not tappable buttons.

**Accessibility & performance.**
- Contrast (computed): body 15.57:1 ✅; `--fg-dim` 5.63:1 ✅; chips 7.5–8.4:1 ✅; **`--fg-muted` #6a6a6a on #0d0d0d = 3.59:1 ❌** (footer/muted text, fails AA 4.5:1); link affordance is a #222-on-#0d0d0d underline (1.22:1) — links are nearly indistinguishable from text.
- **No `:focus-visible` styles anywhere; no skip link; `prefers-reduced-motion` absent from the repo** — while four pages autoplay looping media with **no pause control** (WCAG 2.2.2 failure) and no posters.
- 404 page has no heading; `<nav>` unlabeled; the unused screenshot slot would emit a junk alt.
- Performance is the site's crown jewel: homepage ≈ 12KB total, zero JS, zero webfonts, CSS inlined. But product pages autoplay-fetch up to **5.2MB** of video on load (whisper page; 14all ≈ 4.7MB) — `autoplay` defeats lazy loading.
- SEO/meta: homepage description is 4 words ("Local-first AI dev tooling."); one shared OG image for all pages, and its source (`og.svg`) still says "**five** tools. one philosophy." — a stale count on every social embed. README claims Astro 5 + Cloudflare Pages; reality is Astro 6 + GitHub Pages.
- Template bug: cortex's `.demo` wrapper never receives Astro's scoped style (MDX loses the cid attribute), so its border/margins silently don't apply; three other pages work around it with inline styles.

**Does it read as a landing page or a README rack?** A README rack — by design (the April 2026 spec explicitly forbade CTAs, testimonials, and "large" anything, for a "thinking on display" portfolio goal). The site *achieved its old brief*; the brief has changed. Grade it as the new brief's landing page and it fails; grade the craft and there is much to keep.

### Keep / Fix / Remove

**Keep (protect these in the redesign):**
- The performance/discipline ethos: ~12KB, zero-JS-by-default, system fonts, build-is-the-test, content-collection-driven pages with zod gates.
- The honesty vocabulary: `[wip]` notice pattern, status chips with **text** labels (never color-only), version banners, "known limits" sections — elevate, don't delete.
- The voice: lowercase, terse, verb-led, no emojis ("one conviction: the agent works for you", "supervised parallelism, not a swarm").
- The bio page ("engineer-of-one in Vietnam… and his friends") — small-team humanity is a trust asset the big references can't copy.
- The samantha orb moment — it is the brand, escaped early.
- The 14all page's *structure* (what/why → features → demo → download → requirements → known limits) — right shape, wrong emphasis and freshness.

**Fix:**
- Hero: category label → promise + proof + action.
- Flagship tiering, xavier's existence, samantha's framing (supervisor with a voice, warmly staged, not `[private]`-flavored "keep out").
- The ecosystem story (integration map; "they compose" is the moat).
- CTAs: `releases/latest` (never pinned), buttons not list items, one primary action per page.
- Adopt the ecosystem design language (coral accent; status set; type roles; motion contract) — the site should be its reference implementation.
- A11y package: focus rings, skip link, reduced-motion, click-to-play posters on all media, muted-text contrast, 404 heading, labeled nav.
- Meta/OG per page; correct counts; real descriptions; fix README stack claims; de-dupe the stale branch.

**Remove or de-emphasize:**
- The flat six-card grid as the homepage's centerpiece (supporting tools move to an "engine room" tier).
- `[private]` as a public-facing status word (it reads as rejection; "early access" / "coming soon" are the honest, warmer truths).
- Hard-pinned download URLs and the stale `latest-mac.yml` on the site origin.
- The unexplained "six/seven tools" count as the hero's only quantitative claim.

## 4. Competitive and inspiration research

Eight references, all fetched live 2026-07-28. Lessons are directives for *this* site, not praise.

**[Linear](https://linear.app)** — "The product development system for teams and agents." Five modules presented as a *numbered pipeline* (1.0 Intake → 5.0 Monitor), each a job-statement h2 + UI mockup; a dated **changelog section on the homepage**; testimonials + "37,000 product teams" only at the end. → **Lessons:** (1) Number the flagships and sequence them as one system — numbering converts tiles into a story you scroll in order. (2) A dated changelog module is the cheapest credible proof for a solo shipper — Linear runs one even with OpenAI logos in pocket.

**[Vercel](https://vercel.com)** — "Agentic Infrastructure." ~16 products never tiled on the homepage; three **job-to-be-done sections** ("Build agents…", "Ship apps…", "Host platforms…") each anchored by one customer stat, products demoted to feature-chips inside; separate "Recently shipped" shelf + "New" pills carry maturity so the core narrative stays stable. → **Lessons:** (1) Route by job above the fold — a visitor doesn't know what "ai-14all" means and shouldn't have to. (2) Keep maturity signals (new/coming-soon) as chips and a dedicated momentum shelf, not mixed into the primary pitch.

**[PostHog](https://posthog.com)** — "Shift your product into self-driving mode." ~18 products compressed into one plain link-list under the hero; sections literally titled "Social proof" and "Shameless CTA"; pricing math stated inline ("98% of our customers use PostHog for free"). → **Lessons:** (1) Personality is a solo-viable moat — self-aware, honest section naming reads as confidence, and ai-creed's terse lowercase voice is already 80% of the way there. (2) State concrete availability facts inline (free, platform, download size) — numbers where others gate calls.

**[Claude / Anthropic](https://claude.com)** — claude.com converts (hero + demo video + plans + FAQ, near-zero social proof); [anthropic.com](https://www.anthropic.com) explains (research, "Latest releases"). Visual system: serif accent + one warm hex (#D97757 terracotta) + slow staggered reveals — restraint as maturity signal. → **Lessons:** (1) Separate the brand layer from the conversion layer: ai-creed.dev should be the ecosystem/credibility layer that routes out to product surfaces, not three conversion funnels stacked. (2) A serif accent + one warm hue + calm motion is a complete, ownable "calm AI" identity — directly compatible with the ecosystem's coral + Fraunces language.

**[37signals](https://37signals.com)** — no hero at all: the homepage is a numbered catalog of 38 convictions; products are four flat nav links to sovereign domains (basecamp.com, hey.com, fizzy.do, once.com); longevity proven by keeping the [1999 site](https://1999.37signals.com) alive as a clickable artifact; the only product sentence is "We're best known for making Basecamp, HEY, and ONCE…". → **Lessons:** (1) The hub carries worldview, the product pages carry features — a solo engineer can't out-logo anyone but can out-conviction everyone; one "best known for building ai-14all, ai-xavier, and ai-samantha" sentence does more identity work than three feature grids. (2) Convert history into artifacts, not claims — the ai-creed equivalent of the living 1999 site is a visible shipping log.

**[Panic](https://panic.com)** — the closest structural blueprint found. Neutral parent shell + **per-product accent tokens defined in the parent stylesheet** (`--playdate-yellow`, `--ratcheteer-blue`…); a rotating hero "takeover" re-themes the Panic logo to the featured product's palette; products are icon tiles with hover popovers (name, one-liner, platform, one CTA, and the ecosystem-glue line "Supports Panic Sync"); most products own their own domains. Critically, **coming-soon sits at full parity inside the shipped grid**: Big Walk gets the same tile anatomy plus "Coming August 4, 2026 to Steam…" and a concrete CTA ("Wishlist on Steam"). → **Lessons:** (1) Adopt the accent-token architecture literally — `--14all-accent` / `--xavier-accent` / `--samantha-accent` under one neutral shell is the proven mechanism for "three personalities, one deliberate universe." (2) Present samantha/xavier exactly like Big Walk: identical card anatomy, a date or window, one concrete CTA — parity makes unshipped feel inevitable, not aspirational.

**[Raycast](https://www.raycast.com)** — "Your shortcut to everything." One product, many surfaces as flat nav; maturity marked *inline in the CTA row* ("Download for Windows **(beta)**"); proof = 24 named humans with handles and roles (not logos) + one hard number in the hero attribute row ("99.8% crash-free rate") + honest community counts ("Slack: 37k members"); every screenshot wears faux macOS window chrome (traffic-light dots are literally in their CSS), and keyboard shortcuts render as real keycaps. → **Lessons:** (1) Named humans + one true number beat logo walls at indie scale — and a single hard reliability/cadence stat in the hero row punches above its weight. (2) Dress ai-14all screenshots in native window chrome and render real keycaps — the cheap trick that makes a dev tool read OS-grade instead of web-page-grade.

**[LangChain](https://www.langchain.com)** — "Powering the Agent Development Lifecycle." Products grouped by lifecycle job in the nav; the standout device is the **discriminator-tile row** for its three overlapping OSS frameworks, each with one parallel-grammar use-case sentence ("Build intelligent agents for open-ended work" / "Quick start agents with any model provider" / "Build reliable agents with low-level control") — three confusable products self-sort in one glance. Anti-lesson also observed: the homepage is really LangSmith's page (platform absorbs the family) — viable only because the siblings are funnels to one revenue center. → **Lessons:** (1) Steal the discriminator row: one italicized, parallel-grammar sentence per flagship is the cheapest effective "which is for me" device seen anywhere. (2) Do **not** let ai-14all absorb the family the way LangSmith does — the trio's job-parity *is* the ecosystem story; weight the CTAs toward 14all, never the narrative.

**Maturity-stage pattern across all eight references:** not one polished homepage quarantines pre-release products into a faded "coming soon" ghetto. The observed grammar is: keep one stable narrative; mark stage with small chips ("New", "(beta)") or a date ("Coming August 4, 2026"); give the unshipped thing a concrete CTA (wishlist/notify); and carry ecosystem-wide momentum in a dated shelf (Linear's changelog, Vercel's "Recently shipped", Anthropic's "Latest releases", Panic's takeover announcements). For ai-creed: samantha and xavier belong *inside* the flagship narrative at full visual weight, stage-marked honestly, routed to interest capture — not visually punished for being early.

## 5. Positioning recommendation

**Master narrative (recommended):**
> ai-creed is one engineer's integrated system for commanding AI coding agents — a desktop mission control that runs them in parallel (ai-14all), a phone that keeps you in the decision loop from anywhere (ai-xavier), and a local voice companion that watches it all and speaks up (ai-samantha). Everything runs on your machine, everything answers to you, and the pieces are built to compose — the same supervision loop, reachable from desk, pocket, or voice. Built in public sight, dogfooded nightly, honest about what's shipped and what's next.

This narrative is (a) provable from shipped code today, (b) roomy enough to grow into the autonomous-loop future without promising it, and (c) a real answer to "why three products" — they are three command seats on one system, which no point tool can copy.

**Three hero-positioning directions:**

**Direction 1 — "Command" (the fleet frame).**
- Headline: `run your coding agents like a fleet. stay in command.`
- Support: `a desktop mission control, a phone-side command seat, and a voice companion — local-first, built to compose, honest about what's shipped.`
- Tone: confident operator; calm, technical, terse.
- Strength: true *today* (14all alone fulfills the headline); sets up all three products as seats of the same command; differentiates against single-agent tools; inherits the existing "the agent works for you" conviction.
- Risk: "mission control" is becoming crowded vocabulary (Conductor, Crystal, Claude Squad all orbit it); needs the ecosystem angle to stand apart — the fleet is commandable *from three places*, which competitors can't say.

**Direction 2 — "The loop" (the trajectory frame).**
- Headline: `point it at the work. review it in the morning.`
- Support: `an autonomous engineering loop you own end-to-end — intent, control, execution — with a human hand on every gate.`
- Tone: visionary, category-creating.
- Strength: matches the ecosystem's actual north star and moat (owning every seam of the loop); most memorable; frames all products as inevitable.
- Risk: **overpromise** — the unattended loop is not shipped; a skeptical HN reader will ask "show me" and today's demo is manual. Also leans on an internal document that is deliberately offline. Usable later; wrong hero for 2026-07.

**Direction 3 — "The creed" (the conviction frame).**
- Headline: `the agent works for you. never the other way around.`
- Support: `local-first ai dev tools with one creed: your machine, your command, your code — readable end-to-end.`
- Tone: manifesto; principled indie.
- Strength: brand-true (it *names the site*), durable across any product mix, emotionally distinct from AI-hype sites; the existing about-block already contains it.
- Risk: abstract — a conviction converts believers but doesn't tell a first-timer what the products *do*; weak product routing if used alone.

**Recommendation: Direction 1 as the hero, Direction 3 as a first-class manifesto section, Direction 2's language reserved for a forward-looking "where this is going" paragraph phrased as trajectory ("being built toward…"), never as a shipped claim.** Rationale: the hero must survive a skeptical five-second read *today*; Command does, and it routes cleanly into the three postures (desk/pocket/voice). The creed is what makes the brand memorable and honest — it earns its own section (and finally justifies the name "ai-creed" without a word of pop-culture reference). The loop is the narrative ceiling — tease it, don't sell it.

## 6. Proposed homepage architecture

Order, with the job each section does. (Wireframe-level detail in §8.)

**0. Header** — brand mark + `products ▾ · ecosystem · changelog · bio` + GitHub icon. *Visitor question:* where am I / where's everything? *Why here:* two-layer routing (narrative on page, full catalog in nav+footer) per every reference studied.

**1. Hero** — Direction-1 headline + support line; primary CTA **`↓ download ai-14all`** (macOS/Windows, → releases/latest) + secondary **`see how it fits together ↓`**; below, one quiet proof line: `v1.8.2 · shipping since 2026-04 · source-available · macOS + Windows`. Visual: real 14all footage in a window frame, three session rows showing the attention states (calm / ready / needs-you) — the product demonstrating the promise. *Question answered:* what is this and what do I do? *Emotion:* competence, calm. *Why first:* the only flagship that can convert today must be one click from arrival.

**2. The three seats (flagship trio)** — section intro one-liner: `one system. three ways you stay in command.` Then three **numbered, job-led** blocks (01 / 02 / 03), full-width, each: job-statement h2, product name as small label + stage chip, 3 proof bullets, one CTA, one honest media asset.
- **01 · at your desk — ai-14all** `[shipping]` — "see every agent, review every diff, stay the gatekeeper." CTA: download. Media: session-grid footage.
- **02 · in your pocket — ai-xavier** `[coming soon]` — "when an agent needs you and you're not at the desk." CTA: get notified. Media: the phone-answers-a-live-prompt film (to be produced; placeholder: styled still).
- **03 · out loud — ai-samantha** `[early access]` — "ask what's happening; she's been watching." CTA: early-access interest. Media: the orb video (exists).
*Question:* which one is for me? *Emotion:* recognition ("that's my moment"). *Why second:* the mission's core routing task; job-statements (Vercel/Linear lesson) do the differentiating, chips do the honesty.

**3. "They compose" (ecosystem map)** — a small diagram: samantha (intent) and xavier (presence) both riding 14all (control), which drives whisper (execution) and reads cortex (memory); each edge labeled with a *shipped* integration fact ("samantha supervises 14all sessions — shipped 07-2026"). One paragraph of Direction-2 trajectory language, honestly tensed. *Question:* why is this an ecosystem and not three apps? *Emotion:* "ohh, it's one machine." *Why third:* differentiation vs point tools lands only after the products are individually understood.

**4. Recently shipped (momentum strip)** — 3–4 dated entries pulled from release history (`ai-14all v1.8.2 · jul 27`, `ai-whisper v0.7.0`, `ai-cortex v0.15.1`, `ai-samantha arc-1 supervision`), link to a full `/changelog`. *Question:* is this alive? *Why:* the solo-viable substitute for logos (Linear lesson); it also automates freshness instead of hand-pinned versions.

**5. The creed (manifesto)** — four tenets, set large (the one serif/display moment on the page): `local-first — your machine is the authority` · `the agent works for you, never the other way around` · `you stay the gatekeeper — nothing merges without you` · `code you can read end-to-end`. *Question:* what do these people believe? *Emotion:* trust, taste. *Why here:* converts browsers into believers after the rational case; names the site.

**6. The engine room** — compact mono grid of the supporting cast with one-line jobs + install commands: cortex (`npm i -g ai-cortex`), whisper, ezio, mystique, shakespii, pref-nsync `[archived]`. Intro line: `the flagships run on parts you can use alone.` *Question (dev audience):* what's under the hood / what can I grab today? *Why:* preserves the portfolio's discovery value without diluting the trio; public npm packages are real, immediate CTAs.

**7. Built by** — one strip: photo-free bio line ("an engineer-of-one in Vietnam, and his friends"), links to `/bio`, GitHub org, Discord, email. *Question:* who's behind this, can I talk to them? *Why:* small-team honesty as closing trust, right before the ask.

**8. Footer** — full taxonomy: three flagships, engine room, changelog, bio, github, discord, email, RSS(later). Repeat primary CTA.

**Flagship routing summary:** introduced by *job* in §2-blocks, differentiated by a one-glance **"which seat, when"** micro-table at the end of section 2 (`at the desk → 14all · away → xavier · heads-up → samantha`, each with stage + CTA — LangChain's discriminator-row pattern: one parallel-grammar sentence per product), and routed to `/projects/<name>` pages which keep their current structure but adopt: job-led hero, stage chip, fresh media, `releases/latest` CTAs, and cross-links to the other two seats ("also in the loop: …").

**Mobile order is identical**; the trio stacks (numbered blocks already linearize), the comparison micro-table becomes a 3-row list, and the hero CTA stays above the fold at 390px (`home-mobile-fold` today shows the fold spent entirely on the title).

## 7. Three visual-concept directions

**Concept A — "Terminal, perfected."** *Metaphor:* the shell, taken seriously. *Layout:* current 720px column widened per-section; card grid retained but tiered. *Type:* stays mono-everything; adds a real scale (13/15/18/24/34) and tabular-nums. *Palette:* keep #0d0d0d neutrals but swap brand green → ecosystem coral, adopt the canonical status set (gold/red/green/blue). *Motion:* 150ms contract, focus rings, reduced-motion; nothing else. *Imagery:* ASCII-framed real screenshots. *Ecosystem fit:* reads as 14all's dial applied site-wide — samantha and xavier feel visiting rather than home. *Risk:* stays anonymous; the "README rack" smell survives the paint. *Cost:* days.

**Concept B — "One loop, three rooms."** *(Recommended.)* *Metaphor:* the site is the ecosystem design language's public reference implementation — one calm neutral chrome ("the corridor"), and each flagship section is a *room* tinted by that product's own canonical dial: cool-slate + square + mono for 14all; warm-taupe + rounded + humanist sans accents for xavier; plum + glow + a restrained Fraunces "soul" moment for samantha. Coral is the **only** brand/interactive hue everywhere (per design-language law); status chips use the canonical gold/red/green/blue with text labels. *Layout:* full-width numbered sections over a 12-col grid; 720px prose measure inside. *Type roles:* display (Fraunces, rare — hero + creed), UI (system sans), data (mono w/ tabular-nums) — exactly the ecosystem's three roles. *Materiality:* hairline borders in the corridor; per-room elevation follows each product's dial (shadow vs glow). *Motion:* the ecosystem's attention grammar as the site's signature — idle elements quiet, the "needs you" demo dot breathes; 150ms tempo; full `prefers-reduced-motion` fallback; CSS-only. *Imagery:* real product footage only, click-to-play with posters; no abstract AI art. *Ecosystem fit:* perfect by construction — visitors literally preview each app's feel before installing it, and the site stops contradicting the family's own law. *Precedent:* Panic ships exactly this architecture — per-product accent tokens in the parent stylesheet under a neutral shell (§4) — so this is a proven small-studio pattern, not an invention. *Risks:* three tints can go carnival without discipline (rule: tint ≤ background wash + chip + border, never full component recolors); Fraunces is the site's first webfont (subset it, or fall back to a system serif to protect the 12KB ethos); demands taste in execution.

**Concept C — "The creed, printed."** *Metaphor:* a manifesto/field-manual — warm paper, editorial serif, numbered tenets, products presented like chapters with plate-style screenshots. *Palette:* light warm neutral + coral + ink. *Type:* serif display large, mono for data. *Motion:* nearly none. *Imagery:* framed stills, captioned like figures. *Ecosystem fit:* beautifully distinctive and honest to the indie voice, but it fights the products themselves — all three surfaces are dark, ambient, chrome-heavy; the handoff from paper-light site to plum/slate apps is a brand seam. Strong for `/bio` and essays; wrong spine for a product landing. *Risk:* reads as a blog; weak launch energy; light theme doubles the contrast QA work.

**Recommendation: Concept B, with two deliberate grafts — A's performance discipline as a hard budget (zero-JS default, ≤ ~60KB before media, system-font fallbacks) and C's editorial typography for the creed section only.** B is the only direction that makes the three products feel individually distinct *and* provably related, because it renders the already-codified dial system instead of inventing a look. It also future-proofs: a new product = a new room tint from its dial sheet.

## 8. Wireframe-level direction

Desktop = 1200px content grid (12-col, 72px gutters outboard), prose measure 720px. Mobile = 390px single column, 16px gutters. All sections full-bleed background, contented to grid.

**Hero (desktop):** two columns ~7/5.
```
[● ai-creed]                              [products ▾  ecosystem  changelog  bio  gh]
┌───────────────────────────────┐  ┌──────────────────────────────┐
│ run your coding agents        │  │  ┌ window: ai-14all ────────┐ │
│ like a fleet.                 │  │  │ ● session: fix-auth  ⟂   │ │
│ stay in command.              │  │  │ ◐ session: migrate  needs│ │  ← one dot breathes
│                               │  │  │ ○ session: docs     idle │ │
│ a desktop mission control, a  │  │  └──────────────────────────┘ │
│ phone command seat, a local   │  └──────────────────────────────┘
│ voice companion. built to     │
│ compose. honest about stage.  │
│ [↓ download ai-14all] [see how it fits ↓]                        │
│ v1.8.2 · macOS+Windows · source-available · shipping since 04-26 │
```
Mobile hero: headline → support (2 lines max) → primary CTA full-width → proof line → media below fold.

**Trio sections (desktop):** alternating media side, each full-width with room tint wash (≤6% alpha), 96px vertical padding.
```
│ 01 · at your desk                                    [shipping] │
│ see every agent. review every diff. stay the gatekeeper.        │
│ ai-14all — mission-control desktop app                          │
│ • one worktree, one session, real terminals  • inline review    │
│ • attention: quiet → breathing → needs-you                      │
│ [↓ macOS] [↓ windows] [github →]      ┌──────── footage ──────┐ │
```
xavier block mirrors with phone-frame media right→left, warm-taupe wash, `[coming soon]` chip, CTA `[get notified →]`; samantha block plum wash, orb video in a circle-cropped frame, `[early access]`, CTA `[i'm interested →]`. Then the micro-table:
```
│ which seat, when?                                               │
│ at the desk → ai-14all   [shipping]   ↓ download                │
│ away        → ai-xavier  [soon]       → notify me               │
│ heads-up    → ai-samantha[early]      → say hi                  │
```
Mobile: blocks stack in order; media above text within each block; micro-table as 3 tappable rows.

**Ecosystem map:** single centered SVG/CSS diagram ~800px wide; five nodes (samantha · xavier on top row as "command"; 14all center as "control"; whisper · cortex bottom as "engine"), edges labeled with shipped facts; one trajectory sentence beneath. Mobile: vertical flow (top→bottom), edges become short labeled connectors.

**Momentum strip:** 4 dated mono rows + `full changelog →`. **Creed:** four tenets, Fraunces, numbered 01–04, generous whitespace, coral numerals. **Engine room:** 3×2 compact cards (name, one-liner, `npm i -g …` copyable, stage chip). **Built by / footer:** as §6.

**Interaction notes for the implementer:** no carousels; no scroll-jacking; tabs/accordions only via CSS (`:target`/`details`) if at all; the single "breathing" dot in the hero is one CSS animation with a reduced-motion static fallback; all video click-to-play with `poster` + `preload="none"` (kills today's 4.7–5.2MB autoloads); focus-visible = 2px coral ring offset 2px, everywhere.

## 9. Content and copy direction

**Hero (recommended):**
> **run your coding agents like a fleet. stay in command.**
> a desktop mission control, a phone-side command seat, and a local voice companion — one system, built to compose, honest about what's shipped.
> `[↓ download ai-14all]` `[see how it fits together]`
> v1.8.2 · macOS + windows · source-available · shipping since april 2026

Alternates kept honest: `your agents don't need a babysitter. they need mission control.` / `six tools was a portfolio. this is a system.` (internal-facing, don't ship) / Direction-3 pairing for the creed section below.

**ai-14all card/block copy:**
> **01 · at your desk — see every agent, review every diff.**
> ai-14all `[shipping · v1.8.2]`
> run claude, codex, and friends in parallel — each pinned to its own git worktree and real terminal. the sidebar tells you who needs you; inline review sends your comments straight back to the agent. supervised parallelism, not a swarm: nothing merges without you.
> `↓ macOS` `↓ windows` `github →`

**ai-xavier block copy:**
> **02 · in your pocket — for the moment an agent needs you and you're gone.**
> ai-xavier `[coming soon]`
> a paired iphone app that lets you watch live agent terminals, answer their prompts, and interrupt a run from anywhere — end-to-end sealed, capability-gated, audited. your desktop stays the authority; the phone extends your presence, not your computer.
> `get notified →`

*(Every claim above is shipped-and-verified in internal acceptance runs; deliberately absent: approvals, kill-switch, app store — not shipped.)*

**ai-samantha block copy:**
> **03 · out loud — ask what's happening. she's been watching.**
> ai-samantha `[early access]`
> a local voice companion that supervises your sessions and answers in spoken prose — wake her, ask for a status, send an instruction. speech recognition and her voice run entirely on your machine, and she never acts without being asked.
> `interested in an early build? say hi →`

**Creed section:** `the creed` — 01 `local-first. your machine is the authority.` 02 `the agent works for you. never the other way around.` 03 `you stay the gatekeeper. nothing ships without your eyes.` 04 `code you can read end-to-end.`

**Ecosystem section intro:** `three seats, one loop. samantha frames and supervises. 14all commands the workspace. whisper executes with an implementer and a reviewer. cortex remembers. xavier keeps you reachable. every edge shown here is shipped code, not roadmap.` — followed by one trajectory line: `the direction of travel: describe the work before bed, review merged-ready changes in the morning. we're building toward it in public, gate by gate.`

**Copy rules (binding):** lowercase headings; verb-led; no emojis; "source-available," never "open source," for 14all/xavier/samantha; no film or comic references; no invented numbers (no user counts, no "trusted by"); stars only if ever ≥3 digits; every feature claim must trace to a shipped release note.

## 10. Prioritized action plan

**Tier 1 — high-confidence improvements to the current site (do regardless of redesign):**

| # | Change | User impact | Effort | Confidence | Depends on |
|---|---|---|---|---|---|
| 1 | Point all 14all download CTAs at `releases/latest`; delete stale `latest-mac.yml` from site origin; refresh "latest stable" line from a single source | Broken/stale funnel fixed permanently | S | High | — |
| 2 | Create `ai-xavier.mdx` (status coming-soon, no repo/install), stage chip + notify CTA | A flagship stops 404ing | S | High | copy sign-off |
| 3 | Homepage hero: promise line + primary download CTA + proof line (even inside current design) | The only page most visitors see starts converting | S | High | — |
| 4 | A11y package: focus-visible ring, skip link, `prefers-reduced-motion`, click-to-play videos w/ posters (`preload="none"`), fix `--fg-muted` usage on text, 404 heading, `aria-label` nav | AA compliance + 5MB page loads gone | M | High | — |
| 5 | Per-page meta descriptions + per-page OG (fix "five tools" og.svg); real homepage description | Social/SERP embeds stop lying | S | High | — |
| 6 | `/changelog` page auto-fed from release bumps; 3-entry strip on homepage | Momentum becomes visible proof | M | High | — |
| 7 | Surface Discord + org link block; delete stale branch; fix README stack claims | Trust path completeness; repo hygiene | S | High | — |

**Tier 2 — redesign decisions (build after §11 validation):**

| # | Change | User impact | Effort | Confidence | Depends on |
|---|---|---|---|---|---|
| 8 | Full IA v2 (§6): hero → trio → map → momentum → creed → engine room | Site becomes an argument, not an index | L | Medium-high | positioning sign-off |
| 9 | Adopt design language site-wide (coral accent, status set, type roles) — Concept B | Ecosystem coherence; brand distinctiveness | L | Medium-high | open decision #1 |
| 10 | Room-tinted flagship sections + product-page v2 (job-led heroes, cross-links) | Product differentiation at a glance | M | Medium | 8, 9 |
| 11 | Produce 3 proof assets: fresh 14all footage, xavier phone-answers-prompt film, samantha ask-status clip | The trio's claims become visible | M (filming) | High value / Medium confidence in timing | product readiness |
| 12 | Ecosystem map section w/ shipped-edge labels | The moat becomes legible | M | Medium | 8 |

**Tier 3 — optional experiments:**

| # | Change | User impact | Effort | Confidence | Depends on |
|---|---|---|---|---|---|
| 13 | Numbered-pipeline vs job-selector framing A/B (5-sec tests, not live traffic) | Sharper trio comprehension | S | Low | 8 |
| 14 | "Which seat, when" interactive selector (CSS-only) | Faster routing for deciders | S | Low | 10 |
| 15 | Availability facts inline PostHog-style (sizes, platforms, license) | Skeptic conversion | S | Medium | 10 |
| 16 | Fraunces display subset vs system-serif fallback perf test | Brand vs bytes tradeoff resolved | S | Medium | 9 |

## 11. Validation plan

1. **Comprehension (five-second test).** 8–10 devs (Discord + peers; plus a usertesting-style panel if budget allows): show the new hero fold 5s → "what is this? who's it for?" **Pass: ≥7/10 say 'runs/manages AI coding agents locally' unprompted; ≥5/10 recall a product name.** Run the same test on the current site first for a baseline (prediction: <3/10).
2. **Product-selection test.** Give 3 scenario cards ("agent pinged while commuting", "reviewing 4 parallel branches", "want status without switching windows") → pick the product. **Pass: ≥70% correct routing; every miss logged as copy debt.**
3. **CTA/conversion test.** Instrument with a privacy-respecting counter (GoatCounter/Plausible — decision #7) or, at minimum, GitHub release download-counts + org-traffic before/after. **Pass: download CTR from homepage ≥5% of visitors during the next launch moment; notify-list signups >0 meaningful cohort for xavier.**
4. **Mobile review.** 390px + 320px sweep: CTA above fold, tap targets ≥44px, trio blocks scannable in <60s, no horizontal scroll, videos never autoload. **Pass: checklist 100%.**
5. **Accessibility & performance gates (CI-able).** axe: 0 serious/critical; keyboard-only walkthrough completes every CTA; contrast: all text ≥4.5:1 (AA); `prefers-reduced-motion` verified by screenshot diff; Lighthouse mobile: Perf ≥95, LCP <1.5s (fast 4G), CLS <0.02; homepage transfer ≤100KB excluding click-to-play media (today's 12KB is the trophy — defend a hard budget even after webfont/imagery).
6. **Honesty audit (pre-launch, recurring).** Every claim on the page traced to a release note or acceptance doc; every version string generated, not typed. **Pass: zero hand-pinned versions in content.**

## 12. Open decisions (leadership calls, not design calls)

1. **Brand accent: adopt coral site-wide (per ecosystem law) or keep terminal green?** Coral aligns the family and is AA-safe on the dark neutrals; green is the site's only current identity equity. (Recommendation: coral; green survives only as the canonical "done" status.)
2. **How public to be about the autonomous-loop trajectory** — one tensed sentence (recommended), a full section, or silence until the loop demos?
3. **ai-xavier's public debut timing** — page now as `[coming soon]` (recommended) vs waiting for TestFlight-public; and whether "Xavier" remains the public name given the codename-lore policy.
4. **ai-samantha's public lead** — "supervisor with a voice" (recommended, matches shipped truth) vs "voice companion" (current page, warmer but understates the moat).
5. **Zero-JS as a hard constraint** — keep absolute (CSS-only interactions; recommended default) or allow one progressive-enhancement island (e.g., copy-install buttons)?
6. **Community surface** — put the Discord on the site (it exists on the org) or keep community informal until support load is plannable?
7. **Analytics** — none (today) vs privacy-first counter to make §11's conversion tests measurable. Without it, launch learning stays anecdotal.
8. **Distribution posture on the page** — state the FSL/source-available license and Windows-unsigned caveats inline (PostHog-style honesty, recommended) or leave them to the repo?

---

## Recommended direction — one page

**Thesis.** Rebuild ai-creed.dev as the ecosystem's brand-and-routing layer: one provable story (*run your coding agents like a fleet — stay in command, from desk, pocket, or voice*), three job-led flagship sections at three honest stages, the shipped integration map as the moat exhibit, and the creed as the closing signature. Convert on ai-14all today; capture intent for ai-xavier and ai-samantha without overpromising.

**Positioning.** Hero = Command frame (`run your coding agents like a fleet. stay in command.`). Creed = manifesto section (`the agent works for you. never the other way around.`). Loop = one forward-tensed sentence, not a promise.

**Page.** Header → Hero (download 14all · proof line) → 01/02/03 trio by job with stage chips (`shipping / coming soon / early access`) + "which seat, when" strip → ecosystem map with shipped-edge labels → recently-shipped strip → creed → engine room (npm-installable parts) → built-by → footer taxonomy.

**Look.** Concept B "one loop, three rooms": neutral calm chrome; coral as the only brand hue (ecosystem law); each flagship section tinted by its product's own dial (slate/taupe/plum); Fraunces only for hero + creed; mono for data; motion = one breathing attention dot, 150ms everywhere, full reduced-motion; zero-JS default and a ≤100KB budget; every video click-to-play behind a poster.

**Do now regardless (Tier 1):** un-pin downloads to `releases/latest`; ship `ai-xavier.mdx`; hero CTA on the current homepage; a11y package (focus rings, reduced-motion, click-to-play, contrast); per-page OG/meta; `/changelog` + homepage strip; surface Discord; delete the stale branch.

**Validate before Tier 2:** five-second comprehension ≥7/10; scenario→product routing ≥70%; a11y/perf gates green; every claim traced to a release note.

**Decide (blocking):** coral vs green · loop-trajectory publicity · xavier debut timing · samantha's lead frame · zero-JS strictness · Discord · analytics · license honesty inline.

**North metric for the next launch moment:** a cold HN visitor can say what ai-creed is in one sentence, pick their seat in under a minute, and download ai-14all in two clicks — nothing on the page a skeptic can falsify.
