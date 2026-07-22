"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { cardById } from "@/components/tarot/deck"
import { todayCard, localDateStr } from "@/lib/tarot/draw"
import { getToday, setToday, addEntry } from "@/lib/tarot/journal"
import { CardFlip } from "@/components/tarot/card-flip"
import type { DrawnCard } from "@/lib/tarot/types"

type TodayState = DrawnCard & { reading?: string; source?: string }

export default function GardenToday() {
  const [mounted, setMounted] = useState(false)
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

  const flip = useCallback(async () => {
    if (drawn) return
    const dateStr = localDateStr()
    const d = todayCard(dateStr)
    setDrawn(d)
    setFlipped(true)
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

  return (
    <main className="mg-main">
      <h1 className="mg-h1">{mounted ? hello : "月光庭园"}</h1>
      <p className="mg-sub">{card ? "今天陪着你的是" : "来抽一张今天的牌吧,轻轻点一下"}</p>
      <div className="mg-center">
        {mounted && (
          <CardFlip card={card ?? cardById("major-0")} reversed={drawn?.reversed ?? false} flipped={flipped} onFlip={flip} size={250} uid="today" />
        )}
        {card && (
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
