"use client"

import { motion } from "framer-motion"

// 4 large blurred orbs that drift slowly behind content

const orbs = [
  {
    color: "#FFC973", // Yellow
    size: "40%",
    initialX: "10%",
    initialY: "20%",
  },
  {
    color: "#FF9992", // Pink
    size: "50%",
    initialX: "60%",
    initialY: "10%",
  },
  {
    color: "#7AFEA7", // Green
    size: "45%",
    initialX: "70%",
    initialY: "60%",
  },
  {
    color: "#96C1FF", // Blue
    size: "55%",
    initialX: "20%",
    initialY: "70%",
  },
]

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }} aria-hidden="true">
      {/* Base layer to ensure background color */}
      <div className="absolute inset-0 bg-[#1E1510]" />

      {/* Animated orbs */}
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.initialX,
            top: orb.initialY,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(100px)",
            opacity: 0.25,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25 + index * 5, // Staggered durations: 25s, 30s, 35s, 40s
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle overlay to blend orbs with base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, #1E1510 80%)",
        }}
      />
    </div>
  )
}
