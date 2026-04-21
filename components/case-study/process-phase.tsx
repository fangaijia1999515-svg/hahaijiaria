"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface ProcessPhaseProps {
  phaseNumber: string
  title: string
  description: string
  insight: {
    value: string
    label: string
  }
  images: { src: string; alt: string }[]
  accentColor?: string
  reverse?: boolean
}

export function ProcessPhase({
  phaseNumber,
  title,
  description,
  insight,
  images,
  accentColor = "#7AFEA7",
  reverse = false,
}: ProcessPhaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* 2-Column Grid: Story + Visuals */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ${reverse ? "lg:flex-row-reverse" : ""}`}>
        {/* Part A: The Story */}
        <div className={`space-y-6 ${reverse ? "lg:order-2" : ""}`}>
          {/* Phase Number */}
          <span className="text-xs uppercase tracking-[0.3em] font-mono" style={{ color: accentColor }}>
            {phaseNumber}
          </span>

          {/* Phase Title */}
          <h3 className="text-3xl lg:text-4xl font-bold text-[#F2F0E9]">{title}</h3>

          {/* Description */}
          <p className="text-[#F2F0E9]/80 leading-relaxed max-w-2xl">{description}</p>

          {/* Insight Data Point */}
          <div className="border-t-section pt-4">
            <p className="text-4xl lg:text-5xl font-black tracking-tight" style={{ color: accentColor }}>
              {insight.value}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#F2F0E9]/50 mt-2">{insight.label}</p>
          </div>
        </div>

        {/* Part B: The Visuals */}
        <div className={`space-y-4 ${reverse ? "lg:order-1" : ""}`}>
          {images.slice(0, 2).map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
