"use client"

/**
 * CASE V2 FRAME — the work-detail anatomy, rebuilt to the art-direction spec
 * at reference-analysis/CASE-ANATOMY-SPEC.md (trionn grammar, her boards).
 *
 *   FULL-BLEED EDGE GRID   — dossier at the viewport's left edge (2.2% margin,
 *                            NOT the centered 1440 box), 1px green divider in
 *                            the gutter, stream (plate zone) ~64-67% wide.
 *   STICKY DOSSIER         — CSS sticky, three clusters: HEAD (identity),
 *                            BODY (chapter TABS + the SWAPPING LEAD), FOOT
 *                            (VIEW LIVE + BACK/NEXT). Tabs replace the old
 *                            dot-scrollspy; the framing lead of the active
 *                            chapter cross-fades in place, scroll-driven.
 *   BOARD STREAM           — mixed-density editorial rhythm: true presentation
 *                            boards full-bleed; working diagrams sized wide
 *                            (~78%) or paired in a DUO row; phone screens in a
 *                            QUAD register; some text framed as a TEXTCARD
 *                            beside an image. Wells stay contain/native-aspect
 *                            (radius/hairline/elev-1), mono caption on the
 *                            stage below; full-width set-piece screens
 *                            (KPI / QUOTE / STATEMENT / PROP / SUB) between.
 *   DARK STAGE             — the case surface runs on `.cv2-stage.ds-dark`
 *                            (warm charcoal #2D2D2D). Cream = drop the class.
 *
 * Motion: lib/gsap.ts singletons only; V2_EASE for reveals, the registered
 * ds-standard ease for the lead swap; CSS/markup default = readable end state
 * (no-JS safe); prefers-reduced-motion gets instant final states. NO
 * scroll-snap; the dossier pin is CSS sticky, never GSAP.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react"
import Link from "next/link"
import { CustomEase, gsap, ScrollTrigger, useGSAP, V2_EASE } from "@/lib/gsap"
import { getLenis } from "@/lib/lenis"
import { Logo } from "@/components/ds"

const MOTION = "(prefers-reduced-motion: no-preference)"

/* the lead swap runs on --ds-ease-standard cubic-bezier(0.4,0,0.2,1); we
   register it once as a GSAP ease (same curve as the CSS token — this is NOT
   a third ease, it IS the standard one). Module scope runs once per client. */
