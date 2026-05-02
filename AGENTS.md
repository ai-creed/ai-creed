# Agents Guide — ai-creed

This site is the public landing for projects under the `ai-*` ecosystem. Each project gets one page generated from a single `.mdx` file. This guide tells you how to update or add a project page so it lands as a **landing page**, not a README.

## File layout

```
src/content/projects/<project>.mdx     # one file per project (source of truth)
src/content/projects/<project>.png     # optional screenshot, referenced as ./<file>.png
src/content.config.ts                  # frontmatter schema (zod)
src/components/Features.astro          # renders the features bullet list
src/pages/projects/[...slug].astro     # the rendering template (don't usually touch)
```

## Frontmatter schema

Validated by zod in `src/content.config.ts`. Build fails fast on violations.

| Field        | Type                                   | Notes                                                  |
| ------------ | -------------------------------------- | ------------------------------------------------------ |
| `name`       | string                                 | Display name                                           |
| `tagline`    | string                                 | One line. Lowercase. Sells the project, not describes it |
| `status`     | `"public" \| "private" \| "stable"`    | `public` requires `repo` + `install`                   |
| `order`      | number                                 | Sort order on the index page                           |
| `repo`       | string                                 | Required if `public`. Full GitHub URL                  |
| `install`    | string (yaml block scalar)             | Required if `public`. CLI command users copy-paste     |
| `features`   | string[] (3-6 items)                   | Hard-capped at 6. Cap is load-bearing for layout       |
| `screenshot` | image                                  | Optional. Loaded as Astro image                        |
| `video`      | string                                 | Optional. URL                                          |
| `wip`        | boolean                                | Optional. Renders a WIP notice                         |

## Voice

- **Lowercase headings.** Project names retain casing where it's the identity (`Claude Code`, `Codex`).
- **Terse prose.** Cut articles and filler. Fragments are fine when they land harder than full sentences.
- **Verb-led.** Features start with what the agent does (`rehydrate`, `suggest`, `remember`), not what the system is.
- **No emojis.** Unless explicitly requested.

## What lands vs what bloats

A landing page sells; a README documents. They're different products. Don't mix them.

| Lands on the page                            | Belongs in the README, not here              |
| -------------------------------------------- | --------------------------------------------- |
| Why someone should care                      | How to install on every OS                   |
| What the agent / user can now do             | Full CLI reference                            |
| One concrete example per headline feature    | Every CLI flag                                |
| The differentiator vs alternatives           | Architecture diagrams                        |
| A clean closing line that travels            | Troubleshooting                              |

If a section reads like API docs, it doesn't belong.

## Feature copy

Six bullets max. Each bullet:

- Leads with a verb or noun-as-verb (`rehydrate`, `suggest`, `remember`).
- Sells the *why/what*, not the *how*. No `sqlite`, no `FTS5`, no `tree-sitter`-as-bullet, no hook event names.
- Concrete enough that a reader knows when they'd reach for it.
- Order matters: arrange by **value flow**, the sequence a user would actually traverse.

For ai-cortex the value flow is:

```
rehydrate (warm start) → suggest (find files) → history (recover lost context)
                       → remember (persistent memory) → scope → integration
```

Match that shape for your project. Lead with the single thing that makes a fresh visitor say "yes, I want that," then expand.

## Section copy

Lead with the **why/what**, not the implementation. The visitor wants to know what they get, not how it works under the hood.

**Bad** (technical, README-style):
> Markdown-of-record + sqlite (FTS5) + vector sidecar. Typed (`decision`, `gotcha`, `how-to`, `pattern`), scoped, versioned, lifecycle-managed (`candidate → active → deprecated → trashed → purged`).

**Good** (value, landing-page-style):
> The most valuable context is nowhere in the repo: *"we tried X, it broke under load, we use Y now"*, *"this module is owned by team Z"*. Code shows the *what*; memory shows the *why* and the *what we tried that didn't work*.

The first reads like a spec. The second reads like a pitch.

## Examples beat description

Every headline feature on a landing page benefits from one tiny worked example. ~10-12 lines, illustrative not exhaustive. Show the *flow*, not the *feature*. Use `agent → tool { args }` arrows for tool calls; show inputs and outputs, not invocation syntax.

```
agent → recall_memory { query: "mock database tests" }
  → "integration tests must hit a real database, not mocks"
    type: decision · confidence 0.95 · pinned

agent → "no — your project rule says integration tests use a real db.
         here's the reasoning [cites memory]."
```

The example shows *what the agent does with the feature*. That's what converts.

## Workflow for updating a page

1. **Read the strategy doc first.** Most ai-* projects keep a strategy doc under `<project>/docs/misc/<project>-strategy-v*.md`. It has the positioning language, one-liners, and competitive framing already worked out. Lift directly. Don't re-derive in the page.
2. **Diff the page against current reality.** Walk the project's CHANGELOG, MANUAL.md, and `--version`. Note version, install command, feature list, MCP/CLI surface, language scope.
3. **List the misalignments before editing.** Write them out as a punch list. Edit against the list, not freehand.
4. **Edit, build, smoke-test.** `pnpm build` catches schema violations. `pnpm dev` for hot-reload preview at `http://localhost:4321/projects/<project>/`.
5. **Iterate on density.** Drafts always read too long the first time. Re-read with the question: *would I scroll past this on a phone?* If yes, trim.
6. **Commit, conventional style.** `feat(<project>): ...` for content additions, `chore(<project>): bump to vX.Y.Z` for version-only updates. Body lists what changed.

## Anti-patterns (caught during the v0.5.1 ai-cortex refresh)

- **Too many features.** Schema enforces ≤6. Don't fight it — pick the six that sell hardest.
- **Implementation jargon in section bodies.** "sqlite (FTS5) + vector sidecar" is correct but kills momentum. Save for the README.
- **Wrong feature order.** A list ordered by *when it shipped* is for changelogs. Order by *value flow* on a landing page.
- **Undersold features.** "session history capture" is a feature label; "never lose a correction, decision, or referenced file when the harness compacts the conversation away" is a sale.
- **Verbose CLI sections.** A single `npm i -g <pkg>` install plus one usage example is enough. The README has the rest.
- **Stale install tags.** Drop `@beta` once the project is past beta. The version banner at the top of the page is the canonical version source.
- **Missing language scope.** When a project adds a language adapter, the scope line is the easy thing to forget.

## When in doubt

Density. Lead with value. Ship one example per headline feature. Trust the visitor to follow the link to the repo for the rest.
