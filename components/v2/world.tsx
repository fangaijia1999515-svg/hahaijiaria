"use client"

/**
 * V2 CONTINUOUS WORLD — her chosen hero-continuity direction (hero-lab V3),
 * upgraded for her 竖屏背景 portrait artwork (1152x2048): where the image is
 * taller than the viewport, scrolling PANS THE CAMERA DOWN the artwork (sky at
 * the hero, grass and water by the end of the thesis) instead of only
 * frosting. The frost veil still deepens on top of the pan, so page one and
 * page two read as ONE place the camera moves through.
 *
 * PERFORMANCE: the pan is a translate3d (compositor-only) driven by the same
 * rAF as the veil opacity; the BLUR still only steps at two thresholds
 * (data-frost 0/1/2) behind a CSS transition. If the scaled image has no
 * meaningful pan room (e.g. phone viewports match the portrait aspect), the
 * world falls back to static cover + frost (data-pan="off").
 * Reduced-motion / no-JS land on a static mid-frost cover.
 */
import { useEffect, useRef, type ReactNode } from "react"

export function V2World({
  src = "/ds/backgrounds/portrait-valley.jpg",
  children,
}: {
  src?: string
  children: ReactNode
}) {
  const wrapRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const world = worldRef.current
    const img = imgRef.current
    const veil = veilRef.current
    if (!wrap || !world || !img || !veil) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      world.dataset.pan = "off"
      world.dataset.frost = "1"
      // lighter static veil so the valley stays visible under the proof ledger
      veil.style.setProperty("--v2-frost-veil", "0.30")
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0

      // camera pan: slide the tall artwork up by its overflow, sky -> ground.
      // Falls back to cover-fit frost when there is no room to pan.
      const panRange = img.offsetHeight - world.offsetHeight
      if (panRange > 48) {
        world.dataset.pan = "on"
        img.style.transform = `translate3d(0, ${(-panRange * p).toFixed(1)}px, 0)`
      } else {
        world.dataset.pan = "off"
        img.style.transform = ""
      }

      // SCREEN-2-SPEC: the ledger is read right up to p=1 (it is the last
      // frame of the world), so the valley stays CRISP the whole way; the
      // cream dissolve is carried by .v2-cw::after during the slide-away,
      // not by frosting the frame she is reading.
      veil.style.setProperty("--v2-frost-veil", (0.22 + p * 0.12).toFixed(3))
      world.dataset.frost = "0"
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    update()
    // re-measure once the artwork has real dimensions
    if (!img.complete) img.addEventListener("load", onScroll, { once: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section ref={wrapRef} className="v2-cw">
      <div ref={worldRef} className="v2-cw__world" data-frost="0" data-pan="off" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt="" decoding="async" />
        <div ref={veilRef} className="v2-cw__veil" />
      </div>
      <div className="v2-cw__flow">{children}</div>
    </section>
  )
}
