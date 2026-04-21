"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/zoomable-image"
import { Maximize2 } from "lucide-react"

interface StrategyImageCarouselProps {
  images: string[]
  alt?: string
}

// Distance (px) the pointer must travel before we treat the gesture as a drag
// rather than a click. Anything under this opens the lightbox on mouseup.
const DRAG_THRESHOLD = 6

export function StrategyImageCarousel({ images, alt = "Strategy diagram" }: StrategyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const isScrollingRef = useRef(false)

  // Track pointer-down origin so we can distinguish clicks from drags.
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null)
  const didDragRef = useRef(false)

  // Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const goToPrevious = () => {
    if (isScrollingRef.current) return
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const goToNext = () => {
    if (isScrollingRef.current) return
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const goToSlide = (index: number) => {
    if (isScrollingRef.current) return
    setCurrentIndex(index)
    scrollToIndex(index)
  }

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || !imageRefs.current[index]) return
    
    isScrollingRef.current = true
    imageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    })
    
    setTimeout(() => {
      isScrollingRef.current = false
    }, 500)
  }

  // Update current index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      if (isScrollingRef.current) return
      
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2
      
      let closestIndex = 0
      let closestDistance = Infinity
      
      imageRefs.current.forEach((imageEl, index) => {
        if (!imageEl) return
        const imageRect = imageEl.getBoundingClientRect()
        const imageCenter = imageRect.left + imageRect.width / 2
        const distance = Math.abs(imageCenter - containerCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      
      if (closestIndex !== currentIndex) {
        setCurrentIndex(closestIndex)
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [currentIndex])

  // Drag handlers
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

  // Touch handlers for mobile
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

  return (
    <div className="relative group">
      {/* Scrollable Container */}
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
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => {
              imageRefs.current[index] = el
            }}
            className="flex-shrink-0 snap-start"
            style={{
              width: "calc(100% - 14rem)",
              marginRight: index < images.length - 1 ? "1.5rem" : "0",
              minWidth: "calc(100% - 14rem)",
            }}
          >
            <div className="group w-full aspect-video bg-muted rounded-xl overflow-hidden relative shadow-lg">
              <div className={`absolute ${image.includes("multistakeholdervaluemap") ? "inset-6" : "inset-4"}`}>
                <Image
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  fill
                  className={
                    image.includes("multistakeholdervaluemap") || image.includes("zag17") || image.includes("businessmodel3") || image.includes("blueocean")
                      ? "object-contain scale-110 pointer-events-none"
                      : "object-contain pointer-events-none"
                  }
                  draggable={false}
                />
              </div>
              {/* Small icon-only button: discreet enough not to cover the image,
                  but still the only region that opens the lightbox. */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (didDragRef.current) return
                  setLightboxSrc(image)
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                data-cursor-hover
                data-cursor-color="#E692FF"
                aria-label={`Enlarge ${alt} ${index + 1}`}
                title="Click to enlarge"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Desktop only */}
      {images.length > 1 && (
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
            aria-label="Previous image"
            data-cursor-hover
            data-cursor-color="#E692FF"
          >
            <svg
              className="w-5 h-5 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
            aria-label="Next image"
            data-cursor-hover
            data-cursor-color="#E692FF"
          >
            <svg
              className="w-5 h-5 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8 opacity-100"
                  : "bg-white/40 w-1.5 hover:bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      <ImageLightbox
        src={lightboxSrc}
        alt={alt}
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
