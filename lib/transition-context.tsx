"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

type TransitionKind = "curtain" | "slide-up"
type Phase = "idle" | "entering" | "exiting"

interface NavigateOptions {
  /** Which overlay style to use. Defaults to "curtain". */
  transition?: TransitionKind
  /** Hex color for the curtain — becomes the dominant tint. Defaults to purple. */
  accentColor?: string
  /**
   * An element id (no "#") to scroll to AFTER navigation. If the target lives on
   * the destination page and the page is still hydrating, we keep trying briefly
   * until the element appears.
   */
  anchor?: string
}

interface TransitionContextValue {
  /** Navigate to a new route with a buffered overlay animation. */
  navigate: (href: string, options?: NavigateOptions) => void
  /** Eased smooth scroll to an element id on the CURRENT page. */
  smoothScrollTo: (targetId: string) => void
  /** Whether a transition is currently running. */
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

// Timing — these durations feel deliberate without being sluggish.
// Enter (cover screen) is slightly shorter than exit (reveal) so the new page
// has a beat to "breathe" before the user sees it. DWELL is how long the
// curtain stays FULLY covering the screen in the middle — a small pause here
// is what makes the transition feel intentional instead of rushed.
const ENTER_MS = 460
const DWELL_MS = 360
const EXIT_MS = 560

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Eased smooth scroll — softer than native `scrollIntoView("smooth")`. Duration
 * scales with distance, and the easing decelerates into the target instead of
 * stopping abruptly. Respects `prefers-reduced-motion`.
 */
export function easedScrollTo(targetY: number, opts?: { duration?: number }) {
  if (typeof window === "undefined") return
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY)
    return
  }

  const startY = window.scrollY
  const distance = targetY - startY
  if (Math.abs(distance) < 2) return

  const duration =
    opts?.duration ??
    Math.min(1300, Math.max(650, Math.abs(distance) * 0.75))
  const startTime = performance.now()
  // Cubic ease-out — starts quick, softly decelerates.
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  function step(now: number) {
    const elapsed = now - startTime
    const t = Math.min(1, elapsed / duration)
    window.scrollTo(0, startY + distance * ease(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * Forcefully pin the page to the top. Some pages have sticky-sidebar scroll
 * listeners and layout effects that can drag the scroll position around as
 * they hydrate — calling this in several spots during/after the route swap
 * guarantees the new page opens at its top, regardless of what other effects
 * are firing underneath the curtain.
 */
function forceScrollTop() {
  if (typeof window === "undefined") return
  window.scrollTo(0, 0)
  if (document.documentElement) document.documentElement.scrollTop = 0
  if (document.body) document.body.scrollTop = 0
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>("idle")
  const [kind, setKind] = useState<TransitionKind>("curtain")
  const [accent, setAccent] = useState<string>("#E692FF")
  // Bumped on every navigation so AnimatePresence remounts the overlay and
  // re-runs the enter/exit animation cleanly.
  const navKeyRef = useRef(0)
  const [navKey, setNavKey] = useState(0)
  const inFlightRef = useRef(false)
  // Remember whether we need to force-scroll on the next pathname change. This
  // lets us pin the new page to the top even if its own effects try to move it.
  const pinToTopRef = useRef(false)

  // When the destination pathname actually changes, immediately reset scroll.
  // This catches cases where project pages have sticky-sidebar listeners that
  // fire on mount and would otherwise leave the page at a non-zero scroll.
  useEffect(() => {
    if (!pinToTopRef.current) return
    forceScrollTop()
    // Keep pinning briefly because layout effects can fire over the next few
    // frames. Each tick checks the ref so we stop as soon as the exit phase
    // begins (which clears the flag) — otherwise we'd fight the anchor scroll.
    const timers: number[] = []
    ;[0, 50, 120, 240, 400].forEach((delay) => {
      timers.push(
        window.setTimeout(() => {
          if (pinToTopRef.current) forceScrollTop()
        }, delay),
      )
    })
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [pathname])

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      if (inFlightRef.current) return
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // Reduced motion — navigate normally with anchor handling.
      if (prefersReducedMotion) {
        router.push(href)
        if (options.anchor) {
          setTimeout(() => {
            const el = document.getElementById(options.anchor as string)
            if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
          }, 50)
        } else {
          setTimeout(forceScrollTop, 50)
        }
        return
      }

      inFlightRef.current = true
      navKeyRef.current += 1
      setNavKey(navKeyRef.current)
      setKind(options.transition ?? "curtain")
      setAccent(options.accentColor ?? "#E692FF")
      setPhase("entering")
      // Signal to the pathname-watcher that the next route should be pinned.
      // If the user is NOT jumping to an anchor, we want the top; if they ARE,
      // we still start at the top and let the anchor scroll happen visibly.
      pinToTopRef.current = true

      // Wait for the overlay to fully cover the screen, then swap routes.
      window.setTimeout(() => {
        router.push(href)

        // Reset scroll to top while the curtain still covers everything. We
        // do this across several frames because Next.js may not have mounted
        // the new page yet and some pages have hydration-time scroll listeners.
        requestAnimationFrame(() => {
          forceScrollTop()
          requestAnimationFrame(() => {
            forceScrollTop()

            // DWELL — hold the curtain fully covering for a beat. This pause
            // is what gives the transition its sense of deliberate intent.
            window.setTimeout(() => {
              forceScrollTop()
              const anchor = options.anchor
              setPhase("exiting")
              // Now that the new page has had time to mount, stop forcing top.
              pinToTopRef.current = false

              // If we need to land at an anchor, kick off an eased scroll once
              // the curtain is partially open. Starting mid-reveal means the
              // page visibly slides down to the section as the overlay
              // disappears — not snaps there invisibly behind it.
              if (anchor) {
                const kickoff = () => {
                  let attempts = 0
                  const tryScroll = () => {
                    const el = document.getElementById(anchor)
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY
                      easedScrollTo(y, { duration: 1000 })
                    } else if (attempts < 8) {
                      attempts += 1
                      window.setTimeout(tryScroll, 40)
                    }
                  }
                  tryScroll()
                }
                window.setTimeout(kickoff, Math.round(EXIT_MS * 0.4))
              }

              window.setTimeout(() => {
                setPhase("idle")
                inFlightRef.current = false
              }, EXIT_MS + 40)
            }, DWELL_MS)
          })
        })
      }, ENTER_MS + 20)
    },
    [router],
  )

  const smoothScrollTo = useCallback((targetId: string) => {
    if (typeof window === "undefined") return
    const el = document.getElementById(targetId)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY
    easedScrollTo(y)
  }, [])

  return (
    <TransitionContext.Provider
      value={{
        navigate,
        smoothScrollTo,
        isTransitioning: phase !== "idle",
      }}
    >
      {children}
      <TransitionOverlay phase={phase} kind={kind} accent={accent} navKey={navKey} />
    </TransitionContext.Provider>
  )
}

function TransitionOverlay({
  phase,
  kind,
  accent,
  navKey,
}: {
  phase: Phase
  kind: TransitionKind
  accent: string
  navKey: number
}) {
  const visible = phase !== "idle"

  // Both overlays share the same warm-dark base — the difference is the
  // flower mark in the center.
  //   Curtain (→ project):   all 5 petals take on the project's accent color.
  //   Slide-up (→ home):     5 petals in the brand palette (matches the cursor).
  const backgroundColor = "#1B1309"
  const backgroundImage = `radial-gradient(95% 75% at 50% 60%, rgba(58,39,20,0.55) 0%, rgba(42,29,16,0.3) 45%, rgba(27,19,9,0) 88%)`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={navKey}
          initial={{ y: "100%" }}
          animate={phase === "entering" ? { y: "0%" } : { y: "-100%" }}
          transition={{
            duration: phase === "entering" ? ENTER_MS / 1000 : EXIT_MS / 1000,
            ease: EASE as unknown as number[],
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            pointerEvents: "none",
            backgroundColor,
            backgroundImage,
            willChange: "transform",
            overflow: "hidden",
          }}
        >
          <FlowerMark tint={kind === "curtain" ? accent : undefined} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * The spinning 5-petal flower mark, matching the custom cursor. Used as the
 * center ornament of every transition overlay so the moment feels
 * unmistakably on-brand instead of a plain dark panel.
 *
 * If `tint` is provided, all 5 petals take on that color (used for the
 * "into project" curtain so the flower speaks the project's accent color).
 * Otherwise, the 5 brand colors are used (for "return home").
 */
function FlowerMark({ tint }: { tint?: string }) {
  const petalColors = tint
    ? [tint, tint, tint, tint, tint]
    : ["#FFC973", "#7AFEA7", "#96C1FF", "#FF9992", "#E692FF"]
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <motion.svg
        width="56"
        height="56"
        viewBox="-16 -16 32 32"
        initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 360, scale: 1, opacity: 1 }}
        transition={{
          rotate: { duration: 4.5, ease: "linear", repeat: Infinity },
          scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.35, ease: "easeOut" },
        }}
        style={{
          filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.3))",
        }}
      >
        <defs>
          <mask id="flower-overlay-hole">
            <rect x="-16" y="-16" width="32" height="32" fill="white" />
            <circle cx="0" cy="0" r="4.2" fill="black" />
          </mask>
        </defs>
        <g mask="url(#flower-overlay-hole)">
          <circle cx="0" cy="-7.2" r="6.8" fill={petalColors[0]} />
          <circle cx="6.85" cy="-2.22" r="6.8" fill={petalColors[1]} />
          <circle cx="4.23" cy="5.82" r="6.8" fill={petalColors[2]} />
          <circle cx="-4.23" cy="5.82" r="6.8" fill={petalColors[3]} />
          <circle cx="-6.85" cy="-2.22" r="6.8" fill={petalColors[4]} />
        </g>
      </motion.svg>
    </div>
  )
}

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) {
    throw new Error("useTransition must be used within a <TransitionProvider>")
  }
  return ctx
}
