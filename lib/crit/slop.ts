// The AI-slop detector: a NAMED checklist of deterministic heuristics.
// Each check is a pure pixel computation. These encode a point of view about
// taste — the things that make an interface read as machine-generated.
//
// Honest framing: these are heuristics. They report the measured number behind
// each verdict so a designer can judge the call, not take it on faith.

import { rgbToHsl, type RGB } from "./color";
import type { SlopCheck } from "./types";

type Px = RGB & { a: number };

function px(data: Uint8ClampedArray, i: number): Px {
  const o = i * 4;
  return { r: data[o], g: data[o + 1], b: data[o + 2], a: data[o + 3] };
}

export function analyzeSlop(
  data: Uint8ClampedArray,
  W: number,
  H: number
): SlopCheck[] {
  const N = W * H;
  let purpleBlue = 0;
  let neon = 0;
  let nearBlack = 0;
  let nearWhite = 0;
  let opaque = 0;

  for (let i = 0; i < N; i++) {
    const p = px(data, i);
    if (p.a < 128) continue;
    opaque++;
    const { h, s, l } = rgbToHsl(p);
    // Purple→blue band, reasonably saturated, mid lightness.
    if (h >= 232 && h <= 290 && s > 0.32 && l > 0.28 && l < 0.72) purpleBlue++;
    // Neon: very saturated, mid-light.
    if (s > 0.82 && l > 0.42 && l < 0.62) neon++;
    if (p.r < 10 && p.g < 10 && p.b < 10) nearBlack++;
    if (p.r > 247 && p.g > 247 && p.b > 247) nearWhite++;
  }
  const denom = Math.max(1, opaque);

  const checks: SlopCheck[] = [];

  // 1. Purple-blue gradient
  {
    const share = purpleBlue / denom;
    checks.push({
      id: "purple-blue-gradient",
      label: "Purple-blue gradient",
      blurb: "The default generative-AI hero palette.",
      present: share > 0.14,
      metric: share,
      detail: `${(share * 100).toFixed(1)}% of pixels sit in the purple→blue band`,
    });
  }

  // 2. Pure black on pure white
  {
    const bShare = nearBlack / denom;
    const wShare = nearWhite / denom;
    const present = bShare > 0.008 && wShare > 0.25;
    checks.push({
      id: "pure-black-on-white",
      label: "Pure #000 on pure #fff",
      blurb: "Maximum-contrast default with no warmth or tonal hierarchy.",
      present,
      metric: Math.min(bShare * 100, 1),
      detail: `${(bShare * 100).toFixed(1)}% pure black over ${(
        wShare * 100
      ).toFixed(0)}% pure white`,
    });
  }

  // 3. Neon oversaturation
  {
    const share = neon / denom;
    checks.push({
      id: "neon-oversaturation",
      label: "Neon oversaturation",
      blurb: "Cranked saturation standing in for a considered palette.",
      present: share > 0.06,
      metric: share,
      detail: `${(share * 100).toFixed(1)}% of pixels are near-max saturation`,
    });
  }

  // 4. Everything-centered.
  // Build a per-column *content* profile (vertical-edge density, which ignores
  // flat fills) and measure how mirror-symmetric the content placement is plus
  // how concentrated it is toward the center. A left sidebar or asymmetric
  // layout scores low on both; a centered single column scores high on both.
  {
    const colEdge = new Float32Array(W);
    for (let x = 1; x < W - 1; x++) {
      let s = 0;
      for (let y = 0; y < H; y += 2) {
        const a = px(data, y * W + x - 1);
        const b = px(data, y * W + x + 1);
        const d = Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
        if (d > 36) s += 1;
      }
      colEdge[x] = s;
    }
    const sym = mirrorCorrelation(colEdge);

    // Center-of-mass: 0 = far left, 1 = far right; centered ≈ 0.5.
    let mass = 0;
    let wmass = 0;
    for (let x = 0; x < W; x++) {
      mass += colEdge[x];
      wmass += colEdge[x] * (x / (W - 1));
    }
    const com = mass > 0 ? wmass / mass : 0.5;
    const centeredness = 1 - Math.min(1, Math.abs(com - 0.5) / 0.5);

    const score = sym * 0.6 + centeredness * 0.4;
    checks.push({
      id: "everything-centered",
      label: "Everything centered",
      blurb: "Symmetric, center-stacked layout: the safe, characterless default.",
      present: score > 0.72,
      metric: score,
      detail: `Content symmetry ${sym.toFixed(2)}, horizontal balance ${centeredness.toFixed(
        2
      )}, center-stacked`,
    });
  }

  // 5. Identical repeated cards (vertical self-similarity / periodicity)
  {
    const { score, periodPx } = rowPeriodicity(data, W, H);
    checks.push({
      id: "identical-cards",
      label: "Identical repeated cards",
      blurb: "The same module stamped down the page with no variation.",
      present: score > 0.6,
      metric: score,
      detail:
        periodPx > 0
          ? `Strong ~${periodPx}px repeating band (similarity ${score.toFixed(
              2
            )})`
          : `Repetition similarity ${score.toFixed(2)}`,
    });
  }

  // 6. Edge-to-edge, no padding
  {
    const border = borderInk(data, W, H);
    checks.push({
      id: "edge-to-edge-no-padding",
      label: "Edge-to-edge, no padding",
      blurb: "Content jammed against the frame with no breathing room.",
      present: border > 0.18,
      metric: border,
      detail: `${(border * 100).toFixed(0)}% ink density in the outer 2% border`,
    });
  }

  // 7. Heavy gradient fill (large smooth tonal sweeps)
  {
    const share = smoothGradientShare(data, W, H);
    checks.push({
      id: "heavy-gradient-fill",
      label: "Heavy gradient fill",
      blurb: "Big smooth color sweeps doing the work design should.",
      present: share > 0.22,
      metric: share,
      detail: `${(share * 100).toFixed(0)}% of the image is a smooth color sweep`,
    });
  }

  // 8. Timid monochrome (no real accent / too few hues)
  {
    const hues = distinctHues(data, W, H);
    checks.push({
      id: "timid-monochrome",
      label: "Timid / no accent",
      blurb: "One flat hue family, no confident accent color.",
      present: hues <= 1,
      metric: hues,
      detail: `${hues} distinct hue families detected`,
    });
  }

  return checks;
}

