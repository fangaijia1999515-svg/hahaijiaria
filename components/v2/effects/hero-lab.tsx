"use client"

/**
 * HERO LAB — /v2/lab/hero only. Round 2 per her feedback (2026-07-02):
 * demos 1-4 stay, demo 5 (monolog crop) is cut, and the winning composition
 * (demo 1's giant centered serif) now runs across all three landscapes so
 * the choice left is image + navigator, not layout:
 *   1   lake + tree     · demo 1 composition, minimal text nav
 *   1B  lake + tree     · same, but the REAL site navigator (raised ds-nav
 *                         bar + wordmark + solid CTA — her "high-tech" one)
 *   2   house + orb     · demo 1 composition, site navigator
 *   3   sculpted path   · demo 1 composition, site navigator
 *   4   house + two trees · editorial corners (kept as the one alternative)
 * Shared rules: background lives in the hero ONLY, copy states each identity
 * exactly once, every glyph is design-system type.
 */
import { Logo } from "@/components/ds"

type HeroHeaderProps = { cta?: string }

/* the borderless hero nav she picked: her real wordmark (leaf tittle on the
   i) hard left, links + pill CTA hard right */
function HeroHeader({ cta = "Let's talk" }: HeroHeaderProps) {
  return (
    <header className="hl-nav" aria-hidden="true">
      <span className="hl-nav__logo"><Logo tagline="" size={22} /></span>
      <nav className="hl-nav__links">
        <span>Work</span>
        <span>About</span>
        <span>Contact</span>
      </nav>
      <span className="hl-nav__cta">{cta}</span>
    </header>
  )
}

/* the winning center layout, restructured per the RabenRifaie read
   (2026-07-02): the headline lives alone in the pale sky band; the sub and
   the CTA drop to the dark grass band in solid cream, no glow. Contrast
   comes from placement, not effects. */
function CenterBlock({ line1, line2, flip }: { line1: string; line2: string; flip?: boolean }) {
  return (
    <>
      <div className="hl-center hl-center--sky">
        <h2 className="hl-huge">
          <span className={flip ? "hl-huge__it" : undefined}>{line1}</span>
          <span className={flip ? undefined : "hl-huge__it"}>{line2}</span>
        </h2>
      </div>
      <div className="hl-ground">
        <p className="hl-ground__sub">
          An AI-native product designer,<br />
          from industrial objects to working software.
        </p>
        <span className="hl-pill">View selected work →</span>
      </div>
    </>
  )
}

export function HeroLab() {
  return (
    <div className="hl">
      <section className="hl-intro">
        <p className="ds-overline hl-intro__over">Hero lab · round three</p>
        <h1 className="hl-intro__title">One layout, one navigator, three landscapes.</h1>
        <p className="hl-intro__body">
          The demo 1 composition on every landscape, all under the borderless
          nav with her real wordmark. Demo 4 stays as the one alternative
          layout.
        </p>
      </section>

      <p className="hl-label"><span>Demo 1</span> Lake and tree · "The organic made digital."</p>
      <section className="hl-demo hl-demo--1" style={{ backgroundImage: "url(/image/lab/hero-13.jpg)" }}>
        <HeroHeader />
        <CenterBlock line1="The organic" line2="made digital." flip />
        <p className="hl-corner hl-corner--bl hl-cream">Based in Santa Clara,<br />California.</p>
        <p className="hl-corner hl-corner--br ds-overline hl-cream">Scroll to explore</p>
      </section>

      <p className="hl-label"><span>Demo 2</span> House and orb · "Designed to feel, built to ship."</p>
      <section className="hl-demo hl-demo--2" style={{ backgroundImage: "url(/image/lab/hero-14.jpg)" }}>
        <HeroHeader />
        <CenterBlock line1="Designed to feel," line2="built to ship." />
        <p className="hl-corner hl-corner--bl hl-cream">Based in Santa Clara,<br />California.</p>
        <p className="hl-corner hl-corner--br ds-overline hl-cream">Scroll to explore</p>
      </section>

      <p className="hl-label"><span>Demo 3</span> Sculpted path · "The organic made digital."</p>
      <section className="hl-demo hl-demo--3" style={{ backgroundImage: "url(/image/lab/hero-15.jpg)" }}>
        <HeroHeader />
        <CenterBlock line1="The organic" line2="made digital." />
        <p className="hl-corner hl-corner--bl hl-cream">Based in Santa Clara,<br />California.</p>
        <p className="hl-corner hl-corner--br ds-overline hl-cream">Scroll to explore</p>
      </section>

      <p className="hl-label"><span>Demo 4</span> Two trees · editorial corners, statement low-left</p>
      <section className="hl-demo hl-demo--4" style={{ backgroundImage: "url(/image/lab/hero-16.jpg)" }}>
        <HeroHeader />
        <div className="hl-corner hl-corner--bigbl">
          <h2 className="hl-big hl-cream">
            <span>Quiet products,</span>
            <span className="hl-big__it">real outcomes.</span>
          </h2>
        </div>
        <div className="hl-corner hl-corner--infobr hl-cream">
          <p className="hl-sub">Aijia Fang · Designer who builds</p>
          <p className="hl-fine">Pratt industrial design, SCAD service design,<br />now shipping AI-native software.</p>
        </div>
      </section>

    </div>
  )
}
