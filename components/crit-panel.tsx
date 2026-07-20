"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { AnalysisResult } from "@/lib/crit"

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The full Crit tool (adds an AI suggestion layer on top of this same
 * deterministic engine). Swap to the deployed URL once Crit ships.
 */
const CRIT_URL = "http://localhost:4317"

const CONTRAST_TARGET = 4.5 // WCAG AA for normal text

type Status = "idle" | "loading" | "done" | "error"

type Sample = {
  id: string
  label: string
  note: string
  src: string
}

const SAMPLES: Sample[] = [
  {
    id: "slop",
    label: "AI-slop landing",
    note: "the default the machine reaches for",
    src: "/crit/sample-slop.png",
  },
  {
    id: "clean",
    label: "Considered studio site",
    note: "warm, asymmetric, accountable",
    src: "/crit/sample-clean.png",
  },
]

// Brand-coded by finding type.
const C_CONTRAST = "#ff9992" // coral — contrast failures
const C_SPACING = "#96c1ff" // blue — rhythm / alignment
const C_FLAG = "#ffc973" // amber — slop flagged
const C_PASS = "#7afea7" // mint — clean / verified

type Marker = {
  n: number
  kind: "contrast" | "spacing"
  color: string
  box: { x: number; y: number; w: number; h: number }
  label: string
}

