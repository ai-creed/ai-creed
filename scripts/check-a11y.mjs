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
