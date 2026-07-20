"use client"

import type React from "react"
import { useEffect } from "react"
import Lenis from "lenis"
import { setLenis } from "@/lib/lenis"
import { scrollProgress } from "@/lib/scroll-progress"
import { ScrollTrigger } from "@/lib/gsap"

/**
 * Buttery momentum scrolling (Lenis) — the "gliding" feel of haoqi.design /
 * poch.studio / COLLINS. Skipped for users who prefer reduced motion (they get
 * the native scroll). framer-motion's useScroll keeps working because Lenis
 * drives the real window scroll position.
 *
 * This is also the single place we publish the page scroll clock: once per
 * frame it writes `scrollProgress` (0..1) and mirrors it to `--scroll` on
 * <html>. Reduced-motion users get the same value from a passive native
 * scroll listener instead.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    const publish = (p: number) => {
      const clamped = p < 0 ? 0 : p > 1 ? 1 : p
      scrollProgress.set(clamped)
      root.style.setProperty("--scroll", clamped.toFixed(4))
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        publish(max > 0 ? window.scrollY / max : 0)
      }
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    const lenis = new Lenis({
      duration: 1.15,
      // cubic ease-out — quick start, soft landing
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    setLenis(lenis)
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis

    // Keep GSAP ScrollTrigger in lock-step with Lenis momentum (single clock).
    lenis.on("scroll", ScrollTrigger.update)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      // lenis.progress is 0..1 across the scrollable range
      publish(lenis.progress || 0)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.off("scroll", ScrollTrigger.update)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
