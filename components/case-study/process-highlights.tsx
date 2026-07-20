"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface HighlightCard {
  type: "quote" | "stat" | "image"
  content: string
  label?: string
  image?: string
}

interface ProcessHighlightsProps {
  highlights: HighlightCard[]
  accentColor: string
}

export function ProcessHighlights({ highlights, accentColor }: ProcessHighlightsProps) {
  // Default highlights if none provided
  const defaultHighlights: HighlightCard[] = [
    { type: "quote", content: '"The current system feels like navigating a maze blindfolded."', label: "User Insight" },
    { type: "stat", content: "32", label: "Stakeholder Interviews" },
    { type: "image", content: "Stakeholder Map", image: "/stakeholder-personas-service-design-cards.jpg" },
    { type: "stat", content: "15", label: "Touchpoints Mapped" },
  ]

  const cards = highlights.length > 0 ? highlights : defaultHighlights

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden aspect-square flex flex-col justify-end p-6 group"
          >
            {/* Image background for image type */}
            {card.type === "image" && card.image && (
              <Image
                src={card.image || "/placeholder.svg"}
                alt={card.content}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
            )}

            {/* Content */}
            <div className="relative z-10">
              {card.type === "quote" && (
                <p className="text-lg md:text-xl font-medium text-[#F2F0E9] italic leading-snug">{card.content}</p>
              )}

              {card.type === "stat" && (
                <p className="text-5xl md:text-6xl font-black" style={{ color: accentColor }}>
                  {card.content}
                </p>
              )}

              {card.type === "image" && <p className="text-lg font-semibold text-[#F2F0E9]">{card.content}</p>}

              {card.label && <p className="mt-2 text-sm uppercase tracking-wider text-[#A89080]">{card.label}</p>}
            </div>

            {/* Hover accent overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              style={{ backgroundColor: accentColor }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
