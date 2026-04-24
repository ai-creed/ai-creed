import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "**/*.{md,mdx}",
	}),
	schema: ({ image }) => z
		.object({
			name: z.string(),
			tagline: z.string(),
			status: z.enum(["public", "private", "stable"]),
			order: z.number(),
			repo: z.string().optional(),
			install: z.string().optional(),
			features: z.array(z.string()).min(3).max(6),
			screenshot: image().optional(),
			video: z.string().optional(),
			wip: z.boolean().optional(),
		})
		.superRefine((val, ctx) => {
			if (val.status === "public") {
				if (!val.repo) {
					ctx.addIssue({
						code: "custom",
						message: "repo is required when status is \"public\"",
						path: ["repo"],
					});
				}
				if (!val.install) {
					ctx.addIssue({
						code: "custom",
						message: "install is required when status is \"public\"",
						path: ["install"],
					});
				}
			}
		}),
});

export const collections = { projects };
