"use client"

import type React from "react"

import { createContext, useContext, type ReactNode } from "react"

// The classic pages (/work-classic/*) are the only consumers of this provider.
// Re-skinned onto the quiet-luxury system: ONE accent for every project —
// stage-aware (CASE-ANATOMY-SPEC §3): forest green (--ds-accent) on the cream
// stage; sage (--ds-accent-soft) on the dark stage, where forest disappears
// against the warm charcoal.
const DS_ACCENT = "#3D4A3A" // forest — light/cream stage
const DS_ACCENT_DARK = "#9CAF88" // sage — dark stage

export type ClassicStage = "light" | "dark"

interface ThemeContextValue {
  accentColor: string
  projectId: string | null
  stage: ClassicStage
}

const ThemeContext = createContext<ThemeContextValue>({
  accentColor: DS_ACCENT,
  projectId: null,
  stage: "light",
})

export function useThemeColor() {
  return useContext(ThemeContext)
}

interface ProjectThemeProviderProps {
  projectId: string
  /** "dark" renders the same classic layout in the system's dark register
   *  (?stage=dark). Default "light" = the cream stage, unchanged. */
  stage?: ClassicStage
  children: ReactNode
}

export function ProjectThemeProvider({ projectId, stage = "light", children }: ProjectThemeProviderProps) {
  const accentColor = stage === "dark" ? DS_ACCENT_DARK : DS_ACCENT

  return (
    <ThemeContext.Provider value={{ accentColor, projectId, stage }}>
      <div
        // `.classic-stage-dark` remaps the --cl-* palette + nav/footer bridge
        // (classic-ds.css); `.ds-dark` remaps the ds-* semantic tokens (e.g.
        // the solid ds-btn flips to cream-on-charcoal). Light renders exactly
        // as before: no class attribute at all.
        className={stage === "dark" ? "classic-stage-dark ds-dark" : undefined}
        style={
          {
            "--project-accent": accentColor,
            "--project-accent-glow": `${accentColor}40`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
