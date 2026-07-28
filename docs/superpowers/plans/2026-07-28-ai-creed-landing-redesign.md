# ai-creed landing redesign — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ai-creed homepage as the brand-and-routing layer for one agentic engineering ecosystem — three flagship products, one autonomous-loop north star, ai-14all as the conversion — per the approved spec at `docs/superpowers/specs/2026-07-28-ai-creed-landing-redesign-design.md`.

**Architecture:** Astro 6 static site, zero client JavaScript. Homepage is composed from focused `.astro` components fed by content-collection frontmatter (a new nested `homepage` object), two typed data modules (`ai14all-downloads`, `recently-shipped`), and a build-time invariant loader (`src/lib/flagships.ts`) that fails the build when the flagship contract regresses. Verification is a committed guard suite (`check:media`, `check:budget`, `check:downloads`, `check:a11y`, `lighthouse`) wired into CI before deploy.

**Tech Stack:** Astro ^6.4.6, MDX content collections (glob loader + zod), pnpm 10, Node ≥ 22.6 (guards use `--experimental-strip-types`), Prettier (tabs, tabWidth 4, printWidth 100), eslint-plugin-astro, `@fontsource/fraunces` (font asset only), `playwright` + `axe-core` + `@lhci/cli` as devDependencies, `sharp` (already a direct dependency) for OG rasterization.

## Global Constraints

Copied from the spec; every task's requirements implicitly include these.

