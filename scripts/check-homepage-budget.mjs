// Homepage initial-transfer budget (spec §9/§10): document + every automatically
// fetched subresource — stylesheets, preload targets, icons (plus /favicon.ico if
// present), images and video posters; srcset counts its LARGEST candidate so the
// measurement upper-bounds real transfer on every device. Only preload="none"
// media payloads are excluded. gzip via Node zlib defaults. Ceiling: 262,144 bytes
// (256 KiB — raised 2026-07-29 for the real hero-tour poster, spec §8).
// Zero-JS (spec §7.3): any <script> tag on the homepage fails the check outright;
// script src / modulepreload resources are still counted so the budget stays an
// upper bound even if that rule is ever relaxed. External (cross-origin) auto-
// fetched resources cannot be measured from dist, so they are forbidden outright.
// Relative URLs resolve against the referencing document or stylesheet.
// CSS is traversed recursively, including quoted @import chains, and inline
// <style> elements / style attributes are scanned with the same resolver.
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";

const LIMIT = 262_144;
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

// CSS discovery covers ALL carriers — linked stylesheets, inline <style>
// elements, and style="" attributes — with one recursive resolver. Both
// url(...) and quoted @import "…" forms are parsed; locally imported
// stylesheets join the worklist; external references hit the same
// forbidden-externals gate as everything else.
const scanCssText = (cssText, basePath) => {
	for (const [, , u] of cssText.matchAll(/url\((["']?)([^)"']+)\1\)/g)) take(u, basePath);
	for (const [, , u] of cssText.matchAll(/@import\s+(["'])([^"']+)\1/g)) take(u, basePath);
};
const unescapeAttr = (s) =>
	s
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&");
for (const [, cssText] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
	scanCssText(cssText, "/index.html");
}
for (const [, cssText] of html.matchAll(/\bstyle="([^"]*)"/gi)) {
	scanCssText(unescapeAttr(cssText), "/index.html");
}
const cssQueue = [...urls].filter((u) => u.endsWith(".css"));
const cssSeen = new Set(cssQueue);
while (cssQueue.length) {
	const css = cssQueue.shift();
	const p = `dist${css}`;
	if (!existsSync(p)) continue; // reported as missing by the accounting loop
	scanCssText(readFileSync(p, "utf8"), css);
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
