// Client-side orchestrator for the VERIFIED layer.
// Loads an image, downscales for speed, runs the three deterministic passes.

import { analyzeContrast } from "./contrast";
import { analyzeSpacing } from "./spacing";
import { analyzeSlop } from "./slop";
import { rgbToHsl, toHex } from "./color";
import type { AnalysisResult } from "./types";

const MAX_DIM = 1100; // cap analysis resolution for performance

export type AnalyzeOptions = {
  contrastTarget: number; // 4.5 (AA) or 7 (AAA)
};

function getImageData(img: HTMLImageElement): {
  data: Uint8ClampedArray;
  W: number;
  H: number;
} {
  const natW = img.naturalWidth || img.width;
  const natH = img.naturalHeight || img.height;
  const scale = Math.min(1, MAX_DIM / Math.max(natW, natH));
  const W = Math.max(1, Math.round(natW * scale));
  const H = Math.max(1, Math.round(natH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);
  return { data, W, H };
}

function palette(
  data: Uint8ClampedArray,
  W: number,
  H: number
): { hex: string; share: number }[] {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;
  const Q = 32;
  for (let i = 0; i < W * H; i += 2) {
    const o = i * 4;
    if (data[o + 3] < 128) continue;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const key =
      Math.round(r / Q) * 10000 + Math.round(g / Q) * 100 + Math.round(b / Q);
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
  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 8)
    .map((c) => ({
      hex: toHex({ r: c.r / c.n, g: c.g / c.n, b: c.b / c.n }),
      share: c.n / Math.max(1, total),
    }));
}

export async function analyzeImage(
  src: string,
  opts: AnalyzeOptions
): Promise<AnalysisResult> {
  const img = await loadImage(src);
  const { data, W, H } = getImageData(img);
  const contrast = analyzeContrast(data, W, H, opts.contrastTarget);
  const spacing = analyzeSpacing(data, W, H);
  const slop = analyzeSlop(data, W, H);
  const sampledColors = palette(data, W, H);
  // touch import so tree-shaking doesn't drop it in odd setups
  void rgbToHsl;
  return {
    width: img.naturalWidth || W,
    height: img.naturalHeight || H,
    contrast,
    spacing,
    slop,
    sampledColors,
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export * from "./types";
