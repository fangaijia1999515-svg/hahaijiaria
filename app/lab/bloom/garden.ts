/**
 * BLOOM STUDY 01 — GENERATIVE WATERCOLOR GARDEN (simulation + pigment model)
 *
 * A small garden climbs in from the LEFT edge: 3–6 stems root at / just off the
 * left border (bottom-left to mid-left) and grow up-and-right with a gentle
 * curvature wobble; leaves unfurl along them; big translucent flowers bloom at
 * the tips (plus a few smaller side buds).
 *
 * WATERCOLOR is not a look we fake at the end — it is HOW we paint. Every mark
 * (a stem, a leaf, a petal) is built from MANY small, very-low-alpha colour
 * blobs SCATTERED within its region (denser in the middle, feathered at the
 * rim — never marched outward, which would stack into hard rings). They land on
 * a PERSISTENT canvas (the caller never clears mid-cycle), so where blobs pile
 * up the pigment BUILDS — wet paint pooling on paper. The page then wears an SVG
 * feTurbulence + feDisplacementMap filter (see bloom-field.tsx) that pushes
 * those soft edges around by a few px, which is what finally sells "watercolour".
 *
 * The whole thing is a fixed-timestep simulation so ONE code path serves both
 * the live growth (RAF feeds real dt) and the instant/reduced-motion state
 * (call step(1/60) in a tight loop until `done`). Each mark also carries a fixed
 * STAMP BUDGET spread across its life, so density is decoupled from frame rate:
 * the reduced-motion render looks exactly like the animated one at rest.
 *
 * Palette is HERS (quiet luxury), never the reference's neon:
 *   stems / leaves — sage → forest greens
 *   blooms         — terracotta / dusty-rose / champagne-gold, dark terracotta cores
 */

/* -------------------------------------------------------------- rng ------- */
/** deterministic rng — a given seed grows a given garden (regrow = new seed). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TAU = Math.PI * 2
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const D2R = Math.PI / 180

/** triangular random in [-1,1], biased toward 0 — scatters pigment denser in
 *  the middle of a petal / leaf and feathered at the rim (no hard ellipse). */
function tri(rng: () => number): number {
  return rng() + rng() - 1
}

/* ---------------------------------------------------------- palette ------- */
/* colours as "r,g,b" so they drop straight into rgba() sprite gradients. */
const GREEN = {
  forest: "85,104,79", //  #55684F  deep forest
  mid: "112,131,94", //    mid sage-forest
  sage: "156,175,136", //  #9CAF88  sage
  vein: "61,74,58", //     #3D4A3A  darkest — veins / stem cores
}
/** bloom petals — dusty rose, terracotta, soft gold, champagne. */
const BLOOM = ["201,162,143", "196,138,115", "217,185,143", "228,205,166"]
/** flower cores — deeper terracottas, kept for the darkest centre dots. */
const CORE = ["158,95,72", "138,84,62"]

/* per-mark centre alphas (the sprite already fades to 0 at its rim, and each
 * mark is one of MANY scattered within a region, so colour only ARRIVES softly
 * and stays in her 0.03–0.06 wash band). */
const A_STEM = 0.056
const A_LEAF = 0.058
const A_PETAL = 0.05
const A_WASH = 0.02
const A_CORE = 0.09

/* -------------------------------------------------- soft colour sprite ---- */
const SPRITE_S = 64
function makeSprite(rgb: string): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = SPRITE_S
  c.height = SPRITE_S
  const g = c.getContext("2d")!
  const h = SPRITE_S / 2
  const grd = g.createRadialGradient(h, h, 0, h, h, h)
  grd.addColorStop(0, `rgba(${rgb},0.9)`)
  grd.addColorStop(0.45, `rgba(${rgb},0.4)`)
  grd.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grd
  g.beginPath()
  g.arc(h, h, h, 0, TAU)
  g.fill()
  return c
}

/* ============================================================= Garden ==== *
 *  Owns the pigment sprites, the shared rng, and the three entity kinds. All
 *  painting flows through `stamp` so accumulation stays uniform.
 * ========================================================================= */
