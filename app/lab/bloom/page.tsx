/**
 * /lab/bloom — BLOOM STUDY 01. Trial for the homepage SECOND-SCREEN background:
 * a generative watercolour garden that climbs in from the LEFT edge (stems grow
 * up-and-right, leaves unfurl, big translucent flowers bloom), leaving the
 * centre-right open for the statement text. Pigment is built from many low-alpha
 * blobs on a persistent canvas and bled through an SVG displacement filter —
 * watercolour as a process, not a texture.
 *
 * Server wrapper (noindex) + "use client" BloomField, rendered inside dsFontVars
 * so the labels resolve. On top sits the REAL second-screen copy (StatementOverlay),
 * reproduced STATICALLY so the whole composition can be judged; ?bare=1 hides it
 * for the pure background view. Isolated lab route; nothing here ships until she
 * picks. Click / tap anywhere regrows a different arrangement (it is generative).
 */
import type { Metadata } from "next"
import { dsFontVars } from "@/lib/ds-fonts"
import { BloomField } from "./bloom-field"
import "./bloom.css"

export const metadata: Metadata = {
  title: "水彩花园试验 · Aijia Fang",
  robots: { index: false, follow: false },
}

export default async function BloomLabPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const bare = sp.bare === "1"
  return (
    <main className={`bloom-page ${dsFontVars}`}>
      <BloomField />
      {!bare && <StatementOverlay />}
    </main>
  )
}

/* The real screen-2 statement, verbatim (light variant), laid on top STATIC so
   the garden + words read as one composition. Copy mirrors components/v2/
   statement.tsx exactly; non-interactive so click still regrows the garden. */
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
