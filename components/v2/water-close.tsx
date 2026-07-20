"use client"
/**
 * WATER CLOSE — the homepage footer on real water (her call 2026-07-10:
 * "真的放在主页的下面,不是 demo"). Her looping top-down water video carries
 * the ripple sim; the close content sits ABOVE the surface as DOM (the
 * ink-in-water experiment was rejected — words stay on the water, not under
 * it). Monument arrangement = the footer=1 layout she shortlisted.
 * SignatureClose in story.tsx stays dormant for an instant revert; the water
 * base is her v3 cream-sand video — swapping to v1/static is one line.
 * The sim only mounts when the section approaches the viewport (perf).
 */
import { useEffect, useRef, useState } from "react"
import { WaterRipple } from "@/app/lab/water/water-ripple"
import { WaterFooterMock } from "@/app/lab/water/footer-mock"
import "@/app/lab/water/water.css"

const WATER_VIDEO = "/video/lab/water-v3.mp4"

export function WaterClose() {
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* mount ONCE on first approach and stay mounted — unmount/remount cycles
       poisoned the GL context (the 首页水不动 bug, 2026-07-10) */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section
      ref={ref}
      id="contact"
      data-chapter="5"
      className="water-page v2-waterclose"
      /* full viewport again (her 2026-07-19 call, superseding the 07-10 76svh:
         after Area of Expertise the footer should arrive as a FULL screen,
         with no idle cream band above it) */
      style={{ position: "relative", zIndex: 6, height: "100svh" }}
    >
      {near && <WaterRipple videoSrc={WATER_VIDEO} showLabel={false} />}
      {/* her pick 2026-07-19: at full viewport the MONUMENT layout (variant 1,
          everything on the centerline) reads intentional where the editorial
          split read empty; the sunken-mark idea was rejected (icon too big). */}
      <WaterFooterMock variant={1} />
    </section>
  )
}
