"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Side-by-side comparison of 8 candidate fonts for the rotating tagline
 * on the About hero. Each card reproduces the exact same headline layout
 * the live site uses, only the rotating line's font changes.
 *
 * The 4 rotating phrases cycle every 2.8s across all cards simultaneously
 * so you can read them synchronized and compare feel at a glance.
 */

const PHRASES = [
  { text: "human needs with AI capabilities.", color: "var(--proj-yellow)" },
  { text: "physical spaces with digital interfaces.", color: "var(--proj-green)" },
  { text: "user behavior with business strategy.", color: "var(--proj-blue)" },
  { text: "invisible systems with tangible details.", color: "var(--proj-pink)" },
]

type FontOption = {
  id: string
  label: string
  blurb: string
  fontFamily: string
  italic?: boolean
  weight?: number | string
  sizeClamp?: string
  letterSpacing?: string
  lineHeight?: number
}

const FONTS: FontOption[] = [
  {
    id: "caveat",
    label: "1 · Caveat",
    blurb: "Handwritten, warm, very personal. Feels like a notebook aside.",
    fontFamily: "var(--font-caveat)",
    weight: 500,
    sizeClamp: "clamp(2rem, 4.5vw, 3.75rem)",
    lineHeight: 1.05,
  },
  {
    id: "kalam",
    label: "2 · Kalam",
    blurb: "Handwritten but more upright and legible than Caveat.",
    fontFamily: "var(--font-kalam)",
    weight: 400,
    sizeClamp: "clamp(1.75rem, 3.8vw, 3rem)",
    lineHeight: 1.15,
  },
  {
    id: "fraunces",
    label: "3 · Fraunces Italic",
    blurb: "Modern serif with playful swashes. Editorial but distinctive.",
    fontFamily: "var(--font-fraunces)",
    italic: true,
    weight: 400,
    sizeClamp: "clamp(1.65rem, 3.6vw, 3rem)",
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
  },
  {
    id: "instrument",
    label: "4 · Instrument Serif Italic",
    blurb: "Refined, tall, quietly elegant. Art-gallery energy.",
    fontFamily: "var(--font-instrument)",
    italic: true,
    weight: 400,
    sizeClamp: "clamp(1.65rem, 3.6vw, 3rem)",
    letterSpacing: "-0.005em",
    lineHeight: 1.1,
  },
  {
    id: "playfair",
    label: "5 · Playfair Display Italic",
    blurb: "Classic high-contrast serif. Traditional and formal.",
    fontFamily: "var(--font-playfair)",
    italic: true,
    weight: 400,
    sizeClamp: "clamp(1.5rem, 3.3vw, 2.75rem)",
    letterSpacing: "-0.005em",
    lineHeight: 1.15,
  },
  {
    id: "dm-serif",
    label: "6 · DM Serif Display Italic",
    blurb: "Bold, dramatic serif. Loud and magazine-cover-style.",
    fontFamily: "var(--font-dm-serif)",
    italic: true,
    weight: 400,
    sizeClamp: "clamp(1.65rem, 3.6vw, 3rem)",
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
  },
  {
    id: "cormorant",
    label: "7 · Cormorant Italic",
    blurb: "Delicate, elongated Renaissance serif. Romantic.",
    fontFamily: "var(--font-cormorant)",
    italic: true,
    weight: 500,
    sizeClamp: "clamp(1.75rem, 3.8vw, 3.25rem)",
    letterSpacing: "0",
    lineHeight: 1.1,
  },
  {
    id: "space-grotesk",
    label: "8 · Space Grotesk Italic",
    blurb: "Geometric sans-serif italic. Modern, techy, minimal.",
    fontFamily: "var(--font-space-grotesk)",
    italic: true,
    weight: 500,
    sizeClamp: "clamp(1.5rem, 3.3vw, 2.75rem)",
    letterSpacing: "-0.015em",
    lineHeight: 1.1,
  },
]

export default function FontDemo() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PHRASES.length), 2800)
    return () => clearInterval(id)
  }, [])

  const phrase = PHRASES[idx]

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-16 md:py-24"
      style={{
        background: "linear-gradient(to bottom, #1B1309 0%, #1E1510 60%, #030201 100%)",
        color: "#F3E3CE",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-3">
            Font Comparison
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Rotating tagline — 8 candidates
          </h1>
          <p className="opacity-70 max-w-2xl leading-relaxed">
            Each card reproduces the exact headline from the About section. Only the
            rotating (bottom) line changes font. All rotate in sync every 2.8s so you
            can compare identical phrases side-by-side. Pick the one you like and
            tell me the number.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {FONTS.map((font) => (
            <article
              key={font.id}
              className="rounded-3xl p-8 md:p-10 border border-white/8"
              style={{
                background:
                  "linear-gradient(155deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.02) 100%)",
              }}
            >
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h2 className="text-base uppercase tracking-[0.2em] opacity-80">
                  {font.label}
                </h2>
              </div>

              <p className="text-xs opacity-55 mb-7 leading-relaxed">{font.blurb}</p>

              {/* Replica of About hero headline */}
              <div className="text-center">
                <h3 className="font-sans font-extrabold tracking-[-0.025em] leading-[1.05]">
                  <span className="block text-[clamp(1.35rem,3.4vw,2.75rem)]">
                    I design end-to-end
                  </span>
                  <span className="block text-[clamp(1.35rem,3.4vw,2.75rem)]">
                    ecosystems that bridge
                  </span>
                  <span
                    className="relative block mt-4"
                    style={{
                      fontFamily: font.fontFamily,
                      fontStyle: font.italic ? "italic" : "normal",
                      fontWeight: font.weight ?? 400,
                      fontSize: `calc(${font.sizeClamp ?? "clamp(1.5rem,3.3vw,2.75rem)"} * 0.8)`,
                      letterSpacing: font.letterSpacing ?? "0",
                      lineHeight: font.lineHeight ?? 1.1,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${font.id}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ color: phrase.color, display: "inline-block" }}
                      >
                        {phrase.text}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h3>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-16 text-sm opacity-60 text-center">
          Current live font on `/#about`:{" "}
          <span className="opacity-100 font-semibold">1 · Caveat</span>
        </footer>
      </div>
    </div>
  )
}
