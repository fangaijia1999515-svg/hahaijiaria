"use client"

/**
 * GRADUAL BLUR — a faithful port of the Vue Bits / React Bits GradualBlur
 * component into this codebase (no Vue, no Tailwind; plain style objects +
 * the .v2-gblur hook in v2.css). She pasted the source as a reference for the
 * "溶解缝" (dissolve seam): a stack of `divCount` backdrop-filter:blur layers,
 * each masked to a narrow linear-gradient band, with blur increasing along a
 * curve toward the chosen edge — so content near a section's edge progressively
 * MELTS instead of hard-cutting.
 *
 * The band is decorative and inert: pointer-events:none, aria-hidden, no motion
 * (it is a static overlay — safe for prefers-reduced-motion). backdrop-filter
 * stacks are GPU-costly, so consumers cap divCount on mobile (v2.css hides the
 * heaviest layers below 768px). It blurs only the backdrop painted BEHIND it in
 * its own stacking context, so text layered above (a CTA, a heading) stays crisp.
 */
import { useMemo, type CSSProperties } from "react"

type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out"

/* same curve set the original ships; "bezier" is the smoothstep the demo defaults toward */
const CURVES: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
}

export type GradualBlurProps = {
  /** which edge the blur intensifies toward (band sits on that edge) */
  position?: "top" | "bottom"
  /** band thickness — any CSS length (e.g. "12svh", "160px") */
  height?: string
  /** blur multiplier (2–3 reads as a soft dissolve) */
  strength?: number
  /** number of stacked backdrop-filter layers (6–8 desktop) */
  divCount?: number
  /** progression of the blur ramp toward the edge */
  curve?: Curve
  /** exponential (true) ramps the last layers much harder — a deeper melt */
  exponential?: boolean
  opacity?: number
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export function GradualBlur({
  position = "bottom",
  height = "6rem",
  strength = 2,
  divCount = 5,
  curve = "bezier",
  exponential = false,
  opacity = 1,
  zIndex = 1,
  className,
  style,
}: GradualBlurProps) {
  const layers = useMemo(() => {
    const inc = 100 / divCount
    const dir = position === "top" ? "to top" : "to bottom"
    const curveFn = CURVES[curve] ?? CURVES.linear
    const out: CSSProperties[] = []
    for (let i = 1; i <= divCount; i++) {
      const p = curveFn(i / divCount)
      const blur = exponential
        ? Math.pow(2, p * 4) * 0.0625 * strength
        : 0.0625 * (p * divCount + 1) * strength
      // each layer is a sliding black window over an otherwise-transparent mask,
      // so only its slice contributes its blur level — stacked, they ramp.
      const p1 = inc * (i - 1)
      const p2 = inc * i
      const p3 = inc * (i + 1)
      const p4 = inc * (i + 2)
      let stops = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) stops += `, black ${p3}%`
      if (p4 <= 100) stops += `, transparent ${p4}%`
      const mask = `linear-gradient(${dir}, ${stops})`
      out.push({
        position: "absolute",
        inset: 0,
        maskImage: mask,
        WebkitMaskImage: mask,
        backdropFilter: `blur(${blur.toFixed(3)}px)`,
        WebkitBackdropFilter: `blur(${blur.toFixed(3)}px)`,
        opacity,
      })
    }
    return out
  }, [position, strength, divCount, curve, exponential, opacity])

  const container: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height,
    zIndex,
    pointerEvents: "none",
    ...(position === "top" ? { top: 0 } : { bottom: 0 }),
    ...style,
  }

  return (
    <div className={`v2-gblur${className ? " " + className : ""}`} style={container} aria-hidden="true">
      {layers.map((s, i) => (
        <div key={i} style={s} />
      ))}
    </div>
  )
}
