"use client"

import { motion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import styles from "./directions.module.css"

/* ---------- reveal (meaningful entrance, respects reduced-motion) ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 18,
}: {
  children: ReactNode
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.62, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- color system ---------- */
export type RampStep = { hex: string; onDark?: boolean }
export type RampGroup = { name: string; steps: RampStep[] }
export type Semantic = { name: string; hex: string }
export type UsageSeg = { label: string; pct: number; bg: string; fg: string }

export function ColorSystem({
  groups,
  semantic,
  usage,
}: {
  groups: RampGroup[]
  semantic: Semantic[]
  usage: UsageSeg[]
}) {
  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Ramps · primary / secondary / neutral</p>
        {groups.map((g) => (
          <div className={styles.rampGroup} key={g.name}>
            <p className={styles.rampGroupName}>{g.name}</p>
            <div className={styles.ramp}>
              {g.steps.map((s) => (
                <div
                  key={s.hex}
                  className={styles.rampStep}
                  style={{ background: s.hex }}
                >
                  <span style={{ color: s.onDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.5)" }}>
                    {s.hex.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Semantic · role tokens</p>
        <div className={styles.swatchRow}>
          {semantic.map((s) => (
            <div className={styles.semSwatch} key={s.name}>
              <span className={styles.semDot} style={{ background: s.hex }} />
              <span className={styles.semText}>
                <span className={styles.semName}>{s.name}</span>
                <span className={styles.semHex}>{s.hex.toUpperCase()}</span>
              </span>
            </div>
          ))}
        </div>
        <p className={styles.cardLabel} style={{ marginTop: 24 }}>
          Usage ratio · whitespace is the loudest color
        </p>
        <div className={styles.usageBar}>
          {usage.map((u) => (
            <div
              key={u.label}
              className={styles.usageSeg}
              style={{ flex: u.pct, background: u.bg, color: u.fg }}
            >
              {u.label} {u.pct}%
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- type scale ---------- */
export type TypeRow = {
  sample: ReactNode
  style: CSSProperties
  role: string
  detail: string
  body?: boolean
}

export function TypeScaleTable({ rows }: { rows: TypeRow[] }) {
  return (
    <div className={styles.typeScale}>
      {rows.map((r, i) => (
        <div className={styles.typeRow} key={i}>
          <p
            className={`${styles.typeSpec} ${r.body ? styles.typeBodySpec : ""}`}
            style={r.style}
          >
            {r.sample}
          </p>
          <div className={styles.typeMeta}>
            <b>{r.role}</b>
            {r.detail}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- spacing ---------- */
export function SpacingBlock({
  steps,
  gridNote,
}: {
  steps: number[]
  gridNote: ReactNode
}) {
  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Spacing scale · 4px base</p>
        <div className={styles.spaceScale}>
          {steps.map((s) => (
            <div className={styles.spaceItem} key={s}>
              <div className={styles.spaceBar} style={{ width: s }} />
              <span className={styles.spaceVal}>{s}px</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Grid &amp; radii</p>
        <p className={styles.gridNote}>{gridNote}</p>
      </div>
    </div>
  )
}

/* ---------- components showcase ---------- */
export type CaseDef = {
  name: string
  tag: string
  outcome: string
  role: string
  imgStyle: CSSProperties
}

export function ComponentsShowcase({
  brand,
  chips,
  inputLabel,
  inputPlaceholder,
  cases,
}: {
  brand: string
  chips: string[]
  inputLabel: string
  inputPlaceholder: string
  cases: CaseDef[]
}) {
  return (
    <div className={styles.grid2}>
      {/* buttons + nav + chips + input */}
      <div className={styles.card}>
        <p className={styles.cardLabel}>Buttons · nav · chips · input</p>

        <div className={styles.ctaRow} style={{ marginBottom: 22 }}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>See the work</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>Say hello</button>
        </div>

        <div className={styles.navbarDemo} style={{ marginBottom: 22 }}>
          <span className={styles.nbBrand}>{brand}</span>
          <span className={styles.nbLinks}>
            <span>Work</span>
            <span>About</span>
          </span>
          <span className={styles.nbCta}>Resume</span>
        </div>

        <div className={styles.chipRow} style={{ marginBottom: 22 }}>
          {chips.map((c, i) => (
            <span key={c} className={`${styles.chip} ${i === 0 ? styles.chipSolid : ""}`}>
              {c}
            </span>
          ))}
        </div>

        <div className={styles.inputDemo}>
          <span className={styles.inputLabel}>{inputLabel}</span>
          <label className={styles.inputField}>
            <input placeholder={inputPlaceholder} aria-label={inputLabel} />
            <span className={styles.inputCaret} />
          </label>
        </div>
      </div>

      {/* project / case cards */}
      <div className={styles.card}>
        <p className={styles.cardLabel}>Project / case card · hover to lift</p>
        <div className={styles.grid2} style={{ gap: 16 }}>
          {cases.map((c) => (
            <article className={styles.caseCard} key={c.name}>
              <div className={styles.caseImg}>
                <span className={styles.caseTagFloat}>{c.tag}</span>
                <div className={styles.caseImgInner} style={c.imgStyle} />
              </div>
              <div className={styles.caseBody}>
                <h4 className={styles.caseName}>{c.name}</h4>
                <div className={styles.caseMeta}>
                  <span className={styles.caseOutcome}>{c.outcome}</span>
                  <span className={styles.caseRole}>{c.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- motion tokens ---------- */
export type MotionToken = { k: string; v: string }

export function MotionTokens({
  tokens,
  signature,
}: {
  tokens: MotionToken[]
  signature: ReactNode
}) {
  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Motion tokens</p>
        <div className={styles.motionTokenRow}>
          {tokens.map((t) => (
            <div className={styles.motionToken} key={t.k}>
              <span>{t.k}</span>
              <b>{t.v}</b>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card}>
        <p className={styles.cardLabel}>Signature motion · live loop</p>
        {signature}
      </div>
    </div>
  )
}

/* ---------- section label ---------- */
export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className={styles.sectionLabel}>
      <b>{n}</b>
      {children}
    </p>
  )
}

/* ---------- material row ---------- */
export function MaterialRow({ tiles }: { tiles: { name: string; cls: string }[] }) {
  return (
    <div className={styles.materialRow}>
      {tiles.map((t) => (
        <div key={t.name} className={`${styles.materialTile} ${styles[t.cls]}`}>
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  )
}
