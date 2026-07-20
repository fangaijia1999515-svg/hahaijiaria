"use client"

/**
 * HERO LAB — shared parts (client).
 * The nav + arriving headline are COPIED from the live hero (components/v2/hero.tsx)
 * and re-scoped `hl-` so the lab never imports or mutates the shipped hero.
 * Her locked headline moment is preserved exactly: "Designed," lands first,
 * "then built." arrives after a beat and STAYS. Reduced-motion lands on the
 * end state with no transition.
 */
import { useEffect, useRef, type MouseEvent } from "react"
import { Container, Logo, IconArrowRight } from "@/components/ds"

const NAV_LINKS = [
  { label: "Work", hash: "#work" },
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
]

const PIVOT_DELAY_MS = 1800

/** Nav is inert in the lab (no real anchors to scroll to); it is here purely so
 *  the seam is judged with the real chrome in frame. */
export function LabNav() {
  const noop = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault()
  return (
    <div className="hl-hero__navwrap">
      <Container wide>
        <nav className="ds-nav hl-nav" aria-label="Primary (preview)">
          <a href="#" className="hl-nav__brand" aria-label="Aijia Fang" onClick={noop}>
            <Logo tagline="" size={20} />
          </a>
          <div className="ds-nav__links">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href="#" className="ds-nav__link" onClick={noop}>
                {l.label}
              </a>
            ))}
          </div>
          <a className="ds-btn ds-btn--solid ds-btn--sm" href="#" onClick={noop}>
            Get in touch
          </a>
        </nav>
      </Container>
    </div>
  )
}

/** Hero copy block with her locked arriving-headline moment. */
export function LabHeroContent() {
  const arriveRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = arriveRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in")
      return
    }
    const t = window.setTimeout(() => el.classList.add("is-in"), PIVOT_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <Container className="hl-hero__content">
      <p className="ds-overline hl-hero__overline">
        AI-native product and service designer · Santa Clara, CA
      </p>
      <h1 className="ds-h1 hl-hero__title">
        <span className="ds-italic">Designed,</span>
        <span className="hl-arrive" ref={arriveRef}>then built.</span>
      </h1>
      <p className="ds-body-lg hl-hero__sub">
        Product and service design, from first sketch to running software.
      </p>
      <button type="button" className="ds-btn ds-btn--primary ds-btn--lg hl-hero__cta">
        View work
        <IconArrowRight size={16} className="ds-btn__arrow" />
      </button>
    </Container>
  )
}

/** Mock "chapter one": her thesis line + a floema-style pile, plus a note to
 *  give the seam real scroll length. Content is identical across versions so
 *  only the GROUND treatment differs when she compares. */
export function LabThesisBlock() {
  return (
    <>
      <div className="hl-thesis">
        <p className="ds-overline hl-thesis__over">Chapter one · the thesis</p>
        <p className="hl-thesis__line">
          I design the experience, then build what runs behind it.
        </p>
        <p className="ds-body-lg hl-thesis__note">
          Not two jobs handed off, one hand. The research, the flows, the type,
          and the software that ships it, held by the same person.
        </p>
      </div>

      <div className="hl-pile" aria-hidden="true">
        <figure className="hl-pile__item hl-pile__item--a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/eaudetoi/image/edthome01.webp" alt="" loading="lazy" />
        </figure>
        <figure className="hl-pile__item hl-pile__item--b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/Nuzzle/hero2.webp" alt="" loading="lazy" />
        </figure>
        <figure className="hl-pile__item hl-pile__item--c">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ds/moodboard/nature-flora.png" alt="" loading="lazy" />
        </figure>
      </div>
    </>
  )
}
