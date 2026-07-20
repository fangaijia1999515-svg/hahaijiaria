"use client"

/**
 * V2 STORY — the homepage below the hero + statement. Live composition:
 *   AtmosphereGround (static cream gradient behind the light chapters)
 *   -> WorkGallery (imported; pinned horizontal gallery + Shape/System/
 *      Software handoff)
 *   -> WorldBreather (textless lake band; slated for removal per
 *      POST-WORK-SPEC.md once she approves block 2)
 *   -> AboutChapter (cream rising panel, credentials)
 *   -> SignatureClose (dark rising close: contact, live Santa Clara clock,
 *      self-drawing monogram; glow removed per death list 2026-07-06)
 *
 * Motion rules: rides the site-wide Lenis clock; shared ease V2_EASE;
 * gsap.matchMedia gates desktop/mobile/reduced-motion; CSS default = readable
 * end state. The old five-chapter ledger model (ProgressRail, V2Thesis,
 * ProjectBand/SelectedWork, SideBuilds) was retired and deleted 2026-07-06;
 * see git history if archaeology is ever needed. Native cursor throughout.
 */
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap, useGSAP, ScrollTrigger, V2_EASE } from "@/lib/gsap"
import { Container, DsLink, Logo } from "@/components/ds"
import { Magnet } from "@/components/v2/magnet"
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/ds/monogram-path"
import { RevealLines } from "@/components/v2/motion"
import { Reveal } from "@/components/v2/reveal"
import { WorkGallery } from "@/components/v2/work-gallery"
import { CapabilitySection, RecordSection } from "@/components/v2/postwork"
import { WaterClose } from "@/components/v2/water-close"
import { FlipCards, resolveFlip, type Style, type BackDesign } from "@/app/lab/zone/zone-demos"

const DESKTOP = "(min-width: 721px) and (prefers-reduced-motion: no-preference)"
const MOBILE = "(max-width: 720px) and (prefers-reduced-motion: no-preference)"
const MOTION = "(prefers-reduced-motion: no-preference)"

/* ===========================================================================
   GROUND — one clean, continuous cream gradient behind the whole light story
   (AD ruling 2026-07-06: the blurred landscape + visible grain are gone; they
   only showed through on empty screens and read as a smudge). Static, no
   parallax, decorative, aria-hidden.
   =========================================================================== */
function AtmosphereGround() {
  return (
    <div className="v2-ground" aria-hidden="true">
      <div className="v2-ground__grain" />
    </div>
  )
}

/* small helper: flatten a chapter's rounded top as it rises into view (trionn
   rising panel). Desktop-only; mobile / reduced motion get a plain color band. */