export function CritPanel() {
  const reduce = useReducedMotion()
  const [status, setStatus] = useState<Status>("idle")
  const [src, setSrc] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [activeSample, setActiveSample] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const objectUrl = useRef<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    }
  }, [])

  const run = useCallback(async (imageSrc: string, sampleId: string | null) => {
    setStatus("loading")
    setError(null)
    setResult(null)
    setHovered(null)
    setSrc(imageSrc)
    setActiveSample(sampleId)
    try {
      // Lazy-load the engine so it stays out of the initial bundle.
      const { analyzeImage } = await import("@/lib/crit")
      // Let the "scanning" state paint before the synchronous pixel work.
      await new Promise((r) => requestAnimationFrame(() => r(null)))
      const res = await analyzeImage(imageSrc, { contrastTarget: CONTRAST_TARGET })
      setResult(res)
      setStatus("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that image.")
      setStatus("error")
    }
  }, [])

  const onFile = useCallback(
    (file: File | undefined | null) => {
      if (!file || !file.type.startsWith("image/")) {
        setError("That doesn't look like an image file.")
        setStatus("error")
        return
      }
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
      const url = URL.createObjectURL(file)
      objectUrl.current = url
      run(url, null)
    },
    [run]
  )

  const findings = result ? buildMarkers(result) : []
  const contrastFails = result?.contrast.length ?? 0
  const slopFlags = result?.slop.filter((s) => s.present).length ?? 0
  const slopClean = result ? result.slop.length - slopFlags : 0

  return (
    <div
      className="rounded-[20px] border border-[var(--hairline)] bg-[#0e0c0a] p-3 sm:p-4 md:p-5"
      style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.04) inset" }}
    >
      {/* Tool chrome / titlebar */}
      <div className="flex items-center justify-between px-1.5 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff9992]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc973]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7afea7]/70" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Crit · deterministic engine
          </span>
        </div>
        <a
          href={CRIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
        >
          Open full tool
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── LEFT: canvas / dropzone ───────────────────────────── */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            onFile(e.dataTransfer.files?.[0])
          }}
          className={`relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[14px] border bg-[#0a0908] transition-colors duration-300 sm:min-h-[340px] ${
            dragging
              ? "border-[var(--accent)]"
              : "border-[var(--hairline)]"
          }`}
        >
          {!src && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              data-cursor-hover
              className="group flex w-full flex-col items-center gap-3 px-8 py-12 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--muted-foreground)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                <ArrowUpRight size={18} strokeWidth={1.75} className="rotate-[135deg]" />
              </span>
              <span className="font-sans text-sm text-[var(--foreground)]">
                Drop a UI screenshot
              </span>
              <span className="max-w-[34ch] font-sans text-[13px] leading-relaxed text-[var(--muted-foreground)]">
                Or pick a sample below. Everything runs in your browser. The
                pixels never leave this tab.
              </span>
            </button>
          )}

          {src && (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="UI being critiqued"
                className="block w-full select-none"
                draggable={false}
              />

              {/* annotation overlay */}
              {status === "done" &&
                findings.map((m) => (
                  <div
                    key={m.n}
                    onMouseEnter={() => setHovered(m.n)}
                    onMouseLeave={() => setHovered(null)}
                    className="absolute transition-opacity duration-200"
                    style={{
                      left: `${m.box.x * 100}%`,
                      top: `${m.box.y * 100}%`,
                      width: `${m.box.w * 100}%`,
                      height: `${m.box.h * 100}%`,
                      border: `1.5px solid ${m.color}`,
                      borderRadius: 3,
                      background:
                        hovered === m.n ? `${m.color}22` : "transparent",
                      boxShadow:
                        hovered === m.n ? `0 0 0 1px ${m.color}` : "none",
                      opacity: hovered === null || hovered === m.n ? 1 : 0.35,
                    }}
                  >
                    <span
                      className="absolute -left-px -top-px flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] px-1 font-mono text-[10px] font-semibold leading-none"
                      style={{ background: m.color, color: "#0c0a08" }}
                    >
                      {m.n}
                    </span>
                  </div>
                ))}

              {/* scanning state */}
              {status === "loading" && (
                <div className="absolute inset-0 bg-[#0a0908]/55 backdrop-blur-[1px]">
                  {!reduce && (
                    <motion.div
                      className="absolute inset-x-0 h-[2px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${C_PASS}, transparent)`,
                        boxShadow: `0 0 12px ${C_PASS}`,
                      }}
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <span className="absolute bottom-3 left-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                    Measuring…
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: report ─────────────────────────────────────── */}
        <div className="flex flex-col">
          {status === "idle" && <ReportEmpty />}
          {status === "error" && (
            <div className="flex flex-1 items-center justify-center rounded-[14px] border border-[var(--hairline)] p-6 text-center font-sans text-sm text-[var(--muted-foreground)]">
              {error}
            </div>
          )}
          {(status === "loading" || status === "done") && (
            <div className="flex flex-1 flex-col gap-3">
              {/* scoreline */}
              <div className="grid grid-cols-3 gap-2">
                <Stat
                  value={status === "done" ? contrastFails : "··"}
                  label="contrast fails"
                  color={contrastFails > 0 ? C_CONTRAST : C_PASS}
                  done={status === "done"}
                />
                <Stat
                  value={status === "done" ? slopFlags : "··"}
                  label="slop flags"
                  color={slopFlags > 0 ? C_FLAG : C_PASS}
                  done={status === "done"}
                />
                <Stat
                  value={status === "done" ? slopClean : "··"}
                  label="checks clean"
                  color={C_PASS}
                  done={status === "done"}
                />
              </div>

              {status === "done" && result && (
                <div className="flex flex-col gap-3.5 overflow-y-auto pr-0.5">
                  <LocatedFindings
                    findings={findings}
                    hovered={hovered}
                    setHovered={setHovered}
                  />
                  <SlopList result={result} />
                  <PaletteStrip result={result} />
                  <p className="font-mono text-[10px] leading-relaxed text-[var(--muted-foreground)]/70">
                    Contrast = exact WCAG 2.x math. Slop checks are named pixel
                    heuristics; each shows the number behind its verdict.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── sample chips ───────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap items-center gap-2 px-1.5 pt-3 sm:mt-4">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]/70">
          Try
        </span>
        {SAMPLES.map((s) => {
          const on = activeSample === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => run(s.src, s.id)}
              data-cursor-hover
              className={`group rounded-full border px-3.5 py-1.5 text-left transition-colors duration-300 ${
                on
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--hairline)] hover:border-[var(--foreground)]/30"
              }`}
            >
              <span
                className={`font-sans text-[13px] font-medium ${
                  on ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                }`}
              >
                {s.label}
              </span>
              <span className="ml-2 hidden font-sans text-[12px] text-[var(--muted-foreground)] sm:inline">
                {s.note}
              </span>
            </button>
          )
        })}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          data-cursor-hover
          className="ml-auto font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
        >
          Upload your own
        </button>
      </div>
    </div>
  )
}

function Stat({
  value,
  label,
  color,
  done,
}: {
  value: number | string
  label: string
  color: string
  done: boolean
}) {
  return (
    <div className="rounded-[12px] border border-[var(--hairline)] bg-[#0a0908] px-3 py-2.5">
      <div
        className="font-display text-[26px] font-bold leading-none tracking-[-0.02em]"
        style={{ color: done ? color : "var(--muted-foreground)" }}
      >
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        {label}
      </div>
    </div>
  )
}

function ReportEmpty() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4 rounded-[14px] border border-dashed border-[var(--hairline)] p-6">
      {[
        ["WCAG contrast", "Exact ratio on every text region it finds."],
        ["Spacing rhythm", "Flags gaps that break the vertical beat."],
        ["AI-slop checklist", "8 named heuristics for machine-made taste."],
      ].map(([t, d]) => (
        <div key={t} className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
          <div>
            <div className="font-sans text-sm font-medium text-[var(--foreground)]">
              {t}
            </div>
            <div className="font-sans text-[13px] leading-relaxed text-[var(--muted-foreground)]">
              {d}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LocatedFindings({
  findings,
  hovered,
  setHovered,
}: {
  findings: Marker[]
  hovered: number | null
  setHovered: (n: number | null) => void
}) {
  if (findings.length === 0) {
    return (
      <div className="rounded-[12px] border border-[var(--hairline)] bg-[#0a0908] px-3.5 py-3">
        <p className="font-sans text-[13px] text-[var(--foreground)]">
          <span style={{ color: C_PASS }}>No located contrast or spacing
          faults.</span>{" "}
          <span className="text-[var(--muted-foreground)]">
            Text regions clear AA and the layout holds its rhythm.
          </span>
        </p>
      </div>
    )
  }
  return (
    <div>
      <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        Located findings
      </h4>
      <ul className="flex flex-col gap-1.5">
        {findings.map((m) => (
          <li
            key={m.n}
            onMouseEnter={() => setHovered(m.n)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-start gap-2.5 rounded-[10px] px-2 py-1.5 transition-colors"
            style={{
              background: hovered === m.n ? `${m.color}14` : "transparent",
            }}
          >
            <span
              className="mt-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] px-1 font-mono text-[10px] font-semibold leading-none"
              style={{ background: m.color, color: "#0c0a08" }}
            >
              {m.n}
            </span>
            <span className="font-sans text-[13px] leading-snug text-[var(--foreground)]">
              {m.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SlopList({ result }: { result: AnalysisResult }) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        Slop checklist
      </h4>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
        {result.slop.map((c) => (
          <li key={c.id} className="flex items-start gap-2 py-0.5" title={c.detail}>
            <span
              className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: c.present ? C_FLAG : C_PASS }}
            />
            <span
              className={`font-sans text-[12.5px] leading-tight ${
                c.present
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] line-through decoration-[var(--muted-foreground)]/40"
              }`}
            >
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PaletteStrip({ result }: { result: AnalysisResult }) {
  if (!result.sampledColors.length) return null
  return (
    <div>
      <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        Sampled palette
      </h4>
      <div className="flex h-7 overflow-hidden rounded-[8px] border border-[var(--hairline)]">
        {result.sampledColors.map((c) => (
          <div
            key={c.hex}
            title={`${c.hex} · ${(c.share * 100).toFixed(0)}%`}
            style={{ background: c.hex, flexGrow: c.share }}
          />
        ))}
      </div>
    </div>
  )
}

function buildMarkers(result: AnalysisResult): Marker[] {
  const out: Marker[] = []
  let n = 1
  for (const c of result.contrast) {
    const tier = c.passesAALarge ? "fails AA (small text)" : "fails AA"
    out.push({
      n: n++,
      kind: "contrast",
      color: C_CONTRAST,
      box: c.box,
      label: `Contrast ${c.ratio}:1, ${tier}. ${c.fgHex} on ${c.bgHex}.`,
    })
  }
  for (const s of result.spacing) {
    out.push({
      n: n++,
      kind: "spacing",
      color: C_SPACING,
      box: s.box,
      label: s.detail + ".",
    })
  }
  return out
}
