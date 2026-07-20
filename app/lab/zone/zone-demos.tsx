"use client"

/**
 * ZONE LAB — candidate treatments for the homepage SKILLS zone that sits AFTER
 * Selected work and BEFORE the water footer. Isolated lab route (/lab/zone
 * ?d=1|2|3), noindex; nothing here ships until she picks.
 *
 * The references (contact sheets studied first), translated INTO her locked
 * quiet-luxury system (NOT their colors):
 *   d=1  CARDS V5 — the lusion "AREA OF EXPERTISE" grammar: a PINNED, SCROLL-
 *        SCRUBBED, fully reversible deck. The title holds alone, a single card
 *        back appears, multiplies into a fan, deals out in FREE SPACE (no line),
 *        then flips L→R into a settled row of FOUR. THREE style versions via ?s=
 *        dark (cream ground, warm-charcoal jewels) | night (dark charcoal STAGE
 *        + SOLID cream cards) | glass (dark STAGE + liquid-glass cards). Backs
 *        are her own tarot-style artwork — ONE shared back per deck via ?back=
 *        (valley|dune|water|nightgarden|nightbloom); settled cards tilt to the
 *        pointer. Her skin only. For BOTH dark-stage styles (night + glass) the
 *        whole PAGE ground crossfades cream→charcoal on approach (dusk) and back
 *        on exit (dawn), so the deck is dealt on true dark.
 *   d=2  salakhov services (upper) — quiet cards with tool chips + a big ghosted
 *        index number. The safe/minimal register. No theatrics.
 *   d=3  the combined ask — d=2's quiet cards, THEN a salakhov-lower horizontal
 *        journey band: a pinned sideways scroll through her education + honors on
 *        a thin baseline, with a gold progress line that fills as you go.
 *
 * Motion rules (house): rides the site-wide Lenis clock; shared ease V2_EASE;
 * gsap.matchMedia gates desktop / mobile / reduced-motion; CSS default = the
 * readable END state (no-JS safe) and GSAP sets the initial states then animates.
 * Mobile 390 stacks with no horizontal overflow; the horizontal journey degrades
 * to a vertical list with no pin. Copy is em-dash free, facts only.
 */
import { useRef } from "react"
import { gsap, useGSAP, V2_EASE } from "@/lib/gsap"
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/ds/monogram-path"

/** The five style versions (?s=), default dark (she likes it best).
 *  dark  = cream ground + warm-charcoal jewel cards (no crossfade).
 *  night = deep warm-charcoal STAGE + SOLID cream cards (dusk crossfade).
 *  glass = deep warm-charcoal STAGE + liquid-glass cards (dusk crossfade).
 *  noir  = DEEPER charcoal STAGE (#191713) + a LIGHTER warm-charcoal card
 *          (#2B2822) — a lit jewel on a deep stage; dusk crossfade.
 *  noir2 = noir INVERTED (her experiment): the two tones swap. Stage = the warm
 *          brown-charcoal (#2B2822, noir's old card tone); card = the DEEPER tone
 *          (#191713), now DARKER than the stage — the card reads as a silhouette /
 *          void on a lighter dark ground, its shape carried by the gold hairline,
 *          champagne rim light and vignette shadow. Dusk crossfade DARK = #2B2822.
 *  All four dark-stage styles (night + glass + noir + noir2) share isDarkStage
 *  (= s !== "dark"): the whole-page dusk crossfade, the cream spacers and the
 *  light head type. Only the CARD skin differs (solid cream / glass / solid dark),
 *  and noir + noir2 both drop the warm stage wash for a clean stage. */
export type Style = "dark" | "night" | "glass" | "noir" | "noir2"
/** Which back artwork the WHOLE deck wears (?back=). Her rule: one deck = ONE
 *  back (all four cards share it). Five of her tarot-style paintings; the
 *  default follows contrast with the ground — a dark back reads on the cream
 *  mid-deal (s=dark → nightbloom), a light back luminesces on the charcoal
 *  stage (s=glass | s=night → water). An explicit ?back= overrides the default. */
