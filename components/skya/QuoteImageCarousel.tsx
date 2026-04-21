"use client"

import { useState } from "react"
import Image from "next/image"

interface QuoteImageCarouselProps {
  images: string[]
  alt?: string
}

export function QuoteImageCarousel({ images, alt = "Research chart" }: QuoteImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
    <div className={`w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative group ${isEnvironmental ? "" : "p-7"}`}>
      {/* Image Container */}
      <div className="relative w-full h-full">
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
      </div>

      {/* Navigation Arrows - Only show on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous image"
            data-cursor-hover
            data-cursor-color="#E692FF"
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
            data-cursor-color="#E692FF"
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

      {/* Pagination Dots - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white w-6 opacity-100"
                  : "bg-white/40 w-1.5 hover:bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
