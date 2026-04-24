"use client"

import type React from "react"

/**
 * Page transitions (overlay + eased scrolling) are now orchestrated by
 * <TransitionProvider> in `lib/transition-context.tsx`. This component is kept
 * as a thin passthrough so existing layouts that wrap with <PageTransition>
 * keep working, but it no longer performs any side-effects of its own.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
