/**
 * /v2/lab — SIGNATURE EFFECTS LAB (isolated preview route)
 * ---------------------------------------------------------------------------
 * Three candidate signature effects, each a full-viewport demo with a mono
 * numbered label so Aijia can say "I want 02". Nothing here touches the live
 * story (story.tsx / hero.tsx / v2.css are untouched). Everything renders
 * inside `.ds` + dsFontVars, styled with ds tokens + the isolated effects.css.
 *
 * Candidates:
 *   01 Liquid Hover           — WebGL displacement work index (floema/trionn)
 *   02 Luminous Portal        — organic mask reveal + persistent orb (her fav)
 *   03 Living Caustics Ground — warm mist/caustics shader (Aesop spa mood)
 *
 * All three: 60fps on M-series, reduced-motion + no-WebGL fallbacks, render
 * loops paused off-screen. Wired into the story next round after she picks.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/effects/effects.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { LiquidHover } from "@/components/v2/effects/liquid-hover"
import { LuminousPortal } from "@/components/v2/effects/luminous-portal"
import { CausticsGround } from "@/components/v2/effects/caustics-ground"

export const metadata: Metadata = {
  title: "Effects Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function V2LabPage() {
  return (
    <main className={`ds fxlab ${dsFontVars}`}>
      <section className="fx-intro">
        <p className="fx-intro__over">Signature effects · pick one</p>
        <h1 className="fx-intro__title">Three ways to make it feel expensive.</h1>
        <p className="fx-intro__body">
          Each section below is a candidate signature moment, distilled from your
          reference board. Scroll through, hover where prompted, and tell me the
          number you want. The one you pick gets wired into the story next.
        </p>
      </section>

      <LiquidHover />
      <LuminousPortal />
      <CausticsGround />

      <section className="fx-intro" style={{ minHeight: "40svh" }}>
        <p className="fx-intro__over">End of lab</p>
        <p className="fx-intro__body">
          01 Liquid Hover, the work index that proves interaction craft. 02
          Luminous Portal, the directed seam from your favorite reference. 03
          Living Caustics Ground, the quiet breathing surface. Say a number.
        </p>
      </section>
    </main>
  )
}
