"use client"
/**
 * NAV LENS FILTER — TRUE backdrop refraction (2026-07-17, replaces the TIER-2
 * LensVeil canvas).
 *
 * Her verdict on the old canvas: "根本没有折射…它只能透到最后一层的东西" — correct.
 * The LensVeil canvas re-rendered the BACKGROUND shader (veil-new, the bottom
 * layer) and painted it opaque inside the pill, so page content between the veil
 * and the pill (the purple Skya hero, the green Nuzzle hero, cards) was invisible
 * to it AND the opaque canvas occluded the real backdrop. Zero real refraction.
 *
 * THE FIX — refract the TRUE compositor backdrop with an SVG displacement filter:
 *   backdrop-filter: url(#lens-filter)
 * feImage(Snell displacement map) → feDisplacementMap(R=x,G=y) with chromatic
 * aberration → feGaussianBlur. This bends WHATEVER is actually painted behind the
 * pill — the purple/green hero included — because backdrop-filter samples the live
 * backdrop, not a shader copy.
 *
 * DISPLACEMENT MAP — real optics, not painted gradients (physics per her tutorial):
 * the pill is a capsule-shaped glass dome (flat centre, edge curving down into a
 * thin ring). Per pixel we take the rounded-rect signed distance, derive depth in
 * from the rim, model the dome slope, refract a vertical ray by Snell's law at
 * IOR 1.5, and write the lateral bend along the SDF's outward normal (nx,ny):
 *   slope  = (1-x)^3 / (1-(1-x)^4)^0.75      // x = 0 rim … 1 flat centre
 *   bend   = sin(atan(slope) - asin(sin(atan(slope))/1.5))
 *   R = 128 + nx*bend*gain ;  G = 128 + ny*bend*gain   // 128 = neutral, no shift
 * Flat centre → zero slope → crisp; ALL bending concentrates at the rim and peaks
 * at the rounded ENDS (where nx and ny both fire) = real thick glass. Generated at
 * the pill's measured aspect on a canvas, re-generated on resize.
 *
 * Browser reality: backdrop-filter + url() SVG filters is CHROMIUM ONLY. We gate
 * with a runtime computed-style probe (NOT @supports, which lies for url()) AND a
 * Chromium UA guard (WebKit round-trips the value in CSSOM but never renders it).
 * On pass we tag the glass wrappers `.lg-refract` AND inject the refraction rule as
 * a runtime <style> — Next's CSS minifier (lightningcss) mangles a build-processed
 * `backdrop-filter: url()` (drops the standard prop → computes to none), and a
 * runtime <style> is never minified. The rule is @media ≥901px so mobile keeps the
 * plain blur fallback; Safari/Firefox keep tier-1 too.
 */
import { useEffect, useRef, useState } from "react"

const FILTER_ID = "lens-filter"
const REFRACT_STYLE_ID = "lg-refract-style"

/* Filter/feImage region margins (fraction of the pill box) — headroom so the rim's
 * outward pulls sample REAL backdrop just outside the pill, not a clamped edge. The
 * map is generated at exactly (1+2·MX)×(1+2·MY) of the pill with the capsule
 * centred, so under preserveAspectRatio="none" the capsule rim lands on the box. */
const MX = 0.12
const MY = 0.1
const REGION = { x: `${-MX * 100}%`, y: `${-MY * 100}%`, w: `${(1 + 2 * MX) * 100}%`, h: `${(1 + 2 * MY) * 100}%` }

/* The refraction rule, injected at RUNTIME (see the effect) rather than written to
 * lab-demo.css: lightningcss mangles a build-processed backdrop-filter:url(). Notes:
 *   · !important — the shared Navigation <header> has no backdrop-filter of its own
 *     and a higher-specificity utility resolves it to `none`; !important is the only
 *     reliable win (verified live).
 *   · saturate() is a LITERAL per stage, never var() — Chromium drops a url()+var()
 *     backdrop-filter list at parse. Light = tier-1's 1.66; dark = 1.42.
 *   · @media ≥901px keeps mobile on the blur fallback. */
const REFRACT_CSS = `
@media (min-width:901px){
  .lab-glass-nav.lg-refract header.fixed.top-0{
    backdrop-filter:url(#${FILTER_ID}) saturate(1.66) brightness(1.02)!important;
    -webkit-backdrop-filter:url(#${FILTER_ID}) saturate(1.66) brightness(1.02)!important;
  }
  .lab-glass-nav.lg-refract .classic-stage-dark header.fixed.top-0{
    backdrop-filter:url(#${FILTER_ID}) saturate(1.42) brightness(1.05)!important;
    -webkit-backdrop-filter:url(#${FILTER_ID}) saturate(1.42) brightness(1.05)!important;
  }
}`

const LIVECARDS_STYLE_ID = "lg-livecards-style"

