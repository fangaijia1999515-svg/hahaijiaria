/**
 * DS PRIMITIVES — Container, Section, Button, Link, Tag, Logo, LogoMark.
 * Token-only (all styling via .ds-* classes in styles/ds-components.css).
 */
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes, CSSProperties } from "react"
import { IconArrowRight } from "./icons"
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "./monogram-path"

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

/* ---- Container ---- */
export function Container({ wide, className, children }:
  { wide?: boolean; className?: string; children: ReactNode }) {
  return <div className={cx("ds-container", wide && "ds-container--wide", className)}>{children}</div>
}

/* ---- Section ---- */
export function Section({ size = "md", dark, className, children }:
  { size?: "lg" | "md" | "sm"; dark?: boolean; className?: string; children: ReactNode }) {
  return (
    <section className={cx("ds-section", `ds-section--${size}`, dark && "ds-section--dark ds-dark", className)}>
      {children}
    </section>
  )
}

/* ---- Button ---- */
type ButtonProps = {
  variant?: "primary" | "secondary" | "solid" | "ghost"
  size?: "sm" | "md" | "lg"
  arrow?: boolean
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant = "primary", size = "md", arrow, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cx("ds-btn", `ds-btn--${variant}`, size !== "md" && `ds-btn--${size}`, className)}
      {...rest}
    >
      {children}
      {arrow && <IconArrowRight size={16} className="ds-btn__arrow" />}
    </button>
  )
}

/* ---- Link (View project →) ---- */
export function DsLink({ arrow = true, className, children, ...rest }:
  { arrow?: boolean; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cx("ds-link", className)} {...rest}>
      {children}
      {arrow && <IconArrowRight size={14} className="ds-link__arrow" />}
    </a>
  )
}

/* ---- Tag / Chip ---- */
export function Tag({ variant = "outline", className, children }:
  { variant?: "outline" | "solid" | "soft"; className?: string; children: ReactNode }) {
  return <span className={cx("ds-tag", variant !== "outline" && `ds-tag--${variant}`, className)}>{children}</span>
}

/* ---- Organic monogram ------------------------------------------------------
   TRACED 1:1 from her Logo sheet (panel 3): leaf sprig + pebble head + soft
   mound. currentColor, so the reversed (cream-on-charcoal) version is a single
   color swap. Path data lives in monogram-path.ts. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={MONOGRAM_VIEWBOX} aria-hidden="true">
      <path d={MONOGRAM_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

/* ---- Primary wordmark ------------------------------------------------------
   Serif name; per her Logo sheet the botanical sprout REPLACES the tittle of
   the "i" (dotless ı + leaf), + a mono tagline. Reversed = color swap. */
function LeafTittle() {
  // two full little leaves on a short stem, sitting where the i-dot would be
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true"
      style={{ position: "absolute", left: "50%", top: "-0.06em", width: "0.36em", height: "0.36em",
        transform: "translateX(-46%)" }} fill="none">
      <path d="M11 22c0-4.2 0-7 0-9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 13.6C10.6 9.4 8.3 6.4 4.2 5.2c-.5 4.6 1.7 7.6 6.4 8.4Z" fill="currentColor" />
      <path d="M11.4 12.2c-.2-4.4 1.9-7.6 6.1-9-.1 4.8-2.1 7.8-6.1 9Z" fill="currentColor" />
    </svg>
  )
}

export function Logo({ stacked, tagline = "PORTFOLIO", size = 24, mark = false }:
  { stacked?: boolean; tagline?: string; size?: number; mark?: boolean }) {
  const first = (
    <>A<span style={{ position: "relative", display: "inline-block" }}>ı<LeafTittle /></span>jia</>
  )
  const wordStyle: CSSProperties = { position: "relative", fontFamily: "var(--ds-font-display)",
    fontWeight: 400, fontSize: size, lineHeight: 1, letterSpacing: "0.005em", whiteSpace: "nowrap" }
  if (stacked) {
    /* her Logo sheet: STACKED = the name broken over lines, centered,
       tagline letterspaced below. No monogram inside the lockup. */
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center",
        gap: 6, color: "var(--ds-text)", textAlign: "center" }}>
        {mark && <LogoMark size={size * 1.7} />}
        <span style={{ ...wordStyle, lineHeight: 1.12 }}>{first}<br />Fang</span>
        {tagline && <span className="ds-overline" style={{ color: "var(--ds-text-muted)", marginTop: 6 }}>{tagline}</span>}
      </span>
    )
  }
  /* her Logo sheet: PRIMARY = wordmark with the tagline centered BELOW it */
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center",
      gap: tagline ? 8 : 0, color: "var(--ds-text)" }}>
      <span style={wordStyle}>{first}&nbsp;Fang</span>
      {tagline && <span className="ds-overline" style={{ color: "var(--ds-text-muted)" }}>{tagline}</span>}
    </span>
  )
}
