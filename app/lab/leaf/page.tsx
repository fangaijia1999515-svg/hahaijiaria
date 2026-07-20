/**
 * /lab/leaf — LEAF STUDY 01. Trial for the homepage SECOND-SCREEN background:
 * an elegant olive branch rendered entirely from fine warm-grey particles (her
 * 灰色的粒子 idea, the alternative to the shadow photographs she found mediocre).
 * The branch enters from the left; centre-right stays open for the statement.
 *
 * Server wrapper (noindex) + "use client" LeafField. Rendered inside dsFontVars
 * so the mono/serif labels resolve. On top sits the REAL second-screen copy
 * (StatementOverlay), reproduced STATICALLY so the whole composition can be
 * judged; ?bare=1 hides it for the pure background view. The particle homes come
 * from the branched SilhouetteSource sampler (see silhouette.ts). Isolated lab
 * route; nothing here ships until she picks.
 */
import type { Metadata } from "next"
import { dsFontVars } from "@/lib/ds-fonts"
import { LeafField } from "./leaf-field"
import "./leaf.css"

export const metadata: Metadata = {
  title: "粒子枝叶试验 · Aijia Fang",
  robots: { index: false, follow: false },
}

export default async function LeafLabPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const bare = sp.bare === "1"
  return (
    <main className={`leaf-page ${dsFontVars}`}>
      <LeafField />
      {!bare && <StatementOverlay />}
    </main>
  )
}

/* The real screen-2 statement, verbatim (light variant), laid on top STATIC so
   the plant + words read as one composition. Copy mirrors components/v2/
   statement.tsx exactly; non-interactive so the branch still sways underneath. */
function StatementOverlay() {
  return (
    <div className="lab-stmt">
      <div className="lab-stmt__stage">
        <div className="lab-stmt__inner">
          <p className="lab-stmt__tag">About</p>

          <p className="lab-stmt__lead">
            <span className="lab-stmt__indent" aria-hidden="true" />
            I design for the moment a person and a product click, where
            something complicated starts to feel simple, and even beautiful.
          </p>

          <div className="lab-stmt__rulewrap" aria-hidden="true">
            <span className="lab-stmt__rule" />
            <span className="lab-stmt__plus">+</span>
          </div>

          <div className="lab-stmt__row">
            <p className="lab-stmt__credo">
              Designed to feel,
              <br />
              built to ship,
              <br />
              idea to a working thing.
            </p>

            <div className="lab-stmt__mission">
              <p>
                I bring taste, a service designer&apos;s instinct for the real
                problem, and the ability to build what I imagine with AI, not
                just mock it up.
              </p>
              <a className="lab-stmt__more" href="#about">
                More about me <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
