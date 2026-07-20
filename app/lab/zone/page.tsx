/**
 * /lab/zone — SKILLS ZONE candidates for the homepage (after Selected work,
 * before the water footer). One shared page, three variants via ?d=1|2|3:
 *   d=1  hanging flip cards (lusion grammar, her skin)
 *   d=2  quiet cards + chips (salakhov upper grammar, safe/minimal)
 *   d=3  quiet cards + a horizontal education/honors journey (the combined ask)
 *
 * Server wrapper (searchParams is a Promise — awaited + validated); the section
 * itself is the "use client" ZoneLab. Rendered inside `.ds` + dsFontVars, the
 * same isolation the live homepage uses, so every --ds-* token resolves. Light
 * tones only. Isolated lab route, noindex; nothing here ships until she picks.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "./zone.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { ZoneLab, type Style } from "./zone-demos"

export const metadata: Metadata = {
  title: "技能区试验场 · Aijia Fang",
  robots: { index: false, follow: false },
}

export default async function ZonePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; s?: string; back?: string }>
}) {
  const { d, s, back } = await searchParams
  const demo: 1 | 2 | 3 = d === "2" ? 2 : d === "3" ? 3 : 1
  const style: Style =
    s === "glass" ? "glass"
    : s === "night" ? "night"
    : s === "noir" ? "noir"
    : s === "noir2" ? "noir2"
    : "dark"
  // forward the raw ?back= string; ZoneLab (client) validates it against the
  // real designs and falls to the per-style default when absent or unknown. The
  // valid-back LIST lives in the "use client" module, whose runtime values a
  // Server Component can't call, so validation stays client-side.
  return (
    <main className={`ds zone-lab ${dsFontVars}`}>
      <ZoneLab d={demo} s={style} back={back} />
    </main>
  )
}