function useRisingPanel(
  ref: React.RefObject<HTMLElement | null>,
  fromRadius = 48,
  endStr = "top 55%",
) {
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(DESKTOP, () => {
      gsap.fromTo(
        el,
        { borderTopLeftRadius: fromRadius, borderTopRightRadius: fromRadius },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: endStr, scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, { scope: ref })
}

function LocalClock() {
  const [label, setLabel] = useState("")
  useEffect(() => {
    // hardcoded to her local time — Santa Clara, CA (America/Los_Angeles). The
    // label names her place, not the visitor's; the time is HER local time.
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const tick = () => setLabel(`SANTA CLARA, CA ${fmt.format(new Date())}`)
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  // rendered client-side only; empty on first paint to avoid hydration mismatch
  return <p className="ds-overline v2-clock" suppressHydrationWarning>{label}</p>
}

export function SignatureClose() {
  const rootRef = useRef<HTMLElement>(null)
  const strokeRef = useRef<SVGPathElement>(null)
  const fillRef = useRef<SVGPathElement>(null)
  useRisingPanel(rootRef, 56, "top 45%")

  useGSAP(() => {
    const stroke = strokeRef.current
    const fill = fillRef.current
    if (!stroke || !fill) return
    const mm = gsap.matchMedia()
    mm.add(MOTION, () => {
      const len = stroke.getTotalLength()
      gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
      gsap.set(fill, { opacity: 0 })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".v2-signature", start: "top 75%", once: true },
      })
      // the glyph writes itself, then settles into ink
      tl.to(stroke, { strokeDashoffset: 0, duration: 1.4, ease: V2_EASE })
        .to(fill, { opacity: 1, duration: 0.4, ease: V2_EASE }, ">-0.05")
        .to(stroke, { opacity: 0, duration: 0.4, ease: V2_EASE }, "<")
    })
    return () => mm.revert()
  }, { scope: rootRef })

  return (
    <section
      ref={rootRef}
      id="contact"
      data-chapter="5"
      className="v2-chapter v2-chapter--dark v2-chapter--deep v2-chapter--rise ds-dark"
      style={{ zIndex: 6 }}
    >
      {/* an ultra-faint water shimmer under the close — organic light on the deep dark */}
      <span className="v2-close__shimmer" aria-hidden="true" />
      <Container>
        <div className="v2-close">
          <div className="v2-close__top">
            <Reveal>
              <p className="ds-overline">Contact</p>
            </Reveal>
            <RevealLines as="h2" className="ds-h1 v2-close__line" start="top 82%">
              Tell me what you&apos;re building.
            </RevealLines>
            <Reveal delay={120}>
              <div className="v2-contact__links">
                {/* quiet magnetic lean on the three real contact paths */}
                <Magnet>
                  <DsLink href="mailto:hahaijiarah@gmail.com">hahaijiarah@gmail.com</DsLink>
                </Magnet>
                <Magnet>
                  <DsLink href="https://www.linkedin.com/in/aijia-fang" target="_blank" rel="noreferrer">
                    LinkedIn
                  </DsLink>
                </Magnet>
                <Magnet>
                  <DsLink href="/aijia-fang-resume.pdf" target="_blank">
                    Resume
                  </DsLink>
                </Magnet>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div>
                <p className="ds-overline v2-avail">
                  Open to product and service design roles &middot; Bay Area
                </p>
                <LocalClock />
              </div>
            </Reveal>
          </div>

          <div className="v2-signature">
            <svg
              className="v2-signature__mark"
              viewBox={MONOGRAM_VIEWBOX}
              role="img"
              aria-label="Aijia Fang monogram"
            >
              <path ref={strokeRef} className="v2-signature__stroke" d={MONOGRAM_PATH} fillRule="evenodd" />
              <path ref={fillRef} className="v2-signature__fill" d={MONOGRAM_PATH} fillRule="evenodd" />
            </svg>
          </div>

          <footer className="v2-footer">
            <Logo tagline="" size={18} />
            <p className="ds-overline">© 2026 &middot; Designed and built by Aijia Fang</p>
          </footer>
        </div>
      </Container>
    </section>
  )
}

/* ===========================================================================
   HOMEPAGE CARDS ZONE (/v2?cards=dark|night|glass|noir|noir2) — mounts the zone
   lab's FlipCards deck IN PLACE OF the CapabilitySection, between the gallery
   handoff and Method. The `.zone-lab` class both supplies the champagne --zone-*
   tokens AND is the element FlipCards' dusk crossfade tweens (via root.closest),
   so on /v2 the PAGE GROUND here is this cream wrapper: it dips to charcoal on
   approach and lifts back on exit exactly as on /lab/zone, scoped to the deck.
   Dark-stage styles get the same transparent cream runway spacers so the
   crossfade has room to fall and rise. basePriority=0 keeps this pin and the
   WorkGallery pin above refreshing in document order (see FlipCards' prop doc).
   zone.css is imported on /v2 by the page. Without ?cards, this never mounts and
   Capability renders byte-identically to before.
   =========================================================================== */
function V2CardsZone({ style, back }: { style: Style; back: BackDesign }) {
  const isDarkStage = style !== "dark"
  return (
    <div className="zone-lab v2-cardszone" style={{ position: "relative" }}>
      {/* cream feather over the zone's top edge: the dusk crossfade darkens
          this wrapper's own background, which used to meet the cream
          Background page as a hard horizontal line (her 2026-07-19 recording).
          INLINE + real DOM because build-processed pseudo-element rules for
          this got swallowed (the recurring CSS-pipeline pathology). Lives in
          the 42vh entry runway, above the deck content. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "clamp(140px, 34vh, 380px)",
          zIndex: 1,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, #F5F0E8, rgba(245, 240, 232, 0))",
        }}
      />
      {isDarkStage && <div className="zone-fspacer zone-fspacer--top" aria-hidden="true" />}
      <FlipCards s={style} back={back} basePriority={0} />
      {isDarkStage && <div className="zone-fspacer zone-fspacer--btm" aria-hidden="true" />}
    </div>
  )
}

/* ===========================================================================
   STORY ROOT — assembles the five chapters, the atmosphere ground, and the
   progress rail below the (locked) hero.
   =========================================================================== */
export function V2Story({
  cards,
  back,
}: {
  cards?: string
  back?: string
} = {}) {
  // refresh once fonts are ready so triggers/measurements are correct
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(refresh)
    }
    window.addEventListener("load", refresh)
    return () => window.removeEventListener("load", refresh)
  }, [])

  // ?cards=<flip style> (+ optional ?back=) swaps Capability for the zone deck;
  // resolveFlip validates both client-side and returns null for the normal path.
  const flip = resolveFlip(cards, back)

  return (
    <>
      <AtmosphereGround />
      {/* Chapters 2+3 merged (her call, 2026-07-02): all seven projects ride
          ONE horizontal gallery (trionn model, lab-tested at /v2/lab/work),
          which hands off through the stacked words into About. The old
          ledger sections were deleted 2026-07-06, the rise/wipe page-turn
          trials 2026-07-19 (rejected; see memory / scratchpad backups). */}
      <WorkGallery />
      {/* post-work order (her 2026-07-19 call): the RECORD (honors + schools)
          stands FIRST as the credentials moment, then the skills cards deck.
          The Method section ("How I work") was cut the same day. */}
      <RecordSection />
      {flip ? <V2CardsZone style={flip.style} back={flip.back} /> : <CapabilitySection />}
      {/* WATER CLOSE (2026-07-10, her call): the contact finale rides her
          real water video + ripple sim. SignatureClose above stays dormant —
          swap the next line back to <SignatureClose /> to revert. */}
      <WaterClose />
    </>
  )
}
