export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  year: string
  client?: string
}

export type ThemeColor = "yellow" | "pink" | "green" | "blue" | "purple"

export const themeColorValues: Record<ThemeColor, string> = {
  yellow: "#FFC973",
  pink: "#FF9992",
  green: "#7AFEA7",
  blue: "#96C1FF",
  purple: "#E692FF",
}

// Project-to-color mapping following Yellow -> Green -> Blue -> Pink cycle
export const projectThemeColors: Record<string, ThemeColor> = {
  skya: "purple",
  nuzzle: "green",
  "eau-de-toi": "blue",
  "equine-therapy": "yellow",
  wellbeings: "pink",
  "coming-soon": "green",
}

export function getProjectThemeColor(projectId: string): string {
  const theme = projectThemeColors[projectId]
  if (theme) {
    return themeColorValues[theme]
  }
  // Default fallback to green
  return themeColorValues.green
}

export const allProjects: Project[] = [
  {
    id: "skya",
    title: "Skya",
    description: "A smart urban logistics system using autonomous vehicles and mobile lockers to streamline last-mile delivery.",
    tags: ["Systems Thinking", "Mobility"],
    image: "/image/skya/heroshot.webp",
    year: "2025",
  },
  {
    id: "nuzzle",
    title: "Nuzzle",
    description: "A service design ecosystem that strengthens long-term pet–owner bonds through compatibility-based adoption.",
    tags: ["Service Design", "Social Impact"],
    image: "/image/Nuzzle/hero2.webp",
    year: "2025",
  },
  {
    id: "eau-de-toi",
    title: "Eau De Toi",
    description: "A multisensory retail experience combining AI personality insights with immersive spatial design to reveal one's unique scent.",
    tags: ["Experience Design", "Retail"],
    image: "/image/eaudetoi/image/edthome01.webp",
    year: "2025",
  },
  {
    id: "equine-therapy",
    title: "Equine Therapy",
    description: "A holistic therapeutic framework connecting patients, therapists, and nature to support mental health recovery.",
    tags: ["Service Ecology", "Wellness"],
    image: "/placeholder.svg",
    year: "2024",
  },
  {
    id: "wellbeings",
    title: "WellBeings",
    description: "An integrated support network that simplifies U.S. healthcare and empowers international students to access care confidently.",
    tags: ["User Research", "Healthcare"],
    image: "/placeholder.svg",
    year: "2024",
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    description: "A new initiative currently in development. Stay tuned for the next breakthrough in human-centered service experiences.",
    tags: ["In Progress", "Confidential"],
    image: "/placeholder.svg",
    year: "2026",
  },
]

// Featured projects for homepage (only 3)
export const featuredProjects = allProjects.slice(0, 3)

// Helper function to get project URL
export function getProjectUrl(projectId: string): string {
  return `/work/${projectId}`
}

// Helper function to get next project with looping
// Only cycles through live/featured projects (Skya -> Nuzzle -> Eau de Toi -> Skya...)
// so we don't surface placeholder/unreleased projects in the "Next" CTA.
export function getNextProject(currentSlug: string): { title: string; href: string; image: string } {
  const list = featuredProjects
  const currentIndex = list.findIndex((p) => p.id === currentSlug)
  const nextIndex = currentIndex === -1 || currentIndex >= list.length - 1 ? 0 : currentIndex + 1
  const nextProject = list[nextIndex]

  return {
    title: nextProject.title,
    href: getProjectUrl(nextProject.id),
    image: nextProject.image,
  }
}
