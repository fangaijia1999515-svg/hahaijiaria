/**
 * /work-classic/finra — the FINRA × SCADpro case page (the real-client case),
 * same final register as the other three: veil-new ground + liquid-glass
 * nav & cards.
 */
import type { Metadata } from "next"
import FinraClassicPage from "./finra-classic"
import { LabBg } from "../lab-bg"
import { NavLensFilter } from "../nav-lens-filter"

export const metadata: Metadata = {
  title: "FINRA × SCADpro · Aijia Fang",
  description:
    "A ten-week brand and identity audit for FINRA, the regulator of U.S. broker-dealers, delivered with a seventeen-designer SCADpro team.",
}

export default function Page() {
  return (
    <>
      <LabBg kind="veil-new" />
      <div style={{ position: "relative", zIndex: 1 }} className="lab-glass-nav lab-glass-cards">
        <FinraClassicPage stage="light" />
        <NavLensFilter />
      </div>
    </>
  )
}
