/**
 * /work/nuzzle — case study on the case-v2 grammar (replicates the /work/skya
 * pilot). Renders inside `.ds` + dsFontVars (the /v2 isolation pattern) so the
 * locked quiet-luxury system applies without touching the legacy pages.
 * All facts carry over verbatim from the previous Nuzzle page; media paths
 * are unchanged. nuzzle-case.css layers case-only styles over case-v2.css.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/case-v2/case-v2.css"
import "@/components/case-v2/nuzzle-case.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { NuzzleCase } from "@/components/case-v2/nuzzle-case"

export const metadata: Metadata = {
  title: "Nuzzle · Aijia Fang",
  description:
    "From breakdown to bond. A shelter-prescribed companion service that closes the expectation gap for first-time cat adopters. Service design case study by Aijia Fang.",
}

export default function NuzzlePage() {
  return (
    <main className={`ds cv2 ${dsFontVars}`}>
      <NuzzleCase />
    </main>
  )
}
