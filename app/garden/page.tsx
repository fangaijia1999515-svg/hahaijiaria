"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { cardById } from "@/components/tarot/deck"
import { drawUnique, localDateStr } from "@/lib/tarot/draw"
import { getToday, setToday, addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import type { DrawnCard } from "@/lib/tarot/types"

type TodayState = DrawnCard & { reading?: string; source?: string }

/**
 * 今日屏的仪式(她 2026-07-22 的意见:不能点一下直接翻,要有"抽"的感觉):
 * 静静一叠牌背 → 点一下,展开一扇 → 凭直觉挑一张 → 那张才翻开。
 * 挑中哪张就是哪张(真随机),当天存下,不重抽。
 */
export default function GardenToday() {
  const [mounted, setMounted] = useState(false)
  const [fanOpen, setFanOpen] = useState(false)
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

  const pick = useCallback(async () => {
    if (drawn) return
    const dateStr = localDateStr()
    const d = drawUnique(1)[0]
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
  }, [drawn])

  const hour = new Date().getHours()
  const hello = hour < 5 ? "夜深了" : hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好"
  const card = drawn ? cardById(drawn.cardId) : null
  const sub = card ? "今天陪着你的是" : fanOpen ? "凭直觉,选一张" : "来抽一张今天的牌吧,轻轻点一下"

  return (
    <main className="mg-main">
      <h1 className="mg-h1">{mounted ? hello : "月光庭园"}</h1>
      <p className="mg-sub">{sub}</p>
      <div className="mg-center">
        {mounted && !drawn && (
          <div className="mg-fan" role="group" aria-label="牌堆">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                className={`mg-fanback${fanOpen ? "" : " mg-breathe"}`}
                aria-label={fanOpen ? `选第 ${i + 1} 张` : "展开牌堆"}
                style={{
                  transform: fanOpen
                    ? `translateX(${(i - 2) * 56}px) translateY(${Math.abs(i - 2) * 10}px) rotate(${(i - 2) * 9}deg)`
                    : `translateX(0px) translateY(${i * -1.5}px) rotate(0deg)`,
                  zIndex: 10 + i,
                }}
                onClick={() => (fanOpen ? pick() : setFanOpen(true))}
              >
                <img src="/image/cards/moonlit-cover.png" alt="" draggable={false} />
              </button>
            ))}
          </div>
        )}
        {mounted && drawn && card && (
          <CardFlip card={card} reversed={drawn.reversed} flipped={flipped} size={250} uid="today" />
        )}
        {card && flipped && (
          <div className="mg-cardname">
            {card.zh} · {card.line}
            <span className="mg-face-tag">{drawn?.reversed ? "影面" : "光面"}</span>
          </div>
        )}
        {loading && (
          <span className="mg-dots"><i /><i /><i /></span>
        )}
        {drawn?.reading && <p className="mg-reading">{drawn.reading}</p>}
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
