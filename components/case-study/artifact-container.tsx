"use client"

import { motion } from "framer-motion"

interface ArtifactContainerProps {
  label: string
  imageSrc?: string
  imageAlt?: string
  caption?: string
  accentColor?: string // Add accent color prop
}

export function ArtifactContainer({
  label,
  imageSrc,
  imageAlt,
  caption,
  accentColor = "#7AFEA7",
}: ArtifactContainerProps) {
  return (
    <section id="blueprint" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-muted/50 rounded-2xl p-8 md:p-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
        </div>

        {imageSrc ? (
          <div className="bg-background rounded-xl overflow-hidden">
            <img src={imageSrc || "/placeholder.svg"} alt={imageAlt || label} className="w-full h-auto" />
          </div>
        ) : (
          <div
            className="bg-background rounded-xl aspect-[16/9] flex items-center justify-center border-2 border-dashed"
            style={{ borderColor: `${accentColor}40` }}
          >
            <div className="text-center">
              <p className="text-muted-foreground">Place Service Blueprint / Journey Map Image Here</p>
              <p className="text-sm text-muted-foreground/60 mt-2">Recommended size: 1920 x 1080px</p>
            </div>
          </div>
        )}

        {caption && <p className="text-sm text-muted-foreground mt-4 text-center">{caption}</p>}
      </motion.div>
    </section>
  )
}
