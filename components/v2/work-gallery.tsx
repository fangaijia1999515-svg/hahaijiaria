"use client"

/**
 * WORK GALLERY — the production horizontal work section on /v2.
 * ---------------------------------------------------------------------------
 * Her pick from /v2/lab/work (2026-07-02): the "Test B2 layout, no texture"
 * version. trionn's cell model in her quiet-luxury voice:
 *   - the track is a row of 50vw cells; the dune image + title own the first
 *     cell, so the split lands exactly at screen center on entry;
 *   - a short dead zone at pin start (arriving never nudges the row), then
 *     the row pans left 1:1 with the wheel;
 *   - each incoming project starts almost fully below the viewport and rises
 *     to level while it travels in; the first project skips the rise;
 *   - projects separate through whitespace, not rules — no counts, no year
 *     or discipline tags; every name carries one full sentence;
 *   - a closing text cell ends the row, then the giant stacked words hand
 *     the scroll to About (their work -> services move).
 * Mobile and reduced-motion get a plain vertical stack (CSS-gated, nothing
 * hidden from either).
 */
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap, useGSAP } from "@/lib/gsap"
import { PlasmaScoped } from "@/app/lab/bg/flow-effects"
import { GallerySeamBlur } from "@/components/v2/seams"
import { ThroughlineCell } from "@/components/v2/gap-close"

const GALLERY_MOTION =
  "(min-width: 901px) and (prefers-reduced-motion: no-preference)"

type GalleryEntry = {
  name: string
  line: string
  /* recruiter-scan tags (her 2026-07-19 call, per her reference shots): the
     disciplines each project PROVES, so a hiring screen reads the fit in one
     glance. Real skills only. */
  tags: readonly string[]
  img?: string
  alt?: string
  href?: string
  /* scale the art up inside the plate (crops away a painted card's own
     border, e.g. the Moonlit Garden frame edges) */
  zoom?: boolean
  kind: "img" | "sds" | "antara" | "mood" | "spectra"
}

const GALLERY: GalleryEntry[] = [
  {
    name: "Nuzzle",
    line: "A cat care companion that matches adopters with the right cat, then supports the fragile first month.",
    tags: ["Product Design", "UX/UI Design", "Service Design"],
    img: "/image/Nuzzle/hero2.webp",
    alt: "Nuzzle adoption service ecosystem",
    href: "/work-classic/nuzzle", kind: "img",
  },
  {
    name: "Skya",
    line: "Service design for an autonomous last-mile delivery network, from vehicle to dispatch to doorstep.",
    tags: ["Service Design", "UX/UI Design", "Business Strategy"],
    img: "/image/skya/heroshot.webp",
    alt: "Skya autonomous delivery vehicle",
    href: "/work-classic/skya", kind: "img",
  },
  {
    name: "Eau de Toi",
    line: "An in-store scent experience that reads your personality and matches you to a fragrance.",
    tags: ["Service Design", "UX/UI Design", "AI Product"],
    img: "/image/eaudetoi/image/edthome01.webp",
    alt: "Eau de Toi multisensory scent retail experience",
    href: "/work-classic/eau-de-toi", kind: "img",
  },
  /* the in-build shelf keeps ONE entry (her 2026-07-19 calls: four embeds was
     too many, and the one that stays is the CURRENT product — the tarot
     companion that replaced the Antara astrology idea). The plate is her own
     painted deck back (the night-garden she chose); the name is the world's
     working title from her art guide, hers to rename. */
  {
    name: "Moonlit Garden",
    line: "A gentle tarot companion that draws a card for the day and reads it with you.",
    tags: ["AI-Native Build", "Product Design"],
    img: "/image/cards/moonlit-cover-md.jpg",
    alt: "Moonlit Garden tarot card artwork, valley and still water",
    zoom: true,
    kind: "img",
  },
]

function GalleryPlate({ e }: { e: GalleryEntry }) {
  if (e.kind === "img") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`v2wg-card__img${e.zoom ? " v2wg-card__img--zoom" : ""}`}
        src={e.img}
        alt={e.alt ?? `${e.name} cover`}
      />
    )
  }
  return (
    <div className={`v2wg-card__art v2wg-card__art--${e.kind}`} aria-hidden="true">
      {e.kind === "sds" && <span className="v2wg-card__artname">ShortDramaStudio</span>}
      {e.kind === "antara" && <span className="v2wg-card__artname v2wg-card__artname--serif">A N T A R A</span>}
    </div>
  )
}

