# Landing Page 14all-First Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the ai-creed homepage top as 14all-first (hero → how-it-works → features → loop-extends) with a real click-to-play camera-tour video, per the approved spec `docs/superpowers/specs/2026-07-29-landing-14all-first-restructure-design.md`.

**Architecture:** Four new Astro section components replace `EcosystemHero` + `FlagshipChapter×3` on `src/pages/index.astro`; all copy that positions a product lives in project frontmatter (validated by `src/lib/flagships.ts`); the hero video is an interface — an interim ffmpeg-zoompan tour rendered from the committed source recording, swappable later without page changes. Every binding contract is machine-enforced by the guard suite, extended with a new `check:copy` guard.

**Tech Stack:** Astro 6.4.x (static, zero client JS on the homepage), Playwright + axe-core guard scripts, ffmpeg (local asset generation only), Lighthouse CI.

## Global Constraints

- Spec is binding: `docs/superpowers/specs/2026-07-29-landing-14all-first-restructure-design.md`. All §4 copy is verbatim, all lowercase.
- Zero JS on the homepage — any `<script>` tag fails `check:budget`. No client JS in any new component.
- `Ai14allReleaseLink.astro` is the **sole** renderer of ai-14all release/download hrefs. Never hand-write a release URL.
- Claims boundaries: flagships are **source-available**, never "open source"; ai-xavier gets no install/App Store/TestFlight destination; ai-samantha's fully-local claim applies to **speech** only, exactly as the spec words it.
- Guard thresholds: `check:budget` LIMIT **262,144** bytes gzip; Lighthouse `categories:performance ≥ 0.95` and CLS `≤ 0.019` unchanged and binding; LCP **2499 provisional**, ratcheted in Task 9 to `min(2499, ceil(median × 1.15))`.
- Do not upgrade any dependency. Do not touch project pages except the three MDX frontmatter blocks named in Task 1.
- After every task: `pnpm format` then `pnpm format:check` must pass (prettier double-write), plus `pnpm lint` and `pnpm check` when source files changed. Commit per task with the repo's conventional-commit style.
- Asset generation (ffmpeg, Playwright rendering) runs locally; rendered assets are committed. CI never runs ffmpeg.

## File Structure

- Create: `src/components/Hero14all.astro` (hero section, `id="system"`), `src/components/HowItWorks.astro` (`id="how"`), `src/components/HomeFeatures.astro` (`id="features"` — implementation affordance for guard scoping, not a nav target), `src/components/LoopExtends.astro` (`id="ecosystem"` + legacy `id="products"` anchor), `scripts/generate-hero-tour.mjs`, `scripts/check-homepage-copy.mjs`, `public/ai-14all/hero-tour.mp4`, `public/ai-14all/hero-tour-poster.jpg`, `docs/superpowers/evidence/2026-07-29-landing-restructure/` (two screenshots).
- Modify: `src/lib/flagships.ts`, `src/content/projects/{ai-14all,ai-xavier,ai-samantha}.mdx` (frontmatter only), `src/pages/index.astro`, `src/components/LandingHeader.astro`, `scripts/generate-posters.mjs`, `scripts/check-homepage-budget.mjs`, `scripts/check-media.mjs`, `scripts/check-a11y.mjs`, `lighthouserc.json`, `package.json`, `.github/workflows/deploy.yml`.
- Delete: `src/components/EcosystemHero.astro`, `FlagshipChapter.astro`, `Ai14allVisual.astro`, `XavierVisual.astro`, `SamanthaVisual.astro` (verified orphaned in Task 6).
- No `src/content.config.ts` change — the existing `cta` schema shape already fits.

---

### Task 1: Content model — flagship CTA invariant + frontmatter values

**Files:**

- Modify: `src/lib/flagships.ts:62-74` (the non-14all `else` branch)
- Modify: `src/content/projects/ai-14all.mdx` (frontmatter `homepage.headline`, `homepage.summary`)
- Modify: `src/content/projects/ai-xavier.mdx` (frontmatter `homepage.headline`, `homepage.summary`, `desktopCta`, `mobileCta`)
- Modify: `src/content/projects/ai-samantha.mdx` (same fields)

**Interfaces:**

- Consumes: existing `homepage` zod schema in `src/content.config.ts` (unchanged).
- Produces: build-enforced invariant — for `ai-xavier`/`ai-samantha`, `desktopCta` and `mobileCta` are identical in label AND href, href exactly `/projects/<id>`. Frontmatter values later tasks render: ai-14all `headline` = hero h1, `summary` = hero sub; xavier/samantha `headline` = card pitch, `summary` = card body, `desktopCta` = card ghost CTA.

- [ ] **Step 1: Replace the non-14all CTA validation (the failing "test")**

In `src/lib/flagships.ts`, replace this entire block:

```ts
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
```

with (spec §4.4 — homepage duo CTAs route to project pages; mailto interest links live only on the project pages):

```ts
		} else {
			const route = `/projects/${id}`;
			const { desktopCta, mobileCta } = hp;
			if (desktopCta.label !== mobileCta.label || desktopCta.href !== mobileCta.href) {
				fail(`${id} desktopCta and mobileCta must be identical in label and href`);
			}
			if (desktopCta.href !== route) {
				fail(`${id} CTA hrefs must be exactly ${route} — mailto: lives on the project page`);
			}
			if (desktopCta.label.trim() === "") {
				fail(`${id} CTA label must be non-empty`);
			}
		}
```

- [ ] **Step 2: Run the build to verify it fails on the old frontmatter**

Run: `pnpm build`
Expected: FAIL with `flagship contract: ai-xavier CTA hrefs must be exactly /projects/ai-xavier — mailto: lives on the project page`

- [ ] **Step 3: Update the three frontmatter blocks**

`src/content/projects/ai-14all.mdx` — replace only these two `homepage` lines (CTAs stay unchanged):

```yaml
headline: "ship with a fleet, not a single agent."
summary: "run claude, codex, and more in parallel — each agent in its own git worktree, with its own branch and terminal. see who needs you at a glance, review diffs inline, stay in one window."
```

`src/content/projects/ai-xavier.mdx` — replace `headline`, `summary`, `desktopCta`, `mobileCta`:

```yaml
headline: "your phone is presence."
summary: "watch live terminals, answer the prompt that is blocking an agent, steer, or interrupt — from anywhere."
desktopCta:
    label: "learn about ai-xavier"
    href: "/projects/ai-xavier"
mobileCta:
    label: "learn about ai-xavier"
    href: "/projects/ai-xavier"
```

`src/content/projects/ai-samantha.mdx` — replace the same four fields:

```yaml
headline: "supervision, out loud."
summary: "she watches the same sessions you do and answers out loud — speech recognition and voice synthesis run fully on your machine."
desktopCta:
    label: "request early access"
    href: "/projects/ai-samantha"
mobileCta:
    label: "request early access"
    href: "/projects/ai-samantha"
```

- [ ] **Step 4: Verify the build passes and existing guards stay green**

Run: `pnpm build && pnpm check && pnpm lint && pnpm check:media && pnpm check:budget && pnpm check:a11y`
Expected: all pass. (The old homepage temporarily renders the new headline/summary values — accepted intermediate state; Task 6 replaces the sections.)

- [ ] **Step 5: Format and commit**

```bash
pnpm format && pnpm format:check
git add src/lib/flagships.ts src/content/projects/ai-14all.mdx src/content/projects/ai-xavier.mdx src/content/projects/ai-samantha.mdx
git commit -m "feat(content): route duo CTAs to project pages, hero copy into frontmatter"
```