export type BackDesign = "valley" | "dune" | "water" | "nightgarden" | "nightbloom"
// module-local (not exported): keeping value exports out of this component
// module keeps Fast Refresh happy AND stops a Server Component from importing a
// "use client" runtime value (which arrives as a client-reference, not the array).
const BACK_DESIGNS: BackDesign[] = ["valley", "dune", "water", "nightgarden", "nightbloom"]
/** The default back per style, per her contrast rule (back must contrast ground).
 *  All three dark-stage styles (glass + night + noir) sit their backs on charcoal,
 *  so all default to the LIGHT `water` painting; only s=dark (cream ground) wants
 *  the dark `nightbloom`. The back is a separate FACE, so a light back is fine even
 *  behind a light (night) or dark (noir) front — the two never share a surface. */
function defaultBack(s: Style): BackDesign {
  return s === "dark" ? "nightbloom" : "water"
}

/** All five flip styles — for validating a raw ?cards= param. */
const FLIP_STYLES: Style[] = ["dark", "night", "glass", "noir", "noir2"]

/** Validate the raw ?cards= / ?back= strings (forwarded from the /v2 SERVER page)
 *  into a flip style + effective back, or null when `cards` names no valid flip
 *  style (the homepage then keeps its normal CapabilitySection). Lives here so ALL
 *  runtime validation stays in this "use client" module — V2Story (also a client
 *  component) imports and calls it; the Server page only forwards raw strings. */
export function resolveFlip(cards?: string, back?: string): { style: Style; back: BackDesign } | null {
  if (!cards || !(FLIP_STYLES as string[]).includes(cards)) return null
  const style = cards as Style
  const explicit = back && (BACK_DESIGNS as string[]).includes(back) ? (back as BackDesign) : undefined
  return { style, back: explicit ?? defaultBack(style) }
}

/* ------------------------------------------------------------------ data
   The curated skills DRAFT she will review — rendered EXACTLY as given. */
type Card = { id: string; index: string; title: string; skills: string[]; chips: string[] }

const CARDS: Card[] = [
  {
    id: "product",
    index: "01",
    title: "Product & Interaction Design",
    skills: [
      "Interaction & visual design",
      "Design systems & components",
      "Prototyping, wireframes & user flows",
      "Motion & micro-interactions",
      "Product strategy & business modeling",
    ],
    chips: ["Figma", "Illustrator", "Photoshop", "InDesign"],
  },
  {
    id: "service",
    index: "02",
    title: "Service Design & Research",
    skills: [
      "Service blueprints & journey mapping",
      "User research & stakeholder interviews",
      "Usability & A/B testing",
      "Workshop facilitation",
      "Systems thinking",
    ],
    chips: [],
  },
  {
    id: "ai",
    index: "03",
    title: "AI-Native Building",
    skills: [
      "Building real products with AI",
      "Rapid prototyping with AI",
      "Prompt engineering",
      "AI creative tools: image, video, voice",
      "ML literacy & data mining",
    ],
    chips: ["Claude Code", "Cursor", "ElevenLabs", "Orange"],
  },
]

/* ---- CARDS V6 DECK (demo 1 only) ----------------------------------------
   FOUR cards, each ONE capability with a DOMINANT serif title and a FEW airy
   items (hairline-separated, no bullets, no dashes). Backs are HER OWN tarot-
   style artwork (public/image/cards), full-bleed on the back face. Her rule:
   a deck has ONE back — all four cards wear the SAME painting, chosen by
   ?back= (or the per-style default). Kept as its OWN dataset so demos 2 + 3
   (the quiet cards above) are untouched. Copy is exactly as given. */
type FlipCard = { id: string; title: string; items: string[] }

