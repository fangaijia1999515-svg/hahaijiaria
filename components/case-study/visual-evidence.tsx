"use client"

import { motion } from "framer-motion"

interface VisualEvidenceProps {
  images: { src: string; alt: string; caption?: string }[]
}

export function VisualEvidence({ images }: VisualEvidenceProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {images.map((image, index) => (
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="space-y-3"
        >
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          </div>
          {image.caption && <figcaption className="text-xs text-[#A89080] font-mono">{image.caption}</figcaption>}
        </motion.figure>
      ))}
    </div>
  )
}
