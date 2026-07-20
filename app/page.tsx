import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { BentoGrid } from "@/components/bento-grid"
import { KineticBand } from "@/components/kinetic-band"
import { ExperimentsSection } from "@/components/experiments-section"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { CoreCapabilities } from "@/components/core-capabilities"
import { ParticleBeat } from "@/components/particle-beat"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative z-10">
        <main className="relative">
          <Navigation />
          <HeroSection />
          <BentoGrid />
          <KineticBand />
          <ExperimentsSection />
          <ExperienceTimeline />
          <CoreCapabilities />
          <ParticleBeat />
          <Footer />
        </main>
      </div>
    </div>
  )
}
