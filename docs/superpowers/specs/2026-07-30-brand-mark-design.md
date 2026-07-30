# ai-creed Brand Mark — Design

- **Date:** 2026-07-30
- **Status:** approved by operator (in-session), implemented same day
- **Context:** final piece of the 14all-first landing restructure before
  publishing.

## Decision

Adopt the **ai-14all logo signature** — the faceted triangle mark with the
angular C — as the ai-creed brand mark, recolored into this site's design
language. Source of record: `src/assets/ai-14all-mark-light.png` (copied
from the ai-14all repo's `assets/`; the mark exists only as PNG — no vector
source). The old branding (green `$` favicon glyph, coral `●` header dot)
is replaced.

## Surfaces

- **Headers** (`LandingHeader.astro`, `Header.astro`): the `●` next to
  "ai-creed" becomes `<img class="mark" src="/brand-mark.png" alt=""
width="20" height="20">`. Decorative (`alt=""`); the wordmark stays the
  accessible name. The brand link keeps its 44px padding target.
- **Favicon**: `/favicon.png` (48², mark on a `#0d0d0d` rounded tile)
  replaces `/favicon.svg`; `Base.astro` link updated to `type="image/png"`.
- **Apple touch icon**: `/apple-touch-icon.png` regenerated (180², square
  `#0d0d0d` tile — iOS applies its own mask). Stale `apple-touch-icon.svg`
  deleted alongside `favicon.svg`.
- **Out of scope:** OG images (separate pipeline, unchanged).

## Recolor (`scripts/generate-brand-mark.mjs`, sharp)

Per-pixel mapping of the light source variant: warm saturated pixels (the
amber edge accents) → coral `--accent` `#ff8163`; grey facets lifted
~`#c4c4c4` → `#e6e6e6` for contrast on `--bg`. **Small-size variant:** at
20px the thin coral accent lines vanish, so the header mark is the
silhouette filled flat coral (the hue the `●` carried), structure kept by
the transparent cut lines; favicon and touch icon keep the detailed
grey+coral treatment at sizes where it reads. Outputs are committed; the
script re-runs only when the source mark or palette changes.

## Guard fit (verified green post-change)

Header img + both icon links are budget-counted: total 165,726 / 262,144
gzip. `check:copy` coral exclusivity counts computed background fills on
anchors — an image does not trip it. Full suite green including Lighthouse
at the ratcheted LCP 2246.
