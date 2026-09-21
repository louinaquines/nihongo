# Design.md — Nihongo Learning Platform

## Design Philosophy: Japanese Minimalism (Ma / 間)
The core design principle is **ma** — negative space treated as an active, meaningful element, not empty leftover space. This is chosen deliberately to avoid "AI slop" UI (generic gradients, glassmorphism, floating 3D blobs, stock-icon clutter, templated SaaS-landing-page look) and instead feel intentional, restrained, and specific to the subject matter — a Japanese-learning site should *feel* considered the way Japanese design itself is.

**Things to explicitly avoid** (the "slop" list):
- Purple/blue gradient backgrounds, glassmorphism cards, blurry floating orbs
- Default Heroicons/Lucide icons used decoratively with no relation to content
- Overuse of rounded-everything + soft drop shadows on every card
- Dense, symmetrical "boxes in a grid" layouts with no breathing room
- Generic stock illustration (mismatched style, clearly AI-generated or clip-art)
- Emoji used as UI icons

**What "ma" looks like in practice:**
- Whitespace is sized deliberately, not just Tailwind's default `p-4` everywhere — give key elements room to breathe (a headline, a single kanji/kana example, a CTA) rather than packing the viewport
- Asymmetry over rigid centered-everything layouts where it suits the content
- One strong focal element per section rather than several competing for attention
- Red is used sparingly and with purpose (like a hanko/seal stamp accent or a single underline), not applied to every interactive element by default — its rarity is what gives it weight
- Thin structural lines (hairline dividers) instead of boxed cards with shadows, where it fits — closer to a printed exam sheet or a well-typeset page than a "dashboard"

## Color Palette
**White + Red only.**
- Background: white (`#FFFFFF`)
- Primary accent / key CTAs / focal moments: one considered red (e.g. `#C8102E`-range — closer to a hanko-stamp red than a bright "alert" red; exact hex to finalize)
- Text: near-black / dark gray on white for readability (not pure black)
- No secondary color families — differentiation via red tint variations, grayscale, or spacing/typography instead of new hues
- Red should read as *intentional accent*, not a UI-framework default button color slapped on everything

## Layout Structure (page by page)
Adapted from the "TOPCIT Exam Reviewer" reference structure, reinterpreted through the ma philosophy above (less density, more restraint than the literal reference).

### Header
- Logo + platform name, left-aligned; search bar, right-aligned
- White background, hairline bottom border (not a heavy shadow), sticky on scroll

### Home / Hero Section
- One clear focal element — likely bold, oversized headline with generous surrounding whitespace, rather than headline + stock illustration filling the frame
- If imagery is used at all, it should be spare and specific (e.g. a single brush-stroke motif or a static kanji character used graphically) — not a generic "two people studying" stock illustration

### Promo Banner (if kept — reconsider necessity)
- The reference's stacked colorful promo banners are a common "slop" pattern (competing CTAs, saturated blocks). If kept, use at most one, in restrained red, with real content — not a decorative gradient block

### Main List Section (Levels / Categories)
- Section title + one-line subtitle, generous space above/below
- List rows over card grids where possible — a clean, typographic list (closer to an exam index) reads more intentional than boxed cards with icons
- Each row: title, minimal metadata, right-aligned action — text-led, not icon-led
- Action button: red, used sparingly per screen so it stands out rather than being everywhere

### Feature/Roadmap Grid (if used)
- Keep icons purposeful and consistent (a single custom icon style, not mixed stock sets) or skip icons in favor of typographic labels

### Footer
- Minimal, hairline top border, small text — no clutter

## Component Principles
- **Buttons**: solid red for the one primary action per screen; everything else is text-link or outline style — avoid "every button is red" which flattens hierarchy
- **Cards/rows**: flat, hairline borders, no default drop shadow — shadow (if any) reserved for hover/focus state only
- **Quiz question types** share one consistent, spare shell; input UI (radio, tap-select, text field, drag/match) styled minimally, no decorative icons per option
- **Progress indicators**: a simple red line/bar on a hairline track — understated, not a chunky gamified progress bar

## Typography
- Clean sans-serif for UI text, used with intentional scale contrast (large headlines vs. small body text) to create hierarchy through type alone
- Noto Sans JP (or similar) for kana/kanji content — this pairing is functionally necessary and also reinforces the design's Japanese-minimalist identity rather than being purely utilitarian

## Motion
- Subtle, purposeful transitions only (fade/slide on page and state changes) — motion should feel calm, not flashy; skip heavy 3D/parallax effects that read as "AI demo" flourish rather than considered interaction design

## Tooling / Stack Constraints
- Cost-conscious: free-tier-friendly tools at launch
- Tailwind CSS, with custom spacing/type scale tokens rather than relying on defaults everywhere (defaults are part of what makes templated UI look templated)
- Framer Motion for restrained transitions per the Motion section above

## Notes
- Dark mode deprioritized for now — the white + red, ma-driven design is conceived as a light-mode experience; can revisit later if wanted.