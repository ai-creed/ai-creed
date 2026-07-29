// Renders the interim hero camera tour (spec 2026-07-29 §5): the committed
// 7.5s source recording looped 3x under a keyframed, smoothstep-eased
// zoompan camera. Requires ffmpeg on PATH; the output is committed, so this
// runs locally only — re-run to regenerate after replacing the source.
// ffmpeg facts this depends on: crop w/h evaluate at init only, so animated
// zoom needs zoompan; zoompan has no `t` var — time is in/FPS; interpolating
// the view WIDTH (not the zoom factor) gives constant-feeling motion.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FPS = 30;
const IW = 2628; // source width (public/ai-14all/hero-demo.mp4)

// camera keyframes: [time, w, h, x, y] — every rect keeps the 1600x844 output
// aspect, so there is never letterboxing.
const KF = [
	[0.0, 2628, 1388, 0, 0], // establish: full app
	[2.5, 2628, 1388, 0, 0],
	[4.5, 900, 475, 10, 60], // sidebar: sessions, status dots, active card
	[7.5, 900, 475, 10, 60],
	[9.5, 1300, 687, 460, 70], // agent tabs row + center terminal
	[12.5, 1300, 687, 460, 70],
	[14.5, 1300, 687, 1290, 350], // lateral pan to review pane
	[17.5, 1300, 687, 1290, 350],
	[19.5, 2628, 1388, 0, 0], // pull back out
	[21.0, 2628, 1388, 0, 0],
];

// piecewise smoothstep between keyframes; idx 1=w, 3=x, 4=y
function expr(idx) {
	const T = `(in/${FPS})`;
	let out = String(KF[KF.length - 1][idx]);
	for (let i = KF.length - 2; i >= 0; i--) {
		const [a, ...va] = KF[i];
		const [b, ...vb] = KF[i + 1];
		const v0 = va[idx - 1];
		const v1 = vb[idx - 1];
		let seg;
		if (v0 === v1) {
			seg = String(v0);
		} else {
			const e = `clip((${T}-${a})/(${b - a}),0,1)`;
			seg = `(${v0}+${v1 - v0}*${e}*${e}*(3-2*${e}))`;
		}
		out = `if(lt(${T},${b}),${seg},${out})`;
	}
	return out;
}

const filter = `zoompan=z='${IW}/(${expr(1)})':x='${expr(3)}':y='${expr(4)}':d=1:s=1600x844:fps=${FPS},format=yuv420p`;
const filterFile = join(mkdtempSync(join(tmpdir(), "hero-tour-")), "tour-filter.txt");
writeFileSync(filterFile, filter + "\n");

execFileSync(
	"ffmpeg",
	[
		...["-stream_loop", "2", "-i", "public/ai-14all/hero-demo.mp4"],
		...["-t", "21", "-filter_complex_script", filterFile],
		...["-c:v", "libx264", "-crf", "28", "-preset", "medium"],
		...["-movflags", "+faststart", "-an", "-y", "public/ai-14all/hero-tour.mp4"],
	],
	{ stdio: "inherit" },
);
console.log("wrote public/ai-14all/hero-tour.mp4");
