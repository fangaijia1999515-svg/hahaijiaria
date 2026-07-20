import { ArrowUpRight } from "lucide-react"

/**
 * Unified "clickable" affordance for the whole site.
 *
 * Place inside any element that has the `group` class. On hover, the arrow
 * slides out the top-right and a second one slides in from the bottom-left
 * (the "arrow swap"). One consistent motion everywhere = one design system.
 *
 * `size` is the icon size in px (default 16).
 */
export function ArrowCue({ size = 16, className = "" }: { size?: number; className?: string }) {
  const s = { width: size, height: size }
  const motionCls =
    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden ${className}`}
      style={s}
      aria-hidden="true"
    >
      <ArrowUpRight
        style={s}
        strokeWidth={2}
        className={`${motionCls} group-hover:translate-x-full group-hover:-translate-y-full`}
      />
      <ArrowUpRight
        style={s}
        strokeWidth={2}
        className={`absolute inset-0 -translate-x-full translate-y-full ${motionCls} group-hover:translate-x-0 group-hover:translate-y-0`}
      />
    </span>
  )
}
