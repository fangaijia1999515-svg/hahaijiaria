"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const previousPathname = useRef(pathname)

  // Always update children when pathname changes - no delay
  useEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname
      // Update children immediately
      setDisplayChildren(children)

      // Handle scroll
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }
  }, [pathname, children])

  // Always sync children
  useEffect(() => {
      setDisplayChildren(children)
  }, [children])

  return (
    <div style={{ opacity: 1, visibility: 'visible' }}>
        {displayChildren}
    </div>
  )
}