- Coral `#ff8163` is the ONLY brand/interactive hue. Coral is never a status color; status states use the separate status palette and always include text.
- Room tints (ai-14all cool slate, ai-xavier warm taupe, ai-samantha deep plum) appear only as low-alpha washes, border tints, and product visuals — never on shared controls.
- Hover/focus transitions are 150 ms; exactly one breathing animation exists (inside `Ai14allVisual`); `prefers-reduced-motion` kills all animation and zeroes transitions. No parallax, carousels, scroll-jacking, or scroll-triggered entrances.
- Zero client JavaScript. Navigation uses native anchors; the mobile menu is a native `<details>`; responsive CTA variants are separate links hidden with `display: none`. `check:budget` hard-fails on any `<script>` tag in the built homepage.
- One shared CTA breakpoint everywhere: desktop CTA/nav variants render at ≥ 900 px, mobile variants at ≤ 899 px — the header and every section use the same `@media (max-width: 899px)` query, so no viewport width ever shows mixed modes.
- Every interactive target — links, buttons, and `<summary>` disclosures alike — is at least 44 × 44 px; only links inside prose `<p>` elements are exempt (spec §9's WCAG 2.5.8 inline exception). Nav, footer, list, and action links get `min-height: 44px; min-width: 44px; display: inline-flex; align-items: center;`. `check:a11y` asserts both dimensions across `a, button, summary, input, select, textarea, [role="button"]` with bounding boxes at 390 px.
- No media autoplays. Every `<video>` has `preload="none"`, a `poster`, and `controls`, and never `autoplay`. The homepage embeds no `<video>` at all.
- Homepage initial transfer ≤ 102,400 bytes (gzip, Node `zlib` defaults) counting the document plus every automatically fetched subresource including icons and the font; only `preload="none"` media payloads are excluded. External (cross-origin) automatically fetched resources are forbidden outright — `check:budget` rejects them rather than skipping them.
- Lighthouse (LHCI, default mobile simulated throttling, median of 3 runs): performance `minScore` 0.95, LCP `maxNumericValue` 1499, CLS `maxNumericValue` 0.019.
- Accessibility: skip link; labeled navigation; `:focus-visible` ring 2 px coral with 2 px offset; normal text ≥ 4.5:1 contrast, large text ≥ 3:1; tap targets ≥ 44 px; correct heading order; meaningful or intentionally empty alt text.
- Claims (binding on all public copy): the three flagships are **source-available**, never "open source". ai-xavier may claim watching live terminals, answering prompts, steering, interrupting — NOT approvals or a kill switch — and links to no install/App Store/TestFlight. ai-samantha may claim fully local speech recognition/synthesis, never a fully local AI stack. Naming lore stays implicit. The autonomous-loop vision is paraphrased, future-tensed, never cited to private material.
- Availability labels: ai-14all `shipping`, ai-xavier `coming soon`, ai-samantha `early access`. Flagship project pages render the same label from the same frontmatter source; flagship MDX bodies contain no contradicting availability phrase.
- No hand-written download URL or version string in MDX or homepage source. `src/data/ai14all-downloads.ts` is the only carrier (plus `recently-shipped.ts` for editorial entries).
- Voice: lowercase, terse, job-led, honest. No invented social proof, no "AI glow" hype.
- Formatting: Prettier with tabs, tabWidth 4, printWidth 100 (`pnpm format` / `pnpm format:check`); `pnpm lint` (eslint-plugin-astro); every commit leaves `pnpm check && pnpm lint && pnpm build` green unless the step explicitly says it is a red step.
- GitHub org is `ai-creed`; contact email is `vu.phan.se@gmail.com` (exported as `SITE_CONTACT_EMAIL`); site URL is `https://ai-creed.dev`.

## File Map

| Path                                                                                               | Responsibility                                                                             |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/styles/global.css`                                                                            | Tokens: coral accent, status palette, room tints, display font, focus/motion/a11y baseline |
| `public/fonts/fraunces-latin-600.woff2`                                                            | The single self-hosted display font asset                                                  |
| `src/data/ai14all-downloads.ts`                                                                    | The only source of ai-14all version + download URLs                                        |
| `src/data/recently-shipped.ts`                                                                     | Editorial proof-of-momentum entries                                                        |
| `src/content.config.ts`                                                                            | Project schema + nested `homepage` object                                                  |
| `src/lib/flagships.ts`                                                                             | `getFlagships()` — build-failing flagship invariants                                       |
| `src/content/projects/ai-14all.mdx`                                                                | Flagship content; no download URLs                                                         |
| `src/content/projects/ai-xavier.mdx`                                                               | NEW flagship page (coming soon, honest claims)                                             |
| `src/content/projects/ai-samantha.mdx`                                                             | Rewritten to early access + supervision framing                                            |
| `scripts/generate-posters.mjs`                                                                     | Renders committed video poster JPEGs via Playwright                                        |
| `scripts/generate-og.mjs`                                                                          | Rasterizes `src/assets/og-home.svg` → `public/og-home.png` via sharp                       |
| `src/layouts/Base.astro`                                                                           | Skip link, `#main`, header/footer slots, per-page OG                                       |
| `src/components/LandingHeader.astro` · `LandingFooter.astro`                                       | Homepage chrome                                                                            |
| `src/components/Ai14allVisual.astro` · `XavierVisual.astro` · `SamanthaVisual.astro`               | CSS/HTML product visuals (hero + chapter variants)                                         |
| `src/components/EcosystemHero.astro`                                                               | Hero copy, CTAs, proof line, trio composition                                              |
| `src/components/FlagshipChapter.astro`                                                             | Shared chapter layout, labels, actions                                                     |
| `src/components/AutonomousLoop.astro`                                                              | Five-step loop + xavier presence band                                                      |
| `src/components/RecentlyShipped.astro` · `Creed.astro` · `EngineRoom.astro`                        | Proof strip, creed, supporting grid                                                        |
| `src/components/AvailabilityChip.astro`                                                            | Availability label chip (status palette, text always)                                      |
| `src/pages/index.astro`                                                                            | Assembly only                                                                              |
| `src/pages/projects/[...slug].astro`                                                               | Availability chip, module-fed `#download` section, click-to-play media                     |
| `scripts/check-media.mjs` · `check-homepage-budget.mjs` · `check-downloads.mjs` · `check-a11y.mjs` | Committed guards                                                                           |
| `lighthouserc.json`                                                                                | Committed Lighthouse thresholds                                                            |
| `.github/workflows/deploy.yml`                                                                     | Full guard suite before deploy                                                             |

---

### Task 1: Landing tokens, display font, and a11y/motion baseline

**Files:**

- Modify: `src/styles/global.css`
- Modify: `src/components/StatusChip.astro`
- Modify: `src/components/Header.astro` (44 px targets for the legacy header kept on project/bio pages)
- Modify: `package.json` (devDependency `@fontsource/fraunces`)
- Create: `public/fonts/fraunces-latin-600.woff2` (copied binary)

**Interfaces:**

- Consumes: nothing.
- Produces: CSS custom properties every later task uses verbatim: `--accent: #ff8163`, `--on-accent`, `--fg-muted: #7d7d7d`, `--status-waiting|failed|done|ready|idle`, `--tint-14all|xavier|samantha` (RGB triplets for `rgba(var(--tint-…), α)`), `--font-display`, `--fs-display`, `--dur: 150ms`, `.skip-link`, global `:focus-visible`.

- [ ] **Step 1: Install the font package and copy the single weight**

```bash
pnpm add -D -E @fontsource/fraunces@5.3.0
mkdir -p public/fonts
cp node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff2 public/fonts/fraunces-latin-600.woff2
```

Expected manifest entry: `"@fontsource/fraunces": "5.3.0"` (exact, no range prefix).

- [ ] **Step 2: Replace the token block and baseline in `src/styles/global.css`**

Replace the entire `:root { … }` block (lines 1–38) with:

```css
:root {
	/* color — coral is the only brand/interactive hue */
	--bg: #0d0d0d;
	--bg-raised: #141414;
	--border: #222;
	--fg: #e6e6e6;
	--fg-dim: #8a8a8a;
	--fg-muted: #7d7d7d; /* 4.6:1 on --bg; the old #6a6a6a was 3.6:1 */
	--accent: #ff8163;
	--on-accent: #0d0d0d; /* text on coral fills — 7.7:1 */

	/* status — never coral; always paired with text */
	--status-waiting: #d4a24c;
	--status-failed: #e05d5d;
	--status-done: #5eb95e;
	--status-ready: #5da9e0;
	--status-idle: #8a8a8a;
	--warn: var(--status-waiting); /* legacy alias (WipNotice) */

	/* room tints — RGB triplets, used only via rgba() washes/borders/visuals */
	--tint-14all: 147, 164, 189; /* cool slate */
	--tint-xavier: 179, 160, 138; /* warm taupe */
	--tint-samantha: 168, 120, 200; /* deep plum */

	/* type */
	--font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
	--font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
	--fs-xs: 11px;
	--fs-sm: 13px;
	--fs-base: 15px;
	--fs-h3: 18px;
	--fs-h2: 22px;
	--fs-h1: 28px;
	--fs-display: clamp(32px, 6vw, 52px);

	/* space (4px baseline) */
	--s-1: 4px;
	--s-2: 8px;
	--s-3: 12px;
	--s-4: 16px;
	--s-6: 24px;
	--s-8: 32px;
	--s-12: 48px;

	/* layout */
	--max-w: 720px;
	--max-w-wide: 1120px;
	--page-max-w: var(--max-w);
	--radius: 2px;

	/* transitions — the 150ms interaction contract */
	--dur: 150ms;
}

@font-face {
	font-family: "Fraunces";
	src: url("/fonts/fraunces-latin-600.woff2") format("woff2");
	font-weight: 600;
	font-style: normal;
	font-display: swap;
}
```

- [ ] **Step 3: Append the a11y/motion baseline at the end of `global.css`**

```css
:focus-visible {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.skip-link {
	position: absolute;
	left: -9999px;
	top: 0;
	z-index: 100;
	padding: var(--s-3) var(--s-4); /* 44px target when focused */
	background: var(--bg-raised);
	color: var(--fg);
	border: 1px solid var(--accent);
	border-radius: var(--radius);
}
.skip-link:focus {
	left: var(--s-3);
	top: var(--s-3);
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation: none !important;
		transition-duration: 0ms !important;
	}
}
```

- [ ] **Step 4: Move StatusChip off the accent onto status tokens**

In `src/components/StatusChip.astro`, replace the four `.chip.…` rules with:

```css
.chip.public {
	color: var(--status-done);
	border-color: var(--status-done);
}
.chip.private {
	color: var(--status-waiting);
	border-color: var(--status-waiting);
}
.chip.stable {
	color: var(--status-done);
	border-color: var(--status-done);
}
.chip.archived {
	color: var(--status-idle);
	border-color: var(--border);
}
```

- [ ] **Step 5: 44 px targets in the legacy header**

In `src/components/Header.astro` (still rendered on project and bio pages), replace the `.brand` and `.links a` rules with:

```css
.brand {
	display: inline-flex;
	gap: var(--s-2);
	align-items: center;
	border: none;
	color: var(--fg);
	min-height: 44px;
}
.links a {
	border: none;
	color: var(--fg-dim);
	min-height: 44px;
	min-width: 44px;
	display: inline-flex;
	align-items: center;
}
```

- [ ] **Step 6: Verify**

Run: `pnpm check && pnpm lint && pnpm build && pnpm format:check`
Expected: all pass. Open `pnpm preview` and confirm links/hover are coral site-wide, status chips are green/gold/grey (not coral), and `curl -s http://localhost:4321/ | grep -c fonts.googleapis` prints `0`.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/components/StatusChip.astro src/components/Header.astro package.json pnpm-lock.yaml public/fonts
git commit -m "feat(tokens): coral accent, status palette, display font, a11y baseline"
```

### Task 2: Typed data modules — downloads and recently shipped

**Files:**

- Create: `src/data/ai14all-downloads.ts`
- Create: `src/data/recently-shipped.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `AI14ALL_DOWNLOADS` (`{ version: string; releasePageUrl: string; assets: { macUniversal: DownloadAsset; macArm64: DownloadAsset; windowsX64: DownloadAsset } }`), `AI14ALL_DOWNLOAD_ASSETS: readonly DownloadAsset[]`, `DownloadAsset = { label: string; url: string }`, `RECENTLY_SHIPPED: readonly RecentlyShippedEntry[]`, `RecentlyShippedEntry = { date: string; project: string; summary: string; href: string }`. Later tasks import these names exactly.

- [ ] **Step 1: Write `src/data/ai14all-downloads.ts`**

```ts
// The ONLY place an ai-14all version or download URL may exist in this repo.
// CI (pnpm check:downloads) verifies every URL resolves and that `version`
// matches the latest published GitHub release tag.
export interface DownloadAsset {
	label: string;
	url: string;
}

const VERSION = "1.8.2";
const BASE = `https://github.com/ai-creed/ai-14all/releases/download/v${VERSION}`;

export const AI14ALL_DOWNLOADS = {
	version: VERSION,
	releasePageUrl: "https://github.com/ai-creed/ai-14all/releases/latest",
	assets: {
		macUniversal: {
			label: "macOS (universal — intel + apple silicon)",
			url: `${BASE}/ai-14all-${VERSION}-universal.dmg`,
		},
		macArm64: {
			label: "macOS (apple silicon, native)",
			url: `${BASE}/ai-14all-${VERSION}-arm64.dmg`,
		},
		windowsX64: {
			label: "windows (x64, unsigned — smartscreen warns once)",
			url: `${BASE}/ai-14all-${VERSION}-x64-Setup.exe`,
		},
	},
} as const;

export const AI14ALL_DOWNLOAD_ASSETS: readonly DownloadAsset[] = Object.values(
	AI14ALL_DOWNLOADS.assets,
);
```

- [ ] **Step 2: Write `src/data/recently-shipped.ts`**

All three entries are final. The v1.8.0 summary condenses that release's public changelog headline (typing into a watched terminal from a paired phone, plus reach-from-anywhere via a self-hosted relay — published 2026-07-26); the ai-samantha entry states the shipped supervision integration.

```ts
// Editorial proof-of-momentum entries, build-time only (spec §5.7).
// Dates are ISO release dates; hrefs must be public and are curl-verified in Step 3.
export interface RecentlyShippedEntry {
	date: string;
	project: string;
	summary: string;
	href: string;
}

export const RECENTLY_SHIPPED: readonly RecentlyShippedEntry[] = [
	{
		date: "2026-07-27",
		project: "ai-14all",
		summary: "v1.8.2 — signed + notarized universal macos build; windows x64 installer",
		href: "https://github.com/ai-creed/ai-14all/releases/tag/v1.8.2",
	},
	{
		date: "2026-07-26",
		project: "ai-14all",
		summary: "v1.8.0 — type into a watched terminal from your phone; reach it from anywhere",
		href: "https://github.com/ai-creed/ai-14all/releases/tag/v1.8.0",
	},
	{
		date: "2026-07-08",
		project: "ai-samantha",
		summary: "supervises live ai-14all sessions and answers status out loud (early access)",
		href: "/projects/ai-samantha",
	},
];
```

- [ ] **Step 3: Verify**

```bash
pnpm check
curl -sfIL https://github.com/ai-creed/ai-14all/releases/tag/v1.8.2 -o /dev/null && echo tag-ok
curl -sfIL "https://github.com/ai-creed/ai-14all/releases/download/v1.8.2/ai-14all-1.8.2-universal.dmg" -o /dev/null && echo asset-ok
```

Expected: `pnpm check` passes; both curls print their ok line.

- [ ] **Step 4: Commit**

```bash
git add src/data
git commit -m "feat(data): typed ai-14all downloads module and recently-shipped entries"
```

---

### Task 3: Committed video posters

Playwright's bundled Chromium cannot decode the H.264 demo videos, so posters are **designed frames** rendered from token-styled HTML — consistent with the CSS/HTML product-visual language (spec §4.5, §8).

**Files:**

- Modify: `package.json` (devDependency `playwright`)
- Create: `scripts/generate-posters.mjs`
- Create (generated, committed): `public/ai-14all/hero-demo-poster.jpg`, `public/ai-14all/inline-review-demo-poster.jpg`, `public/ai-samantha/hero-demo-poster.jpg`, `public/ai-whisper/workflow-demo-poster.jpg`

**Interfaces:**

- Consumes: token values from Task 1 (inlined — the script is standalone HTML).
- Produces: the four poster paths above; Tasks 4–5 reference them verbatim.

- [ ] **Step 1: Install playwright and its chromium**

```bash
pnpm add -D -E playwright@1.62.0
pnpm exec playwright install chromium
```

Expected manifest entry: `"playwright": "1.62.0"` (exact, no range prefix).

(pnpm's `onlyBuiltDependencies` allowlist is untouched — playwright needs no postinstall script; browsers install via the CLI.)

- [ ] **Step 2: Write `scripts/generate-posters.mjs`**

```js
// Renders committed poster frames for the demo videos. Re-run after replacing a demo.
import { chromium } from "playwright";

const POSTERS = [
	{
		out: "public/ai-14all/hero-demo-poster.jpg",
		eyebrow: "ai-14all",
		title: "mission control for parallel agents",
		tint: "147, 164, 189",
	},
	{
		out: "public/ai-14all/inline-review-demo-poster.jpg",
		eyebrow: "ai-14all",
		title: "inline review, inside the editor",
		tint: "147, 164, 189",
	},
	{
		out: "public/ai-samantha/hero-demo-poster.jpg",
		eyebrow: "ai-samantha",
		title: "the orb is listening",
		tint: "168, 120, 200",
	},
	{
		out: "public/ai-whisper/workflow-demo-poster.jpg",
		eyebrow: "ai-whisper",
		title: "a spec-driven run, live",
		tint: "138, 138, 138",
	},
];

const page = ({ eyebrow, title, tint }) => `<!doctype html><html><head><style>
	body { margin: 0; width: 1280px; height: 720px; display: grid; place-items: center;
		background: radial-gradient(ellipse at 50% 40%, rgba(${tint}, 0.14), transparent 65%) #0d0d0d;
		color: #e6e6e6; font-family: ui-monospace, Menlo, monospace; }
	.frame { text-align: center; }
	.eyebrow { color: rgba(${tint}, 0.9); font-size: 22px; letter-spacing: 0.08em; }
	.title { font-size: 40px; font-weight: 600; margin-top: 16px; }
	.play { margin: 40px auto 0; width: 88px; height: 88px; border: 2px solid #ff8163;
		border-radius: 50%; display: grid; place-items: center; color: #ff8163; font-size: 30px; }
	.hint { margin-top: 20px; color: #8a8a8a; font-size: 18px; }
</style></head><body><div class="frame">
	<div class="eyebrow">${eyebrow}</div>
	<div class="title">${title}</div>
	<div class="play">▶</div>
	<div class="hint">click to play the demo</div>
</div></body></html>`;

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const poster of POSTERS) {
	await tab.setContent(page(poster));
	await tab.screenshot({ path: poster.out, type: "jpeg", quality: 82 });
	console.log(`wrote ${poster.out}`);
}
await browser.close();
```

- [ ] **Step 3: Generate, verify, commit**

Run: `node scripts/generate-posters.mjs && ls -la public/ai-14all/*.jpg public/ai-samantha/*.jpg public/ai-whisper/*.jpg`
Expected: four JPEGs exist, each roughly 20–60 KB.

```bash
git add scripts/generate-posters.mjs public/ai-14all public/ai-samantha public/ai-whisper package.json pnpm-lock.yaml
git commit -m "feat(media): committed poster frames + generator script"
```

---

### Task 4: Homepage schema, flagship invariant loader, and flagship content

One task on purpose: the schema/loader contract and the content that satisfies it land in a single green commit. The red build check midway is an internal verification step — nothing is committed while red. All copy below is claims-vetted; do not embellish it.

**Files:**

- Modify: `src/content.config.ts`
- Create: `src/lib/flagships.ts`
- Modify: `src/pages/index.astro` (temporary probe import)
- Modify: `src/pages/projects/[...slug].astro` (drop removed-field references)
- Create: `src/content/projects/ai-xavier.mdx`
- Modify: `src/content/projects/ai-samantha.mdx` (full replacement)
- Modify: `src/content/projects/ai-14all.mdx`

**Interfaces:**

- Consumes: poster paths from Task 3.
- Produces: `FLAGSHIP_IDS`, `FlagshipId`, `AVAILABILITY_VALUES = ["shipping", "coming soon", "early access"]`, `Availability`, `Flagship` (collection entry whose `data.homepage` is required), `getFlagships(): Promise<Flagship[]>` (sorted by rank, throws with a `flagship contract:` prefix on any violation); three entries with `data.homepage.featured === true` that satisfy it. The schema gains optional `homepage` and `videoPoster` fields and loses `download`/`downloadWindows`.

- [ ] **Step 1: Extend the schema in `src/content.config.ts`**

Replace the whole file with:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cta = z.object({
	label: z.string(),
	href: z.string().optional(),
});

const homepage = z.object({
	featured: z.literal(true),
	rank: z.number().int().min(1).max(3),
	role: z.string(),
	posture: z.string(),
	availability: z.enum(["shipping", "coming soon", "early access"]),
	headline: z.string(),
	summary: z.string(),
	desktopCta: cta,
	mobileCta: cta.required({ href: true }),
});

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) =>
		z
			.object({
				name: z.string(),
				tagline: z.string(),
				status: z.enum(["public", "private", "stable", "archived"]),
				order: z.number(),
				repo: z.string().optional(),
				install: z.string().optional(),
				features: z.array(z.string()).min(3).max(6),
				screenshot: image().optional(),
				video: z.string().optional(),
				videoPoster: z.string().optional(),
				wip: z.boolean().optional(),
				homepage: homepage.optional(),
			})
			.superRefine((val, ctx) => {
				if (val.status === "public") {
					if (!val.repo) {
						ctx.addIssue({
							code: "custom",
							message: 'repo is required when status is "public"',
							path: ["repo"],
						});
					}
					if (!val.install) {
						ctx.addIssue({
							code: "custom",
							message: 'install is required when status is "public"',
							path: ["install"],
						});
					}
				}
				if (val.video && !val.videoPoster) {
					ctx.addIssue({
						code: "custom",
						message:
							"videoPoster is required when video is set (click-to-play contract)",
						path: ["videoPoster"],
					});
				}
			}),
});

export const collections = { projects };
```

Note: `download`/`downloadWindows` are gone — the downloads module is the only carrier.

- [ ] **Step 2: Write `src/lib/flagships.ts`**

```ts
import { getCollection, type CollectionEntry } from "astro:content";

export const FLAGSHIP_IDS = ["ai-14all", "ai-xavier", "ai-samantha"] as const;
export type FlagshipId = (typeof FLAGSHIP_IDS)[number];

export const AVAILABILITY_VALUES = ["shipping", "coming soon", "early access"] as const;
export type Availability = (typeof AVAILABILITY_VALUES)[number];

type Project = CollectionEntry<"projects">;
export type Flagship = Project & {
	data: Project["data"] & { homepage: NonNullable<Project["data"]["homepage"]> };
};

const EXPECTED_RANK: Record<FlagshipId, number> = {
	"ai-14all": 1,
	"ai-xavier": 2,
	"ai-samantha": 3,
};

const XAVIER_FORBIDDEN = [/apps\.apple\.com/i, /testflight\.apple\.com/i, /itms-services:/i];

function fail(message: string): never {
	throw new Error(`flagship contract: ${message}`);
}

export async function getFlagships(): Promise<Flagship[]> {
	const all = await getCollection("projects");
	const featured = all.filter((p): p is Flagship => p.data.homepage?.featured === true);

	const ids = featured.map((p) => p.id).sort();
	const expected = [...FLAGSHIP_IDS].sort();
	if (JSON.stringify(ids) !== JSON.stringify(expected)) {
		fail(`featured set must be exactly [${expected.join(", ")}], got [${ids.join(", ")}]`);
	}

	for (const p of featured) {
		const id = p.id as FlagshipId;
		const hp = p.data.homepage;
		if (hp.rank !== EXPECTED_RANK[id]) {
			fail(`${id} rank must be ${EXPECTED_RANK[id]}, got ${hp.rank}`);
		}

		const body = p.body ?? "";
		const contradictions = AVAILABILITY_VALUES.filter((v) => v !== hp.availability);
		for (const phrase of contradictions) {
			if (body.toLowerCase().includes(phrase)) {
				fail(`${id} body contains contradicting availability phrase "${phrase}"`);
			}
		}

		if (id === "ai-14all") {
			if (hp.desktopCta.href) {
				fail(
					"ai-14all desktopCta.href must be absent — downloads resolve from src/data/ai14all-downloads.ts",
				);
			}
			if (hp.mobileCta.href !== "/projects/ai-14all#download") {
				fail(
					`ai-14all mobileCta.href must be exactly /projects/ai-14all#download, got ${hp.mobileCta.href}`,
				);
			}
		} else {
			const allowed = (href: string | undefined) =>
				!!href && (href.startsWith("mailto:") || href === `/projects/${id}`);
			if (!allowed(hp.desktopCta.href) || !allowed(hp.mobileCta.href)) {
				fail(`${id} CTA hrefs must be a mailto: or /projects/${id}`);
			}
			if (
				!hp.desktopCta.href?.startsWith("mailto:") ||
				!hp.mobileCta.href.startsWith("mailto:")
			) {
				fail(`${id} primary actions must be prefilled mailto: links`);
			}
		}

		if (id === "ai-xavier") {
			const raw = `${JSON.stringify(p.data)}\n${body}`;
			for (const pattern of XAVIER_FORBIDDEN) {
				if (pattern.test(raw)) {
					fail(`ai-xavier must not reference an install destination (${pattern})`);
				}
			}
		}
	}

	return [...featured].sort((a, b) => a.data.homepage.rank - b.data.homepage.rank);
}
```

- [ ] **Step 3: Wire the probe and drop dead template references**

In `src/pages/index.astro` frontmatter, after the existing imports, add:

```ts
import { getFlagships } from "~/lib/flagships";

// Temporary build-time probe until Task 16 rewrites this page.
const flagshipCount = (await getFlagships()).length;
console.log(`[build] flagship contract ok (${flagshipCount})`);
```

In `src/pages/projects/[...slug].astro`, delete the two `data.download …` / `data.downloadWindows …` JSX blocks inside `.head-actions` (the `<StatusChip …/>` stays; Task 15 rebuilds downloads properly). Also delete the now-unused `.download-cta` CSS rules.

- [ ] **Step 4: Prove the contract bites (internal red check — do NOT commit here)**

Run: `pnpm build`
Expected: FAIL with `flagship contract: featured set must be exactly [ai-14all, ai-samantha, ai-xavier], got []`. `pnpm check` must still PASS (the failure is the runtime invariant, not types). This is the task's TDD red; the working tree stays uncommitted until Step 9's green gate.

- [ ] **Step 5: Create `src/content/projects/ai-xavier.mdx`**

```mdx
---
name: "ai-xavier"
tagline: "your agents in your pocket — presence for ai-14all sessions from your phone"
status: "private"
order: 2
wip: true
features:
    - "watch live agent terminals from your phone"
    - "answer the prompt that is blocking an agent — from anywhere"
    - "steer with a new instruction, or interrupt a session mid-run"
    - "keep authority at home — your phone extends your reach; your desktop stays in charge"
homepage:
    featured: true
    rank: 2
    role: "presence"
    posture: "in your pocket"
    availability: "coming soon"
    headline: "the agent needs you. you left the desk."
    summary: "watch, answer, steer, or interrupt — from your phone."
    desktopCta:
        label: "get notified"
        href: "mailto:vu.phan.se@gmail.com?subject=ai-xavier%20interest"
    mobileCta:
        label: "get notified"
        href: "mailto:vu.phan.se@gmail.com?subject=ai-xavier%20interest"
---

import Features from "~/components/Features.astro";

**Coming soon.** ai-xavier is running against real sessions, but there is no public build yet.
[email to get notified](mailto:vu.phan.se@gmail.com?subject=ai-xavier%20interest) when one is ready.

## what it does

ai-xavier puts your running agents in your pocket. it pairs with ai-14all on your desktop and
mirrors live sessions to your phone: watch a terminal as it scrolls, answer the question that is
blocking an agent, steer with a new instruction, or interrupt a run that went sideways.

execution and authority stay on the desktop. the phone extends your presence — not your computer.

## why

agents do the work; you make the calls. the calls don't always arrive while you're in the chair.
xavier means a blocked agent waits minutes for an answer, not hours for your return.

<Features list={frontmatter.features} />
```

- [ ] **Step 6: Replace `src/content/projects/ai-samantha.mdx` entirely**

```mdx
---
name: "ai-samantha"
tagline: "ambient voice supervision for your coding agents"
status: "private"
order: 5
wip: true
video: "/ai-samantha/hero-demo.mp4"
videoPoster: "/ai-samantha/hero-demo-poster.jpg"
features:
    - "supervise live ai-14all sessions — ask what's happening, hear who needs you"
    - "keep every word on your machine — speech recognition and voice synthesis run fully locally"
    - "hold a real conversation through the model providers you already use"
    - "summon her from the menu bar with a wake word — no window switching"
    - "remember the recent thread across sessions, so follow-ups just work"
homepage:
    featured: true
    rank: 3
    role: "supervision"
    posture: "out loud"
    availability: "early access"
    headline: "ask what's happening. she has been watching."
    summary: "two sessions are quiet. one needs your decision — said out loud."
    desktopCta:
        label: "request early access"
        href: "mailto:vu.phan.se@gmail.com?subject=ai-samantha%20early%20access"
    mobileCta:
        label: "request early access"
        href: "mailto:vu.phan.se@gmail.com?subject=ai-samantha%20early%20access"
---

import Features from "~/components/Features.astro";

**Early access.** samantha runs here every day as the ambient supervisor for ai-14all sessions.
[email to try an early build](mailto:vu.phan.se@gmail.com?subject=ai-samantha%20early%20access).

## what it does

ai-samantha is the voice that has been watching with you. she supervises live ai-14all sessions,
so you can ask what's happening without opening another screen — "two sessions are quiet. one
needs your decision."

speech recognition and voice synthesis run fully on your machine. the intelligence behind the
answers uses your configured model providers.

## why

sometimes you want status without a screen at all. samantha is the always-on voice surface for
the rest of the ecosystem — supervision you can talk to.

<Features list={frontmatter.features} />
```

- [ ] **Step 7: Edit `src/content/projects/ai-14all.mdx`**

In the frontmatter: delete the `download:` and `downloadWindows:` lines; add `videoPoster: "/ai-14all/hero-demo-poster.jpg"` after `video:`; and append the `homepage` block before the closing `---`:

```yaml
homepage:
    featured: true
    rank: 1
    role: "control"
    posture: "at your desk"
    availability: "shipping"
    headline: "parallel agents. one place to stay oriented."
    summary: "see who is working, who is ready, and who needs you."
    desktopCta:
        label: "download ai-14all"
    mobileCta:
        label: "get ai-14all"
        href: "/projects/ai-14all#download"
```

Also replace the entire `features` list — the current bullets are noun-led and implementation-heavy ("session-per-worktree isolation", "monaco-powered", "notional usage-cost telemetry"), which violates AGENTS.md's verb-led, value-flow rule — with:

```yaml
features:
    - "run agents in parallel — each gets its own branch, worktree, and terminal, so they never collide"
    - "see who needs you at a glance — the sidebar shows which agent is waiting and what task it was given"
    - "review inline — highlight a line, leave a comment, the agent picks it up and fixes in place"
    - "browse and verify without leaving — file view, diff review, and jump-to-symbol built in"
    - "compose the ecosystem — ai-cortex remembers your codebase, ai-whisper runs autonomous workflows"
    - "track what agents cost — estimated per-session token and spend telemetry"
```

In the body: delete the entire `## download` section (the "Latest stable release" line, the three
asset bullets, the auto-update blockquote, and the repo/changelog/known-issues list). In its place
put a version-free links list (the download UI returns in Task 15, rendered from the module):

```md
## more

- [changelog](https://github.com/ai-creed/ai-14all/blob/master/CHANGELOG.md)
- [known issues](https://github.com/ai-creed/ai-14all/blob/master/KNOWN-ISSUES.md)
```

Leave `## requirements` and `## known limits` as they are, and leave the inline-review `<video>` untouched (Task 5 converts it).

- [ ] **Step 8: Green verification (the task's single gate)**

Run: `pnpm check && pnpm lint && pnpm build`
Expected: all PASS, with `[build] flagship contract ok (3)` in the log. Then confirm the LOADER still bites (the empty-set red in Step 4 already exercised it once): temporarily change ai-xavier's `rank: 2` to `rank: 3`, run `pnpm build`, expect FAIL with `flagship contract: ai-xavier rank must be 2, got 3`; revert the line. (A `featured: false` mutation would fail earlier, at the zod `z.literal(true)` schema layer — valid, but it would not prove the loader.)

Run: `grep -rn "releases/download" src/content && echo LEAK || echo clean`
Expected: `clean`.

- [ ] **Step 9: Commit (green)**

```bash
git add src/content.config.ts src/lib/flagships.ts src/pages/index.astro "src/pages/projects/[...slug].astro" src/content/projects
git commit -m "feat(flagships): homepage contract, invariant loader, and flagship content"
```

### Task 5: Click-to-play media everywhere

**Files:**

- Modify: `src/pages/projects/[...slug].astro`
- Modify: `src/content/projects/ai-14all.mdx` (inline review video)
- Modify: `src/content/projects/ai-whisper.mdx` (workflow video)

**Interfaces:**

- Consumes: `videoPoster` frontmatter (Task 4 schema), poster files (Task 3).
- Produces: zero `autoplay` attributes anywhere in `src/`; the exact `<video … preload="none" controls playsinline>` shape `check:media` (Task 17) asserts.

- [ ] **Step 1: Convert the template video in `[...slug].astro`**

Replace the `data.video && (…)` block with:

```astro
{
	data.video && (
		<div class="demo">
			<video src={data.video} poster={data.videoPoster} preload="none" controls playsinline />
		</div>
	)
}
```

- [ ] **Step 2: Convert the inline video in `ai-14all.mdx`**

In the `## instant code review` section, replace the `<video …/>` element (keep its wrapper div) with:

```html
<video
	src="/ai-14all/inline-review-demo.mp4"
	poster="/ai-14all/inline-review-demo-poster.jpg"
	preload="none"
	controls
	playsinline
	style="display: block; width: 100%; height: auto;"
/>
```

- [ ] **Step 3: Convert the video in `ai-whisper.mdx`**

In the `## see it run` section, replace the `<video …/>` element (keep its wrapper div) with:

```html
<video
	src="/ai-whisper/workflow-demo.mp4"
	poster="/ai-whisper/workflow-demo-poster.jpg"
	preload="none"
	controls
	playsinline
	style="display: block; width: 100%; height: auto;"
/>
```

- [ ] **Step 4: Verify and commit**

Run: `pnpm build && grep -rn "autoplay" src/ && echo AUTOPLAY-LEAK || echo clean`
Expected: build passes; `clean`. Spot-check `pnpm preview`: `/projects/ai-whisper/` shows the poster, no network request for the mp4 until you press play (DevTools network tab).

```bash
git add "src/pages/projects/[...slug].astro" src/content/projects/ai-14all.mdx src/content/projects/ai-whisper.mdx
git commit -m "fix(media): click-to-play posters everywhere, no autoplay"
```

---

### Task 6: Base.astro — skip link, main landmark, slots, per-page OG

**Files:**

- Modify: `src/layouts/Base.astro`

**Interfaces:**

- Consumes: `.skip-link` CSS (Task 1).
- Produces: `Props = { title: string; description?: string; wide?: boolean; ogImage?: string }` (ogImage defaults `"/og.png"`); named slots `header` and `footer` defaulting to the existing `Header`/`Footer`; `<main id="main">`. Task 16 relies on all four.

- [ ] **Step 1: Rewrite the frontmatter and body of `Base.astro`**

```astro
---
import "~/styles/global.css";
import Header from "~/components/Header.astro";
import Footer from "~/components/Footer.astro";

interface Props {
	title: string;
	description?: string;
	wide?: boolean;
	ogImage?: string;
}

const {
	title,
	description = "Local-first AI dev tooling.",
	wide = false,
	ogImage = "/og.png",
} = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).toString();
const ogImageUrl = new URL(ogImage, Astro.site).toString();
---
```

Keep the `<head>` exactly as it is, but render `content={ogImageUrl}` for both `og:image` and `twitter:image`. Replace the `<body>` with:

```astro
<body class:list={[{ wide }]}>
	<a class="skip-link" href="#main">skip to content</a>
	<slot name="header"><Header /></slot>
	<main id="main" class="site-main">
		<slot />
	</main>
	<slot name="footer"><Footer /></slot>
</body>
```

- [ ] **Step 2: Verify and commit**

Run: `pnpm check && pnpm build`
Expected: pass. `grep -c 'skip-link' dist/projects/ai-whisper/index.html` prints `1` (every page gets it); Tab on any page focuses "skip to content" first.

```bash
git add src/layouts/Base.astro
git commit -m "feat(layout): skip link, main landmark, header/footer slots, per-page og image"
```

---

### Task 7: LandingHeader and LandingFooter

**Files:**

- Create: `src/components/LandingHeader.astro`
- Create: `src/components/LandingFooter.astro`

**Interfaces:**

- Consumes: `AI14ALL_DOWNLOADS.releasePageUrl` (Task 2), `SITE_GITHUB_URL` / `SITE_CONTACT_EMAIL` from `~/consts`, tokens (Task 1).
- Produces: no props on either component. Anchor targets they link to — `#system`, `#products`, `#north-star`, `#creed` — are produced by Tasks 9, 11, 12, and 16. Both components use the shared 899 px CTA breakpoint. No Discord server exists, so "community" points at the GitHub org (the spec's "Discord/community" secondary; do not invent a Discord URL).

- [ ] **Step 1: Write `src/components/LandingHeader.astro`**

```astro
---
import { AI14ALL_DOWNLOADS } from "~/data/ai14all-downloads";
---

<header class="lh">
	<div class="container row">
		<a class="brand" href="/"><span class="dot">●</span><span>ai-creed</span></a>
		<nav class="nav-desktop" aria-label="primary">
			<a href="#system">the system</a>
			<a href="#products">products</a>
			<a href="#north-star">north star</a>
			<a href="#creed">creed</a>
			<a class="cta" href={AI14ALL_DOWNLOADS.releasePageUrl}>download ai-14all</a>
		</nav>
		<details class="nav-mobile">
			<summary>menu</summary>
			<nav aria-label="primary">
				<a href="#system">the system</a>
				<a href="#products">products</a>
				<a href="#north-star">north star</a>
				<a href="#creed">creed</a>
				<a class="cta" href="/projects/ai-14all#download">get ai-14all</a>
			</nav>
		</details>
	</div>
</header>

<style>
	.lh {
		border-bottom: 1px solid var(--border);
		padding: var(--s-3) 0;
		font-size: var(--fs-sm);
		position: relative;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
	}
	.brand {
		display: inline-flex;
		gap: var(--s-2);
		align-items: center;
		border: none;
		color: var(--fg);
		padding: var(--s-3) 0; /* 44px target */
	}
	.brand:hover {
		color: var(--accent);
	}
	.dot {
		color: var(--accent);
	}
	.nav-desktop {
		display: inline-flex;
		gap: var(--s-4);
		align-items: center;
	}
	.nav-desktop a {
		border: none;
		color: var(--fg-dim);
		padding: var(--s-3) var(--s-1); /* 44px target */
	}
	.nav-desktop a:hover {
		color: var(--accent);
	}
	a.cta {
		background: var(--accent);
		color: var(--on-accent);
		border-radius: var(--radius);
		padding: var(--s-3) var(--s-4); /* 44px target */
		font-weight: 600;
	}
	a.cta:hover {
		background: var(--fg);
		color: var(--bg);
	}
	.nav-mobile {
		display: none;
	}
	.nav-mobile summary {
		cursor: pointer;
		list-style: none;
		color: var(--fg-dim);
		padding: var(--s-3);
		margin: calc(-1 * var(--s-3));
		min-height: 44px;
		min-width: 44px;
		display: inline-flex;
		align-items: center;
	}
	.nav-mobile[open] summary {
		color: var(--accent);
	}
	.nav-mobile nav {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		z-index: 10;
		display: flex;
		flex-direction: column;
		background: var(--bg-raised);
		border-bottom: 1px solid var(--border);
		padding: var(--s-2) var(--s-4) var(--s-4);
	}
	.nav-mobile nav a {
		border: none;
		color: var(--fg);
		padding: var(--s-3) 0; /* 44px rows */
	}
	.nav-mobile nav a.cta {
		margin-top: var(--s-2);
		text-align: center;
		padding: var(--s-3);
	}
	/* the shared 899px CTA breakpoint — must match hero, chapters, and closing */
	@media (max-width: 899px) {
		.nav-desktop {
			display: none;
		}
		.nav-mobile {
			display: block;
		}
	}
