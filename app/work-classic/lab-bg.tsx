"use client"
/**
 * LAB BACKGROUND — background candidates rendered UNDER a real classic case
 * page via ?bg=… so she can judge them against her actual content and images
 * (her ask: the sample-block lab was too abstract). Fixed opaque layer at
 * z-0; the page content is stacked above by the page wrapper. Comparison
 * plumbing only; deleted once she picks.
 * lab-demo.css carries the ?glass=... glassmorphism demo styles (nav pill +
 * glass prop cards), scoped under .lab-glass-* wrapper classes the pages set.
 */
import "./lab-demo.css"
import {
  GrainientBg,
  AuroraBg,
  BeamsBg,
  DuneBg,
  DuneSoftBg,
  VeilFirstBg,
  VeilBg,
  VeilNewBg,
  PlasmaBg,
  PlasmaNewBg,
  GridLiveBg,
} from "@/app/lab/bg/flow-effects"

export type LabBgKind =
  | "dune"
  | "dune-soft"
  | "dune-grid"
  | "grainient"
  | "grainient-grid"
  | "aurora"
  | "veil-first"
  | "veil"
  | "veil-new"
  | "plasma"
  | "plasma-new"
  | "beams"
  | "grid"
  | "grid-dots"
  | "grid-blueprint"
  | "grid-live"

/* the radial fade shared by the static grid patterns */
const FADE_MASK = "radial-gradient(130% 95% at 50% 40%, black 60%, transparent 100%)"

/* faint grid laid OVER a shader field (dune-grid / grainient-grid) */
function GridOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(to right, rgba(45,45,45,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.045) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    />
  )
}

export function LabBg({ kind }: { kind: LabBgKind }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#f5f0e8" }}
    >
      {kind === "dune" && <DuneBg />}
      {kind === "dune-soft" && <DuneSoftBg />}
      {kind === "dune-grid" && (
        <>
          <DuneSoftBg />
          <GridOverlay />
        </>
      )}
      {kind === "grainient" && <GrainientBg />}
      {kind === "grainient-grid" && (
        <>
          <GrainientBg />
          <GridOverlay />
        </>
      )}
      {kind === "aurora" && <AuroraBg />}
      {kind === "veil-first" && <VeilFirstBg />}
      {kind === "veil" && <VeilBg />}
      {kind === "veil-new" && <VeilNewBg />}
      {kind === "plasma" && <PlasmaBg />}
      {kind === "plasma-new" && <PlasmaNewBg />}
      {kind === "beams" && <BeamsBg />}
      {kind === "grid" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(45,45,45,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        />
      )}
      {kind === "grid-dots" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(45,45,45,0.10) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        />
      )}
      {kind === "grid-blueprint" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(45,45,45,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.07) 1px, transparent 1px), linear-gradient(to right, rgba(45,45,45,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.035) 1px, transparent 1px)",
            backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        />
      )}
      {kind === "grid-live" && <GridLiveBg />}
    </div>
  )
}
