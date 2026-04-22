"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Step {
  number: string
  title: string
  description: string
  image: string
  // Safari needs HEVC+alpha (.mov with hvc1 codec); Chrome/Firefox/Edge use
  // VP9+alpha (.webm). Listing both lets each browser pick the format it can
  // decode with transparency preserved.
  videoMov?: string
  videoWebm?: string
}

const steps: Step[] = [
  {
    number: "01",
    title: "Pod Retrieval",
    description: "The autonomous chassis arrives at the apartment complex to pick up the used locker pod (containing processed returns) to transport it back to the hub.",
    image: "/image/skya/step1.webp",
    videoMov: "/video/skya/step1.mov",
    videoWebm: "/video/skya/step1.webm",
  },
  {
    number: "02",
    title: "Hub Processing",
    description: "At the logistics hub, the pod is removed. Robotic arms process the returns and load a fresh pod with new packages, ensuring 100% sorting accuracy.",
    image: "/image/skya/step2.webp",
    videoMov: "/video/skya/step2.mov",
    videoWebm: "/video/skya/step2.webm",
  },
  {
    number: "03",
    title: "Autonomous Transit",
    description: "The Skya chassis attaches to the newly loaded pod and navigates through the city using optimized routes to minimize delivery time.",
    image: "/image/skya/step3.webp",
    videoMov: "/video/skya/step3-1.mov",
    videoWebm: "/video/skya/step3-1.webm",
  },
  {
    number: "04",
    title: "Docking & Separation",
    description: "The vehicle docks at the apartment station and releases the pod. The chassis then detaches and departs to serve the next location, leaving the locker behind.",
    image: "/image/skya/step4.webp",
    videoMov: "/video/skya/step4.mov",
    videoWebm: "/video/skya/step4.webm",
  },
  {
    number: "05",
    title: "Access & Returns",
    description: "Residents receive an App notification. They can unlock the pod to collect packages or drop off returns instantly—no printing labels required.",
    image: "/image/skya/step5.webp",
  },
]

const ACCENT = "#E692FF"
const TEXT_LIGHT = "#F2F0E9"
const TEXT_MUTED = "#A89080"
const COUNTER_MUTED = "#513624"

export function SkyaHowItWorks() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const hoverHandlers = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  }

  const goToNext = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
  }

  const currentStepData = steps[currentStep]
  const total = String(steps.length).padStart(2, "0")

  const textTransition = {
    initial: { opacity: 0, filter: "blur(6px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(6px)" },
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }

  const dotsEl = (className = "") => (
    <div className={`flex gap-2 ${className}`}>
      {steps.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentStep(index)}
          className={`h-1.5 rounded-full transition-all duration-200 ${
            index === currentStep ? "bg-[#F2F0E9] w-10" : "bg-white/20 w-1.5 hover:bg-white/40"
          }`}
          aria-label={`Go to step ${index + 1}`}
        />
      ))}
    </div>
  )

  const mediaEl = (
    <div className="relative w-full h-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {currentStepData.videoWebm || currentStepData.videoMov ? (
            <video
              key={currentStepData.videoWebm ?? currentStepData.videoMov}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            >
              {currentStepData.videoMov && (
                <source src={currentStepData.videoMov} type='video/mp4; codecs="hvc1"' />
              )}
              {currentStepData.videoWebm && (
                <source src={currentStepData.videoWebm} type="video/webm" />
              )}
            </video>
          ) : (
            <Image
              src={currentStepData.image}
              alt={currentStepData.title}
              fill
              className="object-contain"
              priority={currentStep === 0}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  const counterEl = (
    <div className="flex items-center gap-4">
      <motion.span
        animate={{ color: isHovering ? ACCENT : TEXT_LIGHT }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="text-4xl md:text-5xl font-bold"
      >
        {currentStepData.number}
      </motion.span>
      <span className="text-sm md:text-base" style={{ color: COUNTER_MUTED }}>
        / {total}
      </span>
    </div>
  )

  return (
    <div className="w-full">
      {/* Mobile: Stacked Layout (Image on top, Text below) */}
      <div className="block lg:hidden space-y-8">
        <button
          type="button"
          onClick={goToNext}
          className="block w-full"
          data-cursor-hover
          data-cursor-color={ACCENT}
          aria-label="Next step"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {mediaEl}
          </div>
        </button>

        <button
          type="button"
          onClick={goToNext}
          {...hoverHandlers}
          className="flex flex-col items-start text-left space-y-6"
          data-cursor-hover
          data-cursor-color={ACCENT}
          aria-label="Next step"
        >
          {counterEl}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentStep}
                initial={textTransition.initial}
                animate={textTransition.animate}
                exit={textTransition.exit}
                transition={textTransition.transition}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-[#F2F0E9]">{currentStepData.title}</h3>
                <p className="text-base text-[#A89080] leading-relaxed">{currentStepData.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </button>

        {dotsEl()}
      </div>

      {/* Desktop: Split Layout (Text left, Image right) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-center items-start gap-8">
          <button
            type="button"
            onClick={goToNext}
            {...hoverHandlers}
            className="flex flex-col items-start gap-8 text-left"
            data-cursor-hover
            data-cursor-color={ACCENT}
            aria-label="Next step"
          >
            {counterEl}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`content-${currentStep}`}
                initial={textTransition.initial}
                animate={textTransition.animate}
                exit={textTransition.exit}
                transition={textTransition.transition}
                className="space-y-6 max-w-md"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#F2F0E9] leading-tight">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-[#A89080] leading-relaxed">
                  {currentStepData.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </button>
          {dotsEl("mt-2")}
        </div>

        <div className="lg:col-span-7 flex items-center justify-center">
          <button
            type="button"
            onClick={goToNext}
            className="relative w-full aspect-square max-w-2xl"
            data-cursor-hover
            data-cursor-color={ACCENT}
            aria-label="Next step"
          >
            {mediaEl}
          </button>
        </div>
      </div>
    </div>
  )
}
