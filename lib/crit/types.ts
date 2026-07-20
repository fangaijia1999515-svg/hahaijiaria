// Shared shapes for analysis results.

/** Normalized box (0-1 relative to image width/height). */
export type Box = { x: number; y: number; w: number; h: number };

export type ContrastFinding = {
  id: string;
  box: Box;
  ratio: number; // measured WCAG ratio
  fgHex: string;
  bgHex: string;
  passesAA: boolean; // >= 4.5
  passesAALarge: boolean; // >= 3.0
  passesAAA: boolean; // >= 7.0
};

export type SpacingFinding = {
  id: string;
  kind: "vertical-rhythm" | "left-alignment";
  box: Box;
  detail: string; // human-readable measured detail
  measuredPx: number;
  expectedPx: number;
};

export type SlopCheckId =
  | "purple-blue-gradient"
  | "pure-black-on-white"
  | "everything-centered"
  | "identical-cards"
  | "neon-oversaturation"
  | "edge-to-edge-no-padding"
  | "heavy-gradient-fill"
  | "timid-monochrome";

export type SlopCheck = {
  id: SlopCheckId;
  label: string;
  blurb: string; // what the heuristic looks for
  present: boolean;
  metric: number; // the raw measured number behind the verdict
  detail: string; // measured, human-readable
  box?: Box; // optional location to annotate
};

export type AnalysisResult = {
  width: number; // natural px
  height: number;
  contrast: ContrastFinding[];
  spacing: SpacingFinding[];
  slop: SlopCheck[];
  sampledColors: { hex: string; share: number }[]; // dominant palette
};
