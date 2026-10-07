import type { Metadata } from "next"
import "./garden.css"
import "./huamaodian.css"
import { GardenNav } from "@/components/tarot/garden-nav"

export const metadata: Metadata = {
  title: "Moonlit Garden · 月光庭园",
  description: "轻轻问一件事,抽一张牌。塔罗不是预言,而是每日的情绪陪伴。",
  robots: { index: false, follow: false },
}

export default function GardenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mg-shell">
      {/* 花锚点双衬线:中文 Noto Serif SC · 英文 Cormorant Garamond(加载失败时退 Songti/Georgia) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
      />
      <div className="mg-sky" aria-hidden />
      <span className="mg-star" aria-hidden style={{ left: "16%", top: "14%" }} />
      <span className="mg-star" aria-hidden style={{ left: "78%", top: "9%", width: 2, height: 2 }} />
      <span className="mg-star" aria-hidden style={{ left: "62%", top: "22%", opacity: 0.32 }} />
      <span className="mg-star" aria-hidden style={{ left: "30%", top: "6%", width: 2, height: 2, opacity: 0.4 }} />
      <span className="mg-star" aria-hidden style={{ left: "88%", top: "30%", opacity: 0.28 }} />
      {children}
      <GardenNav />
    </div>
  )
}
