"use client"
/**
 * LEAF STUDY 01 — particle branch background (runtime / motion layer)  v3
 *
 * Home positions come from the BRANCHED sampler (silhouette.ts): every grain is
 * locked to a branch skeleton AND tagged with which of the 3 branches it belongs
 * to. Here we breathe life into them:
 *   • perpetual breeze — a slow Perlin flow-field drifts every particle a few px
 *     around its (swaying) home.
 *   • WIND SWAY (her v4 note "像木板" → 要像柔软的树枝) — the grains stay welded
 *     to the skeleton; the SKELETON BENDS. Each of the 3 branches is its own
 *     underdamped pendulum hinged at its base (same stiffness/damping/impulse/
 *     gust as before), but the hinge angle no longer rotates the branch as one
 *     rigid plank. Instead the angle maps onto grains two ways: (a) SPATIAL — a
 *     grain's share of the angle scales with its distance from the hinge raised
 *     to BEND_POW, so the base barely turns and the tip sweeps the full angle
 *     (a real bough); (b) TEMPORAL — the angle travels OUTWARD, so the tip
 *     receives it ~BEND_LAG_S later than the base and whips a beat behind. Bring
 *     the cursor near a branch and it feels an impulse AWAY from the cursor,
 *     runs down the bough, and the tip trails softly back; tip amplitude capped
 *     ~4.3deg. Leaves add a faint high-frequency flutter scaled by branch speed.
 *
 * Grain (her v3 note "太散像马赛克") — many MORE, much SMALLER, tighter grains
 * (28-34k, ~0.5-1.1px) on a finer mask, plus a 0.5px canvas blur, so the mass
 * fuses into a drawn shadow (cf. her palm-shadow reference) instead of a dot
 * mosaic. No per-particle mouse displacement remains — the cursor never cuts
 * through the body.
 *
 * Degradations: prefers-reduced-motion → one static frame, no RAF/listeners;
 * touch/small screens → static + a tap that sways the nearest branch; tab hidden
 * → RAF paused; unmount → full teardown. Renders in CSS px (setTransform by DPR,
 * capped 1.5); soft round sprites (not squares) keep it a shadow-drawing.
 */
import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"
import { sampleBranches } from "./silhouette"

/* ------------------------------------------------------------- tuning ----- */
/* particle budget scales gently with area. v3 pushes the band UP (28-34k) and
 * the grains DOWN (0.5-1.1px) so the branch reads as a coherent drawn shadow. */
const COUNT_BASE = 33000
const COUNT_MIN = 19000
const COUNT_MAX = 34000
const REF_AREA = 2000 * 1250

const DPR_CAP = 1.5

/* breeze (perpetual life) */
const BREEZE_AMP = 5 // px — max drift of a particle around its (swaying) home
const FLOW_SF = 0.0016 // spatial frequency of the flow field (swirl size)
const FLOW_ANG = Math.PI * 1.25 // how far the field angle can rotate
const FLOW_TF = 0.06 // temporal drift of the angle field
const FLOW_TF2 = 0.043 // temporal drift of the amplitude envelope
const GRID_X = 30 // flow-field cache resolution
const GRID_Y = 19

/* ---- WIND SWAY — one underdamped pendulum per branch ---------------------
 * omega0 = sqrt(SWAY_STIFF) ~ 4 rad/s (period ~1.6s); zeta = SWAY_DAMP/(2*omega0)
 * ~ 0.26 (underdamped) so a gust swings once or twice then settles. The cap
 * holds the lean in her 2.5-4deg band. */
const SWAY_MAX = 0.075 // rad — TIP amplitude cap (~4.3deg); base bends far less
const SWAY_STIFF = 16 // angular stiffness (restoring)
const SWAY_DAMP = 2.1 // angular damping (underdamped)
const AMBIENT_AMP = 0.0072 // rad — idle breeze target (~0.41deg), per branch
const AMBIENT_W = [0.31, 0.37, 0.28] // per-branch idle frequency (never lock)
const AMBIENT_PHASE = [0, 2.1, 4.2] // per-branch phase offset

