"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface BlueprintViewerProps {
  label: string
  imageSrc?: string
  imageAlt?: string
  caption?: string
  accentColor?: string
}

export function BlueprintViewer({ label, imageSrc, imageAlt, caption, accentColor = "#7AFEA7" }: BlueprintViewerProps) {
  return (
    <section className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
          </div>
          {/* Scroll hint */}
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <span>Scroll to explore</span>
            <ArrowRight className="w-4 h-4" style={{ color: accentColor }} />
          </motion.div>
        </div>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-4">
          <div className="min-w-[1400px]">
            {imageSrc ? (
              <div className="bg-muted/30 rounded-xl overflow-hidden">
                <img src={imageSrc || "/placeholder.svg"} alt={imageAlt || label} className="w-full h-auto" />
              </div>
            ) : (
              <div
                className="bg-muted/30 rounded-xl aspect-[3/1] flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: `${accentColor}40` }}
              >
                <div className="text-center">
                  <p className="text-muted-foreground">Service Blueprint / Journey Map</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">Wide format: 2800 x 900px recommended</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {caption && <p className="text-sm text-muted-foreground text-center">{caption}</p>}
      </motion.div>
    </section>
  )
}
