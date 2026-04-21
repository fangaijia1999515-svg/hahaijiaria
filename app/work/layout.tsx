import type React from "react"
import { ChameleonProvider } from "@/lib/chameleon-context"

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ChameleonProvider>{children}</ChameleonProvider>
}
