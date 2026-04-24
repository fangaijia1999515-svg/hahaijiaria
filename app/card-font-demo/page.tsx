"use client"

import { useState } from "react"

/**
 * Side-by-side comparison of DISTINCTIVE hover-state fonts for the About
 * cards. At rest the cards keep Inter (unchanged). On hover the body swaps
 * to a more expressive / rounder typeface — that's the moment we're trying
 * to give personality.
 *
 * Hover any card below to preview its hover typeface in isolation. A global
 * "show all hovered" switch lets you peek at every option simultaneously.
 */

type FontOption = {
  id: string
  label: string
  blurb: string
  fontFamily: string
}

/**
 * 8 geometric-rounded sans fonts in the same "family" as Unbounded — but
 * each warmer / less machine-like in their own way. Unbounded and Lexend
 * (both user favorites) are kept for comparison.
 */
const FONTS: FontOption[] = [
  {
    id: "unbounded",
    label: "1 · Unbounded (your pick)",
    blurb: "Tall, perfectly geometric, rounded. Can feel a touch 'tech'.",
    fontFamily: "var(--font-unbounded)",
  },
  {
    id: "jost",
    label: "2 · Jost",
    blurb: "Futura reborn — geometric but softer. Vintage warmth.",
    fontFamily: "var(--font-jost)",
  },
  {
    id: "rubik",
    label: "3 · Rubik",
    blurb: "Actually rounded corners on every letter. Friendly geometry.",
    fontFamily: "var(--font-rubik)",
  },
  {
    id: "sora",
    label: "4 · Sora",
    blurb: "Modern geometric with very soft curves. Clean + calm.",
    fontFamily: "var(--font-sora)",
  },
  {
    id: "onest",
    label: "5 · Onest",
    blurb: "New geometric — distinctive 'g' and 'a'. Warm minimalist.",
    fontFamily: "var(--font-onest)",
  },
  {
    id: "poppins",
    label: "6 · Poppins",
    blurb: "Classic geometric + very round. Approachable & familiar.",
    fontFamily: "var(--font-poppins)",
  },
  {
    id: "lexend",
    label: "7 · Lexend (your pick)",
    blurb: "Wide, calm, very readable. Humanist rather than geometric.",
    fontFamily: "var(--font-lexend)",
  },
  {
    id: "familjen",
    label: "8 · Familjen Grotesk",
    blurb: "Swedish geometric with personality. Quirky but understated.",
    fontFamily: "var(--font-familjen)",
  },
]

const CARD = {
  label: "Background",
  hex: "#FFC973",
  body: `From shaping physical products at Pratt to designing service systems at SCAD, my background is a true hybrid. I care just as much about the tangible details as I do about the invisible systems running behind them.`,
  emphases: [
    "physical products at Pratt",
    "service systems at SCAD",
    "true hybrid",
    "tangible details",
    "invisible systems",
  ],
}

function BodyWithEmphasis({ text, emphases }: { text: string; emphases: string[] }) {
  let rest = text
  const segments: { content: string; emph: boolean }[] = []
  while (rest.length > 0) {
    const next = emphases
      .map((em) => ({ em, idx: rest.indexOf(em) }))
      .filter((x) => x.idx >= 0)
      .sort((a, b) => a.idx - b.idx)[0]
    if (!next) {
      segments.push({ content: rest, emph: false })
      break
    }
    if (next.idx > 0) segments.push({ content: rest.slice(0, next.idx), emph: false })
    segments.push({ content: next.em, emph: true })
    rest = rest.slice(next.idx + next.em.length)
  }
  return (
    <>
      {segments.map((s, i) =>
        s.emph ? (
          <strong key={i} className="font-semibold">
            {s.content}
          </strong>
        ) : (
          <span key={i}>{s.content}</span>
        ),
      )}
    </>
  )
}

function DemoCard({ font, forceHover }: { font: FontOption; forceHover: boolean }) {
  const [hovering, setHovering] = useState(false)
  const isHover = hovering || forceHover

  return (
    <article className="flex flex-col">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-sm uppercase tracking-[0.2em] opacity-80">{font.label}</h2>
      </div>
      <p className="text-xs opacity-55 mb-4 leading-relaxed min-h-[36px]">{font.blurb}</p>

      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="group relative overflow-hidden rounded-3xl p-6 md:p-8 h-[300px] flex flex-col justify-center cursor-pointer"
        style={{
          background: isHover
            ? "#1E1510"
            : `linear-gradient(155deg, ${CARD.hex} 0%, ${CARD.hex} 55%, color-mix(in oklab, ${CARD.hex} 78%, #1E1510) 100%)`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,${isHover ? 0.06 : 0.55}),
            inset 0 0 0 1px rgba(255,255,255,${isHover ? 0.08 : 0.12}),
            0 1px 2px rgba(0,0,0,0.08),
            0 18px 32px -20px rgba(0,0,0,0.35)
          `,
          transition: "background 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {!isHover && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(140% 100% at 10% -10%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)",
            }}
          />
        )}

        {/* Title (only at rest, per the live card) */}
        {!isHover && (
          <div className="relative mb-4">
            <h3
              className="font-sans font-semibold tracking-[-0.015em] leading-[1.05] uppercase text-white text-base md:text-lg mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {CARD.label}
            </h3>
            <div className="h-px bg-[#1E1510]/20" />
          </div>
        )}

        {/* Body — at REST = Inter / #1E1510; at HOVER = the candidate font / accent color */}
        <p
          className="relative leading-[1.4] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            fontFamily: isHover ? font.fontFamily : "var(--font-inter)",
            color: isHover ? CARD.hex : "#1E1510",
            fontSize: isHover ? "18px" : "14px",
            fontWeight: 400,
          }}
        >
          <BodyWithEmphasis text={CARD.body} emphases={CARD.emphases} />
        </p>
      </div>
    </article>
  )
}

export default function CardFontDemo() {
  const [forceAllHover, setForceAllHover] = useState(false)

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-16 md:py-24"
      style={{
        background: "linear-gradient(to bottom, #1B1309 0%, #1E1510 60%, #030201 100%)",
        color: "#F3E3CE",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-3">
            Card Body Font — HOVER state only
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            8 distinctive options
          </h1>
          <p className="opacity-70 max-w-2xl leading-relaxed">
            At rest, all About cards keep Inter (untouched). Only on hover do we
            swap in a more expressive font. Hover each card individually below
            to preview, or flip the switch to see all 8 in their hover state at
            once.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setForceAllHover(false)}
              className={`px-5 py-2 text-sm rounded-full transition-colors ${
                !forceAllHover ? "bg-white text-[#1B1309]" : "text-white/70 hover:text-white"
              }`}
            >
              Hover individually
            </button>
            <button
              onClick={() => setForceAllHover(true)}
              className={`px-5 py-2 text-sm rounded-full transition-colors ${
                forceAllHover ? "bg-white text-[#1B1309]" : "text-white/70 hover:text-white"
              }`}
            >
              Show all hovered
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {FONTS.map((font) => (
            <DemoCard key={font.id} font={font} forceHover={forceAllHover} />
          ))}
        </div>

        <footer className="mt-12 text-sm opacity-60 text-center">
          Current live font everywhere:{" "}
          <span className="font-semibold opacity-100">Inter</span>
        </footer>
      </div>
    </div>
  )
}
