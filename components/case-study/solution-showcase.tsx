"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface SolutionShowcaseProps {
  images: { src: string; alt: string }[]
  accentColor: string
}

export function SolutionShowcase({ images, accentColor }: SolutionShowcaseProps) {
  // Ensure we have at least 3 images, use placeholders if not
  const mainImage = images[0] || { src: "/final-design-mockup.jpg", alt: "Final design" }
  const sideImages = [
    images[1] || { src: "/design-detail-view.jpg", alt: "Detail 1" },
    images[2] || { src: "/design-component.jpg", alt: "Detail 2" },
  ]

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Main large image - spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-2 relative aspect-[4/3] rounded-xl overflow-hidden group"
        >
          <Image
            src={mainImage.src || "/placeholder.svg"}
            alt={mainImage.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{ backgroundColor: accentColor }}
          />
        </motion.div>

        {/* Side stacked images */}
        <div className="flex flex-col gap-4">
          {sideImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group"
            >
              <Image
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: accentColor }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
