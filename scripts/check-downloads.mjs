// Download-contract guard (spec §5.3/§7.1/§10). Network-dependent by design;
// runs in CI before every deploy. Requires Node >= 22.6 for type stripping.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
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
const ASSET_ORIGIN_RE = /data-dl-origin="ai14all-downloads"/;
const PAGE_ORIGIN_RE = /data-dl-origin="(?:ai14all-downloads|recently-shipped)"/;
for (const page of pages) {
	const html = readFileSync(page, "utf8");
	// Origin, not just equality: every rendered release-pattern anchor must BOTH
	// match a module-derived destination AND carry the module-owned origin
	// marker. ASSET links must carry the ai14all-downloads marker specifically —
	// the recently-shipped marker is valid only for release-PAGE links — so a
	// download URL smuggled through the shipped module still fails at render.
	for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
		const hrefMatch = tag.match(/href="([^"]*)"/);
		if (!hrefMatch) continue;
		const href = hrefMatch[1];
		const isDownload = href.includes("/releases/download/");
		const isReleasePage = !isDownload && href.includes("github.com/ai-creed/ai-14all/releases");
		if (!isDownload && !isReleasePage) continue;
		if (isDownload && !allowed.has(href)) {
			errors.push(`download link bypasses module in ${page}: ${href}`);
		}
		if (isDownload && !ASSET_ORIGIN_RE.test(tag)) {
			errors.push(
				`asset link rendered without the downloads-module origin marker in ${page}: ${href}`,
			);
		}
		if (isReleasePage && !allowedPages.has(href)) {
			errors.push(`release-page link not derived from the data modules in ${page}: ${href}`);
		}
		if (isReleasePage && !PAGE_ORIGIN_RE.test(tag)) {
			errors.push(
				`release link rendered without a module-owned origin marker in ${page}: ${href}`,
			);
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

// 5. Source provenance — the import allowlist, enforced in three layers:
//    (a) normalized-substring scan: quotes/backticks/plus/commas/brackets/
//        whitespace stripped, so adjacent-literal splits collapse and fail;
//    (b) constant folding (TypeScript AST, via the repo's existing
//        `typescript` devDependency): const string pieces assembled with `+` or template
//        literals fold to their static values and are re-tested — in code
//        files, .astro frontmatter, AND template expressions, with frontmatter
//        constants seeding the template fold — so separate-variable and
//        frontmatter-to-template construction fail too;
//    (c) rendered-output ORIGIN: release-link rendering is centralized in the
//        module-owned Ai14allReleaseLink component (RecentlyShipped renders its
//        own module's links), which stamps data-dl-origin on the anchor. Every
//        rendered release-pattern anchor must carry that marker AND equal an
//        allowed destination — so any hand-assembled construction, including
//        imported pieces or forms folding cannot see, renders markerless and
//        fails. The marker attribute itself is banned (normalized) outside its
//        two owner components, so it cannot be forged by ordinary construction.
// ai14all-downloads.ts is fully exempt (it is the carrier); recently-shipped.ts
// is exempt only from release-PAGE and version rules — an asset download URL
// there fails like anywhere else, INCLUDING when assembled from pieces: the
// download-pattern check runs on its folded constants before its exemption,
// and rendered asset links additionally require the ai14all-downloads marker.
const DOWNLOADS_MODULE = join("src", "data", "ai14all-downloads.ts");
const SHIPPED_MODULE = join("src", "data", "recently-shipped.ts");
// The ONLY files allowed to emit the rendered-origin marker attribute:
const MARKER_ALLOWED = new Set([
	join("src", "components", "Ai14allReleaseLink.astro"),
	join("src", "components", "RecentlyShipped.astro"),
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
const CODE_RE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const FORBIDDEN_FOLDED = [
	/\/releases\/download\//,
	/github\.com\/ai-creed\/ai-14all\/releases/,
	/\/releases\/(latest|tag\/)/,
];

// Fold statically-known string constants: literals, parenthesized forms,
// const-identifier references, `+` concatenation, and template literals whose
// spans are all known. `seed` lets template expressions inherit the constants
// declared in an .astro frontmatter. Parsed as TSX so JSX-ish chunks fold too.
function foldWithConsts(code, file, seed = new Map()) {
	const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	const consts = new Map(seed);
	const valueOf = (node) => {
		if (ts.isStringLiteralLike(node)) return node.text;
		if (ts.isIdentifier(node)) return consts.get(node.text);
		if (ts.isParenthesizedExpression(node)) return valueOf(node.expression);
		if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
			const left = valueOf(node.left);
			const right = valueOf(node.right);
			return left !== undefined && right !== undefined ? left + right : undefined;
		}
		if (ts.isTemplateExpression(node)) {
			let out = node.head.text;
			for (const span of node.templateSpans) {
				const v = valueOf(span.expression);
				if (v === undefined) return undefined;
				out += v + span.literal.text;
			}
			return out;
		}
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			node.expression.name.text === "join" &&
			ts.isArrayLiteralExpression(node.expression.expression)
		) {
			const sep = node.arguments.length === 0 ? "," : valueOf(node.arguments[0]);
			if (sep === undefined) return undefined;
			const parts = node.expression.expression.elements.map(valueOf);
			return parts.every((p) => p !== undefined) ? parts.join(sep) : undefined;
		}
		return undefined;
	};
	const folded = [];
	const visit = (node) => {
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
			const v = valueOf(node.initializer);
			if (v !== undefined) consts.set(node.name.text, v);
		}
		const v = valueOf(node);
		if (v !== undefined) folded.push(v);
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return { folded, consts };
}

// Every balanced top-level {…} chunk in a template — attribute expressions,
// children, even <style> rule bodies (those fold to nothing and are harmless).
function templateExpressions(template) {
	const out = [];
	for (let i = 0; i < template.length; i++) {
		if (template[i] !== "{") continue;
		let depth = 1;
		let j = i + 1;
		while (j < template.length && depth > 0) {
			if (template[j] === "{") depth++;
			else if (template[j] === "}") depth--;
			j++;
		}
		if (depth === 0) {
			out.push(template.slice(i + 1, j - 1));
			i = j - 1;
		}
	}
	return out;
}

// Fold a file end to end. Code files fold directly. For .astro, the TS
// frontmatter folds first and its constants SEED every template expression —
// so pieces declared in frontmatter and assembled in the rendered expression
// still fold to the full destination. For .mdx, ESM import/export lines seed
// the body's expressions (YAML frontmatter cannot assemble strings).
function foldedValuesOf(file, text) {
	if (CODE_RE.test(file)) return foldWithConsts(text, file).folded;
	if (!file.endsWith(".astro") && !file.endsWith(".mdx")) return [];
	const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n?/);
	const template = fmMatch ? text.slice(fmMatch[0].length) : text;
	const seedSource = file.endsWith(".astro")
		? fmMatch
			? fmMatch[1]
			: ""
		: template
				.split("\n")
				.filter((line) => /^(import|export)\s/.test(line))
				.join("\n");
	const { folded, consts } = foldWithConsts(seedSource, file);
	const all = [...folded];
	for (const expr of templateExpressions(template)) {
		all.push(...foldWithConsts(`(${expr});`, file, consts).folded);
	}
	return all;
}

