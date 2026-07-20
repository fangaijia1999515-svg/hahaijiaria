"use client"

import { useEffect, useRef, useState } from "react"
import { createNoise2D } from "simplex-noise"

import { ACCENT_RGB } from "@/lib/brand"

/**
 * HERO FIELD — the site's single ambient atmosphere layer. A field of vertical
 * lilac lines that breathe on a simplex-noise current and bend away from the
 * cursor like reeds under a hand: the DIGITAL grid behaving ORGANICALLY where
 * you touch it. Adapted (canvas, not 200 live SVG paths) from the 21st.dev
 * "Waves" line-field so it stays silky at 60fps behind the hero content.
 *
 * Restraint by construction: lilac-only, low alpha, slow noise, edge-vignetted
 * so the lines emerge from the warm-black rather than tiling it. PERF: DPR≤2,
 * the rAF loop runs only while the hero is on screen (IntersectionObserver),
 * the mouse is read from a single passive window listener and lerped on the
 * frame clock. Under prefers-reduced-motion it paints ONE static frame (no loop)
 * and the CSS grid-backbone remains the structural fallback. pointer-events-none.
 */

const [AR, AG, AB] = ACCENT_RGB

type Pt = {
  x: number
  y: number
  wx: number
  wy: number
  cx: number
  cy: number
  cvx: number
  cvy: number
}

export function HeroField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced, setReduced] = useState(false)
  const [mounted, setMounted] = useState(false)

  // live mouse in CSS px relative to the canvas; smoothed copy follows it
  const mouse = useRef({ x: -999, y: -999, sx: -999, sy: -999, vs: 0, a: 0, lx: 0, ly: 0, set: false })
  const inView = useRef(true)

  useEffect(() => {
    setMounted(true)
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const noise = createNoise2D()
    let lines: Pt[][] = []
    let W = 0
    let H = 0
    let dpr = 1

    // line geometry — generous gaps read as an elegant current, not a mesh
    const xGap = 38
    const yGap = 26

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      W = rect.width
      H = rect.height
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      lines = []
      const oWidth = W + 80
      const oHeight = H + 60
      const cols = Math.ceil(oWidth / xGap)
      const rows = Math.ceil(oHeight / yGap)
      const x0 = (W - xGap * cols) / 2
      const y0 = (H - yGap * rows) / 2
      for (let i = 0; i < cols; i++) {
        const pts: Pt[] = []
        for (let j = 0; j < rows; j++) {
          pts.push({
            x: x0 + xGap * i,
            y: y0 + yGap * j,
            wx: 0,
            wy: 0,
            cx: 0,
            cy: 0,
            cvx: 0,
            cvy: 0,
          })
        }
        lines.push(pts)
      }
    }

    const move = (t: number) => {
      const m = mouse.current
      for (const pts of lines) {
        for (const p of pts) {
          // slow noise current — the "breath"
          const n = noise((p.x + t * 0.008) * 0.0016, (p.y + t * 0.004) * 0.0014) * 7
          p.wx = Math.cos(n) * 18
          p.wy = Math.sin(n) * 8

          // cursor force — lines bend away from the hand, then spring back
          const dx = p.x - m.sx
          const dy = p.y - m.sy
          const d = Math.hypot(dx, dy)
          const l = Math.max(160, m.vs)
          if (d < l) {
            const s = 1 - d / l
            const f = Math.cos(d * 0.001) * s
            p.cvx += Math.cos(m.a) * f * l * m.vs * 0.00045
            p.cvy += Math.sin(m.a) * f * l * m.vs * 0.00045
          }
          p.cvx += (0 - p.cx) * 0.0085
          p.cvy += (0 - p.cy) * 0.0085
          p.cvx *= 0.94
          p.cvy *= 0.94
          p.cx = Math.max(-46, Math.min(46, p.cx + p.cvx))
          p.cy = Math.max(-46, Math.min(46, p.cy + p.cvy))
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.lineWidth = 1
      ctx.lineCap = "round"
      const m = mouse.current
      for (const pts of lines) {
        if (pts.length < 2) continue
        // proximity of this column to the cursor → brighter, alive near the hand
        const colX = pts[0].x
        const near = Math.max(0, 1 - Math.abs(colX - m.sx) / 300)
        const baseA = 0.085 + near * 0.2

        ctx.beginPath()
        const p0 = pts[0]
        ctx.moveTo(p0.x + p0.wx, p0.y + p0.wy)
        // quadratic smoothing through midpoints for a silky, continuous stroke
        for (let i = 1; i < pts.length - 1; i++) {
          const c = pts[i]
          const nx = pts[i + 1]
          const cxp = c.x + c.wx + c.cx
          const cyp = c.y + c.wy + c.cy
          const mx = (cxp + nx.x + nx.wx + nx.cx) / 2
          const my = (cyp + nx.y + nx.wy + nx.cy) / 2
          ctx.quadraticCurveTo(cxp, cyp, mx, my)
        }
        ctx.strokeStyle = `rgba(${AR}, ${AG}, ${AB}, ${baseA.toFixed(3)})`
        ctx.stroke()
      }
    }

    let raf = 0
    const tick = (time: number) => {
      const m = mouse.current
      m.sx += (m.x - m.sx) * 0.1
      m.sy += (m.y - m.sy) * 0.1
      const dx = m.x - m.lx
      const dy = m.y - m.ly
      const dist = Math.hypot(dx, dy)
      m.vs += (dist - m.vs) * 0.1
      m.vs = Math.min(90, m.vs)
      m.lx = m.x
      m.ly = m.y
      m.a = Math.atan2(dy, dx)
      move(time)
      draw()
      if (inView.current) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const m = mouse.current
      m.x = e.clientX - rect.left
      m.y = e.clientY - rect.top
      if (!m.set) {
        m.sx = m.x
        m.sy = m.y
        m.lx = m.x
        m.ly = m.y
        m.set = true
      }
    }
    const onResize = () => build()

    build()

    if (reduced) {
      // one static frame — the structural CSS grid-backbone stays the fallback
      move(0)
      draw()
      return
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("resize", onResize)

    const io = new IntersectionObserver(
      ([e]) => {
        const was = inView.current
        inView.current = e.isIntersecting
        if (e.isIntersecting && !was) raf = requestAnimationFrame(tick)
      },
      { rootMargin: "120px" }
    )
    io.observe(wrap)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", onResize)
      io.disconnect()
    }
  }, [mounted, reduced])

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
        }}
      />
    </div>
  )
}
