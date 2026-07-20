/**
 * /v2/lab/livehero — the GENERATED VALLEY demo (2026-07-08)
 * ---------------------------------------------------------------------------
 * Her ask: could the hero's still render become a code-driven animated world,
 * so the same world can continue through the rest of the site? This page is
 * the proof piece: the daylight valley as a live Three.js scene (breathing
 * grass, rippling lake, drifting pollen, cursor parallax) in her palette,
 * with her real hero copy laid over it for a like-for-like comparison.
 * Isolated lab route; the production hero is untouched.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/components/v2/effects/live-hero.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { LiveHeroScene } from "@/components/v2/effects/live-hero"

export const metadata: Metadata = {
  title: "Live Hero Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function LiveHeroLab() {
  return (
    <main className={`ds ${dsFontVars}`}>
      <section className="lh-stage">
        <LiveHeroScene />
        <div className="lh-copy">
          <h1>
            <em>The organic</em>
            <br />
            made digital.
          </h1>
          <p>An AI-native product designer, from industrial objects to working software.</p>
        </div>
        <p className="lh-note">Live demo · 这一屏全部由代码实时生成，不是图片 · 动一动鼠标 · 往下滚对比原图</p>
      </section>

      {/* the ORIGINAL still render, for a like-for-like comparison */}
      <section className="lh-original">
        <img src="/image/v2/hero.jpg" alt="The current production hero render" />
        <p className="lh-note lh-note--dark">原本的背景图 · 现在正式 hero 用的这张（静态图片）</p>
      </section>
    </main>
  )
}
