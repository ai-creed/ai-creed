// Rasterizes the homepage OG card. Run `pnpm og` after editing src/assets/og-home.svg.
import sharp from "sharp";

await sharp("src/assets/og-home.svg", { density: 150 })
	.resize(1200, 630)
	.png()
	.toFile("public/og-home.png");
console.log("wrote public/og-home.png");
