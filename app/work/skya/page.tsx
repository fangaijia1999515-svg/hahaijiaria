"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CaseStudyHeader } from "@/components/case-study/case-study-header"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { KeyInsight } from "@/components/case-study/key-insight"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { SystemBlueprint } from "@/components/case-study/system-blueprint"
import { NextProject } from "@/components/case-study/next-project"
import { SkyaHowItWorks } from "@/components/skya/SkyaHowItWorks"
import { QuoteImageCarousel } from "@/components/skya/QuoteImageCarousel"
import { StrategyImageCarousel } from "@/components/skya/StrategyImageCarousel"
import { OutcomeImageCarousel } from "@/components/skya/OutcomeImageCarousel"
import { ProjectThemeProvider } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"

const accentColor = "#E692FF" // Skya Purple

export default function SkyaPage() {
  const nextProject = getNextProject("skya")
  const expansionVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = expansionVideoRef.current

    // 1. SAFETY CHECK: If video DOM doesn't exist yet, stop immediately.
    // This prevents the "Cannot read properties of null" crash during navigation.
    if (!video) return

    // 2. Wrap async logic in try-catch for extra safety
    try {
      video.defaultMuted = true
      video.muted = true
      
      const playPromise = video.play()
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Log error silently, do NOT crash the app
          console.log("Autoplay prevented (harmless):", error)
        })
      }
    } catch (err) {
      console.error("Video initialization error:", err)
    }
  }, [])

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

      // If sidebar would overlap with next project, stop it
      if (sidebarBottom >= nextProjectTop - 24) {
        const maxTop = nextProjectTop - sidebarRect.height - 24
        sidebar.style.top = `${Math.max(96, maxTop)}px` // 96px = top-24 equivalent
      } else {
        sidebar.style.top = ""
      }
    }

    const nextProjectStart = document.getElementById("next-project-start")
    if (nextProjectStart) {
      // Use IntersectionObserver for better performance
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
    // Ensure page is visible immediately on client-side navigation
    const main = document.querySelector('main')
    if (main) {
      main.style.opacity = '1'
      main.style.visibility = 'visible'
    }
  }, [])


  return (
    <ProjectThemeProvider projectId="skya">
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
            title="SKYA"
            oneLiner="An autonomous delivery ecosystem transforming last-mile logistics into seamless urban infrastructure."
            accentColor={accentColor}
          />
        </div>

        {/* Hero Image - Moved up immediately after text */}
        <div className="w-full px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-16 relative"
          >
            <Image
              src="/image/skya/heroshot.webp"
              alt="SKYA Hero"
              fill
              className="object-cover"
              style={{ objectPosition: "center 70%" }}
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
                role="Lead Service Designer"
                timeline="10 Weeks"
                team="4 Members"
                tools={[
                  "Figma",
                  "Notion",
                  "After Effects",
                  "UserTesting",
                  "Service Blueprinting",
                  "Journey Mapping",
                  "Business Model Canvas",
                  "Value Proposition Canvas",
                  "Blue Ocean Strategy",
                ]}
                accentColor={accentColor}
              />
            </div>

            {/* Right Column: Narrative Stream (9 cols) */}
            <div className="lg:col-span-9">

              {/* Section: Overview */}
              <motion.section
                initial={{ opacity: 1, y: 0 }}
                className="mb-28 pt-20"
              >
                {/* Top: KPI Cards */}
                <ImpactDashboard
                  metrics={[
                    { value: "53%", label: "Last-mile share", detail: "Of total logistics cost" },
                    { value: "27%", label: "Urban residents", detail: "Experiencing delivery issues" },
                    { value: "8.7%", label: "Last mile delivery", detail: "Share of US GDP" },
                  ]}
                  accentColor={accentColor}
                />

                {/* Middle: Text Grid with col-span logic */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-16">
                  {/* Left (Col-span-4): The Challenge */}
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="The Challenge"
                      content="Last-mile delivery is the most expensive and inefficient part of the supply chain, accounting for 53% of total logistics costs. With rising package theft and carbon emissions, the traditional 'courier-to-door' model is broken."
                      accentColor={accentColor}
                    />
                  </div>
                  {/* Right (Col-span-8): The Solution + My Contribution */}
                  <div className="lg:col-span-8 space-y-8">
                    <NarrativeBlock
                      title="The Solution"
                      content="SKYA is a bi-directional autonomous delivery system. Instead of moving individual packages, we transport mobile smart lockers directly to residential communities using autonomous vehicles. It streamlines delivery, simplifies returns, and integrates seamlessly into smart city infrastructure."
                      accentColor={accentColor}
                    />
                    <NarrativeBlock
                      title="My Contribution"
                      content="I led the service ecosystem design, facilitated user testing to pivot our business model, and designed the end-to-end user experience."
                      accentColor={accentColor}
                    />
                  </div>
                </div>

                {/* Bottom: How It Works Interactive Carousel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full mt-12"
                >
                  <SkyaHowItWorks />
                </motion.div>
              </motion.section>

              {/* Section: Research & Insights */}
              <motion.section
                id="research"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t-section scroll-mt-32"
              >
                {/* Top Row: Headline + Intro Text */}
                <NarrativeBlock
                  title="The Problem Landscape"
                  content="We identified critical friction points: high costs, theft risks, and environmental impact."
                  accentColor={accentColor}
                />

                {/* Middle Row: Stats as Huge Text with Vertical Divider */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 my-16 py-8"
                >
                  <div className="flex-1">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-2" style={{ color: accentColor }}>
                      $6B+
                    </div>
                    <div className="text-sm uppercase tracking-[0.15em] text-[#A89080]">Annual Loss</div>
                    <div className="text-sm text-[#F2F0E9]/60 mt-1">Package Theft</div>
                  </div>
                  
                  {/* Vertical Divider */}
                  <div className="w-px h-24 bg-white/10 hidden md:block" />
                  
                  <div className="flex-1">
                    <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-2" style={{ color: accentColor }}>
                      $890B
                    </div>
                    <div className="text-sm uppercase tracking-[0.15em] text-[#A89080]">Lost</div>
                    <div className="text-sm text-[#F2F0E9]/60 mt-1">Retail Returns</div>
                  </div>
                </motion.div>

                {/* Bottom Row: Quote Left + Image Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                  {/* Left: Quint Bailey Quote */}
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
                        "Logistic Companies won't just pay for delivery speed. However, the return solution is gold. Returns are a massive pain point with terrible economics."
                      </blockquote>
                      <p className="text-sm text-[#A89080]">— Quint Bailey, UX Designer at Penske</p>
                    </div>
                  </motion.div>

                  {/* Right: Image Carousel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <QuoteImageCarousel
                      images={[
                        "/image/skya/deliveryissuechart.webp",
                        "/image/skya/enviromental.webp",
                      ]}
                      alt="Expert Interview / Chart"
                    />
                  </motion.div>
                </div>
              </motion.section>

              {/* Section: Strategy & Reframing */}
              <motion.section
                id="strategy"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t-section scroll-mt-32"
              >
                {/* Headline */}
                <NarrativeBlock
                  title="Strategic Pivot"
                  content="Moving from B2B2C to B2B partnership with Property Management."
                  accentColor={accentColor}
                />

                {/* Middle: 3 Value Proposition Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/10"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      For Residents
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Contactless, 24/7 access, and 'Zero-Hassle' returns.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/10"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      For Property Managers
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Reduced package management workload and new revenue streams via ads/data.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/10"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      For Logistics
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      60% reduction in handovers and optimized route efficiency.
                    </p>
                  </motion.div>
                </div>

                {/* Bottom: Horizontal Scroll Carousel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12"
                >
                  <StrategyImageCarousel
                    images={[
                      "/image/skya/blueocean.webp",
                      "/image/skya/businessmodel3.png",
                      "/image/skya/zag17.png",
                      "/image/skya/multistakeholdervaluemap.png",
                    ]}
                    alt="Strategy diagram"
                  />
                </motion.div>
              </motion.section>

              {/* Section: Service Blueprint */}
              <motion.section
                id="blueprint"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="Mapping the Ecosystem"
                  content="The blueprint orchestrates the interaction between the User, the Autonomous Vehicle (Skya), the Logistics Hub, and the Apartment infrastructure."
                  accentColor={accentColor}
                />
                <div className="mt-12">
                  <SystemBlueprint
                    image="/image/skya/serviceblueprint3.png"
                    alt="SKYA Service Blueprint"
                    accentColor={accentColor}
                  />
                </div>
              </motion.section>

              {/* Section: Design & Experience */}
              <motion.section
                id="design"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 pt-16 border-t-section scroll-mt-32"
              >
                {/* Block A: Digital Experience */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                  {/* Text Left (4 cols) */}
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="Digital Experience"
                      content="A centralized app that allows users to track deliveries in real-time and, crucially, initiate returns in 3 clicks—generating a QR code to drop items off without printing labels."
                      accentColor={accentColor}
                    />
                  </div>
                  {/* Video Right (8 cols) - Portrait Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8 flex justify-center"
                  >
                    <div className="max-w-[240px] w-full mx-auto rounded-3xl overflow-hidden">
                      <video
                        src="/video/skya/skya-app-demo4.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Block B: Physical Experience */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Text Left (4 cols) */}
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="Physical Experience"
                      content="The Skya Pod acts as a mobile hub, docking seamlessly with apartment complexes to serve as a temporary smart locker."
                      accentColor={accentColor}
                    />
                  </div>
                  {/* Video Right (8 cols) - Landscape 16:9 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8 w-full aspect-[16/9] bg-muted rounded-xl overflow-hidden relative"
                  >
                    <video
                      src="/video/skya/renderhero.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </motion.section>

              {/* Section: Outcome & Viability */}
              {/* Smaller bottom margin on purpose: the block that follows (video + final quote) */}
              {/* isn't a titled section, so it reads as a continuation rather than a new chapter. */}
              <motion.section
                id="outcome"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-16 pt-16 border-t-section scroll-mt-32"
              >
                <NarrativeBlock
                  title="Outcome & Business Viability"
                  content=""
                  accentColor={accentColor}
                />

                {/* Content pieces with generous breathing room between each block */}
                <div className="mt-16 space-y-24 md:space-y-28">
                {/* Group A: 4 media tiles + 3 impact stats — visually linked, but stats need clear separation from the media grid */}
                <div className="space-y-16">
                {/* Four Containers - Two rows */}
                <div className="space-y-8">
                  {/* First Row: Two Containers - Left: Image, Right: Video */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Single Image */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/skya/baselineforcastincome.webp"
                        alt="Baseline Forecast Income"
                        fill
                        className="object-contain scale-105"
                      />
                    </motion.div>
                    {/* Right: Video */}
                    <div className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative">
                      <video
                        ref={expansionVideoRef}
                        src="/video/skya/yr3-10-noaudio.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        controls={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Second Row: Two Containers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Container 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/skya/revenue.png"
                        alt="Revenue"
                        fill
                        className="object-contain scale-105"
                      />
                    </motion.div>
                    {/* Right: Container 4 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden relative"
                    >
                      <Image
                        src="/image/skya/60optimization.webp"
                        alt="60 Optimization"
                        fill
                        className="object-contain scale-105"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Middle: Impact Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      Financial
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Projected $5.14M revenue in Year 1 with diversified income streams (Service fees, Ads, Data).
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      Operational
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Potential to reduce logistics handovers by 60%.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                  >
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                      Future Vision
                    </h4>
                    <p className="text-[#F2F0E9] leading-relaxed">
                      Expanding from San Francisco to 20+ major US cities by 2033.
                    </p>
                  </motion.div>
                </div>
                </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>

        {/* Brown → black from last large visual (video) + quote through Next project + footer */}
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
                    <iframe
                      src="https://www.youtube.com/embed/VXqqCg1p4s4?start=1&autoplay=0&loop=0&controls=1&modestbranding=1&rel=0"
                      title="SKYA Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
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
                      "While SKYA was an ambitious concept requiring significant infrastructure investment, it successfully demonstrated how rethinking logistics as 'infrastructure' rather than 'service' can solve systemic urban challenges."
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
