"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { CoreCapabilities } from "@/components/core-capabilities"
import { Footer } from "@/components/footer"
import { IntroLoader } from "@/components/intros/IntroLoader"

const INTRO_SHOWN_KEY = "intro-loader-shown"

export default function Home() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem(INTRO_SHOWN_KEY)
    if (hasSeenIntro === "true") {
      // Skip intro if already shown
      setShowContent(true)
    }
  }, [])

  return (
    <div
      className="min-h-screen"
      style={{
        // Vertical gradient across the whole page:
        //   0 — 100vh     = hero color (#1B1309), matches <HeroSection> bg seamlessly
        //   100vh — 200vh = gentle transition into the secondary brown (#1E1510)
        //   200vh — 100%  = linear fade from #1E1510 down to near-black #030201 at the footer
        background:
          "linear-gradient(to bottom, #1B1309 0, #1B1309 100vh, #1E1510 200vh, #030201 100%)",
      }}
    >
      {!showContent && (
        <IntroLoader
          onComplete={() => {
            // Mark intro as shown in localStorage
            localStorage.setItem(INTRO_SHOWN_KEY, "true")
            setShowContent(true)
          }}
        />
      )}

      {showContent && (
        <div className="relative z-10">
          <main className="relative">
            <Navigation />
            <HeroSection />
            <BentoGrid />
            <ExperienceTimeline />
            <CoreCapabilities />
            <Footer />
          </main>
        </div>
      )}
    </div>
  )
}
