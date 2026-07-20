"use client"

import { useRef } from "react"

import { gsap, useGSAP } from "@/lib/gsap"
import { ACCENT } from "@/lib/brand"

/**
 * TOOLKIT DEMOS — three readable takes on the "capabilities" viz, stacked
 * full-screen so Aijia can scroll and compare. All three KEEP the entrance she
 * loves: the heading deblurs character-by-character and the content reveals on
 * a scrubbed, pinned ScrollTrigger. What changes is only the viz — and every
 * option here presents the skills in READABLE horizontal text.
 *
 *   OPTION A — Grouped list   (editorial, quietest)
 *   OPTION B — Big-word cascade (one large Syne word rising at a time)
 *   OPTION C — Horizontal range bars (equalizer laid flat, label-first)
 *
 * This route does NOT touch the live components/core-capabilities.tsx.
 * Warm-black surface, single lilac accent (ACCENT), Syne/Hanken/Geist Mono.
 */

const HEADING = "The range I design and build across."
const EASE = [0.22, 1, 0.36, 1] as const

// —————————————————————————————————————————————————————————————————————
// Shared: the char-deblur heading (the entrance she loves)
// —————————————————————————————————————————————————————————————————————
function DeblurHeading() {
  return (
    <h2 className="mb-[clamp(40px,7vh,80px)] max-w-[22ch] font-display text-[clamp(30px,5vw,64px)] font-extrabold leading-[1.0] tracking-[-0.025em] text-foreground">
      {HEADING.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              data-cap-char
              className="inline-block will-change-[transform,filter]"
              style={
                word === "across." && ci < 6
                  ? { color: "var(--accent)" }
                  : undefined
              }
            >
              {ch}
            </span>
          ))}
          <span data-cap-char className="inline-block">
            &nbsp;
          </span>
        </span>
      ))}
    </h2>
  )
}

