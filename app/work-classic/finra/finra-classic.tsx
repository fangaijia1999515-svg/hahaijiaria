"use client"

/**
 * FINRA × SCADpro — the real-client case (Summer 2025).
 * Rebuilt 2026-08-21 to the bay-area-design-hiring-manager verdict:
 * artifacts before process, outputs before inputs, her hand before the
 * honesty caveat. Facts verified against the five deliverable PDFs; the
 * NDA boundary lives in .claude/finra-案例页交接.md. The four deliverables
 * ran IN PARALLEL off one research push (her correction, 2026-08-21).
 * The one process diagram left is the parallel-streams truth.
 */

import { useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { ContextSidebar } from "@/components/case-study/context-sidebar"
import { ImpactDashboard } from "@/components/case-study/impact-dashboard"
import { NarrativeBlock } from "@/components/case-study/narrative-block"
import { NextProject } from "@/components/case-study/next-project"
import { ZoomableImage } from "@/components/zoomable-image"
import { ProjectThemeProvider, type ClassicStage } from "@/lib/theme-context"
import { getNextProject } from "@/lib/projects"
import { ParallelStreamsDiagram } from "./finra-diagrams"

const ACCENT_LIGHT = "#3D4A3A"
const ACCENT_DARK = "#9CAF88"

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "shipped", label: "Shipped" },
  { id: "audit", label: "The Audit" },
  { id: "strategy", label: "The Strategy" },
  { id: "systems", label: "Library + Toolkit" },
  { id: "role", label: "My Part" },
  { id: "takeaway", label: "Takeaway" },
]

/* The four "Areas of Focus", verbatim from the Brand and Identity Audit. */
const FOCUS_CARDS = [
  {
    label: "Communication",
    quote: "Clear, human centered communication instead of heavy compliance language.",
  },
  {
    label: "Cohesion",
    quote: "A more unified digital experience that doesn't feel scattered or inconsistent.",
  },
  {
    label: "Visibility",
    quote: "Better public visibility, so people know what FINRA does before running into a problem.",
  },
  {
    label: "Accessibility",
    quote: "Accessibility for everyone, including multilingual and senior users.",
  },
]

/* The three toolkit concepts — the "operations, not assets" answer. The
   mockups are CROPPED out of the report pages (her call: the page-in-a-page
   version was illegibly small), so the UI itself fills the frame. */
const CONCEPTS = [
  {
    name: "Ready-to-go Design Portal",
    line: "One searchable home for every template and asset, filtered by team and task. Nobody rebuilds a deck from scratch, nobody ships an off-brand one.",
    src: "/image/finra/toolkit-portal-ui.webp",
    ratio: [2400, 1935] as const,
    caption: "From the shipped asset library concept",
    alt: "Brand asset library portal mockup with filters by position, asset type and usage context",
  },
  {
    name: "Transparent Feedback Loop",
    line: "A shared calendar where feedback has a deadline and a red dot, so review stops living in inboxes and brand decisions stop stalling.",
    src: "/image/finra/toolkit-feedback-loop-ui.webp",
    ratio: [2400, 1572] as const,
    caption: "From the shipped toolkit",
    alt: "Calendar system mockup where red dots mark events that still need feedback",
  },
  {
    name: "Kickoff Kard",
    line: "A one-card starter that hands any new project or new hire the brand essentials on day one: assets, guidelines, how-to, quick links, a person to ask.",
    src: "/image/finra/toolkit-kickoff-kard-ui.webp",
    ratio: [1600, 1485] as const,
    caption: "From the shipped toolkit",
    alt: "Project Kickoff Kard mockup: a titled card listing brand assets, guidelines, how-to, quick links and support",
  },
]

