"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { ImageLightbox } from "@/components/zoomable-image"

export interface BlueprintSlide {
  src: string
  alt: string
  label: string
  /** Optional zoom applied to the image only (container stays fixed).
   *  Useful to cover tiny baked-in padding on a specific asset. Default 1. */
  scale?: number
}

interface BlueprintJourneyCarouselProps {
  slides: BlueprintSlide[]
  cursorColor?: string
}

const DRAG_THRESHOLD = 6

export function BlueprintJourneyCarousel({
  slides,
  cursorColor = "#3D4A3A", // ds forest green (--ds-accent)
}: BlueprintJourneyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const isScrollingRef = useRef(false)

  const dragOriginRef = useRef<{ x: number; y: number } | null>(null)
  const didDragRef = useRef(false)

  // One-time entry hint guard (once per page load).
  const hasNudgedRef = useRef(false)

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  // One-time entry hint: the first time the carousel scrolls into view, the
  // strip gives a single gentle nudge toward the next slide so the flip
  // affordance is discoverable without hovering. Skipped under
  // prefers-reduced-motion (the dots below stay as the static cue).
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || slides.length < 2 || typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (typeof el.animate !== "function") return

    let timer: number | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        if (hasNudgedRef.current) return
        hasNudgedRef.current = true
        // Small delay so the nudge lands after the section's own fade-in.
        timer = window.setTimeout(() => {
          el.animate(
            [
              { transform: "translateX(0px)" },
              { transform: "translateX(-10px)", offset: 0.5 },
              { transform: "translateX(0px)" },
            ],
            { duration: 350, easing: "ease-in-out" }
          )
        }, 500)
      },
      { threshold: 0.35 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [slides.length])

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || !slideRefs.current[index]) return
    isScrollingRef.current = true
    slideRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    })
    setTimeout(() => {
      isScrollingRef.current = false
    }, 500)
  }

  const goToPrevious = () => {
    if (isScrollingRef.current) return
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const goToNext = () => {
    if (isScrollingRef.current) return
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const goToSlide = (index: number) => {
    if (isScrollingRef.current) return
    setCurrentIndex(index)
    scrollToIndex(index)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isScrollingRef.current) return
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      let closestIndex = 0
      let closestDistance = Infinity
      slideRefs.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.left + rect.width / 2
        const distance = Math.abs(center - containerCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      if (closestIndex !== currentIndex) setCurrentIndex(closestIndex)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [currentIndex])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    didDragRef.current = false
    dragOriginRef.current = { x: e.pageX, y: e.pageY }
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    if (dragOriginRef.current) {
      const dx = Math.abs(e.pageX - dragOriginRef.current.x)
      const dy = Math.abs(e.pageY - dragOriginRef.current.y)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        didDragRef.current = true
      }
    }
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragOriginRef.current = null
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    dragOriginRef.current = null
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    didDragRef.current = false
    dragOriginRef.current = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    }
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    if (dragOriginRef.current) {
      const dx = Math.abs(e.touches[0].pageX - dragOriginRef.current.x)
      const dy = Math.abs(e.touches[0].pageY - dragOriginRef.current.y)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        didDragRef.current = true
      }
    }
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    dragOriginRef.current = null
  }

  const current = slides[currentIndex]

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="relative group rounded-2xl bg-[var(--cl-mat)] shadow-lg overflow-hidden">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              ref={(el) => {
                slideRefs.current[index] = el
              }}
              className="flex-shrink-0 snap-start"
              style={{ width: "100%", minWidth: "100%" }}
            >
              <div className="relative w-full aspect-[2/1] overflow-hidden">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1024px) 1400px, 100vw"
                  unoptimized
                  className="object-cover pointer-events-none select-none"
                  style={slide.scale ? { transform: `scale(${slide.scale})` } : undefined}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Subtle maximize icon — bottom-right, only visible on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (didDragRef.current) return
            setLightboxSrc(current.src)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white opacity-60 group-hover:opacity-100 transition-opacity duration-200"
          data-cursor-hover
          data-cursor-color={cursorColor}
          aria-label={`Enlarge ${current?.alt ?? "artifact"}`}
          title="Click to enlarge"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Arrows — desktop only */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToPrevious()
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 items-center justify-center transition-all duration-200 opacity-60 group-hover:opacity-100 hover:opacity-100 z-20 pointer-events-auto"
              aria-label="Previous artifact"
              data-cursor-hover
              data-cursor-color={cursorColor}
            >
              <svg
                className="w-5 h-5 text-white pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToNext()
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 items-center justify-center transition-all duration-200 opacity-60 group-hover:opacity-100 hover:opacity-100 z-20 pointer-events-auto"
              aria-label="Next artifact"
              data-cursor-hover
              data-cursor-color={cursorColor}
            >
              <svg
                className="w-5 h-5 text-white pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Label + pagination row */}
      {slides.length > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4 px-1">
          <div className="flex items-baseline gap-3 min-w-0">
            <span
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: cursorColor }}
            >
              {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <span className="text-sm md:text-base text-[var(--cl-ink-a90)] truncate">
              {current?.label}
            </span>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`relative h-1.5 rounded-full transition-all duration-300 after:absolute after:-inset-2 after:content-[''] ${
                  index === currentIndex
                    ? "bg-[var(--cl-ink)] w-8 opacity-100"
                    : "bg-[var(--cl-ink-a30)] w-1.5 hover:bg-[var(--cl-ink-a50)]"
                }`}
                aria-label={`Go to artifact ${index + 1}`}
                data-cursor-hover
                data-cursor-color={cursorColor}
              />
            ))}
          </div>
        </div>
      )}

      <ImageLightbox
        src={lightboxSrc}
        alt={current?.alt}
        isOpen={lightboxSrc !== null}
        onClose={() => setLightboxSrc(null)}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
