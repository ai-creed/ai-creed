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
