"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroLoaderProps {
  onComplete: () => void
}

const THEME_COLORS = ["#96C1FF", "#7AFEA7", "#FFC973", "#FF9992"]

type Phase = "greeting" | "loader" | "split" | "complete"

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [phase, setPhase] = useState<Phase>("greeting")
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Phase 1: Greeting
  useEffect(() => {
    if (phase === "greeting") {
      // Hold for 0.8s, then fade out and transition to loader
      const timer = setTimeout(() => {
        setPhase("loader")
      }, 1800) // 0.8s fade in + 0.8s hold + 0.2s fade out

      return () => clearTimeout(timer)
    }
  }, [phase])

  // Phase 2: Staggered Progress Loader
  useEffect(() => {
    if (phase !== "loader") return

    let currentProgress = 0
    let timeoutId: NodeJS.Timeout

    const updateProgress = (target: number, duration: number, onComplete?: () => void) => {
      const startProgress = currentProgress
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progressRatio = Math.min(elapsed / duration, 1)
        
        // Ease out for smooth deceleration
        const eased = 1 - Math.pow(1 - progressRatio, 3)
        currentProgress = startProgress + (target - startProgress) * eased
        
        setProgress(Math.floor(currentProgress))

        if (progressRatio < 1) {
          timeoutId = setTimeout(animate, 16) // ~60fps
        } else {
          currentProgress = target
          setProgress(target)
          if (onComplete) onComplete()
        }
      }

      animate()
    }

    // Step 1: 0% -> 20% (Rapid burst)
    updateProgress(20, 300, () => {
      // Step 2: Pause for 400ms (Thinking)
      timeoutId = setTimeout(() => {
        // Step 3: 20% -> 45% (Fast burst)
        updateProgress(45, 400, () => {
          // Step 4: Pause for 300ms
          timeoutId = setTimeout(() => {
            // Step 5: 45% -> 70% (Slow, steady crawl)
            updateProgress(70, 1200, () => {
              // Step 6: Pause for 500ms
              timeoutId = setTimeout(() => {
                // Step 7: 70% -> 96% (Very fast burst)
                updateProgress(96, 400, () => {
                  // Step 8: 96% -> 100% (One number at a time)
                  const finalCount = () => {
                    if (currentProgress < 97) {
                      currentProgress = 97
                      setProgress(97)
                      timeoutId = setTimeout(finalCount, 150)
                    } else if (currentProgress < 98) {
                      currentProgress = 98
                      setProgress(98)
                      timeoutId = setTimeout(finalCount, 150)
                    } else if (currentProgress < 99) {
                      currentProgress = 99
                      setProgress(99)
                      timeoutId = setTimeout(finalCount, 150)
                    } else {
                      currentProgress = 100
                      setProgress(100)
                      // Trigger curtain split
                      setTimeout(() => {
                        setPhase("split")
                        setTimeout(() => {
                          setIsVisible(false)
                          onComplete()
                        }, 1000) // Match curtain split duration
                      }, 200)
                    }
                  }
                  finalCount()
                })
              }, 500)
            })
          }, 300)
        })
      }, 400)
    })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [phase, onComplete])

  // Calculate line width percentage
  const lineWidth = progress

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#1E1510" }}
        >
          {/* Curtain Split Animation - Top Half */}
          {phase === "split" && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "-100vh" }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-[#1E1510] origin-top"
              style={{ height: "50%", top: 0 }}
            />
          )}

          {/* Curtain Split Animation - Bottom Half */}
          {phase === "split" && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "100vh" }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-[#1E1510] origin-bottom"
              style={{ height: "50%", bottom: 0 }}
            />
          )}

          {/* Phase 1: Greeting */}
          {phase === "greeting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="font-mono text-4xl md:text-5xl"
              style={{ color: "#F3E3CE" }}
            >
              Hello.
            </motion.div>
          )}

          {/* Phase 2: Loader */}
          {phase === "loader" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-3/4 max-w-2xl"
            >
              {/* Slogan - Above the line */}
              <div
                className="text-sm uppercase tracking-widest mb-8 text-left w-full"
                style={{ color: "#F3E3CE", fontFamily: "var(--font-sans, sans-serif)" }}
              >
                ORCHESTRATING COMPLEXITY
              </div>

              {/* The Line */}
              <div className="relative w-full h-[2px] overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: lineWidth / 100 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  style={{
                    transformOrigin: "left",
                    height: "2px",
                    background: `linear-gradient(to right, ${THEME_COLORS.join(", ")})`,
                  }}
                  className="w-full"
                />
              </div>

              {/* Counter - Below the line, right-aligned */}
              <div
                className="font-mono text-2xl mt-6 text-right w-full"
                style={{ color: "#F3E3CE" }}
              >
                {String(progress).padStart(2, "0")}%
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

