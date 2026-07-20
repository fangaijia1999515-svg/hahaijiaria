/**
 * LEAF STUDY 01 — SILHOUETTE SOURCE + PARTICLE SAMPLER  (v2: fuller, from LEFT)
 *
 * The particle positions do NOT come from the SVG paths directly. Everything is
 * rasterised into a low-res grayscale "shadow mask" (dark = dense particles,
 * white = empty), and ONE density-weighted sampler reads that mask. This is the
 * single swap boundary the brief asked for:
 *
 *   ┌────────────────────────────────────────────────────────────────────┐
 *   │  SilhouetteSource.draw(ctx)  →  draws a grayscale density mask       │
 *   │  sampleFromSource(source, …) →  turns any mask into weighted points  │
 *   └────────────────────────────────────────────────────────────────────┘
 *
 * TODAY the source is `svgBranchSource` — a small CLUSTER of authored branches
 * (a long main arm + a shoot climbing up + a lower drooping branch) that enters
 * from the LEFT edge and fans toward centre-right, so it reads as a generous
 * plant corner, not a single twig. LATER, when Aijia supplies the shadow photo
 * she likes (see her palm-shadow reference — note its real overlapping MASS),
 * swap in `imageMaskSource(img)` (stub at the bottom) — it implements the SAME
 * draw() contract and every downstream line of motion / colour / degradation is
 * untouched. That is the whole point of the boundary.
 *
 * Mask convention: luminance 255 = cream/empty, luminance 0 = densest ink.
 * "darkness" d = (255 − luminance) / 255 drives BOTH how many particles land on
 * a pixel (CDF weight) AND each particle's alpha/size (honest-shadow feel).
 */

/* ---------------------------------------------------------------- rng ------ */
/** deterministic rng so the branch is identical every load / resize. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------------------------------------------------- source contract ------ */
export interface SilhouetteSource {
  /** design-box width in its own units (used only to anchor + fit the box). */
  readonly designW: number
  /** design-box height in its own units. */
  readonly designH: number
  /**
   * Paint a GRAYSCALE density mask. The ctx is already translated + UNIFORMLY
   * scaled so drawing in design units lands in the anchored, aspect-correct box
   * on the mask canvas (circles stay circles, stroke widths stay proportional).
   * Convention: leave the background white; paint the shape in greys where
   * darker = denser. An image source implements this as one drawImage (+ a
   * contrast/desaturate pass) — same contract, different ink.
   */
  draw(ctx: CanvasRenderingContext2D): void
}

/* ======================================================================== *
 *  svgBranchSource — the authored quiet-luxury branch CLUSTER
 *  Design box 1000 × 640. A small family of olive branches rooted at the LEFT
 *  edge (upper-left → lower-left) fanning toward centre-right: one long main
 *  arm sweeping across, one shoot climbing up, one lower branch drooping down.
 *  Together they fill the left ~40–55% with a generous, slightly untidy mass;
 *  the right stays open for the statement text. Leaves ALTERNATE loosely (with
 *  a couple of deliberate overlaps + size variance) so it reads natural, not a
 *  symmetric fir.
 * ======================================================================== */
const DESIGN_W = 1000
const DESIGN_H = 640

/** where the whole cluster attaches (main arm's entry at the left edge) — the
 *  sway pivot maps from this so the mass hinges at the left, not the old corner. */
const CLUSTER_ENTRY: readonly [number, number] = [-46, 214]

type Seg8 = readonly [number, number, number, number, number, number, number, number]

interface BranchDef {
  /** centreline cubic Béziers (design units). */
  segments: readonly Seg8[]
  /** base half-width at u=0 (design units) — tapers toward the tip. */
  half0: number
  /** taper exponent — higher = thins faster toward the tip. */
  taper: number
  leaves: readonly LeafDef[]
}

