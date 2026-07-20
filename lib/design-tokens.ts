/**
 * AIJIA FANG — DESIGN SYSTEM TOKENS (JS mirror of styles/design-tokens.css)
 * ---------------------------------------------------------------------------
 * The CSS file (`.ds` scope) is the runtime source of truth. This module is
 * the typed reference for JS/TS use (charts, canvas, motion configs, docs).
 * Keep the two in sync — same names, same values.
 *
 * Fonts are SUBSTITUTES: Fraunces → (Canela), Hanken Grotesk → (Söhne),
 * IBM Plex Mono is the real thing. Swapping later = change --ds-font-* in CSS.
 */

/** Raw palette — her 色彩系统 sheet. Names match the CSS `--ds-*` tokens. */
export const palette = {
  warmCream: "#F5F0E8",
  softParchment: "#E8E0D5",
  warmTaupe: "#B8A99A",
  deepCharcoal: "#2D2D2D",
  forestGreen: "#3D4A3A",
  amberBrown: "#8B7355",
  sageGreen: "#9CAF88",
  mutedTerracotta: "#C4A484",
  stoneGray: "#D1CDC6",
} as const

/** Human-readable swatch metadata for the /system color grid. */
export const swatches = [
  { name: "Warm Cream", hex: palette.warmCream, role: "Page background" },
  { name: "Soft Parchment", hex: palette.softParchment, role: "Raised surface / card" },
  { name: "Warm Taupe", hex: palette.warmTaupe, role: "Muted / borders" },
  { name: "Deep Charcoal", hex: palette.deepCharcoal, role: "Text / dark sections" },
  { name: "Forest Green", hex: palette.forestGreen, role: "Primary accent" },
  { name: "Amber Brown", hex: palette.amberBrown, role: "Earth accent" },
  { name: "Sage Green", hex: palette.sageGreen, role: "Secondary accent / focus" },
  { name: "Muted Terracotta", hex: palette.mutedTerracotta, role: "Warm accent" },
  { name: "Stone Gray", hex: palette.stoneGray, role: "Neutral tint" },
] as const

/** Type scale — her 字体系统 sheet (authoritative: H1 max 64, Body Large 16–18). */
export const typeScale = [
  { token: "H1", font: "Cormorant (Canela)", size: "48–64px", clamp: "clamp(3rem, 2.4rem + 2.2vw, 4rem)", lh: "1.1", ls: "-0.02em" },
  { token: "H2", font: "Cormorant (Canela)", size: "32–40px", clamp: "clamp(2rem, 1.5rem + 1.6vw, 2.5rem)", lh: "1.2", ls: "-0.01em" },
  { token: "H3", font: "Cormorant (Canela)", size: "22–28px", clamp: "clamp(1.375rem, 1.2rem + 0.55vw, 1.75rem)", lh: "1.3", ls: "0em" },
  { token: "Body Large", font: "Hanken (Söhne)", size: "16–18px", clamp: "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)", lh: "1.6", ls: "0em" },
  { token: "Body", font: "Hanken (Söhne)", size: "16px", clamp: "1rem", lh: "1.6", ls: "0em" },
  { token: "Body Small", font: "Hanken (Söhne)", size: "14px", clamp: "0.875rem", lh: "1.5", ls: "0em" },
  { token: "Label", font: "IBM Plex Mono", size: "12–14px", clamp: "0.8125rem", lh: "1.4", ls: "0.08em" },
  { token: "Overline", font: "IBM Plex Mono", size: "11–12px", clamp: "0.6875rem", lh: "1.4", ls: "0.36em" },
] as const

/** 4px spacing scale — her 间距与网格 sheet. */
export const spacing = {
  1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "24px",
  6: "32px", 7: "48px", 8: "64px", 9: "96px", 10: "120px", 11: "160px",
} as const

/** The OFFICIAL displayed scale, exactly her sheet: 4 (base) → 128.
 * (The `spacing` map above keeps a few extra utility steps for layout code.) */
