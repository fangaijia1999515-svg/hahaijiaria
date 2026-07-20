"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/**
 * KINETIC BAND — a trionn-style chapter break. The site's concept, ORGANIC ×
 * DIGITAL, set huge and slid horizontally as you scroll past, with "+"
 * registration marks between the words. It is not decoration: the band literally
 * spells the idea the whole page is built on, and the sideways drift turns the
 * boundary between two sections into a deliberate moment instead of a seam.
 *
 * The translate is linked to the page scroll (framer useScroll reads the same
 * window position Lenis drives — one clock), so it glides with the momentum.
 * PERF: a single transformed row (GPU). Under prefers-reduced-motion it sits
 * still, perfectly centred, and simply reads as a concept line.
 */

const UNIT = ["ORGANIC", "DIGITAL"]

function Plus() {
  return (
    <span
      aria-hidden
      className="mx-[clamp(20px,3vw,56px)] inline-block translate-y-[-0.12em] align-middle font-mono text-[clamp(14px,1.4vw,22px)] font-normal"
      style={{ color: "var(--accent)" }}
    >
      +
    </span>
  )
}

export function KineticBand() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start end", "end start"],
  })
  // slide the row left as the band travels through the viewport
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-32%"])

  // enough repeats to keep the row full-bleed across the whole drift
  const words = Array.from({ length: 6 }).flatMap(() => UNIT)

  return (
    <section
      ref={root}
      aria-label="Concept: Organic times Digital"
      className="border-y-section relative w-full overflow-hidden bg-[var(--bg-primary)] py-[clamp(40px,7vh,84px)]"
    >
      <motion.div
        style={reduced ? undefined : { x }}
        className="flex w-max flex-nowrap items-center whitespace-nowrap will-change-transform"
      >
        {words.map((w, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="font-display text-[clamp(48px,11vw,150px)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]"
              style={{
                color: w === "DIGITAL" ? "var(--accent)" : "var(--cream)",
                opacity: w === "DIGITAL" ? 1 : 0.9,
              }}
            >
              {w}
            </span>
            <Plus />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
