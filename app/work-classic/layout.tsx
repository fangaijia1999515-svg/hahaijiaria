/**
 * /work-classic/* — HER ORIGINAL project detail pages (layout preserved),
 * re-skinned onto the locked quiet-luxury design system for comparison.
 *
 * - `ds` brings in the token scope from styles/design-tokens.css
 * - `classic-ds` (app/work-classic/classic-ds.css) bridges the runtime CSS
 *   variables consumed by the SHARED Navigation/Footer (also used by
 *   app/page.tsx) so they re-skin here WITHOUT touching their source.
 * - `section-cream` keeps the shared Navigation in its dark-on-light mode
 *   (its scroll-spy looks for this class); classic-ds re-tints it to ds values.
 */
import type React from "react"
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import "./classic-ds.css"
import { dsFontVars } from "@/lib/ds-fonts"

export const metadata: Metadata = {
  title: "Case Study · Aijia Fang",
}

export default function WorkClassicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`ds classic-ds section-cream ${dsFontVars}`}>
      {children}
    </div>
  )
}