/* ---- leaves: hand-placed for a DIRECTED composition, seeded jitter ---------
 *  A leaf splays OUTWARD (roughly perpendicular to the stem) with a gentle
 *  forward lean toward the tip — the feathered olive look. `tiltDeg` is that
 *  forward lean off the pure outward normal (small = stands straight out). */
interface LeafDef {
  u: number // position along that branch, 0..1
  side: 1 | -1 // which side it springs from
  len: number // design units
  tiltDeg: number // forward lean off the outward normal
}

/* MAIN ARM — enters left/upper-mid, sweeps down-and-right toward centre, tip
 * lifting. The workhorse of the mass; carries the most (and largest) leaves. */
const MAIN: BranchDef = {
  segments: [
    [-46, 214, 96, 176, 236, 214, 356, 288],
    [356, 288, 438, 338, 502, 398, 548, 468],
  ],
  half0: 7.4,
  taper: 1.2,
  leaves: [
    { u: 0.1, side: -1, len: 132, tiltDeg: 22 },
    { u: 0.17, side: 1, len: 138, tiltDeg: 26 },
    { u: 0.24, side: 1, len: 120, tiltDeg: 18 }, // deliberate same-side overlap
    { u: 0.31, side: -1, len: 128, tiltDeg: 27 },
    { u: 0.4, side: 1, len: 116, tiltDeg: 21 },
    { u: 0.48, side: -1, len: 122, tiltDeg: 24 },
    { u: 0.57, side: 1, len: 104, tiltDeg: 19 },
    { u: 0.66, side: -1, len: 96, tiltDeg: 25 },
    { u: 0.75, side: 1, len: 82, tiltDeg: 20 },
    { u: 0.85, side: -1, len: 66, tiltDeg: 22 },
    { u: 0.93, side: 1, len: 52, tiltDeg: 18 },
  ],
}

/* CLIMBING SHOOT — springs from low on the main and reaches UP-right, giving
 * the cluster height on the left side. Medium, slightly sparser leaves. */
const SHOOT: BranchDef = {
  segments: [
    [6, 262, 62, 170, 150, 104, 244, 74],
    [244, 74, 300, 56, 344, 60, 382, 78],
  ],
  half0: 5.4,
  taper: 1.15,
  leaves: [
    { u: 0.16, side: 1, len: 96, tiltDeg: 24 },
    { u: 0.26, side: -1, len: 104, tiltDeg: 28 },
    { u: 0.35, side: -1, len: 88, tiltDeg: 20 }, // overlap
    { u: 0.45, side: 1, len: 92, tiltDeg: 23 },
    { u: 0.56, side: -1, len: 80, tiltDeg: 26 },
    { u: 0.68, side: 1, len: 68, tiltDeg: 21 },
    { u: 0.8, side: -1, len: 54, tiltDeg: 19 },
  ],
}

/* LOWER BRANCH — droops from the base down-and-right, adding mass low-left so
 * the corner feels planted, not floating. A few broad leaves. */
const LOWER: BranchDef = {
  segments: [
    [-30, 296, 70, 356, 176, 404, 288, 486],
    [288, 486, 336, 522, 372, 556, 398, 592],
  ],
  half0: 5.8,
  taper: 1.25,
  leaves: [
    { u: 0.14, side: 1, len: 118, tiltDeg: 20 },
    { u: 0.24, side: -1, len: 110, tiltDeg: 24 },
    { u: 0.36, side: 1, len: 100, tiltDeg: 22 },
    { u: 0.44, side: 1, len: 84, tiltDeg: 16 }, // overlap
    { u: 0.54, side: -1, len: 92, tiltDeg: 25 },
    { u: 0.68, side: 1, len: 72, tiltDeg: 20 },
    { u: 0.82, side: -1, len: 56, tiltDeg: 22 },
  ],
}

const BRANCH_DEFS: readonly BranchDef[] = [MAIN, SHOOT, LOWER]

