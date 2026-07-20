import type Lenis from "lenis"

// Module-level singleton so non-React code (page transitions, anchor scroll
// helpers) can drive the same Lenis instance the provider creates.
let instance: Lenis | null = null

export function setLenis(l: Lenis | null) {
  instance = l
}

export function getLenis(): Lenis | null {
  return instance
}
