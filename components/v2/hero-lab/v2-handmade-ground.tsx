"use client"

/**
 * V2 — HANDMADE GROUND.
 * No photo. One authored warm field carried UNBROKEN behind both the hero and
 * chapter one, so there is no seam to disguise: layered ds-token gradients
 * (dawn glow overhead, a shapeless sage horizon, a terracotta whisper) plus
 * paper-fiber and linen texture. This answers the "AI image" note with a
 * ground that is provably hand-built from her own material system.
 * Reference: floema — a single light continuous ground; The Row / Aesop
 * material restraint (atmosphere and tooth, never a literal picture).
 */
import { LabNav, LabHeroContent, LabThesisBlock } from "./parts"

export function V2HandmadeGround() {
  return (
    <section className="hl-ver hl-v2" aria-label="Version 2, Handmade Ground">
      <div className="hl-verlabel"><span className="hl-verlabel__chip">V2 · Handmade Ground</span></div>

      {/* one continuous authored field spanning hero + chapter (no seam) */}
      <div className="hl-v2__field" aria-hidden="true" />
      <div className="hl-v2__horizon" aria-hidden="true" />
      <div className="hl-v2__linen" aria-hidden="true" />
      <div className="hl-v2__grain" aria-hidden="true" />

      <div className="hl-hero">
        <LabNav />
        <LabHeroContent />
      </div>

      <div className="hl-chapter">
        <LabThesisBlock />
      </div>
    </section>
  )
}
