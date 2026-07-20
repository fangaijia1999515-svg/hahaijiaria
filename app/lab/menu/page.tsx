/**
 * /lab/menu — clickable index of every background/glass comparison link,
 * so she can hop through the whole matrix from one page. Demo plumbing;
 * deleted when decisions land. noindex.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import { dsFontVars } from "@/lib/ds-fonts"

export const metadata: Metadata = {
  title: "对比链接总目录 · Aijia Fang",
  robots: { index: false, follow: false },
}

const S = "/work-classic/skya"

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "决赛圈 · 版本对比(全带玻璃)",
    links: [
      { href: `${S}?bg=veil-first&glass=both`, label: "veil 第一版(最早那版)" },
      { href: `${S}?bg=veil&glass=both`, label: "veil 上一版(入围时的样子)" },
      { href: `${S}?bg=veil-new&glass=both`, label: "veil 最新(深边更淡 + 更散开)" },
      { href: `${S}?bg=plasma&glass=both`, label: "plasma 上一版(静态靠左)" },
      { href: `${S}?bg=plasma-new&glass=both`, label: "plasma 最新(全场无规则游走)" },
    ],
  },
  {
    title: "第三轮(看得见的动 + 全部配玻璃)",
    links: [
      { href: `${S}?bg=aurora&glass=both`, label: "流沙极光 v3" },
      { href: `${S}?bg=grainient&glass=both`, label: "流沙腮红 v3(成块+会动)" },
      { href: `${S}?bg=veil&glass=both`, label: "veil 光纱 v3(提速)" },
      { href: `${S}?bg=plasma&glass=both`, label: "plasma 光缕 v3(靠左)" },
      { href: `${S}?bg=dune-soft&glass=both&content=boost`, label: "淡沙丘+玻璃+内容强化(对照)" },
    ],
  },
  {
    title: "第二轮迭代(改版 + 新背景 + 内容强化)",
    links: [
      { href: `${S}?bg=aurora`, label: "流沙极光 · 改版(光带到顶部 + 左中/右下光斑)" },
      { href: `${S}?bg=grainient`, label: "流沙渐变 · 改版(流动更明显,过渡更柔)" },
      { href: `${S}?bg=veil`, label: "veil 光纱 · 新(有机光场,沙色)" },
      { href: `${S}?bg=plasma`, label: "plasma 光缕 · 新(轻盈raymarch,沙金)" },
      { href: `${S}?bg=dune-soft&glass=both&content=boost`, label: "淡沙丘 + 全玻璃 + 内容强化" },
      { href: `${S}?bg=veil&glass=both`, label: "veil 光纱 + 全玻璃" },
      { href: `${S}?bg=plasma&glass=both`, label: "plasma 光缕 + 全玻璃" },
    ],
  },
  {
    title: "首页(沙丘上首页)",
    links: [
      { href: "/v2?bg=dune&v=light", label: "首页 · 沙丘 + 浅色第二屏" },
      { href: "/v2?bg=dune&v=dark", label: "首页 · 沙丘 + 深色第二屏" },
      { href: "/v2?v=light", label: "首页 · 原样(无沙丘,对照)" },
    ],
  },
  {
    title: "Detail 页 · 背景单独看(Skya 真实页)",
    links: [
      { href: `${S}?bg=dune`, label: "沙丘 · 原强度" },
      { href: `${S}?bg=dune-soft`, label: "沙丘 · 更淡版" },
      { href: `${S}?bg=dune-grid`, label: "淡沙丘 + 格子" },
      { href: `${S}?bg=grid`, label: "方格(第一版)" },
      { href: `${S}?bg=grid-dots`, label: "点阵格" },
      { href: `${S}?bg=grid-blueprint`, label: "蓝图双线格" },
      { href: `${S}?bg=grid-live`, label: "鼠标互动格(动鼠标试)" },
      { href: `${S}?bg=grainient`, label: "流沙渐变(无绿)" },
      { href: `${S}?bg=grainient-grid`, label: "流沙渐变 + 格" },
      { href: `${S}?bg=aurora`, label: "流沙极光(无绿)" },
      { href: `${S}?bg=beams`, label: "暖光柱" },
      { href: S, label: "无背景(对照)" },
    ],
  },
  {
    title: "玻璃单独看(无背景)",
    links: [
      { href: `${S}?glass=nav`, label: "玻璃导航胶囊" },
      { href: `${S}?glass=cards`, label: "三卡玻璃" },
      { href: `${S}?glass=both`, label: "导航 + 卡片都玻璃" },
    ],
  },
  {
    title: "组合(背景 + 玻璃)",
    links: [
      { href: `${S}?bg=dune-soft&glass=both`, label: "淡沙丘 + 全玻璃(我的推荐)" },
      { href: `${S}?bg=dune-grid&glass=both`, label: "淡沙丘格 + 全玻璃" },
      { href: `${S}?bg=dune&glass=both`, label: "沙丘原强度 + 全玻璃" },
      { href: `${S}?bg=dune-soft&glass=nav`, label: "淡沙丘 + 只玻璃导航" },
      { href: `${S}?bg=grid-blueprint&glass=both`, label: "蓝图格 + 全玻璃" },
      { href: `${S}?bg=grid-live&glass=both`, label: "互动格 + 全玻璃" },
      { href: `${S}?bg=grainient-grid&glass=both`, label: "流沙渐变格 + 全玻璃" },
      { href: `${S}?bg=aurora&glass=both`, label: "流沙极光 + 全玻璃" },
    ],
  },
  {
    title: "换个项目试(图多的页面看背景打不打架)",
    links: [
      { href: "/work-classic/nuzzle?bg=dune-soft&glass=both", label: "Nuzzle · 淡沙丘 + 全玻璃" },
      { href: "/work-classic/eau-de-toi?bg=dune-soft&glass=both", label: "Eau de Toi · 淡沙丘 + 全玻璃" },
      { href: "/work-classic/nuzzle?bg=grid-live", label: "Nuzzle · 互动格" },
      { href: "/work-classic/eau-de-toi?bg=grainient", label: "Eau de Toi · 流沙渐变" },
    ],
  },
]

export default function LabMenu() {
  return (
    <main
      className={dsFontVars}
      style={{
        minHeight: "100svh",
        background: "#f5f0e8",
        color: "#2d2d2d",
        padding: "clamp(40px, 8vw, 96px)",
        fontFamily: "var(--font-ds-hanken), sans-serif",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-ds-display), serif",
          fontWeight: 500,
          fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)",
          margin: "0 0 10px",
        }}
      >
        对比链接总目录
      </h1>
      <p style={{ margin: "0 0 40px", color: "#6e675c", fontSize: 14.5 }}>
        每个链接都会开一个真实页面。看完直接回这页点下一个。
      </p>
      {GROUPS.map((g) => (
        <section key={g.title} style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontFamily: "var(--font-ds-plex-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6e675c",
              margin: "0 0 14px",
            }}
          >
            {g.title}
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
            {g.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  style={{ color: "#2d2d2d", textDecorationColor: "rgba(45,45,45,0.35)" }}
                >
                  {l.label}
                </a>
                <span
                  style={{
                    marginLeft: 10,
                    fontFamily: "var(--font-ds-plex-mono), monospace",
                    fontSize: 11.5,
                    color: "#9a9287",
                  }}
                >
                  {l.href}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
