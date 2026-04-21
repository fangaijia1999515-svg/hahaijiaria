"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2 } from "lucide-react"

/**
 * Controlled fullscreen image viewer. Use this when you need to trigger
 * the zoomed view yourself (e.g. from a draggable carousel where a simple
 * button wrapper would conflict with drag handlers).
 */
export function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string | null
  alt?: string
  isOpen: boolean
  onClose: () => void
}) {
  // Reset the custom flower cursor whenever the lightbox closes. If the user
  // closed it by clicking the X button, that button gets unmounted while still
  // hovered, so its mouseleave never fires and the cursor stays stuck in its
  // hover color. Broadcasting cursor-reset clears that state.
  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cursor-reset"))
    }
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handleEsc)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = prevOverflow
      // Belt-and-suspenders: also reset cursor on unmount in case the close
      // happened via Esc or the component being removed.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cursor-reset"))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          key="image-lightbox"
          initial={{ opacity: 0, pointerEvents: "none" }}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[10000] bg-black/92 backdrop-blur-sm cursor-zoom-out overflow-auto"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            className="fixed top-5 right-5 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
            data-cursor-hover
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="min-h-full w-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              src={src}
              alt={alt || ""}
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ cursor: "default" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ZoomableImageProps {
  src: string
  alt: string
  children: ReactNode
  className?: string
  cursorColor?: string
}

/**
 * Wraps any image (or image container) with click-to-zoom behavior.
 * Opens a fullscreen overlay with the original-resolution image.
 * Users can scroll/pan for wide diagrams, and close with Esc / click outside / X button.
 */
export function ZoomableImage({
  src,
  alt,
  children,
  className = "",
  cursorColor,
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative block w-full cursor-zoom-in text-left ${className}`}
        data-cursor-hover
        {...(cursorColor ? { "data-cursor-color": cursorColor } : {})}
        aria-label={`Enlarge: ${alt}`}
      >
        {children}
        {/* Hover hint overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white">
            <Maximize2 className="w-3 h-3" />
            Click to enlarge
          </span>
        </span>
      </button>

      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