</style>
```

- [ ] **Step 2: Write `src/components/LandingFooter.astro`**

```astro
---
import { SITE_GITHUB_URL, SITE_CONTACT_EMAIL } from "~/consts";
---

<footer class="lf">
	<div class="container cols">
		<nav class="col" aria-label="flagships">
			<h2 class="col-h">the system</h2>
			<a href="/projects/ai-14all">ai-14all — control</a>
			<a href="/projects/ai-xavier">ai-xavier — presence</a>
			<a href="/projects/ai-samantha">ai-samantha — supervision</a>
		</nav>
		<nav class="col" aria-label="engine room">
			<h2 class="col-h">engine room</h2>
			<a href="/projects/ai-whisper">ai-whisper</a>
			<a href="/projects/ai-cortex">ai-cortex</a>
			<a href="/projects/ai-ezio">ai-ezio</a>
			<a href="/projects/ai-pref-nsync">ai-pref-nsync</a>
		</nav>
		<nav class="col" aria-label="elsewhere">
			<h2 class="col-h">elsewhere</h2>
			<a href={SITE_GITHUB_URL}>github — community</a>
			<a href="/bio">bio</a>
			<a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
		</nav>
	</div>
	<div class="container legal">
		<p class="subtitle">
			ai-creed · built by Vu Phan and his friends · source-available · 2026
		</p>
	</div>
</footer>

