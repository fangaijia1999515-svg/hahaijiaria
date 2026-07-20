"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { getProjectUrl } from "@/lib/projects"
import { useTransition as usePageTransition } from "@/lib/transition-context"
import { useChameleonColor } from "@/lib/chameleon-context"
import { ArrowCue } from "./arrow-cue"

const EASE = [0.22, 1, 0.36, 1] as const

type Project = {
  id: string
  title: string
  tags: string[]
  year: string
  image: string
  /**
   * Per-project identity color. Unified into the LILAC family (no more
   * purple / green / blue rainbow) so the page reads calm and on-brand: each
   * project gets a distinct tonal step of the accent, not a different hue.
   */
  color: string
  /** The real, concrete outcome, not a vague claim. */
  proof: string
  priority?: boolean // eager-load above-the-fold / LCP-candidate covers
}

const selectedProjects: Project[] = [
  {
    id: "skya",
    title: "Skya",
    tags: ["Systems Thinking", "Mobility"],
    year: "2025",
    image: "/image/skya/sliderphoto.webp",
    color: "#C9A2FF", // brand lilac (anchor)
    proof: "Drove the B2B2C→B2B pivot · $5.14M Y1 projected",
  },
  {
    id: "nuzzle",
    title: "Nuzzle",
    tags: ["Service Design", "Social Impact"],
    year: "2025",
    image: "/image/Nuzzle/sliderphoto.webp",
    color: "#E0BBFF", // lighter, airy lilac
    proof: "A service system for the 50% 30-day return cliff",
  },
  {
    id: "eau-de-toi",
    title: "Eau De Toi",
    tags: ["Experience Design", "Retail"],
    year: "2025",
    image: "/image/eaudetoi/image/edthome01.webp",
    color: "#AC9CFF", // deeper periwinkle lilac
    proof: "★ 2026 Indigo Design Awards · 2 Silver + Bronze",
    priority: true, // Next flagged this cover as an LCP candidate
  },
]

/**
 * Large, kinetic project title. Each word rides up from behind a mask as the
 * row enters the viewport, then shifts to the project's lilac on hover.
 */
function KineticTitle({ title }: { title: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })
  const words = title.split(" ")
  return (
    <h3
      ref={ref}
      className="font-display text-[clamp(2.5rem,4.8vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.03em] text-[var(--cream)] transition-colors duration-500 group-hover:text-[var(--pc)]"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={inView ? { y: 0 } : { y: "115%" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.08 + i * 0.09 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h3>
  )
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  })
  // subtle parallax: the cover drifts slightly slower than the page
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])
  // lilac duotone at rest, resolving to full color once the cover enters view
  const revealed = useInView(frameRef, { once: true, margin: "-18%" })

  // chameleon: this row's lilac tone floods the page while it sits centered
  const centered = useInView(rowRef, { margin: "-45% 0px -45% 0px" })
  const { setActiveColor } = useChameleonColor()
  useEffect(() => {
    if (centered) setActiveColor(project.color)
  }, [centered, project.color, setActiveColor])

  const { navigate } = usePageTransition()
  const { color, proof } = project
  const href = getProjectUrl(project.id)
  const reverse = index % 2 === 1
  const folio = `0${index + 1}`

  return (
    <motion.article
      ref={rowRef}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, ease: EASE }}
      style={{ ["--pc" as string]: color }}
    >
      <Link
        href={href}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          e.preventDefault()
          navigate(href, { transition: "curtain", accentColor: color })
        }}
        data-cursor-hover
        data-cursor-color={color}
        className="group grid grid-cols-1 items-center gap-7 md:grid-cols-12 md:gap-x-12"
      >
        {/* COVER PLATE — asymmetric 7-col side */}
        <div
          className={`md:col-span-7 ${reverse ? "md:order-2" : "md:order-1"}`}
        >
          <div
            ref={frameRef}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-card md:aspect-[4/3]"
          >
            <motion.div style={{ y }} className="absolute inset-[-7%]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-[filter,transform] duration-[900ms] ease-out group-hover:scale-[1.03]"
                style={{
                  filter: revealed ? "grayscale(0)" : "grayscale(1) contrast(1.05)",
                }}
                sizes="(min-width: 768px) 58vw, 100vw"
                priority={index < 1 || project.priority === true}
              />
            </motion.div>

            {/* lilac duotone tint — fades out as the cover reveals */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-[900ms] ease-out"
              style={{
                backgroundColor: color,
                mixBlendMode: "color",
                opacity: revealed ? 0 : 0.9,
              }}
            />
            {/* faint top scrim so the arrow cue stays legible */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent"
            />

            <span
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--pc)] group-hover:text-[var(--pc)]"
              aria-hidden
            >
              <ArrowCue />
            </span>
          </div>
        </div>

        {/* INDEX ENTRY — 5-col side */}
        <div
          className={`flex flex-col justify-center md:col-span-5 ${
            reverse ? "md:order-1" : "md:order-2"
          }`}
        >
          {/* folio + discipline */}
          <div className="mb-5 flex items-center gap-4">
            <span className="font-display text-[clamp(1.75rem,2.6vw,2.75rem)] font-semibold leading-none tabular-nums text-[var(--pc)]">
              {folio}
            </span>
            <span aria-hidden className="h-px w-9 bg-[var(--hairline)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.tags.join(" · ")}
            </span>
          </div>

          <KineticTitle title={project.title} />

          <p
            className="mt-5 max-w-[34ch] text-[clamp(15px,1.4vw,19px)] font-medium leading-snug"
            style={{ color }}
          >
            {proof}
          </p>

          <div className="mt-7 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="relative inline-flex items-center gap-2 text-[var(--cream)]">
              View case study
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--pc)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                <ArrowCue />
              </span>
            </span>
            <span className="ml-auto tabular-nums">{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function BentoGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const sectionInView = useInView(sectionRef, { margin: "-10% 0px -10% 0px" })
  const { setActiveColor } = useChameleonColor()
  useEffect(() => {
    if (!sectionInView) setActiveColor(null)
  }, [sectionInView, setActiveColor])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="border-t-section relative w-full py-[clamp(96px,14vh,176px)]"
    >
      <div className="container-page relative z-10">
        {/* INDEX HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-baseline justify-between border-b border-[var(--hairline)] pb-6">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[var(--cream)]">
              Selected work
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
              (03) · 2025
            </span>
          </div>
        </motion.header>

        <div className="flex flex-col gap-[clamp(72px,12vh,152px)]">
          {selectedProjects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
