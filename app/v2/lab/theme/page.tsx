/**
 * /v2/lab/theme — SIGNATURE THEME LAB (isolated test route)
 * ---------------------------------------------------------------------------
 * Three candidate signature themes, scrollable, per her ask on 2026-07-06
 * ("这四个我可能都需要 demo" -> the three THEMES as live demos). Nothing here
 * touches the live /v2. She picks one; every site motion then derives from it.
 * Spec: reference-analysis/SIGNATURE-THEME-PROPOSALS.md
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/effects/theme-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { ThemeLab } from "@/components/v2/effects/theme-lab"

export const metadata: Metadata = {
  title: "Theme Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function ThemeLabPage() {
  return (
    <main className={`ds ${dsFontVars}`}>
      <ThemeLab />
    </main>
  )
}
