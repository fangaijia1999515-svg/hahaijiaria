"use client"

/**
 * V2 HERO — Demo 1 from the hero lab, promoted to production (her pick,
 * 2026-07-02). The lake-and-tree landscape belongs to the hero ONLY; the
 * RabenRifaie placement rule carries all the contrast: the serif headline
 * lives alone in the pale sky band, the cream sub + CTA anchor low in the
 * dark grass band, and corner whispers hug the screen edges. No glow, no
 * halo on text — a quiet bottom scrim deepens the grass instead. Load
 * motion is CSS-only (v2.css) so it respects prefers-reduced-motion and
 * still renders without JS.
 *
 * Smooth scroll rides the site-wide Lenis instance from app/layout.tsx
 * (components/smooth-scroll.tsx) via the lib/lenis singleton.
 */
import { useState } from "react"
import { getLenis } from "@/lib/lenis"

/* hero CTA (LOCKED 2026-07-19, her pick = demo C with a twist): resting is
   the GHOST outline — a hairline of cream drawn on the grass; on hover it
   FILLS with the cream liquid glass (the site's signature material answers
   the touch). Inline styles because build-processed backdrop-filter gets
   stripped in this pipeline. */
const CTA_GHOST: React.CSSProperties = {
  background: "rgba(24, 20, 14, 0.10)",
  border: "1px solid rgba(255, 253, 246, 0.78)",
  color: "#FFFDF6",
  textShadow: "0 1px 8px rgba(30, 26, 18, 0.4)",
  boxShadow: "none",
  backdropFilter: "blur(0px)",
  WebkitBackdropFilter: "blur(0px)",
  transition:
    "background 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s, box-shadow 0.4s, backdrop-filter 0.4s, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
}
const CTA_GLASS_HOVER: React.CSSProperties = {
  ...CTA_GHOST,
  background: "rgba(245, 240, 232, 0.42)",
  backdropFilter: "blur(12px) saturate(1.5)",
  WebkitBackdropFilter: "blur(12px) saturate(1.5)",
  border: "1px solid rgba(255, 255, 255, 0.55)",
  boxShadow: "0 6px 22px rgba(30, 26, 18, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
}

function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const lenis = getLenis()
  if (lenis && !reduced) lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
}

export function V2Hero() {
  const [ctaHover, setCtaHover] = useState(false)
  return (
    <section className="v2-hero" id="top">
      <div className="v2-hero__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/image/v2/hero.jpg" alt="" fetchPriority="high" />
      </div>
      <div className="v2-hero__scrim" aria-hidden="true" />

      {/* the hero's own nav row was removed 2026-07-19 (her call: it duplicated
          the site nav) — the shared liquid-glass pill Navigation now rides over
          every page, homepage included (mounted in app/v2/page.tsx). */}

      <div className="v2-hero__sky">
        <h1 className="v2-hero__title">
          <span className="v2-hero__it">The organic</span>
          <span>made digital.</span>
        </h1>
      </div>

      <div className="v2-hero__ground">
        <p className="v2-hero__sub">
          An AI-native product designer,{" "}<br />
          from industrial objects to working software.
        </p>
        <button
          type="button"
          className="v2-hero__pill"
          style={ctaHover ? CTA_GLASS_HOVER : CTA_GHOST}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          onFocus={() => setCtaHover(true)}
          onBlur={() => setCtaHover(false)}
          onClick={() => scrollToHash("#work")}
        >
          View selected work →
        </button>
      </div>

      <p className="v2-hero__corner v2-hero__corner--bl">
        Based in Santa Clara,{" "}<br />California.
      </p>
      <p className="v2-hero__corner v2-hero__corner--br ds-overline">Scroll to explore</p>
    </section>
  )
}
