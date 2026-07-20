"use client"

import { motion } from "framer-motion"

import { getLenis } from "@/lib/lenis"
import { DitherFlower } from "@/components/dither-flower"
import { HeroField } from "@/components/hero-field"
import { ACCENT } from "@/lib/brand"

const HERO_BG = "#0c0a08"
const ORB_ACCENT = ACCENT

const EASE = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  return (
    <section
      data-hero
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
      style={{ backgroundColor: HERO_BG }}
    >
      {/* faint structural grid backbone (centered to the page container) — also
          the static fallback under prefers-reduced-motion / no-WebGL */}
      <div
        aria-hidden
        className="grid-backbone pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      {/* mouse-reactive halftone dot-field (the single, restrained WebGL layer) */}
      <HeroField />

      <div className="container-page relative z-10 flex min-h-[100dvh] flex-col justify-end pb-[clamp(36px,6vh,64px)] pt-[clamp(112px,16vh,180px)]">
        {/* center block — anchored low, generous air above */}
        <div className="flex flex-col gap-[clamp(20px,3vw,34px)]">
          {/* greeting + flower seat directly on the headline as one unit */}
          <div className="flex flex-col gap-[clamp(8px,1.2vw,16px)]">
            <div className="flex items-end gap-4 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                className="shrink-0"
              >
                <DitherFlower src="/home/flowers/purple.png" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
                className="mb-[clamp(6px,1.4vw,18px)] font-display text-[clamp(18px,2.2vw,28px)] font-medium text-[#9D8E79]"
              >
                Hi, I&rsquo;m Aijia.
              </motion.span>
            </div>

            <div className="relative w-fit">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
                className="max-w-[19ch] font-display text-[clamp(40px,7vw,104px)] font-extrabold leading-[1.0] tracking-[-0.025em] text-[var(--cream)]"
              >
                I make complex systems feel{" "}
                <span style={{ color: ORB_ACCENT }}>simple.</span>
              </motion.h1>

            {/* dashed "selection" marquee — draws itself on once via a clip wipe */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-[3px] border border-dashed border-[var(--cream)]/20"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, ease: EASE, delay: 0.95 }}
            />
            {/* selection handles */}
            {[
              "left-[-19px] top-[-15px]",
              "right-[-19px] top-[-15px]",
              "left-[-19px] bottom-[-15px]",
              "right-[-19px] bottom-[-15px]",
            ].map((pos) => (
              <motion.span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 border border-[var(--cream)]/40 bg-[var(--bg-primary)] ${pos}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE, delay: 1.85 }}
              />
            ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.45 }}
            className="max-w-[52ch] text-[clamp(15px,1.5vw,19px)] leading-relaxed text-[#B7A892]"
          >
            Product and service designer, and AI-native builder. I design the
            experience and build what runs behind it.
          </motion.p>
        </div>

        {/* bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mt-[clamp(40px,8vh,88px)] flex items-end justify-between gap-4 border-t border-[var(--hairline)] pt-5"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#B7A892]">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: ORB_ACCENT, boxShadow: `0 0 8px ${ORB_ACCENT}` }}
            />
            Open to work
          </span>
          <a
            href="#work"
            data-cursor-hover
            onClick={(e) => {
              e.preventDefault()
              const el = document.querySelector("#work")
              const lenis = getLenis()
              if (lenis && el) lenis.scrollTo(el as HTMLElement)
              else el?.scrollIntoView({ behavior: "smooth" })
            }}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9D8E79] transition-colors hover:text-[var(--cream)]"
          >
            &darr; Selected work
          </a>
        </motion.div>
      </div>
    </section>
  )
}
