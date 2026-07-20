"use client"

import { useRef } from "react"

import { gsap, useGSAP } from "@/lib/gsap"

/**
 * TOOLKIT — the range I work across, read as a big-word cascade.
 *
 * A small, quiet line names WHAT this is; the giant Syne skill-words are the
 * focus. As you scrub the pinned section each word rises + deblurs, one focal
 * word at a time, while the words above it dim back — so there is always a
 * single bright word carrying the eye down the list.
 *
 *   1. the small title deblurs character-by-character on enter (the entrance
 *      she loves), then
 *   2. each big word rises from below + deblurs on a stagger, and
 *   3. every word except the newest dims to a hush, so the list reads as one
 *      moving focal point rather than a flat stack.
 *
 * PERF: transform/opacity/filter only (GPU), one pinned ScrollTrigger on the
 * single Lenis clock. Under prefers-reduced-motion the scene paints in its
 * final, fully-raised state with no pin and no scrub.
 */

const TITLE = "The range I design and build across."

// one focal word per capability — long labels stay on one line at 1440px and
// wrap (never clip) on the narrowest phones.
const SKILLS = [
  "Systems Thinking",
  "Strategic Design",
  "Service Ecosystems",
  "3D Modeling & CAD",
  "User Research",
  "Physical Prototyping",
  "AI-Empowered Workflows",
  "Service Blueprints",
]

function TitleChars() {
  // split into words (kept unbreakable) then characters for the blur-in
  return (
    <>
      {TITLE.split(" ").map((word, wi) => (
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
    </>
  )
}

export function CoreCapabilities() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.8,
        },
      })

      // 1 — the small title deblurs, character by character
      tl.from(
        "[data-cap-char]",
        {
          yPercent: 60,
          opacity: 0,
          filter: "blur(10px)",
          stagger: 0.012,
          ease: "none",
        },
        0
      )
        // 2 — each big word rises + deblurs, one focal word at a time
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
        // 3 — trailing words dim so the newest reads as the focal one
        .to(
          "[data-word]:not(:last-child)",
          { opacity: 0.24, stagger: 0.6, ease: "none" },
          0.5
        )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="section-cream border-t-section relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden py-[clamp(72px,10vh,128px)]"
    >
      <div className="container-page flex w-full flex-col">
        <span className="mb-6 block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground md:mb-8">
          Toolkit
        </span>

        {/* small, quiet line — names what this is without competing with the
            giant cascade words below it */}
        <h2 className="mb-[clamp(28px,5vh,56px)] max-w-[40ch] font-sans text-[clamp(15px,1.6vw,21px)] font-medium leading-[1.4] tracking-[-0.005em] text-muted-foreground">
          <TitleChars />
        </h2>

        {/* ── the cascade — giant Syne focal words ─────────────────────────── */}
        <div className="flex flex-col gap-[clamp(4px,1.1vh,14px)]">
          {SKILLS.map((s, i) => (
            <div
              key={s}
              data-word
              className="flex items-baseline gap-[clamp(10px,1.8vw,26px)] will-change-[transform,filter]"
            >
              <span className="w-[2.4ch] shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(24px,6.2vw,66px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground">
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
