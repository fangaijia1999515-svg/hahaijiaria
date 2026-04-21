"use client"

import { motion } from "framer-motion"

interface MetricsRowProps {
  metrics: { value: string; label: string }[]
  accentColor?: string
}

export function MetricsRow({ metrics, accentColor = "#7AFEA7" }: MetricsRowProps) {
  if (!metrics || metrics.length === 0) return null

  return (
    <section className="py-16">
      <div className="grid grid-cols-3 gap-8 lg:gap-16">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            {/* Massive Number in Theme Color */}
            <p
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none"
              style={{ color: accentColor }}
            >
              {metric.value}
            </p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#F2F0E9]/50 mt-3">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
