"use client"

import { useEffect, useRef } from "react"

import { getLenis } from "@/lib/lenis"
import { ACCENT } from "@/lib/brand"

const CREAM_RGB = [244, 236, 221] as const

// Lilac duotone ramp. Each cell's luminance maps to deep violet (shadows) →
// lilac (mids) → near-white spark (highlights), so the bloom reads as one
// purple hue family that matches the brand accent — with a bright, light core
// (NOT gold). RAMP_MID is the accent itself (#C9A2FF).
const RAMP_SHADOW = [60, 30, 110] as const // #3C1E6E deep violet
const RAMP_MID = [201, 162, 255] as const // #C9A2FF lilac (= ACCENT)
const RAMP_LIGHT = [247, 241, 255] as const // #F7F1FF near-white spark
function lilacRamp(l: number): [number, number, number] {
  if (l <= 0.5) {
    const t = l / 0.5
    return [
      RAMP_SHADOW[0] + (RAMP_MID[0] - RAMP_SHADOW[0]) * t,
      RAMP_SHADOW[1] + (RAMP_MID[1] - RAMP_SHADOW[1]) * t,
      RAMP_SHADOW[2] + (RAMP_MID[2] - RAMP_SHADOW[2]) * t,
    ]
  }
  const t = (l - 0.5) / 0.5
  return [
    RAMP_MID[0] + (RAMP_LIGHT[0] - RAMP_MID[0]) * t,
    RAMP_MID[1] + (RAMP_LIGHT[1] - RAMP_MID[1]) * t,
    RAMP_MID[2] + (RAMP_LIGHT[2] - RAMP_MID[2]) * t,
  ]
}

// 4x4 Bayer ordered-dither matrix, normalized to (0,1)
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16))

// --- scroll-dissolve tuning ---------------------------------------------
// Fraction of the hero height over which the flower fully dissolves into the
// grid. The flower sits high in the hero and slides under the nav early, so the
// dissolve is tuned to read clearly during its visible life: it's well past
// mid-dissolve by the time it reaches the nav.
const DISSOLVE_FRACTION = 0.45
// Square lattice the petals march onto (canvas-local "digital grid").
const GRID_COLS = 12
// How late the mint core starts dissolving (it goes LAST).
const CORE_DELAY = 0.72
// Ghost landing — faint small dots left sitting on the grid.
const GHOST_SCALE = 0.16
const GHOST_ALPHA = 0.1

