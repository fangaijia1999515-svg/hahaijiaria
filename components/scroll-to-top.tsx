"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash

    if (hash) {
      // Wait for page to render, then scroll to the hash element
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } else {
      // No hash - scroll to top as usual
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
