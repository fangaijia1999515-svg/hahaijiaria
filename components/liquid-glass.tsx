"use client"

import type React from "react"
import { useEffect, useId, useState } from "react"

type LiquidGlassProps = {
  className?: string
  /** corner radius in px (match the surface it sits inside) */
  radius?: number
  /** gaussian blur applied to the backdrop, px */
  blur?: number
  /** displacement strength (refraction amount), px */
  scale?: number
  /** translucent body tint for legibility over busy content */
  tint?: string
  /** show the glass (fades out when false) */
  active?: boolean
}

/**
 * Liquid-glass surface — an SVG feDisplacementMap (organic fractal-noise warp)
 * piped into `backdrop-filter` for genuine refraction, the way Apple's "liquid
 * glass" and the 2025 creative-dev wave build it. SVG-referenced backdrop
 * filters only render in Chromium, so non-Chromium / reduced-motion users get
 * a clean layered-blur fallback instead. The noise seed is static (never
 * animated), so it's a one-time GPU filter with zero per-frame cost.
 */
export function LiquidGlass({
  className = "",
  radius = 0,
  blur = 5,
  scale = 14,
  tint = "rgba(12, 10, 8, 0.5)",
  active = true,
}: LiquidGlassProps) {
  const rawId = useId()
  const filterId = `liquid-glass-${rawId.replace(/:/g, "")}`
  const [supportsGlass, setSupportsGlass] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    // Chromium engine = the only one that applies SVG-referenced backdrop
    // filters. (Chrome / Edge / Opera / Brave all qualify; Firefox + Safari
    // do not.)
    const isChromium =
      /Chrome|Chromium|Edg|OPR/.test(ua) && !/Firefox|FxiOS/.test(ua)
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setSupportsGlass(isChromium && !reduced)
  }, [])

  const surfaceStyle: React.CSSProperties = {
    borderRadius: radius || undefined,
    backgroundColor: tint,
    opacity: active ? 1 : 0,
    transition: "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)",
    // top sheen + faint bottom edge — the rim light that sells "glass"
    boxShadow:
      "inset 0 1px 0 0 rgba(244, 236, 221, 0.12), inset 0 -1px 0 0 rgba(255, 255, 255, 0.04)",
    ...(supportsGlass
      ? {
          // refraction first, then blur + a touch of saturation lift
          backdropFilter: `url(#${filterId}) blur(${blur}px) saturate(1.35)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(1.35)`,
        }
      : {
          // fallback: rich layered blur (Safari / Firefox / reduced motion)
          backdropFilter: "blur(16px) saturate(1.3)",
          WebkitBackdropFilter: "blur(16px) saturate(1.3)",
        }),
  }

  return (
    <div aria-hidden className={`pointer-events-none ${className}`} style={surfaceStyle}>
      {supportsGlass && (
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.013"
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.4" result="smoothNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothNoise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </div>
  )
}