/* ---- BENDING MODE (her v4 note: 现在像木板 → 要像柔软的树枝) --------------------
 * The pendulum still owns ONE hinge angle per branch; these two shapers turn
 * that single angle into a soft bending bough instead of a rotating plank:
 *  • SPATIAL — each grain rotates by angle·(r/R)^BEND_POW, r = its distance from
 *    the hinge, R = the branch's farthest grain. So the base (r→0) barely turns
 *    and only the tip (r→R) reaches the full angle. Baked per grain at build.
 *  • TEMPORAL — the angle propagates OUTWARD as a traveling wave: a bucket
 *    brigade of BEND_BANDS one-pole filters (band 0 = the raw hinge angle, each
 *    outer band lags the one inboard) gives a base→tip group delay of BEND_LAG_S
 *    so a gust runs down the branch and the tip whips a beat behind. O(bands)
 *    per branch per frame; each grain just samples the band for its distance. */
const BEND_POW = 1.7 // deflection ∝ (r/R)^BEND_POW — base steady, tip sweeps
const BEND_BANDS = 12 // distance bands the traveling lag is quantised into
const BEND_LAG_S = 0.17 // s — total base→tip phase lag (~170ms), tip trails

/* cursor -> angular impulse on a branch */
const BRUSH_R = 190 // px — how near the cursor must come to a branch skeleton
const PUSH = 900 // away-from-cursor force at the touched point
const WIND = 0.4 // adds the cursor's own velocity as a gust
const VEL_CLAMP = 1600 // px/s — cap on the velocity gust
const IMPULSE_GAIN = 0.9 // torque -> angular-velocity scale
const TAP_GAIN = 3.4 // discrete kick for a touch tap (bigger, one-shot)

/* leaf flutter (faint, high-frequency, scaled by current sway speed) */
const FLUTTER_PX = 1.35 // px — max shimmer at the tips
const FLUTTER_W = 15 // rad/s — high frequency
const SWAY_SPEED_REF = 0.34 // rad/s that maps to full flutter

const HOVER_MARGIN = 200 // px around the canvas where a pointer still counts
const DT_MAX = 1 / 30 // clamp frame delta so hitches never explode the sim

/* colour family — warm greys / taupe, rare champagne glint. NO green, no pure
 * black. Index chosen per particle from mask darkness (stem→ink, edges→taupe). */
const TINTS = [
  "#6E675C", // 0 taupe — leaf margins (charcoal-55)
  "#7D7568", // 1 warm grey
  "#575049", // 2 deep taupe-grey
  "#2D2D2D", // 3 ink — stem core / midribs (deep-charcoal)
  "#8B7355", // 4 amber-brown — rare warmth
  "#E4CDA6", // 5 champagne — rare glint
] as const
const CHAMPAGNE = 5
const AMBER = 4

