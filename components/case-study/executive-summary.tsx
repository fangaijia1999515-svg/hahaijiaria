"use client"

import { motion } from "framer-motion"

interface ExecutiveSummaryProps {
  challenge: string
  approach: string
  outcome: string
  accentColor: string
}

export function ExecutiveSummary({ challenge, approach, outcome, accentColor }: ExecutiveSummaryProps) {
  const columns = [
    { title: "THE CHALLENGE", content: challenge },
    { title: "THE APPROACH", content: approach },
    { title: "THE OUTCOME", content: outcome },
  ]

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {columns.map((col, index) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
              {col.title}
            </h3>
            <p className="text-[#A89080] leading-relaxed text-base">{col.content}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
