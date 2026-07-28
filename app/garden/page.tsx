"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { cardById, displayName } from "@/components/tarot/deck"
import { localDateStr } from "@/lib/tarot/draw"
import { getToday, setToday, addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import { DrawBoard } from "@/components/tarot/draw-board"
import type { DrawnCard } from "@/lib/tarot/types"

type TodayState = DrawnCard & { reading?: string; source?: string }
const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"

/**
 * 今日仪式(她 2026-07-23 定稿):牌堆 → 手持大牌扇左右滑、抽一张扣进槽 →
 * 她自己点开那张 → 解读浮现。夜色庭园,牌是唯一亮的东西。
 */
export default function GardenToday() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<"idle" | "draw" | "reveal">("idle")
  const [drawn, setDrawn] = useState<TodayState | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = getToday()
    if (t && t.dateStr === localDateStr()) {
      setDrawn(t)
      setFlipped(true)
      setPhase("reveal")
    }
  }, [])

  const onPicked = useCallback((cards: DrawnCard[]) => {
    const d = cards[0]
    setDrawn(d)
    setToday({ ...d, dateStr: localDateStr() })
    setPhase("reveal")
  }, [])

  const onFlip = useCallback(async () => {
    if (!drawn || flipped) return
    setFlipped(true)
    setLoading(true)
    const dateStr = localDateStr()
    try {
      const r = await fetch("/api/garden/reading", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ spread: "daily", cards: [{ cardId: drawn.cardId, reversed: drawn.reversed }] }),
      })
      const data = await r.json()
      const rec = { cardId: drawn.cardId, reversed: drawn.reversed, dateStr, reading: data.reading as string, source: data.source as string }
      setToday(rec)
      setDrawn(rec)
      addEntry({ dateStr, spread: "daily", cards: [{ cardId: drawn.cardId, reversed: drawn.reversed }], reading: data.reading, source: data.source })
    } catch {
      const rec = { cardId: drawn.cardId, reversed: drawn.reversed, dateStr, reading: "月光有点害羞,过一会儿再来看看这张牌想说什么。", source: "fallback" }
      setToday(rec)
      setDrawn(rec)
    } finally {
      setLoading(false)
    }
  }, [drawn, flipped])

  const hour = new Date().getHours()
  const hello = hour < 5 ? "夜深了" : hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好"
  const card = drawn ? cardById(drawn.cardId) : null
  const sub =
    phase === "idle" ? "月亮升起来了。点一下牌堆,开始今天的一张" : phase === "draw" ? "整面牌墙,一起滑动。凭直觉点一张" : flipped ? "今天陪着你的是" : "它已经在你手里了"

  return (
    <main className="mg-main">
      <h1 className="mg-h1">{mounted ? hello : "月光庭园"}</h1>
      <p className="mg-sub">{sub}</p>
      <div className="mg-center">
        {mounted && phase === "idle" && (
          <button type="button" className="mg-stack mg-breathe" onClick={() => setPhase("draw")} aria-label="开始抽牌">
            <span className="mg-stack-under" />
            <span className="mg-stack-under mg-stack-under2" />
            <img src={BACK_SRC} alt="" draggable={false} />
          </button>
        )}
        {mounted && phase === "draw" && <DrawBoard need={1} onPicked={onPicked} />}
        {mounted && phase === "reveal" && drawn && card && (
          <>
            {!flipped && <p className="mg-hintline">轻轻点开它</p>}
            <CardFlip card={card} reversed={drawn.reversed} flipped={flipped} onFlip={onFlip} size={262} uid="today" />
            {flipped && (
              <div>
                <div className="mg-cardname">
                  {displayName(card)}
                  <span className="mg-face-tag">{drawn.reversed ? "逆位" : "正位"}</span>
                </div>
                <div className="mg-keyword">{card.line}</div>
              </div>
            )}
            {loading && (
              <span className="mg-dots"><i /><i /><i /></span>
            )}
            {drawn.reading && <p className="mg-reading">{drawn.reading}</p>}
            {drawn.reading && !loading && (
              <button
                type="button"
                className="mg-reset"
                onClick={() => {
                  try {
                    window.localStorage.removeItem("mg.today.v1")
                  } catch {}
                  window.location.reload()
                }}
              >
                测试期 · 重新洗一次
              </button>
            )}
          </>
        )}
      </div>
      <div className="mg-links">
        <Link className="mg-linkcard" href="/garden/ask">
          <b>想问一件事</b>
          <span>单张或三张,把心里的事轻轻放上来</span>
        </Link>
        <Link className="mg-linkcard" href="/garden/deck">
          <b>翻翻整副牌</b>
          <span>78 张月光庭园,逐张看故事</span>
        </Link>
      </div>
    </main>
  )
}
