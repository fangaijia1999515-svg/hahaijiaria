"use client"
/**
 * V2 STATEMENT v5 — "TRIONN DARK" (2026-07-08, her call)
 * ---------------------------------------------------------------------------
 * Her brief: keep the photo hero, make screen 2 DARK and mirror trionn.com's
 * about-block layout exactly (her annotated screenshot):
 *
 *   dark stage rises over the bright hero (rounded panel, trionn's own move)
 *   the hero hands down its LIGHT and AIR, never its picture: a warm
 *   afterglow at the top edge + two slow-drifting fog banks on an otherwise
 *   clean stage (photo continuation kept reading as a mismatched second image)
 *   "ABOUT" tag at the left · one giant statement with a deep first-line
 *   indent, read near-invisible -> lit by scroll · a full-width hairline with
 *   a small "+" station · below-left a mono credo block · below-right the
 *   mission paragraph + MORE ABOUT ME -> · generous air after
 *
 * Copy is hers verbatim (P1 giant, P2 mission, credo lines from her own
 * approved language). CSS/markup default = readable end state; GSAP scrubs.
 */
import { useRef } from "react"
import { gsap, SplitText, useGSAP } from "@/lib/gsap"
import { LeafField } from "@/app/lab/leaf/leaf-field"
import { BloomField } from "@/app/lab/bloom/bloom-field"
import { DuneSoftScoped } from "@/app/lab/bg/flow-effects"

const DESKTOP_MOTION = "(min-width: 721px) and (prefers-reduced-motion: no-preference)"

