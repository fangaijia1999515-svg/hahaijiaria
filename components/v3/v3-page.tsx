"use client"
/**
 * V3 — "NIGHT MEADOW" (2026-07-07, the unrestricted build)
 * ---------------------------------------------------------------------------
 * Her brief: no limits, judge by monolog / salakhov / trionn / haoqi, /v2
 * stays as the fallback. The concept: "The organic, made digital." performed
 * as a WORLD — her valley at night. Role split (salakhov law):
 *   NIGHT  #0A0F0B  the stage
 *   MOON   #E6EDE3  her voice (type)
 *   LUME   #9EFF5C  the digital: everything alive/interactive glows bio-green
 * The hero is a living point-cloud meadow (scene.tsx); scrolling DIVES the
 * camera through the particles — the organic literally resolving into data —
 * and the site continues in the night world: manifesto read by scroll,
 * monumental counts, stacked work cards, magnetic close.
 */
import { useRef } from "react"
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap"
import { MeadowScene } from "@/components/v3/scene"
import { Magnet } from "@/components/v2/magnet"
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/ds/monogram-path"

const WORK = [
  {
    slug: "skya",
    name: "Skya",
    kind: "Service design",
    line: "An autonomous delivery ecosystem, from vehicle to dispatch to doorstep.",
    stat: "$5.14M",
    cap: "projected year-one revenue",
    img: "/image/skya/heroshot.webp",
    href: "/work/skya",
  },
  {
    slug: "nuzzle",
    name: "Nuzzle",
    kind: "Service system",
    line: "Post-adoption support built around the 30-day return cliff.",
    stat: "50%",
    cap: "of returns happen in the first month",
    img: "/image/Nuzzle/hero2.webp",
    href: "/work/nuzzle",
  },
  {
    slug: "edt",
    name: "Eau de Toi",
    kind: "Experience design",
    line: "An in-store scent-personality journey, screen to shelf.",
    stat: "Awarded",
    cap: "Indigo Design Awards 2026 · IDA 2025",
    img: "/image/eaudetoi/image/edthome01.webp",
    href: "/work/eau-de-toi",
  },
] as const

