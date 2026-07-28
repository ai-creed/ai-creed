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