export class Garden {
  private ctx: CanvasRenderingContext2D
  readonly W: number
  readonly H: number
  readonly rng: () => number
  /** size unit — scales the garden with the viewport (keeps mobile in-bounds,
   *  lets desktop go big; she asked for 画大一点). */
  readonly u: number

  private sprites = new Map<string, HTMLCanvasElement>()
  private stems: Stem[] = []
  private leaves: Leaf[] = []
  private flowers: Flower[] = []

  private t = 0
  private acc = 0
  private _done = false

  constructor(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.rng = mulberry32(seed)
    this.u = Math.min(1.3, Math.max(0.5, Math.min(w, h) / 900))
    this.buildStems()
  }

  get done(): boolean {
    return this._done
  }

  /* ---- one soft pigment mark (a disc/ellipse of colour), accumulating --- */
  stamp(
    color: string,
    x: number,
    y: number,
    rx: number,
    ry: number,
    rot: number,
    alpha: number,
  ): void {
    let sp = this.sprites.get(color)
    if (!sp) {
      sp = makeSprite(color)
      this.sprites.set(color, sp)
    }
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(x, y)
    if (rot) ctx.rotate(rot)
    ctx.scale((2 * rx) / SPRITE_S, (2 * ry) / SPRITE_S)
    ctx.drawImage(sp, -SPRITE_S / 2, -SPRITE_S / 2)
    ctx.restore()
  }

  /* ---- spawn hooks used by stems ---------------------------------------- */
  spawnLeaf(l: Leaf): void {
    this.leaves.push(l)
  }
  spawnFlower(f: Flower): void {
    this.flowers.push(f)
  }

  /* ---- advance the simulation (fixed internal substep) ------------------
     The sim tracks WALL-CLOCK: dt is capped at 0.25s (so a hitch or a tab
     refocus can't fling the growth forward), and the guard is high enough to
     consume that whole 0.25s in one call. That means a low frame rate (e.g. the
     displacement filter under software rendering) DROPS FRAMES rather than
     playing the growth in slow-motion — it still finishes in ~7s. */
  step(dt: number): boolean {
    if (this._done) return true
    const H = 1 / 60
    let acc = this.acc + Math.min(dt, 0.25)
    let guard = 16
    while (acc >= H && guard-- > 0) {
      this.substep(H)
      acc -= H
    }
    this.acc = acc
    this._done =
      this.t > 0.4 &&
      this.stems.every((s) => s.done) &&
      this.leaves.every((l) => l.done) &&
      this.flowers.every((f) => f.done)
    return this._done
  }

  private substep(dt: number): void {
    this.t += dt
    for (let i = 0; i < this.stems.length; i++) this.stems[i].update(dt)
    for (let i = 0; i < this.leaves.length; i++) this.leaves[i].update(dt)
    for (let i = 0; i < this.flowers.length; i++) this.flowers[i].update(dt)
  }

  /* ---- compose the cast of stems (archetypes + jitter) ------------------ */
  private buildStems(): void {
    const r = this.rng
    const N = 4 + Math.floor(r() * 2.6) // 4–6 stems
    // archetype rotation guarantees both HEIGHT (tall) and REACH (across),
    // so the cluster fills the left 40–55% without crossing into the text.
    const kinds: Archetype[] = ["reach", "tall", "mid", "tall", "reach", "mid"]
    for (let i = 0; i < N; i++) {
      this.stems.push(new Stem(this, kinds[i % kinds.length], i, N))
    }
  }
}

/* ============================================================== Stem ===== *
 *  Grows from a left-edge root: each tick relaxes its heading toward an
 *  up-and-right target and adds a little random walk (gentle curvature), then
 *  steps the tip forward and paints a CONTINUOUS soft stem (interpolated so the
 *  displacement filter can't shred it into dashes). Drops leaves on alternating
 *  sides, a bud or two mid-way, and a big flower at the tip when it tops out.
 * ========================================================================= */
type Archetype = "reach" | "tall" | "mid"

