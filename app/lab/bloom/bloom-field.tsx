"use client"
/**
 * BLOOM STUDY 01 — client shell (lifecycle + the watercolour filter)
 *
 * Owns the persistent paint canvas and drives the generative Garden (garden.ts).
 * The whole composite wears an SVG feTurbulence + feDisplacementMap filter —
 * that displacement is what turns soft low-alpha blobs into bleeding watercolour
 * edges; without it the pigment reads flat. It is applied in CSS on the canvas
 * (`filter: url(#bloom-watercolor) blur(0.5px)`) so the browser composites it on
 * the GPU and every frame of the growth wears it too.
 *
 * Behaviour
 *   full (desktop, motion ok) — grows once over ~7–8s then RESTS (RAF stops on
 *     done); click anywhere clears + regrows a NEW seed (different garden).
 *   reduced-motion / mobile   — no growth animation: the same simulation is run
 *     synchronously to completion and painted once; tap = instant regrow. Mobile
 *     scales the garden down (garden.u) so it never overflows 390.
 *   tab hidden pauses the RAF; resize snaps to the final state (no re-animation);
 *   unmount tears everything down.
 */
import { useEffect, useRef } from "react"
import { Garden } from "./garden"

const DPR_CAP = 1.0 // the displacement filter is per-pixel (full canvas, every
// frame during growth) — 1.0 keeps it affordable; the blur+bleed hide any
// softness, so there is nothing to gain from a denser buffer here.

export function BloomField({ showLabel = true }: { showLabel?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const small = window.matchMedia(
      "(max-width: 759px), (hover: none), (pointer: coarse)",
    ).matches
    const animate = !reduced && !small // only desktop with motion gets the growth

    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)

    let W = 0
    let H = 0
    let garden: Garden | null = null
    let seed = (Date.now() & 0x7fffffff) || 1
    let raf = 0
    let running = false
    let last = 0
    let hasGrownOnce = false

    const sizeCanvas = () => {
      W = host.clientWidth
      H = host.clientHeight
      if (W === 0 || H === 0) return false
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return true
    }

    const clear = () => ctx.clearRect(0, 0, W, H)

    /* run the simulation to completion right now, painting as it goes */
    const renderInstant = () => {
      clear()
      garden = new Garden(ctx, W, H, seed)
      let guard = 6000
      while (!garden.done && guard-- > 0) garden.step(1 / 60)
      hasGrownOnce = true
    }

    /* animated growth: RAF until done, then STOP (rest).
       Pass the REAL dt (only guarded against a negative/huge value; Garden caps
       it at 0.25s internally). Do NOT clamp to 1/30 here — that would make a low
       frame rate play the growth in slow-motion instead of dropping frames. */
    const frame = (now: number) => {
      if (!running || !garden) return
      let dt = (now - last) / 1000
      last = now
      if (dt < 0) dt = 0
      const done = garden.step(dt)
      if (done) {
        running = false
        hasGrownOnce = true
        return // RAF stops — the garden rests
      }
      raf = requestAnimationFrame(frame)
    }
    const startAnimated = () => {
      clear()
      garden = new Garden(ctx, W, H, seed)
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stopRaf = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const grow = () => {
      if (animate) startAnimated()
      else renderInstant()
    }

    /* ---- regrow (new seed → new arrangement) ------------------------------ */
    const regrow = () => {
      stopRaf()
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff
      if (!sizeCanvas()) return
      grow()
    }

    /* ---- visibility: pause the growth RAF while hidden -------------------- */
    const onVisibility = () => {
      if (document.hidden) {
        stopRaf()
      } else if (animate && garden && !garden.done && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    /* ---- resize: snap to the final state, never re-animate ----------------
       NB: ResizeObserver fires once immediately on observe(); we must IGNORE
       that (and any callback where the size did not actually change) or the
       first fire would renderInstant() and snap the growth to its end at load. */
    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      if (host.clientWidth === W && host.clientHeight === H) return
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (host.clientWidth === W && host.clientHeight === H) return
        stopRaf()
        if (!sizeCanvas()) return
        renderInstant() // same seed, laid out for the new size, no animation
      }, 160)
    })

    /* ---- boot ------------------------------------------------------------ */
    if (!sizeCanvas()) return
    grow()
    ro.observe(host)
    host.addEventListener("pointerdown", regrow, { passive: true })
    if (animate) document.addEventListener("visibilitychange", onVisibility)

    /* ---- teardown -------------------------------------------------------- */
    return () => {
      stopRaf()
      window.clearTimeout(resizeTimer)
      ro.disconnect()
      host.removeEventListener("pointerdown", regrow)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div className="bloom-root">
      {/* watercolour paper-bleed filter — feTurbulence drives a displacement map
          so the pigment edges wander a few px (bleed) before a 0.5px soften. */}
      <svg className="bloom-svg" aria-hidden="true" focusable="false">
        <filter
          id="bloom-watercolor"
          x="-6%"
          y="-6%"
          width="112%"
          height="112%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <canvas ref={canvasRef} className="bloom-canvas" aria-hidden="true" />
      {showLabel && <p className="bloom-label">BLOOM STUDY 01 · click to regrow</p>}
    </div>
  )
}