function mirrorCorrelation(col: Float32Array): number {
  const W = col.length;
  const half = Math.floor(W / 2);
  let sa = 0;
  let sb = 0;
  for (let i = 0; i < half; i++) {
    sa += col[i];
    sb += col[W - 1 - i];
  }
  const ma = sa / half;
  const mb = sb / half;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < half; i++) {
    const a = col[i] - ma;
    const b = col[W - 1 - i] - mb;
    num += a * b;
    da += a * a;
    db += b * b;
  }
  const denom = Math.sqrt(da * db);
  return denom === 0 ? 0 : Math.max(0, num / denom);
}

function rowSignature(data: Uint8ClampedArray, W: number, y: number): number {
  let s = 0;
  for (let x = 0; x < W; x += 3) {
    const p = px(data, y * W + x);
    s += p.r * 0.299 + p.g * 0.587 + p.b * 0.114;
  }
  return s;
}

function rowPeriodicity(
  data: Uint8ClampedArray,
  W: number,
  H: number
): { score: number; periodPx: number } {
  const sig = new Float32Array(H);
  for (let y = 0; y < H; y++) sig[y] = rowSignature(data, W, y);
  // mean-center
  let mean = 0;
  for (let y = 0; y < H; y++) mean += sig[y];
  mean /= H;
  for (let y = 0; y < H; y++) sig[y] -= mean;

  let best = 0;
  let bestLag = 0;
  const minLag = Math.max(20, Math.floor(H * 0.04));
  const maxLag = Math.floor(H * 0.5);
  let denom = 0;
  for (let y = 0; y < H; y++) denom += sig[y] * sig[y];
  if (denom === 0) return { score: 0, periodPx: 0 };
  for (let lag = minLag; lag <= maxLag; lag++) {
    let num = 0;
    for (let y = 0; y + lag < H; y++) num += sig[y] * sig[y + lag];
    const norm = num / denom;
    if (norm > best) {
      best = norm;
      bestLag = lag;
    }
  }
  return { score: Math.max(0, best), periodPx: bestLag };
}