class Stem {
  private g: Garden
  private x: number
  private y: number
  private px: number
  private py: number
  private angle: number
  private target: number
  private stepPx: number
  private steps: number
  private grown = 0
  private age = 0
  private startDelay: number
  private side: 1 | -1
  private leafGap: number
  private budAt: number[]
  private wobble: number
  private relax = 0.05
  private thick: number
  // per-stem vigor (0 short/low .. 1 tall/high) and the head height its bloom
  // tops out at — together they land every bloom in the 30-75% band with clear
  // short/tall length variety
  private vigor = 0
  private headY = 0
  // gentle NATURAL curvature (her v3 note "太笔直不自然"): a slow global arc/
  // S-curve the heading target rides along its length + a progressive lean, so
  // the stem bows like a real garden stem reaching for light instead of ruling
  // a straight line.
  private arcAmp: number
  private arcFreq: number
  private arcPhase: number
  private curl: number
  done = false

  constructor(g: Garden, kind: Archetype, i: number, n: number) {
    this.g = g
    const r = g.rng
    // root just off the LEFT edge; the stem climbs to a per-stem HEAD height so
    // its bloom always opens in the lower-mid band (her note: 花开太高/顶到边).
    this.x = -4 + r() * 60

    // VIGOR drives both height and length. Archetype biases it (tall = long high
    // climbers, reach = shorter wide stems, mid = between) so every garden shows
    // clear SHORT and TALL members (her note: 茎要有长有短).
    const vigorBase = kind === "tall" ? 0.72 : kind === "reach" ? 0.3 : 0.5
    const v = clamp01(vigorBase + (r() - 0.5) * 0.5)
    this.vigor = v
    // bloom-head target: high vigor climbs higher (smaller y), always well
    // inside [0.30, 0.72]·H so heads never touch the top edge
    this.headY = g.H * (0.7 - v * 0.4 + (r() - 0.5) * 0.05)
    // root sits BELOW the head; a WIDE rise spread makes short stems clearly
    // ~1/3-1/2 of tall ones (her note: 有长有短) — THIS is the length variety
    this.y = Math.min(g.H * 0.97, this.headY + g.H * (0.18 + v * 0.5))
    this.px = this.x
    this.py = this.y

    // heading target: up-and-right. reach → shallow (fills width),
    // tall → steep (adds height), mid → between.
    const deg =
      kind === "reach"
        ? -46 + (r() - 0.5) * 16
        : kind === "tall"
          ? -80 + (r() - 0.5) * 16
          : -64 + (r() - 0.5) * 18
    this.target = deg * D2R
    this.angle = this.target + (r() - 0.5) * 0.5

    // a touch slower + longer than v1 so the whole grow lands around 7–8s; steps
    // are only a safety cap — the head height usually tops the stem out first
    this.stepPx =
      (kind === "reach" ? 5.4 : kind === "tall" ? 4.4 : 4.9) * g.u * (0.92 + r() * 0.16)
    const baseSteps = kind === "reach" ? 155 : kind === "tall" ? 180 : 140
    this.steps = Math.round(baseSteps * (0.9 + r() * 0.24))

    this.startDelay = (i / n) * 1.5 + r() * 0.5
    this.side = r() < 0.5 ? 1 : -1
    this.leafGap = 11 + Math.floor(r() * 5)
    // heading tracks its curving target eagerly (relax 0.05 -> 0.08-0.12) so the
    // bow actually SHOWS instead of being smoothed flat (her 太笔直 note) — relax
    // is the bigger lever: it decides how much of the arc target the stem follows
    this.relax = 0.08 + r() * 0.04
    this.wobble = 0.06 + r() * 0.05
    // per-stem arc pushed FAR past v3 (was 9-23deg): a 23-47deg directed bow,
    // random sign, floored so NO stem stays straight; frequency 0.5-2.0 of a
    // half-wave (<1 -> a single C-bow, >1 -> an S-curve); plus a strong
    // progressive lean. Every stem now reads hand-drawn curved.
    this.arcAmp = (0.4 + r() * 0.42) * (r() < 0.5 ? 1 : -1)
    this.arcFreq = 0.5 + r() * 1.5
    this.arcPhase = r() * TAU
    this.curl = (r() - 0.5) * 0.62
    // short stems thinner so a small stem is not a thick stub; length taper stays
    this.thick = (kind === "tall" ? 7.2 : 6.4) * g.u * (0.62 + v * 0.5)

    // 1–2 side buds in the middle third
    this.budAt = []
    const budCount = r() < 0.55 ? (r() < 0.35 ? 2 : 1) : 0
    for (let b = 0; b < budCount; b++) {
      this.budAt.push(Math.round(this.steps * (0.4 + r() * 0.32)))
    }
  }

