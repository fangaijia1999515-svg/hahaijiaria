"use client"

/**
 * WORK GALLERY LAB — trionn-model horizontal work gallery, TEST ONLY.
 * ---------------------------------------------------------------------------
 * Rebuilt against her 2026-07-02 recording of trionn.com (vid/f4). The real
 * trionn structure, now mirrored here:
 *   - the track is a row of 50vw CELLS separated by hairlines; the title
 *     occupies the first cell, so at rest the divider sits EXACTLY at the
 *     screen center (title left half, first project right half);
 *   - scroll pins the stage and pans the row left 1:1 with the wheel;
 *   - each INCOMING project starts almost fully below the viewport and rises
 *     to level as it travels in — trionn's move at its real depth;
 *   - a short dead zone at pin start so arriving never nudges the row;
 *   - project images are large (~42vw), name + full-sentence line below;
 *   - a closing text cell ends the row, then the stage unpins into the
 *     giant stacked-words handoff (their services move, in her voice).
 * No counts, no indices, no year/discipline tags (her call). Projects are
 * separated by WHITESPACE, not rules — lines are trionn's grid language,
 * ours is air + soft plates; only the entry keeps its structural center
 * spine, which matches the ledger's hairline usage on /v2.
 *
 * Desktop + full-motion only for the pinned pan; mobile and reduced-motion
 * get a plain vertical stack (CSS-gated, no hidden content).
 */
import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

const DESKTOP_MOTION =
  "(min-width: 901px) and (prefers-reduced-motion: no-preference)"

type Entry = {
  name: string
  line: string
  stat?: string
  cap?: string
  img?: string
  kind: "img" | "sds" | "antara" | "mood" | "spectra"
}

const ENTRIES: Entry[] = [
  {
    name: "Skya",
    line: "Service design for an autonomous last-mile delivery network, from vehicle to dispatch to doorstep.",
    stat: "$5.14M", cap: "Projected year one revenue",
    img: "/image/skya/heroshot.webp", kind: "img",
  },
  {
    name: "Nuzzle",
    line: "A shelter-integrated companion for the hard first 30 days after adoption, when half of all returns happen.",
    stat: "50%", cap: "Of adopted cats are returned within 30 days",
    img: "/image/Nuzzle/hero2.webp", kind: "img",
  },
  {
    name: "Eau de Toi",
    line: "An in-store scent experience that reads your personality and matches you to a fragrance.",
    stat: "Awarded", cap: "Indigo Design Awards 2026 · IDA 2025",
    img: "/image/eaudetoi/image/edthome01.webp", kind: "img",
  },
  {
    name: "ShortDramaStudio",
    line: "An AI pipeline that turns a written script into finished short drama episodes, automatically.",
    kind: "sds",
  },
  {
    name: "Antara",
    line: "A live Vedic astrology reader that renders your birth chart and explains it in plain language.",
    kind: "antara",
  },
  {
    name: "Mood Weather",
    line: "A small companion app that translates your day into weather, so feelings become easier to see.",
    kind: "mood",
  },
  {
    name: "Spectra",
    line: "A tool that composes complete color systems from a single seed, tuned for real interfaces.",
    kind: "spectra",
  },
]

function Plate({ e }: { e: Entry }) {
  if (e.kind === "img") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="wl-card__img" src={e.img} alt={`${e.name} cover`} />
    )
  }
  return (
    <div className={`wl-card__art wl-card__art--${e.kind}`} aria-hidden="true">
      {e.kind === "sds" && <span className="wl-card__artname">ShortDramaStudio</span>}
      {e.kind === "antara" && <span className="wl-card__artname wl-card__artname--serif">A N T A R A</span>}
    </div>
  )
}

function Card({ e }: { e: Entry }) {
  return (
    <article className="wl-card">
      <div className="wl-card__plate"><Plate e={e} /></div>
      <div className="wl-card__foot">
        <h3 className="wl-card__name">{e.name}</h3>
        <div className="wl-card__row">
          <p className="wl-card__line">{e.line}</p>
          <span className="wl-card__cta">View →</span>
        </div>
        {e.stat && (
          <div className="wl-card__proof">
            <span className="wl-card__chip">{e.stat}</span>
            <span className="wl-card__cap">{e.cap}</span>
          </div>
        )}
      </div>
    </article>
  )
}

type StageVariant = "bgimg" | "leadimg" | "leadimg2" | "line" | "noline"

