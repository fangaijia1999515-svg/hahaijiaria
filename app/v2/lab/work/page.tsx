/**
 * /v2/lab/work — TRIONN-MODEL WORK GALLERY LAB (isolated test route)
 * ---------------------------------------------------------------------------
 * Two candidate treatments of ONE merged horizontal work gallery (3 case
 * studies + 4 self-initiated builds), per her ask after re-recording
 * trionn.com. Nothing here touches the live /v2 story. She picks A or B,
 * then we wire the winner into the story.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "@/components/v2/effects/work-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { WorkGalleryLab } from "@/components/v2/effects/work-gallery-lab"

export const metadata: Metadata = {
  title: "Work Gallery Lab · Aijia Fang",
  robots: { index: false, follow: false },
}

export default function WorkLabPage() {
  return (
    <main className={`ds ${dsFontVars}`}>
      <WorkGalleryLab />
    </main>
  )
}
