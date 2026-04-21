"use client"

import { useEffect, useState } from "react"

interface ContextSidebarProps {
  role: string
  timeline: string
  team?: string
  tools: string[]
  accentColor: string
  sections?: Array<{ id: string; label: string }>
}

const defaultSections = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "blueprint", label: "Blueprint" },
  { id: "design", label: "Design" },
  { id: "outcome", label: "Outcome" },
]

export function ContextSidebar({
  role,
  timeline,
  team,
  tools,
  accentColor,
  sections = defaultSections,
}: ContextSidebarProps) {
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
    if (id === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <aside className="hidden lg:block h-full flex flex-col relative pt-20">
      {/* BLOCK 1: Static Info (Scrolls away) */}
      <div className="space-y-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A89080] mb-1">Role</p>
          <p className="font-mono text-sm text-[#F2F0E9]">{role}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A89080] mb-1">Timeline</p>
          <p className="font-mono text-sm text-[#F2F0E9]">{timeline}</p>
        </div>
        {team && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A89080] mb-1">Team</p>
            <p className="font-mono text-sm text-[#F2F0E9]">{team}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A89080] mb-1">Tools</p>
          <p className="font-mono text-sm text-[#F2F0E9]">{tools.join(" · ")}</p>
        </div>
      </div>

      {/* BLOCK 2: Sticky Wrapper (Sticks!) */}
      <div className="sticky top-32" id="sidebar-contents">
        {/* Divider Line */}
        <div className="w-8 h-px bg-white/10 mb-6" />

      {/* Table of Contents */}
      <nav className="flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A89080] mb-2">Contents</p>
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              data-cursor-hover
              data-cursor-color={accentColor}
              className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-200 hover:bg-white/5 hover:opacity-90"
            >
              {/* Active indicator line */}
              <span
                className="h-px transition-all duration-200"
                style={{
                  backgroundColor: isActive ? accentColor : "transparent",
                  width: isActive ? "16px" : "0px",
                }}
              />
              <span
                className="text-xs uppercase tracking-[0.15em] transition-colors duration-200"
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
    </aside>
  )
}