export function V2Statement({
  variant = "dark",
  demoLabel,
  bgStudy = "dune",
}: {
  variant?: "dark" | "light"
  demoLabel?: string
  /* Second-screen background behind the light statement copy. DEFAULT = the
     dune-soft shader (her 2026-07-15 call: the quiet sand becomes screen 2's
     ground). leaf | bloom mount those lab studies instead (kept as backups),
     "none" leaves the plain cream stage. Only the light variant wears a
     ground; the dormant dark variant never does. */
  bgStudy?: "dune" | "leaf" | "bloom" | "none"
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const isDune = bgStudy === "dune" && variant === "light"

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* NO entrance treatment on the panel itself (her 2026-07-19 call: the
           rounded-corner rise revealed pale edges past the radius and the 换季
           colour glide made them read as a white seam — both REMOVED; deleted
           2026-07-19, backups in scratchpad). The statement arrives square and
           cream in plain document flow. */

        /* the statement reads itself, trionn-loud: words start nearly
           invisible and switch ON one by one */
        const lead = rootRef.current?.querySelector(".v2-stmt__lead")
        if (lead) {
          const split = SplitText.create(lead, { type: "words" })
          const dim =
            variant === "dark" ? "rgba(245, 240, 232, 0.12)" : "rgba(45, 45, 45, 0.13)"
          const lit = variant === "dark" ? "rgba(245, 240, 232, 1)" : "rgba(45, 45, 45, 1)"
          /* window starts only once the panel owns most of the screen
             (start "top 62%"), so she actually watches the switch-on
             instead of it finishing during the hero handoff */
          gsap.set(split.words, { color: dim })
          gsap.to(split.words, {
            color: lit,
            ease: "none",
            stagger: 0.055,
            duration: 0.1,
            scrollTrigger: {
              trigger: lead,
              start: "top 62%",
              end: "top 12%",
              scrub: 0.4,
            },
          })
        }

        /* the hairline draws, its little station lands */
        gsap.set(".v2-stmt__rule", { scaleX: 0 })
        gsap.set(".v2-stmt__plus", { autoAlpha: 0 })
        gsap
          .timeline({
            scrollTrigger: { trigger: ".v2-stmt__rulewrap", start: "top 82%", once: true },
            defaults: { ease: "power2.out" },
          })
          .to(".v2-stmt__rule", { scaleX: 1, duration: 1.0, ease: "power3.out" })
          .to(".v2-stmt__plus", { autoAlpha: 1, duration: 0.4 }, 0.7)

        /* credo and mission surface quietly */
        gsap.set(".v2-stmt__credo, .v2-stmt__mission", { autoAlpha: 0, y: 22 })
        gsap.to(".v2-stmt__credo, .v2-stmt__mission", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".v2-stmt__row", start: "top 80%", once: true },
        })

        /* the hero's light lingers at the top, then quietly lets go */
        gsap.fromTo(
          ".v2-stmt__air",
          { opacity: 1 },
          {
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 55%",
              end: "top -30%",
              scrub: 0.5,
            },
          }
        )

        /* the fog banks barely breathe; nothing here asks for attention */
        gsap.to(".v2-stmt__fog--a", {
          xPercent: 5, yPercent: -4,
          duration: 26, ease: "sine.inOut", repeat: -1, yoyo: true,
        })
        gsap.to(".v2-stmt__fog--b", {
          xPercent: -6, yPercent: 3,
          duration: 34, ease: "sine.inOut", repeat: -1, yoyo: true,
        })
      })

      /* DUNE GROUND transitions — desktop full-motion only. Mobile keeps the sand
         static (CSS opacity 1); reduced motion keeps it static and gentler (CSS
         opacity 0.5). Both handoffs are scroll scrubs on this section's own
         edges, so nothing couples to the gallery pin's timing. */
      if (isDune) {
        mm.add(DESKTOP_MOTION, () => {
          const dune = rootRef.current?.querySelector<HTMLElement>(".v2-stmt__bgstudy--dune")
          if (!dune) return

          /* PAGE-1 HANDOFF — the sand SURFACES under the cream panel as it rises
             over the hero: opacity 0 -> 1 with a subtle 40px rise + 1.04 -> 1
             settle, across the first ~45% of the statement's entry (top bottom ->
             top 55%). scrub 0.8 gives the silky inertia catch-up, not a hard cut. */
          gsap.fromTo(
            dune,
            { autoAlpha: 0, y: 40, scale: 1.04 },
            {
              autoAlpha: 1, y: 0, scale: 1, ease: "none",
              scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "top 55%", scrub: 0.8 },
            },
          )

          /* PAGE-3 HANDOFF — the shader dune dissolves back into the cream ground
             as the work gallery (whose lead cell is a photographic dune of the same
             warm sand) rises from below: opacity 1 -> 0 over the statement's lower
             edge (bottom 78% -> bottom 30%), so the sand has cleared to cream just
             as the photographic dune pins in and the eye reads one becoming the
             other. The static bottom mask (CSS) already melts the sand toward cream
             here, so this fade rides an already-soft edge. immediateRender:false so
             it never overwrites the entry's from-state on load. */
          gsap.fromTo(
            dune,
            { autoAlpha: 1 },
            {
              autoAlpha: 0, ease: "none", immediateRender: false,
              scrollTrigger: { trigger: rootRef.current, start: "bottom 78%", end: "bottom 30%", scrub: 0.8 },
            },
          )
        })
      }

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className={`v2-stmtwrap v2-stmtwrap--${variant}`}>
      <section
        className={`v2-stmt v2-stmt--${variant}`}
        data-chapter="1"
        aria-label="About Aijia Fang"
      >
      {/* no picture here: the hero hands down its light and air, not its
          frame — a warm afterglow plus two slow fog banks over a clean stage */}
      <div className="v2-stmt__air" aria-hidden="true" />
      <div className="v2-stmt__fog v2-stmt__fog--a" aria-hidden="true" />
      <div className="v2-stmt__fog v2-stmt__fog--b" aria-hidden="true" />
      {/* second-screen background study (behind the copy, above the fog, below
          the text). pointer-events:none — the leaf still sways via its window
          listener; the statement links/selection stay live. */}
      {/* DEFAULT ground: the dune-soft shader, scoped to this section. It fades
          and breathes IN as the panel rises over the hero, and dissolves back to
          cream as the (photographic-dune) gallery approaches — see the GSAP
          scrubs above. The opaque sand supersedes the air/afterglow + fog banks,
          which peek through only during the entry fade (a warm hand-off). */}
      {isDune && (
        <div className="v2-stmt__bgstudy v2-stmt__bgstudy--dune" aria-hidden="true">
          <DuneSoftScoped />
        </div>
      )}
      {bgStudy === "leaf" && (
        <div className="v2-stmt__bgstudy" aria-hidden="true">
          <LeafField showLabel={false} />
        </div>
      )}
      {bgStudy === "bloom" && (
        <div className="v2-stmt__bgstudy" aria-hidden="true">
          <BloomField showLabel={false} />
        </div>
      )}
      {demoLabel && <p className="v2-stmt__demo">{demoLabel}</p>}
      <div className="v2-stmt__inner">
        <p className="v2-stmt__tag">About</p>

        {/* the giant statement: her P1, verbatim. The deep first-line indent
            is a placeholder span, NOT text-indent (text-indent inherits into
            SplitText's inline-block word boxes and explodes word spacing) */}
        <p className="v2-stmt__lead">
          <span className="v2-stmt__indent" aria-hidden="true" />
          I design for the moment a person and a product click, where
          something complicated starts to feel simple, and even beautiful.
        </p>

        <div className="v2-stmt__rulewrap" aria-hidden="true">
          <span className="v2-stmt__rule" />
          <span className="v2-stmt__plus">+</span>
        </div>

        <div className="v2-stmt__row">
          {/* the credo slot: "Designed to feel, built to ship" moved to the
              throughline page (her 2026-07-19 note: it appeared twice), so the
              TRIAD stands here — her three disciplines in three words, the
              same three the Background section proves. */}
          <p className="v2-stmt__credo">
            Shape,
            <br />
            system,
            <br />
            software.
          </p>

          <div className="v2-stmt__mission">
            <p>
              I bring taste, a service designer&apos;s instinct for the real
              problem, and the ability to build what I imagine with AI, not
              just mock it up.
            </p>
            <a className="v2-stmt__more" href="#about">
              More about me <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      </section>
    </div>
  )
}
