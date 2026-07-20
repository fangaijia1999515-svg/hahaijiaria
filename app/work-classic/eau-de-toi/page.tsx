/**
 * /work-classic/eau-de-toi — HER ORIGINAL Eau de Toi detail page (layout preserved),
 * re-skinned onto the quiet-luxury design system. FINAL register (her verdicts,
 * locked 2026-07-19): veil-new ground + liquid-glass nav & cards. The old
 * comparison params (?bg / ?glass / ?stage / ?content) are deleted; backups in
 * scratchpad if archaeology is needed.
 */
import type { Metadata } from "next"
import EauDeToiClassicPage from "./eau-de-toi-classic"
import { LabBg } from "../lab-bg"
import { NavLensFilter } from "../nav-lens-filter"

export const metadata: Metadata = {
  title: "Eau de Toi · Aijia Fang",
}

export default function Page() {
  return (
    <>
      <LabBg kind="veil-new" />
      <div style={{ position: "relative", zIndex: 1 }} className="lab-glass-nav lab-glass-cards">
        <EauDeToiClassicPage stage="light" />
        <NavLensFilter />
      </div>
    </>
  )
}
