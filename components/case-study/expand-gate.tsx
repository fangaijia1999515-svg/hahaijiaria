"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface ExpandGateProps {
  isExpanded: boolean
  onToggle: () => void
  accentColor?: string
}

export function ExpandGate({ isExpanded, onToggle, accentColor = "#7AFEA7" }: ExpandGateProps) {
  return (
    <div className="relative">
      {/* Gradient mask that fades content */}
      {!isExpanded && (
        <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#1E1510] pointer-events-none" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center py-8"
      >
        <button
          onClick={onToggle}
          className="group flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: `1px solid ${accentColor}50`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accentColor
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"
            e.currentTarget.style.boxShadow = `0 4px 32px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.15)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${accentColor}50`
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"
            e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
          }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/90">
            {isExpanded ? "Collapse" : "Explore Process"}
          </span>
          <motion.div
            animate={{
              rotate: isExpanded ? 180 : 0,
              y: isExpanded ? 0 : [0, 3, 0],
            }}
            transition={{
              rotate: { duration: 0.3 },
              y: { duration: 1.2, repeat: isExpanded ? 0 : Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: accentColor }} />
          </motion.div>
        </button>
      </motion.div>
    </div>
  )
}