---

### Task 2: Interim hero tour video

**Files:**

- Create: `scripts/generate-hero-tour.mjs`
- Create: `public/ai-14all/hero-tour.mp4` (rendered, committed)

**Interfaces:**

- Consumes: `public/ai-14all/hero-demo.mp4` (committed 7.5s source, 2628×1388 @ 30fps).
- Produces: `/ai-14all/hero-tour.mp4` — 21s, 1600×844, 30fps, h264, silent, `+faststart`, ≤ 4,000,000 bytes. Task 4's `<video src>` points at it.

- [ ] **Step 1: Verify ffmpeg and the source recording**

Run: `ffmpeg -version | head -1 && ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of default=nw=1 public/ai-14all/hero-demo.mp4`
Expected: an ffmpeg version line, then `width=2628`, `height=1388`, `r_frame_rate=30/1`. If ffmpeg is missing, install it (`brew install ffmpeg`) before continuing.

- [ ] **Step 2: Write `scripts/generate-hero-tour.mjs`**

```js
// Renders the interim hero camera tour (spec 2026-07-29 §5): the committed
// 7.5s source recording looped 3x under a keyframed, smoothstep-eased
// zoompan camera. Requires ffmpeg on PATH; the output is committed, so this
// runs locally only — re-run to regenerate after replacing the source.
// ffmpeg facts this depends on: crop w/h evaluate at init only, so animated
// zoom needs zoompan; zoompan has no `t` var — time is in/FPS; interpolating
// the view WIDTH (not the zoom factor) gives constant-feeling motion.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FPS = 30;
const IW = 2628; // source width (public/ai-14all/hero-demo.mp4)

// camera keyframes: [time, w, h, x, y] — every rect keeps the 1600x844 output
// aspect, so there is never letterboxing.
const KF = [
	[0.0, 2628, 1388, 0, 0], // establish: full app
	[2.5, 2628, 1388, 0, 0],
	[4.5, 900, 475, 10, 60], // sidebar: sessions, status dots, active card
	[7.5, 900, 475, 10, 60],
	[9.5, 1300, 687, 460, 70], // agent tabs row + center terminal
	[12.5, 1300, 687, 460, 70],
	[14.5, 1300, 687, 1290, 350], // lateral pan to review pane
	[17.5, 1300, 687, 1290, 350],
	[19.5, 2628, 1388, 0, 0], // pull back out
	[21.0, 2628, 1388, 0, 0],
];

// piecewise smoothstep between keyframes; idx 1=w, 3=x, 4=y
function expr(idx) {
	const T = `(in/${FPS})`;
	let out = String(KF[KF.length - 1][idx]);
	for (let i = KF.length - 2; i >= 0; i--) {
		const [a, ...va] = KF[i];
		const [b, ...vb] = KF[i + 1];
		const v0 = va[idx - 1];
		const v1 = vb[idx - 1];
		let seg;
		if (v0 === v1) {
			seg = String(v0);
		} else {
			const e = `clip((${T}-${a})/(${b - a}),0,1)`;
			seg = `(${v0}+${v1 - v0}*${e}*${e}*(3-2*${e}))`;
		}
		out = `if(lt(${T},${b}),${seg},${out})`;
	}
	return out;
}

const filter = `zoompan=z='${IW}/(${expr(1)})':x='${expr(3)}':y='${expr(4)}':d=1:s=1600x844:fps=${FPS},format=yuv420p`;
const filterFile = join(mkdtempSync(join(tmpdir(), "hero-tour-")), "tour-filter.txt");
writeFileSync(filterFile, filter + "\n");

execFileSync(
	"ffmpeg",
	[
		...["-stream_loop", "2", "-i", "public/ai-14all/hero-demo.mp4"],
		...["-t", "21", "-filter_complex_script", filterFile],
		...["-c:v", "libx264", "-crf", "27", "-preset", "medium"],
		...["-movflags", "+faststart", "-an", "-y", "public/ai-14all/hero-tour.mp4"],
	],
	{ stdio: "inherit" },
);
console.log("wrote public/ai-14all/hero-tour.mp4");
```

- [ ] **Step 3: Render and verify the asset contract**

Run: `node scripts/generate-hero-tour.mjs`
Then: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -show_entries format=duration,size -of default=nw=1 public/ai-14all/hero-tour.mp4 && ffprobe -v error -select_streams a -show_entries stream=codec_type -of default=nw=1 public/ai-14all/hero-tour.mp4`
Expected: `width=1600`, `height=844`, `r_frame_rate=30/1`, `codec_name=h264`, `duration≈21.0`, `size` ≤ 4000000; the audio probe prints nothing (silent). If size exceeds 4,000,000: change `"-crf", "27"` to `"-crf", "28"` in the script and re-run. Known accepted flaw (spec §5): brief content jumps at the two loop seams (t≈7.5s, 15s).

- [ ] **Step 4: Format and commit**

```bash
pnpm format && pnpm format:check
git add scripts/generate-hero-tour.mjs public/ai-14all/hero-tour.mp4
git commit -m "feat(assets): interim 21s hero camera tour + zoompan generator"
```

---

### Task 3: Real-frame hero poster

**Files:**

- Modify: `scripts/generate-posters.mjs` (full replacement below)
- Create: `public/ai-14all/hero-tour-poster.jpg` (rendered, committed)

**Interfaces:**

- Consumes: `public/ai-14all/hero-tour.mp4` (Task 2).
- Produces: `/ai-14all/hero-tour-poster.jpg` — 1600×844, real establishing frame + baked coral play ring + "click to play the demo" hint, ≤ 150,000 bytes. Task 4's `<video poster>` points at it.

- [ ] **Step 1: Replace `scripts/generate-posters.mjs` with the two-variant version**

The four existing title-card entries are unchanged; a real-frame variant is added (spec §5 — poster is a real frame, not a title card):

```js
// Renders committed poster frames for the demo videos. Re-run after replacing
// a demo. Two variants: title-card POSTERS (drawn), and REAL_FRAME_POSTERS
// (spec 2026-07-29 §5) — a real footage frame with the play affordance baked
// in. Real-frame rendering additionally requires ffmpeg on PATH.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

const REAL_FRAME_POSTERS = [
	{
		out: "public/ai-14all/hero-tour-poster.jpg",
		source: "public/ai-14all/hero-tour.mp4",
		frameAt: "0.5", // inside the 2.5s establishing hold
		width: 1600,
		height: 844,
		maxBytes: 150_000,
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

const realFramePage = (dataUri, { width, height }) => `<!doctype html><html><head><style>
	body { margin: 0; width: ${width}px; height: ${height}px; position: relative;
		background: #0d0d0d; font-family: ui-monospace, Menlo, monospace; }
	img { display: block; width: ${width}px; height: ${height}px; }
	.veil { position: absolute; inset: 0; display: grid; place-items: center;
		background: rgba(13, 13, 13, 0.28); }
	.stack { text-align: center; }
	.ring { margin: 0 auto; width: 96px; height: 96px; border: 3px solid #ff8163;
		border-radius: 50%; display: grid; place-items: center;
		background: rgba(13, 13, 13, 0.55); color: #ff8163; font-size: 34px; }
	.hint { margin-top: 18px; color: #e6e6e6; font-size: 20px;
		text-shadow: 0 1px 8px rgba(13, 13, 13, 0.85); }
</style></head><body>
	<img src="${dataUri}" alt="" />
	<div class="veil"><div class="stack">
		<div class="ring">▶</div>
		<div class="hint">click to play the demo</div>
	</div></div>
</body></html>`;

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1280, height: 720 } });
for (const poster of POSTERS) {
	await tab.setContent(page(poster));
	await tab.screenshot({ path: poster.out, type: "jpeg", quality: 82 });
	console.log(`wrote ${poster.out}`);
}
await tab.close();

