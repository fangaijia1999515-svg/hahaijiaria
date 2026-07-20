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

export function BoardStudio() {
  return (
    <section className={`${styles.panel} ${styles.sysStudio}`}>
      <div className={styles.panelInner}>
        {/* head */}
        <Reveal>
          <header className={styles.panelHead}>
            <span className={styles.systemIndex}>System C · Studio Modern</span>
            <h2
              className={styles.systemTitle}
              style={{ fontSize: "clamp(38px,6.4vw,92px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em" }}
            >
              Studio Modern
            </h2>
            <p className={styles.systemConcept}>
              A working design studio&rsquo;s identity system. Cream against deep
              espresso blocks, one jewel of jade, a letter-spaced grotesk on a
              structured editorial grid. The most graphic, architectural and
              &ldquo;senior studio&rdquo; of the three — this is the one that reads,
              on sight, as <strong>she designs and she ships</strong>. bymonolog
              met Aimé Leon Doré at Linear-grade rigor.
            </p>
            <div className={styles.moodRow}>
              {["Structured", "Editorial", "Architectural", "High-contrast", "Senior studio"].map((m) => (
                <span className={styles.moodChip} key={m}>{m}</span>
              ))}
            </div>
          </header>
        </Reveal>

        {/* 01 hero — espresso block */}
        <Reveal>
          <SectionLabel n="01">Identity · hero vignette</SectionLabel>
          <div
            className={styles.hero}
            style={{ background: "linear-gradient(180deg, #221b17, #1b1613)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className={styles.heroNav}>
              <span className={styles.heroBrand} style={{ color: "#f4ecdd" }}>Aijia Fang</span>
              <span className={styles.heroNavLinks} style={{ color: "rgba(244,236,221,0.7)" }}>
                <span>Work</span>
                <span>About</span>
                <span>Say hello</span>
              </span>
            </div>
            <h3
              className={styles.heroName}
              style={{ fontSize: "clamp(44px,8.4vw,120px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.01em", color: "#f4ecdd", lineHeight: 0.94 }}
            >
              Aijia Fang
            </h3>
            <p className={styles.heroTag} style={{ color: "rgba(244,236,221,0.78)" }}>
              Product &amp; service designer and AI-native builder. I design the{" "}
              <em style={{ color: "#3E9E86" }}>experience</em> and build what runs
              behind it.
            </p>
            <div className={styles.ctaRow}>
              <button className={`${styles.btn}`} style={{ background: "#f4ecdd", color: "#1b1613" }}>
                See the work
              </button>
              <button className={`${styles.btn}`} style={{ background: "transparent", color: "#f4ecdd", borderColor: "rgba(244,236,221,0.4)" }}>
                Read the crit tool
              </button>
            </div>
          </div>
        </Reveal>

        {/* 02 color */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="02">Color system · <b>cream, espresso, one jade jewel</b></SectionLabel>
            <ColorSystem
              groups={[
                { name: "Neutral · cream", steps: [{ hex: "#F8F2E6" }, { hex: "#F4ECDD" }, { hex: "#EBE0CC" }, { hex: "#E1D4BC" }] },
                { name: "Block · espresso", steps: [{ hex: "#3A3330", onDark: true }, { hex: "#2A2320", onDark: true }, { hex: "#1B1613", onDark: true }, { hex: "#100C0A", onDark: true }] },
                { name: "Jewel · jade", steps: [{ hex: "#3E9E86" }, { hex: "#2E7D6B", onDark: true }, { hex: "#1F4D43", onDark: true }, { hex: "#14332C", onDark: true }] },
                { name: "Metal · sand gold", steps: [{ hex: "#E7CFA2" }, { hex: "#D9B382" }, { hex: "#B98F4A", onDark: true }, { hex: "#8F6C34", onDark: true }] },
              ]}
              semantic={[
                { name: "Page · cream", hex: "#F4ECDD" },
                { name: "Block · espresso", hex: "#1B1613" },
                { name: "Text · charcoal", hex: "#3A3330" },
                { name: "CTA · espresso", hex: "#1B1613" },
                { name: "Jewel · jade", hex: "#1F4D43" },
                { name: "Accent · bright jade", hex: "#3E9E86" },
              ]}
              usage={[
                { label: "Cream", pct: 55, bg: "#F4ECDD", fg: "#3A3330" },
                { label: "Espresso", pct: 30, bg: "#1B1613", fg: "#F4ECDD" },
                { label: "Jade", pct: 10, bg: "#1F4D43", fg: "#EBE0CC" },
                { label: "Sand", pct: 5, bg: "#D9B382", fg: "#1B1613" },
              ]}
            />
          </Reveal>
        </div>

        {/* 03 type */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="03">Type scale · <b>Archivo</b> display / Instrument Sans body</SectionLabel>
            <TypeScaleTable
              rows={[
                { sample: "AIJIA FANG", style: { fontSize: 72, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.01em" }, role: "Display", detail: "72 / +1% / 700 caps" },
                { sample: "SELECTED WORK", style: { fontSize: 44, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }, role: "H1", detail: "44 / +2% / 600 caps" },
                { sample: "Product & service design", style: { fontSize: 32, fontWeight: 600, letterSpacing: "-0.01em" }, role: "H2", detail: "32 / -1% / 600" },
                { sample: "A confident letter-spaced grotesk on a strict grid — structured, architectural, unmistakably a working studio.", style: { fontSize: 16, fontWeight: 400, color: "var(--ink-2)" }, role: "Body", detail: "16 / 0 / 400 / 1.6", body: true },
                { sample: "IDX 01 / ROSA · VENUS", style: { fontSize: 12, letterSpacing: "0.18em", fontFamily: "var(--font-label)", color: "var(--ink-3)" }, role: "Mono index", detail: "12 / +18% / caps", body: true },
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
                  <b>Grid:</b> strict 12-column, visible hairlines and index ticks. Structure is the aesthetic.
                  <br />
                  <b>Radii:</b> 2px / 4px — near-square, architectural, precise.
                  <br />
                  <b>Elevation:</b> minimal; separation comes from espresso blocks and hairlines, not shadow.
                  <br />
                  <b>Rhythm:</b> tight, deliberate; 4px base, everything catalogued and aligned.
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
                { name: "Skya", tag: "Fintech · 0→1", outcome: "$5.14M year one", role: "Lead", imgStyle: { background: "linear-gradient(135deg, #2E7D6B, #14332C)" } },
                { name: "Crit", tag: "Live AI tool", outcome: "Ships today", role: "Build", imgStyle: { background: "linear-gradient(135deg, #2A2320, #1b1613)" } },
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
                { k: "Ease · precise", v: "cubic-bezier(.16,1,.3,1)" },
                { k: "Reveal", v: "460ms · snap in" },
                { k: "Hover", v: "image scale 1.05, jade line" },
                { k: "Grid draw", v: "clip-path reveal, scan" },
                { k: "Signature", v: "“The Index”" },
              ]}
              signature={
                <div className={`${styles.signatureStage} ${styles.indexStage}`}>
                  <span className={styles.indexGrid} />
                  <span className={styles.indexScan} />
                  <span className={styles.indexPlate}>IDX·01</span>
                  <span className={styles.signatureName} style={{ color: "rgba(244,236,221,0.6)" }}>
                    The Index · grid draws, work snaps in
                  </span>
                </div>
              }
            />
          </Reveal>
        </div>

        {/* 07 elements */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="07">Elements · botanical index &amp; material</SectionLabel>
            <div className={styles.elementShowcase}>
              <div className={`${styles.elementFrame} ${styles.tileStudio}`}>
                <span className={`${styles.tick} ${styles.tickTL}`} />
                <span className={`${styles.tick} ${styles.tickTR}`} />
                <span className={`${styles.tick} ${styles.tickBL}`} />
                <span className={`${styles.tick} ${styles.tickBR}`} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.elementImg} src="/quiet/studio-rose.png" alt="jade duotone rose specimen" />
                <span className={styles.elementCaption}>IDX 01 · Rosa</span>
              </div>
              <div>
                <p className={styles.elementNote} style={{ marginBottom: 20 }}>
                  The flower becomes a <strong>catalogued specimen</strong>: a jade
                  duotone risograph peony set in a gridded index tile with corner
                  ticks and a mono plate number. Organic subject, systematic frame —
                  Organic × Digital as a design-studio index. Generated on-brand,
                  never a raw dark-ground render.
                </p>
                <MaterialRow
                  tiles={[
                    { name: "Espresso block", cls: "matEspresso" },
                    { name: "Jade jewel", cls: "matJade" },
                    { name: "Sand foil", cls: "matFoil" },
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
