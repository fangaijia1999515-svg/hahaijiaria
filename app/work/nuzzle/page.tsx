"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CaseStudyHeader } from "@/components/case-study/case-study-header"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { SystemBlueprint } from "@/components/case-study/system-blueprint"
import { NextProject } from "@/components/case-study/next-project"
import { ZoomableImage } from "@/components/zoomable-image"
import { ProjectThemeProvider } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"

const accentColor = "#7AFEA7" // Nuzzle Green

// Roadmap crossfade: all three images stay mounted, only opacity animates.
// Because incoming and outgoing overlap in time, there's no dark gap between
// slides like AnimatePresence mode="wait" would produce.
const roadmapSlides = [
  "/image/Nuzzle/year101.png",
  "/image/Nuzzle/year2.png",
  "/image/Nuzzle/year5.png",
]

function RoadmapSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % roadmapSlides.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // All frames stay mounted (preloaded) so the swap is instant with no flicker
  // or fade. We hide the inactive ones with visibility so there's zero in-between
  // state — feels like a stop-motion / flipbook frame change.
  return (
    <div className="relative w-full h-full">
      {roadmapSlides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{ visibility: i === index ? "visible" : "hidden" }}
        >
          <Image
            src={src}
            alt={`Nuzzle roadmap phase ${i + 1}`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}

type CompanionFeature = {
  step: string
  title: string
  description: string
  video: string
}

// Each phone only plays on hover. Without hover, video stays paused at the first
// frame with a dim/desaturated look so the whole row feels calm. On touch devices
// (no hover), we fall back to autoplay so users still see the videos.
function CompanionFeatureCard({ feature }: { feature: CompanionFeature }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [supportsHover, setSupportsHover] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setSupportsHover(mql.matches)
    update()
    mql.addEventListener?.("change", update)
    return () => mql.removeEventListener?.("change", update)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (!supportsHover) {
      v.play().catch(() => {})
      return
    }
    const showFirstFrame = () => {
      try {
        v.currentTime = 0.1
      } catch {}
    }
    v.pause()
    if (v.readyState >= 1) showFirstFrame()
    else v.addEventListener("loadedmetadata", showFirstFrame, { once: true })
  }, [supportsHover])

  const handleEnter = () => {
    if (!supportsHover) return
    videoRef.current?.play().catch(() => {})
  }
  const handleLeave = () => {
    if (!supportsHover) return
    const v = videoRef.current
    if (!v) return
    v.pause()
    try {
      v.currentTime = 0.1
    } catch {}
  }

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor-hover
      data-cursor-color={accentColor}
      data-cursor-no-magnet
    >
      <div className="w-full max-w-[240px] mx-auto">
        <div
          className={`relative aspect-[9/19.5] w-full rounded-[36px] overflow-hidden bg-black/40 ring-1 ring-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-all duration-[600ms] ease-out will-change-transform group-hover:ring-white/20 ${
            supportsHover ? "scale-[0.97] group-hover:scale-100" : ""
          }`}
        >
          <video
            ref={videoRef}
            src={feature.video}
            loop
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 ease-out ${
              supportsHover
                ? "brightness-[0.75] saturate-[0.9] group-hover:brightness-100 group-hover:saturate-100"
                : ""
            }`}
          />

          {/* Brand-tinted overlay that fades out on hover — this is what carries
              the "dimmed / out-of-focus" feel instead of filter:blur on the video
              itself (blur + scale creates smudgy artifacts while the video plays). */}
          {supportsHover && (
            <div
              className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 ease-out group-hover:opacity-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,18,14,0.5) 0%, rgba(10,6,4,0.3) 55%, rgba(122,254,167,0.08) 100%)",
              }}
            />
          )}

          {/* Subtle play-hint dot — shows only on idle, fades on hover */}
          {supportsHover && (
            <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-0">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: accentColor }}
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/60">
                Hover
              </span>
            </div>
          )}
        </div>

        <div
          className={`mt-6 text-left transition-opacity duration-500 ${
            supportsHover ? "opacity-60 group-hover:opacity-100" : ""
          }`}
        >
          <span
            className="text-xs font-mono tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {feature.step}
          </span>
          <h4 className="mt-2 text-lg font-bold text-white">{feature.title}</h4>
          <p className="mt-2 text-sm text-[#A89080] leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function NuzzlePage() {
  const nextProject = getNextProject("nuzzle")

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cursor-reset"))

    // Limit sidebar sticky behavior to stop at next project
    const updateSidebarPosition = () => {
      const sidebar = document.getElementById("sidebar-contents") as HTMLElement
      const nextProjectStart = document.getElementById("next-project-start")

      if (!sidebar || !nextProjectStart) return

      const sidebarRect = sidebar.getBoundingClientRect()
      const nextProjectRect = nextProjectStart.getBoundingClientRect()
      const sidebarBottom = sidebarRect.bottom
      const nextProjectTop = nextProjectRect.top

      if (sidebarBottom >= nextProjectTop - 24) {
        const maxTop = nextProjectTop - sidebarRect.height - 24
        sidebar.style.top = `${Math.max(96, maxTop)}px`
      } else {
        sidebar.style.top = ""
      }
    }

    const nextProjectStart = document.getElementById("next-project-start")
    if (nextProjectStart) {
      const observer = new IntersectionObserver(
        () => {
          updateSidebarPosition()
        },
        { threshold: 0 }
      )
      observer.observe(nextProjectStart)

      window.addEventListener("scroll", updateSidebarPosition, { passive: true })
      window.addEventListener("resize", updateSidebarPosition)
      updateSidebarPosition()

      return () => {
        observer.disconnect()
        window.removeEventListener("scroll", updateSidebarPosition)
        window.removeEventListener("resize", updateSidebarPosition)
      }
    }
  }, [])

  // Force visibility on mount to prevent blank screen
  useEffect(() => {
    const main = document.querySelector('main')
    if (main) {
      main.style.opacity = '1'
      main.style.visibility = 'visible'
    }
  }, [])


  return (
    <ProjectThemeProvider projectId="nuzzle">
      {/* Page-wide vertical gradient. Stops: 0–40% solid brown, 40–100% fades to near-black. */}
      <div
        className="min-h-screen"
        style={{
          background:
            'linear-gradient(to bottom, #1E1510 0%, #1E1510 78%, #030201 100%)',
        }}
      >
      <main style={{ opacity: 1, visibility: 'visible' }}>
        <Navigation />

        {/* Global Header: Title + One-Liner */}
        <div id="overview" className="scroll-mt-32">
          <CaseStudyHeader
            title="Nuzzle"
            oneLiner="From Breakdown to Bond｜Bridging the critical 'Expectation Gap' for new cat adopters through a shelter-integrated companion service."
            accentColor={accentColor}
          />
        </div>

        {/* Hero Image */}
        <div className="w-full px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-16 relative"
          >
            <Image
              src="/image/Nuzzle/hero2.webp"
              alt="Nuzzle Hero"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Main Split Layout */}
        <div className="w-full px-6 md:px-12 lg:px-24 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
            {/* Left Column: Sticky Context Rail (3 cols) */}
            <div className="lg:col-span-3">
              <ContextSidebar
                role="Lead Service Designer (Solo Project)"
                timeline="10 Weeks (M.A. Thesis)"
                team="Solo Project"
                tools={[
                  "Figma",
                  "Cursor (AI Coding)",
                  "User Research",
                  "Service Blueprinting",
                  "Journey Mapping",
                  "System Thinking",
                ]}
                accentColor={accentColor}
                sections={[
                  { id: "overview", label: "Overview" },
                  { id: "research", label: "Research" },
                  { id: "strategy", label: "Strategy" },
                  { id: "prototype", label: "Prototype" },
                  { id: "blueprint", label: "Blueprint" },
                  { id: "value-network", label: "Value Network" },
                  { id: "future", label: "The Future" },
                ]}
              />
            </div>

            {/* Right Column: Narrative Stream (9 cols) */}
            <div className="lg:col-span-9">
              {/* Section: Overview */}
              <motion.section
                initial={{ opacity: 1, y: 0 }}
                className="mb-40 pt-20"
              >
                {/* Top: KPI Cards */}
                <ImpactDashboard
                  metrics={[
                    { value: "50%", label: "of cat returns", detail: "happen in the first 30 days" },
                    { value: "127K+", label: "Cats returned annually", detail: "within first 30 days after adoption" },
                    { value: "41%", label: "of returners", detail: "never adopt again" },
                  ]}
                  accentColor={accentColor}
                  centerItemLeftPadding=""
                  rightItemLeftPadding=""
                />

                {/* Middle: Text Grid with col-span logic - Challenge, Approach, Outcome */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 my-20">
                  {/* Left (Col-span-4): The Challenge */}
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="The Challenge"
                      content="Nearly 50% of adopted cats are returned within the first 30 days. Through my research, I discovered this isn't due to 'bad cats,' but a systemic failure driven by an 'Expectation Gap.' New owners are often unprepared for the reality of animal adaptation, causing emotional distress that spirals into regret."
                      accentColor={accentColor}
                    />
                  </div>
                  {/* Right (Col-span-8): The Approach + The Outcome */}
                  <div className="lg:col-span-8 space-y-12">
                    <NarrativeBlock
                      title="The Approach"
                      content="I shifted the strategic model from Reactive (waiting for returns) to Proactive (preventing them). By utilizing Service Blueprinting to integrate the app into shelter operations and Rapid Prototyping (Vibe Coding), I was able to validate emotional interactions early in the process."
                      accentColor={accentColor}
                    />
                    <NarrativeBlock
                      title="The Outcome"
                      content="Nuzzle is a post-adoption support service prescribed by shelters. Starting with a seamless QR-code scan at the shelter desk to instantly import the cat's medical and personality profile, I designed the system to guide new owners through the emotional rollercoaster of the first month. By providing daily check-ins and expert access, Nuzzle extends the shelter's care into the home, preventing returns before they happen."
                      accentColor={accentColor}
                    />
                  </div>
                </div>
              </motion.section>

              {/* Section: Research & Insights (match Skya layout 1:1) */}
              <motion.section
                id="research"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                {/* Top Row: Headline + Intro Text (Skya: "The Problem Landscape") */}
                <NarrativeBlock
                  title="THE PROBLEM LANDSCAPE"
                  content="A systemic failure driven by high financial costs for shelters and a deep emotional disconnect for adopters. Without guidance, adopters interpret normal biological behaviors as behavioral issues or personal failure."
                  accentColor={accentColor}
                />

                {/* Middle Row: Financial Impact — Stats with Vertical Divider (Skya: $6B+ / $890B) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 my-16 py-8"
                >
                  <div className="flex-1">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-2" style={{ color: accentColor }}>
                      $250
                    </div>
                    <div className="text-sm uppercase tracking-[0.15em] text-[#A89080]">Shelter Cost</div>
                    <div className="text-sm text-[#F2F0E9]/60 mt-1">Per cat returned</div>
                  </div>
                  <div className="w-px h-24 bg-white/10 hidden md:block" />
                  <div className="flex-1">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-2" style={{ color: accentColor }}>
                      $32M
                    </div>
                    <div className="text-sm uppercase tracking-[0.15em] text-[#A89080]">Annual Re-intake Burden</div>
                    <div className="text-sm text-[#F2F0E9]/60 mt-1">Per year (~127,000 cats returned)</div>
                  </div>
                </motion.div>

                {/* Row 1: Quote (left) + one image (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col justify-center"
                  >
                    <div
                      className="pl-6"
                      style={{ borderLeft: `4px solid ${accentColor}` }}
                    >
                      <blockquote className="text-xl md:text-2xl italic text-[#F2F0E9] leading-relaxed mb-4 max-w-[82%]">
                        &ldquo;I was crying for the first three days, just thinking about how to return him.&rdquo;
                      </blockquote>
                      <p className="text-sm text-[#A89080]">— First-time Adopter.</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full aspect-[16/9] bg-muted rounded-xl overflow-hidden relative"
                  >
                    <Image
                      src="/image/Nuzzle/data01.webp"
                      alt="Disappointment Factors (1)"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Row 2: Left + Right two images (disappointment factor 2 + journey map placeholder) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <ZoomableImage
                      src="/image/Nuzzle/journeymap03.webp"
                      alt="Journey Map"
                      cursorColor={accentColor}
                    >
                      <div className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative">
                        <Image
                          src="/image/Nuzzle/journeymap03.webp"
                          alt="Journey Map"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </ZoomableImage>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                  >
                    <Image
                      src="/image/Nuzzle/data3.png"
                      alt="Disappointment Factors (3)"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </motion.section>

              {/* Section: Strategy */}
              <motion.section
                id="strategy"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t-section scroll-mt-32"
              >
                <NarrativeBlock
                  title="THE STRATEGIC PIVOT"
                  content="Reframing the support model: From waiting for a crisis, to anticipating the Expectation Gap."
                  accentColor={accentColor}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                  <div className="rounded-2xl border border-white/10 bg-[#1A120E]/80 p-8">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#A89080] mb-4">
                      Current State
                    </p>
                    <h4 className="text-xl font-bold text-white mb-4">Reactive Support</h4>
                    <p className="text-[#F2F0E9]/70 leading-relaxed">
                      Adopters face a "Support Vacuum" immediately after leaving the shelter. When crises occur, they frantically turn to Reddit or social media. This reactive searching leads to conflicting advice, deep isolation, and eventual burnout.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#7AFEA7]/25 bg-[#1A120E]/80 p-8">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7AFEA7] mb-4">
                      Future State
                    </p>
                    <h4 className="text-xl font-bold text-white mb-4">Proactive Intervention</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Nuzzle shifts from passive manuals to proactive, stage-appropriate guidance. Starting from the critical "First Night," the system uses daily check-ins to push bite-sized education exactly when expected behavioral challenges arise.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section: Front-Stage Experience */}
              <motion.section
                id="prototype"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="The Intelligent Companion"
                  content="To deliver this proactive support and validate emotional interactions, I utilized AI-assisted rapid prototyping to build a fully functional HTML/CSS app. This allowed me to test real-world pacing and tone in a fraction of traditional development time."
                  accentColor={accentColor}
                />

                <div className="mb-14">
                  <a
                    href="https://fangaijia1999515-svg.github.io/NazzleCatapp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7AFEA7]/30 bg-[#1A120E]/80 px-8 py-4 font-bold text-[#7AFEA7] hover:border-[#7AFEA7] hover:bg-[#1A120E] transition-colors"
                    data-cursor-hover
                    data-cursor-color={accentColor}
                    data-cursor-no-magnet
                  >
                    Experience Live Prototype
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
                  {[
                    {
                      step: "01",
                      title: "The Phygital Handshake",
                      description:
                        "A QR scan at adoption instantly imports the cat's medical history and personality, eliminating manual setup.",
                      video: "/video/nuzzle/onboarding.mp4",
                    },
                    {
                      step: "02",
                      title: "The Daily Anchor",
                      description:
                        "Capturing daily emotional data to track bonding progress and trigger personalized support.",
                      video: "/video/nuzzle/dailylog01.mp4",
                    },
                    {
                      step: "03",
                      title: "Just-in-Time Guide",
                      description:
                        "Delivering a \"7-Day Scientific Cat Course\" with bite-sized education for critical moments.",
                      video: "/video/nuzzle/7daycourse.mp4",
                    },
                    {
                      step: "04",
                      title: "The Safety Net",
                      description:
                        "A 24/7 tiered lifeline escalating from instant AI chat to verified experts, preventing panic-driven returns.",
                      video: "/video/nuzzle/aichatbot.mp4",
                    },
                  ].map((feature) => (
                    <CompanionFeatureCard key={feature.step} feature={feature} />
                  ))}
                </div>
              </motion.section>

              {/* Section: Blueprint */}
              <motion.section
                id="blueprint"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="Back-Stage Orchestration"
                  content='The App is just the "Front Stage." This blueprint details how user inputs trigger "Back Stage" operations. By analyzing daily check-in data, the system flags high-risk adopters, enabling volunteers and shelter staff to initiate proactive outreach before the bond breaks.'
                  accentColor={accentColor}
                />
                <div className="mt-12">
                  <SystemBlueprint
                    image="/image/Nuzzle/serviceblueprint.png"
                    alt="Back-Stage Orchestration — service blueprint"
                    accentColor={accentColor}
                  />
                </div>
              </motion.section>

              {/* Section: B2B2C Value Network */}
              <motion.section
                id="value-network"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t-section scroll-mt-32"
              >
                <NarrativeBlock
                  title="SUSTAINABLE SCALABILITY"
                  content='Unlocking the Value Network. Nuzzle is more than a companion app; it is a self-sustaining ecosystem. By capturing precise "First-30-day" behavioral data, Nuzzle transforms the heavy operational burden of adoption support into a valuable engine for commercial and local partners.'
                  accentColor={accentColor}
                />

                {/* Image left, stakeholder list right — no boxes, pure typography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                >
                  {/* Left: Ecosystem image, frame-less */}
                  <div className="lg:col-span-8">
                    <ZoomableImage
                      src="/image/Nuzzle/ecosystem.webp"
                      alt="Nuzzle B2B2C value network ecosystem"
                      cursorColor={accentColor}
                    >
                      <Image
                        src="/image/Nuzzle/ecosystem.webp"
                        alt="Nuzzle B2B2C value network ecosystem"
                        width={1787}
                        height={1433}
                        className="h-auto w-full object-contain"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                      />
                    </ZoomableImage>
                  </div>

                  {/* Right: Stakeholders — tabular rows, hairline dividers (matches Eau de Toi pattern) */}
                  <div className="lg:col-span-4 flex flex-col">
                    {[
                      {
                        label: "Commercial Partners",
                        text: "Reach 100% of high-intent new cat parents. By driving first-time purchases through Nuzzle's curated shopping guides, we generate sustainable affiliate revenue.",
                      },
                      {
                        label: "Local Vet Clinics",
                        text: "Alleviate first-week health anxieties via one-click appointments, establishing a stable, geo-targeted acquisition channel for local partners.",
                      },
                      {
                        label: "Shelter Organizations",
                        text: "Reduce return rates and automate follow-ups, providing critical retention analytics while alleviating their financial and operational strain.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={item.label}
                        className={`py-7 ${idx === 0 ? "border-t-section" : ""} border-b-section`}
                      >
                        <span
                          className="block font-mono text-xs uppercase tracking-[0.2em] mb-3"
                          style={{ color: accentColor }}
                        >
                          {item.label}
                        </span>
                        <p className="text-base text-[#F2F0E9] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.section>

              {/* Section: The Future — Sustainable Impact & Path to Profitability */}
              {/* Smaller bottom margin on purpose: the block that follows (vision image + final quote) */}
              {/* isn't a titled section, so it reads as a continuation rather than a new chapter. */}
              <motion.section
                id="future"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-16 pt-16 border-t-section scroll-mt-32"
              >
                <NarrativeBlock
                  title="Sustainable Impact & Path to Profitability"
                  content="Nuzzle transforms a shelter's cost center into a sustainable service ecosystem, saving both lives and operational budgets."
                  accentColor={accentColor}
                />

                {/* Content pieces with generous breathing room between each block */}
                <div className="mt-16 space-y-24 md:space-y-28">
                {/* Group A: 4 images + 3 stats — visually linked, but stats need clear separation from the image grid */}
                <div className="space-y-16">
                {/* 4 Images — 2x2 grid */}
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tile 1: Impact 01 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/Nuzzle/impact101.webp"
                        alt="Nuzzle impact 01"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </motion.div>

                    {/* Tile 2: Roadmap — 3-image seamless crossfade */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <RoadmapSlideshow />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tile 3: Impact 03 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/Nuzzle/impact03.webp"
                        alt="Nuzzle impact 03"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </motion.div>

                    {/* Tile 4: Impact 04 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/Nuzzle/impact04.webp"
                        alt="Nuzzle impact 04"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* 3 Impact Stats cards — matches SKYA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4
                      className="text-sm font-bold uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      Operational Savings
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Saves approximately $250 in medical and housing operations per intercepted return.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4
                      className="text-sm font-bold uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      The Adopter Data Asset
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Transforms 30-day daily logs into highly valuable, anonymized behavioral and commercial data.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4
                      className="text-sm font-bold uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      Scalability
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Designed to scale from a single-shelter pilot to the standard U.S. adoption infrastructure.
                    </p>
                  </motion.div>
                </div>
                </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Brown → black from last large visual (vision) + quote through Next project + footer */}
        <div className="project-detail-tail-fade w-full">
          <div className="w-full px-6 md:px-12 lg:px-24 pt-0 pb-48">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="hidden lg:block lg:col-span-3" aria-hidden />
              <div className="lg:col-span-9">
                <div className="border-t-section pt-16 space-y-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full aspect-video bg-muted rounded-xl overflow-hidden relative"
                  >
                    <Image
                      src="/image/Nuzzle/vision.webp"
                      alt="Nuzzle vision"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 75vw, 100vw"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-white/[0.03] border-l-4"
                    style={{ borderLeftColor: accentColor }}
                  >
                    <p className="text-[#F2F0E9] leading-relaxed text-lg italic">
                      "Ultimately, Nuzzle demonstrates that the key to solving the animal return crisis isn't about finding 'better' pets, but about designing proactive, human-centric support systems for the people who adopt them."
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-6 md:px-12 lg:px-24">
            <div id="next-project-start" className="border-t-section-next pt-16">
              <NextProject
                title={nextProject.title}
                href={nextProject.href}
                image={nextProject.image}
              />
            </div>
          </div>

          <Footer />
        </div>
      </main>
      </div>
    </ProjectThemeProvider>
  )
}