/* ------------------------------------------------------- geometry --------- */
function cubicPoint(s: Seg8, t: number): [number, number, number, number] {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  const x = a * s[0] + b * s[2] + c * s[4] + d * s[6]
  const y = a * s[1] + b * s[3] + c * s[5] + d * s[7]
  const da = 3 * mt * mt
  const db = 6 * mt * t
  const dc = 3 * t * t
  const tx = da * (s[2] - s[0]) + db * (s[4] - s[2]) + dc * (s[6] - s[4])
  const ty = da * (s[3] - s[1]) + db * (s[5] - s[3]) + dc * (s[7] - s[5])
  return [x, y, tx, ty]
}

interface StemSample {
  x: number
  y: number
  tx: number // unit tangent
  ty: number
  u: number // arc-length param 0..1
}

/** dense arc-length sampling of a branch, with unit tangents + u. */
function buildPolyline(segments: readonly Seg8[]): StemSample[] {
  const raw: { x: number; y: number; tx: number; ty: number; s: number }[] = []
  let acc = 0
  let px = 0
  let py = 0
  const STEPS = 84
  for (let seg = 0; seg < segments.length; seg++) {
    for (let i = 0; i <= STEPS; i++) {
      if (seg > 0 && i === 0) continue // avoid duplicate joins
      const t = i / STEPS
      const [x, y, tx, ty] = cubicPoint(segments[seg], t)
      if (raw.length > 0) acc += Math.hypot(x - px, y - py)
      const tl = Math.hypot(tx, ty) || 1
      raw.push({ x, y, tx: tx / tl, ty: ty / tl, s: acc })
      px = x
      py = y
    }
  }
  const total = acc || 1
  return raw.map((r) => ({ x: r.x, y: r.y, tx: r.tx, ty: r.ty, u: r.s / total }))
}

function sampleAt(poly: StemSample[], u: number): StemSample {
  let lo = 0
  let hi = poly.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (poly[mid].u < u) lo = mid + 1
    else hi = mid
  }
  return poly[lo]
}

interface LeafGeom {
  bx: number
  by: number // base (attach) point
  dx: number
  dy: number // unit long-axis direction
  len: number
  width: number
}

interface Branch {
  poly: StemSample[]
  half0: number
  taper: number
  leaves: LeafGeom[]
}

function buildBranch(def: BranchDef, rng: () => number): Branch {
  const poly = buildPolyline(def.segments)
  const leaves = def.leaves.map((leaf) => {
    const s = sampleAt(poly, leaf.u)
    const fx = s.tx
    const fy = s.ty
    const nx = -s.ty * leaf.side
    const ny = s.tx * leaf.side
    // looser jitter than v1 (±7°) so placement reads natural, not machined
    const jitterA = (rng() - 0.5) * 14
    const tilt = ((leaf.tiltDeg + jitterA) * Math.PI) / 180
    const ct = Math.cos(tilt)
    const st = Math.sin(tilt)
    let dx = nx * ct + fx * st
    let dy = ny * ct + fy * st
    const dl = Math.hypot(dx, dy) || 1
    dx /= dl
    dy /= dl
    const len = leaf.len * (0.88 + rng() * 0.24) // wider size variance
    return { bx: s.x, by: s.y, dx, dy, len, width: len * (0.4 + rng() * 0.08) }
  })
  return { poly, half0: def.half0, taper: def.taper, leaves }
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: LeafGeom): void {
  const { bx, by, dx, dy, len, width } = leaf
  const tipx = bx + dx * len
  const tipy = by + dy * len
  const midT = 0.44
  const mx = bx + dx * len * midT
  const my = by + dy * len * midT
  const px = -dy // perpendicular unit
  const py = dx
  const hw = width * 0.5
  const c1x = mx + px * hw * 1.45
  const c1y = my + py * hw * 1.45
  const c2x = mx - px * hw * 1.45
  const c2y = my - py * hw * 1.45

  // leaf body: perpendicular gradient — faint margins, denser midrib band.
  // v2 runs the interior a touch DARKER so the mass reads as an honest shadow
  // (less faint lace) while margins still fall off to keep edges soft.
  const g0x = mx + px * hw
  const g0y = my + py * hw
  const g1x = mx - px * hw
  const g1y = my - py * hw
  const grad = ctx.createLinearGradient(g0x, g0y, g1x, g1y)
  grad.addColorStop(0, "rgb(184,184,184)") // margin — sparse
  grad.addColorStop(0.28, "rgb(98,98,98)")
  grad.addColorStop(0.5, "rgb(80,80,80)") // body — denser than v1 (was 108), honest mass
  grad.addColorStop(0.72, "rgb(98,98,98)")
  grad.addColorStop(1, "rgb(184,184,184)")
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(bx, by)
  ctx.quadraticCurveTo(c1x, c1y, tipx, tipy)
  ctx.quadraticCurveTo(c2x, c2y, bx, by)
  ctx.closePath()
  ctx.fill()

  // midrib vein: the densest spine of the leaf (drawn a touch short of the tip)
  ctx.strokeStyle = "rgb(62,62,62)"
  ctx.lineWidth = Math.max(1.0, len * 0.015)
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(bx, by)
  ctx.lineTo(bx + dx * len * 0.92, by + dy * len * 0.92)
  ctx.stroke()
}

