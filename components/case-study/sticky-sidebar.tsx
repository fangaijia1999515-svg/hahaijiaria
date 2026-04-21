"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Section {
  id: string
  label: string
}

interface StickySidebarProps {
  sections: Section[]
  accentColor?: string // Add accent color prop
}

export function StickySidebar({ sections, accentColor = "#7AFEA7" }: StickySidebarProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="hidden lg:block sticky top-32 h-fit"
    >
      <nav className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Contents</p>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left py-2 px-4 text-sm rounded-lg transition-all ${
              activeSection === section.id
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            style={
              activeSection === section.id
                ? {
                    backgroundColor: `${accentColor}20`,
                    borderLeft: `2px solid ${accentColor}`,
                  }
                : undefined
            }
          >
            {section.label}
          </button>
        ))}
      </nav>
    </motion.aside>
  )
}
