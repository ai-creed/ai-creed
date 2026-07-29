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
		frameAt: "1.5", // settled establishing hold (0.567–2.5s; earlier frames catch a transient blank center pane)
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
