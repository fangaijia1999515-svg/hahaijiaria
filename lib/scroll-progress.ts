import { motionValue } from "framer-motion"

/**
 * The ONE scroll clock. `SmoothScroll` drives this from the single Lenis rAF
 * (or a native scroll listener under reduced-motion). Everything that reacts to
 * page scroll — the instrument HUD, the registration grid, ambient effects —
 * reads from here instead of attaching its own scroll listener, so there is
 * exactly one source of truth and one write per frame.
 *
 * `scrollProgress` is 0 at the top of the document, 1 at the bottom.
 * It is also mirrored to `document.documentElement` as `--scroll` for
 * CSS-only consumers.
 */
export const scrollProgress = motionValue(0)
