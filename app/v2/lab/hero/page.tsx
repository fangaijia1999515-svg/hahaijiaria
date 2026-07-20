/**
 * /v2/lab/hero — HERO LAB (isolated test route)
 * ---------------------------------------------------------------------------
 * Five full-screen hero candidates, one per landscape she sent, per her ask
 * on 2026-07-02. Nothing here touches the live /v2. She picks a skeleton,
 * then we tune copy and motion and wire it in.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/effects/hero-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { HeroLab } from "@/components/v2/effects/hero-lab"

export const metadata: Metadata = {
  title: "Hero Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function HeroLabPage() {
  return (
    <main className={`ds ${dsFontVars}`}>
      <HeroLab />
    </main>
  )
}