const FLIP_CARDS: FlipCard[] = [
  {
    id: "product",
    title: "Product Design",
    items: [
      "Interaction & visual design",
      "Design systems & components",
      "Prototyping & user flows",
      "Motion & micro-interactions",
    ],
  },
  {
    id: "research",
    title: "UX Research",
    items: [
      "User research & interviews",
      "Usability & A/B testing",
      "Contextual inquiry & ethnography",
      "Personas",
    ],
  },
  {
    id: "service",
    title: "Service Design",
    items: [
      "Service blueprints",
      "Journey mapping",
      "Systems thinking",
      "Workshop facilitation",
    ],
  },
  {
    id: "ai",
    title: "Building with AI",
    items: [
      "Building real products with AI",
      "Rapid prototyping with AI",
      "Prompt engineering",
      "AI creative tools: image, video, voice",
    ],
  },
]

/* The journey stations — ONLY the real facts, in the given order, no invented
   dates. The kickers are plain descriptors of what each item is. */
const STATIONS: { kicker: string; title: string }[] = [
  { kicker: "Education", title: "SCAD, Savannah College of Art and Design" },
  { kicker: "Education", title: "Pratt Institute" },
  { kicker: "Experience", title: "SCADpro × FINRA" },
  { kicker: "Experience", title: "NANOV" },
  { kicker: "Honor", title: "Indigo Design Award 2026: two Silver, one Bronze" },
  { kicker: "Honor", title: "IDA 2025: Honorable Mention" },
]

const DESKTOP_MOTION = "(min-width: 721px) and (prefers-reduced-motion: no-preference)"
const MOBILE_MOTION = "(max-width: 720px) and (prefers-reduced-motion: no-preference)"
const MOTION = "(prefers-reduced-motion: no-preference)"
const JRNY_PIN = "(min-width: 901px) and (prefers-reduced-motion: no-preference)"

/* ---------------------------------------------------------- shared pieces */