function drawStem(ctx: CanvasRenderingContext2D, branch: Branch): void {
  const { poly, half0, taper } = branch
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const halfW = half0 * Math.pow(1 - p.u, taper) + 1.1
    const r = halfW * 1.55
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
    g.addColorStop(0, "rgba(44,44,44,1)")
    g.addColorStop(0.5, "rgba(50,50,50,0.7)")
    g.addColorStop(1, "rgba(50,50,50,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // two small buds at the tip for an airy, growing feel
  const tip = poly[poly.length - 1]
  for (const off of [-1, 1] as const) {
    const bx = tip.x + tip.ty * 6 * off
    const by = tip.y - tip.tx * 6 * off
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, 6.5)
    g.addColorStop(0, "rgba(66,66,66,0.9)")
    g.addColorStop(1, "rgba(66,66,66,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(bx, by, 6.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

const BRANCHES: readonly Branch[] = BRANCH_DEFS.map((d) => buildBranch(d, mulberry32(0x1eaf)))

/* Per-branch HINGE in design units — where each branch roots / attaches. The
 * wind-sway pendulums (leaf-field.tsx) rotate each branch about ITS OWN hinge,
 * so the base stays planted and the tip swings most, like a real bough. Order
 * matches BRANCH_DEFS: [MAIN, SHOOT, LOWER]. */
const BRANCH_PIVOTS: readonly (readonly [number, number])[] = [
  CLUSTER_ENTRY, // MAIN — the cluster's left-edge entry
  [6, 262], // SHOOT — springs from low on the main
  [-30, 296], // LOWER — droops from the base
]

/* A handful of skeleton sample points per branch (design units) used only for
 * pointer proximity + torque arm — "is the cursor near THIS branch, and where
 * along it". Cheap: ~9 points × 3 branches, tested each frame. */
function branchSensorsDesign(branch: Branch): [number, number][] {
  const us = [0.06, 0.16, 0.27, 0.38, 0.5, 0.62, 0.73, 0.84, 0.94]
  return us.map((u) => {
    const s = sampleAt(branch.poly, u)
    return [s.x, s.y]
  })
}

export const svgBranchSource: SilhouetteSource = {
  designW: DESIGN_W,
  designH: DESIGN_H,
  draw(ctx) {
    // leaves first (stems overlap their bases -> leaves emerge from behind),
    // then stems on top. Lower branch drawn first so the main arm reads front.
    for (let b = BRANCHES.length - 1; b >= 0; b--) {
      for (const leaf of BRANCHES[b].leaves) drawLeaf(ctx, leaf)
    }
    for (let b = BRANCHES.length - 1; b >= 0; b--) {
      drawStem(ctx, BRANCHES[b])
    }
  },
}

/* ======================================================================== *
 *  SAMPLER — any SilhouetteSource -> weighted particle home positions
 * ======================================================================== */
export interface SampledField {
  count: number
  hx: Float32Array // home x, canvas CSS px
  hy: Float32Array // home y, canvas CSS px
  d: Float32Array // darkness 0..1 at that home (drives alpha/size/colour)
  pivotX: number // sway pivot (branch attach corner), canvas CSS px
  pivotY: number
}

/** longest side of the offscreen mask; the branch upscales smoothly from this.
 *  v3: raised 680 -> 820 so home positions quantise on a FINER grid before the
 *  sub-pixel jitter — less blocky sampling, part of the "fused shadow, not dot
 *  mosaic" pass. */
const MASK_LONG = 820
/** skip anything fainter than this (near-cream) so we never sample the ground. */
const DMIN = 0.06

/**
 * Rasterise `source` into a mask sized to the canvas, then inverse-CDF sample
 * `count` home positions weighted by darkness. Uniform-scaled + top-LEFT
 * anchored so the cluster keeps its proportions on any viewport and always
 * enters from the left, leaving centre-right open.
 */
export function sampleFromSource(
  source: SilhouetteSource,
  cssW: number,
  cssH: number,
  count: number,
  seed = 0x01ea5f,
): SampledField {
  const rng = mulberry32(seed)
  const maskScale = MASK_LONG / Math.max(cssW, cssH)
  const mw = Math.max(2, Math.round(cssW * maskScale))
  const mh = Math.max(2, Math.round(cssH * maskScale))

  const off = document.createElement("canvas")
  off.width = mw
  off.height = mh
  const ctx = off.getContext("2d", { willReadFrequently: true })!
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, mw, mh)

  // uniform fit + top-LEFT anchor (empty centre-right)
  const designAspect = source.designW / source.designH
  const canvasAspect = mw / mh
  const FILL = 1.05 // let the cluster bleed a hair past the edges
  const scale =
    canvasAspect >= designAspect
      ? (mh / source.designH) * FILL
      : (mw / source.designW) * FILL
  const bleedL = scale * 10
  const bleedT = scale * 22
  const ox = -bleedL // left edge of box just past the left border
  const oy = -bleedT // cluster enters just above/at the top-left

  ctx.save()
  ctx.setTransform(scale, 0, 0, scale, ox, oy)
  source.draw(ctx)
  ctx.restore()

  // pivot for the whole-cluster sway = the main arm's design entry, mapped in
  const pivotX = ox + CLUSTER_ENTRY[0] * scale
  const pivotY = oy + CLUSTER_ENTRY[1] * scale
  // convert mask px -> canvas css px
  const inv = 1 / maskScale

  // build a compact CDF over dark-enough pixels
  const img = ctx.getImageData(0, 0, mw, mh).data
  const n = mw * mh
  const idx = new Int32Array(n)
  const cum = new Float32Array(n)
  const dens = new Float32Array(n)
  let m = 0
  let total = 0
  for (let i = 0; i < n; i++) {
    const r = img[i * 4]
    const g = img[i * 4 + 1]
    const b = img[i * 4 + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    const d = (255 - lum) / 255
    if (d < DMIN) continue
    total += d
    idx[m] = i
    cum[m] = total
    dens[m] = d
    m++
  }

  const hx = new Float32Array(count)
  const hy = new Float32Array(count)
  const dd = new Float32Array(count)

  if (m === 0 || total <= 0) {
    return { count: 0, hx, hy, d: dd, pivotX, pivotY }
  }

  for (let p = 0; p < count; p++) {
    const target = rng() * total
    let lo = 0
    let hi = m - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cum[mid] < target) lo = mid + 1
      else hi = mid
    }
    const pixel = idx[lo]
    const mx = pixel % mw
    const my = (pixel / mw) | 0
    const jx = rng()
    const jy = rng()
    hx[p] = (mx + jx) * inv
    hy[p] = (my + jy) * inv
    dd[p] = dens[lo]
  }

  return { count, hx, hy, d: dd, pivotX, pivotY }
}

/* ======================================================================== *
 *  BRANCHED SAMPLER — the same cluster, but every particle TAGGED with which
 *  branch it belongs to, plus per-branch hinge + skeleton sensors in canvas px.
 *  This is what powers the WIND SWAY: three independent pendulums (one per
 *  branch) each rotate their own tagged particles about their own hinge, so the
 *  mass never moves as one rigid body and the cursor pushes a branch away
 *  instead of cutting through the grains. Each branch is rasterised into its
 *  OWN mask (identical fit/anchor as sampleFromSource) and sampled with a count
 *  proportional to its ink, so the total budget and the composition are kept.
 * ======================================================================== */
export interface BranchedField {
  count: number
  hx: Float32Array // home x, canvas CSS px
  hy: Float32Array // home y, canvas CSS px
  d: Float32Array // darkness 0..1 (drives alpha/size/colour)
  branch: Uint8Array // 0..branchCount-1 — which pendulum owns this grain
  branchCount: number
  pivotX: Float32Array // per-branch hinge x, canvas CSS px
  pivotY: Float32Array // per-branch hinge y, canvas CSS px
  sensorX: Float32Array[] // per-branch skeleton sensors x, canvas CSS px
  sensorY: Float32Array[] // per-branch skeleton sensors y, canvas CSS px
}

/** shared uniform fit + top-LEFT anchor (identical to sampleFromSource) so the
 *  branched sampling lands in exactly the same place as the combined mask. */
function computeFit(cssW: number, cssH: number) {
  const maskScale = MASK_LONG / Math.max(cssW, cssH)
  const mw = Math.max(2, Math.round(cssW * maskScale))
  const mh = Math.max(2, Math.round(cssH * maskScale))
  const designAspect = DESIGN_W / DESIGN_H
  const canvasAspect = mw / mh
  const FILL = 1.05
  const scale =
    canvasAspect >= designAspect ? (mh / DESIGN_H) * FILL : (mw / DESIGN_W) * FILL
  const ox = -scale * 10
  const oy = -scale * 22
  const inv = 1 / maskScale
  return { mw, mh, scale, ox, oy, inv }
}

/** rasterise ONE branch (its leaves + stem) into a fresh grayscale mask. */
function renderBranchMask(
  branch: Branch,
  mw: number,
  mh: number,
  scale: number,
  ox: number,
  oy: number,
): Uint8ClampedArray {
  const off = document.createElement("canvas")
  off.width = mw
  off.height = mh
  const ctx = off.getContext("2d", { willReadFrequently: true })!
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, mw, mh)
  ctx.save()
  ctx.setTransform(scale, 0, 0, scale, ox, oy)
  for (const leaf of branch.leaves) drawLeaf(ctx, leaf)
  drawStem(ctx, branch)
  ctx.restore()
  return ctx.getImageData(0, 0, mw, mh).data
}

