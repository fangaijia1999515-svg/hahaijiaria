"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export interface TestingStep {
  number: string
  title: string
  description: string
  findings: string
  /** A single hero image (legacy) */
  image?: string
  /** Multiple prototype photos shown as a small compact grid */
  images?: string[]
  video?: string
}

interface TestingPagerProps {
  steps: TestingStep[]
  accentColor?: string
  counterMutedColor?: string
}

export function TestingPager({
  steps,
  accentColor = "#96C1FF",
  counterMutedColor = "#A89080",
}: TestingPagerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const hoverHandlers = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  }

  const goToPrevious = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
  }

  const current = steps[currentStep]
  const total = String(steps.length).padStart(2, "0")

  // Helpers: return JSX expressions (not components) to avoid remount-on-rerender.
  const renderPlaceholder = (label: string) => (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/[0.06] bg-[#1A120E] overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accentColor}1F 0%, rgba(26,18,14,0) 55%), linear-gradient(135deg, rgba(26,18,14,0.4) 0%, rgba(10,6,4,0.2) 100%)`,
        }}
      />
      <span
        className="relative text-[10px] font-mono uppercase tracking-[0.2em]"
        style={{ color: accentColor }}
      >
        {label}
      </span>
    </div>
  )

  const renderImgCell = (src: string, i: number, title: string) => (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <Image
        src={src}
        alt={`${title} — ${i + 1}`}
        fill
        sizes="(min-width: 1024px) 420px, 80vw"
        className="object-cover"
      />
    </div>
  )

  const renderMedia = (step: TestingStep) => {
    if (step.video) {
      return (
        <video
          key={step.video}
          src={step.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-xl"
        />
      )
    }

    if (step.images && step.images.length > 0) {
      const imgs = step.images
      const count = imgs.length

      return (
        <div className="absolute inset-0 flex flex-col gap-3">
          {count === 1 && (
            <div className="flex-1">{renderImgCell(imgs[0], 0, step.title)}</div>
          )}
          {count === 2 &&
            imgs.map((src, i) => (
              <div key={src} className="flex-1">
                {renderImgCell(src, i, step.title)}
              </div>
            ))}
          {count === 3 && (
            <>
              <div className="flex-1">{renderImgCell(imgs[0], 0, step.title)}</div>
              <div className="flex gap-3 flex-1">
                <div className="flex-1">{renderImgCell(imgs[1], 1, step.title)}</div>
                <div className="flex-1">{renderImgCell(imgs[2], 2, step.title)}</div>
              </div>
            </>
          )}
          {count >= 4 && (
            <>
              <div className="flex-1">{renderImgCell(imgs[0], 0, step.title)}</div>
              <div className="flex gap-3 flex-1">
                {imgs.slice(1).map((src, i) => (
                  <div key={src} className="flex-1">
                    {renderImgCell(src, i + 1, step.title)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )
    }

    if (step.image) {
      return (
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover rounded-xl"
          priority={currentStep === 0}
        />
      )
    }
    return renderPlaceholder(step.title)
  }

  const renderDots = (className = "") => (
    <div className={`flex gap-2 ${className}`}>
      {steps.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentStep(index)}
          className={`h-1.5 rounded-full transition-all duration-200 ${
            index === currentStep
              ? "bg-[#F2F0E9] w-8"
              : "bg-white/20 w-1.5 hover:bg-white/40"
          }`}
          aria-label={`Go to step ${index + 1}`}
        />
      ))}
    </div>
  )

  // Text uses the EXACT same timing/curve as the image so they feel
  // like one synchronized scene transition (start together, end together).
  const textTransition = {
    initial: { opacity: 0, filter: "blur(6px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(6px)" },
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }

  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="block lg:hidden space-y-6">
          <button
            type="button"
            onClick={goToNext}
            className="block w-full"
            data-cursor-hover
            data-cursor-color={accentColor}
            aria-label="Next step"
          >
            <div className="relative w-full aspect-[4/5] max-w-sm mx-auto overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {renderMedia(current)}
                </motion.div>
              </AnimatePresence>
            </div>
          </button>

        <div className="flex justify-center">
          {renderDots()}
        </div>

        <div className="relative space-y-4">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentStep}
              initial={textTransition.initial}
              animate={textTransition.animate}
              exit={textTransition.exit}
              transition={textTransition.transition}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-[#F2F0E9] leading-snug">
                {current.title}
              </h3>
              <p className="text-sm text-[#A89080] leading-relaxed">
                {current.description}
              </p>
              <p className="text-sm text-[#A89080] leading-relaxed">
                <span
                  className="font-semibold italic mr-1.5"
                  style={{ color: accentColor }}
                >
                  Findings.
                </span>
                {current.findings}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-5 relative flex flex-col justify-center items-start">
          <button
            type="button"
            onClick={goToNext}
            {...hoverHandlers}
            className="text-left"
            data-cursor-hover
            data-cursor-color={accentColor}
            aria-label="Next step"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`content-${currentStep}`}
                initial={textTransition.initial}
                animate={textTransition.animate}
                exit={textTransition.exit}
                transition={textTransition.transition}
                className="space-y-5"
              >
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                  <motion.span
                    animate={{
                      color: isHovering ? accentColor : "#F2F0E9",
                      x: isHovering ? 4 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="inline-block"
                  >
                    {current.title}
                  </motion.span>
                </h3>
                <p className="text-base text-[#A89080] leading-relaxed">
                  {current.description}
                </p>
                <p className="text-base text-[#A89080] leading-relaxed pt-2">
                  <span
                    className="font-semibold italic mr-1.5"
                    style={{ color: accentColor }}
                  >
                    Findings.
                  </span>
                  {current.findings}
                </p>
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Right column: outer cell sets height = journeymap height by sharing
            the same horizontal context (col-span-7 of the same grid the
            journeymap carousel fills). aspect-[7/6] on the full col width
            yields a height equal to half the full content width — matching
            the journeymap's aspect-[2/1]. The inner frame then caps its
            width with max-w-lg while inheriting full height. */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative aspect-[7/6]">
            <button
              type="button"
              onClick={goToNext}
              {...hoverHandlers}
              className="absolute inset-0 flex justify-end pr-8"
              data-cursor-hover
              data-cursor-color={accentColor}
              aria-label="Next step"
            >
              <motion.div
                animate={{ scale: isHovering ? 1.015 : 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg h-full overflow-hidden"
              >
                <AnimatePresence mode="sync">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    {renderMedia(current)}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </button>
          </div>
          <div className="flex justify-end pr-8 pt-5">
            {renderDots()}
          </div>
        </div>
      </div>
    </div>
  )
}
