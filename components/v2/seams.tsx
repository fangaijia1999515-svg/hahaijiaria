"use client"

/**
 * GALLERY SEAM — the ONE surviving seam bridge (final cleanup 2026-07-19).
 * ---------------------------------------------------------------------------
 * The separately-approved statement -> gallery dissolve: a GradualBlur that
 * melts the work-lead dune photo's top edge as the gallery pins in, dissolving
 * against the statement's cream tail. It rests at opacity 0 (v2.css) and is
 * opacity-scrubbed in and back out by WorkGallery, so a resting page is
 * pixel-pristine (doctrine v3: a transition only HAPPENS while you turn).
 * DO NOT RETUNE — these are the approved values, kept byte-for-byte.
 *
 * The seam 1-6 hero->statement experiments (blur bands, mist, edge melts,
 * exposure grade, pinned crossfade) were rejected and deleted 2026-07-19;
 * the settled hero->statement transition is the 换季 ground-colour glide in
 * statement.tsx. History: scratchpad backups + memory.
 */
import { GradualBlur } from "@/components/v2/gradual-blur"

const GALLERY_BLUR = {
  position: "top", strength: 2.0, divCount: 6,
  height: "clamp(80px, 12svh, 150px)", zIndex: 4,
} as const

export function GallerySeamBlur() {
  return (
    <GradualBlur
      className="v2-seam-blur--gallery-top"
      position={GALLERY_BLUR.position}
      strength={GALLERY_BLUR.strength}
      divCount={GALLERY_BLUR.divCount}
      height={GALLERY_BLUR.height}
      zIndex={GALLERY_BLUR.zIndex}
      curve="bezier"
      exponential
    />
  )
}