for (const poster of REAL_FRAME_POSTERS) {
	const frame = join(mkdtempSync(join(tmpdir(), "real-frame-")), "frame.png");
	execFileSync("ffmpeg", [
		...["-ss", poster.frameAt, "-i", poster.source],
		...["-frames:v", "1", "-y", frame],
	]);
	const dataUri = `data:image/png;base64,${readFileSync(frame).toString("base64")}`;
	const frameTab = await browser.newPage({
		viewport: { width: poster.width, height: poster.height },
	});
	await frameTab.setContent(realFramePage(dataUri, poster));
	let quality = 80;
	await frameTab.screenshot({ path: poster.out, type: "jpeg", quality });
	while (statSync(poster.out).size > poster.maxBytes && quality > 40) {
		quality -= 10;
		await frameTab.screenshot({ path: poster.out, type: "jpeg", quality });
	}
	if (statSync(poster.out).size > poster.maxBytes) {
		throw new Error(`${poster.out} exceeds ${poster.maxBytes} bytes at quality ${quality}`);
	}
	await frameTab.close();
	console.log(`wrote ${poster.out} (${statSync(poster.out).size} bytes, q${quality})`);
}
await browser.close();
```

- [ ] **Step 2: Render, restore untouched title cards, verify the contract**

```bash
node scripts/generate-posters.mjs
git checkout -- public/ai-14all/hero-demo-poster.jpg public/ai-14all/inline-review-demo-poster.jpg public/ai-samantha/hero-demo-poster.jpg public/ai-whisper/workflow-demo-poster.jpg
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of default=nw=1 public/ai-14all/hero-tour-poster.jpg
stat -f %z public/ai-14all/hero-tour-poster.jpg
```

Expected: `width=1600`, `height=844`, size ≤ 150000. (The four title-card posters are re-rendered as a side effect; restoring them keeps this commit scoped to the new poster.) Visually open the jpg once: it must show the real app frame with a coral ring and the "click to play the demo" hint.

- [ ] **Step 3: Format and commit**

```bash
pnpm format && pnpm format:check
git add scripts/generate-posters.mjs public/ai-14all/hero-tour-poster.jpg
git commit -m "feat(assets): real-frame hero tour poster with baked play ring"
```

---

### Task 4: Hero14all + HowItWorks components

**Files:**

- Create: `src/components/Hero14all.astro`
- Create: `src/components/HowItWorks.astro`

**Interfaces:**

- Consumes: `Flagship` type from `~/lib/flagships`; `Ai14allReleaseLink.astro` (`kind="releasePage" variant="button"`, emits `data-dl-origin="ai14all-downloads"`); Task 2/3 assets at `/ai-14all/hero-tour.mp4` and `/ai-14all/hero-tour-poster.jpg`.
- Produces: `Hero14all` with `Props { flagship: Flagship }` rendering `section#system` (classes `.eyebrow .display .sub .ctas .cta-desktop .cta-mobile .fine .frame .frame-cap`); `HowItWorks` with no props rendering `section#how` (classes `.label .title .steps .step .num .st`). Task 6 composes them; Task 7's guard asserts these exact ids/classes.

- [ ] **Step 1: Write `src/components/Hero14all.astro`**

Copy is spec §4.1 verbatim; h1/sub/CTA labels/availability come from frontmatter (Task 1 values); the release link is the sole renderer of release hrefs; no HTML play overlay (ring is baked into the poster); `aspect-ratio` reserves layout for CLS.

```astro
---
import Ai14allReleaseLink from "~/components/Ai14allReleaseLink.astro";
import type { Flagship } from "~/lib/flagships";

interface Props {
	flagship: Flagship;
}
const { flagship } = Astro.props;
const hp = flagship.data.homepage;
---

<section id="system" class="hero container">
	<p class="eyebrow"><strong>ai-14all</strong> · desktop mission control for coding agents</p>
	<h1 class="display">{hp.headline}</h1>
	<p class="sub">{hp.summary}</p>
	<div class="ctas">
		<span class="cta-desktop">
			<Ai14allReleaseLink kind="releasePage" variant="button" label={hp.desktopCta.label} />
		</span>
		<a class="btn primary cta-mobile" href={hp.mobileCta.href}>{hp.mobileCta.label}</a>
		<a class="btn ghost" href="#how">see how it works</a>
	</div>
	<p class="fine">{hp.availability} now · source-available · macOS universal + windows x64</p>
	<div class="frame-wrap">
		<div class="frame">
			<video
				src="/ai-14all/hero-tour.mp4"
				poster="/ai-14all/hero-tour-poster.jpg"
				controls
				playsinline
				preload="none"
				aria-label="guided tour of the real ai-14all app: worktree sidebar, parallel agent terminals, inline review"
			></video>
		</div>
		<p class="frame-cap">
			click to play — a 21-second guided tour of the real app: worktrees → parallel agents →
			inline review
		</p>
	</div>
</section>

<style>
	.hero {
		padding-top: var(--s-12);
		text-align: center;
	}
	.eyebrow {
		font-size: var(--fs-sm);
		letter-spacing: 0.06em;
		color: var(--fg-muted);
	}
	.eyebrow strong {
		color: var(--fg);
		font-weight: 600;
	}
	.display {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: var(--fs-display);
		line-height: 1.12;
		text-wrap: balance;
		max-width: 24ch;
		margin: var(--s-4) auto 0;
	}
	.sub {
		margin: var(--s-4) auto 0;
		color: var(--fg-dim);
		max-width: 62ch;
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
	.cta-desktop {
		display: contents;
	}
	.cta-mobile {
		display: none;
	}
	.fine {
		margin-top: var(--s-4);
		font-size: var(--fs-xs);
		color: var(--fg-muted);
	}
	.frame-wrap {
		margin-top: var(--s-8);
	}
	.frame {
		border: 1px solid var(--border);
		border-radius: 6px;
		overflow: hidden;
		box-shadow:
			0 0 0 1px rgba(255, 129, 99, 0.06),
			0 24px 80px rgba(0, 0, 0, 0.55),
			0 4px 24px rgba(255, 129, 99, 0.05);
	}
	.frame video {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1600 / 844;
	}
	.frame-cap {
		margin-top: var(--s-3);
		font-size: var(--fs-xs);
		color: var(--fg-muted);
	}
	@media (max-width: 899px) {
		.cta-desktop {
			display: none;
		}
		.cta-mobile {
			display: inline-block;
		}
	}
</style>
```

- [ ] **Step 2: Write `src/components/HowItWorks.astro`**

Copy is spec §4.2 verbatim. The status phrases are colored spans — the words carry the meaning, color is reinforcement only. Keep `</span>,` adjacency exactly as written so rendered text normalizes cleanly.