function makeSprite(hex: string, champagne: boolean): HTMLCanvasElement {
  const S = 40
  const c = document.createElement("canvas")
  c.width = S
  c.height = S
  const g = c.getContext("2d")!
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  if (champagne) {
    // brighter, tighter core so it catches as a glint
    grd.addColorStop(0, "rgba(245,232,205,1)")
    grd.addColorStop(0.28, hexToRgba(hex, 0.8))
    grd.addColorStop(1, hexToRgba(hex, 0))
  } else {
    grd.addColorStop(0, hexToRgba(hex, 0.95))
    grd.addColorStop(0.4, hexToRgba(hex, 0.5))
    grd.addColorStop(1, hexToRgba(hex, 0))
  }
  g.fillStyle = grd
  g.fillRect(0, 0, S, S)
  return c
}
function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export function LeafField({ showLabel = true }: { showLabel?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const fullOK = window.matchMedia(
      "(min-width: 760px) and (hover: hover) and (pointer: fine)",
    ).matches
    const mode: "reduced" | "full" | "touch" = reduced ? "reduced" : fullOK ? "full" : "touch"

    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
    const noise3 = createNoise3D(() => 0.5) // fixed seed -> identical breeze

    // sprites (one per tint) — soft round dots, built once
    const sprites = TINTS.map((hex, i) => makeSprite(hex, i === CHAMPAGNE))

    /* ---- particle state (struct-of-arrays) — grains LOCKED to the skeleton;
     *      no per-particle velocity, because there is no scatter to relax from:
     *      the skeleton moves, the grains ride it exactly. -------------------- */
    let W = 0
    let H = 0
    let N = 0
    let hx: Float32Array = new Float32Array(0)
    let hy: Float32Array = new Float32Array(0)
    let x = new Float32Array(0)
    let y = new Float32Array(0)
    let size = new Float32Array(0)
    let alpha = new Float32Array(0)
    let tint = new Uint8Array(0)
    let tw = new Float32Array(0) // twinkle / flutter phase
    let branch: Uint8Array = new Uint8Array(0)
    let wDefl = new Float32Array(0) // per-grain spatial bend weight (r/R)^BEND_POW
    let bandOf = new Uint8Array(0) // per-grain distance band for the traveling lag

    // per-branch pendulum state (sized to the field's branch count)
    let nB = 0
    let pivotX: Float32Array = new Float32Array(0)
    let pivotY: Float32Array = new Float32Array(0)
    let sensorX: Float32Array[] = []
    let sensorY: Float32Array[] = []
    let swayAngle = new Float64Array(0)
    let swayVel = new Float64Array(0)
    let speedB = new Float64Array(0)
    let inertia = new Float64Array(0)
    let Rmax = new Float64Array(0) // per-branch farthest grain reach from the hinge
    let bandAngle = new Float64Array(0) // flat [nB*BEND_BANDS] delayed angle per band

    // flow-field cache
    const fxg = new Float32Array(GRID_X * GRID_Y)
    const fyg = new Float32Array(GRID_X * GRID_Y)
    let gdx = 1
    let gdy = 1

    const decoRng = mulberry32(0x5eed01)

    const build = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (w === 0 || h === 0) return
      W = w
      H = h
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const area = w * h
      const want = Math.max(
        COUNT_MIN,
        Math.min(COUNT_MAX, Math.round(COUNT_BASE * Math.sqrt(area / REF_AREA))),
      )

      const field = sampleBranches(w, h, want)
      N = field.count
      hx = field.hx
      hy = field.hy
      branch = field.branch
      nB = field.branchCount
      pivotX = field.pivotX
      pivotY = field.pivotY
      sensorX = field.sensorX
      sensorY = field.sensorY

      x = new Float32Array(N)
      y = new Float32Array(N)
      size = new Float32Array(N)
      alpha = new Float32Array(N)
      tint = new Uint8Array(N)
      tw = new Float32Array(N)
      wDefl = new Float32Array(N)
      bandOf = new Uint8Array(N)

      // pendulum state (fresh each build)
      swayAngle = new Float64Array(nB)
      swayVel = new Float64Array(nB)
      speedB = new Float64Array(nB)
      inertia = new Float64Array(nB)
      Rmax = new Float64Array(nB)
      bandAngle = new Float64Array(nB * BEND_BANDS)

      // per-branch centroid -> angular inertia proxy (arm^2) so a given force
      // gives a comparable angular response across differently-sized branches;
      // rTmp caches each grain's hinge distance for the BEND weight second pass
      const cx = new Float64Array(nB)
      const cy = new Float64Array(nB)
      const cn = new Int32Array(nB)
      const rTmp = new Float32Array(N)

      for (let i = 0; i < N; i++) {
        x[i] = hx[i]
        y[i] = hy[i]
        const b = branch[i]
        cx[b] += hx[i]
        cy[b] += hy[i]
        cn[b]++

        // distance from this grain to its branch hinge -> BEND radius; track the
        // branch's farthest grain (R) so (r/R) normalises per branch
        const drx = hx[i] - pivotX[b]
        const dry = hy[i] - pivotY[b]
        const rr = Math.sqrt(drx * drx + dry * dry)
        rTmp[i] = rr
        if (rr > Rmax[b]) Rmax[b] = rr

        const d = field.d[i]
        const dNorm = Math.min(1, Math.max(0, (d - 0.06) / 0.94))
        // FINE grain: small grains (~0.5-1.1px) packed dense, so many overlap
        // into continuous tone. Alpha lifted a touch to keep the mass readable
        // now that each grain is smaller. Darkest core = stem/midribs.
        size[i] = (0.5 + 0.55 * dNorm) * (0.85 + 0.32 * decoRng())
        alpha[i] = (0.16 + 0.34 * dNorm) * (0.85 + 0.32 * decoRng())
        const r = decoRng()
        if (r < 0.038) {
          // champagne glint — kept VERY rare on purpose
          tint[i] = CHAMPAGNE
          alpha[i] = Math.min(0.3, alpha[i] * 1.3 + 0.045)
          size[i] *= 1.3
        } else if (r < 0.11) {
          tint[i] = AMBER
        } else {
          // stem/midrib (dark) -> ink; leaf margins (faint) -> taupe
          const bb = dNorm + (decoRng() - 0.5) * 0.28
          tint[i] = bb < 0.34 ? 0 : bb < 0.56 ? 1 : bb < 0.8 ? 2 : 3
        }
        tw[i] = decoRng() * Math.PI * 2
      }

      for (let b = 0; b < nB; b++) {
        if (cn[b] > 0) {
          cx[b] /= cn[b]
          cy[b] /= cn[b]
        }
        const ax = cx[b] - pivotX[b]
        const ay = cy[b] - pivotY[b]
        inertia[b] = Math.max(ax * ax + ay * ay, 3600) // arm^2, floored at 60px
        if (Rmax[b] < 1) Rmax[b] = 1 // avoid div-by-zero on a degenerate branch
      }

      // bake per-grain BEND weight (r/R)^POW + its traveling-lag distance band
      for (let i = 0; i < N; i++) {
        const rn = Math.min(1, rTmp[i] / Rmax[branch[i]])
        wDefl[i] = Math.pow(rn, BEND_POW)
        let bi = (rn * BEND_BANDS) | 0
        if (bi >= BEND_BANDS) bi = BEND_BANDS - 1
        bandOf[i] = bi
      }

      gdx = W / (GRID_X - 1)
      gdy = H / (GRID_Y - 1)
    }

    const updateGrid = (t: number) => {
      for (let j = 0; j < GRID_Y; j++) {
        const ny = j * gdy * FLOW_SF
        for (let i = 0; i < GRID_X; i++) {
          const nx = i * gdx * FLOW_SF
          const a = noise3(nx, ny, t * FLOW_TF) * FLOW_ANG
          const env = 0.55 + 0.45 * noise3(nx + 50, ny + 50, t * FLOW_TF2 + 9)
          const k = j * GRID_X + i
          fxg[k] = Math.cos(a) * env
          fyg[k] = Math.sin(a) * env
        }
      }
    }
    // bilinear sample of the flow field at a canvas-px position -> out[0/1]
    const flow = (px: number, py: number, out: [number, number]) => {
      let gx = px / gdx
      let gy = py / gdy
      if (gx < 0) gx = 0
      else if (gx > GRID_X - 1) gx = GRID_X - 1
      if (gy < 0) gy = 0
      else if (gy > GRID_Y - 1) gy = GRID_Y - 1
      const i0 = gx | 0
      const j0 = gy | 0
      const i1 = i0 + 1 < GRID_X ? i0 + 1 : i0
      const j1 = j0 + 1 < GRID_Y ? j0 + 1 : j0
      const fx = gx - i0
      const fy = gy - j0
      const a = j0 * GRID_X
      const b = j1 * GRID_X
      const w00 = (1 - fx) * (1 - fy)
      const w10 = fx * (1 - fy)
      const w01 = (1 - fx) * fy
      const w11 = fx * fy
      out[0] = fxg[a + i0] * w00 + fxg[a + i1] * w10 + fxg[b + i0] * w01 + fxg[b + i1] * w11
      out[1] = fyg[a + i0] * w00 + fyg[a + i1] * w10 + fyg[b + i0] * w01 + fyg[b + i1] * w11
    }

    /* ---- input (full motion only) — position + velocity of the cursor ------ */
    let mx = 0
    let my = 0
    let mouseActive = false
    let smVX = 0 // smoothed cursor velocity (px/s)
    let smVY = 0
    let lastMoveT = 0
    let lastRawX = 0
    let lastRawY = 0
    const onMove = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0) return
      const nx = e.clientX - rect.left
      const ny = e.clientY - rect.top
      if (nx < -HOVER_MARGIN || nx > W + HOVER_MARGIN || ny < -HOVER_MARGIN || ny > H + HOVER_MARGIN) {
        mouseActive = false
        return
      }
      const now = performance.now()
      if (lastMoveT > 0) {
        const dtm = (now - lastMoveT) / 1000
        if (dtm > 0.0005) {
          let vx = (nx - lastRawX) / dtm
          let vy = (ny - lastRawY) / dtm
          const vm = Math.hypot(vx, vy)
          if (vm > VEL_CLAMP) {
            const k = VEL_CLAMP / vm
            vx *= k
            vy *= k
          }
          // smooth so a single jumpy sample can't spike the gust
          smVX += (vx - smVX) * 0.4
          smVY += (vy - smVY) * 0.4
        }
      }
      lastMoveT = now
      lastRawX = nx
      lastRawY = ny
      mx = nx
      my = ny
      mouseActive = true
    }
    const onLeave = () => {
      mouseActive = false
      lastMoveT = 0
    }

    /* ---- the cursor's angular impulse on each branch it is near ------------
     * Push the touched point AWAY from the cursor (+ the cursor's own gust);
     * torque about the branch hinge -> angular impulse into that pendulum. */
    const brushImpulse = (px: number, py: number, vX: number, vY: number, dt: number, gain: number) => {
      for (let b = 0; b < nB; b++) {
        const sx = sensorX[b]
        const sy = sensorY[b]
        let best = Infinity
        let bx = 0
        let by = 0
        for (let s = 0; s < sx.length; s++) {
          const ddx = sx[s] - px
          const ddy = sy[s] - py
          const d2 = ddx * ddx + ddy * ddy
          if (d2 < best) {
            best = d2
            bx = sx[s]
            by = sy[s]
          }
        }
        const d = Math.sqrt(best)
        if (d >= BRUSH_R) continue
        const fall = 1 - d / BRUSH_R
        const f2 = fall * fall
        const rx = bx - pivotX[b]
        const ry = by - pivotY[b]
        let awx = bx - px
        let awy = by - py
        const al = Math.hypot(awx, awy) || 1
        awx /= al
        awy /= al
        const Fx = PUSH * f2 * awx + WIND * f2 * vX
        const Fy = PUSH * f2 * awy + WIND * f2 * vY
        const torque = rx * Fy - ry * Fx
        swayVel[b] += (torque / inertia[b]) * gain * dt
      }
    }

    /* ---- paint ----------------------------------------------------------- */
    const paint = (time: number) => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < N; i++) {
        let a = alpha[i]
        if (tint[i] === CHAMPAGNE) a *= 0.6 + 0.4 * Math.sin(time * 1.3 + tw[i])
        if (a <= 0.004) continue
        const s = size[i]
        ctx.globalAlpha = a
        ctx.drawImage(sprites[tint[i]], x[i] - s, y[i] - s, s * 2, s * 2)
      }
      ctx.globalAlpha = 1
    }

    /* ---- integrator — advance pendulums, then ride the grains on them ----- */
    const out: [number, number] = [0, 0]
    const step = (dt: number, t: number) => {
      // 1) three pendulums
      if (mouseActive) brushImpulse(mx, my, smVX, smVY, dt, IMPULSE_GAIN)
      // stale-velocity decay so a paused cursor stops gusting
      const decay = Math.exp(-dt / 0.1)
      smVX *= decay
      smVY *= decay
      // per-stage smoothing so the base->tip group delay stays ~BEND_LAG_S at
      // any frame rate (exp discretisation preserves the per-stage time constant)
      const alphaStage = 1 - Math.exp(-dt / (BEND_LAG_S / (BEND_BANDS - 1)))
      for (let b = 0; b < nB; b++) {
        const ambient = AMBIENT_AMP * Math.sin(t * AMBIENT_W[b] + AMBIENT_PHASE[b])
        const acc = SWAY_STIFF * (ambient - swayAngle[b]) - SWAY_DAMP * swayVel[b]
        swayVel[b] += acc * dt
        swayAngle[b] += swayVel[b] * dt
        if (swayAngle[b] > SWAY_MAX) {
          swayAngle[b] = SWAY_MAX
          if (swayVel[b] > 0) swayVel[b] = -swayVel[b] * 0.25
        } else if (swayAngle[b] < -SWAY_MAX) {
          swayAngle[b] = -SWAY_MAX
          if (swayVel[b] < 0) swayVel[b] = -swayVel[b] * 0.25
        }
        speedB[b] = Math.min(1, Math.abs(swayVel[b]) / SWAY_SPEED_REF)
        // traveling wave down the branch: band 0 = the raw hinge angle, each
        // outer band chases the one inboard of it, so the tip gets it later
        const base = b * BEND_BANDS
        bandAngle[base] = swayAngle[b]
        for (let k = 1; k < BEND_BANDS; k++) {
          bandAngle[base + k] += (bandAngle[base + k - 1] - bandAngle[base + k]) * alphaStage
        }
      }

      // 2) grains BEND on their branch (+ flutter + breeze). Each grain's angle
      //    is the delayed angle for its distance band × its (r/R)^POW weight, so
      //    the base holds and the tip sweeps, trailing a beat behind — a soft
      //    bough, not a rotating plank. Angles are tiny → 2-term sin/cos.
      for (let i = 0; i < N; i++) {
        const b = branch[i]
        const pbx = pivotX[b]
        const pby = pivotY[b]
        const dxp = hx[i] - pbx
        const dyp = hy[i] - pby
        const a = bandAngle[b * BEND_BANDS + bandOf[i]] * wDefl[i]
        const a2 = a * a
        const sn = a * (1 - a2 * 0.16666667)
        const cs = 1 - a2 * 0.5
        let shx = pbx + dxp * cs - dyp * sn
        let shy = pby + dxp * sn + dyp * cs
        const sp = speedB[b]
        if (sp > 0.004) {
          const rrx = shx - pbx
          const rry = shy - pby
          const rl = Math.hypot(rrx, rry) || 1
          const wave = Math.sin(t * FLUTTER_W + tw[i])
          const amp = FLUTTER_PX * sp * (rl > 280 ? 1 : rl / 280)
          shx += (-rry / rl) * wave * amp
          shy += (rrx / rl) * wave * amp
        }
        flow(shx, shy, out)
        x[i] = shx + out[0] * BREEZE_AMP
        y[i] = shy + out[1] * BREEZE_AMP
      }
    }

    /* ---- run loop -------------------------------------------------------- */
    let raf = 0
    let running = false
    let last = 0
    const t0 = performance.now()
    const frame = (now: number) => {
      if (!running) return
      let dt = (now - last) / 1000
      last = now
      if (dt > DT_MAX) dt = DT_MAX
      if (dt < 0) dt = 0
      const t = (now - t0) / 1000
      updateGrid(t)
      step(dt, t)
      paint(t)
      raf = requestAnimationFrame(frame)
    }
    const startLoop = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    /* ---- touch: a tap sways the NEAREST branch (bounded settle loop) ------- */
    let touchRaf = 0
    let touchRunning = false
    let touchEnd = 0
    const onTap = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      // one-shot kick, away from the tap, into whichever branches are near
      brushImpulse(px, py, 0, 0, 0.12, TAP_GAIN)
      touchEnd = performance.now() + 2800
      if (!touchRunning) {
        touchRunning = true
        let tlast = performance.now()
        const tf = (now: number) => {
          if (!touchRunning) return
          let dt = (now - tlast) / 1000
          tlast = now
          if (dt > DT_MAX) dt = DT_MAX
          if (dt < 0) dt = 0
          const t = (now - t0) / 1000
          updateGrid(t)
          step(dt, t) // mouseActive stays false on touch -> no re-brush
          paint(t)
          if (now < touchEnd) {
            touchRaf = requestAnimationFrame(tf)
          } else {
            touchRunning = false
          }
        }
        touchRaf = requestAnimationFrame(tf)
      }
    }

    /* ---- visibility ------------------------------------------------------ */
    const onVisibility = () => {
      if (document.hidden) {
        stopLoop()
      } else if (mode === "full" && !running) {
        startLoop()
      }
    }

    /* ---- resize (rebuild the field, keep the same mode) ------------------ */
    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const wasRunning = running
        stopLoop()
        build()
        if (mode === "reduced" || mode === "touch") paint(0)
        else if (wasRunning || !document.hidden) startLoop()
      }, 140)
    })

    /* ---- boot ------------------------------------------------------------ */
    build()
    ro.observe(host)

    if (mode === "reduced") {
      paint(0) // one static frame, no listeners, no RAF
    } else if (mode === "touch") {
      paint(0)
      canvas.addEventListener("pointerdown", onTap, { passive: true })
    } else {
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("mousemove", onMove, { passive: true })
      window.addEventListener("pointerout", onLeave, { passive: true })
      window.addEventListener("blur", onLeave)
      document.addEventListener("visibilitychange", onVisibility)
      if (!document.hidden) startLoop()
    }

    /* ---- teardown -------------------------------------------------------- */
    return () => {
      stopLoop()
      touchRunning = false
      cancelAnimationFrame(touchRaf)
      window.clearTimeout(resizeTimer)
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("pointerout", onLeave)
      window.removeEventListener("blur", onLeave)
      canvas.removeEventListener("pointerdown", onTap)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div className="leaf-root">
      <canvas ref={canvasRef} className="leaf-canvas" aria-hidden="true" />
      {showLabel && <p className="leaf-label">LEAF STUDY 01 · brush the branch</p>}
    </div>
  )
}

/* local rng for particle decoration (colour/size), stable across loads */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
