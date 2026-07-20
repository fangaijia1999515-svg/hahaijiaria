"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { BlueprintJourneyCarousel } from "@/components/case-study/blueprint-journey-carousel"
import { TestingPager } from "@/components/eaudetoi/TestingPager"
import { NextProject } from "@/components/case-study/next-project"
import { ProjectThemeProvider, useThemeColor, type ClassicStage } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"

// ds accents — was Eau de Toi Blue #96C1FF. Forest green (--ds-accent) on the
// cream stage; sage (--ds-accent-soft) on the dark stage.
const ACCENT_LIGHT = "#3D4A3A"
const ACCENT_DARK = "#9CAF88"
const accentOnDark = "#9CAF88" // ds sage — accent voice inside charcoal blocks (both stages)
// the "cost" ledger voice: amber brown (--ds-accent-earth) on cream; muted
// terracotta (--ds-accent-warm) on dark, where amber brown sinks into charcoal
const MUTED_STAT_LIGHT = "#8B7355"
const MUTED_STAT_DARK = "#C4A484"

// Placeholder tile for assets the user will drop in later. Keeps layout stable
// and tells you exactly which file path to provide.
function AssetPlaceholder({
  aspect,
  label,
  path,
  className,
}: {
  aspect: string
  label: string
  path: string
  className?: string
}) {
  // Stage-resolved accent (forest on cream, sage on dark) from the provider.
  const { accentColor } = useThemeColor()
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-[var(--cl-ink-a10)] bg-muted flex items-center justify-center ${
        className ?? ""
      }`}
      style={{ aspectRatio: aspect }}
    >
      {/* Subtle brand-tinted wash so empty slots don't feel dead */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, var(--cl-ph-accent) 0%, var(--cl-ph-fade2) 55%), linear-gradient(135deg, var(--cl-ph-g1) 0%, var(--cl-ph-g2) 100%)",
        }}
      />
      <div className="relative text-center px-6">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.2em]"
          style={{ color: accentColor }}
        >
          {label}
        </span>
        <p className="mt-1 text-[10px] font-mono text-[var(--cl-text-muted-a60)]">{path}</p>
      </div>
    </div>
  )
}

export default function EauDeToiClassicPage({ stage = "light" }: { stage?: ClassicStage }) {
  const accentColor = stage === "dark" ? ACCENT_DARK : ACCENT_LIGHT
  const mutedStat = stage === "dark" ? MUTED_STAT_DARK : MUTED_STAT_LIGHT
  const nextProject = getNextProject("eau-de-toi")
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
    const main = document.querySelector("main")
    if (main) {
      main.style.opacity = "1"
      main.style.visibility = "visible"
    }
  }, [])

  return (
    <ProjectThemeProvider projectId="eau-de-toi" stage={stage}>
      {/* Page-wide vertical gradient — TRANSPARENT through the body (her
          2026-07-19 catch: the old opaque cl-bg stops sat OVER the fixed
          veil-new canvas and killed the silk on this page only; skya/nuzzle
          never had this wrapper). Only the 78-100% tail still deepens. */}
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 78%, var(--cl-grad-tail) 100%)",
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
                    className="classic-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-3 text-[var(--cl-ink)]"
                  >
                    Eau de Toi
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 1, y: 0 }}
                    className="text-base md:text-lg lg:text-xl leading-tight max-w-3xl text-[var(--cl-text-muted)]"
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
                  <a
                    href="https://www.idesignawards.com/social/zoom.php?eid=9-64052-25"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    data-cursor-color={accentColor}
                    data-cursor-no-magnet
                    className="group inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] transition-opacity hover:opacity-80"
                    style={{ color: accentColor }}
                    aria-label="View 2025 International Design Awards entry (opens in new tab)"
                  >
                    <span>2025 International Design Awards &middot; Honorable Mention</span>
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
                        <span className="font-bold text-[var(--cl-ink)]">
                          {a.medal}
                        </span>
                        <span className="mx-2 text-[var(--cl-text-muted-a50)]">·</span>
                        <span className="text-[var(--cl-text-muted)]">{a.category}</span>
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
              className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-12 relative cl-hero-media"
            >
              {/* Interim hero image (2026-07-17): the original layout reserved a
                  looping hero VIDEO here, but /video/eau-de-toi/hero.mp4 was
                  never produced, so the placeholder frame read as a frozen
                  player. Swap back to the commented <video> the moment she
                  supplies the file:
                  <video src="/video/eau-de-toi/hero.mp4" autoPlay loop muted playsInline
                         className="w-full h-full object-cover" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/eaudetoi/image/edthome01.webp"
                alt="Eau de Toi scent discovery experience"
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
                      className="classic-label text-sm uppercase tracking-[0.2em] mb-4"
                      style={{ color: accentColor }}
                    >
                      THE PROBLEM LANDSCAPE
                    </h3>
                    <p className="text-[var(--cl-ink)] leading-relaxed text-lg max-w-3xl">
                      <strong className="font-bold">The paradox of choice in fragrance shopping.</strong>{" "}
                      The &ldquo;moment of truth&rdquo; for a customer arrives when they must choose a fragrance without fully understanding what suits them. Our research surfaced four interconnected pain points that cause this breakdown in the customer journey.
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
                    <blockquote className="classic-display text-xl md:text-2xl italic text-[var(--cl-ink)] leading-relaxed mb-4">
                      &ldquo;I will only online shop at Zara because there aren&rsquo;t 100 different choices that make me feel overwhelmed.&rdquo;
                    </blockquote>
                    <figcaption className="text-sm text-[var(--cl-text-muted)]">
                      Interview participant, fragrance shopper
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
                        title: "Cognitive Overload",
                        text: "Paralyzed by excessive choices, complex terminology, and a lack of clear comparability.",
                      },
                      {
                        title: "Contextual Discovery",
                        text: "Shoppers connect with scents through experiential moments rather than static displays or online text.",
                      },
                      {
                        title: "The Articulation Gap",
                        text: "Consumers lack the specific olfactory vocabulary to accurately describe their tastes.",
                      },
                      {
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
                        <h4
                          className="classic-display text-3xl md:text-4xl leading-tight mb-4"
                          style={{ color: accentColor }}
                        >
                          {p.title}
                        </h4>
                        <p className="text-[var(--cl-text-muted)] leading-relaxed max-w-[26rem]">
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
                          "Users receive a scent-based personality profile defined by keywords, moods, and style (e.g., “The Warm Idealist”).",
                        image: "/image/eaudetoi/image/outcome03.png",
                      },
                    ].map((s, i) => (
                      <motion.div
                        key={s.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl overflow-hidden bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)] flex flex-col"
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
                          <h4 className="mt-4 text-lg font-bold text-[var(--cl-ink)] leading-snug tracking-tight">
                            {s.title}
                          </h4>
                          <p className="mt-3 text-sm text-[var(--cl-text-soft)] leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Section: Service Blueprint & User Journey */}
                <motion.section
                  id="blueprint"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 border-t-section scroll-mt-32"
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
                          alt: "Eau de Toi service blueprint, frontstage to backstage",
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
                        text: "A customer views a window display or scans a QR code (“I’m curious about the fragrance personality test”) and follows aisle signage to the booth.",
                      },
                      {
                        title: "Discovery",
                        text: "The user takes the recommendation quiz on the booth’s interactive screen. Backstage, the system processes the scent profile and mood mapping, routing recommendations to the booth and the sales associate’s terminal.",
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
                        <div
                          className="h-px w-10 mb-4"
                          style={{ background: accentColor }}
                        />
                        <h4
                          className="classic-label text-sm uppercase tracking-[0.22em] mb-3"
                          style={{ color: accentColor }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-[var(--cl-ink-a85)] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </motion.section>

                {/* Section: Prototyping & Testing */}
                <motion.section
                  id="prototype"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-40 pt-16 border-t-section scroll-mt-32"
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
                            "We tested a post-experience email containing the user’s scent personality results and fragrance education.",
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
                          alt="Orange Data Mining, KNN / Naive Bayes analysis of Fragrantica dataset"
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
                          <p className="text-lg text-[var(--cl-ink)] leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.section>

                {/* Section: Business Viability */}
                <motion.section
                  id="business"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-16 pt-16 border-t-section scroll-mt-32"
                >
                  <NarrativeBlock
                    title="BUSINESS VIABILITY"
                    content="Is replacing retail shelf space with a digital booth worth the investment?"
                    accentColor={accentColor}
                  />

                  {/* The ledger (2026-07-19 rework, her call: the loose stat rows
                      read scattered): cost and return stand as two panels in the
                      same surface register as every other card, so the question in
                      the heading is answered by one balanced spread. Copy and
                      numbers verbatim. */}
                  <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="p-8 md:p-10 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                    >
                      <p
                        className="font-mono text-xs uppercase tracking-[0.2em] mb-8"
                        style={{ color: "var(--cl-text-muted)" }}
                      >
                        The Cost
                      </p>
                      <div className="flex flex-wrap items-end gap-x-5 gap-y-6">
                        <div>
                          <div
                            className="classic-display text-5xl lg:text-6xl tracking-tight leading-none mb-3"
                            style={{ color: mutedStat }}
                          >
                            2.94%
                          </div>
                          <div className="classic-label text-xs uppercase tracking-widest text-[var(--cl-ink)]">
                            Display units removed
                          </div>
                        </div>
                        <div
                          className="classic-display text-4xl lg:text-5xl leading-none pb-6"
                          style={{ color: mutedStat, opacity: 0.6 }}
                          aria-hidden
                        >
                          &asymp;
                        </div>
                        <div>
                          <div
                            className="classic-display text-5xl lg:text-6xl tracking-tight leading-none mb-3"
                            style={{ color: mutedStat }}
                          >
                            0.29%
                          </div>
                          <div className="classic-label text-xs uppercase tracking-widest text-[var(--cl-ink)]">
                            Passive revenue drop
                          </div>
                        </div>
                      </div>
                      <p className="mt-8 text-sm text-[var(--cl-text-soft)] leading-relaxed">
                        Dedicating floor space to the booth removes 2.94% of displayed units, resulting in a marginal 0.29% drop in passive revenue.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="p-8 md:p-10 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                    >
                      <p
                        className="font-mono text-xs uppercase tracking-[0.2em] mb-8"
                        style={{ color: accentColor }}
                      >
                        The Return
                      </p>
                      <div className="grid grid-cols-2 gap-x-6">
                        <div>
                          <div
                            className="classic-display text-5xl lg:text-6xl tracking-tight leading-none mb-3"
                            style={{ color: accentColor }}
                          >
                            90%
                          </div>
                          <div className="classic-label text-xs uppercase tracking-widest text-[var(--cl-ink)]">
                            User Desirability
                          </div>
                        </div>
                        <div>
                          <div
                            className="classic-display text-5xl lg:text-6xl tracking-tight leading-none mb-3"
                            style={{ color: accentColor }}
                          >
                            +1%
                          </div>
                          <div className="classic-label text-xs uppercase tracking-widest text-[var(--cl-ink)]">
                            Conversion lift to break even
                          </div>
                        </div>
                      </div>
                      <p className="mt-8 text-sm text-[var(--cl-text-soft)] leading-relaxed">
                        An overwhelming majority of tested shoppers perceived the guided, multisensory experience as highly desirable and confidence-building. Because user confidence is so high, even a mere 1% increase in conversion through the booth entirely balances the lost shelf revenue. Anything beyond 1% is pure scalable profit.
                      </p>
                    </motion.div>
                  </div>

                  {/* Final Recommendations for Retailers */}
                  <div className="mt-16">
                    <p
                      className="classic-label text-xs uppercase tracking-[0.25em] mb-8"
                      style={{ color: accentColor }}
                    >
                      Final Recommendations for Retailers
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          n: "01",
                          title: "Placement",
                          text: "Place the booth outside the store to actively attract business, turning passing foot traffic into curiosity-driven visits.",
                        },
                        {
                          n: "02",
                          title: "Delivery Channel",
                          text: "Deliver samples through a technical solution, vending machines, sample machines, or embedded scent tiles, to improve user comfort.",
                        },
                        {
                          n: "03",
                          title: "Evolution",
                          text: "Develop “scent personality evolution” to explore how the system builds up user detail over time, post-experience personalization is essential for continued retention.",
                        },
                      ].map((rec, i) => (
                        <motion.div
                          key={rec.n}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                        >
                          <span
                            className="font-mono text-xs tracking-[0.2em]"
                            style={{ color: accentColor }}
                          >
                            {rec.n}
                          </span>
                          <h4 className="mt-3 text-lg font-bold text-[var(--cl-ink)] mb-3 leading-snug">
                            {rec.title}
                          </h4>
                          <p className="text-[var(--cl-text-soft)] leading-relaxed text-sm">
                            {rec.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>
          </div>

          {/* Cream → parchment from final visual + takeaway through Next project + footer */}
          <div className="project-detail-tail-fade w-full">
            <div className="w-full px-6 md:px-12 lg:px-24 pt-0 pb-48">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                <div className="hidden lg:block lg:col-span-3" aria-hidden />
                <div className="lg:col-span-9">
                  <div className="border-t-section pt-16 space-y-16">
                    {/* Outcome — closing stat with breathing room */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <p
                        className="classic-label text-xs uppercase tracking-[0.25em] mb-10"
                        style={{ color: accentColor }}
                      >
                        The Outcome
                      </p>
                      <div
                        className="classic-display text-7xl md:text-8xl leading-none mb-10"
                        style={{ color: accentColor }}
                      >
                        90%
                      </div>
                      <p className="text-lg md:text-xl text-[var(--cl-ink)] leading-relaxed max-w-2xl">
                        of testers perceived the service to be desirable, validating that guided discovery significantly enhances user confidence in a fragrance purchase decision.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden"
                    >
                      <Image
                        src="/image/eaudetoi/image/edthome01.webp"
                        alt="Eau de Toi final hero shot, booth on the retail floor"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 75vw, 100vw"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="p-8 rounded-xl bg-[var(--cl-surface-2)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)] border-l-4"
                      style={{ borderLeftColor: accentColor }}
                    >
                      <p className="classic-display text-[var(--cl-ink)] leading-relaxed text-lg italic">
                        &ldquo;In a crowded retail environment, the key to driving conversion isn&apos;t offering more choices, it&apos;s offering clarity. Eau de Toi reimagines fragrance shopping as a moment of self-discovery, turning passive browsing into decisive, joyful purchases.&rdquo;
                      </p>
                    </motion.div>

                    {/* Closing "breath" — poetic signature tagline */}
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="classic-display pt-8 text-center text-2xl md:text-3xl lg:text-4xl italic leading-snug tracking-wide"
                      style={{ color: accentColor }}
                    >
                      Step in. Breathe in. Discover your scent personality.
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-6 md:px-12 lg:px-24">
              <div id="next-project-start" className="border-t-section-next pt-16">
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
          </div>
        </main>
      </div>
    </ProjectThemeProvider>
  )
}
