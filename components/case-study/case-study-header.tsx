"use client"

import { motion } from "framer-motion"

interface CaseStudyHeaderProps {
  title: string
  subtitle?: string
  oneLiner?: string
  accentColor?: string
}

export function CaseStudyHeader({
  title,
  subtitle,
  oneLiner,
  accentColor = "#3D4A3A", // ds forest green (--ds-accent)
}: CaseStudyHeaderProps) {
  return (
    <header className="pt-32 pb-2 px-6 md:px-12 lg:px-24">
      <div className="w-full">
        <motion.h1
          initial={{ opacity: 1, y: 0 }}
          className="classic-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-3 text-[var(--cl-ink)]"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 1, y: 0 }}
            className="classic-display text-2xl md:text-3xl lg:text-4xl tracking-tight text-[var(--cl-ink)] mb-4"
          >
            {subtitle}
          </motion.p>
        )}

        {oneLiner && (
          <motion.p
            initial={{ opacity: 1, y: 0 }}
            className="text-base md:text-lg lg:text-xl leading-tight max-w-3xl text-[var(--cl-text-muted)]"
          >
            {oneLiner}
          </motion.p>
        )}
      </div>
    </header>
  )
}
