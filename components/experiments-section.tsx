"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { experiments } from "@/lib/experiments"
import { ArrowCue } from "./arrow-cue"
import { CritPanel } from "./crit-panel"

const EASE = [0.22, 1, 0.36, 1] as const

export function ExperimentsSection() {
  return (
    <section
      id="experiments"
      className="border-t-section relative w-full scroll-mt-20 py-[clamp(96px,14vh,176px)]"
    >
      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 md:mb-14"
        >
          <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--accent)]">
            Built with agents
          </span>
          <h2 className="font-display text-[clamp(30px,4.4vw,56px)] font-bold leading-[0.95] tracking-[-0.025em] text-[var(--cream)] mb-4">
            I ship the tools, not just the prototypes
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-[56ch] leading-relaxed">
            <span className="text-[var(--foreground)]">Crit</span>, a UI
            critique tool I built. Exact WCAG contrast math, spacing rhythm, and
            an AI-slop checklist. No model, no upload. Try a sample.
          </p>
        </motion.div>

        {/* The live tool */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16 md:mb-24"
        >
          <CritPanel />
        </motion.div>

        {/* Supporting experiments — sit directly under the single heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {experiments.map((exp, index) => (
            <motion.a
              key={exp.id}
              href={exp.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
              data-cursor-hover
              className="group relative block overflow-hidden rounded-2xl border border-[var(--hairline)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                {exp.image ? (
                  <Image
                    src={exp.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ background: exp.placeholderGradient }}
                  />
                )}

                {/* single gradient for legibility */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 100%)",
                  }}
                />

                {/* ONE affordance: corner arrow cue, accent on hover */}
                <span className="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                  <ArrowCue />
                </span>

                {/* focal: title + one meta line */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h3 className="font-display font-bold tracking-[-0.02em] text-white text-2xl md:text-3xl leading-tight mb-2">
                    {exp.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.16em] font-mono text-white/60">
                    {exp.tags.map((tag, i) => (
                      <span key={tag} className="flex items-center gap-2">
                        <span>{tag}</span>
                        {i < exp.tags.length - 1 && <span className="opacity-35">/</span>}
                      </span>
                    ))}
                    <span className="ml-auto text-white/45">{exp.year}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
