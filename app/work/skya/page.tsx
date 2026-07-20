/**
 * /work/skya — PILOT of the case-anatomy rebuild (case-v2 layer, dark stage).
 * Renders inside `.ds` + dsFontVars (the /v2 isolation pattern) so the locked
 * quiet-luxury system applies without touching the legacy pages.
 *
 * Stage comparison for her review (orchestrator-approved exception to the
 * "app/work untouched" rule, spec §3): default = the dark warm-charcoal
 * gallery; ?stage=cream renders the one-class cream variant. The dark itself
 * is applied at the component root (.cv2-stage.ds-dark), not here.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/case-v2/case-v2.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { SkyaCase } from "@/components/case-v2/skya-case"

export const metadata: Metadata = {
  title: "Skya · Aijia Fang",
  description:
    "An autonomous delivery ecosystem transforming last-mile logistics into seamless urban infrastructure. Service design case study by Aijia Fang.",
}

export default async function SkyaPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>
}) {
  const { stage } = await searchParams
  return (
    <main className={`ds cv2 ${dsFontVars}`}>
      <SkyaCase stage={stage === "cream" ? "cream" : "dark"} />
    </main>
  )
}
