"use client"
/**
 * MAGNET — quiet magnetic hover (2026-07-07)
 * ---------------------------------------------------------------------------
 * The classic award-site micro-interaction, tuned to quiet luxury: children
 * lean gently toward the cursor inside a padded activation zone and settle
 * back with a soft ease. GSAP quickTo keeps it interruptible (emil-design-eng:
 * springs/retargeting over restarts). Fine pointers + full motion only;
 * everyone else gets a plain wrapper.
 */
import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

export function Magnet({
  children,
  strength = 0.28,
  pad = 28,
  className,
}: {
  children: React.ReactNode
  strength?: number
  pad?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      const motion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      if (!fine || !motion) return

      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const inside =
          e.clientX > r.left - pad &&
          e.clientX < r.right + pad &&
          e.clientY > r.top - pad &&
          e.clientY < r.bottom + pad
        if (inside) {
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        } else {
          xTo(0)
          yTo(0)
        }
      }
      window.addEventListener("pointermove", onMove, { passive: true })
      return () => window.removeEventListener("pointermove", onMove)
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", willChange: "transform" }}>
      {children}
    </span>
  )
}
