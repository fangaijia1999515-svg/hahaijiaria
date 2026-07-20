"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion"
import { useThemeColor } from "@/lib/theme-context"

interface QuoteImageCarouselProps {
  images: string[]
  alt?: string
}

export function QuoteImageCarousel({ images, alt = "Research chart" }: QuoteImageCarouselProps) {
  // Stage accent for the custom cursor (forest on cream = the old hardcoded
  // #3D4A3A, sage on dark).
  const { accentColor } = useThemeColor()
  const [currentIndex, setCurrentIndex] = useState(0)

  // One-time entry hint: the first time the carousel scrolls into view, the
  // media gives a single gentle sideways nudge so the flip affordance is
  // discoverable without hovering. Runs once per page load and is skipped
  // under prefers-reduced-motion (the dots below stay as the static cue).
  const rootRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rootRef, { once: true, amount: 0.45 })
  const prefersReducedMotion = useReducedMotion()
  const nudgeControls = useAnimation()
  const hasNudgedRef = useRef(false)

  useEffect(() => {
    if (!isInView || prefersReducedMotion || hasNudgedRef.current || images.length < 2) return
    hasNudgedRef.current = true
    const timer = setTimeout(() => {
      nudgeControls.start({
        x: [0, -9, 0],
        transition: { duration: 0.38, ease: "easeInOut" },
      })
    }, 550)
    return () => clearTimeout(timer)
  }, [isInView, prefersReducedMotion, nudgeControls, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentImage = images[currentIndex]
  const isEnvironmental = currentImage.includes("enviromental")
  const isDeliveryIssueChart = currentImage.includes("deliveryissuechart")

  return (
    <div className="w-full">
      <div
        ref={rootRef}
        className={`w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative group ${isEnvironmental ? "" : "p-7"}`}
      >
        {/* Image Container (nudged once on first reveal) */}
        <motion.div animate={nudgeControls} className="relative w-full h-full">
          <div key={currentIndex} className="absolute inset-0">
            {isEnvironmental ? (
              <div className="relative w-full h-full scale-105">
                <Image
                  src={currentImage}
                  alt={`${alt} ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className={`relative w-full h-full ${isDeliveryIssueChart ? "scale-125" : "scale-[0.98]"}`}>
                <Image
                  src={currentImage}
                  alt={`${alt} ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation Arrows - Only show on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
              data-cursor-hover
              data-cursor-color={accentColor}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
              data-cursor-hover
              data-cursor-color={accentColor}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots - persistent, below the media, same dot language as
          the strategy carousel (--cl vars so both stages read). The invisible
          after-inset keeps the tap target comfortable at 390px. */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-1.5 rounded-full transition-all duration-300 after:absolute after:-inset-2 after:content-[''] ${
                index === currentIndex
                  ? "bg-[var(--cl-ink)] w-8"
                  : "bg-[var(--cl-ink-a30)] w-1.5 hover:bg-[var(--cl-ink-a50)]"
              }`}
              aria-label={`Go to image ${index + 1}`}
              data-cursor-hover
              data-cursor-color={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
