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
  accentColor = "#7AFEA7",
}: CaseStudyHeaderProps) {
  return (
    <header className="pt-32 pb-2 px-6 md:px-12 lg:px-24">
      <div className="w-full">
        <motion.h1
          initial={{ opacity: 1, y: 0 }}
          className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-3 text-white"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 1, y: 0 }}
            className="font-sans text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F2F0E9] mb-4"
          >
            {subtitle}
          </motion.p>
        )}

        {oneLiner && (
          <motion.p
            initial={{ opacity: 1, y: 0 }}
            className="text-base md:text-lg lg:text-xl leading-tight max-w-3xl text-[#A89080]"
          >
            {oneLiner}
          </motion.p>
        )}
      </div>
    </header>
  )
}