<style>
	.lf {
		border-top: 1px solid var(--border);
		padding: var(--s-8) 0 var(--s-6);
		font-size: var(--fs-sm);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s-6);
	}
	.col {
		display: flex;
		flex-direction: column;
	}
	.col-h {
		font-size: var(--fs-xs);
		font-weight: 600;
		color: var(--fg-muted);
		letter-spacing: 0.06em;
		margin-bottom: var(--s-2);
	}
	.col a {
		border: none;
		color: var(--fg-dim);
		min-height: 44px;
		min-width: 44px;
		display: inline-flex;
		align-items: center;
	}
	.col a:hover {
		color: var(--accent);
	}
	.legal {
		margin-top: var(--s-8);
		font-size: var(--fs-xs);
	}
	@media (max-width: 639px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass (components are not rendered yet; Task 16 mounts them).

```bash
git add src/components/LandingHeader.astro src/components/LandingFooter.astro
git commit -m "feat(landing): header and footer chrome"
```

### Task 8: Product visuals — Ai14allVisual, XavierVisual, SamanthaVisual

Pure HTML/CSS product frames. The ONLY animation on the site is `Ai14allVisual`'s breathing needs-you indicator — the dot stays status-gold, but the animated pulse itself is coral, the spec's single attention accent. Every state is text + color, never color alone.

**Files:**

- Create: `src/components/Ai14allVisual.astro`
- Create: `src/components/XavierVisual.astro`
- Create: `src/components/SamanthaVisual.astro`

**Interfaces:**

- Consumes: `--tint-*`, `--status-*`, `--accent` tokens (Task 1).
- Produces: each component takes `interface Props { variant?: "hero" | "chapter" }` (default `"chapter"`); the root element carries `class:list={["root", variant]}` so the hero can scale them down. Tasks 9, 10, and 16 mount them.

- [ ] **Step 1: Write `src/components/Ai14allVisual.astro`**

```astro
---
interface Props {
	variant?: "hero" | "chapter";
}
const { variant = "chapter" } = Astro.props;
---

<div
	class:list={["root", variant]}
	role="img"
	aria-label="ai-14all session list: one agent working, one ready for review, one waiting on a decision"
>
	<div class="bar">
		<span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span><span
			class="title">ai-14all — worktrees</span
		>
	</div>
	<ul class="sessions">
		<li>
			<span class="dot idle"></span><span class="name">fix-payments-retry</span><span
				class="state s-idle">working · quiet</span
			>
		</li>
		<li>
			<span class="dot done"></span><span class="name">migrate-config-schema</span><span
				class="state s-done">ready · tests passed</span
			>
		</li>
		<li class="needs">
			<span class="dot waiting breath"></span><span class="name">extract-audit-log</span><span
				class="state s-wait">waiting · needs a decision</span
			>
		</li>
	</ul>
	<div class="review">review: 2 inline comments → agent fixing in place</div>
</div>

<style>
	.root {
		background: rgba(var(--tint-14all), 0.06);
		border: 1px solid rgba(var(--tint-14all), 0.22);
		border-radius: var(--radius); /* square geometry */
		font-family: var(--font-mono);
		font-size: var(--fs-sm);
		overflow: hidden;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-bottom: 1px solid rgba(var(--tint-14all), 0.22);
		color: var(--fg-muted);
		font-size: var(--fs-xs);
	}
	.win-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--border);
	}
	.title {
		margin-left: var(--s-2);
	}
	.sessions {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.sessions li {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3);
		border-bottom: 1px solid rgba(var(--tint-14all), 0.12);
	}
	.sessions li.needs {
		background: rgba(var(--tint-14all), 0.08);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.dot.idle {
		background: var(--status-idle);
	}
	.dot.done {
		background: var(--status-done);
	}
	.dot.waiting {
		background: var(--status-waiting);
	}
	/* the single attention pulse: dot stays status-gold, the breathing glow is coral (spec §4.1) */
	.breath {
		animation: breathe 3.2s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(255, 129, 99, 0);
			opacity: 0.65;
		}
		50% {
			box-shadow: 0 0 0 6px rgba(255, 129, 99, 0.22);
			opacity: 1;
		}
	}
	.name {
		color: var(--fg);
	}
	.state {
		margin-left: auto;
		font-size: var(--fs-xs);
	}
	.s-idle {
		color: var(--status-idle);
	}
	.s-done {
		color: var(--status-done);
	}
	.s-wait {
		color: var(--status-waiting);
	}
	.review {
		padding: var(--s-2) var(--s-3);
		color: var(--fg-dim);
		font-size: var(--fs-xs);
	}
	.root.hero {
		font-size: var(--fs-xs);
	}
	.root.hero .sessions li {
		padding: var(--s-2) var(--s-3);
	}
	.root.hero .review {
		display: none;
	}
</style>
```

- [ ] **Step 2: Write `src/components/XavierVisual.astro`**

```astro
---
interface Props {
	variant?: "hero" | "chapter";
}
const { variant = "chapter" } = Astro.props;
---

<div
	class:list={["root", variant]}
	role="img"
	aria-label="ai-xavier on a phone: a live session, an agent question, and answer, wait, or interrupt actions"
>
	<div class="notch"></div>
	<div class="session">
		<span class="live">● live</span>
		<span class="sname">ai-14all · extract-audit-log</span>
	</div>
	<p class="ask">
		agent: the audit table can be truncated or archived before migration — which do you want?
	</p>
	<div class="acts">
		<span class="act primary">answer</span>
		<span class="act">wait</span>
		<span class="act">interrupt</span>
	</div>
	<p class="note">runs on your desktop · phone is presence</p>
</div>

<style>
	.root {
		background: rgba(var(--tint-xavier), 0.07);
		border: 1px solid rgba(var(--tint-xavier), 0.25);
		border-radius: 16px; /* rounded device geometry */
		padding: var(--s-4);
		max-width: 260px;
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}
	.notch {
		width: 64px;
		height: 5px;
		border-radius: 3px;
		background: rgba(var(--tint-xavier), 0.35);
		margin: 0 auto;
	}
	.session {
		display: flex;
		gap: var(--s-2);
		align-items: center;
		color: var(--fg-dim);
	}
	.live {
		color: var(--status-done);
	}
	.sname {
		color: var(--fg);
	}
	.ask {
		background: var(--bg-raised);
		border: 1px solid rgba(var(--tint-xavier), 0.25);
		border-radius: 10px;
		padding: var(--s-3);
		color: var(--fg);
		line-height: 1.5;
	}
	.acts {
		display: flex;
		gap: var(--s-2);
	}
	.act {
		border: 1px solid rgba(var(--tint-xavier), 0.4);
		border-radius: 999px;
		padding: var(--s-1) var(--s-3);
		color: var(--fg);
	}
	.act.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}
	.note {
		color: var(--fg-muted);
		text-align: center;
	}
	.root.hero {
		max-width: 200px;
		padding: var(--s-3);
	}
	.root.hero .note {
		display: none;
	}
</style>
```

- [ ] **Step 3: Write `src/components/SamanthaVisual.astro`**

```astro
---
interface Props {
	variant?: "hero" | "chapter";
}
const { variant = "chapter" } = Astro.props;
---

<div
	class:list={["root", variant]}
	role="img"
	aria-label="ai-samantha's orb speaking a status: two sessions are quiet, one needs your decision"
>
	<div class="orb"></div>
	<div class="wave" aria-hidden="true">
		<i></i><i></i><i></i><i></i><i></i><i></i><i></i>
	</div>
	<p class="line">"two sessions are quiet. one needs your decision."</p>
</div>

<style>
	.root {
		background: rgba(var(--tint-samantha), 0.08);
		border: 1px solid rgba(var(--tint-samantha), 0.26);
		border-radius: var(--radius);
		padding: var(--s-6) var(--s-4);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--s-4);
		font-family: var(--font-mono);
	}
	.orb {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: radial-gradient(
			circle at 35% 30%,
			rgba(var(--tint-samantha), 0.9),
			rgba(var(--tint-samantha), 0.25) 60%,
			transparent 75%
		);
		box-shadow: 0 0 32px 4px rgba(var(--tint-samantha), 0.28); /* soft glow, static */
	}
	.wave {
		display: flex;
		gap: 3px;
		align-items: flex-end;
		height: 16px;
	}
	.wave i {
		width: 3px;
		background: rgba(var(--tint-samantha), 0.8);
		border-radius: 1px;
	}
	.wave i:nth-child(1) {
		height: 5px;
	}
	.wave i:nth-child(2) {
		height: 10px;
	}
	.wave i:nth-child(3) {
		height: 16px;
	}
	.wave i:nth-child(4) {
		height: 8px;
	}
	.wave i:nth-child(5) {
		height: 13px;
	}
	.wave i:nth-child(6) {
		height: 6px;
	}
	.wave i:nth-child(7) {
		height: 11px;
	}
	.line {
		color: var(--fg);
		font-size: var(--fs-sm);
		text-align: center;
		max-width: 30ch;
	}
	.root.hero {
		padding: var(--s-4) var(--s-3);
		gap: var(--s-3);
	}
	.root.hero .orb {
		width: 48px;
		height: 48px;
	}
	.root.hero .line {
		font-size: var(--fs-xs);
	}
</style>
```

- [ ] **Step 4: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass. (Rendered checks come with the hero/chapters.)

```bash
git add src/components/Ai14allVisual.astro src/components/XavierVisual.astro src/components/SamanthaVisual.astro
git commit -m "feat(landing): css product visuals for the three flagships"
```

### Task 9: EcosystemHero

**Files:**

- Create: `src/components/EcosystemHero.astro`

**Interfaces:**

- Consumes: `Flagship` + `getFlagships()` ordering (Task 4), the three visuals (Task 8), `AI14ALL_DOWNLOADS.releasePageUrl` (Task 2).
- Produces: `interface Props { flagships: Flagship[] }` (rank-sorted). Section id `#system`. The proof line derives from `flagships[n].data.homepage.availability` — never hand-written.

- [ ] **Step 1: Write `src/components/EcosystemHero.astro`**

Hero copy is spec-verbatim. CTAs: desktop primary → release page; mobile primary → `/projects/ai-14all#download`; shared secondary → `#north-star`. Mobile order: copy + CTAs first, trio after (source order does this naturally).

```astro
---
import Ai14allVisual from "~/components/Ai14allVisual.astro";
import XavierVisual from "~/components/XavierVisual.astro";
import SamanthaVisual from "~/components/SamanthaVisual.astro";
import { AI14ALL_DOWNLOADS } from "~/data/ai14all-downloads";
import type { Flagship } from "~/lib/flagships";

interface Props {
	flagships: Flagship[];
}
const { flagships } = Astro.props;

const proof = flagships
	.map((f, i) => {
		const name = i === 0 ? f.id : f.id.replace(/^ai-/, "");
		const a = f.data.homepage.availability;
		return `${name} ${a === "shipping" ? "shipping now" : a}`;
	})
	.join(" · ");
---

<section id="system" class="hero container">
	<div class="copy">
		<h1 class="display">your coding agents. under your command.</h1>
		<p class="sub">
			one system keeps you in the loop—from parallel work at your desk, to decisions from your
			phone, to a voice that has been watching with you.
		</p>
		<div class="ctas">
			<a class="btn primary cta-desktop" href={AI14ALL_DOWNLOADS.releasePageUrl}
				>download ai-14all</a
			>
			<a class="btn primary cta-mobile" href="/projects/ai-14all#download">get ai-14all</a>
			<a class="btn ghost" href="#north-star">see the engineering loop</a>
		</div>
		<p class="proof">{proof}</p>
	</div>
	<div class="trio" aria-label="the three products of the system">
		<div class="big"><Ai14allVisual variant="hero" /></div>
		<div class="small"><XavierVisual variant="hero" /><SamanthaVisual variant="hero" /></div>
	</div>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 4fr);
		gap: var(--s-8);
		align-items: center;
		padding-top: var(--s-12);
		padding-bottom: var(--s-12);
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--fs-display);
		line-height: 1.12;
		text-wrap: balance;
	}
	.sub {
		margin-top: var(--s-4);
		color: var(--fg-dim);
		max-width: 52ch;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3);
		margin-top: var(--s-6);
	}
	.btn {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-3) var(--s-4); /* ≥44px */
		font-size: var(--fs-sm);
		font-weight: 600;
	}
	.btn.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}
	.btn.primary:hover {
		background: var(--fg);
		border-color: var(--fg);
		color: var(--bg);
	}
	.btn.ghost {
		color: var(--fg);
	}
	.btn.ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.cta-mobile {
		display: none;
	}
	.proof {
		margin-top: var(--s-4);
		font-size: var(--fs-xs);
		color: var(--fg-muted);
	}
	.trio {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		min-width: 0;
	}
	.small {
		display: flex;
		gap: var(--s-3);
		align-items: stretch;
	}
	.small > :global(*) {
		flex: 1;
		min-width: 0;
	}
	@media (max-width: 899px) {
		.hero {
			grid-template-columns: 1fr;
			padding-top: var(--s-8);
		}
		.cta-desktop {
			display: none;
		}
		.cta-mobile {
			display: inline-block;
		}
		.btn {
			flex: 1;
			text-align: center;
		}
	}
	@media (max-width: 519px) {
		.small {
			flex-direction: column;
		}
	}
</style>
```

- [ ] **Step 2: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass.

```bash
git add src/components/EcosystemHero.astro
git commit -m "feat(landing): ecosystem hero with derived proof line"
```

---

### Task 10: AvailabilityChip + FlagshipChapter

**Files:**

- Create: `src/components/AvailabilityChip.astro`
- Create: `src/components/FlagshipChapter.astro`

**Interfaces:**

- Consumes: `Flagship` + `Availability` (Task 4), `AI14ALL_DOWNLOAD_ASSETS` + `AI14ALL_DOWNLOADS` (Task 2), status tokens (Task 1).
- Produces: `AvailabilityChip` with `interface Props { availability: Availability }` (also used by Task 15); `FlagshipChapter` with `interface Props { flagship: Flagship; id?: string }` — `id` lets the first chapter carry `#products`. The chapter renders the numbered stage label, display headline, summary, a `<slot />` for chapter copy, a `<slot name="visual" />`, and per-flagship actions. Task 16 mounts one per flagship with the matching visual in the slot.

- [ ] **Step 1: Write `src/components/AvailabilityChip.astro`**

Availability uses the status palette (shipping → done-green, coming soon → waiting-gold, early access → ready-blue). Text is always present; color is never the only signal.

```astro
---
import type { Availability } from "~/lib/flagships";

interface Props {
	availability: Availability;
}
const { availability } = Astro.props;
const cls = { shipping: "done", "coming soon": "waiting", "early access": "ready" }[availability];
---

<span class:list={["chip", cls]}>[{availability}]</span>

<style>
	.chip {
		display: inline-block;
		font-size: var(--fs-xs);
		padding: 2px var(--s-2);
		border-radius: var(--radius);
		border: 1px solid;
		line-height: 1.2;
		white-space: nowrap;
	}
	.chip.done {
		color: var(--status-done);
		border-color: var(--status-done);
	}
	.chip.waiting {
		color: var(--status-waiting);
		border-color: var(--status-waiting);
	}
	.chip.ready {
		color: var(--status-ready);
		border-color: var(--status-ready);
	}
</style>
```

- [ ] **Step 2: Write `src/components/FlagshipChapter.astro`**

```astro
---
import AvailabilityChip from "~/components/AvailabilityChip.astro";
import { AI14ALL_DOWNLOADS, AI14ALL_DOWNLOAD_ASSETS } from "~/data/ai14all-downloads";
import type { Flagship } from "~/lib/flagships";

interface Props {
	flagship: Flagship;
	id?: string;
}
const { flagship, id } = Astro.props;
const hp = flagship.data.homepage;
const tintVar = `--tint-${flagship.id.replace(/^ai-/, "")}`;
const detailsHref = `/projects/${flagship.id}`;
---

<section {id} class="chapter" style={`--tint: var(${tintVar})`}>
	<div class="container inner">
		<div class="copy">
			<p class="label">
				<span class="num">0{hp.rank}</span> · {hp.role} · {hp.posture}
				<AvailabilityChip availability={hp.availability} />
			</p>
			<h2 class="display">{hp.headline}</h2>
			<p class="summary">{hp.summary}</p>
			<div class="body"><slot /></div>
			<div class="actions">
				{
					flagship.id === "ai-14all" ? (
						<>
							{AI14ALL_DOWNLOAD_ASSETS.map((a) => (
								<a class="btn primary cta-desktop" href={a.url}>
									↓ {a.label}
								</a>
							))}
							<a class="btn primary cta-mobile" href={hp.mobileCta.href}>
								view desktop downloads
							</a>
							<a class="btn ghost" href={detailsHref}>
								product details
							</a>
						</>
					) : (
						<>
							<a class="btn primary" href={hp.desktopCta.href}>
								{hp.desktopCta.label}
							</a>
							<a class="btn ghost" href={detailsHref}>
								learn about {flagship.id}
							</a>
						</>
					)
				}
			</div>
			{
				flagship.id === "ai-14all" && (
					<p class="fineprint">
						all versions on the{" "}
						<a href={AI14ALL_DOWNLOADS.releasePageUrl}>releases page</a> ·
						source-available
					</p>
				)
			}
		</div>
		<div class="visual"><slot name="visual" /></div>
	</div>
</section>

<style>
	.chapter {
		background: rgba(var(--tint), 0.04);
		border-top: 1px solid rgba(var(--tint), 0.18);
		padding: var(--s-12) 0;
	}
	.inner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: var(--s-8);
		align-items: center;
	}
	.label {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--fs-xs);
		letter-spacing: 0.06em;
		color: var(--fg-muted);
	}
	.num {
		color: var(--accent);
		font-weight: 600;
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(24px, 3.4vw, 34px);
		line-height: 1.15;
		margin-top: var(--s-3);
		text-wrap: balance;
	}
	.summary {
		margin-top: var(--s-3);
		color: var(--fg-dim);
	}
	.body {
		margin-top: var(--s-4);
		color: var(--fg-dim);
		max-width: 58ch;
	}
	.body :global(p) {
		margin-bottom: var(--s-3);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3);
		margin-top: var(--s-6);
	}
	.btn {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-3) var(--s-4);
		font-size: var(--fs-sm);
		font-weight: 600;
	}
	.btn.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}
	.btn.primary:hover {
		background: var(--fg);
		border-color: var(--fg);
		color: var(--bg);
	}
	.btn.ghost {
		color: var(--fg);
	}
	.btn.ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.cta-mobile {
		display: none;
	}
	.fineprint {
		margin-top: var(--s-3);
		font-size: var(--fs-xs);
		color: var(--fg-muted);
	}
	.visual {
		min-width: 0;
		display: flex;
		justify-content: center;
	}
	@media (max-width: 899px) {
		.inner {
			grid-template-columns: 1fr;
		}
		.visual {
			order: -1;
		} /* visual before copy on mobile (spec §6) */
		.cta-desktop {
			display: none;
		}
		.cta-mobile {
			display: inline-block;
		}
		.btn {
			flex: 1;
			text-align: center;
		}
	}
</style>
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass.

```bash
git add src/components/AvailabilityChip.astro src/components/FlagshipChapter.astro
git commit -m "feat(landing): availability chip and shared flagship chapter with device-true actions"
```

---

### Task 11: AutonomousLoop

**Files:**

- Create: `src/components/AutonomousLoop.astro`

**Interfaces:**

- Consumes: tokens (Task 1).
- Produces: `AutonomousLoop` with no props, section id `#north-star` (mounted in Task 16).

- [ ] **Step 1: Write `src/components/AutonomousLoop.astro`**

Copy is future-tensed for unshipped edges; "shipped today" chips appear only on connections with public product-page evidence (samantha↔14all supervision, 14all↔whisper, 14all↔cortex). ai-xavier spans the loop as the presence band, not a sixth step.

```astro
---
const STEPS = [
	{
		n: "01",
		verb: "frame",
		who: "ai-samantha",
		line: "turns a messy ask into precise, scoped work",
		chip: "early access",
	},
	{
		n: "02",
		verb: "command",
		who: "ai-14all",
		line: "worktrees, sessions, attention, review — the cockpit",
		chip: "shipping",
	},
	{
		n: "03",
		verb: "execute",
		who: "ai-whisper",
		line: "an implementer and a reviewer converge on committed code",
		chip: "shipped today",
	},
	{
		n: "04",
		verb: "remember",
		who: "ai-cortex",
		line: "decisions and gotchas persist across sessions",
		chip: "shipped today",
	},
	{
		n: "05",
		verb: "decide",
		who: "you",
		line: "review the diff, make the calls that matter",
		chip: null,
	},
] as const;
---

<section id="north-star" class="loop container">
	<p class="eyebrow">north star</p>
	<h2 class="display">describe the outcome tonight. return to decisions, not busywork.</h2>
	<ol class="steps">
		{
			STEPS.map((s) => (
				<li class="step">
					<span class="num">{s.n}</span>
					<span class="verb">{s.verb}</span>
					<span class="who">{s.who}</span>
					<span class="line">{s.line}</span>
					{s.chip && <span class="chip">{s.chip}</span>}
				</li>
			))
		}
	</ol>
	<p class="band">
		ai-xavier spans the loop — presence from your pocket while it runs. <span class="chip"
			>coming soon</span
		>
	</p>
	<p class="honest">
		the pieces above ship today and already talk to each other — samantha supervises live 14all
		sessions, 14all drives whisper runs and remembers through cortex. the unattended night —
		tell it, go to bed, wake up to reviewed work — is where this system is headed, not something
		it claims today.
	</p>
</section>

<style>
	.loop {
		padding: var(--s-12) var(--s-4);
	}
	.eyebrow {
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--accent);
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(24px, 3.4vw, 34px);
		line-height: 1.15;
		margin-top: var(--s-3);
		max-width: 24ch;
		text-wrap: balance;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: var(--s-8) 0 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: var(--s-3);
	}
	.step {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-4);
		background: var(--bg-raised);
		font-size: var(--fs-sm);
	}
	.num {
		color: var(--accent);
		font-weight: 600;
		font-size: var(--fs-xs);
	}
	.verb {
		font-weight: 600;
	}
	.who {
		color: var(--fg-dim);
		font-size: var(--fs-xs);
	}
	.line {
		color: var(--fg-dim);
		margin-top: var(--s-2);
	}
	.chip {
		margin-top: var(--s-2);
		align-self: flex-start;
		font-size: var(--fs-xs);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1px var(--s-2);
		color: var(--fg-muted);
	}
	.band {
		margin-top: var(--s-4);
		padding: var(--s-3) var(--s-4);
		border: 1px dashed rgba(var(--tint-xavier), 0.5);
		border-radius: var(--radius);
		color: var(--fg-dim);
		font-size: var(--fs-sm);
	}
	.band .chip {
		margin: 0 0 0 var(--s-2);
	}
	.honest {
		margin-top: var(--s-6);
		color: var(--fg-muted);
		font-size: var(--fs-sm);
		max-width: 68ch;
	}
	@media (max-width: 899px) {
		.steps {
			grid-template-columns: 1fr;
		} /* vertical sequence on mobile */
	}
</style>
```

- [ ] **Step 2: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass.

```bash
git add src/components/AutonomousLoop.astro
git commit -m "feat(landing): honest autonomous-loop chapter"
```

### Task 12: RecentlyShipped + Creed

**Files:**

- Create: `src/components/RecentlyShipped.astro`
- Create: `src/components/Creed.astro`

**Interfaces:**

- Consumes: `RECENTLY_SHIPPED` (Task 2), display font tokens (Task 1).
- Produces: both components take no props. `Creed` owns section id `#creed`. Mounted in Task 16.

- [ ] **Step 1: Write `src/components/RecentlyShipped.astro`**

```astro
---
import { RECENTLY_SHIPPED } from "~/data/recently-shipped";
---

<section class="shipped container" aria-label="recently shipped">
	<h2 class="h"># recently shipped</h2>
	<ul class="rows">
		{
			RECENTLY_SHIPPED.map((e) => (
				<li class="row">
					<span class="date">{e.date}</span>
					<span class="proj">{e.project}</span>
					<a class="sum" href={e.href}>
						{e.summary}
					</a>
				</li>
			))
		}
	</ul>
</section>

<style>
	.shipped {
		padding: var(--s-8) var(--s-4);
	}
	.h {
		color: var(--fg-dim);
		font-weight: 500;
		font-size: var(--fs-h3);
		margin-bottom: var(--s-4);
	}
	.rows {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.row {
		display: flex;
		gap: var(--s-4);
		align-items: baseline;
		padding: var(--s-2) 0;
		border-bottom: 1px solid var(--border);
		font-size: var(--fs-sm);
	}
	.date {
		color: var(--fg-muted);
		font-variant-numeric: tabular-nums;
		flex: none;
	}
	.proj {
		color: var(--accent);
		flex: none;
		min-width: 9ch;
	}
	.sum {
		color: var(--fg-dim);
		border: none;
		min-height: 44px;
		min-width: 44px;
		display: inline-flex;
		align-items: center;
	}
	.sum:hover {
		color: var(--accent);
	}
	@media (max-width: 519px) {
		.row {
			flex-wrap: wrap;
			gap: var(--s-2);
		}
	}
</style>
```

- [ ] **Step 2: Write `src/components/Creed.astro`** (copy is spec-verbatim)

```astro
---
const TENETS = [
	"your machine remains the authority",
	"you stay the gatekeeper at meaningful decisions",
	"the pieces compose without becoming a black box",
	"code and systems you can read end-to-end",
];
---

<section id="creed" class="creed container">
	<p class="eyebrow">the creed</p>
	<h2 class="display">the agent works for you. never the other way around.</h2>
	<ol class="tenets">
		{
			TENETS.map((t, i) => (
				<li>
					<span class="num">0{i + 1}</span>
					<span class="t">{t}</span>
				</li>
			))
		}
	</ol>
</section>

<style>
	.creed {
		padding: var(--s-12) var(--s-4);
	}
	.eyebrow {
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--accent);
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(26px, 4vw, 40px);
		line-height: 1.15;
		margin-top: var(--s-3);
		max-width: 22ch;
		text-wrap: balance;
	}
	.tenets {
		list-style: none;
		padding: 0;
		margin: var(--s-8) 0 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--s-4);
	}
	.tenets li {
		display: flex;
		gap: var(--s-3);
		align-items: baseline;
		border-top: 1px solid var(--border);
		padding-top: var(--s-3);
	}
	.num {
		color: var(--accent);
		font-weight: 600;
		font-size: var(--fs-xs);
	}
	.t {
		color: var(--fg);
	}
	@media (max-width: 519px) {
		.tenets {
			grid-template-columns: 1fr;
		} /* one column at 320px (spec §6) */
	}
</style>
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass.

```bash
git add src/components/RecentlyShipped.astro src/components/Creed.astro
git commit -m "feat(landing): recently-shipped proof strip and creed chapter"
```

---

### Task 13: EngineRoom

**Files:**

- Create: `src/components/EngineRoom.astro`

**Interfaces:**

- Consumes: `getCollection` (astro:content), `StatusChip` (existing, retinted in Task 1).
- Produces: no props; fetches the collection itself, filters out `data.homepage?.featured`, sorts archived last then by `order`. Mounted in Task 16. The ai-ezio card links to `/projects/ai-ezio` (the required first meaningful ezio link).

- [ ] **Step 1: Write `src/components/EngineRoom.astro`**

```astro
---
import { getCollection } from "astro:content";
import StatusChip from "~/components/StatusChip.astro";

const supporting = (await getCollection("projects"))
	.filter((p) => !p.data.homepage?.featured)
	.sort((a, b) => {
		const arch = Number(a.data.status === "archived") - Number(b.data.status === "archived");
		return arch !== 0 ? arch : a.data.order - b.data.order;
	});
---

<section class="engine container" aria-label="engine room">
	<h2 class="h"># engine room</h2>
	<p class="sub">the supporting tools the system runs on.</p>
	<ul class="grid">
		{
			supporting.map((p) => (
				<li class="card">
					<div class="top">
						<a class="name" href={`/projects/${p.id}`}>
							{p.data.name}
						</a>
						<StatusChip status={p.data.status} />
					</div>
					<p class="job">{p.data.tagline}</p>
				</li>
			))
		}
	</ul>
</section>

<style>
	.engine {
		padding: var(--s-8) var(--s-4);
	}
	.h {
		color: var(--fg-dim);
		font-weight: 500;
		font-size: var(--fs-h3);
	}
	.sub {
		color: var(--fg-muted);
		font-size: var(--fs-sm);
		margin-top: var(--s-2);
	}
	.grid {
		list-style: none;
		padding: 0;
		margin: var(--s-4) 0 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--s-3);
	}
	.card {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-4);
		background: var(--bg-raised);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--s-3);
	}
	.name {
		border: none;
		font-weight: 600;
		min-height: 44px;
		min-width: 44px;
		display: inline-flex;
		align-items: center;
	}
	.name:hover {
		color: var(--accent);
	}
	.job {
		margin-top: var(--s-2);
		color: var(--fg-dim);
		font-size: var(--fs-sm);
	}
	@media (max-width: 519px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
```

- [ ] **Step 2: Verify and commit**

Run: `pnpm check && pnpm lint && pnpm format:check`
Expected: pass.

```bash
git add src/components/EngineRoom.astro
git commit -m "feat(landing): collection-derived engine room, archived last"
```

---

### Task 14: Homepage OG asset

**Files:**

- Create: `src/assets/og-home.svg`
- Create: `scripts/generate-og.mjs`
- Create (generated, committed): `public/og-home.png`
- Modify: `package.json` (script `"og": "node scripts/generate-og.mjs"`)

**Interfaces:**

- Consumes: `sharp` (already a direct dependency).
- Produces: `/og-home.png` (1200×630) — Task 16 passes it as `ogImage`. No tool count, version, or other stale-prone fact appears in it.

- [ ] **Step 1: Write `src/assets/og-home.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="#0d0d0d" />
	<circle cx="120" cy="120" r="10" fill="#ff8163" />
	<text x="150" y="132" font-family="Menlo, monospace" font-size="34" fill="#e6e6e6">ai-creed</text>
	<text x="118" y="300" font-family="Georgia, serif" font-size="72" font-weight="600" fill="#e6e6e6">your coding agents.</text>
	<text x="118" y="390" font-family="Georgia, serif" font-size="72" font-weight="600" fill="#ff8163">under your command.</text>
	<text x="120" y="500" font-family="Menlo, monospace" font-size="30" fill="#8a8a8a">ai-14all · ai-xavier · ai-samantha</text>
	<text x="120" y="560" font-family="Menlo, monospace" font-size="24" fill="#7d7d7d">ai-creed.dev</text>
</svg>
```

- [ ] **Step 2: Write `scripts/generate-og.mjs`**

```js
// Rasterizes the homepage OG card. Run `pnpm og` after editing src/assets/og-home.svg.
import sharp from "sharp";

await sharp("src/assets/og-home.svg", { density: 150 })
	.resize(1200, 630)
	.png()
	.toFile("public/og-home.png");
console.log("wrote public/og-home.png");
```

- [ ] **Step 3: Add the package script, generate, verify, commit**

Add `"og": "node scripts/generate-og.mjs"` to `package.json` scripts. Then:

Run: `pnpm og && node -e "const s=require('fs').statSync('public/og-home.png'); if(s.size<10000) throw new Error('og too small'); console.log('og ok', s.size)"`
Expected: `og ok <bytes>`. Open the PNG and confirm both headline lines and the trio render legibly.

```bash
git add src/assets/og-home.svg scripts/generate-og.mjs public/og-home.png package.json
git commit -m "feat(meta): homepage og card built around the three-product system"
```

### Task 15: Project pages — availability chip and module-fed download section

Lands BEFORE homepage assembly so `/projects/ai-14all#download` exists the moment any mobile "get ai-14all" link ships (Task 16).

**Files:**

- Modify: `src/pages/projects/[...slug].astro`

**Interfaces:**

- Consumes: `AvailabilityChip` (Task 10), `AI14ALL_DOWNLOADS`/`AI14ALL_DOWNLOAD_ASSETS` (Task 2), `data.homepage` (Task 4).
- Produces: `/projects/ai-14all/` contains `<section id="download">` — the target of every mobile "get ai-14all" route; flagship pages render the same availability label as the homepage from the same frontmatter field; every non-inline link on project pages meets the 44 px target contract.

- [ ] **Step 1: Add imports and render the chip**

In the frontmatter add:

```ts
import AvailabilityChip from "~/components/AvailabilityChip.astro";
import { AI14ALL_DOWNLOADS, AI14ALL_DOWNLOAD_ASSETS } from "~/data/ai14all-downloads";
```

In `.head-actions`, before `<StatusChip …/>`, add:

```astro
{data.homepage && <AvailabilityChip availability={data.homepage.availability} />}
```

- [ ] **Step 2: Render the download section for ai-14all**

Immediately after the `<section class="body"><Content /></section>` block, add:

```astro
{
	project.id === "ai-14all" && (
		<section id="download" class="downloads">
			<h2># download</h2>
			<ul>
				{AI14ALL_DOWNLOAD_ASSETS.map((a) => (
					<li>
						<a href={a.url}>↓ {a.label}</a>
					</li>
				))}
			</ul>
			<p class="all">
				every version on the <a href={AI14ALL_DOWNLOADS.releasePageUrl}>releases page</a> ·
				auto-updates in the background on launch
			</p>
		</section>
	)
}
```

And in the `<style>` block add (the `li a` rule keeps markdown list links — changelog, known issues — at the 44 px target contract):

```css
.downloads {
	margin-top: var(--s-8);
}
.downloads h2 {
	color: var(--fg-dim);
	font-weight: 500;
	font-size: var(--fs-h3);
	margin-bottom: var(--s-3);
}
.downloads ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: var(--s-2);
}
.downloads a {
	border: none;
	color: var(--accent);
	min-height: 44px;
	min-width: 44px;
	display: inline-flex;
	align-items: center;
}
.downloads .all {
	margin-top: var(--s-3);
	font-size: var(--fs-sm);
	color: var(--fg-muted);
}
.body :global(li a) {
	min-height: 44px;
	min-width: 44px;
	display: inline-flex;
	align-items: center;
}
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm build && grep -c 'id="download"' dist/projects/ai-14all/index.html`
Expected: build passes; grep prints `1`. `/projects/ai-samantha/` shows `[early access]` + `[private]` chips; `/projects/ai-xavier/` shows `[coming soon]`; no page shows a version number outside the module-fed URLs; every non-prose link (header, download list, markdown lists) is at least 44 px tall.

```bash
git add "src/pages/projects/[...slug].astro"
git commit -m "feat(projects): availability chips and module-fed download anchor"
```

---

### Task 16: Homepage assembly

**Files:**

- Modify: `src/pages/index.astro` (full replacement)

**Interfaces:**

- Consumes: every component from Tasks 7–13, `getFlagships`/`FlagshipId` (Task 4), `AI14ALL_DOWNLOADS` (Task 2), Base slots + `ogImage` (Task 6), `/og-home.png` (Task 14), and the `/projects/ai-14all#download` anchor (Task 15) that every mobile CTA below routes to.
- Produces: the shipped homepage. The `VISUALS` map is typed `Record<FlagshipId, …>` — the spec's exhaustive flagship→visual guard: removing a flagship or forgetting a visual is a compile error.

- [ ] **Step 1: Replace `src/pages/index.astro` entirely**

Section order is spec §5: hero → chapters 01/02/03 → loop → recently shipped → creed → engine room → closing. The chapter body copy below is claims-vetted; keep it verbatim. The homepage description is spec-verbatim.

```astro
---
import Base from "~/layouts/Base.astro";
import LandingHeader from "~/components/LandingHeader.astro";
import LandingFooter from "~/components/LandingFooter.astro";
import EcosystemHero from "~/components/EcosystemHero.astro";
import FlagshipChapter from "~/components/FlagshipChapter.astro";
import Ai14allVisual from "~/components/Ai14allVisual.astro";
import XavierVisual from "~/components/XavierVisual.astro";
import SamanthaVisual from "~/components/SamanthaVisual.astro";
import AutonomousLoop from "~/components/AutonomousLoop.astro";
import RecentlyShipped from "~/components/RecentlyShipped.astro";
import Creed from "~/components/Creed.astro";
import EngineRoom from "~/components/EngineRoom.astro";
import { AI14ALL_DOWNLOADS } from "~/data/ai14all-downloads";
import { getFlagships, type FlagshipId } from "~/lib/flagships";

const flagships = await getFlagships();

const VISUALS: Record<FlagshipId, typeof Ai14allVisual> = {
	"ai-14all": Ai14allVisual,
	"ai-xavier": XavierVisual,
	"ai-samantha": SamanthaVisual,
};

const CHAPTER_COPY: Record<FlagshipId, string> = {
	"ai-14all":
		"every agent runs in a real worktree with a real terminal. the sidebar shows who is quiet, who is ready, and who needs you — and inline review means you comment on a diff and the agent fixes it in place.",
	"ai-xavier":
		"execution and authority stay on your desktop. your phone is presence: watch live terminals, answer the prompt that is blocking an agent, steer, or interrupt.",
	"ai-samantha":
		"she watches the same sessions you do and answers out loud. speech recognition and voice synthesis run fully on your machine; the intelligence uses your configured model providers.",
};
---

<Base
	title="ai-creed — your coding agents, under your command"
	description="a local-first system for supervising coding agents—from desktop control to mobile presence and ambient voice."
	ogImage="/og-home.png"
	wide
>
	<LandingHeader slot="header" />
	<EcosystemHero flagships={flagships} />

	{
		flagships.map((f, i) => {
			const Visual = VISUALS[f.id as FlagshipId];
			return (
				<FlagshipChapter flagship={f} id={i === 0 ? "products" : undefined}>
					<p>{CHAPTER_COPY[f.id as FlagshipId]}</p>
					<Visual slot="visual" />
				</FlagshipChapter>
			);
		})
	}

	<AutonomousLoop />
	<RecentlyShipped />
	<Creed />
	<EngineRoom />

	<section class="closing container">
		<h2 class="display">run your agents in ai-14all. stay for the loop we're building.</h2>
		<div class="ctas">
			<a class="btn primary cta-desktop" href={AI14ALL_DOWNLOADS.releasePageUrl}
				>download ai-14all</a
			>
			<a class="btn primary cta-mobile" href="/projects/ai-14all#download">get ai-14all</a>
			<a class="btn ghost" href="https://github.com/ai-creed">community — github</a>
		</div>
	</section>

	<LandingFooter slot="footer" />
</Base>

<style>
	.closing {
		padding: var(--s-12) var(--s-4);
		text-align: center;
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(24px, 3.4vw, 34px);
		line-height: 1.15;
		max-width: 26ch;
		margin: 0 auto;
		text-wrap: balance;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-3);
		justify-content: center;
		margin-top: var(--s-6);
	}
	.btn {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-3) var(--s-4);
		font-size: var(--fs-sm);
		font-weight: 600;
	}
	.btn.primary {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}
	.btn.primary:hover {
		background: var(--fg);
		border-color: var(--fg);
		color: var(--bg);
	}
	.btn.ghost {
		color: var(--fg);
	}
	.btn.ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	.cta-mobile {
		display: none;
	}
	@media (max-width: 899px) {
		.cta-desktop {
			display: none;
		}
		.cta-mobile {
			display: inline-block;
		}
		.btn {
			flex: 1;
			text-align: center;
		}
	}
</style>
```

- [ ] **Step 2: Verify**

Run: `pnpm check && pnpm lint && pnpm build && pnpm format:check`
Expected: all pass; the probe log is gone (this file replaced it).

Then prove the exhaustive-visual guard: comment out the `"ai-xavier": XavierVisual,` line, run `pnpm check`, expect a type error on `VISUALS`; restore it.

Manual sweep on `pnpm preview`:

- `/` shows hero (headline in Fraunces), trio visual, coral primary CTA, proof line reading `ai-14all shipping now · xavier coming soon · samantha early access`.
- Chapters appear in order 01/02/03 with room-tinted washes; loop, shipped strip, creed, engine room, closing follow.
- Header anchors `#system`, `#products`, `#north-star`, `#creed` all land; keyboard Tab reaches every CTA with a visible coral ring.
- At 390 px width: menu is a `<details>` disclosure; CTAs are full-width; the primary reads "get ai-14all".

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(landing): assemble the ecosystem homepage"
```

### Task 17: Guards — check:media and check:budget

Both scripts parse built HTML with regexes; that is acceptable because they only ever read this site's own Astro output. Both exit non-zero with a listing on failure.

**Files:**

- Create: `scripts/check-media.mjs`
- Create: `scripts/check-homepage-budget.mjs`
- Modify: `package.json` (scripts `check:media`, `check:budget`)

**Interfaces:**

- Consumes: `dist/` from `pnpm build`.
- Produces: `pnpm check:media` (spec §10 markup guard: every `<video>` has `preload="none"`, `poster`, `controls`, never `autoplay`; same for `<audio>` minus poster) and `pnpm check:budget` (gzip byte budget, favicon-inclusive, largest-srcset-candidate rule, 102,400-byte ceiling, plus two hard gates: any `<script>` tag on the built homepage fails, and any external automatically fetched resource — image, stylesheet, preload, icon, font, or `srcset` candidate — fails rather than being skipped; relative URLs are resolved against their containing document or stylesheet, never dropped; and CSS is traversed recursively, quoted `@import` chains included, so an imported stylesheet's own resources are counted). CI (Task 21) runs both.

- [ ] **Step 1: Write `scripts/check-media.mjs`**

```js
// Markup guard for the click-to-play contract (spec §4.5/§10). Run after `pnpm build`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const pages = [];
(function walk(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p);
		else if (p.endsWith(".html")) pages.push(p);
	}
})("dist");

