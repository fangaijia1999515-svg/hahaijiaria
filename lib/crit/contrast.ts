// Deterministic WCAG contrast detection.
//
// Approach (transparent on purpose):
//  1. Split the image into a grid of cells.
//  2. In each cell, find the two dominant colors (text-like cells are bimodal:
//     a majority "background" color + a minority "foreground" color).
//  3. Only keep cells that look like text/iconography — bimodal, with the
//     minority color covering a text-plausible share and enough edges.
//  4. Compute the exact WCAG ratio between those two colors and flag < target.
//  5. Merge adjacent flagged cells into regions so markers point at real spots.
//
// This is a heuristic on *where* to measure, but the measurement itself is the
// exact WCAG formula — that's the trust foundation.

import { contrastRatio, toHex, colorDistanceSq, type RGB } from "./color";
import type { Box, ContrastFinding } from "./types";

type Cell = {
  col: number;
  row: number;
  fg: RGB;
  bg: RGB;
  ratio: number;
};

const QUANT = 24; // color bucket size for two-tone detection

function dominantTwoColors(
  data: Uint8ClampedArray,
  W: number,
  x0: number,
  y0: number,
  cw: number,
  ch: number
): { c1: RGB; c2: RGB; share1: number; share2: number; total: number } | null {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  for (let y = y0; y < y0 + ch; y++) {
    for (let x = x0; x < x0 + cw; x++) {
      const i = (y * W + x) * 4;
      const a = data[i + 3];
      if (a < 128) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key =
        Math.round(r / QUANT) * 10000 +
        Math.round(g / QUANT) * 100 +
        Math.round(b / QUANT);
      let bk = buckets.get(key);
      if (!bk) {
        bk = { r: 0, g: 0, b: 0, n: 0 };
        buckets.set(key, bk);
      }
      bk.r += r;
      bk.g += g;
      bk.b += b;
      bk.n += 1;
      total++;
    }
  }
  if (total === 0) return null;
  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  if (sorted.length < 2) return null;
  const a = sorted[0];
  const b = sorted[1];
  return {
    c1: { r: a.r / a.n, g: a.g / a.n, b: a.b / a.n },
    c2: { r: b.r / b.n, g: b.g / b.n, b: b.b / b.n },
    share1: a.n / total,
    share2: b.n / total,
    total,
  };
}

// Fraction of pixels in a cell that differ markedly from their right neighbor.
// High for text (stroke edges), low for solid fills.
function edgeDensity(
  data: Uint8ClampedArray,
  W: number,
  x0: number,
  y0: number,
  size: number
): number {
  let edges = 0;
  let total = 0;
  for (let y = y0; y < y0 + size; y++) {
    for (let x = x0; x < x0 + size - 1; x++) {
      const i = (y * W + x) * 4;
      const j = (y * W + x + 1) * 4;
      const d =
        Math.abs(data[i] - data[j]) +
        Math.abs(data[i + 1] - data[j + 1]) +
        Math.abs(data[i + 2] - data[j + 2]);
      if (d > 50) edges++;
      total++;
    }
  }
  return total ? edges / total : 0;
}

export function analyzeContrast(
  data: Uint8ClampedArray,
  W: number,
  H: number,
  target: number
): ContrastFinding[] {
  const cellPx = Math.max(16, Math.round(Math.min(W, H) / 28));
  const cols = Math.floor(W / cellPx);
  const rows = Math.floor(H / cellPx);
  const flagged: Cell[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = col * cellPx;
      const y0 = row * cellPx;
      const dom = dominantTwoColors(data, W, x0, y0, cellPx, cellPx);
      if (!dom) continue;

      // Text-like: the two colors should cover most of the cell, and the
      // minority (foreground) color should sit in a text-plausible band.
      const coverage = dom.share1 + dom.share2;
      if (coverage < 0.78) continue;
      if (dom.share2 < 0.04 || dom.share2 > 0.46) continue;

      // The two colors must actually be different (real edge, not noise).
      if (colorDistanceSq(dom.c1, dom.c2) < 22 * 22) continue;

      // Text is high-frequency: many small strokes => many color transitions.
      // A solid block (chart bar, color chip) is bimodal but low-frequency, so
      // this filters decorative two-tone regions out of the WCAG check.
      if (edgeDensity(data, W, x0, y0, cellPx) < 0.06) continue;

      const ratio = contrastRatio(dom.c1, dom.c2);
      if (ratio >= target) continue;

      // background = majority color, foreground = minority color
      flagged.push({ col, row, bg: dom.c1, fg: dom.c2, ratio });
    }
  }

  return mergeCells(flagged, cols, rows, cellPx, W, H);
}

// Union-find merge of adjacent flagged cells into rectangular regions.
function mergeCells(
  cells: Cell[],
  cols: number,
  rows: number,
  cellPx: number,
  W: number,
  H: number
): ContrastFinding[] {
  const index = new Map<string, Cell>();
  for (const c of cells) index.set(`${c.col},${c.row}`, c);

  const seen = new Set<string>();
  const findings: ContrastFinding[] = [];

  for (const start of cells) {
    const startKey = `${start.col},${start.row}`;
    if (seen.has(startKey)) continue;
    // BFS flood fill over 8-neighbourhood
    const stack = [start];
    const group: Cell[] = [];
    seen.add(startKey);
    while (stack.length) {
      const cur = stack.pop()!;
      group.push(cur);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nk = `${cur.col + dc},${cur.row + dr}`;
          if (seen.has(nk)) continue;
          const n = index.get(nk);
          if (n) {
            seen.add(nk);
            stack.push(n);
          }
        }
      }
    }

    // Region bounds + representative (worst) ratio
    let minC = Infinity;
    let minR = Infinity;
    let maxC = -Infinity;
    let maxR = -Infinity;
    let worst = group[0];
    for (const g of group) {
      minC = Math.min(minC, g.col);
      minR = Math.min(minR, g.row);
      maxC = Math.max(maxC, g.col);
      maxR = Math.max(maxR, g.row);
      if (g.ratio < worst.ratio) worst = g;
    }
    // Ignore single stray cells — too noisy to be credible.
    if (group.length < 2) continue;

    const px0 = minC * cellPx;
    const py0 = minR * cellPx;
    const pw = (maxC - minC + 1) * cellPx;
    const ph = (maxR - minR + 1) * cellPx;
    const box: Box = { x: px0 / W, y: py0 / H, w: pw / W, h: ph / H };

    findings.push({
      id: `contrast-${minC}-${minR}`,
      box,
      ratio: Math.round(worst.ratio * 100) / 100,
      fgHex: toHex(worst.fg),
      bgHex: toHex(worst.bg),
      passesAA: worst.ratio >= 4.5,
      passesAALarge: worst.ratio >= 3.0,
      passesAAA: worst.ratio >= 7.0,
    });
  }

  // Sort worst-first, cap to keep the panel readable.
  findings.sort((a, b) => a.ratio - b.ratio);
  return findings.slice(0, 12);
}
