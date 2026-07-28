"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import { DECK } from "@/components/tarot/deck"
import type { DrawnCard } from "@/lib/tarot/types"

const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"
const ROWS = 4

/**
 * 整面牌墙(她 2026-07-28 定稿:单排扇翻不完 78 张;要 4-5 排铺满、
 * 整片一起左右滑、交互感强):
 * - 78 张分 4 排砖缝错位,装在同一个横向滚动容器里 → 天然整体滑动;
 * - 进场 GSAP 波浪 stagger,全墙一起涌起;
 * - 点中一张:原位淡出,一张"幽灵牌"沿真实轨迹飞进下方的槽(GSAP 矩形飞行);
 * - 抽满 need 张交回父组件,由她亲手逐张翻开。
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
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const els = useRef<(HTMLButtonElement | null)[]>([])
  const slotEls = useRef<(HTMLDivElement | null)[]>([])
  const busy = useRef(false)

  useEffect(() => {
    const sc = scrollRef.current
    if (sc) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) / 2
    const targets = els.current.filter(Boolean)
    gsap.from(targets, {
      y: "+=110",
      opacity: 0,
      duration: 0.75,
      ease: "power3.out",
      stagger: { each: 0.007, from: "random" },
      clearProps: "opacity",
    })
  }, [])

  const pick = (i: number, el: HTMLButtonElement) => {
    if (busy.current || picked.includes(i) || drawn.length >= need) return
    busy.current = true
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    const d: DrawnCard = { cardId: DECK[order[i]].id, reversed: buf[0] % 2 === 0 }
    const slotIdx = drawn.length
    setPicked((p) => [...p, i])

    const finish = () => {
      setDrawn((prev) => {
        const nd = [...prev, d]
        if (nd.length === need) setTimeout(() => onPicked(nd), 420)
        return nd
      })
      busy.current = false
    }

    const slot = slotEls.current[slotIdx]
    if (!slot) {
      finish()
      return
    }
    const a = el.getBoundingClientRect()
    const b = slot.getBoundingClientRect()
    const ghost = document.createElement("img")
    ghost.src = BACK_SRC
    ghost.alt = ""
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
      objectFit: "cover",
      borderRadius: "10px",
      boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
      zIndex: "220",
      pointerEvents: "none",
    })
    document.body.appendChild(ghost)
    gsap.to(ghost, {
      left: b.left,
      top: b.top,
      width: b.width,
      height: b.height,
      rotation: 360,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        ghost.remove()
        finish()
      },
    })
  }

  const perRow = Math.ceil(order.length / ROWS)
  const rows = Array.from({ length: ROWS }, (_, r) => order.slice(r * perRow, (r + 1) * perRow).map((n, k) => ({ n, i: r * perRow + k })))

  return (
    <div className="mg-board">
      <div className="mg-wallscroll" ref={scrollRef}>
        <div className="mg-wall">
          {rows.map((row, r) => (
            <div className="mg-wallrow" key={r} style={{ marginLeft: (r % 2) * 52, zIndex: r + 1 }}>
              {row.map(({ n, i }) => (
                <button
                  key={n}
                  ref={(el) => {
                    els.current[i] = el
                  }}
                  type="button"
                  className={`mg-wallcard${picked.includes(i) ? " is-taken" : ""}`}
                  style={{ transform: `rotate(${(((i * 7) % 5) - 2) * 1.15}deg) translateY(${(((i * 13) % 7) - 3) * 2.2}px)` }}
                  aria-label={`第 ${i + 1} 张牌背`}
                  onClick={(e) => pick(i, e.currentTarget)}
                >
                  <img src={BACK_SRC} alt="" draggable={false} loading="lazy" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mg-slotsrow">
        {Array.from({ length: need }, (_, j) => (
          <div
            key={j}
            ref={(el) => {
              slotEls.current[j] = el
            }}
            className={`mg-slotback${drawn[j] ? " is-filled" : ""}`}
          >
            {drawn[j] && <img src={BACK_SRC} alt="" draggable={false} />}
          </div>
        ))}
      </div>
    </div>
  )
}
