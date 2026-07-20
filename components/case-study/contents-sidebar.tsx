"use client"

import { useEffect, useState } from "react"

interface ContentsSidebarProps {
  accentColor: string
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "solution", label: "Solution" },
  { id: "blueprint", label: "Blueprint" },
  { id: "process", label: "Process" },
]

export function ContentsSidebar({ accentColor }: ContentsSidebarProps) {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            })
          },
          { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="sticky top-24 hidden lg:block">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A89080] mb-6">Contents</p>
      <nav className="flex flex-col gap-3">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="group flex items-center gap-3 text-left transition-colors duration-200"
            >
              {/* Active indicator line */}
              <span
                className="w-4 h-px transition-all duration-200"
                style={{
                  backgroundColor: isActive ? accentColor : "transparent",
                  width: isActive ? "16px" : "0px",
                }}
              />
              <span
                className="text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-200"
                style={{
                  color: isActive ? accentColor : "#A89080",
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