type Cell = {
  l: number
  a: number
  r: number
  g: number
  b: number
  d: number
  on: boolean // passes the alpha/luminance gate (is part of the silhouette)
  isMint: boolean
  hxN: number // home x, normalized 0..1 of canvas width
  hyN: number // home y, normalized 0..1 of canvas height
  gxN: number // grid-target x, normalized
  gyN: number // grid-target y, normalized
  t0: number // dissolve start offset (stagger), 0..1
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// easeInOutCubic — matches the project's gliding cadence
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/**
 * Organic × Digital signature: a flower rendered as a real-time ordered-dither
 * (Bayer) halftone — cream pixels on transparent, the brightest seeded mint.
 * Idle "breathing" + cursor displacement at rest.
 *
 * SCROLL-DISSOLVE: as the hero exits, the bloom dissolves into the page's grid.
 * Each petal-cell is staggered (outer first, mint CORE last) and decays in the
 * order color → silhouette (drift onto a grid node) → scale (shrink to a faint
 * ghost dot). Fully reversible — everything is a pure function of scroll, read
 * from the single Lenis clock inside the existing rAF. Reduced motion = a plain
 * opacity crossfade, no per-cell animation.
 */
export function DitherFlower({
  src = "/home/flower.png",
  cols = 84,
  coalesce = false,
  className = "w-[clamp(170px,18vw,272px)]",
}: {
  src?: string
  cols?: number
  className?: string
  /** When true, the bloom RE-FORMS from scattered grid pixels as it scrolls up
   *  into view (the footer bookend to the hero dissolve), instead of dissolving
   *  on hero scroll. */
  coalesce?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let raf = 0
    let grid: Cell[] = []
    let gw = 0
    let gh = 0
    let logicalW = 0
    let logicalH = 0
    let heroH = typeof window !== "undefined" ? window.innerHeight : 1
    let lastReducedP = -1
    const mouse = { x: -9999, y: -9999, active: false }

    const sizeCanvas = () => {
      logicalW = wrap.getBoundingClientRect().width
      logicalH = gw ? (logicalW * gh) / gw : logicalW
      canvas.width = Math.round(logicalW * dpr)
      canvas.height = Math.round(logicalH * dpr)
      canvas.style.height = `${logicalH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const measureHero = () => {
      const hero = document.querySelector("[data-hero]") as HTMLElement | null
      heroH = hero?.offsetHeight || window.innerHeight
    }

    // Single scroll clock: prefer Lenis, fall back to native (reduced motion).
    const scrollY = () => getLenis()?.scroll ?? window.scrollY
    const heroProgress = () => clamp01(scrollY() / (heroH * DISSOLVE_FRACTION))
    // Coalesce: p=1 (scattered pixels) when entering from the bottom of the
    // viewport, easing to p=0 (full bloom) as the flower rises to ~45% height.
    const coalesceProgress = () => {
      const vh = window.innerHeight || 1
      const top = wrap.getBoundingClientRect().top
      return clamp01((top - vh * 0.45) / (vh * 0.4))
    }
    const progress = () => (coalesce ? coalesceProgress() : heroProgress())

    const draw = (t: number) => {
      if (!gw) return
      const p = progress()

      // --- reduced motion: static flower + opacity crossfade ---------------
      if (reduced) {
        if (Math.abs(p - lastReducedP) > 0.002) {
          lastReducedP = p
          wrap.style.opacity = `${1 - 0.9 * ease(p)}`
        }
        // canvas content is drawn once (drawStatic); only opacity tracks scroll
        raf = requestAnimationFrame(draw)
        return
      }

      const cw = logicalW / gw
      const breath = Math.sin(t * 0.001) * 0.045 * (1 - p)
      ctx.clearRect(0, 0, logicalW, logicalH)

      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const cell = grid[y * gw + x]
          if (!cell || !cell.on) continue
          if (cell.l <= BAYER[y & 3][x & 3] + breath) continue // dither gate

          // per-cell local progress (stagger by t0)
          const lp = clamp01((p - cell.t0) / (1 - cell.t0 + 1e-3))
          const colorP = ease(clamp01(lp / 0.4)) // 1st: color decays
          const posP = ease(clamp01((lp - 0.2) / 0.6)) // 2nd: drift to grid
          const scaleP = ease(clamp01((lp - 0.5) / 0.5)) // 3rd: shrink to dot

          // position: home → grid node
          let px = lerp(cell.hxN, cell.gxN, posP) * logicalW
          let py = lerp(cell.hyN, cell.gyN, posP) * logicalH

          let scale = lerp(0.34 + cell.l * 0.92, GHOST_SCALE, scaleP)

          // cursor displacement — only meaningful while still a bloom
          if (mouse.active && p < 0.99) {
            const dx = px - mouse.x
            const dy = py - mouse.y
            const dist = Math.hypot(dx, dy) || 1
            const R = 96
            if (dist < R) {
              const f = (1 - dist / R) * (1 - posP)
              px += (dx / dist) * f * 18
              py += (dy / dist) * f * 18
              scale *= 1 + f * 0.9
            }
          }

          const s = cw * scale

          // colour: lilac duotone keyed by the cell's luminance (vivid),
          // fading toward cream only as it dissolves into the grid
          const [rr, gg, bb] = lilacRamp(cell.l)
          const cr = Math.round(lerp(rr, CREAM_RGB[0], colorP))
          const cg = Math.round(lerp(gg, CREAM_RGB[1], colorP))
          const cb = Math.round(lerp(bb, CREAM_RGB[2], colorP))
          ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`

          const baseAlpha = Math.min(1, 0.32 + cell.l * 0.75)
          ctx.globalAlpha = lerp(baseAlpha, GHOST_ALPHA, ease(lp))
          ctx.fillRect(px - s / 2, py - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    // One static render for reduced motion (no animation loop body redraws).
    const drawStatic = () => {
      if (!gw) return
      const cw = logicalW / gw
      ctx.clearRect(0, 0, logicalW, logicalH)
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const cell = grid[y * gw + x]
          if (!cell || !cell.on) continue
          if (cell.l <= BAYER[y & 3][x & 3]) continue
          const px = cell.hxN * logicalW
          const py = cell.hyN * logicalH
          const s = cw * (0.34 + cell.l * 0.92)
          const [rr, gg, bb] = lilacRamp(cell.l)
          ctx.fillStyle = `rgb(${rr | 0}, ${gg | 0}, ${bb | 0})`
          ctx.globalAlpha = Math.min(1, 0.32 + cell.l * 0.75)
          ctx.fillRect(px - s / 2, py - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const aspect = img.height / img.width
      gw = cols
      gh = Math.max(1, Math.round(cols * aspect))
      const off = document.createElement("canvas")
      off.width = gw
      off.height = gh
      const octx = off.getContext("2d")
      if (!octx) return
      octx.drawImage(img, 0, 0, gw, gh)
      const data = octx.getImageData(0, 0, gw, gh).data
      grid = new Array(gw * gh)
      let cx = 0
      let cy = 0
      let wsum = 0
      for (let i = 0; i < gw * gh; i++) {
        const r = data[i * 4]
        const g = data[i * 4 + 1]
        const b = data[i * 4 + 2]
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        const a = data[i * 4 + 3] / 255
        const on = a > 0.3 && l > 0.17
        grid[i] = {
          l,
          a,
          r,
          g,
          b,
          d: 0,
          on,
          isMint: false,
          hxN: 0,
          hyN: 0,
          gxN: 0,
          gyN: 0,
          t0: 0,
        }
        if (on) {
          cx += (i % gw) * l
          cy += ((i / gw) | 0) * l
          wsum += l
        }
      }
      cx = wsum ? cx / wsum : gw / 2
      cy = wsum ? cy / wsum : gh / 2
      let maxD = 1
      for (let i = 0; i < gw * gh; i++) {
        const c = grid[i]
        if (c.on) {
          c.d = Math.hypot((i % gw) - cx, ((i / gw) | 0) - cy)
          if (c.d > maxD) maxD = c.d
        }
      }

      // precompute per-cell home + grid targets + stagger (canvas-local,
      // normalized so it survives any resize)
      const gridRows = Math.max(1, Math.round(GRID_COLS * aspect))
      for (let i = 0; i < gw * gh; i++) {
        const c = grid[i]
        c.d /= maxD
        const gx = i % gw
        const gy = (i / gw) | 0
        // home (normalized): cw cancels, so this is just cell-centre fraction
        c.hxN = (gx + 0.5) / gw
        c.hyN = (gy + 0.5) / gh
        // snap to the square lattice node nearest the home position
        const col = Math.round(c.hxN * GRID_COLS - 0.5)
        const row = Math.round(c.hyN * gridRows - 0.5)
        c.gxN = (col + 0.5) / GRID_COLS
        c.gyN = (row + 0.5) / gridRows
        // mint = the living core (same gate the renderer uses)
        c.isMint = c.l > 0.6 && c.d < 0.42
        // stagger: outer cells (high d) dissolve first; centre later; mint LAST
        const jitter =
          (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.12
        let t0 = (1 - c.d) * 0.5 + jitter
        if (c.isMint) t0 = Math.max(t0, CORE_DELAY)
        c.t0 = Math.min(0.92, Math.max(0, t0))
      }

      measureHero()
      sizeCanvas()
      if (reduced) {
        drawStatic()
        wrap.style.opacity = `${1 - 0.9 * ease(progress())}`
        lastReducedP = progress()
      }
      raf = requestAnimationFrame(draw)
    }
    img.src = src

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
      mouse.x = mouse.y = -9999
    }
    const onResize = () => {
      measureHero()
      sizeCanvas()
      if (reduced) drawStatic()
    }

    if (!reduced) {
      canvas.addEventListener("mousemove", onMove)
      canvas.addEventListener("mouseleave", onLeave)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", onResize)
    }
  }, [src, cols])

  return (
    <div
      ref={wrapRef}
      className={className}
      data-cursor-hover
      data-cursor-color={ACCENT}
      data-cursor-no-magnet
      aria-label="A flower rendered as a dithered pixel halftone that dissolves into the page grid, the Organic × Digital mark"
    >
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  )
}