```astro
<section id="how" class="sect container">
	<p class="label">how it works</p>
	<h2 class="title">three moves, one window.</h2>
	<div class="steps">
		<div class="step">
			<p class="num">01</p>
			<h3>fan out</h3>
			<p>
				hand one task to three agents — or three tasks to three agents. each runs in its own
				git worktree: own branch, own terminal, no collisions.
			</p>
		</div>
		<div class="step">
			<p class="num">02</p>
			<h3>stay oriented</h3>
			<p>
				the sidebar is mission control: <span class="st w">working · quiet</span>,
				<span class="st r">ready · tests passed</span>,
				<span class="st n">waiting · needs a decision</span>. glance, don't babysit.
			</p>
		</div>
		<div class="step">
			<p class="num">03</p>
			<h3>review inline</h3>
			<p>
				highlight a line in the diff, leave a comment — the agent picks it up and fixes in
				place. no PR round-trip, no copy-paste.
			</p>
		</div>
	</div>
</section>

<style>
	.sect {
		border-top: 1px solid var(--border);
		margin-top: var(--s-12);
		padding-top: var(--s-8);
		padding-bottom: var(--s-4);
	}
	.label {
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--fg-muted);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(24px, 3.4vw, 34px);
		line-height: 1.15;
		margin-top: var(--s-3);
		text-wrap: balance;
	}
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s-8);
		margin-top: var(--s-8);
	}
	.step .num {
		color: var(--accent);
		font-weight: 600;
		font-size: var(--fs-sm);
	}
	.step h3 {
		margin-top: var(--s-2);
		font-size: var(--fs-h3);
	}
	.step p:not(.num) {
		margin-top: var(--s-3);
		color: var(--fg-dim);
		font-size: var(--fs-sm);
	}
	.st {
		font-weight: 600;
	}
	.st.w {
		color: var(--status-idle);
	}
	.st.r {
		color: var(--status-done);
	}
	.st.n {
		color: var(--status-waiting);
	}
	@media (max-width: 899px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
```

- [ ] **Step 3: Type-check, lint, format**

Run: `pnpm check && pnpm lint && pnpm format && pnpm format:check`
Expected: all pass (components are not yet composed; `astro check` still validates them).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero14all.astro src/components/HowItWorks.astro
git commit -m "feat(home): Hero14all and HowItWorks sections"
```

---

### Task 5: HomeFeatures + LoopExtends components

**Files:**

- Create: `src/components/HomeFeatures.astro`
- Create: `src/components/LoopExtends.astro`

**Interfaces:**

- Consumes: `Flagship` type; Task 1 frontmatter values (chip from `availability`, pitch from `headline`, body from `summary`, ghost CTA from `desktopCta`).
- Produces: `HomeFeatures` with no props rendering `section#features` (classes `.label .feats .feat`; card headings are `<h3>` per spec §9); `LoopExtends` with `Props { xavier: Flagship; samantha: Flagship }` rendering `section#ecosystem` whose **first element child** is the legacy `span#products` anchor, with cards `.room.xavier` / `.room.samantha` (classes `.head .chip .pitch .body .act`) and named visual slots `xavier-visual` / `samantha-visual` (empty in the interim state per spec §2.5 — filling them later must need no restructuring).

- [ ] **Step 1: Write `src/components/HomeFeatures.astro`**

Copy is spec §4.3 verbatim. The `id="features"` exists for guard scoping only — it is not a nav target.

```astro
<section id="features" class="sect container">
	<p class="label">and while they work</p>
	<div class="feats">
		<div class="feat">
			<h3>browse and verify without leaving</h3>
			<span>file view, diff review, and jump-to-symbol built in.</span>
		</div>
		<div class="feat">
			<h3>compose the ecosystem</h3>
			<span>ai-cortex remembers your codebase, ai-whisper runs autonomous workflows.</span>
		</div>
		<div class="feat">
			<h3>track what agents cost</h3>
			<span>estimated per-session token and spend telemetry.</span>
		</div>
	</div>
</section>

<style>
	.sect {
		border-top: 1px solid var(--border);
		margin-top: var(--s-12);
		padding-top: var(--s-8);
		padding-bottom: var(--s-4);
	}
	.label {
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--fg-muted);
	}
	.feats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--s-6);
		margin-top: var(--s-8);
	}
	.feat {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-4);
		background: var(--bg-raised);
	}
	.feat h3 {
		font-size: var(--fs-base);
	}
	.feat span {
		display: block;
		margin-top: var(--s-2);
		color: var(--fg-dim);
		font-size: var(--fs-sm);
	}
	@media (max-width: 899px) {
		.feats {
			grid-template-columns: 1fr;
		}
	}
</style>
```

- [ ] **Step 2: Write `src/components/LoopExtends.astro`**

Section title/label are spec §4.4 verbatim; card content renders from frontmatter, never hardcoded. The `span#products` legacy anchor MUST stay the first element child of `#ecosystem` (guard-asserted, Task 7).

```astro
---
import type { Flagship } from "~/lib/flagships";

interface Props {
	xavier: Flagship;
	samantha: Flagship;
}
const { xavier, samantha } = Astro.props;
const xhp = xavier.data.homepage;
const shp = samantha.data.homepage;
---

<section id="ecosystem" class="sect container">
	<span id="products" class="legacy-anchor" aria-hidden="true"></span>
	<p class="label">the loop extends</p>
	<h2 class="title">14all is the desk. the loop follows you off it.</h2>
	<div class="duo">
		<article class="room xavier">
			<slot name="xavier-visual" />
			<div class="head">
				<h3>{xavier.data.name}</h3>
				<span class="chip soon">{xhp.availability}</span>
			</div>
			<p class="pitch">{xhp.headline}</p>
			<p class="body">{xhp.summary}</p>
			<p class="act">
				<a class="btn ghost" href={xhp.desktopCta.href}>{xhp.desktopCta.label}</a>
			</p>
		</article>
		<article class="room samantha">
			<slot name="samantha-visual" />
			<div class="head">
				<h3>{samantha.data.name}</h3>
				<span class="chip early">{shp.availability}</span>
			</div>
			<p class="pitch">{shp.headline}</p>
			<p class="body">{shp.summary}</p>
			<p class="act">
				<a class="btn ghost" href={shp.desktopCta.href}>{shp.desktopCta.label}</a>
			</p>
		</article>
	</div>
</section>

<style>
	.sect {
		border-top: 1px solid var(--border);
		margin-top: var(--s-12);
		padding-top: var(--s-8);
		padding-bottom: var(--s-4);
	}
	.legacy-anchor {
		display: block;
		height: 0;
	}
	.label {
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--fg-muted);
	}
	.title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(24px, 3.4vw, 34px);
		line-height: 1.15;
		margin-top: var(--s-3);
		text-wrap: balance;
	}
	.duo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-6);
		margin-top: var(--s-8);
	}
	.room {
		border-radius: var(--radius);
		padding: var(--s-6);
	}
	.room.xavier {
		background: rgba(var(--tint-xavier), 0.05);
		border: 1px solid rgba(var(--tint-xavier), 0.2);
	}
	.room.samantha {
		background: rgba(var(--tint-samantha), 0.05);
		border: 1px solid rgba(var(--tint-samantha), 0.2);
	}
	.head {
		display: flex;
		align-items: center;
		gap: var(--s-3);
	}
	.chip {
		font-size: var(--fs-xs);
		border-radius: var(--radius);
		padding: 1px 8px;
	}
	.chip.soon {
		color: var(--status-waiting);
		border: 1px solid var(--status-waiting);
	}
	.chip.early {
		color: var(--status-ready);
		border: 1px solid var(--status-ready);
	}
	.pitch {
		margin-top: var(--s-3);
		color: var(--fg);
	}
	.body {
		margin-top: var(--s-2);
		color: var(--fg-dim);
		font-size: var(--fs-sm);
	}
	.act {
		margin-top: var(--s-4);
	}
	.btn {
		display: inline-block;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--s-3) var(--s-4);
		font-size: var(--fs-sm);
		font-weight: 600;
	}
	.btn.ghost {
		color: var(--fg);
	}
	.btn.ghost:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
	@media (max-width: 899px) {
		.duo {
			grid-template-columns: 1fr;
		}
	}
</style>
```

