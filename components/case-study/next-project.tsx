"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProjectThemeColor } from "@/lib/projects"
import { useTransition as usePageTransition } from "@/lib/transition-context"

interface NextProjectProps {
  title: string
  href: string
  image: string
}

export function NextProject({ title, href, image }: NextProjectProps) {
  const projectId = href.split("/").pop() || ""
  const nextProjectColor = getProjectThemeColor(projectId)
  const { navigate } = usePageTransition()

  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href, { transition: "curtain", accentColor: nextProjectColor })
  }

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-end text-right mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">Next Project</p>
          <Link
            href={href}
            onClick={handleClick}
            className="group inline-flex items-center gap-3"
            data-cursor-hover
            data-cursor-color={nextProjectColor}
          >
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-semibold transition-colors"
              style={{ color: nextProjectColor }}
            >
              {title}
            </h3>
            <ArrowRight
              className="w-6 h-6 transform group-hover:translate-x-2 transition-all"
              style={{ color: nextProjectColor }}
            />
          </Link>
        </div>

        <Link
          href={href}
          onClick={handleClick}
          className="group block"
          data-cursor-hover
          data-cursor-color={nextProjectColor}
        >
          <div className="aspect-[21/9] bg-muted rounded-2xl overflow-hidden transition-all duration-500">
            <div
              className="w-full h-full relative"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 60px ${nextProjectColor}30`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0px transparent`
              }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
