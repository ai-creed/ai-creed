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
