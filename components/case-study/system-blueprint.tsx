"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ZoomableImage } from "@/components/zoomable-image"

interface SystemBlueprintProps {
  image: string
  alt?: string
  accentColor: string
}

export function SystemBlueprint({ image, alt = "Service Blueprint", accentColor }: SystemBlueprintProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative bg-white/[0.03] rounded-2xl shadow-lg overflow-hidden"
      >
        <ZoomableImage
          src={image || "/placeholder.svg"}
          alt={alt}
          cursorColor={accentColor}
        >
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="relative w-full">
              <Image
                src={image || "/placeholder.svg"}
                alt={alt}
                width={1920}
                height={640}
                className="w-full h-auto"
              />
            </div>
          </div>
        </ZoomableImage>
      </motion.div>
    </div>
  )
}
