/**
 * /lab/water — interactive water-ripple proof of concept for the homepage
 * footer. Mouse movement raises ripples across her water material (a classic
 * wave-equation height field, refracting the caustics + catching a sun glint).
 * `?v=1|2|3` swaps the base from her photo to one of her looping top-down
 * water videos (public/video/lab/water-v*.mp4) — ripples ride on live water.
 * Isolated lab route, noindex — nothing here ships until she approves the look.
 */
import type { Metadata } from "next"
import { dsFontVars } from "@/lib/ds-fonts"
import { WaterRipple } from "./water-ripple"
import { WaterFooterMock } from "./footer-mock"
import "./water.css"

export const metadata: Metadata = {
  title: "水波纹演示 · Aijia Fang",
  robots: { index: false, follow: false },
}

const VIDEO_SRCS: Record<string, string> = {
  "1": "/video/lab/water-v1.mp4",
  "2": "/video/lab/water-v2.mp4",
  "3": "/video/lab/water-v3.mp4",
}

export default async function WaterLabPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; footer?: string; ink?: string }>
}) {
  const { v, footer, ink } = await searchParams
  const videoSrc = v ? VIDEO_SRCS[v] : undefined
  /* ?footer=1|2|3 lays the real homepage close content (copy verbatim) over
     the water in three arrangements so she can pick the composition.
     ?ink=1 (with footer=1) bakes the statement INTO the water instead of a
     DOM heading — ripples refract the words themselves. */
  const variant = footer === "1" ? 1 : footer === "2" ? 2 : footer === "3" ? 3 : null
  const inkMode = ink === "1"
  return (
    <main className={`water-page ${dsFontVars}`}>
      <WaterRipple
        videoSrc={videoSrc}
        showLabel={variant === null}
        inkText={inkMode ? "Tell me what you're building." : undefined}
      />
      {variant !== null && <WaterFooterMock variant={variant} inkMode={inkMode} />}
    </main>
  )
}
