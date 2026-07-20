"use client"
/**
 * V2 POST-WORK v2 — Capability / Method / Record (rebuilt 2026-07-07 PM)
 * ---------------------------------------------------------------------------
 * Her verdict on v1 killed the "drawn line" mode sitewide: hero + gallery are
 * her anchors (one solid subject per screen, imagery always WHOLE), monolog
 * is the model (each section a DIFFERENT but solid presentation; no single
 * gimmick repeated everywhere). So:
 *
 *   CAPABILITY  monolog's services grammar, the one she praised in her
 *               reference recording: a giant serif list, the current line lit
 *               while the others wait in taupe, and a WHOLE project image in a
 *               side window that swaps as you hover/scroll. Software's window
 *               is an honest dark plate: "02 apps in build" + a blinking caret.
 *   RECORD      the six credentials as a solid editorial table. No plumb line.
 *
 * Micro-interaction language (emil-design-eng): strong ease-out
 * cubic-bezier(0.23,1,0.32,1), UI beats under 300ms, stagger 40-80ms, hover
 * gated to fine pointers, transform/opacity only, nothing enters from
 * scale(0). Markup/CSS default = assembled end state; GSAP animates entries
 * only. Reduced motion = static. Copy em-dash-free, facts only.
 */
import { useRef, useState } from "react"
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap"
import { getLenis } from "@/lib/lenis"

/* ------------------------------------------------------------------ data */

const SERVICES = [
  {
    id: "shape",
    index: "01",
    word: "Shape",
    discipline: "Product Design",
    line: "The object, and how it should feel in the hand.",
    tie: "Pratt B.I.D. · Industrial Design",
    img: "/image/eaudetoi/image/booth01.webp",
    alt: "Eau de Toi in-store scent discovery installation",
    href: "/work-classic/eau-de-toi",
  },
  {
    id: "system",
    index: "02",
    word: "System",
    discipline: "Service Design",
    line: "The whole system that has to hold the moment up.",
    tie: "SCAD M.A. · SCADpro x FINRA",
    img: "/image/Nuzzle/hero2.webp",
    alt: "Nuzzle service system",
    href: "/work-classic/nuzzle",
  },
  {
    id: "software",
    index: "03",
    word: "Software",
    discipline: "AI-Native Build",
    line: "And the working thing, built and shipped, not mocked up.",
    tie: "Next.js · TypeScript · Claude Code · Claude API",
    img: null,
    alt: "",
    href: null,
  },
] as const

/* BACKGROUND — her real facts only, split into the three parts she named
   (2026-07-19, trionn Client-stories grammar: a clickable list on the left,
   the chosen part's content on the right, soft blur-dissolve between): 读的书
   = Education, 工作 = Experience, "word" = Honors. */
