# ai-creed

Minimal developer-style homepage for the ai-* ecosystem.

- Live: https://ai-creed.dev
- Stack: Astro 5, MDX content collections, Cloudflare Pages
- Spec: see `~/.ai-pref-nsync/local-docs/ai-creed/plans/2026-04-20-ai-creed-design.md`

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # type + content-schema check
npm run build    # output to dist/
npm run preview  # serve dist/
```

## Adding a project

Drop a new `.mdx` file into `src/content/projects/`. See existing files for the frontmatter schema.
