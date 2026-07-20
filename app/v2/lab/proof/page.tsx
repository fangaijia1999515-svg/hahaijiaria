/**
 * /v2/lab/proof — PROOF LAB (isolated test route)
 * ---------------------------------------------------------------------------
 * Three full demos of the screen-2 redesign (seam choreography × proof
 * layout), per her ask on 2026-07-02. Nothing here touches the live /v2.
 * She picks one, then we tune and wire it into production.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/effects/proof-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { ProofLab } from "@/components/v2/effects/proof-lab"

export const metadata: Metadata = {
  title: "Proof Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function ProofLabPage() {
  return (
    <main className={`ds ${dsFontVars}`}>
      <ProofLab />
    </main>
  )
}
