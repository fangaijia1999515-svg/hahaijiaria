"use client"

/**
 * V2 MOTION — the GSAP-driven pieces that lift the sections below the hero to
 * its level. Everything here:
 *   - rides the site-wide Lenis clock (ScrollTrigger.update is called on every
 *     Lenis frame in components/smooth-scroll.tsx — one clock, no drift),
 *   - uses the shared "v2Out" ease which is EXACTLY the --ds-ease-out token,
 *   - is ONE-SHOT (once:true) so scrolling up/down never re-triggers or jitters,
 *   - fully disables under prefers-reduced-motion (early return leaves the DOM
 *     in its natural, fully-visible state; nothing is hidden in CSS first, so
 *     no-JS and reduced-motion users always see complete content).
 *
 * Durations sit inside her token band (roughly 0.6s-0.9s -> 300-900ms).
 */
import {
  createElement,
  useRef,
  type ElementType,
  type ReactNode,
} from "react"
import { gsap, useGSAP, SplitText, V2_EASE } from "@/lib/gsap"

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/* ---------------------------------------------------------------------------
   RevealLines — silky serif reveal, line by line (mask + translateY per line).
   SplitText wraps each visual line in its own clipping mask; the inner line
   slides up from under it, softly staggered. Used for the About pull-line and
   the Contact closing line. Renders plain text server-side (SEO / no-JS safe).
--------------------------------------------------------------------------- */
export function RevealLines({
  children,
  as: Tag = "h2",
  className,
  stagger = 0.09,
  delay = 0,
  start = "top 84%",
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  stagger?: number
  delay?: number
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReduced()) return

      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "v2-splitline",
      })

      gsap.from(split.lines, {
        yPercent: 118,
        duration: 0.8,
        ease: V2_EASE,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      })

      return () => split.revert()
    },
    { scope: ref },
  )

  // createElement sidesteps polymorphic-JSX inference churn across
  // @types/react versions (the <Tag ref> form resolves children to never)
  return createElement(Tag, { ref, className }, children)
}

/* ---------------------------------------------------------------------------
   ScrollBrighten — monolog's paragraph treatment (from her reference recording):
   the words start faint and darken one after another as the scroll passes
   through the paragraph. Scrubbed, so it moves WITH the reader, never at them.
   Reduced-motion / no-JS: the paragraph is simply fully visible.
--------------------------------------------------------------------------- */
export function ScrollBrighten({
  children,
  as: Tag = "p",
  className,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReduced()) return

      const split = SplitText.create(el, { type: "words" })
      gsap.set(split.words, { opacity: 0.24 })
      gsap.to(split.words, {
        opacity: 1,
        ease: "none",
        stagger: 0.35,
        scrollTrigger: { trigger: el, start: "top 84%", end: "top 42%", scrub: 0.6 },
      })

      return () => split.revert()
    },
    { scope: ref },
  )

  // createElement sidesteps polymorphic-JSX inference churn across
  // @types/react versions (the <Tag ref> form resolves children to never)
  return createElement(Tag, { ref, className }, children)
}
