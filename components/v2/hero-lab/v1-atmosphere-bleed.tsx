"use client"

/**
 * V1 — ATMOSPHERE BLEED.
 * The landscape does not end, it exhales into paper. Its green foot dissolves
 * up through a champagne-haze veil (the world's OWN horizon light), chapter
 * one's cream ground carries a soft blurred echo of that haze, and one thin
 * blurred landscape strip whispers back at the chapter's end.
 * Reference: bymonolog — a continuous tonal field with a soft light bloom that
 * leaks past the fold, so the color never hard-cuts.
 */
import { LabNav, LabHeroContent, LabThesisBlock } from "./parts"

export function V1AtmosphereBleed() {
  return (
    <section className="hl-ver hl-v1" aria-label="Version 1, Atmosphere Bleed">
      <div className="hl-verlabel"><span className="hl-verlabel__chip">V1 · Atmosphere Bleed</span></div>

      <div className="hl-hero">
        <div className="hl-hero__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ds/backgrounds/simplified-hero.png" alt="" />
        </div>
        <div className="hl-hero__scrim" aria-hidden="true" />
        {/* grass -> champagne haze -> paper dissolve at the hero foot */}
        <div className="hl-v1__grassfade" aria-hidden="true" />
        <LabNav />
        <LabHeroContent />
      </div>

      <div className="hl-chapter">
        <div className="hl-v1__groundveil" aria-hidden="true" />
        <LabThesisBlock />
      </div>

      {/* the world whispers back */}
      <div className="hl-v1__return" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ds/backgrounds/layered-mountains.png" alt="" />
        <div className="hl-v1__return-veil" />
        <p className="hl-v1__return-cap ds-overline">the world returns</p>
      </div>
    </section>
  )
}
