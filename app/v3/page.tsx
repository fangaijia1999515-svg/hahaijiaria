/**
 * /v3 — "NIGHT MEADOW", the unrestricted build (2026-07-07).
 * Her brief: drop every constraint (design system and hero included), aim
 * straight at monolog / salakhov / trionn / haoqi, and keep /v2 untouched as
 * the fallback. Three.js point-cloud meadow + dive-through camera + the
 * night/moon/lume role split. noindex while it is an experiment.
 */
import type { Metadata } from "next"
import "@/components/v3/v3.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { V3Page } from "@/components/v3/v3-page"

export const metadata: Metadata = {
  title: "Aijia Fang · The organic, made digital",
  robots: { index: false, follow: false },
}

export default function V3Route() {
  return (
    <main className={dsFontVars}>
      <V3Page />
    </main>
  )
}
