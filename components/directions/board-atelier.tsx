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

export function BoardAtelier() {
  return (
    <section className={`${styles.panel} ${styles.sysAtelier}`}>
      <div className={styles.panelInner}>
        {/* head */}
        <Reveal>
          <header className={styles.panelHead}>
            <span className={styles.systemIndex}>System A · Pressed Atelier</span>
            <h2
              className={styles.systemTitle}
              style={{ fontSize: "clamp(44px,7vw,104px)", fontWeight: 340, letterSpacing: "-0.03em" }}
            >
              Pressed <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Atelier</em>
            </h2>
            <p className={styles.systemConcept}>
              A herbarium pressed between the pages of a heritage monograph. Warm
              bone and ink-brown, oxblood and antique gold, high-contrast serif,
              pressed-botanical linework. Grounded, considered, with real 底蕴 —
              the opposite of pale and templated. The Row met an old botanical
              atlas.
            </p>
            <div className={styles.moodRow}>
              {["Heritage", "Pressed", "Apothecary", "Grounded", "Considered"].map((m) => (
                <span className={styles.moodChip} key={m}>{m}</span>
              ))}
            </div>
          </header>
        </Reveal>

        {/* 01 hero */}
        <Reveal>
          <SectionLabel n="01">Identity · hero vignette</SectionLabel>
          <div className={styles.hero}>
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
              style={{ fontSize: "clamp(58px,11vw,146px)", fontWeight: 340, letterSpacing: "-0.03em" }}
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
            <SectionLabel n="02">Color system</SectionLabel>
            <ColorSystem
              groups={[
                { name: "Neutral · bone", steps: [{ hex: "#F7F1E6" }, { hex: "#EDE3D0" }, { hex: "#E4D7BF" }, { hex: "#D8C7AB" }] },
                { name: "Ink · brown", steps: [{ hex: "#6E5A45", onDark: true }, { hex: "#4A3A2C", onDark: true }, { hex: "#35291F", onDark: true }, { hex: "#241C15", onDark: true }] },
                { name: "Accent · oxblood / terracotta", steps: [{ hex: "#C06A45", onDark: true }, { hex: "#A2482F", onDark: true }, { hex: "#8A3A2A", onDark: true }, { hex: "#5E2A24", onDark: true }] },
                { name: "Metal · antique gold", steps: [{ hex: "#E3CE9A" }, { hex: "#CBAA66" }, { hex: "#B08A3E", onDark: true }, { hex: "#8A6A2C", onDark: true }] },
              ]}
              semantic={[
                { name: "Page", hex: "#F5EEE0" },
                { name: "Ink / text", hex: "#241C15" },
                { name: "CTA · oxblood", hex: "#7A2E22" },
                { name: "Accent · terracotta", hex: "#A2482F" },
                { name: "Gold hairline", hex: "#B08A3E" },
                { name: "Divider", hex: "#E4D7BF" },
              ]}
              usage={[
                { label: "Bone", pct: 62, bg: "#EDE3D0", fg: "#4A3A2C" },
                { label: "Ink", pct: 22, bg: "#241C15", fg: "#F5EEE0" },
                { label: "Gold", pct: 8, bg: "#B08A3E", fg: "#241C15" },
                { label: "Oxblood", pct: 8, bg: "#7A2E22", fg: "#F5EEE0" },
              ]}
            />
          </Reveal>
        </div>

        {/* 03 type */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="03">Type scale · <b>Fraunces</b> display / Hanken Grotesk body</SectionLabel>
            <TypeScaleTable
              rows={[
                { sample: "Aijia Fang", style: { fontSize: 84, fontWeight: 340, letterSpacing: "-0.03em" }, role: "Display", detail: "84 / -3% / 340" },
                { sample: <>Selected <em>work</em></>, style: { fontSize: 54, fontWeight: 400, letterSpacing: "-0.02em" }, role: "H1", detail: "54 / -2% / 400" },
                { sample: "Product & service design", style: { fontSize: 34, fontWeight: 400, letterSpacing: "-0.01em" }, role: "H2", detail: "34 / -1% / 400" },
                { sample: "I turn complex, multi-stakeholder systems into things people actually use — and I build the working prototype.", style: { fontSize: 17, fontWeight: 400, color: "var(--ink-2)" }, role: "Body", detail: "17 / 0 / 400 / 1.6", body: true },
                { sample: "PLATE 01 · PORTFOLIO", style: { fontSize: 12, letterSpacing: "0.2em", fontFamily: "var(--font-label)", color: "var(--ink-3)" }, role: "Label / mono", detail: "12 / +20% / caps", body: true },
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
                  <b>Grid:</b> 12-column, 1180px max, 32px gutter, generous margins.
                  <br />
                  <b>Radii:</b> 3px / 6px — near-square, pressed, restrained. No pills except tags.
                  <br />
                  <b>Elevation:</b> one soft warm shadow, single light source from above.
                  <br />
                  <b>Rhythm:</b> everything snaps to a 4px base; sections breathe at 76px.
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
                { name: "Skya", tag: "Fintech · 0→1", outcome: "$5.14M year one", role: "Lead", imgStyle: { background: "radial-gradient(120% 120% at 20% 0%, #C06A45, #7A2E22 70%)" } },
                { name: "Crit", tag: "Live AI tool", outcome: "Ships today", role: "Build", imgStyle: { background: "radial-gradient(120% 120% at 80% 10%, #CBAA66, #4A3A2C 75%)" } },
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
                { k: "Ease · heritage", v: "cubic-bezier(.2,.62,.2,1)" },
                { k: "Reveal", v: "700ms · settle 10px" },
                { k: "Hover", v: "300ms lift 1px" },
                { k: "Hairline draw", v: "left → right, 800ms" },
                { k: "Signature", v: "“The Press”" },
              ]}
              signature={
                <div className={styles.signatureStage}>
                  <span className={styles.pressWord}>Aijia</span>
                  <span className={styles.pressLine} />
                  <span className={styles.signatureName}>The Press · pressed into the page</span>
                </div>
              }
            />
          </Reveal>
        </div>

        {/* 07 elements */}
        <div className={styles.section}>
          <Reveal>
            <SectionLabel n="07">Elements · pressed botanical &amp; material</SectionLabel>
            <div className={styles.elementShowcase}>
              <div className={`${styles.elementFrame} ${styles.plateAtelier}`}>
                <span className={styles.plateRings} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.elementImg} src="/quiet/atelier-botanical.png" alt="pressed botanical ink linework" />
                <span className={styles.elementCaption}>Rosa · Paeonia — herbarium plate</span>
              </div>
              <div>
                <p className={styles.elementNote} style={{ marginBottom: 20 }}>
                  The flower becomes a <strong>pressed-botanical ink specimen</strong>:
                  single-weight sepia linework on a champagne-hairline apothecary
                  plate. Organic × Digital rendered as a herbarium page — human and
                  warm, catalogued and systematic. Generated on-brand, never a raw
                  dark-ground render.
                </p>
                <MaterialRow
                  tiles={[
                    { name: "Ivory paper", cls: "matPaper" },
                    { name: "Champagne foil", cls: "matFoil" },
                    { name: "Botanical ink", cls: "matInk" },
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
