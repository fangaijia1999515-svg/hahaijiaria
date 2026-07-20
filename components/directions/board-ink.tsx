"use client"

import styles from "./directions.module.css"
import {
  Reveal,
  SectionLabel,
  ColorSystem,
  TypeScaleTable,
  SpacingBlock,
  ComponentsShowcase,
  MotionTokens,
  MaterialRow,
} from "./parts"

export function BoardInk() {
  return (
    <section className={`${styles.panel} ${styles.sysInk}`}>
      <div className={styles.panelInner}>
        {/* head */}
        <Reveal>
          <header className={styles.panelHead}>
            <span className={styles.systemIndex}>System B · Ink &amp; Mist · 水墨</span>
            <h2
              className={styles.systemTitle}
              style={{ fontSize: "clamp(44px,7vw,104px)", fontWeight: 400, fontStyle: "italic" }}
            >
              Ink &amp; <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Mist</em>
            </h2>
            <p className={styles.systemConcept}>
              A lotus surfacing through ink and mist. Not washed-out spa pastels —
              deep celadon and 黛 green, charcoal-teal ink-wash on rice-paper cream,
              a saturated lotus that carries real color. Ethereal float (飘) WITH
              ink depth and 沉淀. rabenrifaie&rsquo;s dream, given gravitas by 水墨.
            </p>
            <div className={styles.moodRow}>
              {["水墨", "Mist", "Celadon", "Lotus", "Weightless-yet-deep"].map((m) => (
                <span className={styles.moodChip} key={m}>{m}</span>
              ))}
            </div>
          </header>
        </Reveal>

        {/* 01 hero — ink-mist backdrop */}
        <Reveal>
          <SectionLabel n="01">Identity · hero vignette</SectionLabel>
          <div
            className={styles.hero}
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(239,231,214,0.55), rgba(239,231,214,0.78)), url(/quiet/ink-mist.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={styles.heroNav}>
              <span className={styles.heroBrand}>Aijia Fang</span>
              <span className={styles.heroNavLinks}>
                <span>Work</span>
                <span>About</span>
                <span>Say hello</span>
              </span>
            </div>
            <h3
              className={styles.heroName}
              style={{ fontSize: "clamp(58px,11vw,146px)", fontWeight: 400, fontStyle: "italic" }}
            >
              Aijia Fang
            </h3>
            <p className={styles.heroTag}>
              Product &amp; service designer and AI-native builder. I design the{" "}
              <em>experience</em> and build what runs behind it.
            </p>
            <div className={styles.ctaRow}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>See the work</button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>Read the crit tool</button>
            </div>
          </div>
        </Reveal>

        {/* 02 color */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="02">Color system · <b>depth, not pastel</b></SectionLabel>
            <ColorSystem
              groups={[
                { name: "Neutral · rice paper", steps: [{ hex: "#EFE7D6" }, { hex: "#E6DBC6" }, { hex: "#DCCDB2" }, { hex: "#CBB994" }] },
                { name: "Primary · celadon / 黛", steps: [{ hex: "#9DB3A4" }, { hex: "#5E7D6F", onDark: true }, { hex: "#3C5A4E", onDark: true }, { hex: "#24413A", onDark: true }] },
                { name: "Ink · charcoal-teal", steps: [{ hex: "#274A42", onDark: true }, { hex: "#1E3A34", onDark: true }, { hex: "#16302B", onDark: true }, { hex: "#0F211D", onDark: true }] },
                { name: "Accent · lotus", steps: [{ hex: "#E7A6B9" }, { hex: "#C85C7E", onDark: true }, { hex: "#A63E62", onDark: true }, { hex: "#7C2A46", onDark: true }] },
              ]}
              semantic={[
                { name: "Page · paper", hex: "#EFE7D6" },
                { name: "Ink / text", hex: "#142C27" },
                { name: "CTA · celadon", hex: "#2E5348" },
                { name: "Accent · lotus", hex: "#C85C7E" },
                { name: "Mist highlight", hex: "#9DB3A4" },
                { name: "Deep 黛", hex: "#24413A" },
              ]}
              usage={[
                { label: "Paper", pct: 60, bg: "#E6DBC6", fg: "#274A42" },
                { label: "Celadon", pct: 30, bg: "#3C5A4E", fg: "#EFE7D6" },
                { label: "Lotus", pct: 6, bg: "#C85C7E", fg: "#2A0E18" },
                { label: "Ink", pct: 4, bg: "#16302B", fg: "#9DB3A4" },
              ]}
            />
          </Reveal>
        </div>

        {/* 03 type */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="03">Type scale · <b>Newsreader</b> display / Figtree body</SectionLabel>
            <TypeScaleTable
              rows={[
                { sample: <em style={{ fontStyle: "italic" }}>Aijia Fang</em>, style: { fontSize: 82, fontWeight: 400 }, role: "Display · italic", detail: "82 / 0 / 400 italic" },
                { sample: <>Selected <em>work</em></>, style: { fontSize: 52, fontWeight: 400 }, role: "H1", detail: "52 / 0 / 400" },
                { sample: "Product & service design", style: { fontSize: 33, fontWeight: 400 }, role: "H2", detail: "33 / 0 / 400" },
                { sample: "A refined serif floats over mist while a soft humanist sans keeps everything readable and calm.", style: { fontSize: 17, fontWeight: 400, color: "var(--ink-2)" }, role: "Body", detail: "17 / 0 / 400 / 1.62", body: true },
                { sample: "無 · 沉淀 · SUBSTANCE UNDERNEATH", style: { fontSize: 12, letterSpacing: "0.18em", fontFamily: "var(--font-label)", color: "var(--ink-3)" }, role: "Label / mono", detail: "12 / +18% / caps", body: true },
              ]}
            />
          </Reveal>
        </div>

        {/* 04 spacing */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="04">Spacing &amp; grid</SectionLabel>
            <SpacingBlock
              steps={[4, 8, 12, 16, 24, 32, 48, 64]}
              gridNote={
                <>
                  <b>Grid:</b> 12-column, 1180px max — but looser, more air than the others.
                  <br />
                  <b>Radii:</b> 16px / 28px — soft, organic, water-worn. Nothing sharp.
                  <br />
                  <b>Elevation:</b> deep, diffuse teal shadow — like looking into a pool.
                  <br />
                  <b>Rhythm:</b> slow. Sections drift apart at 76px+, breathing room over density.
                </>
              }
            />
          </Reveal>
        </div>

        {/* 05 components */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="05">Components · live</SectionLabel>
            <ComponentsShowcase
              brand="Aijia Fang"
              chips={["Product", "Service design", "AI-native", "0 → 1"]}
              inputLabel="Say hello"
              inputPlaceholder="you@studio.com"
              cases={[
                { name: "Nuzzle", tag: "Service system", outcome: "Closed the return cliff", role: "Lead", imgStyle: { background: "radial-gradient(120% 120% at 20% 0%, #9DB3A4, #24413A 72%)" } },
                { name: "Eau De Toi", tag: "Brand · product", outcome: "2026 Indigo Award", role: "Design", imgStyle: { background: "radial-gradient(120% 120% at 80% 10%, #E7A6B9, #7C2A46 78%)" } },
              ]}
            />
          </Reveal>
        </div>

        {/* 06 motion */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="06">Motion</SectionLabel>
            <MotionTokens
              tokens={[
                { k: "Ease · water", v: "cubic-bezier(.22,.61,.24,1)" },
                { k: "Reveal", v: "1100ms · slow rise" },
                { k: "Ambient", v: "mist drift 9s loop" },
                { k: "Ripples", v: "expand 4–5s, staggered" },
                { k: "Signature", v: "“Surfacing”" },
              ]}
              signature={
                <div className={styles.signatureStage}>
                  <span className={styles.surfacePool} />
                  <span className={styles.surfaceRipple} />
                  <span className={styles.surfaceRipple} />
                  <span className={styles.surfaceRipple} />
                  <span className={styles.surfaceBloom} />
                  <span className={styles.signatureName} style={{ color: "var(--gold-2)" }}>
                    Surfacing · the lotus rises, ripples widen
                  </span>
                </div>
              }
            />
          </Reveal>
        </div>

        {/* 07 elements */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="07">Elements · lotus, water &amp; ink</SectionLabel>
            <div className={styles.elementShowcase}>
              <div className={`${styles.elementFrame} ${styles.poolInk}`}>
                <span className={styles.poolMist} />
                <span className={styles.poolRipple} />
                <span className={styles.poolRipple} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.elementImg} src="/quiet/ink-lotus.png" alt="ink-wash lotus water lily" />
                <span className={styles.elementCaption}>Nelumbo · 蓮 — 水墨 lotus</span>
              </div>
              <div>
                <p className={styles.elementNote} style={{ marginBottom: 20 }}>
                  Her water element as the focal point: a{" "}
                  <strong>水墨 lotus</strong> painted in deep celadon and
                  charcoal-teal ink with a saturated lotus-pink heart, floating on a
                  pool with drifting mist and widening ripples. Dreamy but with the
                  ink 沉淀 the pale version was missing. Generated on rice-paper, not
                  a dark-ground render.
                </p>
                <MaterialRow
                  tiles={[
                    { name: "Morning mist", cls: "matMist" },
                    { name: "Ink wash", cls: "matInk" },
                    { name: "Lotus water", cls: "matWater" },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
