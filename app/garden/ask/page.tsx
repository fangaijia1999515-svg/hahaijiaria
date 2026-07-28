"use client"
import { useCallback, useRef, useState } from "react"
import Link from "next/link"
import { cardById, displayName } from "@/components/tarot/deck"
import { SPREADS } from "@/lib/tarot/meanings"
import { crisisCheck, CRISIS_REPLY } from "@/lib/tarot/prompt"
import { localDateStr } from "@/lib/tarot/draw"
import { addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import { DrawBoard } from "@/components/tarot/draw-board"
import type { DrawnCard, SpreadId } from "@/lib/tarot/types"

const ASK_SPREADS: SpreadId[] = ["single", "triad-sab", "triad-ppf"]

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
        setReading("月光有点害羞,稍等片刻再问一次。")
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
          <h1 className="mg-h1">想问一件事</h1>
          <p className="mg-sub">把心里的事轻轻放上来,也可以什么都不写</p>
          <div className="mg-form">
            <input
              className="mg-input"
              value={question}
              maxLength={60}
              placeholder="例:我该如何看待现在这段关系?"
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") start()
              }}
            />
            <div className="mg-spreads">
              {ASK_SPREADS.map((id) => (
                <button key={id} type="button" className={`mg-pill${spreadId === id ? " is-on" : ""}`} onClick={() => setSpreadId(id)}>
                  {SPREADS[id].zh}
                </button>
              ))}
            </div>
            <button type="button" className="mg-btn" onClick={start}>
              开始抽牌
            </button>
          </div>
        </>
      )}

      {phase === "draw" && (
        <>
          <h1 className="mg-h1">心里默念它</h1>
          <p className="mg-sub">整面牌墙,一起滑动。凭直觉点出 {need} 张</p>
          <p className="mg-qfocus">{question ? `「${question}」` : "「今天想对我说什么?」"}</p>
          <DrawBoard need={need} onPicked={onPicked} />
        </>
      )}

      {phase === "reveal" && (
        <>
          <h1 className="mg-h1">{flippedSet.size < picked.length ? "一张一张,亲手打开" : "牌意浮现"}</h1>
          {question && <p className="mg-qecho">「{question}」</p>}
          {flippedSet.size < picked.length && <p className="mg-hintline">还有 {picked.length - flippedSet.size} 张没翻开</p>}
          <div className="mg-slots">
            {picked.map((d, i) => {
              const card = cardById(d.cardId)
              const on = flippedSet.has(i)
              return (
                <figure key={`${d.cardId}-${i}`} className="mg-slot">
                  {need > 1 && <figcaption className="mg-slotlabel">{spread.positions[i]}</figcaption>}
                  <CardFlip card={card} reversed={d.reversed} flipped={on} onFlip={() => flipOne(i)} size={need === 1 ? 262 : 168} uid={`ask-${i}`} />
                  {on && (
                    <figcaption className="mg-slotname">
                      {displayName(card)} <span className="mg-face-tag">{d.reversed ? "逆位" : "正位"}</span>
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
                  再问一次
                </button>
                <Link className="mg-btn" href="/garden/journal">
                  去手记看
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {phase === "safety" && (
        <>
          <h1 className="mg-h1">先抱抱你</h1>
          <p className="mg-reading" style={{ marginTop: 24 }}>{CRISIS_REPLY}</p>
          <div className="mg-center">
            <button type="button" className="mg-btn" onClick={reset}>
              回去
            </button>
          </div>
        </>
      )}
    </main>
  )
}
