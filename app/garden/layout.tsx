import type { Metadata } from "next"
import "./garden.css"
import { GardenNav } from "@/components/tarot/garden-nav"

export const metadata: Metadata = {
  title: "Moonlit Garden · 月光庭园",
  description: "轻轻问一件事,抽一张牌。塔罗不是预言,而是每日的情绪陪伴。",
  robots: { index: false, follow: false },
}

export default function GardenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mg-shell">
      {children}
      <GardenNav />
    </div>
  )
}