export function V3Page() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------------- hero: words arrive, then dive away on scroll */
        const heroLead = rootRef.current?.querySelector(".v3-hero__title")
        if (heroLead) {
          const split = SplitText.create(heroLead, { type: "words" })
          gsap.from(split.words, {
            autoAlpha: 0,
            y: 42,
            filter: "blur(10px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.25,
          })
        }
        gsap.from(".v3-hud > *", {
          autoAlpha: 0,
          y: -10,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.9,
        })
        // copy lifts away as the camera dives
        gsap.to(".v3-hero__copy", {
          yPercent: -60,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: ".v3-hero", start: "top top", end: "42% top", scrub: 0.5 },
        })
        gsap.to(".v3-hero__cue", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: ".v3-hero", start: "top top", end: "18% top", scrub: 0.5 },
        })

        /* ------------- statement: the manifesto reads itself in the dark */
        const stmt = rootRef.current?.querySelector(".v3-stmt__lead")
        if (stmt) {
          const split = SplitText.create(stmt, { type: "words" })
          gsap.set(split.words, { opacity: 0.14 })
          gsap.to(split.words, {
            opacity: 1,
            ease: "none",
            stagger: 0.03,
            scrollTrigger: { trigger: ".v3-stmt", start: "top 74%", end: "center 40%", scrub: 0.5 },
          })
        }
        gsap.set(".v3-stmt__em-line", { backgroundSize: "0% 2px" })
        gsap.to(".v3-stmt__em-line", {
          backgroundSize: "100% 2px",
          duration: 0.5,
          ease: "none",
          scrollTrigger: { trigger: ".v3-stmt", start: "center 45%", once: true },
        })

        /* counts: blur-rise + count up */
        gsap.set(".v3-stat", { autoAlpha: 0, y: 30, filter: "blur(8px)" })
        gsap.to(".v3-stat", {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".v3-stmt__stats", start: "top 80%", once: true },
        })
        gsap.utils.toArray<HTMLElement>(".v3-stat__n").forEach((el) => {
          const t = Number(el.dataset.n || "0")
          const obj = { v: 0 }
          gsap.to(obj, {
            v: t,
            duration: 1.2,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => (el.textContent = String(Math.round(obj.v)).padStart(2, "0")),
            scrollTrigger: { trigger: ".v3-stmt__stats", start: "top 80%", once: true },
          })
        })

        /* ------------------------ work: the deck stacks as you descend */
        gsap.utils.toArray<HTMLElement>(".v3-card").forEach((card, i, all) => {
          if (i === all.length - 1) return
          gsap.to(card, {
            scale: 0.93,
            autoAlpha: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: all[i + 1],
              start: "top bottom",
              end: "top top+=96",
              scrub: 0.4,
            },
          })
        })

        /* ------------------------------------------ close: sign the night */
        const closeLead = rootRef.current?.querySelector(".v3-close__title")
        if (closeLead) {
          const split = SplitText.create(closeLead, { type: "words" })
          gsap.from(split.words, {
            autoAlpha: 0,
            y: 36,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: ".v3-close", start: "top 70%", once: true },
          })
        }
        const sig = rootRef.current?.querySelector<SVGPathElement>(".v3-sig path")
        if (sig) {
          const len = sig.getTotalLength()
          gsap.set(sig, { strokeDasharray: len, strokeDashoffset: len })
          gsap.to(sig, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: ".v3-close", start: "top 55%", once: true },
          })
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="v3-root">
      {/* ============================================= HERO · the meadow */}
      <section className="v3-hero">
        <div className="v3-hero__stage">
          <MeadowScene />
          <div className="v3-hud">
            <p className="v3-hud__brand">Aijia Fang<sup>®</sup></p>
            <nav className="v3-hud__nav" aria-label="Primary">
              <a href="#work">Work</a>
              <a href="#about">About</a>
              <a href="#contact" className="v3-hud__talk">Let&apos;s talk</a>
            </nav>
            <p className="v3-hud__geo">Santa Clara · 37.35°N 121.95°W</p>
            <p className="v3-hero__cue v3-hud__cue">Scroll to dive ↓</p>
          </div>
          <div className="v3-hero__copy">
            <p className="v3-hero__over">Product designer · Service designer · AI-native builder</p>
            <h1 className="v3-hero__title">
              The organic, <em>made digital.</em>
            </h1>
            <p className="v3-hero__sub">
              I design the experience, and build the software that runs behind it.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================== STATEMENT · read at night */}
      <section className="v3-stmt" id="about">
        <div className="v3-inner">
          <p className="v3-over">About</p>
          <p className="v3-stmt__lead">
            I design for the moment a person and a product click, where
            something complicated starts to feel simple, and even{" "}
            <em className="v3-stmt__em-line">beautiful.</em>&nbsp;I bring taste, a
            service designer&apos;s instinct for the real problem, and the
            ability to build what I imagine with AI, not just mock it up.
          </p>
          <p className="v3-stmt__creds">
            Trained at Pratt and SCAD. Recognized by the Indigo Design Awards
            and the International Design Awards.
          </p>

          <ul className="v3-stmt__stats">
            <li className="v3-stat">
              <span className="v3-stat__n" data-n="4">00</span>
              <span className="v3-stat__cap">International honors</span>
            </li>
            <li className="v3-stat">
              <span className="v3-stat__n" data-n="3">00</span>
              <span className="v3-stat__cap">Shipped service projects</span>
            </li>
            <li className="v3-stat">
              <span className="v3-stat__n" data-n="2">00</span>
              <span className="v3-stat__cap">AI apps in build</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================ WORK · the deck */}
      <section className="v3-work" id="work">
        <div className="v3-inner">
          <p className="v3-over">Selected work</p>
          <h2 className="v3-work__title">
            Three systems, <em>shipped.</em>
          </h2>
        </div>
        <div className="v3-deck">
          {WORK.map((w, i) => (
            <a className="v3-card" href={w.href} key={w.slug} style={{ top: `${84 + i * 26}px` }}>
              <div className="v3-card__media">
                <img src={w.img} alt={w.name} loading="lazy" />
              </div>
              <div className="v3-card__body">
                <p className="v3-card__kind">{String(i + 1).padStart(2, "0")} · {w.kind}</p>
                <h3 className="v3-card__name">{w.name}</h3>
                <p className="v3-card__line">{w.line}</p>
                <p className="v3-card__stat">
                  <span>{w.stat}</span> {w.cap}
                </p>
                <p className="v3-card__cta">View case →</p>
              </div>
            </a>
          ))}
        </div>
        <div className="v3-inner v3-build">
          <p className="v3-over">Also in build</p>
          <p className="v3-build__row">
            Antara · a live Vedic astrology reader <span className="v3-lume">02 apps</span> ShortDramaStudio · scripts into episodes
          </p>
        </div>
      </section>

      {/* ============================================ CLOSE · sign it */}
      <section className="v3-close" id="contact">
        <div className="v3-inner">
          <p className="v3-over">Contact</p>
          <h2 className="v3-close__title">
            Tell me what <em>you&apos;re building.</em>
          </h2>
          <div className="v3-close__links">
            <Magnet><a href="mailto:hahaijiarah@gmail.com">hahaijiarah@gmail.com</a></Magnet>
            <Magnet><a href="https://www.linkedin.com/in/aijia-fang" target="_blank" rel="noreferrer">LinkedIn</a></Magnet>
            <Magnet><a href="/aijia-fang-resume.pdf" target="_blank">Resume</a></Magnet>
          </div>
          <svg className="v3-sig" viewBox={MONOGRAM_VIEWBOX} aria-hidden="true">
            <path d={MONOGRAM_PATH} fillRule="evenodd" />
          </svg>
          <footer className="v3-footer">
            <span>Aijia Fang · Open to product and service design roles · Bay Area</span>
            <span>© 2026 · Designed and built by Aijia Fang</span>
          </footer>
        </div>
      </section>
    </div>
  )
}
