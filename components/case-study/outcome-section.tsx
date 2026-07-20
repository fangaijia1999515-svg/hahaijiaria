"use client"

import { motion } from "framer-motion"

interface OutcomeImage {
  src: string
  alt: string
}

interface OutcomeSectionProps {
  title?: string
  description: string
  images: OutcomeImage[]
  metrics?: { label: string; value: string }[]
  accentColor?: string // Add accent color prop
}

export function OutcomeSection({
  title = "Outcome",
  description,
  images,
  metrics,
  accentColor = "#7AFEA7",
}: OutcomeSectionProps) {
  return (
    <section id="outcome" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">{title}</h2>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">{description}</p>

        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center p-6 bg-muted rounded-xl">
                <p className="text-3xl md:text-4xl font-medium" style={{ color: accentColor }}>
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl overflow-hidden bg-muted aspect-[4/3]"
            >
              <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