  update(dt: number): void {
    if (this.done) return
    this.age += dt
    if (this.age < this.startDelay) return
    const g = this.g
    const r = g.rng

    // heading rides a gently curving target (base + arc + progressive lean),
    // relaxed toward smoothly so the bend has no kinks, plus a little wobble.
    const prog = this.grown / this.steps
    const tgt =
      this.target +
      this.arcAmp * Math.sin(prog * this.arcFreq * Math.PI + this.arcPhase) +
      this.curl * prog
    this.angle += (tgt - this.angle) * this.relax + (r() - 0.5) * this.wobble
    this.px = this.x
    this.py = this.y
    this.x += Math.cos(this.angle) * this.stepPx
    this.y += Math.sin(this.angle) * this.stepPx
    this.grown++

    this.paintSeg()

    // leaves on alternating sides (skip the first few + the last stretch)
    if (this.grown >= 9 && this.grown < this.steps - 7 && this.grown % this.leafGap === 0) {
      this.dropLeaf()
      if (r() < 0.4) this.dropLeaf(0.62) // paired/overlapping — less tidy, fuller
      this.side = this.side === 1 ? -1 : 1
    }

    // side buds
    if (this.budAt.includes(this.grown)) {
      const px = -Math.sin(this.angle) * this.side
      const py = Math.cos(this.angle) * this.side
      const R = (32 + r() * 20) * g.u
      g.spawnFlower(
        new Flower(g, this.x + px * 10 * g.u, this.y + py * 10 * g.u, R, 0.3 + r() * 0.4, true),
      )
    }

    // top out when the tip reaches this stem's head height (bloom lands in the
    // lower-mid band), or runs out of steps / exits right. The 0.12·H safety
    // guarantees no bloom ever clips the top edge.
    const reachedHead = this.y <= this.headY
    const offTopSafety = this.y < g.H * 0.12
    const offRight = this.x > g.W * 0.6
    if (this.grown >= this.steps || reachedHead || offTopSafety || offRight) {
      // still big (她要画大一点), but scaled by vigor so a short stem is not
      // dwarfed by a giant head: short ~0.72×, tall ~1.12×
      const R = (66 + r() * 78) * g.u * (0.72 + this.vigor * 0.4)
      g.spawnFlower(new Flower(g, this.x, this.y, R, 0.2 + r() * 0.3, false))
      this.done = true
    }
  }

  /** continuous soft stem between the previous tip and the new one. */
  private paintSeg(): void {
    const g = this.g
    const r = g.rng
    const frac = this.grown / this.steps
    const w = Math.max(1.8 * g.u, this.thick * (1 - frac * 0.62))
    const dx = this.x - this.px
    const dy = this.y - this.py
    const dist = Math.hypot(dx, dy) || 1
    const n = Math.max(1, Math.ceil(dist / (w * 0.5)))
    const pxn = -dy / dist
    const pyn = dx / dist
    for (let s = 0; s < n; s++) {
      const t = (s + 1) / n
      const cx = this.px + dx * t
      const cy = this.py + dy * t
      const j = (r() - 0.5) * w * 0.35
      const col = r() < 0.5 ? GREEN.forest : GREEN.mid
      g.stamp(col, cx + pxn * j, cy + pyn * j, w, w * 0.92, 0, A_STEM)
    }
    if (r() < 0.4) g.stamp(GREEN.vein, this.x, this.y, w * 0.55, w * 0.55, 0, A_STEM * 0.7)
  }