// Big corner marker so each option is unmistakable when scrolling to compare.
function OptionMarker({ letter, name }: { letter: string; name: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4 md:mb-12">
      <span
        className="font-display text-[clamp(40px,7vw,84px)] font-extrabold leading-none tracking-[-0.03em]"
        style={{ color: "var(--accent)" }}
      >
        {letter}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Option {letter} · {name}
      </span>
    </div>
  )
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// —————————————————————————————————————————————————————————————————————
// OPTION A — GROUPED LIST
// —————————————————————————————————————————————————————————————————————
const GROUPS = [
  {
    title: "Strategy & Research",
    skills: ["Systems Thinking", "User Research", "Strategic Design"],
  },
  {
    title: "Design & Systems",
    skills: ["Service Ecosystems", "Service Blueprints"],
  },
  {
    title: "Build & AI",
    skills: ["3D Modeling & CAD", "Physical Prototyping", "AI-Empowered Workflows"],
  },
]

function OptionA() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReduced()) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
        },
      })

      tl.from(
        "[data-cap-char]",
        {
          yPercent: 60,
          opacity: 0,
          filter: "blur(12px)",
          stagger: 0.012,
          ease: "none",
        },
        0
      ).from(
        "[data-reveal]",
        {
          yPercent: 40,
          opacity: 0,
          filter: "blur(8px)",
          stagger: 0.1,
          ease: "power2.out",
        },
        0.15
      )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden border-t border-[var(--section-divider)] py-[clamp(72px,10vh,120px)]"
    >
      <div className="container-page flex w-full flex-col">
        <OptionMarker letter="A" name="Grouped list" />
        <DeblurHeading />

        <div className="flex flex-col gap-[clamp(28px,4vh,52px)]">
          {GROUPS.map((g, gi) => (
            <div
              key={g.title}
              className="grid grid-cols-1 gap-y-4 border-t border-[var(--section-divider)] pt-6 md:grid-cols-[minmax(180px,240px)_1fr] md:gap-x-12"
            >
              <div data-reveal className="flex items-baseline gap-3">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-xs uppercase tracking-[0.22em]"
                  style={{ color: "var(--accent)" }}
                >
                  {g.title}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    data-reveal
                    className="font-display text-[clamp(22px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// —————————————————————————————————————————————————————————————————————
// OPTION B — BIG-WORD CASCADE (React Bits "BlurText" applied per word)
// —————————————————————————————————————————————————————————————————————
const SKILLS_B = [
  "Systems Thinking",
  "Strategic Design",
  "Service Ecosystems",
  "3D Modeling & CAD",
  "User Research",
  "Physical Prototyping",
  "AI-Empowered Workflows",
  "Service Blueprints",
]

function OptionB() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReduced()) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.8,
        },
      })

      tl.from(
        "[data-cap-char]",
        {
          yPercent: 60,
          opacity: 0,
          filter: "blur(12px)",
          stagger: 0.012,
          ease: "none",
        },
        0
      )
        // each big word rises + deblurs, one focal word at a time
        .from(
          "[data-word]",
          {
            yPercent: 120,
            opacity: 0,
            filter: "blur(16px)",
            stagger: 0.6,
            ease: "power3.out",
          },
          0.2
        )
        // trailing words dim slightly so the newest reads as the focal one
        .to(
          "[data-word]:not(:last-child)",
          { opacity: 0.28, stagger: 0.6, ease: "none" },
          0.5
        )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden border-t border-[var(--section-divider)] py-[clamp(72px,10vh,120px)]"
    >
      <div className="container-page flex w-full flex-col">
        <OptionMarker letter="B" name="Big-word cascade" />
        <DeblurHeading />

        <div className="flex flex-col gap-[clamp(6px,1.4vh,16px)]">
          {SKILLS_B.map((s, i) => (
            <div
              key={s}
              data-word
              className="flex items-baseline gap-[clamp(12px,2vw,28px)] will-change-[transform,filter]"
            >
              <span className="w-[2.4ch] shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(28px,5.4vw,72px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground">
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// —————————————————————————————————————————————————————————————————————
// OPTION C — HORIZONTAL RANGE BARS (the equalizer, laid flat + label-first)
// —————————————————————————————————————————————————————————————————————
const BARS = [
  { label: "User Research", v: 0.56 },
  { label: "Systems Thinking", v: 0.82 },
  { label: "Service Blueprints", v: 0.48 },
  { label: "Strategic Design", v: 0.93 },
  { label: "Service Ecosystems", v: 0.64 },
  { label: "3D Modeling & CAD", v: 0.74 },
  { label: "Physical Prototyping", v: 0.54 },
  { label: "AI-Empowered Workflows", v: 1.0 },
]

function OptionC() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReduced()) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.8,
        },
      })

      tl.from(
        "[data-cap-char]",
        {
          yPercent: 60,
          opacity: 0,
          filter: "blur(12px)",
          stagger: 0.012,
          ease: "none",
        },
        0
      )
        .from(
          "[data-row-meta]",
          {
            xPercent: -12,
            opacity: 0,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.15
        )
        // bars draw in from the left (scaleX), left → right down the list
        .from(
          "[data-bar]",
          {
            scaleX: 0,
            transformOrigin: "0% 50%",
            stagger: 0.07,
            ease: "power2.out",
          },
          0.2
        )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden border-t border-[var(--section-divider)] py-[clamp(72px,10vh,120px)]"
    >
      <div className="container-page flex w-full flex-col">
        <OptionMarker letter="C" name="Horizontal range bars" />
        <DeblurHeading />

        <div className="flex flex-col">
          {BARS.map((b, i) => (
            <div
              key={b.label}
              className="grid grid-cols-1 items-center gap-y-2 border-t border-[var(--section-divider)] py-[clamp(12px,2vh,20px)] md:grid-cols-[minmax(200px,280px)_1fr] md:gap-x-8"
            >
              {/* label — normal horizontal text, reads first */}
              <div data-row-meta className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(15px,1.5vw,20px)] font-semibold tracking-[-0.01em] text-foreground">
                  {b.label}
                </span>
              </div>

              {/* the flat bar — length suggests breadth, draws in on scroll */}
              <div className="relative h-[10px] w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)]">
                <div
                  data-bar
                  className="absolute inset-y-0 left-0 rounded-full will-change-transform"
                  style={{
                    width: `${b.v * 100}%`,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${ACCENT} 30%, transparent), ${ACCENT})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// —————————————————————————————————————————————————————————————————————
export default function ToolkitDemosPage() {
  return (
    <main className="w-full bg-background text-foreground">
      {/* intro */}
      <section className="container-page flex min-h-[60vh] flex-col justify-center py-24">
        <span
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--accent)" }}
        >
          Toolkit · viz comparison
        </span>
        <h1 className="max-w-[18ch] font-display text-[clamp(34px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          Three readable takes on the capabilities section.
        </h1>
        <p className="mt-6 max-w-[52ch] font-sans text-base leading-relaxed text-muted-foreground">
          Same entrance you love — the heading deblurs character-by-character and
          each reveals on a scrubbed scroll. Only the visualization changes, and
          all three read in plain horizontal text. Scroll to compare A, B, C.
        </p>
        <span className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          ↓ scroll
        </span>
      </section>

      <OptionA />
      <OptionB />
      <OptionC />

      <footer className="container-page flex min-h-[40vh] flex-col justify-center border-t border-[var(--section-divider)] py-24">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          End of comparison · pick A, B, or C
        </span>
      </footer>
    </main>
  )
}
