"use client"
import { useEffect, useState } from "react"
import { DECK, SUITS, CardArt, displayName, type TarotCard } from "@/components/tarot/deck"
import { MEANINGS } from "@/lib/tarot/meanings"

const SUIT_SUB: Record<string, string> = {
  cups: "Water and feeling · the language of the night lake",
  wands: "Branch and growth · the language of action",
  pentacles: "Stone and dune · the language of harvest",
  swords: "Feather and moonlight · the language of thought",
}

const GROUPS: { zh: string; sub: string; filter: (c: TarotCard) => boolean }[] = [
  { zh: "Major Arcana", sub: "22 scenes of the moonlit garden", filter: (c) => c.arcana === "major" },
  ...SUITS.map((s) => ({ zh: s.en, sub: SUIT_SUB[s.key] ?? s.line, filter: (c: TarotCard) => c.suit === s.key })),
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
      <h1 className="mg-h1">The Deck</h1>
      <p className="mg-sub">All 78 cards of the moonlit garden. Tap one to see its light and shadow.</p>

      {GROUPS.map((g) => (
        <section key={g.zh}>
          <h2 className="mg-g2">{g.zh}</h2>
          <p className="mg-gsub">{g.sub}</p>
          <div className="mg-gallery">
            {DECK.filter(g.filter).map((c) => (
              <button key={c.id} type="button" className="mg-gcard" onClick={() => setSel(c)}>
                <CardArt card={c} uid={`g-${c.id}`} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {sel && (
        <div className="mg-overlay" onClick={() => setSel(null)} role="dialog" aria-label={sel.name}>
          <div className="mg-ovpanel" onClick={(e) => e.stopPropagation()}>
            <CardArt card={sel} uid={`ov-${sel.id}`} className="mg-ovcard" />
            <div className="mg-ovinfo">
              <div className="mg-cardname">{sel.name}</div>
              <div className="mg-keyword" style={{ textAlign: "left" }}>{sel.line} · {displayName(sel)}</div>
              <p className="mg-ovrow"><b>Upright</b>{MEANINGS[sel.id].light.join(" · ")}</p>
              <p className="mg-ovrow"><b>Reversed</b>{MEANINGS[sel.id].shadow.join(" · ")}</p>
              <p className="mg-ovrow mg-ovimg"><b>Imagery</b>{MEANINGS[sel.id].imagery.join("、")}</p>
              <button type="button" className="mg-btn" onClick={() => setSel(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