/* The cards' REAL backdrop blur, default-on (promoted 2026-07-19). The liquid
 * cards' build-time backdrop-filter is stripped by the minifier (same pathology
 * as the nav), so the calm-frost card register had silently shipped with NO
 * real blur; this injects the intended blur at runtime. */
const LIVECARDS_CSS = `
.lab-glass-cards .bg-\\[var\\(--cl-surface\\)\\],
.lab-glass-cards .bg-\\[var\\(--cl-surface-2\\)\\]{
  backdrop-filter:blur(14px) saturate(1.5)!important;
  -webkit-backdrop-filter:blur(14px) saturate(1.5)!important;
}`

/* Signed distance to a rounded rectangle (capsule when r = half-height). <0 inside. */
function sdRoundRect(px: number, py: number, hx: number, hy: number, r: number): number {
  const qx = Math.abs(px) - (hx - r)
  const qy = Math.abs(py) - (hy - r)
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const inside = Math.min(Math.max(qx, qy), 0)
  return outside + inside - r
}

/* Physics-based Snell displacement map at the pill's aspect. Returns a PNG data URI
 * (R = x-shift, G = y-shift, 128 = neutral). B is left neutral: the bright rim light
 * stays the CSS ::before meniscus (tier-1, unchanged). */
const GAIN = 150 // map amplitude: peak byte deviation ≈ GAIN·bend_max(≈0.75) ≈ 112
const IOR = 1.5
const RING_FRAC = 0.9 // dome ring depth as a fraction of half-height
function buildSnellMap(pillW: number, pillH: number): string {
  if (typeof document === "undefined") return ""
  // Scale down if the pill is very wide so generation stays cheap.
  const rawW = pillW * (1 + 2 * MX)
  const s = rawW > 1400 ? 1400 / rawW : 1
  const W = Math.max(8, Math.round(pillW * (1 + 2 * MX) * s))
  const H = Math.max(8, Math.round(pillH * (1 + 2 * MY) * s))
  const hx = (pillW * s) / 2
  const hy = (pillH * s) / 2
  const r = hy // fully rounded ends
  const ringPx = Math.max(1, hy * RING_FRAC)
  const cx = W / 2
  const cy = H / 2

  const cv = document.createElement("canvas")
  cv.width = W
  cv.height = H
  const ctx = cv.getContext("2d")
  if (!ctx) return ""
  const img = ctx.createImageData(W, H)
  const d = img.data
  const clampByte = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v)

  for (let y = 0; y < H; y++) {
    const py = y - cy
    for (let x = 0; x < W; x++) {
      const px = x - cx
      const i = (y * W + x) * 4
      let R = 128
      let G = 128
      const sd = sdRoundRect(px, py, hx, hy, r)
      if (sd < 0) {
        // depth in from the rim, 0 (edge) … 1 (flat centre)
        const depthX = Math.min(1, Math.max(1e-4, -sd / ringPx))
        const one = 1 - depthX
        const denom = Math.pow(1 - Math.pow(one, 4), 0.75)
        const slope = denom > 1e-6 ? Math.pow(one, 3) / denom : 1e6
        const thetaI = Math.atan(slope)
        const thetaT = Math.asin(Math.min(1, Math.sin(thetaI) / IOR))
        const bend = Math.sin(thetaI - thetaT) // 0 centre → ~0.75 rim
        // outward normal = normalized gradient of the SDF (points to increasing sd)
        let nx = sdRoundRect(px + 1, py, hx, hy, r) - sdRoundRect(px - 1, py, hx, hy, r)
        let ny = sdRoundRect(px, py + 1, hx, hy, r) - sdRoundRect(px, py - 1, hx, hy, r)
        const nl = Math.hypot(nx, ny) || 1
        nx /= nl
        ny /= nl
        R = clampByte(128 + nx * bend * GAIN)
        G = clampByte(128 + ny * bend * GAIN)
      }
      d[i] = R
      d[i + 1] = G
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return cv.toDataURL("image/png")
}

/* Chromium-only capability probe. Computed-style round-trip (per the architecture
 * brief) AND a positive Chromium UA gate so WebKit/Firefox — which either reject
 * url() in backdrop-filter or accept-but-never-render it — stay on the safe blur
 * fallback instead of losing all glass. */
function chromiumRefractsBackdrop(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false
  const ua = navigator.userAgent || ""
  const isChromium = /Chrome\/\d/.test(ua) || /Chromium\/\d/.test(ua) || /HeadlessChrome\/\d/.test(ua)
  if (!isChromium) return false
  const probe = document.createElement("div")
  probe.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none;"
  const val = `url(#${FILTER_ID})`
  probe.style.setProperty("backdrop-filter", val)
  probe.style.setProperty("-webkit-backdrop-filter", val)
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const round =
    /url\(/i.test(cs.backdropFilter || "") ||
    /url\(/i.test((cs as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || "")
  probe.remove()
  return round
}

export function NavLensFilter() {
  const [mapHref, setMapHref] = useState<string>("")
  const feImageRef = useRef<SVGFEImageElement>(null)

  useEffect(() => {
    let cancelled = false
    let lastKey = ""

    // Measure the pill and (re)generate the map at its exact aspect. The shared
    // header commits in the same tree; retry a few frames until it exists.
    const measureAndGen = (): boolean => {
      const pill = document.querySelector<HTMLElement>(".lab-glass-nav header.fixed.top-0")
      if (!pill) return false
      const r = pill.getBoundingClientRect()
      const w = Math.round(r.width)
      const h = Math.round(r.height)
      if (w < 4 || h < 4) return true
      const key = `${w}x${h}`
      if (key !== lastKey) {
        lastKey = key
        try {
          const href = buildSnellMap(w, h)
          if (href && !cancelled) setMapHref(href)
        } catch {
          /* canvas/toDataURL unavailable → refraction stays off (fallback blur) */
        }
      }
      return true
    }
    let tries = 0
    let raf = 0
    const tryMeasure = () => {
      if (measureAndGen() || tries++ > 30) return
      raf = requestAnimationFrame(tryMeasure)
    }
    tryMeasure()

    let resizeT = 0
    const onResize = () => {
      clearTimeout(resizeT)
      resizeT = window.setTimeout(measureAndGen, 160)
    }
    window.addEventListener("resize", onResize)

    // Probe + opt-in: if Chromium refracts, tag the glass wrappers AND inject
    // the runtime refraction <style> (@media ≥901px keeps mobile on blur).
    let added: Element[] = []
    let styleEl: HTMLStyleElement | null = null
    if (chromiumRefractsBackdrop()) {
      added = Array.from(document.querySelectorAll(".lab-glass-nav, .lab-glass-cards"))
      added.forEach((el) => el.classList.add("lg-refract"))
      if (!document.getElementById(REFRACT_STYLE_ID)) {
        styleEl = document.createElement("style")
        styleEl.id = REFRACT_STYLE_ID
        styleEl.textContent = REFRACT_CSS
        document.head.appendChild(styleEl)
      }
    }

    // the cards' real backdrop blur (default-on; minifier strips the build-time rule)
    let cardsStyleEl: HTMLStyleElement | null = null
    if (!document.getElementById(LIVECARDS_STYLE_ID)) {
      cardsStyleEl = document.createElement("style")
      cardsStyleEl.id = LIVECARDS_STYLE_ID
      cardsStyleEl.textContent = LIVECARDS_CSS
      document.head.appendChild(cardsStyleEl)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeT)
      window.removeEventListener("resize", onResize)
      added.forEach((el) => el.classList.remove("lg-refract"))
      styleEl?.remove()
      cardsStyleEl?.remove()
    }
  }, [])

  // Some Chromium builds want the feImage href set via the SVG attribute too.
  useEffect(() => {
    const fe = feImageRef.current
    if (fe && mapHref) fe.setAttribute("href", mapHref)
  }, [mapHref])

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <defs>
        {/* sRGB interpolation keeps map value 128 = exact neutral (linearRGB would
            shift neutral off 0.5 and warp the whole surface). */}
        <filter
          id={FILTER_ID}
          x={REGION.x}
          y={REGION.y}
          width={REGION.w}
          height={REGION.h}
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={feImageRef}
            href={mapHref || undefined}
            x={REGION.x}
            y={REGION.y}
            width={REGION.w}
            height={REGION.h}
            preserveAspectRatio="none"
            result="lensmap"
          />
          {/* Single Snell displacement — the physics map already concentrates all
              bend at the rim, so ONE gather reads as real thick glass. We dropped
              the 3-pass chromatic-aberration split (R/G/B at different scales): as a
              backdrop-filter on a position:fixed pill, the filter re-rasterizes on
              EVERY scroll frame, and 3 displacement gathers tanked it to ~8fps in
              software-GL. One gather keeps scroll smooth; the faint prismatic fringe
              was a whisper anyway. gain in the map + this scale set the bend depth. */}
          {/* scale reduced 46→30 (fix5, 2026-07-17): at 46 the ~20px peak rim
              displacement smeared HIGH-CONTRAST vertical edges (skya's dashed
              cream timeline column) into a hard bright STRIPE inside the pill.
              30 → ~13px peak bend: still visibly refracts the purple/green heroes
              at the rim, but the stripe collapses to a soft glow. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="lensmap"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
          {/* stdDeviation 2.4→3.2 (fix5): softens the refracted backdrop a touch
              more so any residual high-contrast edge reads as glow, not a band. */}
          <feGaussianBlur in="disp" stdDeviation="3.2" />
        </filter>
      </defs>
    </svg>
  )
}
