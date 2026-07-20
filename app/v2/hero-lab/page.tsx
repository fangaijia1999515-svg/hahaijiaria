/**
 * /v2/hero-lab — HERO BACKGROUND COMPARISON (isolated preview route)
 * ---------------------------------------------------------------------------
 * The problem is not the landscape (she likes it) — it is CONTINUITY: today the
 * golden landscape world hard-cuts to the cream paper world at the fold. Each
 * version below shows the HERO plus a mock "chapter one" so the SEAM ITSELF is
 * what she judges. Mono-labelled V1 / V2 / V3 with an index at the top so she
 * can just say "V2".
 *
 * Nothing here touches the live hero/story: hero.tsx, story.tsx and v2.css are
 * untouched. Markup/styles were copied into components/v2/hero-lab/* and scoped
 * with an `hl-` prefix. Renders inside `.ds` + dsFontVars like /v2 and /system.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/hero-lab/hero-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { V1AtmosphereBleed } from "@/components/v2/hero-lab/v1-atmosphere-bleed"
import { V2HandmadeGround } from "@/components/v2/hero-lab/v2-handmade-ground"
import { V3ContinuousWorld } from "@/components/v2/hero-lab/v3-continuous-world"

export const metadata: Metadata = {
  title: "Hero Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function HeroLabPage() {
  return (
    <main className={`ds hl-root ${dsFontVars}`}>
      <section className="hl-index">
        <p className="ds-overline hl-index__over">Hero background · carry the world past the fold</p>
        <h1 className="ds-h1 hl-index__title">The world should not end at the fold.</h1>
        <p className="ds-body-lg hl-index__lead">
          You like the landscape, so none of these throw it away lightly. The
          fix is the seam: today the golden world hard-cuts to cream at the fold.
          Each version keeps your headline moment and shows a mock chapter one
          below, so you are judging the join, not the hero alone. Scroll each,
          then tell me a number.
        </p>
        <div className="hl-index__rows">
          <div className="hl-index__row">
            <span className="hl-index__tag">V1</span>
            <div>
              <div className="hl-index__name">Atmosphere Bleed</div>
              <p className="hl-index__desc">
                Keep the photo. Its green foot dissolves up into a champagne haze
                and exhales into paper; chapter one carries a soft echo of that
                light; a blurred strip of the world whispers back at the end.
              </p>
            </div>
          </div>
          <div className="hl-index__row">
            <span className="hl-index__tag">V2</span>
            <div>
              <div className="hl-index__name">Handmade Ground</div>
              <p className="hl-index__desc">
                No photo. One authored warm field, built only from your token
                gradients and paper and linen texture, carried unbroken behind
                hero and chapter one. Answers the "AI image" concern head on.
              </p>
            </div>
          </div>
          <div className="hl-index__row">
            <span className="hl-index__tag">V3</span>
            <div>
              <div className="hl-index__name">Continuous World</div>
              <p className="hl-index__desc">
                The landscape stays, pinned beneath the whole page and frosting
                deeper as you scroll, so it feels like one place seen through
                mist rather than two pages. The most immersive, the heaviest.
              </p>
            </div>
          </div>
        </div>
      </section>

      <V1AtmosphereBleed />
      <V2HandmadeGround />
      <V3ContinuousWorld />

      <section className="hl-index" style={{ minHeight: "40svh" }}>
        <p className="ds-overline hl-index__over">End of lab</p>
        <p className="ds-body-lg hl-index__lead">
          V1 Atmosphere Bleed keeps your image and softens the join. V2 Handmade
          Ground trades the photo for a field you provably authored. V3
          Continuous World makes the landscape one unbroken place. Say a number.
        </p>
      </section>
    </main>
  )
}
