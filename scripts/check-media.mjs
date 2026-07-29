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
		if (/<video/i.test(tag)) {
			const attrNames = tag
				.replace(/"[^"]*"/g, '""') // blank out double-quoted values
				.replace(/'[^']*'/g, "''") // blank out single-quoted values
				.replace(/^<\w+/, "")
				.replace(/\/?>$/, "")
				.split(/\s+/)
				.map((a) => a.split("=")[0].toLowerCase())
				.filter(Boolean);
			if (!attrNames.includes("playsinline")) errors.push(`playsinline required — ${where}`);
		}
	}
}

if (errors.length) {
	console.error(`check:media FAILED (${errors.length}):\n` + errors.join("\n"));
	process.exit(1);
}
console.log(`check:media ok — ${pages.length} pages scanned`);
