/**
 * Single source of truth for Aijia's brand accent.
 *
 * The accent is intentionally centralized so a rebrand is a tiny, predictable
 * edit. To swap the accent (e.g. lilac → blue #7AA2FF), change the values in
 * THIS file AND the matching CSS tokens in `app/globals.css`:
 *   :root / .dark      → --accent  (+ --glow)
 *   .section-cream     → --accent  (+ --glow)
 * Every component reads the accent from here (JS) or from `var(--accent)` (CSS),
 * so nothing else needs to change.
 *
 * Contrast (WCAG 2.1, verified):
 *   ACCENT       #C9A2FF on warm-black #0c0a08 → 9.50:1  (AAA)
 *   ACCENT_CREAM #6D28D9 on cream      #f4ecdd → 6.05:1  (AA, body & UI)
 */

// Accent for dark / warm-black surfaces — light lilac.
export const ACCENT = "#C9A2FF"
export const ACCENT_RGB = [201, 162, 255] as const

// Contrast-safe deep violet for light cream surfaces (.section-cream).
export const ACCENT_CREAM = "#6D28D9"
export const ACCENT_CREAM_RGB = [109, 40, 217] as const
