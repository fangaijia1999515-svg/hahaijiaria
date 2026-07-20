"use client"

/**
 * V3 — CONTINUOUS WORLD.
 * The landscape persists as a STICKY backdrop under the whole block (pinned for
 * the duration of V3, then released), frosting deeper as you scroll so the site
 * reads as one place seen through mist, not two disconnected pages. Chapter one
 * rides a frosted-glass cream panel, so the mist reads as real depth behind it.
 * Reference: RabenRifaie — a single world you scroll THROUGH, camera moving
 * rather than pages swapping.
 *
 * PERFORMANCE (honest): a fixed/sticky blurred full-viewport image is the one
 * costly layer here. To keep it 60fps I do NOT animate the blur radius every
 * frame — the veil OPACITY scrubs continuously (compositor-cheap) and the blur
 * only STEPS at two thresholds (data-frost 0/1/2) with a CSS transition, so the
 * expensive repaint happens twice, not per frame. Reduced-motion / no-JS land
 * on a static mid-frost. Even so, this is the heaviest of the three; on a
 * loaded page I would cap the backdrop-filter to one panel (already the case).
 */
import { useEffect, useRef } from "react"
import { LabNav, LabHeroContent, LabThesisBlock } from "./parts"

export function V3ContinuousWorld() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const world = worldRef.current
    const veil = veilRef.current
    if (!wrap || !world || !veil) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      world.dataset.frost = "1"
      veil.style.setProperty("--hl-frost-veil", "0.55")
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0
      // continuous veil (cheap) + stepped blur (2 crossings, transitioned)
      veil.style.setProperty("--hl-frost-veil", (0.32 + p * 0.5).toFixed(3))
      world.dataset.frost = p < 0.34 ? "0" : p < 0.68 ? "1" : "2"
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section ref={wrapRef} className="hl-ver hl-v3" aria-label="Version 3, Continuous World">
      <div className="hl-verlabel">
        <span className="hl-verlabel__chip" data-dark="true">V3 · Continuous World</span>
      </div>

      {/* the persistent world, pinned for the length of this block */}
      <div ref={worldRef} className="hl-v3__world" data-frost="0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ds/backgrounds/simplified-hero.png" alt="" />
        <div ref={veilRef} className="hl-v3__veil" />
      </div>

      {/* content flows OVER the sticky world */}
      <div className="hl-v3__flow">
        <div className="hl-hero">
          <LabNav />
          <LabHeroContent />
        </div>

        <div className="hl-chapter">
          <div className="hl-v3__panel">
            <LabThesisBlock />
          </div>
        </div>
      </div>
    </section>
  )
}
