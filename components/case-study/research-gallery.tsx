"use client"

import { motion } from "framer-motion"

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface ResearchGalleryProps {
  title?: string
  images: GalleryImage[]
}

export function ResearchGallery({ title = "Research & Discovery", images }: ResearchGalleryProps) {
  return (
    <section className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>

        {/* Bento grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {image.caption && (
                <div className="p-3 bg-black/50 backdrop-blur-sm">
                  <p className="text-xs text-white/80">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
