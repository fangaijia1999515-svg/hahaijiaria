export interface Experiment {
  id: string
  title: string
  /** Short line under the title */
  subtitle: string
  description: string
  href: string
  tags: string[]
  accentColor: string
  year: string
  /** Optional hero image under /public — add later without touching the component */
  image?: string
  /** CSS gradient when no image is set */
  placeholderGradient: string
}

export const experiments: Experiment[] = [
  {
    id: "forest-intercept",
    title: "Forest Intercept",
    subtitle: "Episode 01 · 30-second anime short",
    description:
      "End-to-end AI production: character design, forest world-building, two pipelines (shot-by-shot vs. continuous segments), directed with Claude Code as co-pilot.",
    href: "https://aijiafangshortdrama.netlify.app/",
    tags: ["AI Direction", "Video", "Agent Workflow"],
    accentColor: "#96C1FF",
    year: "2026",
    placeholderGradient:
      "linear-gradient(145deg, #0a1628 0%, #1a3a5c 45%, #2d1f3d 100%)",
  },
  {
    id: "birthday-invitation",
    title: "Open With Love",
    subtitle: "A birthday trip invitation",
    description:
      "A bilingual, scroll-driven micro-site for a two-day Sonoma getaway: itinerary, weather, map, and small surprises, built with AI-assisted coding.",
    href: "https://to-mingze-open-with-love.netlify.app/",
    tags: ["Vibe Coding", "Micro-site", "Narrative UX"],
    accentColor: "#FF9992",
    year: "2026",
    placeholderGradient:
      "linear-gradient(145deg, #2a1810 0%, #4a2820 40%, #1e1510 100%)",
  },
]