export const spacingScale = ["4px", "8px", "16px", "24px", "32px", "48px", "64px", "128px"] as const

export const layout = {
  containerMax: "1440px",
  contentMax: "1200px",
  gridCols: 12,
  gutter: "24px",
  marginDesktop: "80px",
  containers: {
    desktop: "1200–1440px (rec. 1280)",
    tablet: "720–960px (rec. 960)",
    mobile: "100%",
  },
  section: {
    large: { top: "128px", bottom: "128px" },
    medium: { top: "64px", bottom: "64px" },
    small: { top: "32px", bottom: "32px" },
    none: { top: "0px", bottom: "0px" },
  },
} as const

export const radius = { sm: "4px", md: "8px", lg: "16px", pill: "999px" } as const

export const shadow = {
  sm: "0 1px 2px rgba(45,45,45,0.05), 0 1px 3px rgba(45,45,45,0.06)",
  md: "0 4px 12px rgba(45,45,45,0.07), 0 2px 4px rgba(45,45,45,0.05)",
  lg: "0 12px 32px rgba(45,45,45,0.10), 0 4px 8px rgba(45,45,45,0.05)",
} as const

/** Motion — her 动效与交互 sheet. */
export const motion = {
  ease: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  duration: { hover: 320, base: 450, reveal: 550, loader: 1000 },
} as const

/** Texture & materials — her 背景与纹理 / 完整概览 sheet. Swatches cropped from
 * her spec into /public/ds/textures. */
export const materials = [
  { name: "Paper Fiber", slug: "paper-fiber", role: "Base surface grain" },
  { name: "Shadow Play", slug: "shadow-play", role: "Light + shadow overlay" },
  { name: "Natural Stone", slug: "natural-stone", role: "Section dividers" },
  { name: "Water Surface", slug: "water-surface", role: "Reflective hero motif" },
  { name: "Linen Weave", slug: "linen-weave", role: "Warm tactile fill" },
  { name: "Mineral Finish", slug: "mineral-finish", role: "Muted neutral panels" },
] as const

/** Mood-board categories — her 背景与纹理 sheet, with the ACTUAL images
 * cropped from that sheet (public/ds/moodboard/). */
export const moodboard = [
  { name: "Soft Organic Gradients", note: "Dawn-to-dusk washes, no hard edges",
    images: ["gradient-soft"] },
  { name: "Paper & Linen Textures", note: "Tactile grain, warm neutrals",
    images: ["paper-texture", "linen-texture"] },
  { name: "Abstract Nature Photography", note: "Dune, water, flora, wood, stone",
    images: ["nature-dune", "nature-water", "nature-flora", "nature-wood", "nature-stone"] },
  { name: "3D Rendered Natural Landscapes", note: "Misty hills, organic interiors, depth",
    images: ["landscape-3d", "interior-render-1", "interior-render-2"] },
  { name: "Minimal Shadow & Light Play", note: "Cast botanical shadows, low sun",
    images: ["shadow-leaf", "shadow-dappled", "shadow-olive"] },
] as const

/** The 9 landscape hero backgrounds she may use later (staged in /public/ds/backgrounds). */
export const backgroundOptions = [
  { name: "Abstract Landscape", slug: "abstract-landscape" },
  { name: "Morning Hills", slug: "morning-hills" },
  { name: "Quiet Valley", slug: "quiet-valley" },
  { name: "Layered Mountains", slug: "layered-mountains" },
  { name: "Dune Curves", slug: "dune-curves" },
  { name: "Lake Reflection", slug: "lake-reflection" },
  { name: "Winding River", slug: "winding-river" },
  { name: "Full Hero", slug: "full-hero" },
  { name: "Simplified Hero", slug: "simplified-hero" },
] as const

export const tokens = {
  palette, swatches, typeScale, spacing, layout, radius, shadow, motion,
  materials, moodboard, backgroundOptions,
}
export default tokens
