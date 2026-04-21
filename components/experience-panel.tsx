"use client"

import { useId, useMemo, useRef, type CSSProperties } from "react"
import { motion, useInView } from "framer-motion"

export type ExperiencePanelItem = {
  n: string
  period: string
  role: string
  company: string
  body: string
  skills: string[]
  accent: string
  accentHex: string
}

type ExperiencePanelProps = {
  items: ExperiencePanelItem[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const yearDisplayCls =
  "font-mono tabular-nums font-bold leading-none tracking-tight select-none text-white transition-colors duration-200 group-hover:[color:var(--yearAccent)]"

/** Year digits only — pad stays static (no shadow/border on the box) */
const yearFxCls =
  "inline-block origin-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-[1.06] md:group-hover:scale-105"

const yearPadCls =
  "relative z-[3] inline-flex rounded-lg bg-[#110B09] px-3 py-2 md:px-4 md:py-2.5"

const colPad = "px-2 sm:px-6 md:px-10 lg:px-14"

/** Hover → accent: year, title, skills; cursor uses column accentHex (About posters keep their own cursorHex) */
const copyTitleCls =
  "font-sans text-lg font-semibold tracking-[-0.02em] text-white transition-colors duration-200 group-hover:text-[color:var(--yearAccent)] md:text-[1.35rem]"

/** Mono caption — extra air below title */
const copyCompanyCls =
  "mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:mt-3.5"

const copyBodyCls =
  "text-sm leading-[1.65] text-white/72 md:text-[15px] md:leading-[1.7]"

const skillPillCls =
  "inline-flex rounded-full border border-white/15 bg-transparent px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/60 transition-colors duration-200 group-hover:border-[color:var(--yearAccent)] group-hover:text-[color:var(--yearAccent)] sm:text-[10px]"

function ExperienceColumnCopy({ item }: { item: ExperiencePanelItem }) {
  return (
    <div className="flex min-w-0 w-full flex-col items-center text-center">
      <div className="w-full max-w-[30ch]">
        <h3 className={copyTitleCls}>{item.role}</h3>
        <p className={copyCompanyCls}>{item.company}</p>
      </div>

      <div className="mt-5 w-full max-w-[min(100%,38ch)] border-t-section pt-5 md:mt-6 md:pt-6">
        <p className={copyBodyCls}>{item.body}</p>
      </div>

      <ul className="mt-6 flex w-full flex-wrap justify-center gap-2 md:mt-7 md:gap-2.5">
        {item.skills.map((skill) => (
          <li key={skill}>
            <span className={skillPillCls}>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ExperiencePanel({ items }: ExperiencePanelProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pathInView = useInView(wrapRef, { once: true, amount: 0.2 })
  const gradId = `exp-wave-${useId().replace(/:/g, "")}`

  const ordered = useMemo(
    () => [...items].sort((a, b) => a.period.localeCompare(b.period)),
    [items],
  )

  const pathD =
    "M 0 78 C 40 78 85 77 120 75 C 148 74 165 72 172 70 C 218 70 252 126 328 118 C 398 108 458 68 500 70 C 532 72 558 52 592 76 C 628 100 662 60 702 72 C 748 86 792 68 835 70 C 875 72 915 58 952 52 C 978 48 990 48 1000 46"

  const yearRowMinH = "min-h-[calc(100vw*145/1000)]"

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className="relative left-1/2 mb-12 hidden w-screen max-w-[100vw] -translate-x-1/2 md:mb-16 md:block"
      >
        <div className="relative w-full overflow-visible">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-0 z-0 block h-auto w-full overflow-visible"
            style={{ aspectRatio: "1000 / 145" }}
            viewBox="0 0 1000 145"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={ordered[0]?.accentHex} />
                <stop offset="50%" stopColor={ordered[1]?.accentHex} />
                <stop offset="100%" stopColor={ordered[2]?.accentHex} />
              </linearGradient>
            </defs>
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={2.15}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.35 }}
              animate={
                pathInView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0.35 }
              }
              transition={{
                pathLength: { duration: 1.35, ease: EASE },
                opacity: { duration: 0.4 },
              }}
            />
          </svg>

          <div
            className={`relative z-[2] mx-auto grid w-full max-w-[100rem] grid-cols-3 gap-4 ${colPad} pb-2 pt-0`}
          >
            {ordered.map((item, i) => (
              <motion.div
                key={item.period}
                className="group flex flex-col items-center"
                style={{ "--yearAccent": item.accentHex } as CSSProperties}
                data-cursor-hover
                data-cursor-color={item.accentHex}
                data-cursor-no-magnet
                initial={{ opacity: 0, y: 16 }}
                animate={
                  pathInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.5,
                  ease: EASE,
                }}
              >
                <div
                  className={`flex w-full ${yearRowMinH} items-center justify-center`}
                >
                  <span className={yearPadCls}>
                    <span
                      className={`${yearDisplayCls} ${yearFxCls} text-[clamp(2.5rem,5vw,3.75rem)] md:text-[clamp(2.75rem,4.2vw,3.5rem)]`}
                    >
                      {item.period}
                    </span>
                  </span>
                </div>
                <motion.div
                  className="w-full pt-6 md:pt-9"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                >
                  <ExperienceColumnCopy item={item} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12 md:hidden">
        {ordered.map((item) => (
          <div
            key={item.period}
            className="group flex w-full flex-col items-center"
            style={{ "--yearAccent": item.accentHex } as CSSProperties}
            data-cursor-hover
            data-cursor-color={item.accentHex}
            data-cursor-no-magnet
          >
            <span className={yearPadCls}>
              <span
                className={`${yearDisplayCls} ${yearFxCls} text-[clamp(2.25rem,9vw,3rem)]`}
              >
                {item.period}
              </span>
            </span>
            <div className="mt-7 w-full">
              <ExperienceColumnCopy item={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
