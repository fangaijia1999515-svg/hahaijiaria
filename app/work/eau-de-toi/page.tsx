/**
 * /work/eau-de-toi — rebuilt on the case-study design language (case-v2 layer),
 * replicating the /work/skya pilot. Renders inside `.ds` + dsFontVars (the /v2
 * isolation pattern) so the locked quiet-luxury system applies without touching
 * the legacy pages.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/case-v2/case-v2.css"
import "@/components/case-v2/edt-case.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { EdtCase } from "@/components/case-v2/edt-case"

export const metadata: Metadata = {
  title: "Eau de Toi · Aijia Fang",
  description:
    "A multisensory booth that walks shoppers from decision paralysis to a fragrance they trust. Service design case study by Aijia Fang.",
}

export default function EauDeToiPage() {
  return (
    <main className={`ds cv2 ${dsFontVars}`}>
      <EdtCase />
    </main>
  )
}
