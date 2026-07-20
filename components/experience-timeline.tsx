"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { LiveStatusWidget } from "./live-status-widget"

const EASE = [0.22, 1, 0.36, 1] as const
const metaCls =
  "text-xs uppercase tracking-[0.3em] font-mono text-muted-foreground"

// Inline emphasis — warm cream bold against the muted body.
const Em = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
)

// How I work — narrates "I design the experience and build what runs behind it."
const approach = [
  {
    n: "01",
    verb: "Map",
    body: (
      <>
        I map the messy reality of a system: every touchpoint, stakeholder, and
        the <Em>invisible logic</Em> running behind it, until the whole
        ecosystem is legible.
      </>
    ),
  },
  {
    n: "02",
    verb: "Design",
    body: (
      <>
        From <Em>physical products at Pratt</Em> to{" "}
        <Em>service ecosystems at SCAD</Em>, I shape both the tangible details
        and the systems beneath them into one coherent experience.
      </>
    ),
  },
  {
    n: "03",
    verb: "Build",
    body: (
      <>
        Then I build what runs behind it, prototyping and shipping with{" "}
        <Em>AI in the loop</Em> (Claude Code, agents, vibe-coded tools) so the
        design becomes a working thing.
      </>
    ),
  },
]

const personal = [
  {
    label: "Off Duty",
    body: (
      <>
        Living at the intersection of <Em>tradition and the future</Em>. You'll
        find me experimenting with the latest <Em>AI coding tools and agents</Em>,
        analyzing a <Em>Vedic birth chart</Em>, or perfecting my{" "}
        <Em>traditional braised-beef recipe</Em>.
      </>
    ),
  },
  {
    label: "Philosophy",
    body: (
      <>
        The best solutions go <Em>beyond pure functionality</Em>. Whether it's a
        digital platform or a physical space, great design comes from a mix of{" "}
        <Em>curiosity, logic, and a bit of soul</Em>.
      </>
    ),
  },
]

const credentials = [
  {
    year: "2025",
    role: "Service Designer",
    company: "SCADpro × FINRA",
    detail:
      "Digital brand-experience audit: stakeholder research and service strategy for financial-regulatory communications.",
  },
  {
    year: "2023",
    role: "Industrial Design Intern",
    company: "NANOV Display",
    detail: "Physical prototyping and product development.",
  },
]

export function ExperienceTimeline() {
  // Approach rail: the vertical connector draws itself as 01→02→03 scrolls
  // through, riding the page scroll (no autoplay) — fills on the single clock.
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 65%"],
  })
  const railFill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <>
    <section
      id="about"
      className="section-cream flex min-h-[100dvh] flex-col justify-center scroll-mt-16 overflow-x-hidden border-t-section py-[clamp(96px,14vh,176px)] px-page"
    >
      {/* ── ABOUT header ── */}
      <div className="mb-16 max-w-[64rem] md:mb-24">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`mb-14 block md:mb-16 ${metaCls}`}
        >
          About
        </motion.span>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 md:mb-12"
        >
          <LiveStatusWidget />
        </motion.div>

        <h2 className="mb-0 font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-foreground">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            I design end-to-end
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
          >
            ecosystems that bridge
          </motion.span>
          <motion.span
            className="mt-5 block text-[clamp(1.65rem,3.6vw,3rem)] font-normal italic leading-[1.1] tracking-[-0.01em] md:mt-6"
            style={{ color: "var(--accent)" }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, delay: 0.24, ease: EASE }}
          >
            physical craft and digital systems.
          </motion.span>
        </h2>
      </div>

      {/* ── APPROACH (left) + PERSONAL (right) ── */}
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-[1.2fr_1fr]">
        {/* Approach — Map / Design / Build, on a vertical rail */}
        <div>
          <span className={`mb-8 block ${metaCls}`}>How I work</span>
          <div ref={railRef} className="relative flex flex-col">
            {/* connector — faint track + accent fill that draws on scroll */}
            <span
              aria-hidden
              className="absolute left-0 top-1.5 bottom-0 w-px bg-[var(--hairline)]"
            />
            <motion.span
              aria-hidden
              className="absolute left-0 top-1.5 bottom-0 w-px origin-top"
              style={{ backgroundColor: "var(--accent)", scaleY: railFill }}
            />
            {approach.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative pb-10 pl-7 last:pb-0"
              >
                <span
                  className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-4 ring-[var(--bg-primary)]"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden
                />
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-[0.1em] text-muted-foreground tabular-nums">
                    {step.n}
                  </span>
                  <span className="font-display text-2xl font-bold tracking-[-0.01em] text-[var(--cream)] md:text-[1.7rem]">
                    {step.verb}
                  </span>
                </div>
                <p className="max-w-[42ch] text-[15px] leading-[1.7] text-muted-foreground">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Personal */}
        <div className="flex flex-col gap-12">
          {personal.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="border-t border-[var(--hairline)] pt-6"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: "var(--accent)" }}
                >
                  {m.label}
                </span>
              </div>
              <p className="max-w-[44ch] text-[15px] leading-[1.7] text-muted-foreground md:text-base">
                {m.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── closing registration strip — education ledger, quiet + single-accent ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-[clamp(64px,10vh,128px)] border-t border-[var(--hairline)] pt-10"
      >
        {/* education ledger */}
        <div>
          <span className="mb-4 block font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Education
          </span>
          <ul className="flex flex-col gap-2.5">
            {[
              { school: "SCAD", focus: "Service Design" },
              { school: "Pratt Institute", focus: "Industrial Design" },
            ].map((e) => (
              <li
                key={e.school}
                className="flex items-baseline gap-3 text-[14px] leading-[1.5]"
              >
                <span
                  aria-hidden
                  className="relative top-[-2px] h-[5px] w-[5px] shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span className="font-semibold text-[var(--cream)]">
                  {e.school}
                </span>
                <span className="text-muted-foreground">{e.focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      </section>

      {/* ── CREDENTIALS LEDGER (replaces the old wavy timeline) — back to dark ── */}
      <section className="border-t-section py-[clamp(96px,14vh,176px)] px-page">
      <div id="experience" className="scroll-mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <span className={`block ${metaCls}`}>Experience</span>
          <a
            href="/aijia-fang-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-[var(--accent)] hover:text-[var(--cream)]"
          >
            &darr; Résumé (PDF)
          </a>
        </div>

        <div>
          {credentials.map((c, i) => (
            <motion.div
              key={c.role}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="group relative flex flex-col gap-1 border-t border-[var(--hairline)] py-6 transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.015] hover:px-5 md:flex-row md:items-baseline md:justify-between md:gap-8"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 md:max-w-[60ch]">
                <h3 className="text-lg font-semibold text-[var(--cream)]">
                  {c.role}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {c.company}
                  </span>
                </h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-muted-foreground">
                  {c.detail}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground transition-colors duration-500 group-hover:text-[var(--accent)]">
                {c.year}
              </span>
            </motion.div>
          ))}

          {/* Earlier — demoted to one quiet line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t border-[var(--hairline)] py-5 text-[13px] text-muted-foreground/70"
          >
            Earlier: client &amp; stakeholder work, Acre NY Realty.
          </motion.p>
        </div>
      </div>
    </section>
    </>
  )
}
