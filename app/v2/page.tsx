/**
 * /v2 — THE HOMEPAGE, built on the locked quiet-luxury system.
 * Everything renders inside `.ds` + dsFontVars (same isolation pattern as
 * /system), styled only with ds tokens/classes + the v2-* layer in
 * components/v2/v2.css.
 *
 * Composition (final cleanup 2026-07-19): Hero (LOCKED, pristine daylight)
 * -> Statement (screen 2, light, dune-soft ground, plain arrival)
 * -> Story (WorkGallery [LOCKED, plasma + approved top dissolve] -> Cards
 * deck -> Method -> Record -> WaterClose).
 *
 * TRANSITIONS (final state, her calls):
 *   - hero -> statement: NONE. Her 2026-07-19 verdict killed the whole
 *     family — the rounded-corner rise revealed pale edges past the radius
 *     and the 换季 colour glide read as a white seam. The statement arrives
 *     square, cream, in plain document flow. (Seams 1-7 + rise/wipe all
 *     deleted; backups in scratchpad, history in memory.)
 *   - statement -> gallery: the separately-approved top blur dissolve,
 *     scrub-gated so a resting page is pixel-pristine (work-gallery.tsx).
 *
 * ?cards= / ?back= remain live comparison plumbing until she picks the final
 * cards style (default noir + dune). AmbientVeil is the site's Three.js
 * warm-mist layer behind everything after the hero.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/v2.css"
/* zone lab styles — the cards deck (default-on) renders inside V2Story with
   .zone-* scoped selectors only. */
import "@/app/lab/zone/zone.css"
/* the shared liquid-glass pill nav (same face as the work detail pages) needs
   the lab glass recipes; every selector is .lab-glass-* scoped, inert
   elsewhere on the page. */
import "@/app/work-classic/lab-demo.css"
/* classic-ds bridges the runtime vars the SHARED Navigation consumes
   (--foreground ink etc.) exactly as on the detail pages, so the pill reads
   identically here; scoped to the nav wrapper below, inert elsewhere. */
import "@/app/work-classic/classic-ds.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { V2Hero } from "@/components/v2/hero"
import { V2Statement } from "@/components/v2/statement"
import { V2Story } from "@/components/v2/story"
import { AmbientVeil } from "@/components/v2/ambient-veil"
import { Navigation } from "@/components/navigation"
import { NavLensFilter } from "@/app/work-classic/nav-lens-filter"

export const metadata: Metadata = {
  title: "Aijia Fang · She designs the experience and builds what runs behind it",
  description:
    "Portfolio of Aijia Fang, product and service designer and AI-native builder. Skya, Nuzzle, Eau De Toi, and software she ships herself.",
}

export default async function V2Page({
  searchParams,
}: {
  searchParams: Promise<{ cards?: string; back?: string }>
}) {
  const { cards, back } = await searchParams
  /* cards deck: default-on, noir style + dune back (her resting pick while the
     final style verdict is pending); ?cards=/?back= still switch for comparison. */
  const cardsResolved = cards ?? "noir"
  const backResolved = back ?? (cards ? undefined : "dune")
  return (
    <>
      {/* ONE site nav (her 2026-07-19 call: the hero's own row duplicated it —
          removed): the same liquid-glass pill as the work detail pages, kept
          OUTSIDE the .ds scope so its type/tokens match those pages exactly. */}
      {/* height:0 + minHeight:0 inline: .classic-ds carries min-height:100vh
          (it normally wraps a whole detail PAGE); as a nav-only bridge that
          would insert a blank first screen above the hero (her bug report
          2026-07-19 — one empty viewport before the valley). Everything
          inside is fixed/zero-size, so zero flow height is correct. */}
      <div
        className={`ds classic-ds section-cream lab-glass-nav ${dsFontVars}`}
        style={{ minHeight: 0, height: 0 }}
      >
        {/* zero-width full-height marker: the shared nav's scroll-spy samples
            .section-cream rects at y=40 to stay in dark-on-light mode (the
            detail pages get this from their full-height wrapper); width 0 =
            paints nothing, the class's background-color is moot. */}
        <div
          className="section-cream"
          aria-hidden="true"
          style={{ position: "fixed", top: 0, left: 0, width: 0, height: "100svh" }}
        />
        <Navigation />
        <NavLensFilter />
      </div>
      <main className={`ds v2-root ${dsFontVars}`}>
      <AmbientVeil />
      {/* the locked hero keeps its own stacking context above the veil and
          stays pristine daylight — never touched by any transition. */}
      <div className="v2-herowrap">
        <V2Hero />
      </div>
      {/* the light statement — the sole screen 2, dune-soft ground, plain
          document-flow arrival (no entrance treatment — her call). */}
      <V2Statement variant="light" />
      <V2Story cards={cardsResolved} back={backResolved} />
      </main>
    </>
  )
}