function borderInk(data: Uint8ClampedArray, W: number, H: number): number {
  const bx = Math.max(1, Math.floor(W * 0.02));
  const by = Math.max(1, Math.floor(H * 0.02));
  let ink = 0;
  let count = 0;
  const isInk = (x: number, y: number) => {
    const c = px(data, y * W + x);
    const r = px(data, y * W + Math.min(W - 1, x + 1));
    const d =
      Math.abs(c.r - r.r) + Math.abs(c.g - r.g) + Math.abs(c.b - r.b);
    return d > 40 ? 1 : 0;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const onBorder = x < bx || x >= W - bx || y < by || y >= H - by;
      if (!onBorder) continue;
      ink += isInk(x, y);
      count++;
    }
  }
  return count ? ink / count : 0;
}

function smoothGradientShare(
  data: Uint8ClampedArray,
  W: number,
  H: number
): number {
  // A true gradient is smooth *locally* but *changing* over distance.
  // Flat fills (smooth + unchanging) and hard edges (large local delta) are
  // both excluded, so a page of white panels does not read as "gradient".
  let grad = 0;
  let total = 0;
  const far = Math.max(16, Math.round(Math.min(W, H) * 0.05));
  const step = 2;
  for (let y = far; y < H - far; y += step) {
    for (let x = far; x < W - far; x += step) {
      const c = px(data, y * W + x);
      const ln = px(data, y * W + x + 2);
      const local =
        Math.abs(c.r - ln.r) + Math.abs(c.g - ln.g) + Math.abs(c.b - ln.b);
      if (local > 14) {
        total++;
        continue; // edge / texture, not a smooth sweep
      }
      const fx = px(data, y * W + x + far);
      const fy = px(data, (y + far) * W + x);
      const sweepX =
        Math.abs(c.r - fx.r) + Math.abs(c.g - fx.g) + Math.abs(c.b - fx.b);
      const sweepY =
        Math.abs(c.r - fy.r) + Math.abs(c.g - fy.g) + Math.abs(c.b - fy.b);
      const useY = sweepY > sweepX;
      const sweep = useY ? sweepY : sweepX;
      total++;
      if (sweep < 8 || sweep > 150) continue;

      // Linearity test: a real gradient is roughly linear, so the midpoint
      // sample sits near the average of the endpoints. A step edge (flat A next
      // to flat B) fails this — the midpoint equals one endpoint, not the mean.
      const half = far >> 1;
      const m = useY ? px(data, (y + half) * W + x) : px(data, y * W + x + half);
      const f = useY ? fy : fx;
      const dev =
        Math.abs(m.r - (c.r + f.r) / 2) +
        Math.abs(m.g - (c.g + f.g) / 2) +
        Math.abs(m.b - (c.b + f.b) / 2);
      if (dev > 14) continue; // not a smooth ramp — it's a step/edge

      grad++;
    }
  }
  return total ? grad / total : 0;
}

function distinctHues(data: Uint8ClampedArray, W: number, H: number): number {
  const bins = new Float32Array(12); // 30° hue bins
  const step = 3;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const p = px(data, y * W + x);
      if (p.a < 128) continue;
      const { h, s, l } = rgbToHsl(p);
      if (s < 0.18 || l < 0.1 || l > 0.92) continue; // ignore neutrals
      bins[Math.min(11, Math.floor(h / 30))] += 1;
    }
  }
  let total = 0;
  for (const b of bins) total += b;
  if (total === 0) return 0;
  let count = 0;
  for (const b of bins) if (b / total > 0.04) count++;
  return count;
}
