"use client"

import { motion } from "framer-motion"

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface ProcessGalleryProps {
  title?: string
  images: GalleryImage[]
}

export function ProcessGallery({ title = "Process & Research", images }: ProcessGalleryProps) {
  return (
    <section id="strategy" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`rounded-xl overflow-hidden bg-muted ${index === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover aspect-square"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
