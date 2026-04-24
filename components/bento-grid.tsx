"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { getProjectUrl } from "@/lib/projects"
import { useTransition as usePageTransition } from "@/lib/transition-context"

const PROJECT_COLORS: Record<string, string> = {
  skya: "#E692FF", // Purple
  nuzzle: "#7AFEA7", // Green
  "eau-de-toi": "#96C1FF", // Blue
}

const selectedProjects = [
  {
    id: "skya",
    title: "Skya",
    tags: ["Systems Thinking", "Mobility"],
    year: "2025",
    image: "/image/skya/sliderphoto.webp",
  },
  {
    id: "nuzzle",
    title: "Nuzzle",
    tags: ["Service Design", "Social Impact"],
    year: "2025",
    image: "/image/Nuzzle/sliderphoto.webp",
  },
  {
    id: "eau-de-toi",
    title: "Eau De Toi",
    tags: ["Phygital Experience", "Retail Tech"],
    year: "2025",
    image: "/image/eaudetoi/image/edthome01.webp",
  },
]

export function BentoGrid() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  // Touch / no-hover devices (phones, most tablets) should always show cards at full brightness,
  // since the dimmed "idle" state relies on being revealed by hover.
  const [canHover, setCanHover] = useState(true)
  const { navigate } = usePageTransition()

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)")
    setCanHover(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return (
    <section
      id="work"
      className="border-t-section pt-40 md:pt-56 pb-32 md:pb-40 w-full px-6 md:px-8 lg:px-24 relative"
    >
      <div className="w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 md:mb-10"
        >
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">Selected Work</span>
        </motion.div>

        <div
          className="flex flex-col md:flex-row gap-2 md:gap-3 md:h-[640px] lg:h-[720px]"
          onMouseLeave={() => setHoveredProject(null)}
        >
          {selectedProjects.map((project, index) => {
            const projectColor = PROJECT_COLORS[project.id] || "#7AFEA7"
            const isHovered = hoveredProject === project.id
            // On touch devices there is no hover, so treat every card as "active"
            // (full brightness, accent bar revealed). Flex-grow stays neutral since
            // mobile uses a stacked column layout.
            const isActive = !canHover || isHovered

            const href = getProjectUrl(project.id)
            return (
              <Link
                key={project.id}
                href={href}
                onClick={(e) => {
                  // Intercept for the curtain wipe in the project's accent color.
                  // Skip modifier-clicks so cmd/ctrl/middle-click still open in a new tab.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                  e.preventDefault()
                  navigate(href, { transition: "curtain", accentColor: projectColor })
                }}
                data-cursor-hover
                data-cursor-color={projectColor}
                onMouseEnter={() => setHoveredProject(project.id)}
                className="relative overflow-hidden rounded-xl group w-full aspect-[4/5] md:w-auto md:aspect-auto md:h-full transition-[flex-grow,box-shadow] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  flexGrow: canHover ? (isHovered ? 2.6 : 1) : 1,
                  flexBasis: 0,
                  boxShadow: isHovered
                    ? "0 20px 40px -20px rgba(0,0,0,0.5)"
                    : "0 0 0 0 rgba(0,0,0,0)",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-[1.04]"
                  style={{
                    filter: isActive
                      ? "brightness(1) saturate(1)"
                      : "brightness(0.55) saturate(0.8)",
                  }}
                  sizes="(min-width: 1024px) 45vw, (min-width: 768px) 33vw, 100vw"
                  priority={index < 2}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0) 100%)",
                  }}
                />

                <div
                  className="absolute left-0 right-0 bottom-0 pointer-events-none transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    height: "8px",
                    backgroundColor: projectColor,
                    transform: isActive ? "translateY(0)" : "translateY(100%)",
                  }}
                />

                <div className="absolute inset-0 p-6 md:p-7 lg:p-9 flex flex-col justify-end text-white">
                  <motion.div
                    animate={{ y: isHovered ? -4 : 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <h3
                      className="font-sans font-semibold tracking-tight text-white text-4xl md:text-5xl lg:text-6xl leading-[0.95] mb-3 md:mb-4"
                      style={{
                        textShadow: "0 2px 24px rgba(0,0,0,0.55)",
                      }}
                    >
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] font-mono">
                      {project.tags.map((tag, i) => (
                        <span key={tag} className="flex items-center gap-3">
                          <span
                            className="transition-colors duration-500"
                            style={{
                              color: isActive ? projectColor : "rgba(255,255,255,0.8)",
                            }}
                          >
                            {tag}
                          </span>
                          {i < project.tags.length - 1 && <span className="opacity-40">/</span>}
                        </span>
                      ))}
                      <span
                        className="ml-auto transition-colors duration-500"
                        style={{
                          color: isActive ? projectColor : "rgba(255,255,255,0.6)",
                        }}
                      >
                        {project.year}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
