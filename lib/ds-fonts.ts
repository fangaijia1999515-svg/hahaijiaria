/**
 * DESIGN SYSTEM FONTS — substitutes loaded via next/font (self-hosted, no CLS).
 * Isolated from the live site: these instances are applied ONLY on the `.ds`
 * wrapper (app/system/page.tsx), so they never affect app/page.tsx or /work.
 *
 * SUBSTITUTES (swap to licensed originals later = change these two + the CSS
 * --ds-font-* tokens; nothing else):
 *   Fraunces        → stands in for Canela  (high-optical, high-contrast serif)
 *   Hanken Grotesk  → stands in for Söhne   (clean grotesk)
 *   IBM Plex Mono   → the real thing (free) — labels / captions
 */
import { Cormorant, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google"

/** Display serif — Cormorant (picked over Fraunces 2026-07-01: she disliked
 * the Fraunces lowercase "j" hook; Cormorant is the closest free match to the
 * refined high-contrast wordmark on her Logo sheet). Variable name stays
 * "--font-ds-display" so swapping again (or to licensed Canela) is 1 line. */
export const dsDisplay = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-ds-display",
  display: "swap",
})

export const dsHanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-ds-hanken",
  display: "swap",
})

export const dsPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ds-plex-mono",
  display: "swap",
})

/** className to spread onto the `.ds` root so the font variables resolve. */
export const dsFontVars = `${dsDisplay.variable} ${dsHanken.variable} ${dsPlexMono.variable}`
