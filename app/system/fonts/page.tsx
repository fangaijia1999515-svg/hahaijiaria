/**
 * FONT FITTING ROOM · /system/fonts
 * Canela substitutes side by side, so Aijia can pick the display serif by eye.
 * Focus words deliberately contain lowercase "j" (Aijia, Project) since the
 * Fraunces "j" is the complaint. Picking a winner = one token change in
 * styles/design-tokens.css (--ds-font-display).
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import { dsFontVars } from "@/lib/ds-fonts"
import {
  Fraunces, Cormorant, Marcellus, Playfair_Display, EB_Garamond, Instrument_Serif,
} from "next/font/google"

export const metadata: Metadata = {
  title: "Font Fitting Room · Aijia Fang",
  description: "Display serif candidates for the design system.",
}

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap" })
const cormorant = Cormorant({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap" })
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap" })
const garamond = EB_Garamond({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap" })
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" })

const candidates = [
  {
    n: 1, name: "Fraunces", cls: fraunces.className, current: false, hasItalic: true,
    note: "之前用的。质量高，但性格偏“古怪软糯”，j 有一个明显的弯钩尾巴，和 Canela 的冷静不太一样。",
  },
  {
    n: 2, name: "Marcellus", cls: marcellus.className, current: false, hasItalic: false,
    note: "碑刻式喇叭衬线，气质上最接近 Canela 的“安静高级”。j 干净利落。缺点: 只有一个字重、没有真斜体。",
  },
  {
    n: 3, name: "Cormorant", cls: cormorant.className, current: true, hasItalic: true,
    note: "高对比法式优雅，纤细精致，斜体很美。j 修长收敛。整体比 Canela 更“时装”一点。",
  },
  {
    n: 4, name: "Playfair Display", cls: playfair.className, current: false, hasItalic: true,
    note: "经典高对比标题衬线，斜体优雅。j 有小圆球收尾(比 Fraunces 的钩子安静)。用的人较多。",
  },
  {
    n: 5, name: "EB Garamond", cls: garamond.className, current: false, hasItalic: true,
    note: "书卷气经典，永不出错，但更像“出版”而不是“奢侈品牌”。j 传统平和。",
  },
  {
    n: 6, name: "Instrument Serif", cls: instrument.className, current: false, hasItalic: true,
    note: "当代感强的窄长衬线，编辑部/工作室气质，斜体好看。j 简洁。只有一个字重。",
  },
]

export default function FontFittingRoom() {
  return (
    <main className={`ds ${dsFontVars}`} style={{ minHeight: "100vh" }}>
      <div className="ds-container" style={{ paddingBlock: "var(--ds-space-8)" }}>
        <p className="ds-overline" style={{ color: "var(--ds-accent)", marginBottom: "var(--ds-space-4)" }}>
          Font Fitting Room · Canela substitutes
        </p>
        <h1 className="ds-h2" style={{ marginBottom: "var(--ds-space-3)" }}>挑一个当标题衬线</h1>
        <p className="ds-body" style={{ maxWidth: "62ch", marginBottom: "var(--ds-space-7)" }}>
          每一格都是同样的四行: 你的名字、卡片标题、斜体的 hero 句、一行放大的 j 特写。
          选中哪个, 告诉我编号, 我改一个 token, logo/卡片/所有标题全部一起换。
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "var(--ds-space-5)" }}>
          {candidates.map((c) => (
            <section key={c.n} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-lg)",
              padding: "var(--ds-space-6)", background: "var(--ds-raised-bg)", boxShadow: "var(--ds-elev-1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--ds-space-5)" }}>
                <span className="ds-label" style={{ color: "var(--ds-text)" }}>{c.n} · {c.name.toUpperCase()}</span>
                {c.current && <span className="ds-overline" style={{ color: "var(--ds-accent-earth)" }}>CURRENT</span>}
              </div>

              <p className={c.cls} style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ds-text)", margin: 0 }}>
                Aijia Fang
              </p>
              <p className={c.cls} style={{ fontSize: 26, lineHeight: 1.3, color: "var(--ds-text)", margin: "14px 0 0" }}>
                Project Title
              </p>
              <p className={c.cls} style={{ fontSize: 24, lineHeight: 1.3, fontStyle: "italic", color: "var(--ds-text-secondary)", margin: "12px 0 0" }}>
                Storytelling, Reimagined.{!c.hasItalic && <span className="ds-label" style={{ fontStyle: "normal", marginLeft: 8 }}>(无真斜体)</span>}
              </p>
              <p className={c.cls} style={{ fontSize: 56, lineHeight: 1, color: "var(--ds-accent)", margin: "16px 0 0" }}>
                jia · ject
              </p>

              <p className="ds-body-sm" style={{ marginTop: "var(--ds-space-5)", color: "var(--ds-text-muted)" }}>{c.note}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