const errors = [];
for (const page of pages) {
	const html = readFileSync(page, "utf8");
	for (const [tag] of html.matchAll(/<(?:video|audio)\b[^>]*>/gi)) {
		const where = `${page}: ${tag.slice(0, 90)}`;
		if (/\bautoplay\b/i.test(tag)) errors.push(`autoplay forbidden — ${where}`);
		if (!/preload="none"/i.test(tag)) errors.push(`preload="none" required — ${where}`);
		if (!/\bcontrols\b/i.test(tag)) errors.push(`controls required — ${where}`);
		if (/<video/i.test(tag) && !/\bposter=/i.test(tag))
			errors.push(`poster required — ${where}`);
	}
}

if (errors.length) {
	console.error(`check:media FAILED (${errors.length}):\n` + errors.join("\n"));
	process.exit(1);
}
console.log(`check:media ok — ${pages.length} pages scanned`);
```

- [ ] **Step 2: Write `scripts/check-homepage-budget.mjs`**

```js
// Homepage initial-transfer budget (spec §9/§10): document + every automatically
// fetched subresource — stylesheets, preload targets, icons (plus /favicon.ico if
// present), images and video posters; srcset counts its LARGEST candidate so the
// measurement upper-bounds real transfer on every device. Only preload="none"
// media payloads are excluded. gzip via Node zlib defaults. Ceiling: 102,400 bytes.
// Zero-JS (spec §7.3): any <script> tag on the homepage fails the check outright;
// script src / modulepreload resources are still counted so the budget stays an
// upper bound even if that rule is ever relaxed. External (cross-origin) auto-
// fetched resources cannot be measured from dist, so they are forbidden outright.
// Relative URLs resolve against the referencing document or stylesheet.
// CSS is traversed recursively, including quoted @import chains.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";

