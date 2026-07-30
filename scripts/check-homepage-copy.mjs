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
				// effective opacity: opacity composites rather than inheriting, so a
				// transparent ANCESTOR hides the element without appearing in its own
				// computed style — walk the chain and reject zero anywhere.
				for (let node = el; node; node = node.parentElement) {
					if (Number(getComputedStyle(node).opacity) === 0) return false;
				}
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
