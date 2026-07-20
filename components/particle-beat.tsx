"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"

import { gsap } from "@/lib/gsap"
import { ACCENT_RGB } from "@/lib/brand"

const [AR, AG, AB] = ACCENT_RGB

/**
 * THE DISSOLVE — the site's one scarce cinematic beat, built entirely from
 * Aijia's OWN motif instead of a generic particle burst: her dither-flower is
 * rendered as a halftone specimen that, as you scroll the pinned section, MARCHES
 * onto a digital lattice — every petal-cell drifts to its nearest grid node, its
 * lilac drains toward cream, and it shrinks to a ghost dot while the grid lines
 * themselves draw in. Organic resolving into Digital, literally. It rhymes with
 * the hero (flower → grid) and the footer (grid → flower), so the three moments
 * read as one deliberate system, not a one-off effect.
 *
 * TECH: a single 2D canvas (same technique as <DitherFlower>), no WebGL/Three.
 * Progress is driven by ONE GSAP ScrollTrigger (scrub) reading the shared Lenis
 * scroll clock; the visual is pinned with CSS `sticky` (robust under Lenis) so
 * ScrollTrigger never has to fight momentum-scroll for the pin.
 *
 * PERF/A11Y: DPR capped at 2; the draw loop is paused when offscreen
 * (IntersectionObserver via useInView). prefers-reduced-motion → a static
 * bloom + the line, no scrub, no animation.
 */

const COLS = 60 // dither resolution of the bloom
const GRID_N = 14 // square lattice the petals resolve onto
const CORE_DELAY = 0.66 // the bright core dissolves LAST

// Lilac duotone (matches <DitherFlower> / brand). shadows → lilac → near-white.
const RAMP_SHADOW = [60, 30, 110] as const
const RAMP_MID = ACCENT_RGB // lilac brand accent (single source of truth)
const RAMP_LIGHT = [247, 241, 255] as const
const CREAM_RGB = [244, 236, 221] as const

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

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16))

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

type Cell = {
  l: number
  on: boolean
  hxN: number
  hyN: number
  gxN: number
  gyN: number
  t0: number
}