function ArtifactFrame({
  src, caption, alt, accentColor, ratio = [2000, 1125] as const,
}: {
  src: string; caption: string; alt: string; accentColor: string
  ratio?: readonly [number, number]
}) {
  return (
    <figure>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative bg-[var(--cl-mat)] rounded-2xl shadow-lg overflow-hidden"
      >
        <ZoomableImage src={src} alt={alt} cursorColor={accentColor}>
          <Image src={src} alt={alt} width={ratio[0]} height={ratio[1]} className="w-full h-auto" />
        </ZoomableImage>
      </motion.div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--cl-text-muted)]">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function FinraClassicPage({ stage = "light" }: { stage?: ClassicStage }) {
  const accentColor = stage === "dark" ? ACCENT_DARK : ACCENT_LIGHT
  const nextProject = getNextProject("finra")
  const nextHref =
    nextProject.href.replace("/work/", "/work-classic/") +
    (stage === "dark" ? "?stage=dark" : "")

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cursor-reset"))

    const updateSidebarPosition = () => {
      const sidebar = document.getElementById("sidebar-contents") as HTMLElement
      const nextProjectStart = document.getElementById("next-project-start")
      if (!sidebar || !nextProjectStart) return
      const sidebarRect = sidebar.getBoundingClientRect()
      const nextProjectTop = nextProjectStart.getBoundingClientRect().top
      if (sidebarRect.bottom >= nextProjectTop - 24) {
        const maxTop = nextProjectTop - sidebarRect.height - 24
        sidebar.style.top = `${Math.max(96, maxTop)}px`
      } else {
        sidebar.style.top = ""
      }
    }

    const nextProjectStart = document.getElementById("next-project-start")
    if (nextProjectStart) {
      const observer = new IntersectionObserver(() => updateSidebarPosition(), { threshold: 0 })
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

  useEffect(() => {
    const main = document.querySelector("main")
    if (main) {
      main.style.opacity = "1"
      main.style.visibility = "visible"
    }
  }, [])

  return (
    <ProjectThemeProvider projectId="finra" stage={stage}>
      <main style={{ opacity: 1, visibility: "visible" }}>
        <Navigation />

        {/* Global Header — EdT's exact grammar: title + one-liner left, the
            NDA marker right where EdT carries its award links, baselines
            aligned by items-end (her call, 2026-08-21). */}
        <div id="overview" className="scroll-mt-32">
          <header className="pt-32 pb-2 px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
              <div className="lg:col-span-8">
                <motion.h1
                  initial={{ opacity: 1, y: 0 }}
                  className="classic-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-3 text-[var(--cl-ink)]"
                >
                  FINRA × SCADpro
                </motion.h1>
                <motion.p
                  initial={{ opacity: 1, y: 0 }}
                  className="text-base md:text-lg lg:text-xl leading-tight max-w-3xl text-[var(--cl-text-muted)]"
                >
                  A SCADpro collaboration with FINRA, the regulator of every U.S. broker-dealer: a nineteen-person team auditing the brand and building the system that keeps it consistent.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3"
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: accentColor }}
                >
                  Client work · under NDA
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--cl-text-muted)]">
                  Selected materials shown
                </p>
              </motion.div>
            </div>
          </header>
        </div>

        {/* Hero: the final presentation's own cover — the FINRA × SCADpro
            lockup, exactly as the client saw it. Same frame geometry as
            Nuzzle and EdT. */}
        <div className="w-full px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            className="w-full aspect-[21/9] bg-muted rounded-2xl overflow-hidden mt-8 mb-16 relative cl-hero-media"
          >
            <Image
              src="/image/finra/deck-cover.webp"
              alt="Final presentation cover: FINRA × SCADpro lockup on deep navy"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="w-full px-6 md:px-12 lg:px-24 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
            <div className="lg:col-span-3">
              <ContextSidebar
                role="Service Designer"
                timeline="10 Weeks · Summer 2025"
                team="19 people · 10 disciplines"
                tools={[
                  "Stakeholder Interviews",
                  "Touchpoint Audit",
                  "Service Blueprinting",
                  "Figma",
                ]}
                accentColor={accentColor}
                sections={SECTIONS}
              />
            </div>

            <div className="lg:col-span-9">
              {/* ─ Overview ─ */}
              <motion.section initial={{ opacity: 1, y: 0 }} className="mb-40 pt-20">
                <ImpactDashboard
                  metrics={[
                    { value: "4", label: "Deliverables", detail: "Shipped together in week ten" },
                    { value: "3", label: "Audiences", detail: "Member firms, regulators, investors" },
                    { value: "19", label: "On the team", detail: "Ten disciplines, one studio lead" },
                  ]}
                  accentColor={accentColor}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-16">
                  <div className="lg:col-span-4">
                    <NarrativeBlock
                      title="The Client"
                      content="FINRA is the organization that regulates U.S. broker-dealers. Its brand lives across an enormous surface: public sites, investor education, member-facing portals, social channels, print. No single person could see all of it at once, which was exactly the problem."
                      accentColor={accentColor}
                    />
                  </div>
                  <div className="lg:col-span-8">
                    <NarrativeBlock
                      title="The Brief"
                      content="Build a flexible, cohesive system for applying the FINRA brand consistently across every digital and physical touchpoint, and hand it to the people who will run it."
                      accentColor={accentColor}
                    />
                    <ArtifactFrame
                      src="/image/finra/deck-the-ask.webp"
                      caption="Final presentation · the ask"
                      alt="Presentation slide: FINRA came to the SCADpro team with a request to evaluate its digital experiences and uncover opportunities to re-imagine the strategy and approach for its audiences"
                      accentColor={accentColor}
                    />
                  </div>
                </div>

              </motion.section>

              {/* ─ Shipped ─ */}
              <motion.section
                id="shipped"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="What We Shipped"
                  content="One research push, four deliverables built in parallel, one handoff: a brand and identity audit, a digital brand experience strategy, a brand asset library, and an internal communications toolkit. The research fed all four at once; nothing waited its turn."
                  accentColor={accentColor}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-4 p-6 md:p-10 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                >
                  <ParallelStreamsDiagram accentColor={accentColor} />
                </motion.div>
              </motion.section>

              {/* ─ Deliverable 1: the Audit ─ */}
              <motion.section
                id="audit"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="The Audit · What We Found"
                  content="The first deliverable read the brand as it stands, from every public touchpoint to how peer regulators present themselves. It closes on four areas of focus: what FINRA's brand needs most, in our own words. Accessibility ended up shaping everything downstream."
                  accentColor={accentColor}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FOCUS_CARDS.map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="p-8 rounded-xl bg-[var(--cl-surface)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)]"
                    >
                      <h4 className="classic-label text-sm uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
                        {c.label}
                      </h4>
                      <p className="classic-display text-lg md:text-xl italic text-[var(--cl-ink)] leading-relaxed">
                        "{c.quote}"
                      </p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <ArtifactFrame
                    src="/image/finra/audit-benchmark.webp"
                    caption="FINRA benchmarked against FDIC, MSRB and CME Group across 14 attributes"
                    alt="Competitor benchmark page from the shipped audit: FINRA scored against FDIC, MSRB and CME Group on fourteen performance attributes"
                    accentColor={accentColor}
                  />
                  <ArtifactFrame
                    src="/image/finra/audit-recommendations.webp"
                    caption="Visual infrastructure recommendations, from the audit"
                    alt="Recommendations summary page with seven visual-infrastructure recommendation cards"
                    accentColor={accentColor}
                  />
                </div>
              </motion.section>

              {/* ─ Deliverable 2: the Strategy ─ */}
              <motion.section
                id="strategy"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="The Strategy · What We Recommended"
                  content="The second deliverable turns those findings into direction for the whole digital experience: how FINRA.com should be structured and voiced, and how every social channel around it should behave. For the website we argued three things: the value proposition belongs above the fold, one voice should carry across every page, and the narrative needs a clear hierarchy."
                  accentColor={accentColor}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <ArtifactFrame
                    src="/image/finra/strategy-web-narrative.webp"
                    caption="Brand narrative and messaging for FINRA.com, annotated"
                    alt="Annotated FINRA.com homepage recommendation: value proposition above the fold, highlighted hero section"
                    accentColor={accentColor}
                    ratio={[2400, 1350]}
                  />
                  <ArtifactFrame
                    src="/image/finra/strategy-web-recs.webp"
                    caption="Content recommendations for the website"
                    alt="Content recommendations summary: clarify value proposition above the fold, consistent voice and tone, narrative hierarchy"
                    accentColor={accentColor}
                    ratio={[2400, 1350]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <ArtifactFrame
                    src="/image/finra/strategy-ux-recommendations.webp"
                    caption="UX audit recommendations, accessibility included"
                    alt="UX audit recommendations summary page, including the accessibility recommendation"
                    accentColor={accentColor}
                  />
                  <ArtifactFrame
                    src="/image/finra/strategy-social-recs.webp"
                    caption="Cross-platform social media recommendations"
                    alt="Cross-platform social media recommendations summary: social media management, storytelling campaigns, content calendar"
                    accentColor={accentColor}
                    ratio={[2400, 1350]}
                  />
                </div>
              </motion.section>

              {/* ─ Deliverables 3 + 4: the Asset Library and the Toolkit ─ */}
              <motion.section
                id="systems"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="The Asset Library and the Toolkit"
                  content="The last two deliverables answer the audit's hardest finding: consistency broke not because assets were missing, but because no one owned the moment of use. So neither one is a logo sheet. They are operating machinery: a portal that serves as the asset library's front door, and a toolkit that keeps feedback and kickoffs on brand."
                  accentColor={accentColor}
                />
                <div className="mt-12 space-y-16">
                  {CONCEPTS.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                    >
                      <div className="lg:col-span-4">
                        <p className="classic-label text-sm uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>
                          {`0${i + 1}`}
                        </p>
                        <h4 className="classic-display text-3xl md:text-4xl text-[var(--cl-ink)] mb-4">{c.name}</h4>
                        <p className="text-[var(--cl-ink)] leading-relaxed">{c.line}</p>
                      </div>
                      <div className="lg:col-span-8">
                        {/* one shared aspect for all three (her call): the
                            Feedback Loop crop's ratio; taller crops cover-crop
                            from the top so title bands stay visible */}
                        <div className="relative aspect-[2400/1572] bg-[var(--cl-mat)] rounded-2xl overflow-hidden shadow-lg">
                          <ZoomableImage src={c.src!} alt={c.alt} cursorColor={accentColor} className="h-full">
                            <Image src={c.src!} alt={c.alt} fill className="object-cover object-top" />
                          </ZoomableImage>
                        </div>
                        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--cl-text-muted)]">
                          {c.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* ─ My Part ─ */}
              <motion.section
                id="role"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock
                  title="My Part"
                  content="One of the team's service designers, starting in the regulator track. For the audit I built user journey maps, service blueprints, and personas, the pages that chart how FINRA works on the inside, which is exactly why they stay off this page. I also carried a share of the website audit."
                  accentColor={accentColor}
                />
                <NarrativeBlock
                  content="Most of my hands-on time went into the internal communications toolkit. When the team re-formed around deliverables after phase one, I moved with it, carrying research into synthesis and synthesis into production. On an engagement this size, that range is the job."
                  accentColor={accentColor}
                />
                {/* the team and the room, side by side (her call, 2026-08-21):
                    the deck's own team page next to her photo from the brand
                    diagnostics workshop. No captions; both speak for themselves. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-video bg-[var(--cl-mat)] rounded-2xl overflow-hidden shadow-lg"
                  >
                    <ZoomableImage
                      src="/image/finra/deck-team.webp"
                      alt="Meet the team page from the final presentation: nineteen people across ten disciplines, including Aijia Fang, Service Design"
                      cursorColor={accentColor}
                      className="h-full"
                    >
                      <Image src="/image/finra/deck-team.webp" alt="" fill className="object-cover" />
                    </ZoomableImage>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 }}
                    className="relative aspect-video bg-[var(--cl-mat)] rounded-2xl overflow-hidden shadow-lg"
                  >
                    <ZoomableImage
                      src="/image/finra/team-workshop.webp"
                      alt="The team at the brand diagnostics workshop, working through the What If exercise on the wall"
                      cursorColor={accentColor}
                      className="h-full"
                    >
                      <Image src="/image/finra/team-workshop.webp" alt="" fill className="object-cover" />
                    </ZoomableImage>
                  </motion.div>
                </div>
              </motion.section>

              {/* ─ Takeaway ─ */}
              <motion.section
                id="takeaway"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-40 scroll-mt-32"
              >
                <NarrativeBlock title="What I Took From It" content="" accentColor={accentColor} />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl bg-[var(--cl-surface-2)] shadow-[inset_0_0_0_1px_var(--cl-well-ring)] border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  <p className="classic-display text-[var(--cl-ink)] leading-relaxed text-lg italic">
                    "A studio brief holds still. A client brief moves: scope shifts, access is partial, the team re-forms mid-project. FINRA taught me to find the through-line anyway, to reconstruct what can be observed, to be precise about what can't, and to keep the work honest about which is which."
                  </p>
                </motion.div>
              </motion.section>
            </div>
          </div>
        </div>

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
