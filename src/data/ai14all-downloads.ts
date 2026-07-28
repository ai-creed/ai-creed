// The ONLY place an ai-14all version or download URL may exist in this repo.
// CI (pnpm check:downloads) verifies every URL resolves and that `version`
// matches the latest published GitHub release tag.
export interface DownloadAsset {
	label: string;
	url: string;
}

const VERSION = "1.8.2";
const BASE = `https://github.com/ai-creed/ai-14all/releases/download/v${VERSION}`;

export const AI14ALL_DOWNLOADS = {
	version: VERSION,
	releasePageUrl: "https://github.com/ai-creed/ai-14all/releases/latest",
	assets: {
		macUniversal: {
			label: "macOS (universal — intel + apple silicon)",
			url: `${BASE}/ai-14all-${VERSION}-universal.dmg`,
		},
		macArm64: {
			label: "macOS (apple silicon, native)",
			url: `${BASE}/ai-14all-${VERSION}-arm64.dmg`,
		},
		windowsX64: {
			label: "windows (x64, unsigned — smartscreen warns once)",
			url: `${BASE}/ai-14all-${VERSION}-x64-Setup.exe`,
		},
	},
} as const;

export const AI14ALL_DOWNLOAD_ASSETS: readonly DownloadAsset[] = Object.values(
	AI14ALL_DOWNLOADS.assets,
);