function DissolveCanvas({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>
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
    let W = 0
    let H = 0
    // bloom box (the centred square the dither lives in, in CSS px)
    let bx = 0
    let by = 0
    let bs = 0

    const sizeCanvas = () => {
      const r = wrap.getBoundingClientRect()
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bs = Math.min(W * 0.92, H * 0.92)
      bx = (W - bs) / 2
      by = (H - bs) / 2
    }

    const drawGridLines = (p: number) => {
      // the digital lattice draws itself in as the bloom resolves
      const a = ease(clamp01((p - 0.15) / 0.85)) * 0.5
      if (a <= 0.001) return
      ctx.strokeStyle = `rgba(${AR},${AG},${AB},${a * 0.4})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i <= GRID_N; i++) {
        const t = i / GRID_N
        const x = bx + t * bs
        const y = by + t * bs
        ctx.moveTo(x, by)
        ctx.lineTo(x, by + bs)
        ctx.moveTo(bx, y)
        ctx.lineTo(bx + bs, y)
      }
      ctx.stroke()
    }

    const draw = (t: number) => {
      if (!gw) {
        raf = requestAnimationFrame(draw)
        return
      }
      const p = reduced ? 0 : progressRef.current
      ctx.clearRect(0, 0, W, H)
      drawGridLines(p)

      const cw = bs / gw
      const breath = reduced ? 0 : Math.sin(t * 0.001) * 0.04 * (1 - p)

      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const cell = grid[y * gw + x]
          if (!cell || !cell.on) continue
          if (cell.l <= BAYER[y & 3][x & 3] + breath) continue

          const lp = clamp01((p - cell.t0) / (1 - cell.t0 + 1e-3))
          const colorP = ease(clamp01(lp / 0.4))
          const posP = ease(clamp01((lp - 0.2) / 0.6))
          const scaleP = ease(clamp01((lp - 0.5) / 0.5))

          const px = bx + lerp(cell.hxN, cell.gxN, posP) * bs
          const py = by + lerp(cell.hyN, cell.gyN, posP) * bs
          const scale = lerp(0.38 + cell.l * 0.95, 0.14, scaleP)
          const s = cw * scale

          const [rr, gg, bb] = lilacRamp(cell.l)
          const cr = Math.round(lerp(rr, CREAM_RGB[0], colorP))
          const cg = Math.round(lerp(gg, CREAM_RGB[1], colorP))
          const cb = Math.round(lerp(bb, CREAM_RGB[2], colorP))
          ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`
          ctx.globalAlpha = lerp(Math.min(1, 0.34 + cell.l * 0.72), 0.12, ease(lp))
          ctx.fillRect(px - s / 2, py - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const aspect = img.height / img.width
      gw = COLS
      gh = Math.max(1, Math.round(COLS * aspect))
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
        grid[i] = { l, on, hxN: 0, hyN: 0, gxN: 0, gyN: 0, t0: 0 }
        if (on) {
          cx += (i % gw) * l
          cy += ((i / gw) | 0) * l
          wsum += l
        }
      }
      cx = wsum ? cx / wsum : gw / 2
      cy = wsum ? cy / wsum : gh / 2
      let maxD = 1
      const dist: number[] = new Array(gw * gh).fill(0)
      for (let i = 0; i < gw * gh; i++) {
        if (!grid[i].on) continue
        dist[i] = Math.hypot((i % gw) - cx, ((i / gw) | 0) - cy)
        if (dist[i] > maxD) maxD = dist[i]
      }

      const latRows = Math.max(1, Math.round(GRID_N * aspect))
      for (let i = 0; i < gw * gh; i++) {
        const c = grid[i]
        const gx = i % gw
        const gy = (i / gw) | 0
        c.hxN = (gx + 0.5) / gw
        c.hyN = (gy + 0.5) / gh
        const col = Math.round(c.hxN * GRID_N - 0.5)
        const row = Math.round(c.hyN * latRows - 0.5)
        c.gxN = (col + 0.5) / GRID_N
        c.gyN = (row + 0.5) / latRows
        const dN = dist[i] / maxD
        const isCore = c.l > 0.6 && dN < 0.42
        const jitter = (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.12
        let t0 = (1 - dN) * 0.5 + jitter
        if (isCore) t0 = Math.max(t0, CORE_DELAY)
        c.t0 = Math.min(0.92, Math.max(0, t0))
      }

      sizeCanvas()
      raf = requestAnimationFrame(draw)
    }
    img.src = "/home/flowers/pink.png"

    const onResize = () => sizeCanvas()
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [progressRef])

  return (
    <div
      ref={wrapRef}
      className="relative h-[clamp(220px,42vh,440px)] w-[min(560px,82vw)]"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}

export function ParticleBeat() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const inView = useInView(sectionRef, { margin: "200px 0px 200px 0px" })

  // GSAP ScrollTrigger drives the scrub progress (0 bloom → 1 grid). The visual
  // is pinned via CSS sticky, so ScrollTrigger only owns the scrubbed value.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      const proxy = { p: 0 }
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: () => {
            progressRef.current = proxy.p
          },
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-particle-beat
      className="relative w-full"
      style={{ height: "240dvh", backgroundColor: "#0c0a08" }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* faint warm-black vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 50% 50%, rgba(${AR},${AG},${AB},0.05) 0%, rgba(12,10,8,0) 48%), radial-gradient(140% 120% at 50% 50%, rgba(12,10,8,0) 58%, #0c0a08 100%)`,
          }}
        />

        {inView && (
          <div className="relative z-10">
            <DissolveCanvas progressRef={progressRef} />
          </div>
        )}
      </div>
    </section>
  )
}
