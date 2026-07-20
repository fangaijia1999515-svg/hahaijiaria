"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useChameleonColor } from "@/lib/chameleon-context"
import { ACCENT } from "@/lib/brand"

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Chameleon ambient. As each Work project scrolls into view it sets its
 * identity color on the shared ChameleonContext; this fixed layer lets that
 * color "escape" the card and bleed softly into the page canvas — two low-
 * opacity radial pools, not a flat wash. Subtle by design.
 *
 * The active color is also mirrored to `--page-accent` on <html> so other
 * elements (grid ticks, etc.) can ride the same value if they opt in.
 * GPU-only (opacity + background); fades to nothing when no project is active.
 */
export function ChameleonAmbient() {
  const { activeColor } = useChameleonColor()
  const on = Boolean(activeColor)
  const color = activeColor ?? ACCENT

  useEffect(() => {
    const root = document.documentElement
    if (activeColor) root.style.setProperty("--page-accent", activeColor)
    else root.style.removeProperty("--page-accent")
  }, [activeColor])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      initial={false}
      animate={{ opacity: on ? 1 : 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{
        background: `radial-gradient(60% 50% at 82% 18%, ${color}1f 0%, transparent 60%), radial-gradient(70% 55% at 12% 92%, ${color}1a 0%, transparent 62%)`,
      }}
    />
  )
}
