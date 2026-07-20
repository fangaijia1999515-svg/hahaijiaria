"use client"

/**
 * PROOF LAB — /v2/lab/proof only. ROUND 5 per her call (2026-07-06):
 * the long spanning image is dead. Screen 2 stands on its OWN full-screen
 * background (her grass-hills image, sky cropped away), and the motion has
 * to level up past "ordinary reveals". Three award-grade choreographies:
 *   1  READING LIGHT   the manifesto is read by your scroll: every word
 *                      starts faint and fills to full cream, word by word
 *   2  KINETIC LOCKUP  Objects / Systems / Software at massive scale slide
 *                      in from alternating sides and stack into a lockup
 *   3  INLINE WORLDS   one editorial sentence with small landscape windows
 *                      embedded between the words, unfolding as you scroll
 * All pinned scrubs; CSS default = readable end states (no-JS / reduced).
 */
import { useRef } from "react"
import { gsap, SplitText, useGSAP } from "@/lib/gsap"

export function ProofLab() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      /* ---- DEMO 1 · READING LIGHT — scroll reads the manifesto ------------ */
      const fillEl = document.querySelector(".pl7-fill__text")
      if (fillEl) {
        const words = SplitText.create(fillEl, { type: "words" }).words
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: ".pl7-fill",
              start: "top top",
              end: "+=190%",
              pin: true,
              scrub: 0.4,
            },
          }
        )
      }

      /* ---- DEMO 2 · KINETIC LOCKUP — giant words find their place ---------
         AD-sharpened: bigger offsets, eased (non-linear) arrivals so words
         overlap in flight with different weights, Software lands last and
         slowest as the climax; notes and signature reveal by clip wipe
         (authored) instead of drifting fades (default). */
      gsap.set(".pl7-row--1 .pl7-row__word", { xPercent: -64 })
      gsap.set(".pl7-row--2 .pl7-row__word", { xPercent: 58 })
      gsap.set(".pl7-row--3 .pl7-row__word", { xPercent: -88 })
      gsap.set(".pl7-row__note", { clipPath: "inset(0 100% 0 0)" })
      gsap.set(".pl7-kinetic__lead", { autoAlpha: 0 })
      gsap.set(".pl7-kinetic__sig", { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" })
      const kin = gsap.timeline({
        scrollTrigger: {
          trigger: ".pl7-kinetic",
          start: "top top",
          end: "+=230%",
          pin: true,
          scrub: 0.5,
        },
      })
      kin
        .to(".pl7-kinetic__lead", { autoAlpha: 1, duration: 0.1, ease: "none" })
        .to(".pl7-row--1 .pl7-row__word", { xPercent: 0, duration: 0.3, ease: "power3.out" }, ">-0.02")
        .to(".pl7-row--1 .pl7-row__note", { clipPath: "inset(0 0% 0 0)", duration: 0.1, ease: "none" }, ">-0.04")
        .to(".pl7-row--2 .pl7-row__word", { xPercent: 0, duration: 0.3, ease: "power3.out" }, ">-0.22")
        .to(".pl7-row--2 .pl7-row__note", { clipPath: "inset(0 0% 0 0)", duration: 0.1, ease: "none" }, ">-0.04")
        .to(".pl7-row--3 .pl7-row__word", { xPercent: 0, duration: 0.5, ease: "power3.out" }, ">-0.22")
        .to(".pl7-row--3 .pl7-row__note", { clipPath: "inset(0 0% 0 0)", duration: 0.1, ease: "none" }, ">-0.04")
        .to(".pl7-kinetic__sig", { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 0.16, ease: "none" }, ">0.04")
        .to({}, { duration: 0.22 })

      /* ---- DEMO 3 · INLINE WORLDS — a sentence with windows in it --------- */
      const inlineEl = document.querySelector(".pl7-inline__text")
      if (inlineEl) {
        const words = SplitText.create(inlineEl, {
          type: "words",
          // keep each media chip as ONE unit so it never splits
          ignore: ".pl7-chip",
        }).words
        gsap.set(".pl7-chip", { scaleX: 0.12, scaleY: 0.6, autoAlpha: 0 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".pl7-inline",
            start: "top top",
            end: "+=190%",
            pin: true,
            scrub: 0.4,
          },
        })
        tl.fromTo(
          words,
          { opacity: 0.16 },
          { opacity: 1, stagger: 0.05, ease: "none" },
          0
        )
        document.querySelectorAll(".pl7-chip").forEach((chip, i) => {
          tl.to(chip, { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: 0.16, ease: "none" },
            0.16 + i * 0.3)
        })
        tl.to({}, { duration: 0.18 })
      }
    },
    { scope: rootRef }
  )

  return (
    <div className="pl" ref={rootRef}>
      <section className="pl-intro">
        <p className="ds-overline pl-intro__over">Statement lab · screen two · round five</p>
        <h1 className="pl-intro__title">Its own ground, sharper motion.</h1>
        <p className="pl-intro__body">
          Screen 2 stands on her grass hills, sky cropped away, separate from
          the hero. Three choreographies: your scroll reads the manifesto word
          by word, three giant words slide into a lockup, and one sentence
          carries small windows of the world inside it.
        </p>
      </section>

      <p className="pl-label"><span>Demo 1</span> Reading light · the scroll reads the manifesto</p>
      <section className="pl7-scene pl7-fill">
        <div className="pl7-scene__bg" aria-hidden="true" />
        <div className="pl7-scene__shade" aria-hidden="true" />
        <div className="pl7-scene__inner">
          <p className="ds-overline pl7-over">The claim</p>
          <p className="pl7-fill__text">
            Software is losing its senses. Speed without warmth, screens
            without weight. I came from <em>industrial objects</em> and
            <em> service systems</em>, and I make AI products that keep
            their senses: calm, tactile, alive. <em>Designed to feel. Built to ship.</em>
          </p>
        </div>
      </section>

      <p className="pl-label"><span>Demo 2</span> Kinetic lockup · three words find their place</p>
      <section className="pl7-scene pl7-kinetic">
        <div className="pl7-scene__bg" aria-hidden="true" />
        <div className="pl7-scene__shade" aria-hidden="true" />
        <div className="pl7-scene__inner pl7-kinetic__inner">
          <p className="ds-overline pl7-kinetic__lead">Software is losing its senses.</p>
          <div className="pl7-row pl7-row--1">
            <span className="pl7-row__word">Objects</span>
            <span className="pl7-row__note">Pratt · industrial design</span>
          </div>
          <div className="pl7-row pl7-row--2">
            <span className="pl7-row__word pl7-row__word--it">Systems</span>
            <span className="pl7-row__note">SCAD · service design</span>
          </div>
          <div className="pl7-row pl7-row--3">
            <span className="pl7-row__word">Software</span>
            <span className="pl7-row__note">AI-native · designed and built by me</span>
          </div>
          <p className="pl7-kinetic__sig">
            Aijia Fang · AI-native product designer, Santa Clara
          </p>
        </div>
      </section>

      <p className="pl-label"><span>Demo 3</span> Inline worlds · a sentence with windows in it</p>
      <section className="pl7-scene pl7-inline">
        <div className="pl7-scene__bg" aria-hidden="true" />
        <div className="pl7-scene__shade" aria-hidden="true" />
        <div className="pl7-scene__inner">
          <p className="ds-overline pl7-over">About me</p>
          <p className="pl7-inline__text">
            I design products
            <span className="pl7-chip"><span className="pl7-chip__img pl7-chip__img--a" /></span>
            that feel made, services
            <span className="pl7-chip"><span className="pl7-chip__img pl7-chip__img--b" /></span>
            that hold people, and I write the software
            <span className="pl7-chip"><span className="pl7-chip__img pl7-chip__img--c" /></span>
            that ships them.
          </p>
        </div>
      </section>
    </div>
  )
}
