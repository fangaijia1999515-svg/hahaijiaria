"use client"

/**
 * CANDIDATE 02 — LUMINOUS PORTAL
 * ---------------------------------------------------------------------------
 * Steal: her FAVORITE reference (the 3D world-tour). Its signature is an
 * organic blob-shaped mask that wipes one "world" over another as you scroll,
 * while a persistent glowing orb stays put and carries you across the seam.
 * Distilled to a SHIPPABLE, GPU-cheap form: an SVG clip-path blob (no 3D) that
 * grows on a pinned scrub, revealing World B (forest dusk) through World A
 * (warm cream daylight). The orb is a pure-CSS luminous body that never moves
 * with the worlds — it is the constant. This is the directed seam, not a fade.
 *
 * Mechanic: pin the stage, scrub a timeline that scales the clip blob from a
 * seed to full-cover with a touch of rotation, cross-fades the two captions,
 * and drifts the orb a hair. One clock (Lenis). Blob scale on SVG = compositor
 * cheap. refreshPriority:1 matches the project-pin convention in the story.
 *
 * Fallback: prefers-reduced-motion freezes the blob at a composed mid-reveal
 * (both worlds legible) with no pin and no scroll hijack.
 */
import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function LuminousPortal() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const blob = el.querySelector<SVGPathElement>(".fx-portal__blob")
      const capB = el.querySelector<HTMLElement>(".fx-portal__cap-b")
      const capA = el.querySelector<HTMLElement>(".fx-portal__cap-a")
      const orb = el.querySelector<HTMLElement>(".fx-portal__orb")
      const pin = el.querySelector<HTMLElement>(".fx-portal__pin")
      if (!blob || !pin) return

      // idle breathing orb — independent of scroll, always alive
      if (orb && !prefersReduced()) {
        gsap.to(orb, {
          scale: 1.05,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      }

      if (prefersReduced()) {
        // composed static mid-reveal: both worlds readable, no pin
        gsap.set(blob, { scale: 3.4, svgOrigin: "0.5 0.5" })
        gsap.set([capA, capB], { autoAlpha: 1 })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=150%",
          pin: pin,
          scrub: 1,
          refreshPriority: 1,
        },
      })

      tl.fromTo(
        blob,
        { scale: 0.015, rotate: -8, svgOrigin: "0.5 0.5" },
        { scale: 5.6, rotate: 6, svgOrigin: "0.5 0.5" },
        0,
      )
      tl.fromTo(capA, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24 }, 0)
      tl.fromTo(capB, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.28)
      if (orb) tl.to(orb, { yPercent: -8 }, 0)

      // pinned + created out of top-to-bottom order safety
      ScrollTrigger.refresh()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="fx-section fx-portal"
      aria-label="Candidate 02, Luminous Portal"
    >
      {/* organic clip blob (normalized 0..1 space, centered) */}
      <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="fx-portal-clip" clipPathUnits="objectBoundingBox">
            <path
              className="fx-portal__blob"
              d="M0.5,0.37 C0.61,0.36 0.67,0.43 0.66,0.51 C0.65,0.60 0.60,0.66 0.50,0.65 C0.40,0.64 0.34,0.58 0.35,0.49 C0.36,0.40 0.41,0.38 0.5,0.37 Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className="fx-portal__pin">
        <div className="fx-badge">
          <span className="fx-badge__num">02</span>
          <span className="fx-badge__name">Luminous Portal</span>
          <span className="fx-badge__hint">scroll through the seam</span>
        </div>

        {/* World A — warm cream daylight (under) */}
        <div className="fx-portal__world fx-portal__world--a">
          <div className="fx-portal__caption fx-portal__cap-a">
            <p className="fx-portal__eyebrow">Where it starts</p>
            <h2 className="fx-portal__line">She designs the experience</h2>
          </div>
        </div>

        {/* World B — forest dusk, revealed through the blob (over) */}
        <div className="fx-portal__world fx-portal__world--b">
          <div className="fx-portal__caption fx-portal__cap-b">
            <p className="fx-portal__eyebrow">And what it becomes</p>
            <h2 className="fx-portal__line">and builds what runs behind it</h2>
          </div>
        </div>

        {/* the constant: luminous orb, above both worlds */}
        <div className="fx-portal__orb" aria-hidden />
      </div>
    </section>
  )
}
