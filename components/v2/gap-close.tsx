"use client"

/**
 * THROUGHLINE CELL — "Designed to feel, built to ship." (2026-07-19, her
 * brief, v2 after her correction).
 * ---------------------------------------------------------------------------
 * Her two references, correctly read this time:
 *   - trionn: the giant-words page is the LAST CELL of the horizontal work
 *     track — after the final project, the whole page slides in HORIZONTALLY
 *     (a sideways page turn), in a different colour from what follows.
 *   - monolog (WE CLOSE THAT GAP): once the page is in place, the line rests
 *     in two halves around a live media window and the scroll SQUEEZES the
 *     window shut until the sentence closes.
 *
 * So this component is MARKUP ONLY: a full-viewport DARK panel that
 * work-gallery.tsx appends to its track as the final cell and drives from its
 * own pinned timeline (pan brings the panel in from the right; then the
 * gap-close plays; then a settle beat; then the pin releases into the cream
 * Record — the colour contrast her brief asked for).
 *
 * The window plays her real shipped UI (/video/nuzzle/aichatbot.mp4): the
 * thing being compressed between "Designed to feel," and "built to ship." is
 * literal proof — software she built. CSS default = the readable CLOSED line
 * (mobile stack / reduced motion / no-JS); the gallery's motion branch opens
 * the window at setup.
 */
import { useEffect, useRef, useState } from "react"
import { DuneSoftScoped } from "@/app/lab/bg/flow-effects"

/* THE LIVE CODE WINDOW (her 2026-07-19 pick over stock video, no screen
   recording needed): a small editor panel where this site's OWN source types
   itself out — and the snippet shown is the exact timeline that squeezes THIS
   window shut. The thing between "designed" and "shipped" is the making, so
   the gap holds real code, writing itself, forever. Reduced motion shows the
   finished snippet. */
const CODE_LINES: readonly { t: string; c: "mut" | "gold" | "ink" }[] = [
  { t: "// the window IS the gap:", c: "mut" },
  { t: "// scroll squeezes it shut", c: "mut" },
  { t: "tl.to(win, {", c: "ink" },
  { t: '  width: "0.24em",', c: "gold" },
  { t: '  ease: "none",', c: "ink" },
  { t: "}, c0)", c: "ink" },
  { t: "", c: "ink" },
  { t: "// once design and build", c: "mut" },
  { t: "// have met, the claim lands", c: "mut" },
  { t: "tl.to(sub, {", c: "ink" },
  { t: "  autoAlpha: 1,", c: "ink" },
  { t: '  ease: "power2.out",', c: "gold" },
  { t: "})", c: "ink" },
] as const

function LiveCode() {
  const [count, setCount] = useState(0)
  const total = CODE_LINES.reduce((n, l) => n + l.t.length + 1, 0)
  const reducedRef = useRef(false)
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedRef.current) {
      setCount(total)
      return
    }
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      if (n > total + 46) n = 0 // hold ~2s on the finished snippet, then rewrite
      setCount(Math.min(n, total))
    }, 42)
    return () => window.clearInterval(id)
  }, [total])

  let left = count
  return (
    <div className="v2gc-code" aria-hidden="true">
      <div className="v2gc-code__bar">
        <span /><span /><span />
        <em>gap-close.tsx</em>
      </div>
      <pre className="v2gc-code__body">
        {CODE_LINES.map((l, i) => {
          const take = Math.max(0, Math.min(l.t.length, left))
          const done = left > l.t.length
          left -= l.t.length + 1
          return (
            <div key={i} className={`v2gc-code__ln v2gc-code__ln--${l.c}`}>
              {l.t.slice(0, take)}
              {!done && take >= 0 && left <= 0 && count < total && (
                <span className="v2gc-caret" />
              )}
            </div>
          )
        })}
        {count >= total && <span className="v2gc-caret v2gc-caret--rest" />}
      </pre>
    </div>
  )
}

export function ThroughlineCell() {
  return (
    <div className="v2wg-cell v2wg-cell--throughline">
      {/* ground: the dune-soft shader — the SAME sand the statement stands on
          (her 2026-07-19 call: the flat champagne read yellow; the panel now
          keeps the Background page's cream family and gets its "own page"
          feeling from the living sand instead of a colour jump). */}
      <div className="v2gc-ground" aria-hidden="true">
        <DuneSoftScoped />
      </div>
      <div className="v2gc-stage">
        <h2 className="v2gc-line">
          <span className="v2gc-half">Designed to feel,</span>
          <span className="v2gc-win" aria-hidden="true">
            <LiveCode />
          </span>{" "}
          <span className="v2gc-half">built to ship.</span>
        </h2>
        <p className="v2gc-sub">
          I design the experience and build what runs behind it.
        </p>
      </div>
    </div>
  )
}
