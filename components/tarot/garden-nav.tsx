"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  { href: "/garden", zh: "今日" },
  { href: "/garden/ask", zh: "抽牌" },
  { href: "/garden/journal", zh: "手记" },
  { href: "/garden/deck", zh: "牌库" },
]

export function GardenNav() {
  const p = usePathname()
  return (
    <nav className="mg-nav">
      {ITEMS.map((it) => {
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
