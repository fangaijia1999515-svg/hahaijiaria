"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { BlueprintJourneyCarousel } from "@/components/case-study/blueprint-journey-carousel"
import { TestingPager } from "@/components/eaudetoi/TestingPager"
import { NextProject } from "@/components/case-study/next-project"
import { ProjectThemeProvider } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"

const accentColor = "#96C1FF" // Eau de Toi Blue

export default function EauDeToiPage() {
  const nextProject = getNextProject("eau-de-toi")

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
    const main = document.querySelector("main")
    if (main) {
      main.style.opacity = "1"
      main.style.visibility = "visible"
    }
  }, [])

  return (
    <ProjectThemeProvider projectId="eau-de-toi">
      {/* Page-wide vertical gradient. Stops: 0–78% solid brown, 78–100% fades to near-black. */}
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom, #1E1510 0%, #1E1510 78%, #030201 100%)",
        }}
      >
        <main style={{ opacity: 1, visibility: "visible" }}>
          <Navigation />

          {/* Global Header: Title + One-Liner (left) + Awards (right) */}
          <div id="overview" className="scroll-mt-32">
            <header className="pt-32 pb-2 px-6 md:px-12 lg:px-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
                {/* Left: Title + one-liner */}
                <div className="lg:col-span-8">
                  <motion.h1
                    initial={{ opacity: 1, y: 0 }}
                    className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-3 text-white"
                  >
                    Eau de Toi
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 1, y: 0 }}
                    className="text-base md:text-lg lg:text-xl leading-tight max-w-3xl text-[#A89080]"
                  >
                    Discover Your Scent Personality｜An immersive, multisensory booth that guides shoppers from decision paralysis to confident fragrance choices.
                  </motion.p>
                </div>

                {/* Right: Awards — compact, right-aligned on lg */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3"
                >
                  <a
                    href="https://indigoaward.com/winners/11703"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    data-cursor-color={accentColor}
                    data-cursor-no-magnet
                    className="group inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] transition-opacity hover:opacity-80"
                    style={{ color: accentColor }}
                    aria-label="View 2026 Indigo Design Awards profile (opens in new tab)"
                  >
                    <span>2026 Indigo Design Awards</span>
                    <svg
                      viewBox="0 0 10 10"
                      className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5" />
                    </svg>
                  </a>
                  <ul className="space-y-1.5 text-left lg:text-right">
                    {[
                      { medal: "Silver", category: "Interaction Design" },
                      { medal: "Silver", category: "UX & Navigation" },
                      { medal: "Bronze", category: "Interactive Design" },
                    ].map((a) => (
                      <li
                        key={`${a.medal}-${a.category}`}
                        className="text-sm leading-snug"
                      >
                        <span className="font-bold text-[#F2F0E9]">
                          {a.medal}
                        </span>
                        <span className="mx-2 text-[#A89080]/50">·</span>
                        <span className="text-[#A89080]">{a.category}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </header>
          </div>

          {/* Hero Video */}
          <div className="w-full px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-12 relative"
            >
              <video
                src="/image/eaudetoi/Video/edtpromovideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Main Split Layout */}
          <div className="w-full px-6 md:px-12 lg:px-24 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
              {/* Left Column: Sticky Context Rail (3 cols) */}
              <div className="lg:col-span-3">
                <ContextSidebar
                  role="Service Designer"
                  timeline="10 Weeks"
                  team="Eau Yeah (5 Members)"
                  tools={[
                    "Service Ecosystems",
                    "ML Integration",
                    "Rapid Prototyping",
                    "UI/UX",
                    "Service Blueprinting",
                    "Investigative Rehearsal",
                  ]}
                  accentColor={accentColor}
                  sections={[
                    { id: "overview", label: "Overview" },
                    { id: "problem", label: "The Problem" },
                    { id: "solution", label: "The Solution" },
                    { id: "blueprint", label: "Blueprint" },
                    { id: "prototype", label: "Prototype" },
                    { id: "technology", label: "Technology" },
                    { id: "business", label: "Business" },
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
                  {/* Top: KPI Cards — 3 core problem stats */}
                  <ImpactDashboard
                    metrics={[
                      {
                        value: "54%",
                        label: "Cognitive Overload",
                        detail: "Overwhelmed by excessive choices",
                      },
                      {
                        value: "26%",
                        label: "Lack of Trust",
                        detail: "In sales associate suggestions",
                      },
                      {
                        value: "72%",
                        label: "Want Sensory Engagement",
                        detail: "Prefer multi-sensory experiences",
                      },
                    ]}
                    accentColor={accentColor}
                  />

                  {/* Middle: Text Grid with col-span logic */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-16">
                    {/* Left (Col-span-4): The Challenge */}
                    <div className="lg:col-span-4">
                      <NarrativeBlock
                        title="The Challenge"
                        content="Fragrance shoppers often face decision paralysis in retail stores, overwhelmed by countless options, complex note descriptions, and unfamiliar brands. Current experiences rarely tap into visuals, sound, or mood, leading to missing sensory cues. As a result, customers experience longer browsing times, lower purchase confidence, and frequently abandon their shopping journeys."
                        accentColor={accentColor}
                      />
                    </div>
                    {/* Right (Col-span-8): The Approach + The Outcome */}
                    <div className="lg:col-span-8 space-y-8">
                      <NarrativeBlock
                        title="The Approach"
                        content="To solve this, we employed a highly iterative prototyping process to test the desirability, usability, and feasibility of a tech-aided recommendation system. We utilized diverse methods, including Desktop Walkthroughs to map store movement, Service Advertisements to test value propositions, and Cardboard/Paper Prototyping to simulate booth interactions and post-purchase touchpoints."
                        accentColor={accentColor}
                      />
                      <NarrativeBlock
                        title="The Outcome"
                        content="We created Eau de Toi, a guided, multisensory fragrance experience that helps casual shoppers discover who they are and what they want to wear. The result is a seamless, confidence-building experience that makes fragrance shopping inspiring, memorable, and deeply personal."
                        accentColor={accentColor}
                      />
                    </div>
                  </div>
                </motion.section>

                {/* Section: The Problem */}
                <motion.section
                  id="problem"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 border-t-section scroll-mt-32"
                >
                  {/* Narrative intro — same structure as NarrativeBlock, with inline bold lead-in */}
                  <div className="mb-12">
                    <h3
                      className="text-sm font-bold uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      THE PROBLEM LANDSCAPE
                    </h3>
                    <p className="text-[#F2F0E9] leading-relaxed text-lg max-w-3xl">
                      <strong className="font-bold">The paradox of choice in fragrance shopping.</strong> The &ldquo;moment of truth&rdquo; for a customer arrives when they must choose a fragrance without fully understanding what suits them. Our research surfaced four interconnected pain points that cause this breakdown in the customer journey.
                    </p>
                  </div>

                  {/* Pull quote — real user voice bridging the analysis above and the pain-point breakdown below */}
                  <motion.figure
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 md:mt-20 pl-6 max-w-2xl"
                    style={{ borderLeft: `4px solid ${accentColor}` }}
                  >
                    <blockquote className="text-xl md:text-2xl italic text-[#F2F0E9] leading-relaxed mb-4">
                      &ldquo;I will only online shop at Zara because there aren&rsquo;t 100 different choices that make me feel overwhelmed.&rdquo;
                    </blockquote>
                    <figcaption className="text-sm text-[#A89080]">
                      — Interview participant, fragrance shopper
                    </figcaption>
                  </motion.figure>

                  {/* 4 pain points — 2x2 grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-14 lg:gap-y-16 mt-20 md:mt-28"
                  >
                    {[
                      {
                        n: "01",
                        title: "Cognitive Overload",
                        text: "Paralyzed by excessive choices, complex terminology, and a lack of clear comparability.",
                      },
                      {
                        n: "02",
                        title: "Contextual Discovery",
                        text: "Shoppers connect with scents through experiential moments rather than static displays or online text.",
                      },
                      {
                        n: "03",
                        title: "The Articulation Gap",
                        text: "Consumers lack the specific olfactory vocabulary to accurately describe their tastes.",
                      },
                      {
                        n: "04",
                        title: "Missing Sensory Cues",
                        text: "Traditional retail formats fail to engage shoppers through visual, auditory, and emotional stimuli.",
                      },
                    ].map((p, i) => (
                      <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span
                          className="font-mono text-[11px] tracking-[0.3em] block mb-3"
                          style={{ color: accentColor }}
                        >
                          {p.n}
                        </span>
                        <h4 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#F2F0E9] tracking-tight">
                          {p.title}
                        </h4>
                        <p className="text-[#A89080] leading-relaxed max-w-[26rem]">
                          {p.text}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>

                {/* Section: The Solution */}
                <motion.section
                  id="solution"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 border-t-section scroll-mt-32"
                >
                  <NarrativeBlock
                    title="DISCOVER YOUR SCENT PERSONALITY"
                    content="Eau de Toi acts as an immersive discovery booth that connects customers with scents they truly love. It accomplishes this through three core service features."
                    accentColor={accentColor}
                  />

                  {/* 3 paired image+content columns — tall vertical feature panels */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
                    {[
                      {
                        step: "01",
                        title: "Personalized Scent Matching",
                        description:
                          "Users match perfumes to their mood, preferences, and personality using a fast, intuitive quiz.",
                        image: "/image/eaudetoi/image/outcome101.png",
                      },
                      {
                        step: "02",
                        title: "Immersive Discovery Experience",
                        description:
                          "Shoppers discover scents in a multisensory booth equipped with ambient visuals, sounds, and immersive testing.",
                        image: "/image/eaudetoi/image/outcome02.webp",
                      },
                      {
                        step: "03",
                        title: "Scent Personality Profiling",
                        description:
                          "Users receive a scent-based personality profile defined by keywords, moods, and style (e.g., \u201CThe Warm Idealist\u201D).",
                        image: "/image/eaudetoi/image/outcome03.png",
                      },
                    ].map((s, i) => (
                      <motion.div
                        key={s.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl overflow-hidden border border-white/10 bg-[#1A120E]/80 flex flex-col"
                      >
                        <div className="relative w-full aspect-[3/4] bg-muted">
                          <Image
                            src={s.image}
                            alt={s.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <span
                            className="font-mono text-xs tracking-[0.2em]"
                            style={{ color: accentColor }}
                          >
                            {s.step}
                          </span>
                          <h4 className="mt-4 text-lg font-bold text-white leading-snug tracking-tight">
                            {s.title}
                          </h4>
                          <p className="mt-3 text-sm text-[#A89080] leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section: Service Blueprint & User Journey — part of Act II (Solution), no chapter divider */}
                <motion.section
                  id="blueprint"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 scroll-mt-32"
                >
                  <NarrativeBlock
                    title="FRONTSTAGE × BACKSTAGE"
                    content={`To ensure a flawless experience, we mapped the "Frontstage" (user touchpoints) and "Backstage" (system processes) across the entire shopping journey.`}
                    accentColor={accentColor}
                  />

                  <div className="mt-12">
                    <BlueprintJourneyCarousel
                      slides={[
                        {
                          src: "/image/eaudetoi/image/blueprint.png",
                          alt: "Eau de Toi service blueprint — frontstage to backstage",
                          label: "Service Blueprint",
                        },
                        {
                          src: "/image/eaudetoi/image/journeymap.png",
                          alt: "Eau de Toi user journey map",
                          label: "User Journey",
                          scale: 1.02,
                        },
                      ]}
                      cursorColor={accentColor}
                    />
                  </div>

                  {/* Key Touchpoints — card grid matching Skya's Strategic Pivot style */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12"
                  >
                    {[
                      {
                        title: "Awareness & Entry",
                        text: "A customer views a window display or scans a QR code (\u201CI\u2019m curious about the fragrance personality test\u201D) and follows aisle signage to the booth.",
                      },
                      {
                        title: "Discovery",
                        text: "The user takes the recommendation quiz on the booth\u2019s interactive screen. Backstage, the system processes the scent profile and mood mapping, routing recommendations to the booth and the sales associate\u2019s terminal.",
                      },
                      {
                        title: "Decision & Purchase",
                        text: "The user samples recommendations, saves favorites to a wishlist, and proceeds to the checkout counter.",
                      },
                      {
                        title: "Post-Sale Engagement",
                        text: "The customer receives an automated email summary with their personality type, saved scents, and longevity / sillage details.",
                      },
                    ].map((item) => (
                      <div key={item.title}>
                        <span
                          className="block font-mono text-xs uppercase tracking-[0.2em] mb-3"
                          style={{ color: accentColor }}
                        >
                          {item.title}
                        </span>
                        <p className="text-base text-[#F2F0E9] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </motion.section>

                {/* Section: Prototyping & Testing — part of Act II (Solution), no chapter divider */}
                <motion.section
                  id="prototype"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 scroll-mt-32"
                >
                  <NarrativeBlock
                    title="Prototyping & Testing"
                    content="We rigorously tested our assumptions before finalizing the service, focusing on whether immersive elements and fewer options build user confidence."
                    accentColor={accentColor}
                  />

                  {/* Paginated testing methods — Skya-style one-at-a-time view */}
                  <div className="mt-16">
                    <TestingPager
                      accentColor={accentColor}
                      steps={[
                        {
                          number: "01",
                          title: "Service Advertisement",
                          description:
                            "We tested our value proposition via an entrance poster.",
                          findings:
                            "While the messaging successfully attracted interest, a single poster was insufficient; we must implement a network of in-store directional signage to successfully guide customers to the booth.",
                          images: [
                            "/image/eaudetoi/image/poster01.webp",
                            "/image/eaudetoi/image/poster02.png",
                          ],
                        },
                        {
                          number: "02",
                          title: "Desktop Walkthrough",
                          description:
                            "We utilized a cardboard store model to simulate and observe customer traffic patterns (spatial flow).",
                          findings:
                            "This allowed us to determine the optimal placement for the booth and iterate on its physical scale and visibility to ensure a natural transition from the browsing aisles.",
                          images: [
                            "/image/eaudetoi/image/desktop01.webp",
                            "/image/eaudetoi/image/desktop02.webp",
                            "/image/eaudetoi/image/desktop04.webp",
                          ],
                        },
                        {
                          number: "03",
                          title:
                            "Cardboard Prototyping & Investigative Rehearsal",
                          description:
                            "We built a low-fidelity physical mockup and simulated real interactions to test user behavior and desirability.",
                          findings:
                            "The flow of questions and wishlist integration seamlessly fostered engagement, though scent delivery channels and sales associate roles require refinement.",
                          images: [
                            "/image/eaudetoi/image/booth03.webp",
                            "/image/eaudetoi/image/booth02.webp",
                            "/image/eaudetoi/image/booth01.webp",
                          ],
                        },
                        {
                          number: "04",
                          title: "Paper Prototyping",
                          description:
                            "We tested a post-experience email containing the user\u2019s scent personality results and fragrance education.",
                          findings:
                            "Users found the personalized feedback highly engaging and expressed strong intent to share it, validating its value for long-term retention.",
                          images: [
                            "/image/eaudetoi/image/email04b.webp",
                          ],
                        },
                      ]}
                    />
                  </div>

                </motion.section>

                {/* Section: Technology / Algorithm */}
                <motion.section
                  id="technology"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 border-t-section scroll-mt-32"
                >
                  <NarrativeBlock
                    title="MACHINE LEARNING FEASIBILITY"
                    content="To determine whether a tech-aided system could accurately support our service, we tested the viability of a Machine Learning backbone."
                    accentColor={accentColor}
                  />

                  {/* Image left + tabular list right — mirrors Nuzzle's SUSTAINABLE SCALABILITY block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                  >
                    {/* Left: portrait data-viz image — compact, rounded on image itself */}
                    <div className="lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none">
                      <div
                        className="relative w-full overflow-hidden rounded-xl"
                        style={{ aspectRatio: "2535 / 2658" }}
                      >
                        <Image
                          src="/image/eaudetoi/image/data.png"
                          alt="Orange Data Mining — KNN / Naive Bayes analysis of Fragrantica dataset"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 48vw"
                        />
                      </div>
                    </div>

                    {/* Right: tabular labelled rows, hairline dividers (Nuzzle pattern) */}
                    <div className="lg:col-span-6 flex flex-col">
                      {[
                        {
                          label: "The Model",
                          text: "Predictive recommendations based on descriptive keywords.",
                        },
                        {
                          label: "The Data",
                          text: "Trained using the Fragrantica Dataset from Kaggle.",
                        },
                        {
                          label: "The Algorithms",
                          text: "Evaluated via K-Nearest Neighbors (KNN) and Naive Bayes to process variables like Gender and Main Accords.",
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
                          <p className="text-lg text-[#F2F0E9] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.section>

                {/* Section: Business Viability — part of Act III (Validation), no chapter divider */}
                <motion.section
                  id="business"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-16 pt-16 scroll-mt-32"
                >
                  <NarrativeBlock
                    title="BUSINESS VIABILITY"
                    content="Is replacing retail shelf space with a digital booth worth the investment?"
                    accentColor={accentColor}
                  />

                  {/* 3-beat argument ledger — 01 cost · 02 validation · 03 tipping point
                      Visual weight progresses L→R (muted → accent → accent bold)
                      to mirror the narrative: "tiny loss → users love it → tiny gain wins it back" */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 md:mt-24 lg:mt-28 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
                  >
                    {/* 01 — The Cost (muted) */}
                    <div className="rounded-2xl border border-white/10 bg-[#1A120E]/60 p-6 md:p-7 flex flex-col">
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                        style={{ color: "#A89080" }}
                      >
                        The Cost
                      </p>
                      {/* Hero = 0.29% (the business-critical number)
                          2.94% demoted to a single-line sub-caption for context */}
                      <div
                        className="font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-3"
                        style={{ color: "#A89080" }}
                      >
                        0.29%
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2F0E9]/90 mb-6">
                        Passive Revenue Drop
                      </div>
                      <p className="text-[#F2F0E9]/70 leading-relaxed text-sm mt-auto">
                        Dedicating floor space to the booth removes{" "}
                        <span className="text-[#F2F0E9]/90 font-semibold">2.94% of displayed units</span>, producing only a marginal drop in passive revenue.
                      </p>
                    </div>

                    {/* 02 — The Validation (accent) */}
                    <div
                      className="rounded-2xl border bg-[#1A120E]/80 p-6 md:p-7 flex flex-col"
                      style={{ borderColor: `${accentColor}33` }}
                    >
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                        style={{ color: accentColor }}
                      >
                        The Validation
                      </p>
                      <div
                        className="font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-3"
                        style={{ color: accentColor }}
                      >
                        90%
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2F0E9]/90 mb-6">
                        User Desirability
                      </div>
                      <p className="text-[#F2F0E9]/80 leading-relaxed text-sm mt-auto">
                        An overwhelming majority of tested shoppers perceived the guided, multisensory experience as highly desirable and confidence-building.
                      </p>
                    </div>

                    {/* 03 — The Tipping Point (accent, strongest) */}
                    <div
                      className="rounded-2xl border bg-[#1A120E]/90 p-6 md:p-7 flex flex-col"
                      style={{
                        borderColor: `${accentColor}66`,
                        boxShadow: `0 0 0 1px ${accentColor}1A inset`,
                      }}
                    >
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                        style={{ color: accentColor }}
                      >
                        The Tipping Point
                      </p>
                      <div
                        className="font-black text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-3"
                        style={{ color: accentColor }}
                      >
                        +1%
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2F0E9]/90 mb-6">
                        Conversion Lift to Break Even
                      </div>
                      <p className="text-[#F2F0E9]/85 leading-relaxed text-sm mt-auto">
                        Because user confidence is so high, even a mere 1% increase in conversion entirely balances the lost shelf revenue.
                      </p>
                    </div>
                  </motion.div>

                  {/* Verdict line — physically ties cost → validation → return into one sentence */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="mt-20 md:mt-24 lg:mt-28"
                  >
                    <p
                      className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4"
                      style={{ color: accentColor }}
                    >
                      The Verdict
                    </p>
                    <p className="text-xl md:text-2xl lg:text-[26px] font-light text-[#F2F0E9] leading-snug max-w-3xl tracking-tight">
                      Trade a{" "}
                      <span style={{ color: "#A89080" }} className="font-semibold">
                        0.29% passive loss
                      </span>{" "}
                      for a{" "}
                      <span style={{ color: accentColor }} className="font-semibold">
                        1% conversion win
                      </span>
                      , backed by{" "}
                      <span style={{ color: accentColor }} className="font-semibold">
                        90% desirability
                      </span>
                      . Anything beyond is pure upside.
                    </p>
                  </motion.div>

                </motion.section>
              </div>
            </div>
          </div>

          {/* Brown → black from final visual + takeaway through Next project + footer */}
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
                    >
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                        <iframe
                          src="https://www.youtube.com/embed/NcUgDQB3j3M?rel=0&modestbranding=1"
                          title="Eau de Toi — final hero video"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    </motion.div>

                    {/* Final Recommendations for Retailers — moved here, right before the reflection quote */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-[0.25em] mb-8"
                        style={{ color: accentColor }}
                      >
                        Final Recommendations for Retailers
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          {
                            n: "01",
                            title: "Strategic Placement",
                            text: "Place the booth outside the store or in entry zones to actively attract foot traffic.",
                          },
                          {
                            n: "02",
                            title: "Delivery Channel Innovation",
                            text: "Utilize technical solutions like vending machines or embedded scent tiles for sample delivery to improve user comfort.",
                          },
                          {
                            n: "03",
                            title: "Service Evolution",
                            text: "Develop a system that builds a \u201CScent History\u201D over time for deeper, long-term personalization and retention.",
                          },
                        ].map((rec, i) => (
                          <motion.div
                            key={rec.n}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-xl bg-white/[0.05] backdrop-blur-sm"
                          >
                            <span
                              className="font-mono text-xs tracking-[0.2em]"
                              style={{ color: accentColor }}
                            >
                              {rec.n}
                            </span>
                            <h4 className="mt-3 text-lg font-bold text-white mb-3 leading-snug">
                              {rec.title}
                            </h4>
                            <p className="text-[#F2F0E9]/75 leading-relaxed text-sm">
                              {rec.text}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="p-8 rounded-xl bg-white/[0.03] border-l-4"
                      style={{ borderLeftColor: accentColor }}
                    >
                      <p className="text-[#F2F0E9] leading-relaxed text-lg italic">
                        &ldquo;Eau de Toi proves that in a crowded retail environment, the key to conversion isn&apos;t more choice. It&apos;s more clarity. By reducing cognitive load and building emotional trust, we transform browsing into meaningful discovery.&rdquo;
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
