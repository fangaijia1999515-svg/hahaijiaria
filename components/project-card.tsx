"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  href: string
  size?: "default" | "wide" | "tall"
  index: number
}

const accentColors = ["#7AFEA7", "#FFC973", "#FF9992", "#96C1FF"]

export function ProjectCard({ title, description, tags, image, href, size = "default", index }: ProjectCardProps) {
  const [hoverColor, setHoverColor] = useState(accentColors[0])

  const sizeClasses = {
    default: "col-span-1",
    wide: "col-span-1 md:col-span-2",
    tall: "col-span-1 row-span-2",
  }

  const handleMouseEnter = () => {
    const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)]
    setHoverColor(randomColor)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={sizeClasses[size]}
      onMouseEnter={handleMouseEnter}
    >
      <Link href={href} className="group block h-full">
        <div
          className={`relative overflow-hidden rounded-2xl bg-muted border-2 border-transparent transition-all duration-300 ${size === "tall" ? "h-full min-h-[400px]" : "aspect-[4/3]"}`}
          style={{
            borderColor: "transparent",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `0 0 30px ${hoverColor}40, 0 0 60px ${hoverColor}20, inset 0 0 20px ${hoverColor}10`,
              border: `2px solid ${hoverColor}`,
              borderRadius: "1rem",
            }}
          />
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 backdrop-blur-sm rounded-full text-background font-medium"
                  style={{ backgroundColor: accentColors[i % accentColors.length] }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3
            className="text-lg font-bold tracking-tight transition-colors"
            style={{ color: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}
