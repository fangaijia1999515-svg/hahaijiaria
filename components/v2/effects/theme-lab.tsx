"use client"
/**
 * /v2/lab/theme — SIGNATURE THEME LAB v2 (isolated test route, 2026-07-06)
 * ---------------------------------------------------------------------------
 * Her feedback on v1: isolated effect swatches read as "线条/圆圈", she could
 * not picture the future site. v2 = THE SAME SCREEN-2 CONTENT (her verbatim
 * manifesto + evidence numbers) rendered THREE times, once per candidate
 * theme, full-viewport, scroll-driven. Compare like-for-like, pick one.
 *
 *   V1 THE TRACE      线稿成境  the green survey line draws the screen
 *   V2 STILL WATER    静水之下  waterline axis; evidence surfaces from the reflection
 *   V3 MIST TO MATTER 雾中成形  everything resolves from mist; green = made
 *
 * Robust pattern: CSS default = finished state; GSAP branch sets initial
 * states then scrubs. Sticky-viewport sections (no pin-spacer pitfalls).
 * Spec: reference-analysis/SIGNATURE-THEME-PROPOSALS.md
 */
import { useRef } from "react"
import { gsap, SplitText, useGSAP } from "@/lib/gsap"

const P1 = (
  <>
    I design for the moment a person and a product click, where something
    complicated starts to feel simple, and even <em>beautiful.</em>
  </>
)
const P2 =
  "I bring taste, a service designer's instinct for the real problem, and the ability to build what I imagine with AI, not just mock it up. Idea, to strategy, to a working thing."
const CREDS =
  "Trained at Pratt and SCAD. Recognized by the Indigo Design Awards and the International Design Awards."

const STATS = [
  { n: 4, label: "international honors" },
  { n: 3, label: "shipped service projects" },
  { n: 2, label: "AI apps in build" },
]