function SkillList({ card }: { card: Card }) {
  return (
    <>
      <ul className="zone-skills">
        {card.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {card.chips.length > 0 && (
        <div className="zone-chips" aria-label="Tools">
          {card.chips.map((c) => (
            <span key={c} className="zone-chip">
              {c}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

/* the small gold "suit" mark — her monogram, echoing the engraved back. Sits
   top-right (and, rotated, bottom-left) so each face reads as a playing card. */
function MonogramMark() {
  return (
    <svg className="zone-fcard__suit" viewBox={MONOGRAM_VIEWBOX} aria-hidden="true">
      <path d={MONOGRAM_PATH} fillRule="evenodd" />
    </svg>
  )
}

function Head({ over, meta }: { over: string; meta?: string }) {
  return (
    <div className="zone-head">
      <p className="ds-overline zone-over">{over}</p>
      {meta && <p className="ds-overline zone-over zone-over--meta">{meta}</p>}
    </div>
  )
}

/* ===================================================== DEMO 1 · CARDS V5 */

export function FlipCards({
  s,
  back,
  basePriority = 1,
}: {
  s: Style
  back: BackDesign
  /* ScrollTrigger refresh order. The PIN refreshes at `basePriority`, the dusk
     crossfade at `basePriority - 1` (the pin MUST refresh before the crossfade:
     the pin element `.zone-fpin` sits BELOW the crossfade's `root` in Y, so the
     position tiebreak would otherwise refresh the crossfade first). Default 1 =
     the /lab/zone value, unchanged. On /v2 the homepage mounts a WorkGallery pin
     ABOVE this deck at the default priority 0; passing basePriority=0 here lets
     the two pins + the sections below refresh in pure document order (Y tiebreak),
     so this pin measures its start only AFTER the gallery's pin-spacer exists. */
  basePriority?: number
}) {
  const rootRef = useRef<HTMLElement>(null)
  // BOTH non-dark styles deal on the deep-charcoal STAGE, so they share the
  // whole-page dusk crossfade, the warm stage wash and (in ZoneLab) the cream
  // spacers. Only the CARD skin differs (night = solid cream, glass = liquid
  // glass). Keying on this one flag keeps every stage behaviour in lock-step.
  const isDarkStage = s !== "dark"

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()

      // DESKTOP full-motion — the PINNED, SCROLL-SCRUBBED, reversible deck. The
      // scrub (~1.5) gives the inertia catch-up; scrolling back folds it away
      // (fronts→backs→fan→single card). CSS default renders the settled fronts,
      // so this branch only sets the initial (deck) state then lets scroll drive.
      mm.add(DESKTOP_MOTION, () => {
        const pin = root.querySelector<HTMLElement>(".zone-fpin")
        const title = root.querySelector<HTMLElement>(".zone-fhead")
        const stage = root.querySelector<HTMLElement>(".zone-fstage")
        const cards = gsap.utils.toArray<HTMLElement>(".zone-fcard", root)
        const tilts = gsap.utils.toArray<HTMLElement>(".zone-fcard__tilt", root)
        const inners = gsap.utils.toArray<HTMLElement>(".zone-fcard__inner", root)
        if (!pin || !title || !stage) return
        const N = cards.length
        const fine = window.matchMedia("(pointer: fine)").matches

        const centerDelta = (el: HTMLElement) => {
          const row = el.parentElement as HTMLElement
          return row.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)
        }
        const fan = (i: number) => gsap.utils.mapRange(0, N - 1, -13, 13, i)

        // initial (progress 0): title present + a hair lower/larger; deck a tight
        // stack at the row centre (reads as ONE card), backs up.
        gsap.set(inners, { rotationY: 180 })
        gsap.set(title, { y: 34, scale: 1.03, transformOrigin: "50% 50%" })
        gsap.set(cards, {
          transformOrigin: "50% 0%",
          autoAlpha: 0,
          x: (i, el) => centerDelta(el as HTMLElement) + (i - (N - 1) / 2) * 3,
          y: (i) => (i - (N - 1) / 2) * 2,
          rotation: (i) => (i - (N - 1) / 2) * 1.4,
          scale: 0.98,
        })

        // ---- hover tilt (dedicated __tilt node so scrub/flip never fight) —
        // only engages when the row is SETTLED and only on a fine pointer.
        const settled = { on: false }
        const qX = new Map<HTMLElement, ReturnType<typeof gsap.quickTo>>()
        const qY = new Map<HTMLElement, ReturnType<typeof gsap.quickTo>>()
        // scale is split into scaleX/scaleY — the "scale" shorthand is not
        // quickTo-resettable and warns in the console; the axes are clean.
        const qSX = new Map<HTMLElement, ReturnType<typeof gsap.quickTo>>()
        const qSY = new Map<HTMLElement, ReturnType<typeof gsap.quickTo>>()
        const cleanups: Array<() => void> = []
        const resetTilt = (tn: HTMLElement) => {
          qX.get(tn)?.(0)
          qY.get(tn)?.(0)
          qSX.get(tn)?.(1)
          qSY.get(tn)?.(1)
        }
        if (fine) {
          tilts.forEach((tn, i) => {
            qX.set(tn, gsap.quickTo(tn, "rotationX", { duration: 0.55, ease: "power3.out" }))
            qY.set(tn, gsap.quickTo(tn, "rotationY", { duration: 0.55, ease: "power3.out" }))
            qSX.set(tn, gsap.quickTo(tn, "scaleX", { duration: 0.55, ease: "power3.out" }))
            qSY.set(tn, gsap.quickTo(tn, "scaleY", { duration: 0.55, ease: "power3.out" }))
            const card = cards[i]
            const onMove = (e: PointerEvent) => {
              if (!settled.on) return
              const b = card.getBoundingClientRect()
              const nx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2)
              const ny = (e.clientY - (b.top + b.height / 2)) / (b.height / 2)
              qY.get(tn)?.(gsap.utils.clamp(-10, 10, nx * 10))
              qX.get(tn)?.(gsap.utils.clamp(-10, 10, -ny * 10))
            }
            const onEnter = () => {
              if (!settled.on) return
              qSX.get(tn)?.(1.04)
              qSY.get(tn)?.(1.04)
            }
            const onLeave = () => {
              resetTilt(tn)
            }
            card.addEventListener("pointermove", onMove)
            card.addEventListener("pointerenter", onEnter)
            card.addEventListener("pointerleave", onLeave)
            cleanups.push(() => {
              card.removeEventListener("pointermove", onMove)
              card.removeEventListener("pointerenter", onEnter)
              card.removeEventListener("pointerleave", onLeave)
            })
          })
        }

        // ---- the scrubbed timeline (one long pin; beats spread over +=300%) ----
        const tl = gsap.timeline({
          defaults: { ease: V2_EASE },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
            // refresh the pin (basePriority) before the dusk crossfade
            // (basePriority - 1) so its spacer height is known before the
            // crossfade reads the section's pinned "bottom bottom". On /v2 a
            // WorkGallery pin above sits at priority 0, so basePriority=0 keeps
            // the whole page refreshing in document order (see the prop doc).
            refreshPriority: basePriority,
          },
        })
        // 1 · HOLD → the title yields as a single card back settles at centre
        tl.to(title, { y: 0, scale: 1, duration: 1.2 }, 0)
        tl.to(cards, { autoAlpha: 1, duration: 1.0, stagger: 0.03 }, 0.55)
        // 2 · FAN → the hand opens (still clustered near centre, backs up)
        tl.to(
          cards,
          {
            x: (i, el) => centerDelta(el as HTMLElement) * 0.34,
            y: (i) => 26 + Math.abs(fan(i)) * 0.5,
            rotation: (i) => fan(i),
            scale: 1,
            duration: 1.4,
            stagger: 0.06,
          },
          1.7
        )
        // 3 · DEAL → spread to the row, straighten, decelerate into each slot
        tl.to(cards, { x: 0, y: 0, rotation: 0, duration: 2.0, stagger: 0.12 }, 3.3)
        // 4 · FLIP → sequential L→R, back → front (overlaps the deal tail)
        inners.forEach((inner, i) => {
          tl.to(inner, { rotationY: 360, duration: 1.4, ease: "power2.inOut" }, 5.6 + i * 0.34)
        })
        // 5 · SETTLE → a held tail so the readable row occupies the last stretch
        tl.to(cards, { y: 0, duration: 0.6 }, 8.6)

        // settled = the timeline PLAYHEAD (not the raw scroll) is near the end —
        // so tilt only wakes once the flips have truly landed, even under scrub.
        tl.eventCallback("onUpdate", () => {
          const on = tl.progress() >= 0.94
          if (on !== settled.on) {
            settled.on = on
            if (!on) tilts.forEach(resetTilt)
          }
        })

        // ---- DUSK CROSSFADE (dark-stage styles: night + glass) — TRANSITION A.
        // The whole PAGE ground dips cream→charcoal over the ~60vh approaching
        // the pin (dusk falling), HOLDS charcoal through the entire pinned deal,
        // then lifts back to cream over the ~66vh after the unpin (dawn). The
        // section's own ground goes transparent so the page ground IS the stage;
        // the head type rides ink→cream in lock-step so it reads at every step.
        // Two triggers (in / out) anchored to real scroll positions — the hold
        // is implicit (the in-tween rests at charcoal between them). Identical
        // for night and glass (the cards, not the stage, are what differ). Fully
        // reversible; on a reduced-motion or mobile client this branch never runs
        // and CSS keeps the static charcoal band (--zone-fground) + light head.
        if (isDarkStage) {
          const page = root.closest<HTMLElement>(".zone-lab")
          const over = root.querySelector<HTMLElement>(".zone-fover")
          const big = root.querySelector<HTMLElement>(".zone-ftitle")
          if (page) {
            const CREAM = "#F5F0E8"     // --ds-warm-cream
            // Each dark-stage style tweens the page to ITS OWN stage tone so the
            // pinned (crossfade) stage and the static (reduced-motion) stage agree
            // — must match each --zone-fground: noir drops a STEP deeper (#191713)
            // than night/glass (#201E19); noir2 INVERTS to the lighter brown-
            // charcoal (#2B2822) so its deeper cards read as silhouettes on it.
            const DARK = s === "noir" ? "#191713" : s === "noir2" ? "#2B2822" : "#201E19"
            const INK_OVER = "#6E675C"   // --ds-text-muted, reads on cream
            const INK_BIG = "#2D2D2D"    // --ds-text, reads on cream
            const LIT_OVER = "rgba(245,239,227,0.58)"
            const LIT_BIG = "#F3ECDD"

            // the page ground is the stage now — drop the section's own fill
            gsap.set(root, { backgroundColor: "transparent" })

            // 1 · DUSK FALLS — cream→charcoal + head ink→cream on approach.
            //     immediateRender seeds the load state (cream page, ink head).
            const duskIn = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: "top 60%",
                end: "top top",
                scrub: 0.8,
                invalidateOnRefresh: true,
                refreshPriority: basePriority - 1,
              },
            })
            duskIn.fromTo(page, { backgroundColor: CREAM }, { backgroundColor: DARK, ease: "none" }, 0)
            // head type LEADS as ink (readable dark-on-cream) through most of the
            // approach, then resolves to cream as true dark arrives — a power2.in
            // hold-then-lift that never lets the type sink into the mid-tone
            // ground (a linear ink→cream would cross the ground at ~50% and
            // vanish). It lands cream exactly as the pin engages on full dark.
            if (over) duskIn.fromTo(over, { color: INK_OVER }, { color: LIT_OVER, ease: "power2.in" }, 0)
            if (big) duskIn.fromTo(big, { color: INK_BIG }, { color: LIT_BIG, ease: "power2.in" }, 0)

            // 2 · (HOLD) — no trigger spans the pin; the page rests at charcoal.

            // 3 · DAWN RETURNS — charcoal→cream + head cream→ink on exit.
            //     immediateRender:false so this fromTo never fights duskIn's seed.
            const dawnOut = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: "bottom bottom",
                end: "bottom 34%",
                scrub: 0.8,
                invalidateOnRefresh: true,
                refreshPriority: basePriority - 1,
              },
            })
            dawnOut.fromTo(page, { backgroundColor: DARK }, { backgroundColor: CREAM, ease: "none", immediateRender: false }, 0)
            // head holds cream while it is still on the dark stage (leaving), then
            // resolves back to ink as dawn fully returns — the mirror of dusk
            // (power2.in again: slow off the start value, so it never sinks into
            // the mid-tone ground on the way out either).
            if (over) dawnOut.fromTo(over, { color: LIT_OVER }, { color: INK_OVER, ease: "power2.in", immediateRender: false }, 0)
            if (big) dawnOut.fromTo(big, { color: LIT_BIG }, { color: INK_BIG, ease: "power2.in", immediateRender: false }, 0)
          }
        }

        return () => {
          cleanups.forEach((fn) => fn())
        }
      })

      // MOBILE motion — lighter: fronts already up, they rise + fade in as a
      // swipe row. No pin, fan, flip, rope or particle backs.
      mm.add(MOBILE_MOTION, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".zone-fcard", root)
        const inners = gsap.utils.toArray<HTMLElement>(".zone-fcard__inner", root)
        gsap.set(inners, { rotationY: 0 })
        gsap.set(cards, { autoAlpha: 0, y: 22 })
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: V2_EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        })
      })

      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [s] }
  )

  return (
    <section ref={rootRef} className={`zone-sec zone-sec--flip zone-flip--${s}`} aria-label="Capabilities">
      <div className="zone-fpin">
        {/* the warm candlelit wash rides night + glass; noir + noir2 get a CLEAN
            stage (she flagged the round bright glow behind the heading — "圆圆的亮的云"). */}
        {isDarkStage && s !== "noir" && s !== "noir2" && <div className="zone-fwash" aria-hidden="true" />}
        <div className="zone-fhead">
          <p className="ds-overline zone-fover">Capabilities</p>
          <h2 className="zone-ftitle">Area of Expertise</h2>
        </div>
        <div className="zone-fstage">
          <div className="zone-frow">
            {FLIP_CARDS.map((card) => (
              <div key={card.id} className="zone-fcard">
                <div className="zone-fcard__hang">
                  <div className="zone-fcard__tilt">
                    <div className="zone-fcard__inner">
                      <div className="zone-fcard__face zone-fcard__front">
                        <div className="zone-fcard__idx">
                          <h3 className="zone-fcard__title">{card.title}</h3>
                          <MonogramMark />
                        </div>
                        <span className="zone-fcard__rule" aria-hidden="true" />
                        <ul className="zone-fcard__list">
                          {card.items.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                        <div className="zone-fcard__idx zone-fcard__idx--btm" aria-hidden="true">
                          <span className="zone-fcard__title">{card.title}</span>
                          <MonogramMark />
                        </div>
                      </div>
                      <div className="zone-fcard__face zone-fcard__back" aria-hidden="true">
                        <img
                          className="zone-fcard__backimg"
                          src={`/image/cards/back-${back}-md.jpg`}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================================================== DEMO 2 · QUIET CARDS */

export function QuietCards({ meta = "Quiet cards + chips" }: { meta?: string }) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        gsap.set(".zone-qcard", { y: 30, autoAlpha: 0 })
        gsap.to(".zone-qcard", {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".zone-cards", start: "top 78%", once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} className="zone-sec" aria-label="Capabilities">
      <Head over="Capabilities" meta={meta} />
      <div className="zone-cards">
        {CARDS.map((card) => (
          <article key={card.id} className="zone-qcard">
            <span className="zone-qindex" aria-hidden="true">
              {card.index}
            </span>
            <p className="zone-qcat">{card.title}</p>
            <SkillList card={card} />
          </article>
        ))}
      </div>
    </section>
  )
}

/* ================================================= DEMO 3 · JOURNEY BAND */

export function JourneyBand() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const stage = stageRef.current
      const track = trackRef.current
      const fill = fillRef.current
      if (!stage || !track || !fill) return

      const mm = gsap.matchMedia()

      // DESKTOP: pin the stage, pan the stations sideways 1:1 with the wheel; a
      // gold line fills along the baseline as you go; each station lights when
      // the sweeping line reaches its node, and the one nearest center is active.
      mm.add(JRNY_PIN, () => {
        const stations = gsap.utils.toArray<HTMLElement>(".zone-jrny__station", track)
        const iw = window.innerWidth
        const amount = track.scrollWidth - iw
        const hold = window.innerHeight * 0.1
        const total = hold + amount
        const hf = hold / total

        gsap.set(fill, { scaleX: 0, transformOrigin: "left center" })

        const setStates = (self: { progress: number }) => {
          const p = Math.max(0, (self.progress - hf) / (1 - hf)) // post-hold 0..1
          const x = Number(gsap.getProperty(track, "x")) || 0
          const center = iw / 2
          let best = 0
          let bestD = Infinity
          stations.forEach((st, i) => {
            const c = st.offsetLeft + st.offsetWidth / 2 + x // live viewport center
            const d = Math.abs(c - center)
            if (d < bestD) {
              bestD = d
              best = i
            }
            // node lit once the gold line's leading edge (p*iw) sweeps past it
            st.classList.toggle("is-reached", p * iw >= c - 6)
          })
          stations.forEach((st, i) => st.classList.toggle("is-active", i === best))
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${total}`,
            scrub: 0.9,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: setStates,
            onRefresh: setStates,
          },
        })
        tl.to(track, { x: -amount, ease: "none", duration: 1 - hf }, hf)
        tl.to(fill, { scaleX: 1, ease: "none", duration: 1 - hf }, hf)

        return () => {} // mm.revert() clears the pin + classes reset on revert
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} className="zone-jrny" aria-label="Education and honors">
      <Head over="Education & honors" meta="Journey" />
      <div ref={stageRef} className="zone-jrny__stage">
        <div className="zone-jrny__rail" aria-hidden="true">
          <span ref={fillRef} className="zone-jrny__fill" />
        </div>
        <div ref={trackRef} className="zone-jrny__track">
          {STATIONS.map((s, i) => (
            <div className="zone-jrny__station" key={s.title}>
              <span className="zone-jrny__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="zone-jrny__node" aria-hidden="true" />
              <div className="zone-jrny__text">
                <p className="ds-overline zone-jrny__kicker">{s.kicker}</p>
                <p className="zone-jrny__title">{s.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------ demo dispatcher */

export function ZoneLab({ d, s, back }: { d: 1 | 2 | 3; s: Style; back?: string }) {
  // an explicit, VALID ?back= wins; otherwise the per-style default. Validated
  // here (client) because the design list is a runtime value of this module.
  const explicit = back && (BACK_DESIGNS as string[]).includes(back) ? (back as BackDesign) : undefined
  const effBack = explicit ?? defaultBack(s)
  // night + glass both deal on the dark stage → both get the cream dusk spacers.
  const isDarkStage = s !== "dark"
  return (
    <>
      <nav className="zone-tag" aria-label="Demo switch">
        <span className="zone-tag__label">Zone demo</span>
        <a className={`zone-tag__link${d === 1 ? " is-on" : ""}`} href="?d=1">
          1 · Cards
        </a>
        <a className={`zone-tag__link${d === 2 ? " is-on" : ""}`} href="?d=2">
          2 · Quiet
        </a>
        <a className={`zone-tag__link${d === 3 ? " is-on" : ""}`} href="?d=3">
          3 · Journey
        </a>
        {d === 1 && (
          <>
            <span className="zone-tag__div" aria-hidden="true" />
            <span className="zone-tag__label">Style</span>
            {(["dark", "night", "glass", "noir", "noir2"] as Style[]).map((st) => (
              // keep an EXPLICIT back sticky across styles; otherwise let each
              // style fall to its own default (dark→nightbloom, the rest→water).
              <a
                key={st}
                className={`zone-tag__link${s === st ? " is-on" : ""}`}
                href={explicit ? `?d=1&s=${st}&back=${explicit}` : `?d=1&s=${st}`}
              >
                {st === "noir2" ? "noir II" : st}
              </a>
            ))}
            <span className="zone-tag__div" aria-hidden="true" />
            <span className="zone-tag__label">Back</span>
            {BACK_DESIGNS.map((bk) => (
              <a
                key={bk}
                className={`zone-tag__link${effBack === bk ? " is-on" : ""}`}
                href={`?d=1&s=${s}&back=${bk}`}
              >
                {bk}
              </a>
            ))}
          </>
        )}
      </nav>

      {/* dark-stage styles (night + glass): cream runway so the whole-page dusk
          crossfade has room to fall (above) and lift back (below). Hidden off
          desktop-motion in CSS. */}
      {d === 1 && isDarkStage && <div className="zone-fspacer zone-fspacer--top" aria-hidden="true" />}
      {d === 1 && <FlipCards s={s} back={effBack} />}
      {d === 1 && isDarkStage && <div className="zone-fspacer zone-fspacer--btm" aria-hidden="true" />}
      {d === 2 && <QuietCards />}
      {d === 3 && (
        <>
          <QuietCards meta="Cards + journey" />
          <JourneyBand />
        </>
      )}
      {/* a short tail so the last pinned/settled state has room to breathe */}
      <div className="zone-tail" aria-hidden="true" />
    </>
  )
}
