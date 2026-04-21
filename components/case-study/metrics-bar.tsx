"use client"

import { motion } from "framer-motion"

interface Metric {
  value: string
  label: string
}

interface MetricsBarProps {
  metrics: Metric[]
  accentColor?: string
}

export function MetricsBar({ metrics, accentColor = "#7AFEA7" }: MetricsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 py-8 border-y-section"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center md:text-left"
        >
          <p className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight" style={{ color: accentColor }}>
            {metric.value}
          </p>
          <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mt-2">{metric.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