const CV2_STANDARD = "cv2Standard"
if (typeof window !== "undefined") {
  CustomEase.create(CV2_STANDARD, "0.4,0,0.2,1")
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* ---------------------------------------------------------------------------
   NAV / LEAD ARCHITECTURE — single source (the nav array); two mount points
   (pinned dossier on desktop, inline chapter lead on mobile via context).
--------------------------------------------------------------------------- */
export interface CaseNavItem {
  id: string
  label: string
  /** the chapter's framing paragraph — swapped into the dossier as you scroll
      (desktop) and rendered inline above the chapter's first board (mobile). */
  lead?: ReactNode
}

const CaseLeadContext = createContext<Record<string, ReactNode>>({})

/* ---------------------------------------------------------------------------
   FRAME
--------------------------------------------------------------------------- */
export function CaseFrame({
  title,
  oneLiner,
  meta,
  services,
  credential,
  nav,
  live,
  backHref,
  next,
  children,
}: {
  title: string
  oneLiner: string
  meta: { k: string; v: string }[]
  services: string[]
  /** optional award / credential line, appended to the services row */
  credential?: string
  nav: CaseNavItem[]
  /** optional external link for the dossier FOOT (VIEW LIVE slot) */
  live?: { label: string; href: string }
  backHref: string
  next: { title: string; href: string }
  children: ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const [active, setActive] = useState(nav[0]?.id)
  const [shown, setShown] = useState(nav[0]?.id)
  const mountedRef = useRef(false)

  const leads = useMemo(() => {
    const map: Record<string, ReactNode> = {}
    nav.forEach((item) => {
      if (item.lead) map[item.id] = item.lead
    })
    return map
  }, [nav])

  /* scrollspy is state, not motion: it runs regardless of reduced-motion */
  useEffect(() => {
    const triggers = nav.map((item) =>
      ScrollTrigger.create({
        trigger: `#${item.id}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(item.id)
        },
      })
    )
    /* above the first chapter (hero zone) the first tab holds the light */
    const first = nav[0]?.id
    if (first) {
      triggers.push(
        ScrollTrigger.create({
          trigger: `#${first}`,
          start: "top bottom",
          end: "top 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(first)
          },
        })
      )
    }
    return () => triggers.forEach((t) => t.kill())
  }, [nav])

  /* triggers measure real layout: refresh once webfonts settle */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(refresh)
    }
    window.addEventListener("load", refresh)
    return () => window.removeEventListener("load", refresh)
  }, [])

  /* THE SWAPPING LEAD, phase 1 — cross-fade OUT (160ms), then swap the text.
     Reduced motion swaps instantly. 400ms total with the IN phase below. */
  useEffect(() => {
    const el = leadRef.current
    if (active === shown) {
      /* interrupted mid-swap and returned to the same chapter: settle legible */
      if (el && !prefersReduced()) {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.2, ease: CV2_STANDARD, overwrite: "auto" })
      }
      return
    }
    if (!el || prefersReduced()) {
      setShown(active)
      return
    }
    const tween = gsap.to(el, {
      autoAlpha: 0,
      y: -8,
      duration: 0.16,
      ease: CV2_STANDARD,
      overwrite: "auto",
      onComplete: () => setShown(active),
    })
    return () => {
      tween.kill()
    }
  }, [active, shown])

  /* THE SWAPPING LEAD, phase 2 — cross-fade IN (240ms) once the text swapped */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const el = leadRef.current
    if (!el) return
    if (prefersReduced()) {
      gsap.set(el, { autoAlpha: 1, y: 0 })
      return
    }
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.24, ease: CV2_STANDARD, overwrite: "auto" }
    )
  }, [shown])

  /* tab click = smooth-scroll (Lenis) to the chapter's first board */
  const jumpTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return /* null-guard: fall back to native anchor behavior */
    e.preventDefault()
    const reduced = prefersReduced()
    const lenis = getLenis()
    if (lenis && !reduced) lenis.scrollTo(el, { offset: -24 })
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
    if (typeof history !== "undefined") history.replaceState(null, "", `#${id}`)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        /* the ONE green line: drawn by reading — scaleY = page progress
           (sage fill on the dark stage via --cv2-green; forest on cream) */
        gsap.fromTo(
          ".cv2-divider__progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          }
        )
        /* the dossier settles in once, quietly */
        gsap.fromTo(
          ".cv2-dossier__head > *, .cv2-dossier__body > *, .cv2-dossier__foot > *",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: V2_EASE, stagger: 0.05, delay: 0.1 }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  const servicesRow = credential ? [...services, credential] : services

  return (
    <div ref={rootRef} className="cv2-frame">
      <aside className="cv2-dossier" aria-label={`${title} project dossier`}>
        {/* HEAD — identity + orientation */}
        <div className="cv2-dossier__head">
          <Link href={backHref} className="cv2-dossier__back">
            <span aria-hidden="true">&larr;</span> Back to work
          </Link>
          <span className="cv2-dossier__rule" aria-hidden="true" />
          <h1 className="cv2-dossier__name">{title}</h1>
          <p className="cv2-dossier__line">{oneLiner}</p>
          <ul className="cv2-dossier__meta">
            {meta.map((m) => (
              <li key={m.k}>
                <span className="k">{m.k}</span>
                <span className="v">{m.v}</span>
              </li>
            ))}
          </ul>
          <p className="cv2-dossier__services" aria-label="Methods and tools">
            {servicesRow.join(" · ")}
          </p>
        </div>

        {/* BODY — chapter tabs + the swapping lead */}
        <div className="cv2-dossier__body">
          <nav className="cv2-tabs" aria-label="Case chapters">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`cv2-tab${active === item.id ? " is-active" : ""}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={(e) => jumpTo(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <p ref={leadRef} className="cv2-lead" aria-live="polite">
            {shown ? leads[shown] : null}
          </p>
        </div>

        {/* FOOT — pinned to the bottom of the pin */}
        <div className="cv2-dossier__foot">
          {live ? (
            <a className="cv2-live" href={live.href} target="_blank" rel="noopener noreferrer">
              {live.label}{" "}
              <span className="arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
          ) : null}
          <span className="cv2-dossier__rule" aria-hidden="true" />
          <div className="cv2-dossier__next">
            <Link href={backHref}>Back to work</Link>
            <Link href={next.href}>
              Next: {next.title} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="cv2-divider" aria-hidden="true">
        <span className="cv2-divider__track" />
        <span className="cv2-divider__progress" />
      </div>

      <div className="cv2-narrative">
        <CaseLeadContext.Provider value={leads}>{children}</CaseLeadContext.Provider>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   TOP CHROME — v2-family: wordmark left, talk right (borderless)
--------------------------------------------------------------------------- */
export function CaseTop({ homeHref }: { homeHref: string }) {
  return (
    <header className="cv2-top">
      <Link href={homeHref} className="cv2-top__brand" aria-label="Aijia Fang, home">
        <Logo tagline="" size={20} />
      </Link>
      <a className="cv2-top__talk" href="mailto:hahaijiarah@gmail.com">
        Let&apos;s talk
      </a>
    </header>
  )
}

/* ---------------------------------------------------------------------------
   HERO — BOARD 0. Clip-flood on arrival (1100ms, V2_EASE), then the cover
   settles (scale 1.14 -> 1) on the first 560px of scroll.
--------------------------------------------------------------------------- */
export function CaseHero({
  src,
  alt,
  aspect = "21 / 10",
  captionLeft,
  captionRight,
}: {
  src: string
  alt: string
  /** the board's native W / H (placeholder rule: real aspect, no letterbox) */
  aspect?: string
  captionLeft: string
  captionRight: string
}) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const well = root.querySelector(".cv2-hero__well")
      const img = root.querySelector("img")
      const cap = root.querySelector("figcaption")
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        if (well) {
          /* the flood: board 0 rises into its drawn frame on mount */
          gsap.fromTo(
            well,
            { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0% round 16px)" },
            {
              autoAlpha: 1,
              clipPath: "inset(0% 0% 0% 0% round 16px)",
              duration: 1.1,
              ease: V2_EASE,
              delay: 0.1,
            }
          )
        }
        if (img) {
          /* settle as you begin to read: scrub rides absolute scroll 0 -> 560 */
          gsap.fromTo(
            img,
            { scale: 1.14 },
            { scale: 1, ease: "none", scrollTrigger: { start: 0, end: 560, scrub: 0.5 } }
          )
        }
        if (cap) {
          gsap.fromTo(
            cap,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: V2_EASE, delay: 0.55 }
          )
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <figure ref={rootRef} className="cv2-hero">
      <div className="cv2-hero__well" style={{ aspectRatio: aspect }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} fetchPriority="high" />
      </div>
      <figcaption>
        <span>{captionLeft}</span>
        <span>{captionRight}</span>
      </figcaption>
    </figure>
  )
}

/* ---------------------------------------------------------------------------
   CHAPTER — seam row (index / label / drawing hairline). The framing lead
   lives in the nav array (dossier); on mobile the chapter renders it inline
   from context (the second mount point of the single-source lead).
--------------------------------------------------------------------------- */
export function CaseChapter({
  id,
  index,
  label,
  children,
}: {
  id: string
  index: string
  label: string
  children: ReactNode
}) {
  const rootRef = useRef<HTMLElement>(null)
  const leads = useContext(CaseLeadContext)
  const lead = leads[id]

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const rule = root.querySelector(".cv2-chapter__rule")
      if (!rule) return
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: V2_EASE,
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id={id} className="cv2-chapter" aria-label={label}>
      <div className="cv2-chapter__head">
        <span className="cv2-chapter__index">{index}</span>
        <h2 className="cv2-chapter__label">{label}</h2>
        <span className="cv2-chapter__rule" aria-hidden="true" />
      </div>
      {lead ? <p className="cv2-chapter__mlead">{lead}</p> : null}
      {children}
    </section>
  )
}

/* ---------------------------------------------------------------------------
   BOARD RISE — every plate after board 0 rises into place once
   (autoAlpha 0->1, y 48->0, scale 1.03->1, 1100ms, V2_EASE, top 85%).
--------------------------------------------------------------------------- */
function useBoardRise(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 48, scale: 1.03 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: V2_EASE,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: ref }
  )
}

/* ---------------------------------------------------------------------------
   PLATE — one board per screen. Contain (never cover) in a native-aspect
   well: radius 16 / hairline / elev-1, height-capped at 86vh. Variants:
   `portrait` (height-driven, centered on a stage mat), `panorama` (ultra-wide
   blueprint drag well), legacy `contain` (padded diagram mat). Captions are
   a two-part mono row on the stage, never on the artwork.
--------------------------------------------------------------------------- */
export function Plate({
  tone = "light",
  size = "full",
  contain,
  aspect,
  portrait,
  panorama,
  placeholder,
  caption,
  captionRight,
  sub,
  className,
  children,
}: {
  tone?: "light" | "dark"
  /** full (default) = the whole stream track; wide = ~78% centered (working
      diagrams / minor charts that do not earn full-bleed); half = a cell
      inside a Duo/Quad row (the grid track owns the width) */
  size?: "full" | "wide" | "half"
  /** legacy diagram mat: keeps a small inner padding around the artwork */
  contain?: boolean
  /** the board's native W / H, e.g. "2560 / 1990" (placeholder rule) */
  aspect?: string
  /** taller than 4:5 — height-driven (86vh), centered, stage mat L/R */
  portrait?: boolean
  /** wider than 2.2:1 — native height, overflow-x drag well */
  panorama?: boolean
  /** dev-only corner tag for boards she has not sent yet, e.g. "board 04" */
  placeholder?: string
  caption?: string
  captionRight?: string
  /** compact per-step / per-screen description: small mono annotation under
      the caption row, never a full body paragraph */
  sub?: ReactNode
  className?: string
  children: ReactNode
}) {
  const rootRef = useRef<HTMLElement>(null)
  useBoardRise(rootRef)

  const cls = [
    "cv2-plate",
    tone === "dark" && "cv2-plate--dark",
    size === "wide" && "cv2-plate--wide",
    size === "half" && "cv2-plate--half",
    contain && "cv2-plate--contain",
    portrait && "cv2-plate--portrait",
    panorama && "cv2-plate--pano",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  const hasCaption = Boolean(caption || captionRight || panorama)

  return (
    <figure ref={rootRef} className={cls}>
      <div
        className="cv2-plate__well"
        style={aspect && !panorama ? { aspectRatio: aspect } : undefined}
      >
        {children}
        {placeholder ? (
          <span className="cv2-plate__tag" aria-hidden="true">
            Placeholder · {placeholder}
          </span>
        ) : null}
      </div>
      {hasCaption ? (
        <figcaption>
          {caption ? <span>{caption}</span> : null}
          <span className="cv2-plate__capright">
            {captionRight ? <span>{captionRight}</span> : null}
            {panorama ? <span className="cv2-plate__hint">drag to explore &rarr;</span> : null}
          </span>
        </figcaption>
      ) : null}
      {sub ? <p className="cv2-plate__sub">{sub}</p> : null}
    </figure>
  )
}

/* ---------------------------------------------------------------------------
   DUO — a 2-up side-by-side row; cells are Plates (size="half") or TextCards.
   Ratio picks the column weights (vary ratios across a page — identical
   rows repeated are the monotony smell). Stacks to one column under 768.
--------------------------------------------------------------------------- */
export function Duo({
  ratio = "1:1",
  className,
  children,
}: {
  ratio?: "1:1" | "3:2" | "2:3"
  className?: string
  children: ReactNode
}) {
  const cls = [
    "cv2-duo",
    ratio === "3:2" ? "cv2-duo--32" : ratio === "2:3" ? "cv2-duo--23" : "cv2-duo--11",
    className,
  ]
    .filter(Boolean)
    .join(" ")
  return <div className={cls}>{children}</div>
}

/* ---------------------------------------------------------------------------
   TEXTCARD — a framed text block (1px hairline, radius 16, generous pad):
   text that earns a frame beside an image, or a standing plaque. Optional
   mono overline and serif title; body stays inside a 62ch measure.
--------------------------------------------------------------------------- */
export function TextCard({
  overline,
  title,
  className,
  children,
}: {
  overline?: string
  title?: string
  className?: string
  children: ReactNode
}) {
  return (
    <Rise className={["cv2-textcard", className].filter(Boolean).join(" ")}>
      {overline ? <p className="cv2-textcard__overline">{overline}</p> : null}
      {title ? <h3 className="cv2-textcard__title">{title}</h3> : null}
      <div className="cv2-textcard__body">{children}</div>
    </Rise>
  )
}

/* ---------------------------------------------------------------------------
   QUAD — the app-screen register: one row of four (2x2 under 1024). Cells
   are Plates whose wells run natural portrait height; per-step descriptions
   ride the Plate `sub` (compact mono), never full paragraphs.
--------------------------------------------------------------------------- */
export function Quad({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={["cv2-quad", className].filter(Boolean).join(" ")}>{children}</div>
}

/* ---------------------------------------------------------------------------
   KPI REGISTER — big serif numerals on hairline rails, full stream width;
   numerals ink from taupe-ghost to text (cream on dark) as the row lands.
--------------------------------------------------------------------------- */
export function StatRegister({
  stats,
  cols = 3,
  loud,
}: {
  stats: { value: string; label: string; detail?: string }[]
  cols?: 2 | 3
  loud?: boolean
}) {
  const rootRef = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".cv2-stat"))
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: V2_EASE,
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 86%", once: true },
          }
        )
        const values = root.querySelectorAll(".cv2-stat__value")
        gsap.fromTo(
          values,
          { color: "var(--ds-taupe-ghost)" },
          {
            color: "var(--ds-text)",
            duration: 0.9,
            ease: "none",
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <ul
      ref={rootRef}
      className={`cv2-stats${loud ? " cv2-stats--loud" : ""}${cols === 2 ? " cv2-stats--pair" : ""}`}
      style={{ "--cv2-cols": cols } as CSSProperties}
    >
      {stats.map((s) => (
        <li className="cv2-stat" key={s.label + s.value}>
          <span className="cv2-stat__value">{s.value}</span>
          <span className="cv2-stat__label">{s.label}</span>
          {s.detail ? <span className="cv2-stat__detail">{s.detail}</span> : null}
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------------------
   QUIET RISE — one shared entrance for set-piece text screens
   (quote / statement / sub / prop registers): y 18 -> 0, 900ms, top 86%.
--------------------------------------------------------------------------- */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = rootRef.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: V2_EASE,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   CLOSE BAND — BACK TO WORK / NEXT (real routes, both breakpoints)
--------------------------------------------------------------------------- */
export function CaseClose({
  backHref,
  next,
}: {
  backHref: string
  next: { title: string; href: string }
}) {
  return (
    <nav className="cv2-close" aria-label="Project navigation">
      <Link href={backHref} className="cv2-close__back">
        <span aria-hidden="true">&larr;</span> Back to work
      </Link>
      <div className="cv2-close__next">
        <p className="cv2-close__overline">Next project</p>
        <Link href={next.href} className="cv2-close__title">
          {next.title}
          <span className="arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </nav>
  )
}