type BgEntry = {
  kicker?: string
  head: string
  sub?: string
  /* honors: the exact medal + category lines from the award pages (her call
     2026-07-19: name the awards concretely; no project names, no "student") */
  awards?: readonly { medal: string; cat: string }[]
}
const BG_TABS: readonly { key: string; label: string; entries: readonly BgEntry[] }[] = [
  {
    key: "education",
    label: "Education",
    entries: [
      { kicker: "Graduate", head: "SCAD", sub: "M.A. Service Design" },
      { kicker: "Undergraduate", head: "Pratt Institute", sub: "B.I.D. Industrial Design, President's List" },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    entries: [
      { kicker: "2025", head: "SCADpro × FINRA", sub: "Service Designer" },
      { kicker: "2023", head: "NANOV", sub: "Industrial Design Intern" },
    ],
  },
  {
    key: "honors",
    label: "Honors",
    entries: [
      {
        kicker: "2026",
        head: "Indigo Design Awards",
        awards: [
          { medal: "Silver", cat: "UX, Interface & Navigation for Digital Design" },
          { medal: "Silver", cat: "Interaction Design for Social Change" },
          { medal: "Bronze", cat: "Interactive Design for Digital Design" },
        ],
      },
      {
        kicker: "2025",
        head: "International Design Awards",
        awards: [{ medal: "Honorable Mention", cat: "" }],
      },
    ],
  },
] as const

/* --------------------------------------------- CAPABILITY (services list) */

export function CapabilitySection() {
  const rootRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".v2pw-svc__row", { autoAlpha: 0, y: 28 })
        gsap.set(".v2pw-svc__window", { autoAlpha: 0, y: 20 })
        gsap.set(".v2pw-cap__lock", { autoAlpha: 0 })

        gsap.to(".v2pw-svc__row", {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".v2pw-svc", start: "top 74%", once: true },
        })
        gsap.to(".v2pw-svc__window", {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.12,
          scrollTrigger: { trigger: ".v2pw-svc", start: "top 74%", once: true },
        })
        gsap.to(".v2pw-cap__lock", {
          autoAlpha: 1,
          duration: 0.6,
          scrollTrigger: { trigger: ".v2pw-cap__lock", start: "top 92%", once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="capability" className="v2pw-cap" aria-label="What I do">
      <div className="v2pw-inner">
        <div className="v2pw-toprow">
          <p className="ds-overline v2pw-over">What I do</p>
          <p className="ds-overline v2pw-index">02</p>
        </div>

        <div className="v2pw-svc">
          <ul className="v2pw-svc__list" onMouseLeave={() => setActive((a) => a)}>
            {SERVICES.map((s, i) => {
              const Inner = (
                <>
                  <span className="ds-overline v2pw-svc__num">{s.index}</span>
                  <span className="v2pw-svc__word">{s.word}</span>
                  <span className="v2pw-svc__meta">
                    <span className="ds-overline v2pw-svc__discipline">{s.discipline}</span>
                    <span className="v2pw-svc__line">{s.line}</span>
                  </span>
                </>
              )
              return (
                <li
                  key={s.id}
                  className={`v2pw-svc__row ${i === active ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {s.href ? (
                    <a className="v2pw-svc__hit" href={s.href} aria-label={`${s.word}, ${s.discipline}`}>
                      {Inner}
                    </a>
                  ) : (
                    <div className="v2pw-svc__hit">{Inner}</div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="v2pw-svc__window" aria-hidden="true">
            {SERVICES.map((s, i) =>
              s.img ? (
                <img
                  key={s.id}
                  className={`v2pw-svc__img ${i === active ? "is-active" : ""}`}
                  src={s.img}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div key={s.id} className={`v2pw-svc__plate ${i === active ? "is-active" : ""}`}>
                  <p className="v2pw-svc__platenum">
                    02<span className="v2pw-caret" />
                  </p>
                  <p className="ds-overline v2pw-svc__platelabel">apps in build</p>
                </div>
              )
            )}
          </div>
        </div>

        <p className="v2pw-cap__lock" aria-hidden="true">Designed to feel, built to ship.</p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- RECORD */

export function RecordSection() {
  const rootRef = useRef<HTMLElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState(0)
  const tabRef = useRef(0)
  const busyRef = useRef(false)
  const pendingRef = useRef(0)
  const stRef = useRef<ScrollTrigger | null>(null)

  /* trionn's switch: the leaving content softens into a blur as the next one
     settles in — reading glasses changing focus, not a slide. A PENDING queue
     replaces a hard busy-drop: fast scrolling through several steps always
     lands on the step the scroll position says (never stuck mid-list).
     Reduced motion swaps instantly. */
  const runSwitch = () => {
    const cur = tabRef.current
    const next = pendingRef.current
    if (next === cur || busyRef.current) return
    const panels = panelsRef.current?.querySelectorAll<HTMLElement>(".v2bg-panel")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    tabRef.current = next
    setTab(next)
    if (!panels || !panels[cur] || !panels[next]) return
    if (reduced) {
      gsap.set(panels[cur], { autoAlpha: 0 })
      gsap.set(panels[next], { autoAlpha: 1, y: 0, filter: "blur(0px)" })
      return
    }
    busyRef.current = true
    gsap
      .timeline({
        onComplete: () => {
          busyRef.current = false
          runSwitch() // catch up if the scroll has already moved on
        },
      })
      .to(panels[cur], {
        autoAlpha: 0,
        y: -10,
        filter: "blur(8px)",
        duration: 0.26,
        ease: "power2.in",
      })
      .fromTo(
        panels[next],
        { autoAlpha: 0, y: 16, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
        ">-0.06"
      )
  }

  const switchTo = (next: number) => {
    pendingRef.current = next
    /* clicking a label while the section is PINNED must also move the scroll
       to that step's zone, or the very next wheel tick would snap the tab
       back to what the scroll position dictates */
    const st = stRef.current
    if (st) {
      const MID = [0.21, 0.63, 0.92]
      const y = st.start + (MID[next] ?? 0.5) * (st.end - st.start)
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: 0.7 })
      else window.scrollTo(0, y)
    }
    runSwitch()
  }

  useGSAP(
    () => {
      /* stack rest state: only the first panel visible (matches the CSS
         default so no-JS reads Education) */
      const panels = panelsRef.current?.querySelectorAll<HTMLElement>(".v2bg-panel")
      if (panels) gsap.set(Array.from(panels).slice(1), { autoAlpha: 0 })

      const mm = gsap.matchMedia()

      /* HER 2026-07-19 scroll-step ask: the section PINS for a beat and each
         scroll notch turns the page inside it — Education, then Experience,
         then Honors — before the pin releases toward the dark deck. Desktop
         full-motion only; mobile / reduced-motion keep plain clickable tabs. */
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        /* zones are DELIBERATELY uneven (her 2026-07-19 note: after Honors the
           pin held for several more notches and read like the page had ended):
           Education and Experience each get a full reading beat; Honors
           arrives at 84% so only a short breath remains before the pin
           releases and the page visibly moves on. */
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            const idx = p < 0.42 ? 0 : p < 0.84 ? 1 : 2
            if (idx !== pendingRef.current) {
              pendingRef.current = idx
              runSwitch()
            }
          },
        })
        stRef.current = st
        return () => {
          stRef.current = null
          st.kill()
        }
      })

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".v2bg-title, .v2bg-intro", { autoAlpha: 0, y: 24 })
        gsap.set(".v2bg-list li", { autoAlpha: 0, y: 14 })
        gsap.set(".v2bg-rule", { scaleX: 0 })
        gsap.set(".v2bg-plus", { autoAlpha: 0 })
        const tl = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
          defaults: { ease: "power3.out" },
        })
        tl.to(".v2bg-title, .v2bg-intro", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 })
          .to(".v2bg-rule", { scaleX: 1, duration: 1.0 }, 0.2)
          .to(".v2bg-plus", { autoAlpha: 1, duration: 0.4 }, 0.9)
          .to(".v2bg-list li", { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.35)
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="about" className="v2bg" aria-label="Background">
      <div className="v2pw-inner">
        <div className="v2bg-top">
          <h2 className="v2bg-title">Background</h2>
          {/* her 2026-07-19 call: the counting line read as bragging. This is
              the archival whisper instead; the facts below do the proving.
              (Her alternative "A product designer who designs and builds with
              AI" is the HERO's job — the sub up top already says it.) */}
          <p className="v2bg-intro">
            A short record of where this practice comes from.
          </p>
        </div>

        <div className="v2bg-rulewrap" aria-hidden="true">
          <span className="v2bg-rule" />
          <span className="v2bg-plus">+</span>
        </div>

        <div className="v2bg-grid">
          <div className="v2bg-side">
            <ul className="v2bg-list" role="tablist" aria-label="Background parts">
              {BG_TABS.map((t, i) => (
                <li key={t.key}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === tab}
                    className={`v2bg-tab${i === tab ? " is-active" : ""}`}
                    onClick={() => switchTo(i)}
                  >
                    {t.label}
                    <span className="v2bg-tab__arrow" aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="v2bg-panels" ref={panelsRef}>
            {BG_TABS.map((t) => (
              <div className="v2bg-panel" key={t.key} role="tabpanel" aria-label={t.label}>
                {t.entries.map((e) => (
                  <div className="v2bg-entry" key={e.head}>
                    {e.kicker && <p className="ds-overline v2bg-entry__kicker">{e.kicker}</p>}
                    <h3 className="v2bg-entry__head">{e.head}</h3>
                    {e.sub && <p className="v2bg-entry__sub">{e.sub}</p>}
                    {e.awards && (
                      <ul className="v2bg-entry__awards">
                        {e.awards.map((a) => (
                          <li key={a.medal + a.cat}>
                            <span className="v2bg-medal">{a.medal}</span>
                            {a.cat && <span className="v2bg-cat"> · {a.cat}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