const sources = [];
(function walkSrc(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walkSrc(p);
		else if (TEXT_RE.test(p)) sources.push(p);
	}
})("src");
const DOWNLOAD_RE = /\/releases\/download\//;
for (const file of sources) {
	if (file === DOWNLOADS_MODULE) continue; // the ONLY carrier of asset URLs
	const text = readFileSync(file, "utf8");
	const squashed = text.replace(/["'`+,[\]\s]/g, "");
	const folded = foldedValuesOf(file, text);
	// Asset-URL exclusivity binds EVERY file — recently-shipped.ts included.
	// Both the normalized text AND every constant-folded value are tested for
	// the download pattern BEFORE the shipped-module exemption, so an asset URL
	// assembled from pieces inside recently-shipped.ts still fails.
	if (DOWNLOAD_RE.test(squashed) || folded.some((v) => DOWNLOAD_RE.test(v))) {
		errors.push(`hand-written or assembled download URL outside the downloads module: ${file}`);
	}
	if (squashed.includes("data-dl-origin") && !MARKER_ALLOWED.has(file)) {
		errors.push(`provenance marker outside its owner components: ${file}`);
	}
	if (file === SHIPPED_MODULE) continue; // may carry release-PAGE hrefs + version summaries
	if (squashed.includes("github.com/ai-creed/ai-14all/releases")) {
		errors.push(`hand-written ai-14all release URL outside the data modules: ${file}`);
	}
	if (/\/releases\/(latest|tag\/)/.test(squashed)) {
		errors.push(`hand-written release path outside the data modules: ${file}`);
	}
	for (const value of folded) {
		if (FORBIDDEN_FOLDED.some((re) => re.test(value))) {
			errors.push(`constant-folded release destination outside the data modules: ${file}`);
			break;
		}
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
