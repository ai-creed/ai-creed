// Renders the ai-creed brand assets from the ai-14all logo signature (the
// faceted triangle-C mark), recolored into this site's design language:
// amber edge accents → coral --accent #ff8163, grey facets lifted toward
// --fg #e6e6e6 for contrast on --bg #0d0d0d. Source of record:
// src/assets/ai-14all-mark-light.png (copied from the ai-14all repo's
// assets/; PNG-only — no vector source exists). Outputs are committed;
// re-run only when the source mark or the palette changes.
import sharp from "sharp";

const SRC = "src/assets/ai-14all-mark-light.png";
const BG = "#0d0d0d";

// per-pixel recolor: warm saturated pixels (the amber accents) become coral;
// everything else is a grey facet — lift its luminance so ~#c4c4c4 → ~#e6e6e6.
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
	if (data[i + 3] === 0) continue;
	const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
	const max = Math.max(r, g, b);
	const sat = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
	if (sat > 0.25 && r >= g && g > b) {
		data[i] = 0xff;
		data[i + 1] = 0x81;
		data[i + 2] = 0x63;
	} else {
		data[i] = Math.min(255, Math.round(r * (230 / 196)));
		data[i + 1] = Math.min(255, Math.round(g * (230 / 196)));
		data[i + 2] = Math.min(255, Math.round(b * (230 / 196)));
	}
}
const mark = await sharp(data, { raw: info }).png().toBuffer();
const trimmed = await sharp(mark).trim({ threshold: 10 }).toBuffer();
const fit = { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } };

// header mark — displayed 20px, exported @2x. At this scale the thin coral
// accent lines vanish, so the header uses a small-size variant: the mark's
// silhouette filled flat coral (the hue the ● dot carried), its structure
// kept by the transparent cut lines. Larger outputs keep the detailed tones.
const coral = Buffer.from(data);
for (let i = 0; i < coral.length; i += 4) {
	if (coral[i + 3] === 0) continue;
	coral[i] = 0xff;
	coral[i + 1] = 0x81;
	coral[i + 2] = 0x63;
}
const coralTrimmed = await sharp(await sharp(coral, { raw: info }).png().toBuffer())
	.trim({ threshold: 10 })
	.toBuffer();
await sharp(coralTrimmed).resize(40, 40, fit).png().toFile("public/brand-mark.png");
console.log("wrote public/brand-mark.png");

// favicon — mark on the #0d0d0d rounded tile
const tile = (size, rx) =>
	Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${rx}" fill="${BG}"/></svg>`,
	);
await sharp(tile(48, 10))
	.composite([{ input: await sharp(trimmed).resize(34, 34, fit).png().toBuffer() }])
	.png()
	.toFile("public/favicon.png");
console.log("wrote public/favicon.png");

// apple-touch icon — iOS applies its own corner mask, so the tile is square
await sharp(tile(180, 0))
	.composite([{ input: await sharp(trimmed).resize(128, 128, fit).png().toBuffer() }])
	.png()
	.toFile("public/apple-touch-icon.png");
console.log("wrote public/apple-touch-icon.png");
