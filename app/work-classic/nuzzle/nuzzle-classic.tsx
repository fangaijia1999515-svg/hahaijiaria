"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { CaseStudyHeader } from "@/components/case-study/case-study-header"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { SystemBlueprint } from "@/components/case-study/system-blueprint"
import { NextProject } from "@/components/case-study/next-project"
import { ZoomableImage } from "@/components/zoomable-image"
import { ProjectThemeProvider, useThemeColor, type ClassicStage } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"

// ds accents — was Nuzzle Green #7AFEA7. Forest green (--ds-accent) on the
// cream stage; sage (--ds-accent-soft) on the dark stage. Components below
// the provider read the stage-resolved accent from useThemeColor().
const ACCENT_LIGHT = "#3D4A3A"
const ACCENT_DARK = "#9CAF88"

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

// App-screen showcase: all four phones auto-play muted loops the moment the row
// scrolls into view (staggered ~150ms so it wakes left-to-right), then loop
// continuously — no interaction required. Offscreen phones pause so decode stays
// cheap (on mobile the grid is single-column, so at most ~1-2 play at once).
// Hover only lifts + scales the device; it never gates playback. Under
// prefers-reduced-motion the video freezes on its first frame (poster), no autoplay.
function CompanionFeatureCard({ feature, index }: { feature: CompanionFeature; index: number }) {
  // Stage-resolved accent (forest on cream, sage on dark) from the provider.
  const { accentColor } = useThemeColor()
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const v = videoRef.current
    const card = cardRef.current
    if (!v || !card) return

    // Reduced motion: hold the first frame as a still poster, never autoplay.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showFirstFrame = () => {
        try {
          v.currentTime = 0.1
        } catch {}
      }
      v.pause()
      if (v.readyState >= 1) showFirstFrame()
      else v.addEventListener("loadedmetadata", showFirstFrame, { once: true })
      return
    }

    let started = false
    let timer: number | undefined
    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          if (started) {
            // Re-entering after scrolling away: resume the loop immediately.
            v.play().catch(() => {})
          } else {
            started = true
            // First reveal: stagger the four phones so the row comes alive
            // left-to-right instead of snapping on all at once.
            timer = window.setTimeout(() => {
              v.play().catch(() => {})
            }, index * 150)
          }
        } else {
          // Offscreen: pause (keep position) so we never decode four videos
          // the user cannot see; resumes seamlessly on scroll-back.
          clearTimer()
          v.pause()
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(card)

    return () => {
      observer.disconnect()
      clearTimer()
    }
  }, [index])

  return (
    <div ref={cardRef} className="group flex flex-col">
      <div className="w-full max-w-[240px] mx-auto">
        <div className="relative aspect-[9/19.5] w-full rounded-[36px] overflow-hidden bg-[var(--cl-ink-a10)] ring-1 ring-[var(--cl-ink-a15)] shadow-[0_20px_50px_-20px_var(--cl-phone-shadow)] transition-all duration-500 ease-out will-change-transform group-hover:ring-[var(--cl-accent-a40)] group-hover:shadow-[0_36px_80px_-18px_var(--cl-phone-glow)] motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:scale-[1.03]">
          <video
            ref={videoRef}
            src={feature.video}
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="mt-6 text-left">
          <span
            className="text-xs font-mono tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {feature.step}
          </span>
          <h4 className="mt-2 text-lg font-bold text-[var(--cl-ink)]">{feature.title}</h4>
          <p className="mt-2 text-sm text-[var(--cl-text-soft)] leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function NuzzleClassicPage({ stage = "light" }: { stage?: ClassicStage }) {
  const accentColor = stage === "dark" ? ACCENT_DARK : ACCENT_LIGHT
  const nextProject = getNextProject("nuzzle")
  // Classic comparison routes cross-link among themselves, carrying the stage
  // so she can browse the whole loop in dark.
  const nextHref =
    nextProject.href.replace("/work/", "/work-classic/") +
    (stage === "dark" ? "?stage=dark" : "")

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
    <ProjectThemeProvider projectId="nuzzle" stage={stage}>
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
            className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-16 relative cl-hero-media"
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
                />

                {/* Middle: Text Grid with col-span logic - Challenge, Approach, Outcome */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-16">
                  {/* Left (Col-span-4): The Challenge */}
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="The Challenge"
                      content="Nearly 50% of adopted cats are returned within the first 30 days. Through my research, I discovered this isn't due to 'bad cats,' but a systemic failure driven by an 'Expectation Gap.' New owners are often unprepared for the reality of animal adaptation, causing emotional distress that spirals into regret."
                      accentColor={accentColor}
                    />
                  </div>
                  {/* Right (Col-span-8): The Approach + The Outcome */}
                  <div className="lg:col-span-8 space-y-8">
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
                    <div className="classic-display text-6xl md:text-7xl lg:text-8xl mb-2" style={{ color: accentColor }}>
                      $250
                    </div>
                    <div className="classic-label text-sm uppercase tracking-[0.15em] text-[var(--cl-text-muted)]">Shelter Cost</div>
                    <div className="text-sm text-[var(--cl-text-muted)] mt-1">Per cat returned</div>
                  </div>
                  <div className="w-px h-24 bg-[var(--cl-ink-a15)] hidden md:block" />
                  <div className="flex-1">
                    <div className="classic-display text-6xl md:text-7xl lg:text-8xl mb-2" style={{ color: accentColor }}>
                      $32M
                    </div>
                    <div className="classic-label text-sm uppercase tracking-[0.15em] text-[var(--cl-text-muted)]">Annual Re-intake Burden</div>
                    <div className="text-sm text-[var(--cl-text-muted)] mt-1">Per year (~127,000 cats returned)</div>
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
                      <blockquote className="classic-display text-xl md:text-2xl italic text-[var(--cl-ink)] leading-relaxed mb-4 max-w-[82%]">
                        &ldquo;I was crying for the first three days, just thinking about how to return him.&rdquo;
                      </blockquote>
                      <p className="text-sm text-[var(--cl-text-muted)]">First-time Adopter.</p>
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
                className="mb-40 pt-16 border-t border-[var(--cl-ink-a10)] scroll-mt-32"
              >
                <NarrativeBlock
                  title="THE STRATEGIC PIVOT"
                  content="Reframing the support model: From waiting for a crisis, to anticipating the Expectation Gap."
                  accentColor={accentColor}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                  {/* Current State = the problem. A muted, taupe-tinted card that
                      sits back (recessed inset shadow, muted label tone). */}
                  <div
                    className="rounded-2xl border p-8"
                    style={{
                      background: "var(--cl-pivot-muted-bg)",
                      borderColor: "var(--cl-pivot-muted-border)",
                      boxShadow: "var(--cl-pivot-muted-shadow)",
                    }}
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cl-text-muted)] mb-4">
                      Current State
                    </p>
                    <h4 className="text-xl font-bold text-[var(--cl-ink)] mb-4">Reactive Support</h4>
                    <p className="text-[var(--cl-text-soft)] leading-relaxed">
                      Adopters face a "Support Vacuum" immediately after leaving the shelter. When crises occur, they frantically turn to Reddit or social media. This reactive searching leads to conflicting advice, deep isolation, and eventual burnout.
                    </p>
                  </div>

                  {/* Future State = the solution. A warm ivory card that lifts
                      (champagne hairline + label, softer raised shadow). */}
                  <div
                    className="rounded-2xl border p-8"
                    style={{
                      background: "var(--cl-pivot-lift-bg)",
                      borderColor: "var(--cl-champagne-a45)",
                      boxShadow: "var(--cl-pivot-lift-shadow)",
                    }}
                  >
                    <p
                      className="font-mono text-xs uppercase tracking-[0.2em] mb-4"
                      style={{ color: "var(--cl-champagne)" }}
                    >
                      Future State
                    </p>
                    <h4 className="text-xl font-bold text-[var(--cl-ink)] mb-4">Proactive Intervention</h4>
                    <p className="text-[var(--cl-text-soft)] leading-relaxed">
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
                    className="nuz-cta"
                    aria-label="Experience Live Prototype, opens in a new tab"
                  >
                    <span className="nuz-cta__orbit" aria-hidden="true" />
                    <span className="nuz-cta__face">
                      Experience Live Prototype
                      <svg
                        className="nuz-cta__arrow"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 11.5L11.5 4.5M6 4.5H11.5V10"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
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
                  ].map((feature, i) => (
                    <CompanionFeatureCard key={feature.step} feature={feature} index={i} />
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
                    alt="Back-Stage Orchestration, service blueprint"
                    accentColor={accentColor}
                    width={17979}
                    height={5279}
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
                className="mb-40 pt-16 border-t border-[var(--cl-ink-a10)] scroll-mt-32"
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
                        width={2560}
                        height={2072}
                        className="h-auto w-full object-contain"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                      />
                    </ZoomableImage>
                  </div>

                  {/* Right: Stakeholders — tabular, numbered rows with hairline dividers */}
                  <div className="lg:col-span-4 flex flex-col">
                    {[
                      {
                        n: "01",
                        title: "Commercial Partners",
                        text: "Reach 100% of high-intent new cat parents. By driving first-time purchases through Nuzzle's curated shopping guides, we generate sustainable affiliate revenue.",
                      },
                      {
                        n: "02",
                        title: "Local Vet Clinics",
                        text: "Alleviate first-week health anxieties via one-click appointments, establishing a stable, geo-targeted acquisition channel for local partners.",
                      },
                      {
                        n: "03",
                        title: "Shelter Organizations",
                        text: "Reduce return rates and automate follow-ups, providing critical retention analytics while alleviating their financial and operational strain.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={item.n}
                        className={`grid grid-cols-[3rem_1fr] gap-5 py-7 ${
                          idx === 0 ? "border-t" : ""
                        } border-b border-[var(--cl-ink-a12)]`}
                      >
                        <span
                          className="font-mono text-xs tracking-[0.2em] pt-[3px]"
                          style={{ color: accentColor }}
                        >
                          {item.n}
                        </span>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--cl-ink)] mb-2 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-sm text-[var(--cl-text-soft)] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.section>

              {/* Section: The Future — Sustainable Impact & Path to Profitability */}
              <motion.section
                id="future"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t border-[var(--cl-ink-a10)] scroll-mt-32"
              >
                <NarrativeBlock
                  title="Sustainable Impact & Path to Profitability"
                  content="Nuzzle transforms a shelter's cost center into a sustainable service ecosystem, saving both lives and operational budgets."
                  accentColor={accentColor}
                />

                {/* Content pieces with generous breathing room between each block */}
                <div className="mt-16 space-y-24 md:space-y-28">
                {/* Group A: 4 images + 3 stats — visually linked (tighter internal gap) */}
                <div className="space-y-10">
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
                    className="p-8 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                  >
                    <h4
                      className="classic-label text-sm uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      Operational Savings
                    </h4>
                    <p className="text-[var(--cl-ink)] leading-relaxed">
                      Saves approximately $250 in medical and housing operations per intercepted return.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                  >
                    <h4
                      className="classic-label text-sm uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      The Adopter Data Asset
                    </h4>
                    <p className="text-[var(--cl-ink)] leading-relaxed">
                      Transforms 30-day daily logs into highly valuable, anonymized behavioral and commercial data.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                  >
                    <h4
                      className="classic-label text-sm uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      Scalability
                    </h4>
                    <p className="text-[var(--cl-ink)] leading-relaxed">
                      Designed to scale from a single-shelter pilot to the standard U.S. adoption infrastructure.
                    </p>
                  </motion.div>
                </div>
                </div>

                {/* Group B: Mission/Vision + Reflection — separated from stats by a hairline divider */}
                <div className="pt-20 border-t border-[var(--cl-ink-a10)] space-y-16">
                  {/* Mission image */}
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

                  {/* Bottom: Reflection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-[var(--cl-surface-2)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)] border-l-4"
                    style={{ borderLeftColor: accentColor }}
                  >
                    <p className="classic-display text-[var(--cl-ink)] leading-relaxed text-lg italic">
                      "Ultimately, Nuzzle demonstrates that the key to solving the animal return crisis isn't about finding 'better' pets, but about designing proactive, human-centric support systems for the people who adopt them."
                    </p>
                  </motion.div>
                </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Next Project Navigation */}
        <div className="w-full px-6 md:px-12 lg:px-24">
          <div id="next-project-start" className="pt-16 border-t" style={{ borderColor: "var(--cl-hairline-next)" }}>
            <NextProject
              title={nextProject.title}
              href={nextHref}
              image={nextProject.image}
            />
          </div>
        </div>

        <footer className="px-6 py-8 md:px-12 lg:px-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--cl-text-muted)]">© 2026 · Designed and built by Aijia Fang</p>
        </footer>
      </main>
    </ProjectThemeProvider>
  )
}
