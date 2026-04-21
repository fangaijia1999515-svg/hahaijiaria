"use client"

import { useEffect, useState, useRef } from "react"
import { animate, motion, useMotionValue, useSpring } from "framer-motion"

const defaultColor = "#F3E3CE" // var(--text-primary)

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [currentColor, setCurrentColor] = useState(defaultColor)
  const magnetTarget = useRef<{ x: number; y: number } | null>(null)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const rotate = useMotionValue(0)

  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Continuous rotation — speeds up on hover, slows down when idle.
  // Restarts from current angle so there's no visual jump.
  useEffect(() => {
    const duration = isHovering ? 2.5 : 7
    const controls = animate(rotate, rotate.get() + 360, {
      duration,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    })
    return () => controls.stop()
  }, [isHovering, rotate])

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true)
      return
    }

    const moveCursor = (e: MouseEvent) => {
      if (magnetTarget.current) {
        const lerp = 0.3
        cursorX.set(e.clientX + (magnetTarget.current.x - e.clientX) * lerp)
        cursorY.set(e.clientY + (magnetTarget.current.y - e.clientY) * lerp)
      } else {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      }
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleCursorReset = () => {
      setIsHovering(false)
      setCurrentColor(defaultColor)
      magnetTarget.current = null
    }

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, [data-cursor-hover]',
      )

      // Disable magnet snapping for elements larger than this. On big targets
      // (carousel images, hero blocks, etc.) the pull-to-center feels like the
      // cursor is "jumping away" from the user's actual pointer position.
      const MAX_MAGNET_SIZE = 260

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", (e) => {
          setIsHovering(true)
          const element = e.currentTarget as HTMLElement
          const colorAttr = element.getAttribute("data-cursor-color")
          setCurrentColor(colorAttr || defaultColor)

          const rect = element.getBoundingClientRect()
          const noMagnet =
            element.hasAttribute("data-cursor-no-magnet") ||
            rect.width > MAX_MAGNET_SIZE ||
            rect.height > MAX_MAGNET_SIZE

          magnetTarget.current = noMagnet
            ? null
            : {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              }
        })
        el.addEventListener("mouseleave", () => {
          setIsHovering(false)
          setCurrentColor(defaultColor)
          magnetTarget.current = null
        })
      })
    }

    window.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("cursor-reset", handleCursorReset)

    addHoverListeners()

    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("cursor-reset", handleCursorReset)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (isTouchDevice) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovering ? 1.25 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        scale: { type: "spring", damping: 28, stiffness: 380 },
        opacity: { duration: 0.15 },
      }}
    >
      <motion.svg
        width="34"
        height="34"
        viewBox="-16 -16 32 32"
        style={{
          rotate,
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
        }}
      >
        <defs>
          {/* Mask creates a true transparent hole in the middle */}
          <mask id="flower-center-hole">
            <rect x="-16" y="-16" width="32" height="32" fill="white" />
            <circle cx="0" cy="0" r="4.2" fill="black" />
          </mask>
        </defs>
        {/* 5 round, bulbous petals — 4 brand colors + 1 cream neutral.
            On hover, all petals morph to the hovered element's accent color. */}
        <g mask="url(#flower-center-hole)">
          <motion.circle
            cx="0"
            cy="-7.2"
            r="6.8"
            animate={{ fill: isHovering ? currentColor : "#FFC973" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.circle
            cx="6.85"
            cy="-2.22"
            r="6.8"
            animate={{ fill: isHovering ? currentColor : "#7AFEA7" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.circle
            cx="4.23"
            cy="5.82"
            r="6.8"
            animate={{ fill: isHovering ? currentColor : "#96C1FF" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.circle
            cx="-4.23"
            cy="5.82"
            r="6.8"
            animate={{ fill: isHovering ? currentColor : "#FF9992" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.circle
            cx="-6.85"
            cy="-2.22"
            r="6.8"
            animate={{ fill: isHovering ? currentColor : "#E692FF" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </g>
      </motion.svg>
    </motion.div>
  )
}
