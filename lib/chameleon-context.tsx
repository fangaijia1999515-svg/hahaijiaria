"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChameleonContextType {
  activeColor: string | null
  setActiveColor: (color: string | null) => void
}

const ChameleonContext = createContext<ChameleonContextType>({
  activeColor: null,
  setActiveColor: () => {},
})

export function ChameleonProvider({ children }: { children: ReactNode }) {
  const [activeColor, setActiveColor] = useState<string | null>(null)

  return <ChameleonContext.Provider value={{ activeColor, setActiveColor }}>{children}</ChameleonContext.Provider>
}

export function useChameleonColor() {
  return useContext(ChameleonContext)
}