const LIMIT = 102_400;
const html = readFileSync("dist/index.html", "utf8");
const urls = new Set();

const external = [];
const missing = [];
// Classify one URL: cross-origin → forbidden; local — root-relative OR relative,
// resolved against the referencing document/stylesheet — → counted.
const take = (u, basePath = "/index.html") => {
	if (!u) return;
	if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return; // data:, mailto:, …
	if (/^(?:https?:)?\/\//i.test(u)) {
		external.push(u.split(/[?#]/)[0]); // cross-origin auto-fetch is forbidden; reported below
		return;
	}
	urls.add(new URL(u, `https://local${basePath}`).pathname);
};

for (const [, rel, href] of html.matchAll(/<link\b[^>]*rel="([^"]+)"[^>]*href="([^"]+)"[^>]*>/gi)) {
	if (/stylesheet|preload|icon|apple-touch-icon/i.test(rel)) take(href);
}
for (const [, href, rel] of html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*rel="([^"]+)"[^>]*>/gi)) {
	if (/stylesheet|preload|icon|apple-touch-icon/i.test(rel)) take(href);
}
// an image's fallback src counts IN ADDITION to its largest srcset candidate —
// intentionally conservative; the measurement stays an upper bound
for (const [, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"/gi)) take(src);
for (const [, poster] of html.matchAll(/<video\b[^>]*poster="([^"]+)"/gi)) take(poster);
const scriptTags = [...html.matchAll(/<script\b[^>]*>/gi)].map((m) => m[0]);
for (const [, src] of html.matchAll(/<script\b[^>]*src="([^"]+)"/gi)) take(src);
for (const [, href] of html.matchAll(
	/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"[^>]*>/gi,
)) {
	take(href);
}
for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/gi)) {
	// EVERY candidate is classified — external ones are forbidden, local ones are
	// resolved; only the LARGEST existing local candidate counts toward the total.
	const candidates = srcset.split(",").map((c) => c.trim().split(/\s+/)[0]);
	let best = null;
	let bestSize = -1;
	for (const c of candidates) {
		if (/^(?:https?:)?\/\//i.test(c)) {
			external.push(c.split(/[?#]/)[0]);
			continue;
		}
		const resolved = new URL(c, "https://local/index.html").pathname;
		const p = `dist${resolved}`;
		if (!existsSync(p)) {
			missing.push(resolved);
			continue;
		}
		const size = gzipSync(readFileSync(p)).length;
		if (size > bestSize) {
			best = resolved;
			bestSize = size;
		}
	}
	if (best) urls.add(best);
}
if (existsSync("dist/favicon.ico")) take("/favicon.ico");

// @font-face and @import assets are fetched automatically too — traverse CSS
// RECURSIVELY: both url(...) syntax and quoted @import "…" forms are parsed;
// newly discovered local stylesheets join the worklist, and external imports
// hit the same forbidden-externals gate as everything else.
const cssQueue = [...urls].filter((u) => u.endsWith(".css"));
const cssSeen = new Set(cssQueue);
while (cssQueue.length) {
	const css = cssQueue.shift();
	const p = `dist${css}`;
	if (!existsSync(p)) continue; // reported as missing by the accounting loop
	const text = readFileSync(p, "utf8");
	for (const [, , u] of text.matchAll(/url\((["']?)([^)"']+)\1\)/g)) {
		take(u, css); // relative refs resolve against the stylesheet's path
	}
	for (const [, , u] of text.matchAll(/@import\s+(["'])([^"']+)\1/g)) {
		take(u, css); // quoted @import without url() — same classification
	}
	for (const u of urls) {
		if (u.endsWith(".css") && !cssSeen.has(u)) {
			cssSeen.add(u);
			cssQueue.push(u);
		}
	}
}

let total = gzipSync(readFileSync("dist/index.html")).length;
const rows = [["/index.html", total]];
for (const u of urls) {
	const p = `dist${u}`;
	if (!existsSync(p)) {
		missing.push(u);
		continue;
	}
	const size = gzipSync(readFileSync(p)).length;
	rows.push([u, size]);
	total += size;
}

for (const [u, size] of rows.sort((a, b) => b[1] - a[1])) {
	console.log(`${String(size).padStart(8)}  ${u}`);
}
console.log(`${String(total).padStart(8)}  TOTAL (limit ${LIMIT})`);
if (external.length) {
	console.error(
		`check:budget FAILED — external automatically fetched resources are forbidden: ${[...new Set(external)].join(", ")}`,
	);
	process.exit(1);
}
if (scriptTags.length) {
	console.error(
		`check:budget FAILED — zero-JS contract: ${scriptTags.length} <script> tag(s) on the homepage (first: ${scriptTags[0]})`,
	);
	process.exit(1);
}
if (missing.length) {
	console.error(`check:budget FAILED — referenced but missing from dist: ${missing.join(", ")}`);
	process.exit(1);
}
if (total > LIMIT) {
	console.error(`check:budget FAILED — ${total} > ${LIMIT} bytes gzip`);
	process.exit(1);
}
console.log("check:budget ok");
```

- [ ] **Step 3: Wire scripts, run both, commit**

Add to `package.json` scripts:

```json
"check:media": "node scripts/check-media.mjs",
"check:budget": "node scripts/check-homepage-budget.mjs",
```

Run: `pnpm build && pnpm check:media && pnpm check:budget`
Expected: both pass. If `check:budget` exceeds the ceiling, the fix order is: confirm the font file is the single 600-weight subset, then trim hero CSS — never raise `LIMIT`.

Prove each guard bites: temporarily add `autoplay` to the video in `[...slug].astro`, rebuild, expect `check:media` to fail; revert. Temporarily `cp public/ai-14all/hero-demo-poster.jpg public/big.jpg` and add `<img src="/big.jpg" alt="" />` to `index.astro`, rebuild, confirm the budget total grows in the listing; revert both. Then `printf '<script>x</script>' >> dist/index.html && pnpm check:budget` must fail on the zero-JS gate; rebuild. Finally `printf '<img src="https://example.com/big.jpg" alt="" />' >> dist/index.html && pnpm check:budget` must fail on the external-resource gate; the same trick with `<img src="big.jpg" alt="" />` (relative URL) must fail as missing `/big.jpg`, and with `<img srcset="https://cdn.example.com/x.jpg 1x" alt="" />` must fail on the external gate — proving relative resolution and per-candidate srcset classification. For the CSS layer: `printf '@import "/evil-2.css";' > dist/evil-1.css && printf '@import "https://cdn.example.com/large.css";' > dist/evil-2.css && printf '<link rel="stylesheet" href="/evil-1.css">' >> dist/index.html && pnpm check:budget` must fail on the external gate — one fixture proving both quoted-`@import` parsing and recursive traversal (evil-1 → evil-2 → external). Run `pnpm build` again to clean up.

```bash
git add scripts/check-media.mjs scripts/check-homepage-budget.mjs package.json
git commit -m "test(guards): media click-to-play and homepage byte-budget checks"
```

---

### Task 18: Guard — check:downloads

**Files:**

- Create: `scripts/check-downloads.mjs`
- Modify: `package.json` (script `check:downloads`)

**Interfaces:**

- Consumes: `src/data/ai14all-downloads.ts` (imported with `--experimental-strip-types`, Node ≥ 22.6), `dist/`, network (GitHub API + asset HEADs; `GITHUB_TOKEN` used when present).
- Produces: `pnpm check:downloads` — fails on unresolvable asset URLs, on module `version` ≠ latest published release tag, on any built ai-14all download link that bypasses the module, on a missing `id="download"` anchor, on any install-destination pattern (`apps.apple.com`, `testflight.apple.com`, `itms-services:`) anywhere in `dist`, and — provenance, not just equality — on any hand-written download URL, any ai-14all release-page URL (including `releases/latest`), any bare `/releases/latest` or `/releases/tag/` path fragment (so URLs constructed from pieces are caught), any `ai-14all <semver>` pairing anywhere in `src/`, and any exact semver token at all in components, lib, pages, or flagship MDX, outside the two typed data modules. Stale versions fail, not only the current one; the source scan covers `.astro/.ts/.tsx/.js/.jsx/.mjs/.cjs/.md/.mdx/.html/.json/.css/.svg/.yaml`; URL rules run on NORMALIZED source text (quotes, backticks, `+`, commas, brackets, and whitespace stripped), so split constructions like `"/releases/" + "latest"` collapse into the forbidden fragment and fail; and every BUILT ai-14all release-page link must equal a module-derived destination (`releasePageUrl` or a recently-shipped entry), whatever source expression produced it. The normalized-source ban plus the rendered allowlist together form the import allowlist: no non-module source can carry or assemble a release destination, so a page that renders one necessarily imported it from the typed modules.

- [ ] **Step 1: Write `scripts/check-downloads.mjs`**

```js
// Download-contract guard (spec §5.3/§7.1/§10). Network-dependent by design;
// runs in CI before every deploy. Requires Node >= 22.6 for type stripping.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { AI14ALL_DOWNLOADS, AI14ALL_DOWNLOAD_ASSETS } from "../src/data/ai14all-downloads.ts";
import { RECENTLY_SHIPPED } from "../src/data/recently-shipped.ts";

const errors = [];
const v = AI14ALL_DOWNLOADS.version;

// 1. Every asset URL embeds exactly the module version.
for (const a of AI14ALL_DOWNLOAD_ASSETS) {
	if (!a.url.includes(`/v${v}/`)) errors.push(`asset does not embed v${v}: ${a.url}`);
}

// 2. Every asset URL resolves (GitHub redirects downloads; follow them).
for (const a of AI14ALL_DOWNLOAD_ASSETS) {
	const res = await fetch(a.url, { method: "HEAD", redirect: "follow" });
	if (!res.ok) errors.push(`asset HEAD ${res.status}: ${a.url}`);
}

// 3. Module version matches the latest published release tag.
const headers = { "user-agent": "ai-creed-check-downloads" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const rel = await fetch("https://api.github.com/repos/ai-creed/ai-14all/releases/latest", {
	headers,
});
if (!rel.ok) {
	errors.push(`GitHub API ${rel.status} fetching latest release`);
} else {
	const tag = (await rel.json()).tag_name;
	if (tag !== `v${v}`) errors.push(`module version v${v} is stale — latest release is ${tag}`);
}

// 4. Dist scans: no bypassing links, anchor present, no install destinations.
const pages = [];
(function walk(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p);
		else if (p.endsWith(".html")) pages.push(p);
	}
})("dist");

const allowed = new Set(AI14ALL_DOWNLOAD_ASSETS.map((a) => a.url));
const RELEASES_PREFIX = "https://github.com/ai-creed/ai-14all/releases";
const allowedPages = new Set([
	AI14ALL_DOWNLOADS.releasePageUrl,
	...RECENTLY_SHIPPED.map((e) => e.href).filter((h) => h.startsWith(RELEASES_PREFIX)),
]);
for (const page of pages) {
	const html = readFileSync(page, "utf8");
	for (const [, href] of html.matchAll(/href="([^"]*\/releases\/download\/[^"]*)"/g)) {
		if (!allowed.has(href)) errors.push(`download link bypasses module in ${page}: ${href}`);
	}
	// however a release-page URL was constructed in source, the RENDERED link
	// must be a module-derived destination
	for (const [, href] of html.matchAll(
		/href="([^"]*github\.com\/ai-creed\/ai-14all\/releases[^"]*)"/g,
	)) {
		if (!href.includes("/releases/download/") && !allowedPages.has(href)) {
			errors.push(`release-page link not derived from the data modules in ${page}: ${href}`);
		}
	}
	for (const bad of ["apps.apple.com", "testflight.apple.com", "itms-services:"]) {
		if (html.includes(bad)) errors.push(`forbidden install destination "${bad}" in ${page}`);
	}
}
const anchorPage = "dist/projects/ai-14all/index.html";
if (!readFileSync(anchorPage, "utf8").includes('id="download"')) {
	errors.push(`missing id="download" anchor in ${anchorPage}`);
}

// 5. Source provenance: the two typed data modules are the ONLY carriers of an
// ai-14all download URL, release-page URL (including releases/latest), or exact
// version anywhere in src/ — a hand-written copy that merely equals a module
// value still fails, and so does a stale one. Components, lib, pages, and the
// three flagship MDX files are additionally version-free: ANY exact semver
// token there fails (other projects' pages may still state their own versions).
const ALLOWED_SOURCES = new Set([
	join("src", "data", "ai14all-downloads.ts"),
	join("src", "data", "recently-shipped.ts"),
]);
const FLAGSHIP_MDX = new Set([
	join("src", "content", "projects", "ai-14all.mdx"),
	join("src", "content", "projects", "ai-xavier.mdx"),
	join("src", "content", "projects", "ai-samantha.mdx"),
]);
const VERSION_FREE = (file) =>
	FLAGSHIP_MDX.has(file) ||
	file.startsWith("src/components/") ||
	file.startsWith("src/lib/") ||
	file.startsWith("src/pages/");
const SEMVER_RE = /\bv?\d+\.\d+\.\d+\b/;
const TEXT_RE = /\.(astro|ts|tsx|js|jsx|mjs|cjs|md|mdx|html|json|css|svg|ya?ml)$/;
const sources = [];
(function walkSrc(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walkSrc(p);
		else if (TEXT_RE.test(p)) sources.push(p);
	}
})("src");
for (const file of sources) {
	if (ALLOWED_SOURCES.has(file)) continue;
	const text = readFileSync(file, "utf8");
	// Split-construction defense: strip quotes, backticks, plus signs, commas,
	// brackets, and whitespace, so `"/releases/" + "latest"` — or a .join() of
	// pieces — collapses back into the forbidden fragment before matching. URL
	// rules run on this normalized text. Together with the rendered-output
	// allowlist below this IS the import allowlist: no non-module source can
	// carry or assemble a release destination, so any page that renders one
	// must have imported it from the typed modules.
	const squashed = text.replace(/["'`+,[\]\s]/g, "");
	if (squashed.includes("/releases/download/")) {
		errors.push(`hand-written download URL outside the data modules: ${file}`);
	}
	if (squashed.includes("github.com/ai-creed/ai-14all/releases")) {
		errors.push(`hand-written ai-14all release URL outside the data modules: ${file}`);
	}
	if (/\/releases\/(latest|tag\/)/.test(squashed)) {
		errors.push(`hand-written release path outside the data modules: ${file}`);
	}
	if (/ai-14all[-\s]v?\d+\.\d+\.\d+/.test(text)) {
		errors.push(`hand-written ai-14all version outside the data modules: ${file}`);
	}
	if (VERSION_FREE(file) && SEMVER_RE.test(text)) {
		errors.push(`hand-written exact version in version-free source: ${file}`);
	}
}

if (errors.length) {
	console.error(`check:downloads FAILED (${errors.length}):\n` + errors.join("\n"));
	process.exit(1);
}
console.log(
	`check:downloads ok — v${v} live, ${pages.length} pages, ${sources.length} source files scanned`,
);
```

- [ ] **Step 2: Wire, run, commit**

Add to `package.json` scripts:

```json
"check:downloads": "node --experimental-strip-types scripts/check-downloads.mjs",
```

Run: `pnpm build && pnpm check:downloads`
Expected: `check:downloads ok — v1.8.2 live, …`. Prove it bites six ways, reverting after each: (1) change the module `VERSION` to `"1.8.1"` → stale-version failure; (2) add `https://github.com/ai-creed/ai-14all/releases/download/v0.0.0/x.dmg` in a comment in `ai-14all.mdx` → download-URL provenance failure; (3) add `https://github.com/ai-creed/ai-14all/releases/latest` in a comment in `LandingFooter.astro` → release-URL provenance failure; (4) add the prose `works since v1.8.1` to `ai-14all.mdx` → version-free semver failure (a stale version, proving arbitrary versions are caught); (5) add the bare string `/releases/latest` in a comment in `EngineRoom.astro` → release-path-fragment failure (a constructed URL cannot hide the fragment); (6) after a build, `printf '<a href="https://github.com/ai-creed/ai-14all/releases/tag/v0.0.1">x</a>' >> dist/index.html && pnpm check:downloads` → rendered release-page link failure; rebuild to clean; (7) the split-construction fixture — add `const u = "https://github.com/ai-creed/ai-14all" + "/releases/" + "latest";` to `LandingHeader.astro`'s frontmatter → normalized-text failure (the pieces collapse back into the forbidden URL even though no single literal contains it).

```bash
git add scripts/check-downloads.mjs package.json
git commit -m "test(guards): download single-source, liveness, and staleness check"
```

### Task 19: Guard — check:a11y (axe, tap targets, pre-interaction network)

**Files:**

- Create: `scripts/check-a11y.mjs`
- Modify: `package.json` (devDependency `axe-core`; script `check:a11y`)

**Interfaces:**

- Consumes: `dist/`, `playwright` (Task 3), `axe-core`.
- Produces: `pnpm check:a11y` — serves `dist/` on an ephemeral port, audits `/`, `/projects/ai-14all/`, `/projects/ai-xavier/`, `/projects/ai-samantha/` at 1440×900 and 390×844, fails on any axe violation with impact `serious`/`critical`, fails if the homepage requests any video/audio asset before user interaction, and — because axe's serious/critical gate does not reliably cover target size — asserts with bounding boxes at 390 px that every visible interactive element (`a, button, summary, input, select, textarea, [role=button]`) measures at least 44 × 44 px — only `<a>` elements inside prose paragraphs are exempt; non-link controls are checked even inside a `<p>` (spec §9).

- [ ] **Step 1: Install axe-core**

```bash
pnpm add -D -E axe-core@4.12.1
```

Expected manifest entry: `"axe-core": "4.12.1"` (exact, no range prefix).

- [ ] **Step 2: Write `scripts/check-a11y.mjs`**

```js
// Accessibility, 44×44 interactive-target, and pre-interaction media guard
// (spec §9/§10). Run after `pnpm build`.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const MIME = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".mp4": "video/mp4",
	".txt": "text/plain",
	".xml": "application/xml",
};

const server = createServer((req, res) => {
	let p = join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
	if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
	if (!existsSync(p)) {
		res.writeHead(404);
		res.end();
		return;
	}
	res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
	res.end(readFileSync(p));
});
await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;

const ROUTES = ["/", "/projects/ai-14all/", "/projects/ai-xavier/", "/projects/ai-samantha/"];
const VIEWPORTS = [
	{ width: 1440, height: 900 },
	{ width: 390, height: 844 },
];
const MEDIA_RE = /\.(mp4|webm|m4v|mov|mp3|m4a|ogg|wav)(\?|$)/i;
const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const browser = await chromium.launch();
const errors = [];
for (const viewport of VIEWPORTS) {
	const page = await browser.newPage({ viewport });
	for (const route of ROUTES) {
		const mediaHits = [];
		const onRequest = (req) => {
			if (MEDIA_RE.test(req.url()) || req.resourceType() === "media")
				mediaHits.push(req.url());
		};
		page.on("request", onRequest);
		await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
		page.off("request", onRequest);
		if (route === "/" && mediaHits.length) {
			errors.push(
				`pre-interaction media request on / @${viewport.width}: ${mediaHits.join(", ")}`,
			);
		}
		await page.addScriptTag({ content: axeSource });
		const { violations } = await page.evaluate(() =>
			window.axe.run(document, { resultTypes: ["violations"] }),
		);
		for (const v of violations) {
			if (v.impact === "serious" || v.impact === "critical") {
				errors.push(
					`${route} @${viewport.width}px: [${v.impact}] ${v.id} (${v.nodes.length} node(s))`,
				);
			}
		}
		if (viewport.width === 390) {
			// open every <details> first so mobile-menu links are measured too
			await page.evaluate(() => {
				for (const d of document.querySelectorAll("details")) d.open = true;
			});
			const undersized = await page.evaluate(() => {
				const bad = [];
				const targets = document.querySelectorAll(
					"a, button, summary, input, select, textarea, [role=button]",
				);
				for (const el of targets) {
					// only LINKS inside prose paragraphs are exempt (spec §9);
					// buttons/inputs/disclosures are checked everywhere
					if (el.matches("a") && el.closest("p")) continue;
					const box = el.getBoundingClientRect();
					if (box.width === 0 || box.height === 0) continue; // hidden responsive variant
					if (box.height < 44 || box.width < 44) {
						const label = (el.textContent || el.tagName).trim().slice(0, 40);
						bad.push(`${label} (${Math.round(box.width)}×${Math.round(box.height)}px)`);
					}
				}
				return bad;
			});
			for (const target of undersized) {
				errors.push(`${route} @390px: interactive target under 44×44px — ${target}`);
			}
		}
	}
	await page.close();
}
await browser.close();
server.close();

if (errors.length) {
	console.error(`check:a11y FAILED (${errors.length}):\n` + errors.join("\n"));
	process.exit(1);
}
console.log(
	`check:a11y ok — ${ROUTES.length} routes × ${VIEWPORTS.length} viewports, no serious/critical violations, 44×44 targets hold, no pre-interaction media`,
);
```

- [ ] **Step 3: Wire, run, commit**

Add to `package.json` scripts:

```json
"check:a11y": "node scripts/check-a11y.mjs",
```

Run: `pnpm build && pnpm check:a11y`
Expected: pass. Prove it bites three ways, reverting after each: (1) temporarily remove `aria-label` from a `role="img"` visual (serious `aria-roles`/name violation) OR set a `.proof` color to `#555`, rebuild, expect failure; (2) delete the `min-height` line from `LandingFooter`'s `.col a`, rebuild, expect a tap-target failure; (3) add `<p><button style="width:20px;height:20px;padding:0;border:0">x</button></p>` to the closing section of `index.astro`, rebuild, expect an `interactive target under 44×44px` failure even though the button sits inside a paragraph — proving the exemption is anchor-only.

```bash
git add scripts/check-a11y.mjs package.json pnpm-lock.yaml
git commit -m "test(guards): axe accessibility scan with pre-interaction media assertion"
```

---

### Task 20: Lighthouse thresholds

**Files:**

- Create: `lighthouserc.json`
- Modify: `package.json` (devDependency `@lhci/cli`; script `lighthouse`)

**Interfaces:**

- Consumes: `dist/`.
- Produces: `pnpm lighthouse` — LHCI against the built homepage, default mobile emulation + simulated throttling, 3 runs, median-run aggregation, error-level assertions `minScore 0.95` / LCP `maxNumericValue 1499` / CLS `maxNumericValue 0.019` (inclusive comparisons ⇒ the spec's strict below-1500 ms / below-0.02 contract).

- [ ] **Step 1: Install and write the committed config**

```bash
pnpm add -D -E @lhci/cli@0.15.1
```

Expected manifest entry: `"@lhci/cli": "0.15.1"` (exact, no range prefix).

`lighthouserc.json`:

```json
{
	"ci": {
		"collect": {
			"staticDistDir": "./dist",
			"url": ["http://localhost/index.html"],
			"numberOfRuns": 3
		},
		"assert": {
			"assertions": {
				"categories:performance": [
					"error",
					{ "minScore": 0.95, "aggregationMethod": "median-run" }
				],
				"largest-contentful-paint": [
					"error",
					{ "maxNumericValue": 1499, "aggregationMethod": "median-run" }
				],
				"cumulative-layout-shift": [
					"error",
					{ "maxNumericValue": 0.019, "aggregationMethod": "median-run" }
				]
			}
		}
	}
}
```

(LHCI substitutes the static server's real port into the `localhost` URL; mobile emulation and simulated throttling — 150 ms RTT, 1.6 Mbps down, 4× CPU — are Lighthouse defaults, so no `settings` override is committed.)

- [ ] **Step 2: Wire and run**

Add to `package.json` scripts:

```json
"lighthouse": "lhci autorun",
```

Run: `pnpm build && pnpm lighthouse` — on a machine without system Chrome, prefix with the Playwright browser:
`CHROME_PATH="$(node -e 'console.log(require("playwright").chromium.executablePath())')" pnpm lighthouse`
Expected: 3 runs of `/index.html`; all three assertions pass.

- [ ] **Step 3: Commit**

```bash
git add lighthouserc.json package.json pnpm-lock.yaml
git commit -m "test(guards): committed lighthouse thresholds (perf 0.95, lcp <1500, cls <0.02)"
```

---

### Task 21: CI — run the full guard suite before deploy

**Files:**

- Modify: `.github/workflows/deploy.yml`

**Interfaces:**

- Consumes: every `pnpm` script from Tasks 17–20.
- Produces: a deploy that cannot ship a contract regression. The ubuntu runner's preinstalled Chrome serves LHCI; `GITHUB_TOKEN` feeds `check:downloads`.

- [ ] **Step 1: Replace the `build` job's steps after "Install" with**

```yaml
- name: Type check
  run: pnpm run check

- name: Lint
  run: pnpm run lint

- name: Format check
  run: pnpm run format:check

- name: Build
  run: pnpm run build

- name: Media guard
  run: pnpm run check:media

- name: Budget guard
  run: pnpm run check:budget

- name: Downloads guard
  run: pnpm run check:downloads
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

- name: Install Playwright chromium
  run: pnpm exec playwright install --with-deps chromium

- name: Accessibility guard
  run: pnpm run check:a11y

- name: Lighthouse
  run: pnpm run lighthouse

- name: Upload artifact
  if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
  uses: actions/upload-pages-artifact@v3
  with:
      path: ./dist
```

(Everything before "Install" and the whole `deploy` job stay unchanged.)

- [ ] **Step 2: Verify and commit**

Validate the workflow by opening a PR (the `pull_request` trigger runs the build job without deploying). Locally, run the same commands in sequence first:
`pnpm check && pnpm lint && pnpm format:check && pnpm build && pnpm check:media && pnpm check:budget && pnpm check:downloads && pnpm check:a11y && pnpm lighthouse`
Expected: all green locally, then a green PR check.

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: gate deploy on media, budget, downloads, a11y, and lighthouse guards"
```

---

### Task 22: Full validation sweep

No new files — this task executes spec §10 end to end and fixes anything it surfaces.

- [ ] **Step 1: Automated suite**

Run: `pnpm check && pnpm lint && pnpm format:check && pnpm build && pnpm check:media && pnpm check:budget && pnpm check:downloads && pnpm check:a11y && pnpm lighthouse`
Expected: every command green.

- [ ] **Step 2: Visual sweep (screenshots at the spec's five widths)**

```bash
pnpm preview & PREVIEW_PID=$!
sleep 2
for w in 1440 1024 430 390 320; do
	npx -y playwright screenshot --viewport-size="$w,900" --full-page \
		http://localhost:4321/ "/tmp/ai-creed-sweep-$w.png"
done
kill $PREVIEW_PID
```

Review each screenshot: hero CTA before visuals on mobile; trio directly after hero; visuals precede copy in mobile chapters; loop vertical ≤ 899 px; creed one column at 320 px; engine room compacts; nothing clipped.

- [ ] **Step 3: Overflow + CTA-breakpoint assertion (both sides of 900 px)**

```bash
pnpm preview & PREVIEW_PID=$!
sleep 2
node --input-type=module -e '
import { chromium } from "playwright";
const b = await chromium.launch();
for (const width of [320, 390, 430]) {
	const p = await b.newPage({ viewport: { width, height: 900 } });
	await p.goto("http://localhost:4321/");
	const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
	if (over > 0) { console.error(`horizontal overflow ${over}px at ${width}`); process.exit(1); }
	await p.close();
}
for (const width of [900, 899]) {
	const p = await b.newPage({ viewport: { width, height: 900 } });
	await p.goto("http://localhost:4321/");
	const modes = await p.evaluate(() => {
		const vis = (sel) => [...document.querySelectorAll(sel)].some((el) => getComputedStyle(el).display !== "none");
		return { desk: vis(".cta-desktop"), mob: vis(".cta-mobile"), navDesk: vis(".nav-desktop"), navMob: vis(".nav-mobile") };
	});
	const expectDesktop = width >= 900;
	if (modes.desk !== expectDesktop || modes.mob === expectDesktop || modes.navDesk !== expectDesktop || modes.navMob === expectDesktop) {
		console.error(`mixed CTA modes at ${width}px: ${JSON.stringify(modes)}`); process.exit(1);
	}
	await p.close();
}
await b.close(); console.log("no overflow at 320/390/430; CTA modes exclusive at 899/900");
'
kill $PREVIEW_PID
```

- [ ] **Step 4: Keyboard + reduced-motion walkthrough (manual)**

- Tab from load: skip link first → header links → hero CTAs → every chapter action → footer; every stop shows the 2 px coral ring; skip link jumps to `#main`.
- The `<details>` mobile menu opens/closes with Enter and is fully keyboard-operable.
- With macOS "Reduce Motion" on (or DevTools emulation): the needs-you dot does not animate; screenshots before/after are otherwise identical.
- Posters render on `/projects/ai-14all/`, `/projects/ai-samantha/`, `/projects/ai-whisper/` with zero media requests until play is pressed.

- [ ] **Step 5: Acceptance checklist (spec §12) and closeout**

Confirm each: (1) reads as one system, not a grid; (2) all three flagships have substantial visual presence; (3) ai-14all is the clearest conversion (reachable in ≤ 2 actions from `/`); (4) the loop chapter is prominent and future-tensed; (5) desktop/mobile CTAs match device capability; (6) engine room discoverable but subordinate; (7) terse voice, honest claims, a11y and perf gates green.

The spec's product-comprehension tests (five-second test with ≥ 7/10, scenario routing ≥ 70%) require human participants — flag them to the operator as a post-merge task; they are not automatable here.

```bash
git add -A && git status --short   # expect empty — everything already committed
```

---

## Out of Scope (spec §11)

Product application redesigns; documentation systems; pricing; testimonials/invented social proof; analytics; a hosted waitlist backend; JavaScript-heavy interactions; redesigning project detail pages beyond shared tokens and CTA compatibility. A Discord server does not exist — community links point at the GitHub org until the operator creates one.

## Execution Notes

- Task order is the dependency order; every task ends and commits green. The only intended red is an internal, uncommitted step of Task 4 (the contract check before the content lands), and Task 15 lands the `#download` anchor before Task 16 ships any link to it.
- Node ≥ 22.6 locally (for `--experimental-strip-types`); CI pins Node 22.
- Never hand-edit generated artifacts (`public/og-home.png`, poster JPEGs) — rerun their scripts.
- Every commit message follows the repo's `type(scope): summary` lowercase convention.
