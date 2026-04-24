"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useChameleonColor } from "@/lib/chameleon-context"
import { easedScrollTo, useTransition as usePageTransition } from "@/lib/transition-context"

const NAV_COLORS = {
  work: "var(--proj-yellow)",
  about: "var(--proj-pink)",
  contact: "var(--proj-green)",
}

// Raw hex values for inline styles that need actual colors
const NAV_COLORS_HEX = {
  work: "#FFC973",
  about: "#FF9992",
  contact: "#7AFEA7",
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { setActiveColor } = useChameleonColor()
  const pathname = usePathname()
  const { navigate, smoothScrollTo } = usePageTransition()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleHoverStart = (item: string, color: string) => {
    setHoveredItem(item)
    setActiveColor(color)
  }

  const handleHoverEnd = () => {
    setHoveredItem(null)
    setActiveColor(null)
  }

  // Same-page anchor scrolls use the eased scroller (soft deceleration).
  // Cross-page links use the slide-up overlay so returning "home" feels
  // intentional rather than instant.
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // #contact (the footer) is rendered on every page, so we never need to
    // leave the current page — just glide down to it.
    smoothScrollTo("contact")
  }

  const handleWorkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      smoothScrollTo("work")
    } else {
      navigate("/", { transition: "slide-up", anchor: "work" })
    }
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      smoothScrollTo("about")
    } else {
      navigate("/", { transition: "slide-up", anchor: "about" })
    }
  }

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      easedScrollTo(0)
    } else {
      navigate("/", { transition: "slide-up" })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-xl border-b-section" : "bg-transparent"
        }`}
      >
        <nav className="px-6 md:px-12 lg:px-24 py-6 flex items-center justify-between">
          <button
            onClick={handleNameClick}
            className="text-xl font-black tracking-normal transition-all duration-300 animate-color-cycle"
            style={{
              fontFamily: "var(--font-display)",
            }}
            data-cursor-hover
            data-cursor-color="#E692FF"
          >
            Aijia Fang
          </button>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/#work"
              onClick={handleWorkClick}
              className="text-sm uppercase tracking-[0.15em] transition-all duration-300 ease-out"
              style={{
                color: hoveredItem === "work" ? NAV_COLORS_HEX.work : undefined,
                textShadow:
                  hoveredItem === "work"
                    ? `0 0 10px ${NAV_COLORS_HEX.work}, 0 0 20px ${NAV_COLORS_HEX.work}60`
                    : undefined,
                transform: hoveredItem === "work" ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={() => handleHoverStart("work", NAV_COLORS_HEX.work)}
              onMouseLeave={handleHoverEnd}
              data-cursor-hover
              data-cursor-color={NAV_COLORS_HEX.work}
            >
              Work
            </Link>
            <Link
              href="/#about"
              onClick={handleAboutClick}
              className="text-sm uppercase tracking-[0.15em] transition-all duration-300 ease-out"
              style={{
                color: hoveredItem === "about" ? NAV_COLORS_HEX.about : undefined,
                textShadow:
                  hoveredItem === "about"
                    ? `0 0 10px ${NAV_COLORS_HEX.about}, 0 0 20px ${NAV_COLORS_HEX.about}60`
                    : undefined,
                transform: hoveredItem === "about" ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={() => handleHoverStart("about", NAV_COLORS_HEX.about)}
              onMouseLeave={handleHoverEnd}
              data-cursor-hover
              data-cursor-color={NAV_COLORS_HEX.about}
            >
              About
            </Link>
            <button
              onClick={handleContactClick}
              className="text-sm uppercase tracking-[0.15em] px-6 py-2.5 rounded-full border transition-all duration-300 ease-out"
              style={{
                borderColor: hoveredItem === "contact" ? NAV_COLORS_HEX.contact : "rgba(255,255,255,0.5)",
                color: hoveredItem === "contact" ? NAV_COLORS_HEX.contact : undefined,
                backgroundColor: hoveredItem === "contact" ? `${NAV_COLORS_HEX.contact}15` : undefined,
                boxShadow:
                  hoveredItem === "contact"
                    ? `0 0 15px ${NAV_COLORS_HEX.contact}60, 0 0 30px ${NAV_COLORS_HEX.contact}30`
                    : undefined,
                transform: hoveredItem === "contact" ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={() => handleHoverStart("contact", NAV_COLORS_HEX.contact)}
              onMouseLeave={handleHoverEnd}
              data-cursor-hover
              data-cursor-color={NAV_COLORS_HEX.contact}
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
                <span className="text-xl font-black animate-color-cycle" style={{ fontFamily: "var(--font-display)" }}>
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
                  href="/#work"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleWorkClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-all duration-300 ease-out hover:scale-105"
                  style={{
                    color: hoveredItem === "mobile-work" ? NAV_COLORS_HEX.work : undefined,
                    textShadow:
                      hoveredItem === "mobile-work"
                        ? `0 0 15px ${NAV_COLORS_HEX.work}, 0 0 30px ${NAV_COLORS_HEX.work}60`
                        : undefined,
                  }}
                  onMouseEnter={() => handleHoverStart("mobile-work", NAV_COLORS_HEX.work)}
                  onMouseLeave={handleHoverEnd}
                  data-cursor-hover
                >
                  Work
                </Link>
                <Link
                  href="/#about"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleAboutClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-all duration-300 ease-out hover:scale-105"
                  style={{
                    color: hoveredItem === "mobile-about" ? NAV_COLORS_HEX.about : undefined,
                    textShadow:
                      hoveredItem === "mobile-about"
                        ? `0 0 15px ${NAV_COLORS_HEX.about}, 0 0 30px ${NAV_COLORS_HEX.about}60`
                        : undefined,
                  }}
                  onMouseEnter={() => handleHoverStart("mobile-about", NAV_COLORS_HEX.about)}
                  onMouseLeave={handleHoverEnd}
                  data-cursor-hover
                >
                  About
                </Link>
                <button
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    handleContactClick(e)
                  }}
                  className="font-sans text-5xl font-bold tracking-tight text-foreground transition-all duration-300 ease-out hover:scale-105 text-left"
                  style={{
                    color: hoveredItem === "mobile-contact" ? NAV_COLORS_HEX.contact : undefined,
                    textShadow:
                      hoveredItem === "mobile-contact"
                        ? `0 0 15px ${NAV_COLORS_HEX.contact}, 0 0 30px ${NAV_COLORS_HEX.contact}60`
                        : undefined,
                  }}
                  onMouseEnter={() => handleHoverStart("mobile-contact", NAV_COLORS_HEX.contact)}
                  onMouseLeave={handleHoverEnd}
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