  private dropLeaf(scale = 1): void {
    const g = this.g
    const r = g.rng
    const nx = -Math.sin(this.angle) * this.side
    const ny = Math.cos(this.angle) * this.side
    const fx = Math.cos(this.angle)
    const fy = Math.sin(this.angle)
    const lean = 0.35 + r() * 0.3
    let dx = nx + fx * lean
    let dy = ny + fy * lean
    const dl = Math.hypot(dx, dy) || 1
    dx /= dl
    dy /= dl
    const frac = this.grown / this.steps
    const len = (34 + r() * 26) * g.u * scale * (1 - frac * 0.4)
    g.spawnLeaf(new Leaf(g, this.x, this.y, dx, dy, len))
  }
}

/* ============================================================== Leaf ===== *
 *  A soft green leaf that unfurls outward from its stem attach point, FILLED by
 *  small blobs scattered within a growing elongated region (centre-biased, with
 *  a darker midrib) — a watercolour leaf, not a stamped lozenge.
 * ========================================================================= */
class Leaf {
  private g: Garden
  private bx: number
  private by: number
  private dx: number
  private dy: number
  private len: number
  private wid: number
  private age = 0
  private unfurl: number
  private col: string
  private stamps: number
  private ct = 0
  done = false

  constructor(g: Garden, bx: number, by: number, dx: number, dy: number, len: number) {
    this.g = g
    this.bx = bx
    this.by = by
    this.dx = dx
    this.dy = dy
    this.len = len
    this.wid = len * (0.34 + g.rng() * 0.1)
    this.unfurl = 0.5 + g.rng() * 0.35
    this.col = g.rng() < 0.5 ? GREEN.mid : GREEN.sage
    this.stamps = 15 + Math.floor(g.rng() * 9)
  }

  update(dt: number): void {
    if (this.done) return
    this.age += dt
    const prog = clamp01(this.age / this.unfurl)
    const want = Math.floor(prog * this.stamps)
    const g = this.g
    const r = g.rng
    const curLen = this.len * easeOut(prog)
    const nx = -this.dy // perpendicular unit
    const ny = this.dx
    while (this.ct < want) {
      const along = (0.12 + 0.88 * r()) * curLen // base → tip
      const taper = 1 - Math.abs(along / this.len - 0.44) * 1.1 // widest mid-leaf
      const perp = tri(r) * this.wid * 0.5 * Math.max(0.15, taper)
      const px = this.bx + this.dx * along + nx * perp
      const py = this.by + this.dy * along + ny * perp
      const near = Math.abs(perp) < this.wid * 0.14
      const col = near && r() < 0.5 ? GREEN.vein : this.col // natural midrib
      const br = this.wid * (0.3 + r() * 0.25)
      g.stamp(col, px, py, br, br, 0, A_LEAF)
      this.ct++
    }
    if (prog >= 1) this.done = true
  }
}

/* ============================================================ Flower ===== *
 *  Petals sit at FIXED positions in one or two rings; each is FILLED by small
 *  blobs scattered within its region, spread over a fixed stamp budget so it
 *  fades in as translucent pigment (no marching rings). A deep terracotta core,
 *  scattered + centre-biased, anchors the middle. Buds are small, later flowers.
 * ========================================================================= */
interface Petal {
  ox: number // region-centre offset from the flower centre
  oy: number
  hlen: number // half-length along the petal axis
  hwid: number // half-width across it
  ang: number
  color: string
  delay: number
  blob: number
  stamps: number
  ct: number
}

class Flower {
  private g: Garden
  private x: number
  private y: number
  private R: number
  private emerge: number
  private bloomDur: number
  private age = 0
  private seated = false
  private petals: Petal[] = []
  private core: string
  private washCol: string
  private coreStamps: number
  private coreCt = 0
  done = false

