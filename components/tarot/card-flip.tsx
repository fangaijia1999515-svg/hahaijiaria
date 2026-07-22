"use client"
import { CardArt, type TarotCard } from "@/components/tarot/deck"

/**
 * 牌背(呼吸微光,可点)→ 3D 翻转 → 牌面(逆位时旋转 180°)。
 * size = 牌宽 px,高度按 2:3。
 */
export function CardFlip({
  card,
  reversed,
  flipped,
  onFlip,
  size = 248,
  uid,
}: {
  card: TarotCard
  reversed: boolean
  flipped: boolean
  onFlip?: () => void
  size?: number
  uid?: string
}) {
  const h = Math.round((size * 3) / 2)
  return (
    <div className="mg-flip-wrap" style={{ width: size, height: h }}>
      <div className={`mg-flip${flipped ? " is-flipped" : ""}`}>
        <button type="button" className="mg-face mg-face--back mg-breathe" onClick={onFlip} aria-label="翻开这张牌" disabled={flipped}>
          <img src="/image/cards/moonlit-cover-md.jpg" alt="" draggable={false} />
        </button>
        <div className="mg-face mg-face--front">
          <div className="mg-art" style={reversed ? { transform: "rotate(180deg)" } : undefined}>
            <CardArt card={card} uid={uid ?? `flip-${card.id}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
