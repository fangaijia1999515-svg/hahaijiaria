"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroBlurProps {
  onComplete: () => void
}

const THEME_COLORS = ["#96C1FF", "#7AFEA7", "#FFC973", "#FF9992"]

export function IntroBlur({ onComplete }: IntroBlurProps) {
  const [isVisible, setIsVisible] = useState(true)
  const timeRef = useRef(0)

  useEffect(() => {
    // Auto-complete after 3 seconds of clarity
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 6000) // 3s animation + 3s clarity = 6s total

    return () => clearTimeout(timer)
  }, [onComplete])

  // Animation loop for moving orbs
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.01
      requestAnimationFrame(animate)
    }
    animate()
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
          {/* Moving gradient orbs background */}
          <div className="absolute inset-0 overflow-hidden">
            {THEME_COLORS.map((color, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full"
                style={{
                  width: "40%",
                  height: "40%",
                  background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                  filter: "blur(80px)",
                }}
                animate={{
                  x: [
                    Math.sin(timeRef.current + index) * 100,
                    Math.cos(timeRef.current * 0.7 + index) * 150,
                    Math.sin(timeRef.current * 0.5 + index) * 100,
                  ],
                  y: [
                    Math.cos(timeRef.current + index) * 100,
                    Math.sin(timeRef.current * 0.7 + index) * 150,
                    Math.cos(timeRef.current * 0.5 + index) * 100,
                  ],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8 + index * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.h1
            initial={{
              filter: "blur(20px)",
              letterSpacing: "0.5em",
              opacity: 0.3,
            }}
            animate={{
              filter: "blur(0px)",
              letterSpacing: "0.1em",
              opacity: 1,
            }}
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
            className="text-6xl md:text-8xl font-black text-center z-10"
            style={{
              color: "#F3E3CE",
              fontFamily: "var(--font-display)",
            }}
          >
            ORCHESTRATING COMPLEXITY
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

