"use client"

import { motion } from "framer-motion"

interface KeyInsightProps {
  quote?: string
  stat?: string
  statLabel?: string
  accentColor: string
}

export function KeyInsight({ quote, stat, statLabel, accentColor }: KeyInsightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 p-8 rounded-xl bg-white/[0.03]"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {quote && (
        <blockquote className="text-xl md:text-2xl italic text-[#F2F0E9] leading-relaxed mb-4">"{quote}"</blockquote>
      )}
      {stat && (
        <div className="flex items-baseline gap-4">
          <span className="text-5xl md:text-6xl font-black" style={{ color: accentColor }}>
            {stat}
          </span>
          {statLabel && <span className="text-sm uppercase tracking-[0.15em] text-[#A89080]">{statLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}
