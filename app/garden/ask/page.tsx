"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { DECK, cardById, displayName } from "@/components/tarot/deck"
import { SPREADS } from "@/lib/tarot/meanings"
import { crisisCheck, CRISIS_REPLY } from "@/lib/tarot/prompt"
import { localDateStr } from "@/lib/tarot/draw"
import { addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import type { DrawnCard, SpreadId } from "@/lib/tarot/types"

const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"
const RING_N = 18
const ASK_SPREADS: SpreadId[] = ["single", "triad-sab", "triad-ppf"]

/**
 * 问事流程,按她给的参照录屏(存 .claude/skills/moonlit-tarot/reference/):
 * 写下问题(带示例)→ 环形牌阵缓缓旋转、心里默念 → 从环上亲手抽出 1/3 张
 * → 逐张翻开 → 解读(问题一直陪在旁边)。去宗教感,保留郑重感。
 */
export default function GardenAsk() {
  const [phase, setPhase] = useState<"form" | "ring" | "reveal" | "safety">("form")
  const [question, setQuestion] = useState("")
  const [spreadId, setSpreadId] = useState<SpreadId>("single")
  const [order, setOrder] = useState<number[]>([])
  const [picked, setPicked] = useState<DrawnCard[]>([])
  const [pickedIdx, setPickedIdx] = useState<Set<number>>(new Set())
  const [flippedN, setFlippedN] = useState(0)
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
    const a = Array.from({ length: DECK.length }, (_, i) => i)
    const buf = new Uint32Array(1)
    for (let i = a.length - 1; i > 0; i--) {
      crypto.getRandomValues(buf)
      const j = buf[0] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    setOrder(a)
    setPicked([])
    setPickedIdx(new Set())
    setFlippedN(0)
    setReading(null)
    savedRef.current = false
    setPhase("ring")
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

  const pickFromRing = useCallback(
    (i: number) => {
      if (phase !== "ring" || pickedIdx.has(i) || picked.length >= need) return
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      const d: DrawnCard = { cardId: DECK[order[i]].id, reversed: buf[0] % 2 === 0 }
      const nextPicked = [...picked, d]
      const nextIdx = new Set(pickedIdx)
      nextIdx.add(i)
      setPicked(nextPicked)
      setPickedIdx(nextIdx)
      if (nextPicked.length === need) {
        setTimeout(() => setPhase("reveal"), 350)
        nextPicked.forEach((_, j) => setTimeout(() => setFlippedN(j + 1), 700 + j * 650))
        setTimeout(() => fetchReading(nextPicked), 700 + need * 650)
      }
    },
    [phase, pickedIdx, picked, need, order, fetchReading],
  )

  const reset = useCallback(() => {
    setPhase("form")
    setPicked([])
    setPickedIdx(new Set())
    setFlippedN(0)
    setReading(null)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && phase === "form") start()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, start])

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

      {phase === "ring" && (
        <>
          <h1 className="mg-h1">{question ? "心里默念你的问题" : "静一静,想着今天"}</h1>
          <p className="mg-sub">
            牌环转起来了。凭直觉,从环上抽出 {need} 张{picked.length > 0 ? ` · 还差 ${need - picked.length} 张` : ""}
          </p>
          <div className="mg-ringwrap">
            <div className="mg-ringshadow" />
            <div className="mg-ringscale">
              <div className="mg-ring">
                {Array.from({ length: RING_N }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`mg-ringcard${pickedIdx.has(i) ? " is-picked" : ""}`}
                    style={{ transform: `rotateY(${(i * 360) / RING_N}deg) translateZ(228px)` }}
                    aria-label={`抽第 ${i + 1} 张`}
                    onClick={() => pickFromRing(i)}
                  >
                    <img src={BACK_SRC} alt="" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {question && <p className="mg-qecho">「{question}」</p>}
        </>
      )}

      {phase === "reveal" && (
        <>
          <h1 className="mg-h1">牌意浮现</h1>
          {question && <p className="mg-qecho">「{question}」</p>}
          <div className="mg-slots">
            {picked.map((d, i) => {
              const card = cardById(d.cardId)
              return (
                <figure key={d.cardId} className="mg-slot">
                  {need > 1 && <figcaption className="mg-slotlabel">{spread.positions[i]}</figcaption>}
                  <CardFlip card={card} reversed={d.reversed} flipped={flippedN > i} size={need === 1 ? 240 : 156} uid={`ask-${i}`} />
                  {flippedN > i && (
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
