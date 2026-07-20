"use client"
/**
 * Footer composition mocks for the water study — the homepage SignatureClose
 * content (copy verbatim from components/v2/story.tsx) laid over the live
 * water in three arrangements distilled from her four references
 * (trionn / salakhov / lusion / haoqi shared grammar: monumental statement,
 * signature motif as the ground, one clear action, utility rail at the foot).
 *   ?footer=1  Monument — centered statement, lusion/monolog grammar
 *   ?footer=2  Editorial — statement left, info column right, trionn grammar
 *   ?footer=3  Sunken mark — giant monogram half-sunk in the water, salakhov
 * Mock only: no GSAP monogram writing / magnet hover — composition first.
 */
import { useEffect, useState } from "react"
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/ds/monogram-path"

function useSantaClaraClock() {
  const [now, setNow] = useState("")
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function Links({ column = false }: { column?: boolean }) {
  return (
    <div className={`water-foot__links${column ? " water-foot__links--col" : ""}`}>
      <a href="mailto:hahaijiarah@gmail.com">hahaijiarah@gmail.com</a>
      <a href="https://www.linkedin.com/in/aijia-fang" target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a href="/aijia-fang-resume.pdf" target="_blank">
        Resume
      </a>
    </div>
  )
}

function Mark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox={MONOGRAM_VIEWBOX} role="img" aria-label="Aijia Fang monogram">
      <path d={MONOGRAM_PATH} fillRule="evenodd" />
    </svg>
  )
}

export function WaterFooterMock({
  variant,
  inkMode = false,
}: {
  variant: 1 | 2 | 3
  /* the statement is baked into the water itself — skip the DOM heading */
  inkMode?: boolean
}) {
  const now = useSantaClaraClock()
  const clock = now ? `Santa Clara ${now}` : "Santa Clara"

  if (variant === 2) {
    /* Editorial — trionn grammar: statement owns the left, info stands right */
    return (
      <div className="water-foot water-foot--e">
        <div className="water-foot__etop">
          <div>
            <p className="water-foot__overline">Contact</p>
            <h2 className="water-foot__line water-foot__line--left">
              Tell me what you&apos;re building.
            </h2>
          </div>
          <aside className="water-foot__easide">
            {/* the "Open to ... roles · Bay Area" line was cut (her call
                2026-07-19); the clock alone names her place and time */}
            <p className="water-foot__overline">{clock}</p>
            <Links column />
          </aside>
        </div>
        <footer className="water-foot__bar">
          <p className="water-foot__overline">© 2026 &middot; Designed and built by Aijia Fang</p>
          <Mark className="water-foot__mark water-foot__mark--small" />
        </footer>
      </div>
    )
  }

  if (variant === 3) {
    /* Sunken mark — salakhov grammar: the monogram becomes the monument,
       half-sunk in her water like a stone */
    return (
      <div className="water-foot water-foot--s">
        <div className="water-foot__etop">
          <div>
            <p className="water-foot__overline">Contact</p>
            <h2 className="water-foot__line water-foot__line--left water-foot__line--narrow">
              Tell me what you&apos;re building.
            </h2>
            <p className="water-foot__overline water-foot__gap">
              Open to product and service design roles &middot; Bay Area &middot; {clock}
            </p>
          </div>
          <aside className="water-foot__easide">
            <Links column />
          </aside>
        </div>
        <Mark className="water-foot__mark water-foot__mark--sunken" />
        <footer className="water-foot__bar">
          <p className="water-foot__overline">© 2026 &middot; Designed and built by Aijia Fang</p>
          <span className="water-foot__name">Aijia Fang</span>
        </footer>
      </div>
    )
  }

  /* Monument — lusion grammar: everything on the centerline, the water
     carries the lower half. 2026-07-19 full-viewport rework: the "Open to"
     line stays cut (her call), the clock stands alone, and the HERO'S OWN
     LINE returns tiny on the water as the closing echo — the site opens and
     closes on the same sentence. */
  return (
    <div className={`water-foot water-foot--m${inkMode ? " water-foot--ink" : ""}`}>
      <div className="water-foot__mtop">
        {!inkMode && <p className="water-foot__overline">Contact</p>}
        {!inkMode && (
          <h2 className="water-foot__line water-foot__line--center">
            Tell me what you&apos;re building.
          </h2>
        )}
        <Links />
        <p className="water-foot__overline">{clock}</p>
      </div>
      {/* the bookend: the opening sentence, whispered on the water. INLINE
          styles on purpose — new build-processed rules in this pipeline have
          been silently dropped before. */}
      <p
        aria-hidden="true"
        style={{
          margin: 0,
          textAlign: "center",
          fontFamily: "var(--font-ds-display), serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(1.05rem, 0.95rem + 0.55vw, 1.45rem)",
          color: "rgba(45, 45, 45, 0.58)",
          letterSpacing: "0.01em",
        }}
      >
        The organic made digital.
      </p>
      <footer className="water-foot__bar">
        <p className="water-foot__overline">© 2026 &middot; Designed and built by Aijia Fang</p>
        <Mark className="water-foot__mark water-foot__mark--small" />
        <span className="water-foot__name">Aijia Fang</span>
      </footer>
    </div>
  )
}