interface BranchCDF {
  idx: Int32Array
  cum: Float32Array
  dens: Float32Array
  m: number
  total: number
}

export function sampleBranches(
  cssW: number,
  cssH: number,
  count: number,
  seed = 0x01ea5f,
): BranchedField {
  const rng = mulberry32(seed)
  const { mw, mh, scale, ox, oy, inv } = computeFit(cssW, cssH)
  const nB = BRANCHES.length

  // per-branch inverse-CDF over dark-enough pixels
  const cdfs: BranchCDF[] = []
  for (let b = 0; b < nB; b++) {
    const img = renderBranchMask(BRANCHES[b], mw, mh, scale, ox, oy)
    const n = mw * mh
    const idx = new Int32Array(n)
    const cum = new Float32Array(n)
    const dens = new Float32Array(n)
    let m = 0
    let total = 0
    for (let i = 0; i < n; i++) {
      const lum = 0.299 * img[i * 4] + 0.587 * img[i * 4 + 1] + 0.114 * img[i * 4 + 2]
      const d = (255 - lum) / 255
      if (d < DMIN) continue
      total += d
      idx[m] = i
      cum[m] = total
      dens[m] = d
      m++
    }
    cdfs.push({ idx, cum, dens, m, total })
  }

  // split the budget across branches by ink mass (so composition is preserved)
  const sumTotal = cdfs.reduce((s, c) => s + c.total, 0) || 1
  const counts = new Int32Array(nB)
  let assigned = 0
  for (let b = 0; b < nB; b++) {
    counts[b] = Math.max(0, Math.round((count * cdfs[b].total) / sumTotal))
    assigned += counts[b]
  }
  // reconcile rounding onto the heaviest branch so the total lands exactly
  let big = 0
  for (let b = 1; b < nB; b++) if (counts[b] > counts[big]) big = b
  counts[big] = Math.max(0, counts[big] + (count - assigned))

  const total = counts.reduce((s, c) => s + c, 0)
  const hx = new Float32Array(total)
  const hy = new Float32Array(total)
  const dd = new Float32Array(total)
  const branch = new Uint8Array(total)

  let p = 0
  for (let b = 0; b < nB; b++) {
    const c = cdfs[b]
    if (c.m === 0 || c.total <= 0) continue
    for (let k = 0; k < counts[b]; k++) {
      const target = rng() * c.total
      let lo = 0
      let hi = c.m - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (c.cum[mid] < target) lo = mid + 1
        else hi = mid
      }
      const pixel = c.idx[lo]
      const mx = pixel % mw
      const my = (pixel / mw) | 0
      hx[p] = (mx + rng()) * inv
      hy[p] = (my + rng()) * inv
      dd[p] = c.dens[lo]
      branch[p] = b
      p++
    }
  }

  // per-branch hinge + skeleton sensors, mapped design -> mask -> canvas px
  const pivotX = new Float32Array(nB)
  const pivotY = new Float32Array(nB)
  const sensorX: Float32Array[] = []
  const sensorY: Float32Array[] = []
  for (let b = 0; b < nB; b++) {
    pivotX[b] = (ox + BRANCH_PIVOTS[b][0] * scale) * inv
    pivotY[b] = (oy + BRANCH_PIVOTS[b][1] * scale) * inv
    const s = branchSensorsDesign(BRANCHES[b])
    const sx = new Float32Array(s.length)
    const sy = new Float32Array(s.length)
    for (let i = 0; i < s.length; i++) {
      sx[i] = (ox + s[i][0] * scale) * inv
      sy[i] = (oy + s[i][1] * scale) * inv
    }
    sensorX.push(sx)
    sensorY.push(sy)
  }

  return { count: total, hx, hy, d: dd, branch, branchCount: nB, pivotX, pivotY, sensorX, sensorY }
}

/* ======================================================================== *
 *  imageMaskSource — FUTURE swap (Aijia's shadow photo)
 *  Not wired into the page yet. Kept here so the swap is a one-line change:
 *      const source = imageMaskSource(herPhoto)   // instead of svgBranchSource
 *  Everything else (sampler, motion, colour, degradations) is identical. Her
 *  palm-shadow reference shows the density/mass this route is aiming at.
 * ======================================================================== */
export function imageMaskSource(
  img: HTMLImageElement,
  opts: { contrast?: number; gamma?: number } = {},
): SilhouetteSource {
  const contrast = opts.contrast ?? 1.25
  const gamma = opts.gamma ?? 1.0
  return {
    designW: img.naturalWidth || 1000,
    designH: img.naturalHeight || 640,
    draw(ctx) {
      // Paint the photo's luminance as the mask. A shadow photo is already
      // "dark shape on light ground", which is exactly our mask convention, so
      // this is mostly a desaturate + contrast lift. (Wired later.)
      ctx.filter = `grayscale(1) contrast(${contrast}) brightness(${1 / gamma})`
      ctx.drawImage(img, 0, 0)
      ctx.filter = "none"
    },
  }
}
