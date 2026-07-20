"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { easedScrollTo, useTransition as usePageTransition } from "@/lib/transition-context"
import { ArrowCue } from "./arrow-cue"
import { DitherFlower } from "./dither-flower"
import { ACCENT } from "@/lib/brand"

const EASE = [0.22, 1, 0.36, 1] as const

export function Footer() {
  const pathname = usePathname()
  const { navigate, smoothScrollTo } = usePageTransition()

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      easedScrollTo(0)
    } else {
      navigate("/", { transition: "slide-up" })
    }
  }

  const handleWorkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      smoothScrollTo("work")
    } else {
      navigate("/", { transition: "slide-up", anchor: "work" })
    }
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      smoothScrollTo("about")
    } else {
      navigate("/", { transition: "slide-up", anchor: "about" })
    }
  }

  return (
    <footer
      id="contact"
      className="scroll-mt-16 border-t-section relative py-[clamp(96px,14vh,176px)]"
    >
      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* re-coalescing flower — bookends the hero dissolve */}
          <div className="mb-8 flex items-center gap-4">
            <DitherFlower
              src="/home/flowers/green.png"
              coalesce
              cols={64}
              className="w-[clamp(84px,8vw,120px)]"
            />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Get in Touch
            </span>
          </div>
          <h2 className="font-display font-extrabold tracking-[-0.025em] text-4xl md:text-5xl lg:text-6xl leading-[1.02] text-foreground pb-2 max-w-[16ch]">
            {"Let's untangle the ".split(" ").map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: "0.5em" }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
            <motion.span
              className="inline-block"
              style={{ color: "var(--accent)" }}
              initial={{ opacity: 0, y: "0.5em" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            >
              complexity.
            </motion.span>
          </h2>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <a
              href="mailto:hahaijiarah@gmail.com"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-[0.15em] hover:bg-[var(--accent)] transition-colors duration-300"
              data-cursor-hover
              data-cursor-color={ACCENT}
            >
              hahaijiarah@gmail.com
              <ArrowCue />
            </a>
            <a
              href="https://www.linkedin.com/in/aijia-fang"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-foreground/40 text-sm uppercase tracking-[0.15em] text-foreground hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
              data-cursor-hover
              data-cursor-color={ACCENT}
            >
              LinkedIn
              <ArrowCue />
            </a>
          </div>
        </motion.div>

        <div className="mt-20 pt-8 border-t-section-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <button
              onClick={handleNameClick}
              className="font-sans font-extrabold tracking-tighter text-lg text-foreground transition-colors hover:text-[var(--accent)] text-left"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-hover
              data-cursor-color={ACCENT}
            >
              Aijia Fang
            </button>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="/#work"
                onClick={handleWorkClick}
                className="hover:text-[var(--accent)] transition-colors"
                data-cursor-hover
                data-cursor-color={ACCENT}
              >
                Work
              </Link>
              <Link
                href="/#about"
                onClick={handleAboutClick}
                className="hover:text-[var(--accent)] transition-colors"
                data-cursor-hover
                data-cursor-color={ACCENT}
              >
                About
              </Link>
            </nav>
          </div>
          <p className="text-sm text-muted-foreground">© 2026</p>
        </div>
      </div>
    </footer>
  )
}
