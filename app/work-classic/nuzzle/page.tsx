/**
 * /work-classic/nuzzle — HER ORIGINAL Nuzzle detail page (layout preserved),
 * re-skinned onto the quiet-luxury design system. FINAL register (her verdicts,
 * locked 2026-07-19): veil-new ground + liquid-glass nav & cards. The old
 * comparison params (?bg / ?glass / ?stage / ?content) are deleted; backups in
 * scratchpad if archaeology is needed.
 */
import type { Metadata } from "next"
import NuzzleClassicPage from "./nuzzle-classic"
import { LabBg } from "../lab-bg"
import { NavLensFilter } from "../nav-lens-filter"

export const metadata: Metadata = {
  title: "Nuzzle · Aijia Fang",
}

export default function Page() {
  return (
    <>
      <LabBg kind="veil-new" />
      <div style={{ position: "relative", zIndex: 1 }} className="lab-glass-nav lab-glass-cards">
        <NuzzleClassicPage stage="light" />
        <NavLensFilter />
      </div>
    </>
  )
}
