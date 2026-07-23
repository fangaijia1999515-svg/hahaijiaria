"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { DECK } from "@/components/tarot/deck"
import type { DrawnCard } from "@/lib/tarot/types"

const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"

/**
 * 手持牌扇(她 2026-07-23 的仪式定稿):整副 78 张摊成一把大扇,左右滑动,
 * 点中哪张,哪张就"被拿走",扣面落进下面的槽;抽满 need 张交回给父组件,
 * 由她自己一张一张翻开。滑动中的弧度用 rAF 直改 DOM,不走 React 状态。
 */
export function DrawBoard({ need, onPicked }: { need: number; onPicked: (cards: DrawnCard[]) => void }) {
  const [order] = useState<number[]>(() => {
    const a = Array.from({ length: DECK.length }, (_, i) => i)
    const buf = new Uint32Array(1)
    for (let i = a.length - 1; i > 0; i--) {
      crypto.getRandomValues(buf)
      const j = buf[0] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  })
  const [picked, setPicked] = useState<number[]>([])
  const [drawn, setDrawn] = useState<DrawnCard[]>([])
  const stripRef = useRef<HTMLDivElement | null>(null)
  const els = useRef<(HTMLButtonElement | null)[]>([])
  const raf = useRef(0)

  const layout = useCallback(() => {
    const strip = stripRef.current
    if (!strip) return
    const w = strip.clientWidth
    const center = strip.scrollLeft + w / 2
    els.current.forEach((el) => {
      if (!el) return
      const x = el.offsetLeft + el.offsetWidth / 2
      const d = Math.max(-1, Math.min(1, (x - center) / (w * 0.62)))
      el.style.transform = `translateY(${d * d * 40}px) rotate(${d * 13}deg) scale(${1.05 - Math.abs(d) * 0.12})`
      el.style.zIndex = String(120 - Math.round(Math.abs(d) * 100))
    })
  }, [])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    strip.scrollLeft = (strip.scrollWidth - strip.clientWidth) / 2
    layout()
    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(layout)
    }
    strip.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      strip.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [layout])

  const pick = (i: number) => {
    if (picked.includes(i) || drawn.length >= need) return
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    const d: DrawnCard = { cardId: DECK[order[i]].id, reversed: buf[0] % 2 === 0 }
    const nextDrawn = [...drawn, d]
    setPicked([...picked, i])
    setDrawn(nextDrawn)
    if (nextDrawn.length === need) setTimeout(() => onPicked(nextDrawn), 620)
  }

  return (
    <div className="mg-board">
      <div className="mg-fanstrip" ref={stripRef}>
        <div className="mg-fanpad" aria-hidden />
        {order.map((n, i) => (
          <button
            key={n}
            ref={(el) => {
              els.current[i] = el
            }}
            type="button"
            className={`mg-fancard${picked.includes(i) ? " is-taken" : ""}`}
            aria-label={`第 ${i + 1} 张牌背`}
            onClick={() => pick(i)}
          >
            <img src={BACK_SRC} alt="" draggable={false} loading="lazy" />
          </button>
        ))}
        <div className="mg-fanpad" aria-hidden />
      </div>
      <div className="mg-slotsrow">
        {Array.from({ length: need }, (_, j) => (
          <div key={j} className={`mg-slotback${drawn[j] ? " is-filled" : ""}`}>
            {drawn[j] && <img src={BACK_SRC} alt="" draggable={false} />}
          </div>
        ))}
      </div>
    </div>
  )
}