function GalleryCard({ e }: { e: GalleryEntry }) {
  return (
    <article className="v2wg-card">
      {e.href ? (
        <Link href={e.href} className="v2wg-card__platelink" aria-label={`View the ${e.name} case study`}>
          <div className="v2wg-card__plate"><GalleryPlate e={e} /></div>
        </Link>
      ) : (
        <div className="v2wg-card__plate"><GalleryPlate e={e} /></div>
      )}
      <div className="v2wg-card__foot">
        <h3 className="v2wg-card__name">{e.name}</h3>
        <div className="v2wg-card__row">
          <p className="v2wg-card__line">{e.line}</p>
          {e.href ? (
            <Link href={e.href} className="v2wg-card__cta">View →</Link>
          ) : (
            <span className="v2wg-card__cta v2wg-card__cta--quiet">In build</span>
          )}
        </div>
        <div className="v2wg-card__tags" aria-label="Disciplines">
          {e.tags.map((t) => (
            <span key={t} className="v2wg-tag">{t}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export function WorkGallery({ seam = true }: { seam?: boolean } = {}) {
  const stageRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const mm = gsap.matchMedia()
    mm.add(GALLERY_MOTION, () => {
      const iw = window.innerWidth
      const ih = window.innerHeight
      const cell = iw / 2
      const amount = track.scrollWidth - iw
      const hold = ih * 0.15
      /* settle-hold TAIL (2026-07-19): the pan used to fill the pin exactly,
         which was fine while the Shape/System/Software buffer section stood
         below — the scrub's catch-up lag resolved off-screen behind it. With
         that section deleted (Record now follows immediately), the pin
         released while the last card was still catching up, so the row never
         seated (her bug: "划不到最后一个就直接下一章"). The tail keeps the
         stage pinned for an extra beat AFTER the pan completes, so the last
         card rests fully seated before the page moves on. */
      /* THROUGHLINE ACT (2026-07-19, her trionn+monolog brief): the pan's
         last cell is the full-viewport dark throughline panel, so the "page
         turn" is HORIZONTAL — the panel slides in from the right over the
         final beat of the pan. Then, still pinned, the gap-close plays
         (closeSpan of scroll), and a settle tail lets the closed line rest
         before release. */
      const closeSpan = ih * 1.2
      const tail = ih * 0.5
      const total = hold + amount + closeSpan + tail
      const hf = hold / total
      const panDur = amount / total
      const closeDur = closeSpan / total

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
      /* FUNCTIONAL target (2026-07-19 strip-bug fix): late font loading can
         change the throughline line's width; if that ever nudged the track's
         scrollWidth after setup, a captured -amount fell short and the panel
         stopped with a sliver of the previous cell showing (her screenshot).
         The function re-resolves on every refresh (fonts.ready triggers one),
         and the cell's own overflow:hidden (v2.css) stops the growth at the
         source. */
      tl.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        duration: panDur,
      }, hf)
      /* the post-pan beats must exist as TIMELINE TIME or scrub normalizes
         them away (ScrollTrigger maps pin progress onto the timeline's own
         duration): an inert tween pads the timeline to duration 1. */
      tl.to({}, { duration: 1 - hf - panDur }, hf + panDur)

      /* the gap-close, on the panel that just slid in: the window IS the gap —
         scroll squeezes it to exactly ONE WORD SPACE (0.24em keeps the breath
         after the comma), then the claim lands beneath. CSS rests CLOSED for
         every no-motion context; this branch opens it at setup. */
      const win = stage.querySelector<HTMLElement>(".v2gc-win")
      const gsub = stage.querySelector<HTMLElement>(".v2gc-sub")
      if (win && gsub) {
        gsap.set(win, {
          width: "min(17vw, 280px)",
          height: "min(40svh, 430px)",
          marginInline: "clamp(18px, 2vw, 32px)",
          opacity: 1,
        })
        gsap.set(gsub, { autoAlpha: 0, y: 14 })
        const c0 = hf + panDur
        /* pinch BOTH dimensions — width alone left a tall white pole mid-close
           (her sand ground made it glaring); closing height in step reads as a
           card being pressed shut between the two halves */
        tl.to(win, { width: "0.24em", marginInline: 0, ease: "none", duration: closeDur * 0.66 }, c0)
          .to(win, { height: "1.1em", ease: "none", duration: closeDur * 0.66 }, c0)
          .to(win, { opacity: 0, ease: "none", duration: closeDur * 0.08 }, c0 + closeDur * 0.6)
          .to(gsub, { autoAlpha: 1, y: 0, ease: "power2.out", duration: closeDur * 0.22 }, c0 + closeDur * 0.72)
      }

      const panT = (px: number) =>
        hf + (Math.min(Math.max(px, 0), amount) / amount) * panDur
      const cards = gsap.utils.toArray<HTMLElement>(".v2wg-cell--card .v2wg-card", track)
      cards.forEach((card, k) => {
        if (k === 0) return
        const enter = cell * (k - 1)
        const settle = enter + cell * 1.5
        const t0 = panT(enter)
        const t1 = panT(settle)
        tl.fromTo(card, { y: ih * 0.8 }, { y: 0, ease: "none", duration: t1 - t0 }, t0)
      })

      /* SEAM 2 (statement -> gallery) — her approved top blur, now scrub-GATED so
         it obeys the same doctrine: opacity 0 while resting mid-statement, then
         it BLOOMS as the gallery rises into its pin (softening the work-lead
         photo's top edge against the statement's cream tail), and is gone again
         before the sustained pan so a rested pinned gallery reads pristine.
         Anchored to the never-pinned .v2-stmtwrap bottom (0% at "bottom bottom"
         = gallery first peeks, 100% at "bottom top" = pin engages), so it stays
         entirely clear of the pin's frozen coordinate space. Reduced motion /
         <901px never reach this block, so the blur stays at its CSS default
         (opacity 0) — no seam effect, exactly as the doctrine wants. */
      if (seam) {
        const gblur = stage.querySelector<HTMLElement>(".v2-seam-blur--gallery-top")
        const stmt = document.querySelector<HTMLElement>(".v2-stmtwrap")
        if (gblur && stmt) {
          gsap
            .timeline({
              // start held back to "bottom bottom-=12%" so the blur is a clean 0
              // through the statement's reading zone (copy sits at the top) and
              // only wakes once the gallery is clearly entering from below; ends
              // at "bottom top" = the exact scroll the pin engages, so it is gone
              // for the whole sustained pan.
              scrollTrigger: { trigger: stmt, start: "bottom bottom-=12%", end: "bottom top", scrub: 0.8 },
            })
            .fromTo(gblur, { opacity: 0 }, { opacity: 1, ease: "power2.out", duration: 0.82 })
            .to(gblur, { opacity: 0, ease: "power1.in", duration: 0.18 })
        }
      }
    })
    return () => mm.revert()
  }, { scope: stageRef })

  return (
    <>
      <section
        ref={stageRef}
        id="work"
        data-chapter="2"
        className="v2wg-stage"
        data-seam={seam ? "on" : undefined}
        style={{ zIndex: 3 }}
      >
        {/* plasma light, DEFAULT-ON (her approval 2026-07-12; trial param
            retired): absolute layer inside the stage. z-index:-1 paints it
            above the cream ground but below every in-flow cell, so it fills
            only the cream emptiness beside the plates and never covers a
            card. Delete this block + the PlasmaScoped import to revert. */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none" }}
        >
          <PlasmaScoped />
        </div>
        <div ref={trackRef} className="v2wg-track">
          <div className="v2wg-cell v2wg-cell--lead">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="v2wg-lead__bg" src="/image/v2/work-lead.jpg" alt="" aria-hidden="true" />
            <header className="v2wg-lead">
              <h2 className="v2wg-lead__title">Selected <em>work.</em></h2>
              <p className="v2wg-lead__sub">Case studies and self-initiated builds.</p>
            </header>
          </div>
          {GALLERY.map((e) => (
            <div key={e.name} className="v2wg-cell v2wg-cell--card">
              <GalleryCard e={e} />
            </div>
          ))}
          {/* the throughline panel: the track's final, full-viewport cell —
              the sideways page turn her trionn reference asked for. The pin
              timeline above drives its gap-close after the pan completes. */}
          <ThroughlineCell />
        </div>
        {/* the APPROVED statement->gallery dissolve (default ON) — a GradualBlur
            melting the work-lead dune photo's top edge as the stage pins in, so
            the fold reads as one continuous sand. Fixed to the stage, so it rides
            the pin. z:4 keeps it above the track; the top ~12svh is above the
            centered cards/title. */}
        {seam && <GallerySeamBlur />}
      </section>

      {/* the "Shape. System. Software." handoff was DELETED 2026-07-19 (her
          verdict: dry placeholder; AD ruling: the triad now lives as the
          Record section's spine). The gallery unpins straight into Record. */}
    </>
  )
}
