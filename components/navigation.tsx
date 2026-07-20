"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useChameleonColor } from "@/lib/chameleon-context"
import { easedScrollTo, useTransition as usePageTransition } from "@/lib/transition-context"
import { LiquidGlass } from "@/components/liquid-glass"
import { ACCENT, ACCENT_CREAM } from "@/lib/brand"

// One accent for the whole nav (design-system single accent).
const ACCENT_HEX = ACCENT

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [onCream, setOnCream] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  /* auto-hide (her 2026-07-19 call, per her reference recording): scrolling
     DOWN tucks the nav away — the page owns the screen; ANY upward scroll
     (= she wants to go somewhere) brings it back. Near the top it is always
     present. Threshold ±4px so Lenis inertia never makes it flutter. */
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  /* is this header wearing the liquid pill? (lab-glass-nav centers it with
     left:50% + translateX(-50%); the hide transform must carry that X or the
     pill jumps off-center — her 2026-07-19 screenshot) */
  const pilledRef = useRef(false)
  useEffect(() => {
    pilledRef.current = !!headerRef.current?.closest(".lab-glass-nav")
  }, [])
  const { setActiveColor } = useChameleonColor()
  const pathname = usePathname()
  const { navigate, smoothScrollTo } = usePageTransition()

  useEffect(() => {
    const navY = 40 // sample point: the nav's vertical center band
    const handleScroll = () => {
      const y = window.scrollY
      const dy = y - lastY.current
      lastY.current = y
      if (y < 90) setHidden(false)
      else if (dy > 4) setHidden(true)
      else if (dy < -4) setHidden(false)
      setIsScrolled(y > 50)
      // scroll-spy: is a cream-themed section currently under the nav?
      let cream = false
      document.querySelectorAll(".section-cream").forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect()
        if (r.top <= navY && r.bottom > navY) cream = true
      })
      setOnCream(cream)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const onEnter = () => setActiveColor(ACCENT_HEX)
  const onLeave = () => setActiveColor(null)

  /* the HOMEPAGE is /v2 (2026-07-19 fix: these used to send her back to the
     retired old site at "/"). On the homepage the links glide in place; from
     any other page they navigate home first, then land on the anchor. */
  const HOME = "/v2"
  const isHome = pathname === HOME || pathname === `${HOME}/`

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) smoothScrollTo("contact")
    else navigate(HOME, { transition: "slide-up", anchor: "contact" })
  }

  const handleWorkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) smoothScrollTo("work")
    else navigate(HOME, { transition: "slide-up", anchor: "work" })
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) smoothScrollTo("about")
    else navigate(HOME, { transition: "slide-up", anchor: "about" })
  }

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) easedScrollTo(0)
    else navigate(HOME, { transition: "slide-up" })
  }

  // Refined link: muted at rest, brightens on hover, with an accent underline
  // that draws in from the left. One consistent treatment for all nav links.
  const linkCls =
    "relative text-sm uppercase tracking-[0.15em] text-foreground/70 transition-colors duration-300 hover:text-foreground after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent)] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100"

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
        /* auto-hide: hidden = an INLINE transform that COMPOSES the pill's own
           translateX(-50%) with the upward slide (the pill's top/left carry
           !important, and a bare translateY overrode its centering — both
           failure modes are 2026-07-19 lessons). Visible = NO inline transform
           at all, so the stylesheet's own centering rules govern. */
        style={{
          ...(onCream
            ? ({
                "--foreground": "#0c0a08",
                "--accent": ACCENT_CREAM,
              } as React.CSSProperties)
            : null),
          ...(hidden && !isMobileMenuOpen
            ? {
                transform: pilledRef.current
                  ? "translateX(-50%) translateY(-160%)"
                  : "translateY(-130%)",
              }
            : null),
          transition:
            "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), color 0.5s, background-color 0.5s",
        }}
      >
        {/* Liquid-glass surface — dark glass only over dark sections; over cream
            it would read as a smudge, so we drop it and go dark-on-cream. */}
        <LiquidGlass
          active={isScrolled && !onCream}
          blur={6}
          scale={14}
          className="absolute inset-0 border-b border-[var(--section-divider)]"
        />
        {/* Over cream sections: a light cream backing (the dark glass would
            smudge), so content scrolling under the nav stays masked and the
            dark-on-cream links stay legible. */}
        {onCream && isScrolled && (
          <div className="absolute inset-0 border-b border-black/10 bg-[#f4ecdd]/85 backdrop-blur-md" />
        )}
        <nav className="relative z-10 px-6 md:px-12 lg:px-24 py-6 flex items-center justify-between">
          <button
            onClick={handleNameClick}
            className="text-xl font-black tracking-normal text-foreground transition-colors duration-300 hover:text-[var(--accent)]"
            style={{ fontFamily: "var(--font-display)" }}
            data-cursor-hover
            data-cursor-color={ACCENT_HEX}
          >
            Aijia Fang
          </button>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/v2#work"
              onClick={handleWorkClick}
              className={linkCls}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              data-cursor-hover
              data-cursor-color={ACCENT_HEX}
            >
              Work
            </Link>
            <Link
              href="/v2#about"
              onClick={handleAboutClick}
              className={linkCls}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              data-cursor-hover
              data-cursor-color={ACCENT_HEX}
            >
              About
            </Link>
            <button
              onClick={handleContactClick}
              className="text-sm uppercase tracking-[0.15em] px-6 py-2.5 rounded-full border border-foreground/30 text-foreground/80 transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              data-cursor-hover
              data-cursor-color={ACCENT_HEX}
            >
              Contact
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-foreground"
            aria-label="Open menu"
            data-cursor-hover
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="px-6 py-6 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  Aijia Fang
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-foreground"
                  aria-label="Close menu"
                  data-cursor-hover
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-8 mt-20">
                <Link
                  href="/v2#work"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleWorkClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-colors duration-300 hover:text-[var(--accent)]"
                  data-cursor-hover
                >
                  Work
                </Link>
                <Link
                  href="/v2#about"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleAboutClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-colors duration-300 hover:text-[var(--accent)]"
                  data-cursor-hover
                >
                  About
                </Link>
                <button
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleContactClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-colors duration-300 hover:text-[var(--accent)] text-left"
                  data-cursor-hover
                >
                  Contact
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