function StatRows({ prefix }: { prefix: string }) {
  return (
    <dl className={`tv-stats ${prefix}-stats`}>
      {STATS.map((s) => (
        <div className="tv-stat" key={s.label}>
          <dt className={`tv-stat__n ${prefix}-stat__n`} data-n={s.n}>
            {String(s.n).padStart(2, "0")}
          </dt>
          <dd className="tv-stat__label">{s.label}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ThemeLab() {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrubTL = (trigger: string) =>
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.45,
            },
          })

        const counters = (selector: string, tl: gsap.core.Timeline, at: number, dur = 0.2) => {
          gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
            const target = Number(el.dataset.n || "0")
            const obj = { v: 0 }
            tl.to(
              obj,
              {
                v: target,
                duration: dur,
                snap: { v: 1 },
                onUpdate: () => {
                  el.textContent = String(Math.round(obj.v)).padStart(2, "0")
                },
              },
              at + i * 0.04
            )
          })
        }

        /* ================================================= V1 THE TRACE */
        {
          gsap.set(".tv1-over, .tv1-p2, .tv1-creds-text, .tv1-exit-text", { autoAlpha: 0 })
          gsap.set(".tv1-rule, .tv1-creds-rule", { scaleX: 0, transformOrigin: "0 50%" })
          // negative offset = the stroke reveals from the path's START (left),
          // like a surveyor walking the land; 1.005 kills the endpoint nib
          gsap.set(".tv1-valley__path", { strokeDashoffset: -1.005 })
          gsap.set(".tv1-valley__pt", { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" })
          gsap.set(".tv1-valley__cap", { autoAlpha: 0 })
          gsap.set(".tv1-exit-line", { scaleX: 0, transformOrigin: "100% 50%" })
          gsap.set(".tv1-p2", { clipPath: "inset(0% 0% 100% 0%)" })
          gsap.set(".tv1-creds-text", { clipPath: "inset(0 100% 0 0)" })

          const lead = rootRef.current?.querySelector(".tv1-p1")
          let words: Element[] = []
          if (lead) {
            const split = SplitText.create(lead, { type: "words" })
            words = split.words
            gsap.set(words, { color: "var(--ds-taupe-ghost)" })
          }

          const tl = scrubTL(".tv1")
          tl.to(".tv1-over", { autoAlpha: 1, duration: 0.04 }, 0.01)
            .to(".tv1-rule", { scaleX: 1, duration: 0.08 }, 0.02)
          if (words.length) {
            tl.to(words, { color: "var(--ds-text)", stagger: 0.28 / words.length, duration: 0.05 }, 0.1)
          }
          tl.to(".tv1-p2", { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 0.1 }, 0.42)
            .to(".tv1-creds-rule", { scaleX: 1, duration: 0.05 }, 0.52)
            .to(".tv1-creds-text", { clipPath: "inset(0 0% 0 0)", autoAlpha: 1, duration: 0.09 }, 0.56)
            .to(".tv1-valley__path", { strokeDashoffset: 0, duration: 0.28 }, 0.6)
            .to(".tv1-valley__pt", { autoAlpha: 1, scale: 1, duration: 0.04, stagger: 0.05 }, 0.72)
            .to(".tv1-valley__cap", { autoAlpha: 1, duration: 0.05 }, 0.86)
          tl.to(".tv1-exit-line", { scaleX: 1, duration: 0.05 }, 0.92)
            .to(".tv1-exit-text", { autoAlpha: 1, duration: 0.05 }, 0.95)
        }

        /* ================================================ V2 STILL WATER */
        {
          gsap.set(".tv2-waterline", { scaleX: 0, transformOrigin: "0 50%" })
          gsap.set(".tv2-p1wrap", { y: 90, filter: "blur(7px)", opacity: 0.25 })
          gsap.set(".tv2-p2", { autoAlpha: 0, y: 16 })
          gsap.set(".tv2-reflection", { filter: "blur(10px)", opacity: 0.3 })
          gsap.set(".tv2-deep", { autoAlpha: 0, y: 12 })
          gsap.set(".tv2-ring", { scale: 0, opacity: 0 })

          const tl = scrubTL(".tv2")
          tl.to(".tv2-waterline", { scaleX: 1, duration: 0.08 }, 0.02)
            // the manifesto SURFACES: rises from below the line and settles still
            .to(".tv2-p1wrap", { y: 0, filter: "blur(0px)", opacity: 1, duration: 0.26, ease: "power1.out" }, 0.08)
            .to(".tv2-p2", { autoAlpha: 1, y: 0, duration: 0.1 }, 0.34)
            // a drop lands mid-read: three offset rings cross the seam, the
            // reflection trembles then re-stills
            .to(".tv2-ring--1", { scale: 10, opacity: 0, duration: 0.16, startAt: { scale: 0, opacity: 0.8 } }, 0.4)
            .to(".tv2-ring--2", { scale: 7, opacity: 0, duration: 0.14, startAt: { scale: 0, opacity: 0.55 } }, 0.44)
            .to(".tv2-ring--3", { scale: 4.6, opacity: 0, duration: 0.12, startAt: { scale: 0, opacity: 0.35 } }, 0.48)
            .to(".tv2-reflection", { filter: "blur(13px)", duration: 0.05 }, 0.42)
            // the water stills, and the truth below sharpens into evidence
            .to(".tv2-reflection", { filter: "blur(2px)", opacity: 0.7, duration: 0.24 }, 0.5)
            .to(".tv2-deep", { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.05 }, 0.62)
          counters(".tv2-stat__n", tl, 0.66, 0.16)

          // click anywhere on the stage = one extra drop (plain rAF, not scrubbed)
          const stage = rootRef.current?.querySelector(".tv2-stage")
          stage?.addEventListener("click", () => {
            gsap.utils.toArray<HTMLElement>(".tv2-ring").forEach((r, i) => {
              gsap.fromTo(
                r,
                { scale: 0, opacity: 0.8 - i * 0.22 },
                { scale: 10 - i * 2.6, opacity: 0, duration: 1.3 + i * 0.2, ease: "power2.out", overwrite: true, delay: i * 0.12 }
              )
            })
            gsap.fromTo(
              ".tv2-reflection",
              { filter: "blur(12px)" },
              { filter: "blur(2px)", duration: 1.6, ease: "power2.out", overwrite: "auto" }
            )
          })
        }

        /* ============================================= V3 MIST TO MATTER */
        {
          gsap.set(".tv3-p1", { filter: "blur(15px)", opacity: 0.3, scale: 1.015 })
          gsap.set(".tv3-p1 em", { color: "var(--ds-taupe-ghost)" })
          gsap.set(".tv3-p2, .tv3-creds", { filter: "blur(9px)", opacity: 0.25 })
          gsap.set(".tv3-stats", { filter: "blur(9px)", opacity: 0.25 })
          gsap.set(".tv3-stat__n", { color: "var(--ds-taupe-ghost)" })
          gsap.set(".tv3-exit", { autoAlpha: 0 })

          const tl = scrubTL(".tv3")
          tl.to(".tv3-p1", { filter: "blur(0px)", opacity: 1, scale: 1, duration: 0.3 }, 0.06)
            // the accent inks green only once fully resolved: green = made
            .to(".tv3-p1 em", { color: "var(--ds-accent)", duration: 0.06 }, 0.38)
            .to(".tv3-p2", { filter: "blur(0px)", opacity: 1, duration: 0.16 }, 0.4)
            .to(".tv3-creds", { filter: "blur(0px)", opacity: 1, duration: 0.14 }, 0.52)
            .to(".tv3-stats", { filter: "blur(0px)", opacity: 1, duration: 0.18 }, 0.62)
          counters(".tv3-stat__n", tl, 0.64, 0.18)
          tl.to(".tv3-stat__n", { color: "var(--ds-accent)", duration: 0.06 }, 0.84)
            .to(".tv3-exit", { autoAlpha: 1, duration: 0.05 }, 0.92)
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="tl-root">
      {/* ------------------------------------------------------ intro */}
      <header className="tl-head">
        <p className="ds-overline tl-head__over">Theme lab v2 · 签名主题挑选</p>
        <h1 className="tl-head__title">
          同一个第二屏。<span>三种主题，滚着对比。</span>
        </h1>
        <p className="tl-head__note">
          下面是三版完整尺寸的第二屏预览：文案、数字完全相同（都是你的原话和真实数据），
          只有主题语言不同。哪一版的世界你想住进去，全站就说哪种语言。
        </p>
      </header>

      {/* ================================================ V1 THE TRACE */}
      <section className="tv tv1" id="trace">
        <div className="tv-sticky">
          <span className="tv-tag">V1 · The Trace 线稿成境 · 绿线测绘世界，真实灌入线稿（美学总监推荐）</span>
          <div className="tv1-grid">
            <div className="tv1-toprow">
              <p className="ds-overline tv1-over">About</p>
              <span className="tv1-rule" aria-hidden="true" />
            </div>

            <p className="tv1-p1 tv-p1">{P1}</p>

            <p className="tv1-p2 tv-p2">{P2}</p>

            <p className="tv1-creds">
              <span className="tv1-creds-rule" aria-hidden="true" />
              <span className="tv1-creds-text">{CREDS}</span>
            </p>

            <div className="tv1-valleywrap" aria-hidden="false">
              <svg className="tv1-valley" viewBox="0 0 1240 190" fill="none" preserveAspectRatio="xMidYMid meet">
                <path
                  className="tv1-valley__path"
                  pathLength={1}
                  d="M0 128 C 150 108, 250 52, 405 70 C 550 87, 630 132, 770 124 C 900 116, 1010 74, 1120 82 C 1165 85, 1205 96, 1240 102"
                />
                <g className="tv1-valley__pt" transform="translate(405 70)">
                  <circle r="3.5" />
                  <line x1="0" y1="-7" x2="0" y2="7" />
                </g>
                <g className="tv1-valley__pt" transform="translate(770 124)">
                  <circle r="3.5" />
                  <line x1="0" y1="-7" x2="0" y2="7" />
                </g>
                <g className="tv1-valley__pt" transform="translate(1120 82)">
                  <circle r="3.5" />
                  <line x1="0" y1="-7" x2="0" y2="7" />
                </g>
                <g className="tv1-valley__cap">
                  <text x="405" y="46" textAnchor="middle">04 HONORS</text>
                  <text x="770" y="158" textAnchor="middle">03 SHIPPED</text>
                  <text x="1120" y="58" textAnchor="middle">02 IN BUILD</text>
                </g>
              </svg>
            </div>

            <p className="tv1-exit tv-exit">
              <span className="tv1-exit-line" aria-hidden="true" />
              <span className="tv1-exit-text">Selected work ↓</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================== V2 STILL WATER */}
      <section className="tv tv2" id="water">
        <div className="tv-sticky">
          <span className="tv-tag">V2 · Still Water 静水之下 · 体验浮出水面，证据沉在倒影里（点击水面有涟漪）</span>
          <div className="tv2-stage">
            <div className="tv2-above">
              <p className="ds-overline">About</p>
              <div className="tv2-p1wrap">
                <p className="tv2-p1 tv-p1">{P1}</p>
              </div>
              <p className="tv2-p2 tv-p2">{P2}</p>
            </div>

            <div className="tv2-line" aria-hidden="true">
              <span className="tv2-waterline" />
              <span className="tv2-ring tv2-ring--1" />
              <span className="tv2-ring tv2-ring--2" />
              <span className="tv2-ring tv2-ring--3" />
            </div>

            <div className="tv2-below">
              <div className="tv2-reflection" aria-hidden="true">
                <p className="tv-p1">{P1}</p>
              </div>
              <div className="tv2-deepwrap">
                <p className="tv2-deep tv2-deep--creds">{CREDS}</p>
                <div className="tv2-deep">
                  <StatRows prefix="tv2" />
                </div>
                <p className="tv2-deep tv-exit tv2-exit">Selected work ↓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================== V3 MIST TO MATTER */}
      <section className="tv tv3" id="mist">
        <div className="tv-sticky">
          <span className="tv-tag">V3 · Mist to Matter 雾中成形 · 一切从雾里聚焦，绿色只属于已完成</span>
          <div className="tv3-grid">
            <p className="ds-overline tv3-over">About</p>
            <p className="tv3-p1 tv-p1">{P1}</p>
            <p className="tv3-p2 tv-p2">{P2}</p>
            <p className="tv3-creds">{CREDS}</p>
            <div className="tv3-statwrap">
              <StatRows prefix="tv3" />
            </div>
            <p className="tv3-exit tv-exit">Selected work ↓</p>
          </div>
        </div>
      </section>

      <footer className="tl-foot">
        <p className="ds-overline">看完了？</p>
        <p className="tl-foot__note">回到对话里告诉我：1 线稿成境 / 2 静水之下 / 3 雾中成形（可混搭，可打回）。</p>
      </footer>
    </div>
  )
}
