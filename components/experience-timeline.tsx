"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LiveStatusWidget } from "./live-status-widget"
import { ExperiencePanel } from "./experience-panel"

// ── Word-by-word fade-in text ──────────────────────────────────────────────
function WordFadeText({ text, color }: { text: string; color: string }) {
  const words = text.split(" ")

  return (
    <span
      className="inline-block"
      style={{
        color,
        transition: "color 0.45s ease-out",
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  )
}

// Rotating taglines for the hero headline — each paired with one accent color
const rotatingPhrases = [
  { text: "actually want to use.", color: "var(--proj-yellow)" },
  { text: "keep coming back to.", color: "var(--proj-green)" },
  { text: "quietly depend on.", color: "var(--proj-blue)" },
  { text: "genuinely love.", color: "var(--proj-pink)" },
  { text: "can't stop talking about.", color: "var(--proj-purple)" },
]

// ──────────────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────────────

// Inline emphasis — dark brown at rest, white on hover (matches body).
const Em = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-[#1E1510] group-hover:text-white">
    {children}
  </strong>
)

const aboutModules = [
  {
    label: "Background",
    color: "var(--proj-yellow)",
    hex: "#FFC973",
    cursorHex: "#E692FF", // yellow card → purple cursor
    body: (
      <>
        From shaping <Em>physical products at Pratt</Em> to designing <Em>service systems at SCAD</Em>, my background is a <Em>true hybrid</Em>. I care just as much about the <Em>tangible details</Em> as I do about the <Em>invisible systems</Em> running behind them.
      </>
    ),
  },
  {
    label: "Specialty",
    color: "var(--proj-blue)",
    hex: "#96C1FF",
    cursorHex: "#FF9992", // blue card → pink cursor
    body: (
      <>
        I specialize in mapping the <Em>messy realities of user journeys</Em>. By connecting the dots across touchpoints, I turn complex systems into <Em>cohesive, end-to-end strategies</Em> that actually work in the real world.
      </>
    ),
  },
  {
    label: "Off Duty",
    color: "var(--proj-pink)",
    hex: "#FF9992",
    cursorHex: "#96C1FF", // pink card → blue cursor
    body: (
      <>
        Living at the intersection of <Em>tradition and the future</Em>. You'll find me experimenting with the latest <Em>AI coding tools and agents</Em>, analyzing a <Em>Ziwei Doushu birth chart</Em>, or perfecting my <Em>traditional braised beef recipe</Em>.
      </>
    ),
  },
  {
    label: "Philosophy",
    color: "var(--proj-purple)",
    hex: "#E692FF",
    cursorHex: "#FFC973", // purple card → yellow cursor
    body: (
      <>
        I believe the best solutions go <Em>beyond pure functionality</Em>. Whether dealing with digital platforms or physical spaces, great design always comes from a mix of <Em>curiosity, logic, and a bit of soul</Em>.
      </>
    ),
  },
]

const experiences = [
  {
    n: "01",
    period: "2025",
    role: "Service Designer",
    company: "SCADpro × FINRA",
    body: "Led a digital brand experience audit, conducting stakeholder interviews and developing comprehensive service strategies for financial regulatory communications.",
    skills: ["Service Design", "UX Research", "Strategy", "Workshop Facilitation"],
    accent: "var(--proj-green)",
    accentHex: "#7afea7",
  },
  {
    n: "02",
    period: "2024",
    role: "Leasing Agent",
    company: "Acre NY Realty",
    body: "Managed client relationships and multi-party stakeholder communication. Sharpened systems-thinking instincts through the messy realities of complex negotiations.",
    skills: ["Stakeholder Management", "Client Relations", "Negotiation"],
    accent: "var(--proj-blue)",
    accentHex: "#96c1ff",
  },
  {
    n: "03",
    period: "2023",
    role: "Industrial Design Intern",
    company: "NANOV DISPLAY",
    body: "Created physical prototypes and contributed to product development. Learned where conceptual design ends and manufacturing constraints begin.",
    skills: ["Physical Prototyping", "CAD", "Manufacturing", "Product Design"],
    accent: "var(--proj-pink)",
    accentHex: "#ff9992",
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

// ──────────────────────────────────────────────────────────────────────────
// Type system atoms
// ──────────────────────────────────────────────────────────────────────────

const metaCls =
  "text-xs uppercase tracking-[0.3em] font-mono text-muted-foreground"
const numberCls =
  "font-mono tabular-nums text-4xl md:text-5xl leading-none text-muted-foreground"
const bodyCls = "text-lg md:text-xl leading-[1.6]"

// ──────────────────────────────────────────────────────────────────────────
// Main section
// ──────────────────────────────────────────────────────────────────────────

export function ExperienceTimeline() {
  const [phraseIdx, setPhraseIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % rotatingPhrases.length)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const activePhrase = rotatingPhrases[phraseIdx]

  return (
    <section
      id="about"
      className="scroll-mt-16 overflow-x-hidden pt-32 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-16 border-t-section"
    >
      {/* ────────────────────  HERO  ──────────────────── */}
      <div className="max-w-4xl mx-auto text-center mb-14 md:mb-20">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`block ${metaCls} mb-14 md:mb-16`}
        >
          About
        </motion.span>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 md:mb-6"
        >
          <LiveStatusWidget />
        </motion.div>

        <h2 className="font-sans font-extrabold tracking-[-0.025em] leading-[1] text-foreground mb-14 md:mb-16">
          <motion.span
            className="block text-[clamp(1.75rem,4.5vw,3.75rem)]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            I transform complex research
          </motion.span>
          <motion.span
            className="block text-[clamp(1.75rem,4.5vw,3.75rem)]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
          >
            into experiences people
          </motion.span>
          <motion.span
            className="relative inline-block text-[clamp(1.75rem,4.5vw,3.75rem)] align-baseline"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, delay: 0.24, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIdx}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
                className="inline-block"
              >
                <WordFadeText text={activePhrase.text} color={activePhrase.color} />
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </h2>
      </div>

      {/* ────────────────────  ABOUT — 2×2 color posters  ──────────────────── */}
      <div className="max-w-[80rem] mx-auto mb-12 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-20 md:gap-y-10">
          {aboutModules.map((m, i) => (
            <motion.article
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              whileHover={{
                y: -5,
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.6),
                  inset 0 0 0 1px rgba(255,255,255,0.18),
                  0 2px 4px rgba(0,0,0,0.1),
                  0 26px 42px -22px rgba(0,0,0,0.5)
                `,
                transition: { duration: 0.3, ease: EASE },
              }}
              data-cursor-hover
              data-cursor-color={m.cursorHex}
              data-cursor-no-magnet
              className="group relative overflow-hidden rounded-3xl px-10 py-9 md:px-12 md:py-11 h-[260px] md:h-[275px] flex flex-col justify-center will-change-transform transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:p-3 md:group-hover:p-4"
              style={{
                background: `linear-gradient(155deg, ${m.color} 0%, ${m.color} 55%, color-mix(in oklab, ${m.color} 78%, #1E1510) 100%)`,
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.55),
                  inset 0 0 0 1px rgba(255,255,255,0.12),
                  0 1px 2px rgba(0,0,0,0.08),
                  0 18px 32px -20px rgba(0,0,0,0.35)
                `,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(140% 100% at 10% -10%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)",
                }}
              />

              {/* Title + divider — collapse entirely on hover (height + margin → 0) */}
              <div className="relative overflow-hidden max-h-[120px] mb-4 md:mb-5 opacity-100 transition-[max-height,margin,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-0 group-hover:mb-0 group-hover:opacity-0">
                <h3 className="font-sans font-semibold tracking-[-0.015em] leading-[1.05] uppercase text-white text-lg md:text-xl mb-4 md:mb-5">
                  {m.label}
                </h3>
                <div className="h-px bg-[#1E1510]/20" />
              </div>

              <p className="relative text-sm md:text-[15px] leading-[1.6] text-[#1E1510]/70 max-w-[52ch] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-base md:group-hover:text-[22px] group-hover:leading-[1.35] group-hover:font-normal group-hover:text-white group-hover:max-w-none">
                {m.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Experience — still under About (same page gradient); sub-block for #experience anchor */}
      <div
        id="experience"
        className="scroll-mt-20 mt-32 w-full md:mt-44"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`block ${metaCls} mb-1.5 text-center md:mb-2`}
        >
          Experience
        </motion.span>

        <ExperiencePanel items={experiences} />
      </div>
    </section>
  )
}