- [ ] **Step 3: Type-check, lint, format, commit**

```bash
pnpm check && pnpm lint && pnpm format && pnpm format:check
git add src/components/HomeFeatures.astro src/components/LoopExtends.astro
git commit -m "feat(home): HomeFeatures and LoopExtends sections with duo visual slots"
```

---

### Task 6: Recompose the homepage, nav, deletions, threshold amendments

**Files:**

- Modify: `src/pages/index.astro` (full replacement below)
- Modify: `src/components/LandingHeader.astro:9-12` and `:18-21` (nav links, both variants)
- Modify: `scripts/check-homepage-budget.mjs:5` and `:16` (ceiling comment + LIMIT)
- Modify: `lighthouserc.json` (LCP 1499 → 2499 provisional)
- Delete: `src/components/EcosystemHero.astro`, `FlagshipChapter.astro`, `Ai14allVisual.astro`, `XavierVisual.astro`, `SamanthaVisual.astro`

**Interfaces:**

- Consumes: `Hero14all { flagship }`, `HowItWorks`, `HomeFeatures`, `LoopExtends { xavier, samantha }` (Tasks 4–5); `getFlagships()` returns rank-sorted `[ai-14all, ai-xavier, ai-samantha]`.
- Produces: the shipped page composition and anchor/nav DOM that Tasks 7–9 assert. Legacy `id="system"` (hero) and `id="products"` (in LoopExtends) preserved.

- [ ] **Step 1: Replace `src/pages/index.astro` entirely**

