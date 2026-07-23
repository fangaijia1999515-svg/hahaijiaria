"use client"
import { useEffect, useState } from "react"
import { DECK, SUITS, CardArt, displayName, type TarotCard } from "@/components/tarot/deck"
import { MEANINGS } from "@/lib/tarot/meanings"

const GROUPS: { zh: string; sub: string; filter: (c: TarotCard) => boolean }[] = [
  { zh: "大阿卡纳", sub: "22 幕月光庭园的故事", filter: (c) => c.arcana === "major" },
  ...SUITS.map((s) => ({ zh: `${s.zh} · ${s.en}`, sub: s.line, filter: (c: TarotCard) => c.suit === s.key })),
]

export default function GardenDeck() {
  const [sel, setSel] = useState<TarotCard | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main className="mg-main mg-main--wide">
      <h1 className="mg-h1">牌库</h1>
      <p className="mg-sub">78 张月光庭园。点一张,看它的光与影</p>

      {GROUPS.map((g) => (
        <section key={g.zh}>
          <h2 className="mg-g2">{g.zh}</h2>
          <p className="mg-gsub">{g.sub}</p>
          <div className="mg-gallery">
            {DECK.filter(g.filter).map((c) => (
              <button key={c.id} type="button" className="mg-gcard" onClick={() => setSel(c)}>
                <CardArt card={c} uid={`g-${c.id}`} />
                <span>{displayName(c)}</span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {sel && (
        <div className="mg-overlay" onClick={() => setSel(null)} role="dialog" aria-label={displayName(sel)}>
          <div className="mg-ovpanel" onClick={(e) => e.stopPropagation()}>
            <CardArt card={sel} uid={`ov-${sel.id}`} className="mg-ovcard" />
            <div className="mg-ovinfo">
              <div className="mg-cardname">{displayName(sel)}</div>
              <div className="mg-keyword" style={{ textAlign: "left" }}>{sel.line} · {sel.name}</div>
              <p className="mg-ovrow"><b>正位</b>{MEANINGS[sel.id].light.join(" · ")}</p>
              <p className="mg-ovrow"><b>逆位</b>{MEANINGS[sel.id].shadow.join(" · ")}</p>
              <p className="mg-ovrow mg-ovimg"><b>画面</b>{MEANINGS[sel.id].imagery.join("、")}</p>
              <button type="button" className="mg-btn" onClick={() => setSel(null)}>
                收起
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
