/**
 * /work-classic/skya — HER ORIGINAL Skya detail page (layout preserved),
 * re-skinned onto the quiet-luxury design system. FINAL register (her verdicts,
 * locked 2026-07-19): veil-new ground + liquid-glass nav & cards. The old
 * comparison params (?bg / ?glass / ?stage / ?content) are deleted; backups in
 * scratchpad if archaeology is needed.
 */
import type { Metadata } from "next"
import SkyaClassicPage from "./skya-classic"
import { LabBg } from "../lab-bg"
import { NavLensFilter } from "../nav-lens-filter"

export const metadata: Metadata = {
  title: "Skya · Aijia Fang",
}

export default function Page() {
  return (
    <>
      <LabBg kind="veil-new" />
      <div style={{ position: "relative", zIndex: 1 }} className="lab-glass-nav lab-glass-cards">
        <SkyaClassicPage stage="light" />
        <NavLensFilter />
      </div>
    </>
  )
}
