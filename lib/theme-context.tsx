"use client"

import type React from "react"

import { createContext, useContext, type ReactNode } from "react"
import { getProjectThemeColor } from "./projects"

interface ThemeContextValue {
  accentColor: string
  projectId: string | null
}

const ThemeContext = createContext<ThemeContextValue>({
  accentColor: "#7AFEA7", // Default green
  projectId: null,
})

export function useThemeColor() {
  return useContext(ThemeContext)
}

interface ProjectThemeProviderProps {
  projectId: string
  children: ReactNode
}

export function ProjectThemeProvider({ projectId, children }: ProjectThemeProviderProps) {
  const accentColor = getProjectThemeColor(projectId)

  return (
    <ThemeContext.Provider value={{ accentColor, projectId }}>
      <div
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