  constructor(g: Garden, x: number, y: number, R: number, emerge: number, bud: boolean) {
    this.g = g
    this.x = x
    this.y = y
    this.R = R
    this.emerge = emerge
    this.bloomDur = bud ? 2.0 : 3.0
    this.core = CORE[Math.floor(g.rng() * CORE.length)]

    const r = g.rng
    // per-flower hue lean so the garden reads varied, not uniform
    const lean = Math.floor(r() * BLOOM.length)
    this.washCol = BLOOM[lean]
    const pick = () => BLOOM[(lean + (r() < 0.6 ? 0 : 1 + Math.floor(r() * 3))) % BLOOM.length]

    const rings = bud ? 1 : 2
    const outerN = bud ? 6 + Math.floor(r() * 2) : 8 + Math.floor(r() * 3)
    const rot0 = r() * TAU
    for (let ri = 0; ri < rings; ri++) {
      // ri 0 = outer petals (soft rounded lobes overlapping near the centre,
      // fanning at the tips); ri 1 = a terracotta THROAT that deepens the middle.
      const rBase = this.R * (ri === 0 ? 0.5 : 0.28)
      const ringLen = this.R * (ri === 0 ? 0.94 : 0.58)
      const n = ri === 0 ? outerN : Math.max(4, Math.round(outerN * 0.7))
      for (let k = 0; k < n; k++) {
        const ang = rot0 + (k / n) * TAU + (r() - 0.5) * 0.4 + (ri === 1 ? Math.PI / n : 0)
        const len = ringLen * (0.88 + r() * 0.22)
        this.petals.push({
          ox: Math.cos(ang) * rBase,
          oy: Math.sin(ang) * rBase,
          hlen: len * 0.5,
          hwid: this.R * (ri === 0 ? 0.18 : 0.16) * (0.85 + r() * 0.3),
          ang,
          // outer petals lean light (rose/gold/champagne); throat is terracotta
          color: ri === 0 ? pick() : BLOOM[1],
          delay:
            ri === 0
              ? r() * this.bloomDur * 0.3
              : this.bloomDur * 0.18 + r() * this.bloomDur * 0.25,
          blob: this.R * (ri === 0 ? 0.145 : 0.13),
          stamps: ri === 0 ? 36 + Math.floor(r() * 14) : 22 + Math.floor(r() * 8),
          ct: 0,
        })
      }
    }
    this.coreStamps = bud ? 26 : 60
  }

  update(dt: number): void {
    if (this.done) return
    this.age += dt
    if (this.age < this.emerge) return
    const g = this.g
    const r = g.rng
    const bt = this.age - this.emerge

    // faint seating wash so the bloom sits on the paper before petals arrive
    if (!this.seated) {
      g.stamp(this.washCol, this.x, this.y, this.R, this.R * 0.9, 0, A_WASH)
      this.seated = true
    }

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i]
      const active = bt - p.delay
      if (active <= 0) continue
      const win = Math.max(0.4, this.bloomDur - p.delay)
      const want = Math.floor(clamp01(active / win) * p.stamps)
      const dxA = Math.cos(p.ang)
      const dyA = Math.sin(p.ang)
      while (p.ct < want) {
        const along = tri(r) * p.hlen
        const perp = tri(r) * p.hwid
        const px = this.x + p.ox + dxA * along - dyA * perp
        const py = this.y + p.oy + dyA * along + dxA * perp
        const br = p.blob * (0.75 + r() * 0.6)
        g.stamp(p.color, px, py, br, br, 0, A_PETAL)
        p.ct++
      }
    }

    // deep core, scattered + centre-biased, built over a budget
    const cwant = Math.floor(clamp01(bt / (this.bloomDur * 0.8)) * this.coreStamps)
    while (this.coreCt < cwant) {
      const rr = Math.abs(tri(r)) * this.R * 0.22
      const a = r() * TAU
      const br = this.R * 0.09 * (0.7 + r() * 0.6)
      g.stamp(this.core, this.x + Math.cos(a) * rr, this.y + Math.sin(a) * rr, br, br, 0, A_CORE)
      this.coreCt++
    }

    if (bt > this.bloomDur) this.done = true
  }
}
