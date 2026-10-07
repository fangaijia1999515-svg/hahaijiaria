"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cardById } from "@/components/tarot/deck"
import { SPREADS } from "@/lib/tarot/meanings"
import { crisisCheck, CRISIS_REPLY } from "@/lib/tarot/prompt"
import { localDateStr } from "@/lib/tarot/draw"
import { addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import { DrawBoard } from "@/components/tarot/draw-board"
import type { DrawnCard, SpreadId } from "@/lib/tarot/types"

const ASK_SPREADS: SpreadId[] = ["single", "triad-sab", "triad-ppf"]

/* EN 界面串(content-deck-v1 D-D/D-R);解读 prompt 仍走 meanings.ts 中文位名(known gap:内容线) */
const SPREAD_EN: Record<SpreadId, { chip: string; positions: string[] }> = {
  daily: { chip: "Daily card", positions: [] },
  single: { chip: "One card", positions: [] },
  "triad-ppf": { chip: "Past · Present · Future", positions: ["Past", "Present", "Future"] },
  "triad-sab": { chip: "Situation · Obstacle · Advice", positions: ["Situation", "Obstacle", "Advice"] },
}

/**
 * 问事仪式(她 2026-07-23 定稿):写问题 → 问题居中陪着,手持大牌扇抽出 N 张
 * 扣进槽 → 她自己一张一张点开 → 全部翻开后解读浮现。
 */
export default function GardenAsk() {
  const [phase, setPhase] = useState<"form" | "draw" | "reveal" | "safety">("form")
  const [question, setQuestion] = useState("")
  const [spreadId, setSpreadId] = useState<SpreadId>("single")
  const [picked, setPicked] = useState<DrawnCard[]>([])
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set())
  const [reading, setReading] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const savedRef = useRef(false)

  /* 首页阵法入口卡预选(如 三张牌阵 → triad-ppf);仪式流程本身不变。
     全局转场拦截器(lib/transition-context.tsx)只转发 pathname、会丢 ?spread=,
     所以走 sessionStorage 通道,?spread= 仅作直开链接的兜底 */
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("spread")
      const s = q || window.sessionStorage.getItem("mg.ask.spread")
      window.sessionStorage.removeItem("mg.ask.spread")
      if (s && (ASK_SPREADS as string[]).includes(s)) setSpreadId(s as SpreadId)
    } catch {}
  }, [])

  const need = spreadId === "single" ? 1 : 3
  const spread = SPREADS[spreadId]

  const start = useCallback(() => {
    if (question && crisisCheck(question)) {
      setPhase("safety")
      return
    }
    setPicked([])
    setFlippedSet(new Set())
    setReading(null)
    savedRef.current = false
    setPhase("draw")
  }, [question])

  const fetchReading = useCallback(
    async (cards: DrawnCard[]) => {
      setLoading(true)
      try {
        const r = await fetch("/api/garden/reading", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ spread: spreadId, question: question || undefined, cards }),
        })
        const data = await r.json()
        setReading(data.reading)
        if (!savedRef.current) {
          savedRef.current = true
          addEntry({ dateStr: localDateStr(), spread: spreadId, question: question || undefined, cards, reading: data.reading, source: data.source })
        }
      } catch {
        setReading("The moonlight is a little shy. Wait a moment, then ask again.")
      } finally {
        setLoading(false)
      }
    },
    [question, spreadId],
  )

  const onPicked = useCallback((cards: DrawnCard[]) => {
    setPicked(cards)
    setPhase("reveal")
  }, [])

  const flipOne = useCallback(
    (i: number) => {
      if (flippedSet.has(i)) return
      const next = new Set(flippedSet)
      next.add(i)
      setFlippedSet(next)
      if (next.size === picked.length) setTimeout(() => fetchReading(picked), 600)
    },
    [flippedSet, picked, fetchReading],
  )

  const reset = useCallback(() => {
    setPhase("form")
    setPicked([])
    setFlippedSet(new Set())
    setReading(null)
  }, [])

  return (
    <main className="mg-main">
      {phase === "form" && (
        <>
          <h1 className="mg-h1">What would you like to ask?</h1>
          <p className="mg-sub">Set it down here, or carry it quietly.</p>
          <div className="mg-form">
            <input
              className="mg-input"
              value={question}
              maxLength={60}
              placeholder="Your question, in a few words"
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") start()
              }}
            />
            <div className="mg-spreads">
              {ASK_SPREADS.map((id) => (
                <button key={id} type="button" className={`mg-pill${spreadId === id ? " is-on" : ""}`} onClick={() => setSpreadId(id)}>
                  {SPREAD_EN[id].chip}
                </button>
              ))}
            </div>
            <button type="button" className="mg-btn" onClick={start}>
              Begin your draw
            </button>
          </div>
        </>
      )}

      {phase === "draw" && (
        <>
          <h1 className="mg-h1">Hold it in mind</h1>
          <p className="mg-sub">Take a breath. Let your hand choose {need === 1 ? "one" : String(need)}.</p>
          <p className="mg-qfocus">{question ? `\u201c${question}\u201d` : "The garden is listening"}</p>
          <DrawBoard need={need} onPicked={onPicked} />
        </>
      )}

      {phase === "reveal" && (
        <>
          <h1 className="mg-h1">{flippedSet.size < picked.length ? "Open them one by one, in your own time." : "Reading"}</h1>
          {question && <p className="mg-qecho">“{question}”</p>}
          {flippedSet.size < picked.length && <p className="mg-hintline">{picked.length - flippedSet.size} still face down</p>}
          <div className="mg-slots">
            {picked.map((d, i) => {
              const card = cardById(d.cardId)
              const on = flippedSet.has(i)
              return (
                <figure key={`${d.cardId}-${i}`} className="mg-slot">
                  {need > 1 && <figcaption className="mg-slotlabel">{SPREAD_EN[spreadId].positions[i] ?? spread.positions[i]}</figcaption>}
                  <CardFlip card={card} reversed={d.reversed} flipped={on} onFlip={() => flipOne(i)} size={need === 1 ? 262 : 168} uid={`ask-${i}`} />
                  {on && (
                    <figcaption className="mg-slotname">
                      {card.name} <span className="mg-face-tag">{d.reversed ? "Reversed" : "Upright"}</span>
                      <span className="mg-slotline">{card.line}</span>
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
          <div className="mg-center">
            {loading && (
              <span className="mg-dots"><i /><i /><i /></span>
            )}
            {reading && <p className="mg-reading">{reading}</p>}
            {reading && (
              <div className="mg-row">
                <button type="button" className="mg-btn" onClick={reset}>
                  Ask another
                </button>
                <Link className="mg-btn" href="/garden/journal">
                  Your journal
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "safety" && (
        <>
          <h1 className="mg-h1">You matter more than any card.</h1>
          <p className="mg-reading" style={{ marginTop: 24 }}>{CRISIS_REPLY}</p>
          <div className="mg-center">
            <button type="button" className="mg-btn" onClick={reset}>
              Go back
            </button>
          </div>
        </>
      )}
    </main>
  )
}
