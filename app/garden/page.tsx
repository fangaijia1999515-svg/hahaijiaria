"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { DECK, cardById, displayName } from "@/components/tarot/deck"
import { localDateStr } from "@/lib/tarot/draw"
import { getToday, setToday, addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import type { DrawnCard } from "@/lib/tarot/types"

type TodayState = DrawnCard & { reading?: string; source?: string }

const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"

/**
 * 今日屏的仪式(她 2026-07-22 两轮意见:①不能点一下直接翻;②五张不像抽牌,
 * "正常的牌也不是五张"):安静的一叠 → 点一下,整副 78 张洗好摊成一条长带 →
 * 左右滑动,凭直觉停在一张上点它 → 那张翻开。洗牌顺序真随机,点中哪张就是
 * 整副里的那一张;当天存下,不重抽。
 */
export default function GardenToday() {
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<number[] | null>(null)
  const [spreadIn, setSpreadIn] = useState(false)
  const [drawn, setDrawn] = useState<TodayState | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = getToday()
    if (t && t.dateStr === localDateStr()) {
      setDrawn(t)
      setFlipped(true)
    }
  }, [])

  const shuffle = useCallback(() => {
    const a = Array.from({ length: DECK.length }, (_, i) => i)
    const buf = new Uint32Array(1)
    for (let i = a.length - 1; i > 0; i--) {
      crypto.getRandomValues(buf)
      const j = buf[0] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    setOrder(a)
    requestAnimationFrame(() => setTimeout(() => setSpreadIn(true), 30))
  }, [])

  const pick = useCallback(
    async (i: number) => {
      if (drawn || !order) return
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      const d: DrawnCard = { cardId: DECK[order[i]].id, reversed: buf[0] % 2 === 0 }
      const dateStr = localDateStr()
      setDrawn(d)
      setTimeout(() => setFlipped(true), 80)
      setLoading(true)
      setToday({ ...d, dateStr })
      try {
        const r = await fetch("/api/garden/reading", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ spread: "daily", cards: [d] }),
        })
        const data = await r.json()
        const rec = { ...d, dateStr, reading: data.reading as string, source: data.source as string }
        setToday(rec)
        setDrawn(rec)
        addEntry({ dateStr, spread: "daily", cards: [d], reading: data.reading, source: data.source })
      } catch {
        const rec = { ...d, dateStr, reading: "月光有点害羞,过一会儿再来看看这张牌想说什么。", source: "fallback" }
        setToday(rec)
        setDrawn(rec)
      } finally {
        setLoading(false)
      }
    },
    [drawn, order],
  )

  const hour = new Date().getHours()
  const hello = hour < 5 ? "夜深了" : hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好"
  const card = drawn ? cardById(drawn.cardId) : null
  const sub = card ? "今天陪着你的是" : order ? "整副牌洗好了。左右滑一滑,凭直觉停在一张上" : "来抽一张今天的牌吧,轻轻点一下牌堆"

  return (
    <main className="mg-main">
      <h1 className="mg-h1">{mounted ? hello : "月光庭园"}</h1>
      <p className="mg-sub">{sub}</p>
      <div className="mg-center">
        {mounted && !drawn && !order && (
          <button type="button" className="mg-stack mg-breathe" onClick={shuffle} aria-label="洗牌并摊开">
            <span className="mg-stack-under" />
            <span className="mg-stack-under mg-stack-under2" />
            <img src={BACK_SRC} alt="" draggable={false} />
          </button>
        )}
        {mounted && !drawn && order && (
          <div className="mg-deckwrap">
            <div className="mg-deckstrip">
              {order.map((n, i) => (
                <button
                  key={n}
                  type="button"
                  className={`mg-deckcard${spreadIn ? " is-in" : ""}`}
                  style={{ transitionDelay: `${Math.min(i * 6, 500)}ms`, transform: spreadIn ? `rotate(${((i % 5) - 2) * 0.9}deg)` : undefined }}
                  aria-label={`第 ${i + 1} 张牌背`}
                  onClick={() => pick(i)}
                >
                  <img src={BACK_SRC} alt="" draggable={false} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}
        {mounted && drawn && card && (
          <CardFlip card={card} reversed={drawn.reversed} flipped={flipped} size={250} uid="today" />
        )}
        {card && flipped && (
          <div>
            <div className="mg-cardname">
              {displayName(card)}
              <span className="mg-face-tag">{drawn?.reversed ? "逆位" : "正位"}</span>
            </div>
            <div className="mg-keyword">{card.line}</div>
          </div>
        )}
        {loading && (
          <span className="mg-dots"><i /><i /><i /></span>
        )}
        {drawn?.reading && <p className="mg-reading">{drawn.reading}</p>}
        {drawn && !loading && (
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
