"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * 三态导航(花锚点两幕制):
 * - /garden/welcome 开屏 → 无导航(全沉浸)
 * - /garden 晨纸首页 → 奶白圆栏 + 1.75px 圆帽线稿图标,选中 = 深绿墨 + 金点
 * - 其余(ask/journal/deck 仍是夜幕屏)→ 原深色胶囊栏,保持不动
 */

const NIGHT_ITEMS = [
  { href: "/garden", zh: "Home" },
  { href: "/garden/ask", zh: "Draw" },
  { href: "/garden/journal", zh: "Journal" },
  { href: "/garden/deck", zh: "Me" },
]

export function GardenNav() {
  const p = usePathname()
  if (p === "/garden/welcome") return null

  /* 晨纸首页(屏1)自渲染薄纱 dock(hi-fi 落地,2026-09-03);这里不再出栏 */
  if (p === "/garden") return null

  return (
    <nav className="mg-nav">
      {NIGHT_ITEMS.map((it) => {
        const on = it.href === "/garden" ? p === "/garden" : p.startsWith(it.href)
        return (
          <Link key={it.href} href={it.href} className={on ? "is-on" : undefined}>
            {it.zh}
          </Link>
        )
      })}
    </nav>
  )
}
