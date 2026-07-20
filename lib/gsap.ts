"use client"

/**
 * Single GSAP entry point. Registers ScrollTrigger (and the useGSAP helper) once,
 * on the client only, so every component imports the SAME registered instance.
 *
 * ScrollTrigger reads the real window scroll position, which Lenis drives; the
 * `SmoothScroll` provider also calls `ScrollTrigger.update` on every Lenis frame
 * so scrubbed/triggered animations stay perfectly in lock-step with the momentum
 * scroll (no drift, one clock).
 *
 * SplitText (line masking for serif reveals) and CustomEase are bonus plugins
 * that ship free in the public gsap package (>=3.13). We register them here and
 * publish one shared ease, "v2Out", that is EXACTLY the design token
 * --ds-ease-out cubic-bezier(0.16, 1, 0.3, 1) so JS-driven motion matches the
 * CSS reveal cadence used everywhere else.
 */
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { CustomEase } from "gsap/CustomEase"
import { useGSAP } from "@gsap/react"

/** Shared ease name — reference as `ease: V2_EASE` once registered client-side. */
export const V2_EASE = "v2Out"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)
  // cubic-bezier(0.16, 1, 0.3, 1) === --ds-ease-out, as an SVG cubic path.
  // Module scope runs once per client session, so this defines "v2Out" once.
  CustomEase.create(V2_EASE, "M0,0 C0.16,1,0.3,1,1,1")
}

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP }
