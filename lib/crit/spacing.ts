// Deterministic spacing / rhythm checks via edge-density projection.
//
// We build a per-row "ink" profile (how much content is in each row), find the
// gap bands between content bands, and measure them in px. A consistent layout
// has a repeating gap rhythm; outliers are reported with the measured px.
// We also measure the left edge of each content band to flag misalignment.

import type { Box, SpacingFinding } from "./types";

function edgeMap(data: Uint8ClampedArray, W: number, H: number): Float32Array {
  // Simple luminance gradient magnitude, normalized 0..1 per pixel.
  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4;
    lum[i] = (data[o] * 0.299 + data[o + 1] * 0.587 + data[o + 2] * 0.114) / 255;
  }
  const edges = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = lum[i + 1] - lum[i - 1];
      const gy = lum[i + W] - lum[i - W];
      edges[i] = Math.min(1, Math.sqrt(gx * gx + gy * gy));
    }
  }
  return edges;
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function analyzeSpacing(
  data: Uint8ClampedArray,
  W: number,
  H: number
): SpacingFinding[] {
  const edges = edgeMap(data, W, H);

  // Row ink profile.
  const rowInk = new Float32Array(H);
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (let x = 0; x < W; x++) s += edges[y * W + x];
    rowInk[y] = s / W;
  }
  const inkMed = median([...rowInk].filter((v) => v > 0));
  const threshold = Math.max(0.012, inkMed * 0.45);

  // Classify rows as content (1) or gap (0), then collect content bands.
  type Band = { start: number; end: number };
  const bands: Band[] = [];
  let inBand = false;
  let bandStart = 0;
  for (let y = 0; y < H; y++) {
    const content = rowInk[y] >= threshold;
    if (content && !inBand) {
      inBand = true;
      bandStart = y;
    } else if (!content && inBand) {
      inBand = false;
      if (y - bandStart >= 3) bands.push({ start: bandStart, end: y });
    }
  }
  if (inBand) bands.push({ start: bandStart, end: H });

  const findings: SpacingFinding[] = [];

  // --- Vertical rhythm: gaps between consecutive content bands ---
  const gaps: { px: number; y: number }[] = [];
  for (let i = 1; i < bands.length; i++) {
    const gapPx = bands[i].start - bands[i - 1].end;
    if (gapPx >= 4) gaps.push({ px: gapPx, y: bands[i - 1].end });
  }
  if (gaps.length >= 3) {
    const gapMed = median(gaps.map((g) => g.px));
    const tol = Math.max(6, gapMed * 0.35);
    for (const g of gaps) {
      if (Math.abs(g.px - gapMed) > tol) {
        const box: Box = {
          x: 0.04,
          y: g.y / H,
          w: 0.92,
          h: Math.min(g.px / H, 0.06),
        };
        findings.push({
          id: `rhythm-${Math.round(g.y)}`,
          kind: "vertical-rhythm",
          box,
          measuredPx: Math.round(g.px),
          expectedPx: Math.round(gapMed),
          detail: `${Math.round(g.px)}px gap breaks the ~${Math.round(
            gapMed
          )}px vertical rhythm`,
        });
      }
    }
  }

  // --- Left-edge alignment of content bands ---
  const leftEdges: { x: number; band: Band }[] = [];
  for (const band of bands) {
    let firstX = -1;
    outer: for (let x = 0; x < W; x++) {
      for (let y = band.start; y < band.end; y++) {
        if (edges[y * W + x] >= threshold) {
          firstX = x;
          break outer;
        }
      }
    }
    if (firstX >= 0) leftEdges.push({ x: firstX, band });
  }
  if (leftEdges.length >= 3) {
    const xMed = median(leftEdges.map((e) => e.x));
    const tol = Math.max(8, W * 0.012);
    for (const e of leftEdges) {
      // Only flag bands indented *more* than the common edge (true misalign),
      // ignore full-bleed sections starting at x≈0.
      if (e.x > xMed + tol && e.x > W * 0.02) {
        findings.push({
          id: `align-${Math.round(e.band.start)}`,
          kind: "left-alignment",
          box: {
            x: e.x / W,
            y: e.band.start / H,
            w: Math.min(0.3, (e.x - xMed) / W + 0.06),
            h: (e.band.end - e.band.start) / H,
          },
          measuredPx: Math.round(e.x),
          expectedPx: Math.round(xMed),
          detail: `Left edge at ${Math.round(e.x)}px vs the ${Math.round(
            xMed
          )}px column most blocks align to`,
        });
      }
    }
  }

  // Cap for readability — worst (largest deviation) first.
  findings.sort(
    (a, b) =>
      Math.abs(b.measuredPx - b.expectedPx) -
      Math.abs(a.measuredPx - a.expectedPx)
  );
  return findings.slice(0, 8);
}
