"use client"

import { motion } from "framer-motion"

interface OverviewSectionProps {
  challenge: string
  approach: string
  outcome: string
  accentColor?: string
}

export function OverviewSection({ challenge, approach, outcome, accentColor = "#7AFEA7" }: OverviewSectionProps) {
  const columns = [
    { label: "THE CHALLENGE", content: challenge },
    { label: "THE APPROACH", content: approach },
    { label: "THE OUTCOME", content: outcome },
  ]

  return (
    <section id="overview" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm uppercase tracking-[0.2em] mb-8" style={{ color: accentColor }}>
          01. Overview
        </h2>

        <div className="bg-white/[0.03] rounded-xl p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {columns.map((col, index) => (
              <div key={col.label} className={`${index > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""}`}>
                <h3
                  className="text-xs uppercase tracking-[0.2em] font-bold mb-4"
                  style={{ color: accentColor, opacity: 0.7 }}
                >
                  {col.label}
                </h3>
                <p className="text-[#F2F0E9]/80 leading-relaxed">{col.content}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
