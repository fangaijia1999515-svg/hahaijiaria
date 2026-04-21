"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroMaskProps {
  onComplete: () => void
}

const THEME_COLORS = ["#96C1FF", "#7AFEA7", "#FFC973", "#FF9992"]

export function IntroMask({ onComplete }: IntroMaskProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState<"flow" | "zoom" | "fade">("flow")
  const [gradientPosition, setGradientPosition] = useState(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Phase 1: Flow (3s)
    const flowTimer = setTimeout(() => {
      setPhase("zoom")
    }, 3000)

    // Phase 2: Zoom (1.5s)
    const zoomTimer = setTimeout(() => {
      setPhase("fade")
    }, 4500)

    // Phase 3: Fade out (0.5s)
    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(flowTimer)
      clearTimeout(zoomTimer)
      clearTimeout(fadeTimer)
    }
  }, [onComplete])

  // Animation loop for gradient flow
  useEffect(() => {
    const animate = () => {
      setGradientPosition((prev) => (prev + 0.5) % 200)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#1E1510" }}
        >
          <motion.h1
            initial={{ scale: 1 }}
            animate={{
              scale: phase === "zoom" ? 3 : phase === "flow" ? 1.05 : 1,
            }}
            transition={{
              duration: phase === "zoom" ? 1.5 : 3,
              ease: "easeInOut",
            }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-center"
            style={{
              fontFamily: "var(--font-display)",
              background: `linear-gradient(90deg, ${THEME_COLORS[0]} 0%, ${THEME_COLORS[1]} 25%, ${THEME_COLORS[2]} 50%, ${THEME_COLORS[3]} 75%, ${THEME_COLORS[0]} 100%)`,
              backgroundSize: "200% 100%",
              backgroundPosition: `${gradientPosition}% 0%`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            ORCHESTRATING
            <br />
            COMPLEXITY
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

