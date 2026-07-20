"use client"

/**
 * V2 Reveal — IntersectionObserver fade-up, once. Restrained by design:
 * small translateY + opacity, timings from the ds motion tokens (v2.css).
 * prefers-reduced-motion users see everything immediately (handled both
 * here and in the CSS media query).
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

export function Reveal({ children, delay = 0, className, style }: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in")
            io.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className ? `v2-reveal ${className}` : "v2-reveal"}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  )
}
