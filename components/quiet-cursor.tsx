"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

// Elements that read as interactive: the pearl swells over these.
const HOVER_SELECTOR = 'a, button, [role="button"], [data-cursor-hover]'
// Text fields keep a usable native I-beam (globals.css exception); the pearl
// steps back to a whisper over them.
const FIELD_SELECTOR = "input, textarea, select, [contenteditable='true']"

/**
 * QUIET CURSOR v3 — the cream pearl (2026-07-19, her pick).
 * History: v1 dot+ring in mix-blend exclusion (killed: the inversion felt
 * harsh); v2 offered a 3D extruded monogram (killed: 太大, 不聪明) alongside
 * this pearl, which she kept: "圆的实心温柔一点的颜色", just bigger + finer
 * motion. So v3 is the pearl alone, polished:
 *
 *   - 18px solid cream pearl, shaded by its own radial light (top-left
 *     window highlight, taupe under-shade) + a soft cast shadow, so it reads
 *     dimensional on cream AND on the dark stages with no colour inversion.
 *   - follow is a tight spring (precise but silky, never laggy);
 *   - over anything clickable it swells half again with a hint of overshoot
 *     (alive, not bouncy) and its glow warms slightly;
 *   - pressing squashes it, releasing pops it back;
 *   - first appearance blooms in from small instead of teleporting.
 *
 * ?cursor=off = native cursor (persists for the tab); any other stored value
 * falls back to the pearl. Touch / coarse pointers / reduced motion render
 * NOTHING (native cursor stays — globals.css hides the native cursor only
 * while `custom-cursor-active` is on the body, set after the first real
 * pointer move).
 */
export function QuietCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [overField, setOverField] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const px = useSpring(x, { stiffness: 750, damping: 55, mass: 0.4 })
  const py = useSpring(y, { stiffness: 750, damping: 55, mass: 0.4 })

  useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (coarse || reduced) return

    // ?cursor=off (tab-sticky) = native cursor; anything else = the pearl
    try {
      const qp = new URLSearchParams(window.location.search).get("cursor")
      if (qp === "off") sessionStorage.setItem("af-cursor", "off")
      else if (qp) sessionStorage.setItem("af-cursor", "pearl")
      if (sessionStorage.getItem("af-cursor") === "off") return
    } catch {
      /* sessionStorage unavailable → pearl */
    }

    setEnabled(true)

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!document.body.classList.contains("custom-cursor-active")) {
        document.body.classList.add("custom-cursor-active")
        setVisible(true)
      }
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null
      setHovering(!!t?.closest?.(HOVER_SELECTOR))
      setOverField(!!t?.closest?.(FIELD_SELECTOR))
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    document.documentElement.addEventListener("pointerenter", onEnter)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      document.documentElement.removeEventListener("pointerenter", onEnter)
      document.body.classList.remove("custom-cursor-active")
    }
  }, [x, y])

  if (!enabled) return null

  const alpha = !visible ? 0 : overField ? 0.3 : 1
  const scale = !visible ? 0.5 : pressed ? 0.82 : hovering ? 1.5 : 1

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: px,
        y: py,
        translateX: "-50%",
        translateY: "-50%",
        width: 18,
        height: 18,
        borderRadius: "50%",
        /* dune-gold pearl (her 2026-07-19 reference: the sand ball on sunlit
           dunes) — warm highlight, honey mid, toasted shade */
        background:
          "radial-gradient(circle at 30% 26%, #FFF6E4 0%, #EFDDBB 46%, #C8A876 100%)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
      animate={{
        opacity: alpha,
        scale,
        // the pearl's light: resting = soft cast + taupe under-shade + a top
        // window-light thread; over a link the halo warms and widens a touch
        boxShadow: hovering
          ? "0 3px 12px rgba(112, 84, 48, 0.32), inset 0 -2px 4px rgba(112, 84, 48, 0.22), inset 0 1px 2px rgba(255, 248, 230, 0.95), 0 0 0 5px rgba(201, 168, 118, 0.18)"
          : "0 2px 7px rgba(112, 84, 48, 0.34), inset 0 -2px 4px rgba(112, 84, 48, 0.24), inset 0 1px 2px rgba(255, 248, 230, 0.9), 0 0 0 0px rgba(201, 168, 118, 0)",
      }}
      transition={{
        opacity: { duration: 0.22 },
        boxShadow: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
        scale: pressed
          ? { type: "spring", stiffness: 600, damping: 30 }
          : { type: "spring", stiffness: 350, damping: 22 },
      }}
    />
  )
}
