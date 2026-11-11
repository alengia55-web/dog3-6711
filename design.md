# Κυνοκομείο Δήμου Μετεώρων — Design System

Municipal dog shelter of Δήμος Μετεώρων. Bilingual EL/EN. The feeling: clean, playful, very happy,
never confusing. Comic-sticker energy on a white page — think a friendly children's-book poster,
not a corporate municipal portal.

Brand name: Κυνοκομείο Δήμου Μετεώρων (English: Municipal Dog Shelter of Meteora). Retain the existing illustrated dog mark, replacing the former wordmark everywhere. Requested domain: kinokomeiodimoumeteoron.gr; activation requires registrar DNS and Netlify custom-domain configuration.

## Colors

White page, pastel blocks, black ink.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#131211` | all text, outlines, borders |
| `--paper` | `#ffffff` | page background |
| `--pink` | `#ffd3e2` | primary pastel block / hero |
| `--pink-deep` | `#f9a8c4` | badges, hover |
| `--yellow` | `#fff2b8` | secondary block, donate |
| `--yellow-deep` | `#ffd84d` | accents, stars |
| `--mint` | `#c9f2e0` | success, volunteer |
| `--mint-deep` | `#7ed9b3` | accents |
| `--sky` | `#d3e9ff` | tertiary block, forms |
| `--sky-deep` | `#84c5f7` | accents |
| `--stone` | `#f4f2ef` | muted surfaces |

Rules: one pastel per section band, alternating. Never two pastels fighting in the same card.
Text is always near-black `--ink` on pastel or white — no pastel text, no gray-on-gray.

## Typography

- Display: **Comfortaa** 700 — rounded, cheerful, full Greek support. Headings, logo wordmark, buttons.
- Body: **Commissioner** 400/500/600 — neutral, highly legible, full Greek support.
- Sizes: hero `clamp(2.5rem, 7vw, 5rem)`, h2 `clamp(2rem, 4vw, 3rem)`, body `1.0625rem`, small `0.875rem`.
- Line height: 1.15 display / 1.65 body. Headings may be slightly tracked-in (`-0.02em`).
- Greek text never uppercase for long strings (accents disappear); use uppercase only for short labels
  and always on Latin words (ADOPTED, DONATE).

## Comic / sticker language

- Border: `2px solid var(--ink)` on cards, buttons, inputs, badges (`3px` for hero cards).
- Shadow: hard offset only — `6px 6px 0 var(--ink)` (cards), `4px 4px 0 var(--ink)` (buttons).
  No blur, no soft elevation. Hover: shift `translate(-2px,-2px)` and grow shadow.
- Radius: generous and irregular — `1.5rem` cards, `999px` pills, sticker badges rotated `-3deg..4deg`.
- Decoration: paw prints, dotted grids, wavy dividers, hand-drawn-style arrows. Sparing.
- Motion: staggered fade-up on page load (`Motion` library), gentle wag/bounce on hover only.

## Dog grid (core feature)

- Responsive grid, 2 cols mobile / 3 tablet / 4 desktop. Portrait 4:5 photos.
- Available: full color, pastel card, "Ψάχνω σπίτι" pill.
- Adopted: photo `filter: grayscale(1)` + rotated black **ADOPTED** stamp across the corner and a
  soft white veil. Card stays legible and celebratory (this proves the shelter works).
- Cards use matching 4:5 photo frames and identical fixed-height summary panels: name, age, sex, size, and a “Meet me” link. The entire card opens a dog profile.
- Full bios, personality traits, health chips, photo gallery and adoption CTA appear on `/dogs/:slug`, not in the grid. Available and adopted cards stay the same height.
- Clicking a card opens an accessible, centered compact dog-preview dialog (max 880px, scrollable within 90vh). Direct profile URLs and modified-click new tabs remain supported.
- Gallery uses uncropped contained photographs, previous/next buttons, a photo counter, selectable thumbnails, keyboard arrows and mobile swipe. Single-photo dogs never show invented gallery items.
- Donation links have stable hit areas (no moving hover transforms), remain visible on mobile and reliably open the donation page at its top.
- Each popup/profile includes a sky-colored official adoption-platform reference section. An admin-supplied pet.gov.gr listing opens in a new tab; absent URLs are explicitly marked as not yet added, with a separately labeled general platform link. Never imply an unprovided listing exists or is verified.

## Layout

- Max width 1200px, generous gutters, big vertical rhythm (`py-20 md:py-28`).
- Sections alternate white and pastel bands with a wavy/zig-zag top edge.
- Sticky header: logo + wordmark left, nav center, EL/EN toggle + Donate button right.

## Anti-patterns

No purple gradients, no soft blurred shadows, no gray corporate cards, no Inter/Roboto,
no dark mode, no stock-photo "municipal" imagery.
