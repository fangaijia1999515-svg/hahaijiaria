"use client"

/**
 * FINRA case diagram — drawn in code, NDA-safe by construction.
 * One diagram only (her calls, 2026-08-21): the parallel-streams truth of
 * how the work ran. No page counts, no handoff rail, no repeated labels;
 * the header line carries the whole sentence once.
 */

const INK = "var(--cl-ink, #2D2D2D)"
const MUTED = "var(--cl-text-muted, #6B6560)"
const HAIR = "rgba(45,45,45,0.16)"
const HAIR_SOFT = "rgba(45,45,45,0.09)"
const CHAMPAGNE = "#C9A468"
const MONO = "var(--ds-font-mono, 'IBM Plex Mono', monospace)"
const SERIF = "var(--ds-font-display, 'Cormorant', Georgia, serif)"

const mono = (size: number) => ({
  fontFamily: MONO,
  fontSize: size,
  letterSpacing: "0.16em",
} as const)

const serif = (size: number) => ({
  fontFamily: SERIF,
  fontSize: size,
  fontWeight: 500,
} as const)

/* One research push -> four deliverables built in parallel -> one handoff.
   This replaces the earlier waterfall timeline, which was wrong: nothing
   here ran in sequence. */
export function ParallelStreamsDiagram({ accentColor }: { accentColor: string }) {
  const streams = [
    "Brand and Identity Audit",
    "Digital Brand Experience Strategy",
    "Brand Asset Library",
    "Internal Communications Toolkit",
  ]
  const trunk = [
    "Three audience tracks",
    "Brand diagnostics workshop",
    "Six stakeholder interviews",
    "Full public touchpoint audit",
    "Journeys + service blueprints",
  ]
  const bx = 590
  const bw = 470
  return (
    <svg viewBox="0 0 1200 470" className="w-full h-auto" role="img"
      aria-label="One research push feeding four deliverables built in parallel, handed off together in week ten">
      <text x={60} y={44} style={mono(15)} fill={MUTED}>ONE RESEARCH PUSH · FOUR PARALLEL STREAMS · ONE HANDOFF</text>

      {/* the research trunk */}
      <rect x={60} y={96} width={460} height={330} rx={14} fill="none" stroke={HAIR} />
      <text x={92} y={156} style={serif(32)} fill={INK}>Research</text>
      <line x1={92} y1={180} x2={488} y2={180} stroke={HAIR} />
      {trunk.map((t, k) => (
        <g key={t}>
          <circle cx={98} cy={212 + k * 38} r={2.5} fill={CHAMPAGNE} />
          <text x={116} y={217 + k * 38} style={mono(13)} fill={MUTED}>{t.toUpperCase()}</text>
        </g>
      ))}

      {/* branches to four parallel streams */}
      {streams.map((s, i) => {
        const by = 110 + i * 84
        return (
          <g key={s}>
            <path d={`M 520 261 C 556 261, 556 ${by + 25}, ${bx} ${by + 25}`} fill="none" stroke={HAIR_SOFT} strokeWidth={1.2} />
            <rect x={bx} y={by} width={bw} height={50} rx={25} fill="none" stroke={HAIR} />
            <circle cx={bx + 30} cy={by + 25} r={2.5} fill={accentColor} />
            <text x={bx + 48} y={by + 30} style={mono(12.5)} fill={INK}>{s.toUpperCase()}</text>
          </g>
        )
      })}
    </svg>
  )
}
