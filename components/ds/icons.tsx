/**
 * DS ICON SET — her component sheet's social + UI icon rows.
 * Clean, standard glyphs (lucide geometry). currentColor + 1.5px stroke,
 * 24px grid, round caps — refined line style, on-grid, no distortion.
 */
import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 22, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...rest}
    >
      {children}
    </svg>
  )
}

/* ---- UI action icons ---- */
export const IconArrowRight = (p: IconProps) => <Svg {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Svg>
export const IconSearch = (p: IconProps) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Svg>
export const IconMenu = (p: IconProps) => <Svg {...p}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></Svg>
export const IconClose = (p: IconProps) => <Svg {...p}><path d="M6 6l12 12" /><path d="M18 6 6 18" /></Svg>
export const IconPlus = (p: IconProps) => <Svg {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Svg>
export const IconExternal = (p: IconProps) => <Svg {...p}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></Svg>
export const IconDownload = (p: IconProps) => <Svg {...p}><path d="M12 3v12" /><path d="m7 12 5 5 5-5" /><path d="M5 21h14" /></Svg>
/* clean lucide heart — no distortion */
export const IconHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 9.5a5.5 5.5 0 0 1 9.6-3.7.55.55 0 0 0 .8 0A5.5 5.5 0 0 1 22 9.5c0 2.3-1.5 4-3 5.5l-5.5 5.3a2 2 0 0 1-3 0L5 15c-1.5-1.5-3-3.2-3-5.5Z" />
  </Svg>
)

/* ---- Social icons (she uses Instagram + LinkedIn) ---- */
export const IconInstagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)
export const IconLinkedIn = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 8a5 5 0 0 1 5 5v6h-3.5v-6a1.5 1.5 0 0 0-3 0v6H11v-9h3.5v1.2A4 4 0 0 1 16 8Z" />
    <path d="M3.5 9H7v10H3.5z" />
    <circle cx="5.25" cy="5.25" r="1.6" />
  </Svg>
)

export const socialIcons = [
  { name: "Instagram", Icon: IconInstagram },
  { name: "LinkedIn", Icon: IconLinkedIn },
] as const

export const uiIcons = [
  { name: "Search", Icon: IconSearch },
  { name: "Menu", Icon: IconMenu },
  { name: "Close", Icon: IconClose },
  { name: "Plus", Icon: IconPlus },
  { name: "Arrow", Icon: IconArrowRight },
  { name: "External", Icon: IconExternal },
  { name: "Download", Icon: IconDownload },
  { name: "Like", Icon: IconHeart },
] as const

/* alias kept for back-compat */
export const IconArrowUpRight = IconExternal
