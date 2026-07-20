"use client"

import { motion } from "framer-motion"

interface OutcomeImage {
  src: string
  alt: string
}

interface OutcomePreviewProps {
  images: OutcomeImage[]
  accentColor?: string
}

export function OutcomePreview({ images, accentColor = "#7AFEA7" }: OutcomePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">The Solution</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {images.slice(0, 2).map((image, index) => (
          <motion.div
            key={image.src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="aspect-[16/10] bg-muted rounded-xl overflow-hidden"
            style={{
              boxShadow: `0 0 40px ${accentColor}10`,
            }}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
