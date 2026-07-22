/**
 * /lab/tarot — her review sheet for all 78 cards. Rendering lives in
 * components/tarot/deck.tsx (the single source); this page is only the grid.
 */
import type { Metadata } from "next"
import { DECK, CardArt, SUITS, MAJOR_RO } from "@/components/tarot/deck"

export const metadata: Metadata = {
  title: "Tarot · Major Arcana · lab",
  robots: { index: false, follow: false },
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 26, marginTop: 28 }
const H2: React.CSSProperties = { fontFamily: "var(--font-ds-display), serif", fontWeight: 500, fontSize: "clamp(1.5rem,2.6vw,2.2rem)", margin: "72px 0 0", letterSpacing: "0.01em" }
const SUB: React.CSSProperties = { margin: "6px 0 0", opacity: 0.65, fontSize: 14 }
const CAP: React.CSSProperties = { fontSize: 12.5, marginTop: 8, opacity: 0.7, textAlign: "center" }

export default function TarotLab() {
  const majors = DECK.filter((c) => c.arcana === "major")
  return (
    <main style={{ minHeight: "100svh", background: "#EFE7D6", padding: "64px clamp(20px,4vw,72px) 120px", fontFamily: "var(--font-ds-hanken), sans-serif", color: "#4A463C" }}>
      <h1 style={{ fontFamily: "var(--font-ds-display), serif", fontWeight: 500, fontSize: "clamp(2rem,4vw,3.2rem)", margin: 0 }}>
        Moonlit Garden · 全套 78 张
      </h1>
      <p style={{ margin: "10px 0 0", opacity: 0.75, maxWidth: 680 }}>
        淡彩方向(你选的 A),全部代码生成、同一模板。22 张大牌 = 22 幕小场景;40 张数字牌 = 含义驱动的构图 + 花色家园氛围;16 张宫廷牌 = 各自独立的小戏。逐张挑毛病即可 — 每条意见都是参数,改一处全套同步。
      </p>

      <h2 style={H2}>大阿卡纳 · Major Arcana</h2>
      <p style={SUB}>22 幕月光庭园的故事</p>
      <div style={GRID}>
        {majors.map((c) => (
          <figure key={c.id} style={{ margin: 0 }}>
            <CardArt card={c} />
            <figcaption style={CAP}>{MAJOR_RO[c.number!]} {c.zh} · {c.line}</figcaption>
          </figure>
        ))}
      </div>

      {SUITS.map((suit) => (
        <section key={suit.key}>
          <h2 style={H2}>{suit.zh} · {suit.en}</h2>
          <p style={SUB}>{suit.line}</p>
          <div style={GRID}>
            {DECK.filter((c) => c.suit === suit.key).map((c) => (
              <figure key={c.id} style={{ margin: 0 }}>
                <CardArt card={c} />
                <figcaption style={CAP}>{c.zh} · {c.line}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