```astro
---
import Base from "~/layouts/Base.astro";
import LandingHeader from "~/components/LandingHeader.astro";
import LandingFooter from "~/components/LandingFooter.astro";
import Hero14all from "~/components/Hero14all.astro";
import HowItWorks from "~/components/HowItWorks.astro";
import HomeFeatures from "~/components/HomeFeatures.astro";
import LoopExtends from "~/components/LoopExtends.astro";
import AutonomousLoop from "~/components/AutonomousLoop.astro";
import RecentlyShipped from "~/components/RecentlyShipped.astro";
import Creed from "~/components/Creed.astro";
import EngineRoom from "~/components/EngineRoom.astro";
import Ai14allReleaseLink from "~/components/Ai14allReleaseLink.astro";
import { getFlagships } from "~/lib/flagships";

// getFlagships() returns exactly the three flagships sorted by rank.
const [ai14all, xavier, samantha] = await getFlagships();
---

<Base
	title="ai-creed — your coding agents, under your command"
	description="a local-first system for supervising coding agents—from desktop control to mobile presence and ambient voice."
	ogImage="/og-home.png"
	wide
>
	<LandingHeader slot="header" />

	<Hero14all flagship={ai14all} />
	<HowItWorks />
	<HomeFeatures />
	<LoopExtends xavier={xavier} samantha={samantha} />

	<AutonomousLoop />
	<RecentlyShipped />
	<Creed />
	<EngineRoom />

	<section class="closing container">
		<h2 class="display">run your agents in ai-14all. stay for the loop we're building.</h2>
		<div class="ctas">
			<span class="cta-desktop">
				<Ai14allReleaseLink kind="releasePage" variant="button" label="download ai-14all" />
			</span>
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
	.cta-desktop {
		display: contents;
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

- [ ] **Step 2: Update both nav variants in `src/components/LandingHeader.astro`**

In the `.nav-desktop` nav, replace the four fragment links with:

```html
<a href="#how">how it works</a>
<a href="#ecosystem">the ecosystem</a>
<a href="#north-star">north star</a>
<a href="#creed">creed</a>
```

In the `.nav-mobile` `<nav>`, replace its four fragment links with the identical four lines. The desktop `Ai14allReleaseLink` and the mobile `a.cta` line stay exactly as they are.

- [ ] **Step 3: Amend the byte budget (spec §8)**

In `scripts/check-homepage-budget.mjs`: change `const LIMIT = 102_400;` to `const LIMIT = 262_144;` and in the header comment replace `Ceiling: 102,400 bytes.` with `Ceiling: 262,144 bytes (256 KiB — raised 2026-07-29 for the real hero-tour poster, spec §8).`

- [ ] **Step 4: Set the provisional LCP threshold (spec §8)**

In `lighthouserc.json`, change the `largest-contentful-paint` line `{ "maxNumericValue": 1499, ... }` to `{ "maxNumericValue": 2499, "aggregationMethod": "median-run" }`. Task 9 ratchets this down to the measured value.

- [ ] **Step 5: Verify the old components are orphaned, then delete them**

Run: `grep -rln "EcosystemHero\|FlagshipChapter\|Ai14allVisual\|XavierVisual\|SamanthaVisual" src`
Expected output: only `src/components/EcosystemHero.astro` (self-references to the visuals) — `index.astro` no longer matches after Step 1. If ANY other file matches, stop and keep that component; otherwise:

```bash
git rm src/components/EcosystemHero.astro src/components/FlagshipChapter.astro src/components/Ai14allVisual.astro src/components/XavierVisual.astro src/components/SamanthaVisual.astro
```

- [ ] **Step 6: Build and run the existing guard suite**

Run: `pnpm build && pnpm check && pnpm lint && pnpm check:media && pnpm check:budget && pnpm check:a11y`
Expected: all pass. Then spot-check the anchors in dist:

Run: `grep -c 'id="system"' dist/index.html && grep -c 'id="products"' dist/index.html && grep -c 'id="how"' dist/index.html && grep -c 'id="ecosystem"' dist/index.html`
Expected: `1` four times.

- [ ] **Step 7: Format and commit**

```bash
pnpm format && pnpm format:check
git add -A
git commit -m "feat(home): 14all-first restructure — hero tour, how-it-works, features, loop-extends"
```

---

### Task 7: `check:copy` guard + CI wiring

**Files:**

- Create: `scripts/check-homepage-copy.mjs`
- Modify: `package.json` (add the `check:copy` script)
- Modify: `.github/workflows/deploy.yml` (run it in the deploy gate)

**Interfaces:**

- Consumes: the built page DOM from Task 6 (ids `system/how/features/ecosystem/products`, classes named in Tasks 4–5, `header.lh`, `section.closing`).
- Produces: `pnpm check:copy` — rendered-DOM guard for spec §11.2 (markup-layer per-region + total CTA counts), §11.3 (selector-scoped verbatim copy with computed visibility + video `aria-label`), §11.4 (anchor + nav integrity). Task 9 runs it in the final suite.

- [ ] **Step 1: Write `scripts/check-homepage-copy.mjs`**

```js
// Homepage contract guard (spec 2026-07-29 §11.2–§11.4): binding copy, CTA
// distribution, nav labels, and anchor integrity — asserted on the RENDERED
// page in headless chromium at both 1440x900 and 390x844, because computed
// visibility matters (a static HTML parse cannot see it). Never regex
// substring matching. Run after `pnpm build`.
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const MIME = {
	".html": "text/html",
	".css": "text/css",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".mp4": "video/mp4",
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

// Binding copy (spec §4, verbatim): selector → expected normalized text.
// visible: "both" | "desktop" | "mobile" — where the element must be rendered
// visible; when not "both" it must be hidden at the other viewport.
const COPY = [
	{
		sel: "#system .eyebrow",
		text: "ai-14all · desktop mission control for coding agents",
		visible: "both",
	},
	{ sel: "#system h1", text: "ship with a fleet, not a single agent.", visible: "both" },
	{
		sel: "#system .sub",
		text: "run claude, codex, and more in parallel — each agent in its own git worktree, with its own branch and terminal. see who needs you at a glance, review diffs inline, stay in one window.",
		visible: "both",
	},
	{
		sel: '#system a[data-dl-origin="ai14all-downloads"]',
		text: "download ai-14all",
		visible: "desktop",
	},
	{
		sel: '#system a[href="/projects/ai-14all#download"]',
		text: "get ai-14all",
		visible: "mobile",
	},
	{ sel: '#system a[href="#how"]', text: "see how it works", visible: "both" },
	{
		sel: "#system .fine",
		text: "shipping now · source-available · macOS universal + windows x64",
		visible: "both",
	},
	{
		sel: "#system .frame-cap",
		text: "click to play — a 21-second guided tour of the real app: worktrees → parallel agents → inline review",
		visible: "both",
	},
	{ sel: "#how .label", text: "how it works", visible: "both" },
	{ sel: "#how h2", text: "three moves, one window.", visible: "both" },
	{ sel: "#how .step:nth-child(1) .num", text: "01", visible: "both" },
	{ sel: "#how .step:nth-child(2) .num", text: "02", visible: "both" },
	{ sel: "#how .step:nth-child(3) .num", text: "03", visible: "both" },
	{ sel: "#how .step:nth-child(1) h3", text: "fan out", visible: "both" },
	{
		sel: "#how .step:nth-child(1) p:not(.num)",
		text: "hand one task to three agents — or three tasks to three agents. each runs in its own git worktree: own branch, own terminal, no collisions.",
		visible: "both",
	},
	{ sel: "#how .step:nth-child(2) h3", text: "stay oriented", visible: "both" },
	{
		sel: "#how .step:nth-child(2) p:not(.num)",
		text: "the sidebar is mission control: working · quiet, ready · tests passed, waiting · needs a decision. glance, don't babysit.",
		visible: "both",
	},
	{ sel: "#how .step:nth-child(3) h3", text: "review inline", visible: "both" },
	{
		sel: "#how .step:nth-child(3) p:not(.num)",
		text: "highlight a line in the diff, leave a comment — the agent picks it up and fixes in place. no PR round-trip, no copy-paste.",
		visible: "both",
	},
	{ sel: "#features .label", text: "and while they work", visible: "both" },
	{
		sel: "#features .feat:nth-child(1) h3",
		text: "browse and verify without leaving",
		visible: "both",
	},
	{
		sel: "#features .feat:nth-child(1) span",
		text: "file view, diff review, and jump-to-symbol built in.",
		visible: "both",
	},
	{ sel: "#features .feat:nth-child(2) h3", text: "compose the ecosystem", visible: "both" },
	{
		sel: "#features .feat:nth-child(2) span",
		text: "ai-cortex remembers your codebase, ai-whisper runs autonomous workflows.",
		visible: "both",
	},
	{ sel: "#features .feat:nth-child(3) h3", text: "track what agents cost", visible: "both" },
	{
		sel: "#features .feat:nth-child(3) span",
		text: "estimated per-session token and spend telemetry.",
		visible: "both",
	},
	{ sel: "#ecosystem .label", text: "the loop extends", visible: "both" },
	{
		sel: "#ecosystem h2",
		text: "14all is the desk. the loop follows you off it.",
		visible: "both",
	},
	{ sel: "#ecosystem .room.xavier h3", text: "ai-xavier", visible: "both" },
	{ sel: "#ecosystem .room.xavier .chip", text: "coming soon", visible: "both" },
	{ sel: "#ecosystem .room.xavier .pitch", text: "your phone is presence.", visible: "both" },
	{
		sel: "#ecosystem .room.xavier .body",
		text: "watch live terminals, answer the prompt that is blocking an agent, steer, or interrupt — from anywhere.",
		visible: "both",
	},
	{ sel: "#ecosystem .room.xavier .act a", text: "learn about ai-xavier", visible: "both" },
	{ sel: "#ecosystem .room.samantha h3", text: "ai-samantha", visible: "both" },
	{ sel: "#ecosystem .room.samantha .chip", text: "early access", visible: "both" },
	{ sel: "#ecosystem .room.samantha .pitch", text: "supervision, out loud.", visible: "both" },
	{
		sel: "#ecosystem .room.samantha .body",
		text: "she watches the same sessions you do and answers out loud — speech recognition and voice synthesis run fully on your machine.",
		visible: "both",
	},
	{ sel: "#ecosystem .room.samantha .act a", text: "request early access", visible: "both" },
];

// spec §6 — both nav variants must carry exactly these fragment links, in order.
const NAV = [
	["how it works", "#how"],
	["the ecosystem", "#ecosystem"],
	["north star", "#north-star"],
	["creed", "#creed"],
];
const NAV_SCOPES = ["header.lh .nav-desktop", "header.lh .nav-mobile nav"];
const VIDEO_ARIA =
	"guided tour of the real ai-14all app: worktree sidebar, parallel agent terminals, inline review";
const REGIONS = ["header.lh", "#system", "section.closing"];
const VIEWPORTS = [
	{ width: 1440, height: 900, key: "desktop" },
	{ width: 390, height: 844, key: "mobile" },
];

const errors = [];
const browser = await chromium.launch();
for (const viewport of VIEWPORTS) {
	const page = await browser.newPage({ viewport });
	await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
	const found = await page.evaluate(
		({ COPY, NAV_SCOPES, REGIONS }) => {
			// whitespace-normalize; strip pre-punctuation spaces that are pure
			// markup artifacts (a line break between an inline span and a comma)
			const norm = (s) =>
				s
					.replace(/\s+/g, " ")
					.replace(/\s+([,.])/g, "$1")
					.trim();
			const isVisible = (el) => {
				const cs = getComputedStyle(el);
				if (cs.display === "none" || cs.visibility === "hidden") return false;
				const r = el.getBoundingClientRect();
				return r.width > 1 && r.height > 1;
			};
			const copy = COPY.map((entry) => {
				const els = [...document.querySelectorAll(entry.sel)];
				return {
					count: els.length,
					text: els[0] ? norm(els[0].textContent) : null,
					visible: els[0] ? isVisible(els[0]) : false,
				};
			});
			const nav = NAV_SCOPES.map((scope) => ({
				scope,
				links: [...document.querySelectorAll(`${scope} a[href^="#"]`)].map((a) => [
					norm(a.textContent),
					a.getAttribute("href"),
				]),
			}));
			const regions = REGIONS.map((region) => {
				const root = document.querySelector(region);
				return {
					region,
					exists: !!root,
					desktop: root
						? root.querySelectorAll('a[data-dl-origin="ai14all-downloads"]').length
						: 0,
					mobile: root
						? root.querySelectorAll('a[href="/projects/ai-14all#download"]').length
						: 0,
				};
			});
			const totals = {
				desktop: document.querySelectorAll('a[data-dl-origin="ai14all-downloads"]').length,
				mobile: document.querySelectorAll('a[href="/projects/ai-14all#download"]').length,
			};
			// spec §11.2 "nothing else coral-download on the page": every anchor
			// painted with the accent fill must be one of the two approved forms —
			// computed style, so a novel class cannot slip a seventh coral CTA in.
			const coralLinks = [...document.querySelectorAll("a")].filter(
				(el) => getComputedStyle(el).backgroundColor === "rgb(255, 129, 99)",
			);
			const coralStray = coralLinks
				.filter(
					(el) =>
						el.getAttribute("data-dl-origin") !== "ai14all-downloads" &&
						el.getAttribute("href") !== "/projects/ai-14all#download",
				)
				.map((el) => el.getAttribute("href") ?? "(no href)");
			const coralTotal = coralLinks.length;
			const anchors = [];
			for (const a of document.querySelectorAll('a[href^="#"]')) {
				const id = a.getAttribute("href").slice(1);
				if (id && !document.getElementById(id)) anchors.push(a.getAttribute("href"));
			}
			const video = document.querySelector("#system video");
			const hero = document.getElementById("system");
			const eco = document.getElementById("ecosystem");
			return {
				copy,
				nav,
				regions,
				totals,
				coralStray,
				coralTotal,
				anchors,
				videoAria: video ? video.getAttribute("aria-label") : null,
				heroIsSection: !!hero && hero.tagName === "SECTION" && !!hero.querySelector("h1"),
				productsFirst: !!eco && eco.firstElementChild?.id === "products",
			};
		},
		{ COPY, NAV_SCOPES, REGIONS },
	);

	for (let i = 0; i < COPY.length; i++) {
		const want = COPY[i];
		const got = found.copy[i];
		if (got.count !== 1) {
			errors.push(`@${viewport.key} ${want.sel}: expected exactly 1 match, got ${got.count}`);
			continue;
		}
		if (got.text !== want.text) {
			errors.push(`@${viewport.key} ${want.sel}: text mismatch — got "${got.text}"`);
		}
		const mustBeVisible = want.visible === "both" || want.visible === viewport.key;
		if (mustBeVisible && !got.visible) {
			errors.push(`@${viewport.key} ${want.sel}: must be rendered visible here`);
		}
		if (!mustBeVisible && got.visible) {
			errors.push(`@${viewport.key} ${want.sel}: must be hidden at this viewport`);
		}
	}
	for (const { scope, links } of found.nav) {
		if (JSON.stringify(links) !== JSON.stringify(NAV)) {
			errors.push(
				`@${viewport.key} ${scope}: fragment links must be exactly ${JSON.stringify(NAV)}, got ${JSON.stringify(links)}`,
			);
		}
	}
	for (const r of found.regions) {
		if (!r.exists) {
			errors.push(`@${viewport.key} region ${r.region}: missing`);
			continue;
		}
		if (r.desktop !== 1) {
			errors.push(
				`@${viewport.key} ${r.region}: expected exactly 1 data-dl-origin link, got ${r.desktop}`,
			);
		}
		if (r.mobile !== 1) {
			errors.push(
				`@${viewport.key} ${r.region}: expected exactly 1 mobile route link, got ${r.mobile}`,
			);
		}
	}
	if (found.totals.desktop !== 3) {
		errors.push(
			`@${viewport.key}: expected 3 data-dl-origin links total, got ${found.totals.desktop}`,
		);
	}
	if (found.totals.mobile !== 3) {
		errors.push(
			`@${viewport.key}: expected 3 mobile route links total, got ${found.totals.mobile}`,
		);
	}
	if (found.coralTotal !== 6) {
		errors.push(
			`@${viewport.key}: expected exactly 6 coral-filled links (3 desktop + 3 mobile), got ${found.coralTotal}`,
		);
	}
	for (const href of found.coralStray) {
		errors.push(`@${viewport.key}: coral-filled link with unapproved destination: ${href}`);
	}
	for (const bad of found.anchors) {
		errors.push(`@${viewport.key}: in-page link ${bad} has no matching id`);
	}
	if (found.videoAria !== VIDEO_ARIA) {
		errors.push(`@${viewport.key}: hero video aria-label mismatch — got "${found.videoAria}"`);
	}
	if (!found.heroIsSection) {
		errors.push(`@${viewport.key}: id="system" must be the hero <section> containing the h1`);
	}
	if (!found.productsFirst) {
		errors.push(
			`@${viewport.key}: id="products" must be the first element child of #ecosystem`,
		);
	}
	await page.close();
}
await browser.close();
server.close();

if (errors.length) {
	console.error(`check:copy FAILED (${errors.length}):\n` + errors.join("\n"));
	process.exit(1);
}
console.log(
	`check:copy ok — ${COPY.length} copy entries × 2 viewports; nav, CTA regions, coral exclusivity, anchors, aria-label verified`,
);
```

- [ ] **Step 2: Wire it into `package.json` and the deploy gate**

In `package.json` scripts, add after the `check:a11y` line:

```json
		"check:copy": "node scripts/check-homepage-copy.mjs",
```

In `.github/workflows/deploy.yml`, add after the `Accessibility guard` step (chromium is already installed by then) and before `Lighthouse`:

```yaml
- name: Copy guard
  run: pnpm run check:copy
```

- [ ] **Step 3: Run the guard — verify it passes**

Run: `pnpm check:copy`
Expected: `check:copy ok — 38 copy entries × 2 viewports; nav, CTA regions, coral exclusivity, anchors, aria-label verified`

- [ ] **Step 4: Mutation-test the guard (red), then restore (green)**

```bash
node -e 'const fs=require("fs"),f="dist/index.html";fs.writeFileSync(f,fs.readFileSync(f,"utf8").replace("ship with a fleet","sail with a fleet"))'
pnpm check:copy   # expect FAIL: "#system h1: text mismatch"
pnpm build
pnpm check:copy   # expect ok
```

Expected: exactly that failure, then a pass after rebuild. If the mutated run passes, the guard is broken — fix before continuing.

- [ ] **Step 5: Format and commit**

```bash
pnpm format && pnpm format:check
git add scripts/check-homepage-copy.mjs package.json .github/workflows/deploy.yml
git commit -m "test(guards): check:copy — rendered copy, CTA distribution, nav and anchor contracts"
```

---

### Task 8: Extend `check:media` (playsinline) and `check:a11y` (CTA visibility)

**Files:**

- Modify: `scripts/check-media.mjs:22-24` (add the video-only assertion)
- Modify: `scripts/check-a11y.mjs:74-100` region (add the homepage CTA-visibility block after the 390px `<details>`-opening block)

**Interfaces:**

- Consumes: Task 6's built page; the existing guard harnesses.
- Produces: `check:media` fails any dist `<video>` without a real `playsinline` attribute (spec §5, attribute-name tokenization); `check:a11y` enforces spec §11.2's rendered layer — exactly 2 download CTAs in the 1440×900 first viewport, exactly 3 visible over the complete page at both viewports, and zero visible coral-filled links outside the two approved forms.

- [ ] **Step 1: Add the `playsinline` assertion to `scripts/check-media.mjs`**

After the existing poster check inside the tag loop, add an
attribute-token check. A plain word-boundary regex would also accept
`data-playsinline="false"` or the word inside an attribute VALUE, so the
tag is tokenized into attribute NAMES first (values blanked out):

```js
if (/<video/i.test(tag)) {
	const attrNames = tag
		.replace(/"[^"]*"/g, '""') // blank out attribute values
		.replace(/^<\w+/, "")
		.replace(/\/?>$/, "")
		.split(/\s+/)
		.map((a) => a.split("=")[0].toLowerCase())
		.filter(Boolean);
	if (!attrNames.includes("playsinline")) errors.push(`playsinline required — ${where}`);
}
```

- [ ] **Step 2: Add the download-CTA visibility block to `scripts/check-a11y.mjs`**

Inside the route loop, AFTER the `if (viewport.width === 390) { ... }` undersized-targets block (ordering matters: at 390 the `<details>` menu was just opened, which is the state the mobile counts are defined against — spec §11.2), add:

```js
if (route === "/") {
	// spec 2026-07-29 §11.2 rendered layer: download-CTA visibility.
	const dl = await page.evaluate(() => {
		const isVisible = (el) => {
			const cs = getComputedStyle(el);
			if (cs.display === "none" || cs.visibility === "hidden") return false;
			const r = el.getBoundingClientRect();
			return r.width > 1 && r.height > 1;
		};
		const links = [
			...document.querySelectorAll(
				'a[data-dl-origin="ai14all-downloads"], a[href="/projects/ai-14all#download"]',
			),
		].filter(isVisible);
		// coral exclusivity (spec §11.2): no VISIBLE accent-filled anchor may
		// exist outside the two approved forms — computed style, not classes.
		const strayCoral = [...document.querySelectorAll("a")].filter(
			(el) =>
				getComputedStyle(el).backgroundColor === "rgb(255, 129, 99)" &&
				isVisible(el) &&
				el.getAttribute("data-dl-origin") !== "ai14all-downloads" &&
				el.getAttribute("href") !== "/projects/ai-14all#download",
		).length;
		return {
			total: links.length,
			strayCoral,
			firstViewport: links.filter((el) => {
				const r = el.getBoundingClientRect();
				return r.top < innerHeight && r.bottom > 0;
			}).length,
		};
	});
	if (dl.total !== 3) {
		errors.push(
			`/ @${viewport.width}px: expected exactly 3 visible download CTAs on the full page, got ${dl.total}`,
		);
	}
	if (dl.strayCoral !== 0) {
		errors.push(
			`/ @${viewport.width}px: ${dl.strayCoral} visible coral-filled link(s) outside the approved download forms`,
		);
	}
	if (viewport.width === 1440 && dl.firstViewport !== 2) {
		errors.push(
			`/ @1440px: expected exactly 2 download CTAs in the first viewport, got ${dl.firstViewport}`,
		);
	}
}
```

- [ ] **Step 3: Run both guards — verify green**

Run: `pnpm check:media && pnpm check:a11y`
Expected: both pass (the hero and the project-page videos all carry `playsinline`; the page shows header+hero CTAs in the first desktop viewport and one pair per region overall).

- [ ] **Step 4: Mutation-test both extensions (red), then restore (green)**

```bash
node -e 'const fs=require("fs"),f="dist/index.html";fs.writeFileSync(f,fs.readFileSync(f,"utf8").replace(" playsinline",""))'
pnpm check:media   # expect FAIL: "playsinline required"
node -e 'const fs=require("fs"),f="dist/index.html";fs.writeFileSync(f,fs.readFileSync(f,"utf8").replace(`class="btn primary cta-mobile"`,`class="btn primary cta-mobile" style="display:none"`))'
pnpm check:a11y    # expect FAIL: "expected exactly 3 visible download CTAs"
pnpm build
pnpm check:media && pnpm check:a11y   # expect both ok
```

Expected: the two named failures, then green after rebuild. (The second mutation hides one mobile CTA via inline style; the 390px full-page count drops to 2.)

- [ ] **Step 5: Format and commit**

```bash
pnpm format && pnpm format:check
git add scripts/check-media.mjs scripts/check-a11y.mjs
git commit -m "test(guards): enforce playsinline and download-CTA visibility counts"
```

---

### Task 9: LCP ratchet, evidence screenshots, full-suite verification

**Files:**

- Modify: `lighthouserc.json` (2499 → measured ratchet)
- Create: `docs/superpowers/evidence/2026-07-29-landing-restructure/home-1440x900.png`, `home-390x844.png`

**Interfaces:**

- Consumes: everything above; `.lighthouseci/lhr-*.json` written by `lhci autorun`.
- Produces: the final committed thresholds and the §11.5 comprehension evidence the workflow reviewer judges.

- [ ] **Step 1: Run Lighthouse against the provisional threshold**

Run: `pnpm build && pnpm lighthouse`
Expected: PASS (perf ≥ 0.95, LCP ≤ 2499, CLS ≤ 0.019, median of 3 runs).

- [ ] **Step 2: Compute the ratcheted LCP threshold (spec §8: `min(2499, ceil(median × 1.15))`)**

```bash
node -e '
const fs=require("fs");
const vals=fs.readdirSync(".lighthouseci").filter(f=>/^lhr-.*\.json$/.test(f))
  .map(f=>JSON.parse(fs.readFileSync(".lighthouseci/"+f,"utf8")).audits["largest-contentful-paint"].numericValue)
  .sort((a,b)=>a-b);
const median=vals[Math.floor(vals.length/2)];
console.log(JSON.stringify({runs:vals.map(Math.round),median:Math.round(median),ratchet:Math.min(2499,Math.ceil(median*1.15))}));
'
```

Expected: a JSON line with three run values, the median, and the ratchet. Edit `lighthouserc.json`: set `largest-contentful-paint` `maxNumericValue` to the printed `ratchet` value.

- [ ] **Step 3: Re-run Lighthouse against the ratcheted threshold**

Run: `pnpm lighthouse`
Expected: PASS. If it flakes below the ratchet on a re-run, re-measure once (repeat Step 2 with the fresh runs) — never raise above 2499.

- [ ] **Step 4: Capture the §11.5 comprehension evidence**

```bash
mkdir -p docs/superpowers/evidence/2026-07-29-landing-restructure
node --input-type=module - <<'EOF'
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "playwright";
const MIME = { ".html": "text/html", ".css": "text/css", ".svg": "image/svg+xml",
	".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon",
	".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = createServer((req, res) => {
	let p = join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
	if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
	if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
	res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
	res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const browser = await chromium.launch();
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
	const page = await browser.newPage({ viewport: vp });
	await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
	await page.screenshot({
		path: `docs/superpowers/evidence/2026-07-29-landing-restructure/home-${vp.width}x${vp.height}.png`,
		fullPage: true,
	});
	await page.close();
}
await browser.close();
server.close();
console.log("evidence captured");
EOF
```

Expected: both PNGs exist and open to the full new page.

- [ ] **Step 5: Run the complete verification suite**

Run: `pnpm check && pnpm lint && pnpm format:check && pnpm build && pnpm check:media && pnpm check:budget && pnpm check:downloads && pnpm check:a11y && pnpm check:copy && pnpm lighthouse`
Expected: every command green. This satisfies spec §11.1–§11.4; §11.5 is satisfied by the committed screenshots being judged in workflow review.

- [ ] **Step 6: Commit**

```bash
git add lighthouserc.json docs/superpowers/evidence/2026-07-29-landing-restructure
git commit -m "test(guards): ratchet LCP to measured median x1.15; commit comprehension evidence"
```

---

## Success criteria mapping (spec §11)

1. Six guards green — Task 9 Step 5.
2. CTA counts, markup + rendered layers — Task 7 (per-region/total), Task 8 (visibility).
3. Verbatim copy at the rendered semantic layer — Task 7 (COPY table + `aria-label`).
4. Anchor + nav integrity, positional legacy ids — Task 7.
5. Comprehension evidence — Task 9 Step 4 screenshots, judged by the workflow reviewer.