const LEAD_IMG: Record<string, string> = {
  leadimg: "/image/lab/lead-hills.jpg",
  leadimg2: "/image/lab/lead-dunes.jpg",
}

function Stage({ variant }: { variant: StageVariant }) {
  const stageRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const mm = gsap.matchMedia()
    mm.add(DESKTOP_MOTION, () => {
      const iw = window.innerWidth
      const ih = window.innerHeight
      const cell = iw / 2
      const amount = track.scrollWidth - iw
      // small dead zone so arriving does not nudge the row, but short enough
      // that the scroll never feels stuck (her round-four note)
      const hold = ih * 0.15
      const total = hold + amount
      const hf = hold / total

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${total}`,
          scrub: 0.9,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
      tl.to(track, { x: -amount, ease: "none", duration: 1 - hf }, hf)

      // trionn's signature, at full depth: the incoming project starts almost
      // entirely below the viewport (a sliver of the plate showing) and rises
      // to level while it travels toward center. First project skips it.
      const panT = (px: number) =>
        hf + (Math.min(Math.max(px, 0), amount) / amount) * (1 - hf)
      const cards = gsap.utils.toArray<HTMLElement>(".wl-cell--card .wl-card", track)
      cards.forEach((card, k) => {
        if (k === 0) return
        const enter = cell * (k - 1) // pan px when the cell tip reaches the right edge
        const settle = enter + cell * 1.5 // level by the time it crosses center
        const t0 = panT(enter)
        const t1 = panT(settle)
        tl.fromTo(
          card,
          { y: ih * 0.8 },
          { y: 0, ease: "none", duration: t1 - t0 },
          t0,
        )
      })
    })
    return () => mm.revert()
  }, { scope: stageRef })

  return (
    <section ref={stageRef} className={`wl-stage wl-stage--${variant}`}>
      {variant === "bgimg" && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wl-stage__bg" src="/image/lab/bg-dunes.jpg" alt="" aria-hidden="true" />
          <span className="wl-stage__bgwash" aria-hidden="true" />
        </>
      )}
      {variant === "leadimg2" && <span className="wl-stage__grain" aria-hidden="true" />}
      <div ref={trackRef} className="wl-track">
        <div className="wl-cell wl-cell--lead">
          {LEAD_IMG[variant] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="wl-lead__bg" src={LEAD_IMG[variant]} alt="" aria-hidden="true" />
          )}
          <header className="wl-lead">
            <h2 className="wl-lead__title">Selected <em>work.</em></h2>
            <p className="wl-lead__sub">Case studies and self-initiated builds.</p>
          </header>
        </div>
        {ENTRIES.map((e) => (
          <div key={e.name} className="wl-cell wl-cell--card">
            <Card e={e} />
          </div>
        ))}
        <div className="wl-cell wl-cell--close">
          <div className="wl-close">
            <p className="wl-close__text">
              The complete collection, from shipped case studies to builds
              still finding their shape.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function WorkGalleryLab() {
  return (
    <div className="wl">
      <section className="wl-intro">
        <p className="ds-overline wl-intro__over">Work gallery lab · round four</p>
        <h1 className="wl-intro__title">Four takes on the entry.</h1>
        <p className="wl-intro__body">
          Same gallery four times, different first impressions: an image
          living behind the whole ride, an image under the title only, the
          center line, and pure air. The entry hold is now one third as long,
          so the row answers the wheel right away. Scroll through and pick.
        </p>
      </section>

      <p className="wl-label"><span>Test A</span> Image on the right, riding to the end</p>
      <Stage variant="bgimg" />

      <p className="wl-label"><span>Test B</span> Image under the title, then plain</p>
      <Stage variant="leadimg" />

      <p className="wl-label"><span>Test B2</span> Dune image under the title, textured ground after</p>
      <Stage variant="leadimg2" />

      <p className="wl-label"><span>Test C</span> Center line</p>
      <Stage variant="line" />

      <p className="wl-label"><span>Test D</span> No line, pure air</p>
      <Stage variant="noline" />

      <section className="wl-handoff">
        <p className="ds-overline wl-handoff__over">Then, the handoff to the next chapter</p>
        <h2 className="wl-handoff__words">
          <span>Shape.</span>
          <span>System.</span>
          <span>Software.</span>
        </h2>
        <p className="wl-handoff__note">
          The gallery unpins and this receives the scroll, the way their work
          section lands on A.I. Design Development Branding. From here we flow
          into About.
        </p>
      </section>
    </div>
  )
}
