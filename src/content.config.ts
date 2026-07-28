import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cta = z.object({
	label: z.string(),
	href: z.string().optional(),
});

const homepage = z.object({
	featured: z.literal(true),
	rank: z.number().int().min(1).max(3),
	role: z.string(),
	posture: z.string(),
	availability: z.enum(["shipping", "coming soon", "early access"]),
	headline: z.string(),
	summary: z.string(),
	desktopCta: cta,
	mobileCta: cta.required({ href: true }),
});

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) =>
		z
			.object({
				name: z.string(),
				tagline: z.string(),
				status: z.enum(["public", "private", "stable", "archived"]),
				order: z.number(),
				repo: z.string().optional(),
				install: z.string().optional(),
				features: z.array(z.string()).min(3).max(6),
				screenshot: image().optional(),
				video: z.string().optional(),
				videoPoster: z.string().optional(),
				wip: z.boolean().optional(),
				homepage: homepage.optional(),
			})
			.superRefine((val, ctx) => {
				if (val.status === "public") {
					if (!val.repo) {
						ctx.addIssue({
							code: "custom",
							message: 'repo is required when status is "public"',
							path: ["repo"],
						});
					}
					if (!val.install) {
						ctx.addIssue({
							code: "custom",
							message: 'install is required when status is "public"',
							path: ["install"],
						});
					}
				}
				if (val.video && !val.videoPoster) {
					ctx.addIssue({
						code: "custom",
						message:
							"videoPoster is required when video is set (click-to-play contract)",
						path: ["videoPoster"],
					});
				}
			}),
});

export const collections = { projects };
