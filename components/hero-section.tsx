"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

import { cn } from "@/lib/utils"

const videoPopClass = "brightness-[1.12] contrast-[1.06] saturate-[1.08]"

type Clip = {
  src: string
  /** 框的宽高比 w/h（按参考图每朵花的框形比例） */
  aspectRatio: number
  /** 占花簇容器宽度的百分比 */
  widthPct: number
  /** 花中心相对花簇容器的 x% */
  cx: number
  /** 花中心相对花簇容器的 y% */
  cy: number
  rotate?: number
  z?: number
  hero?: boolean
  /** 视频容器周围有较多空气时，用 blend 让暗色空气消失 */
  blend?: "lighten"
  /**
   * 该视频在容器内水平方向花朵外的"空气"占容器宽度的百分比，
   * overlay 从容器左右缘的 section bg 色渐变到这个位置的 transparent，
   * 刚好覆盖空气、不盖花瓣
   */
  edgeH: number
  /** 同上，垂直方向空气占容器高度的百分比 */
  edgeV: number
  /** 该朵花的 accent 色，用于 custom cursor 变色 */
  accentColor: string
}

const HERO_BG = "#1B1309"

/**
 * 五朵花以蓝色（cx=50%）为中心左右对称分布，
 * 粉和绿都紧贴蓝约 1cm 距离，画面成一簇紧凑花朵。
 */
const HERO_CLIPS: Clip[] = [
  {
    src: "/home/video/purpleflower.webm",
    aspectRatio: 4 / 3,
    widthPct: 32,
    cx: 35.3,
    cy: 10.13,
    rotate: 0,
    z: 3,
    edgeH: 5,
    edgeV: 20,
    accentColor: "#E692FF",
  },
  {
    src: "/home/video/yellowflower.webm",
    aspectRatio: 1,
    widthPct: 23,
    cx: 72.3,
    cy: 13.85,
    rotate: 0,
    z: 4,
    edgeH: 7.5,
    edgeV: 7.5,
    accentColor: "#FFC973",
  },
  {
    src: "/home/video/pinkflower01.webm",
    aspectRatio: 1.035,
    widthPct: 26,
    cx: 15,
    cy: 58.76,
    rotate: 0,
    z: 3,
    edgeH: 7.5,
    edgeV: 3.4,
    accentColor: "#FF9992",
  },
  {
    src: "/home/video/greenflower.webm",
    aspectRatio: 1,
    widthPct: 18,
    cx: 83.5,
    cy: 65,
    rotate: 20,
    z: 3,
    edgeH: 7.5,
    edgeV: 7.5,
    accentColor: "#7AFEA7",
  },
  {
    src: "/home/video/floeflower2.webm",
    aspectRatio: 1.4,
    widthPct: 44,
    cx: 50,
    cy: 65,
    rotate: 0,
    z: 2,
    hero: true,
    edgeH: 7.5,
    edgeV: 5.4,
    accentColor: "#96C1FF",
  },
]

function FlowerFrame({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleEnter = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }

  const handleLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${clip.cx}%`,
        top: `${clip.cy}%`,
        width: `${clip.widthPct}%`,
        aspectRatio: clip.aspectRatio.toString(),
        transform: `translate(-50%, -50%) rotate(${clip.rotate ?? 0}deg)`,
        zIndex: clip.z ?? 1,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor-hover
      data-cursor-color={clip.accentColor}
      data-cursor-no-magnet
    >
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center",
          videoPopClass,
          clip.hero && "brightness-[1.16] saturate-[1.12]",
        )}
        style={clip.blend ? { mixBlendMode: clip.blend } : undefined}
        src={clip.src}
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${HERO_BG}, transparent ${clip.edgeH}%, transparent ${100 - clip.edgeH}%, ${HERO_BG}), linear-gradient(to bottom, ${HERO_BG}, transparent ${clip.edgeV}%, transparent ${100 - clip.edgeV}%, ${HERO_BG})`,
        }}
      />
    </div>
  )
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden px-3 pb-6 pt-20 md:px-8 md:pb-10"
      style={{ backgroundColor: HERO_BG }}
    >
      {/* 花簇：完全按参考图比例 866:437 ≈ 1.98:1，宽度占屏幕约 96% */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[13%] z-0 flex justify-center px-2 sm:bottom-[14%]"
      >
        <div
          className="relative"
          style={{
            width: "min(96vw, calc(76vh * 866 / 437), 1480px)",
            aspectRatio: "866 / 437",
          }}
        >
          {HERO_CLIPS.map((clip) => (
            <FlowerFrame key={clip.src} clip={clip} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(26%,220px)] bg-gradient-to-t from-[#1B1309] from-[5%] via-[#1B1309]/90 to-transparent sm:h-[min(24%,200px)]"
        aria-hidden
      />

      <div className="pointer-events-none relative z-10 mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col justify-end pb-3 text-center md:pb-4">
        {/* Name - display sans, medium weight, neon color-cycle (matches top-left nav) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[40px] font-medium leading-[0.95] tracking-tight text-[#F3E3CE] sm:text-5xl md:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
          }}
        >
          Aijia Fang
        </motion.h1>

        {/* Tagline - three skill tokens separated by soft dots, sits lower */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F3E3CE]/60 sm:mt-6 sm:text-[11px] sm:tracking-[0.34em] md:mt-7 md:tracking-[0.38em]"
        >
          UX Research
          <span className="mx-2 text-[#F3E3CE]/25" aria-hidden>
            ·
          </span>
          Service Design
          <span className="mx-2 text-[#F3E3CE]/25" aria-hidden>
            ·
          </span>
          Systems Thinking
        </motion.p>
      </div>
    </section>
  )
}
