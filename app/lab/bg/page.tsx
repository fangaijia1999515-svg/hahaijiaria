/**
 * /lab/bg — BACKGROUND CANDIDATES v3 for the classic (cream) case pages.
 * Round 2's CSS washes were still too quiet for her; v3 goes shader-grade,
 * porting the references she sent (Grainient / Aurora / Beams) into her
 * palette, plus an Apple-style Liquid Glass showcase (glassmorphism) and the
 * one static option she could already see (blueprint grid).
 * Isolated lab route, noindex; nothing here ships until she picks.
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "./bg-lab.css"
import { dsFontVars } from "@/lib/ds-fonts"
import { GrainientBg, AuroraBg, BeamsBg } from "./flow-effects"

export const metadata: Metadata = {
  title: "背景方案试验场 v3 · Aijia Fang",
  robots: { index: false, follow: false },
}

function SampleBlock() {
  return (
    <div className="bglab__inner">
      <p className="bglab__overline">01 / Overview</p>
      <h2 className="bglab__h">The Challenge</h2>
      <p className="bglab__p">
        Last-mile delivery is the most expensive and inefficient part of the
        supply chain, accounting for 53% of total logistics costs. With rising
        package theft and carbon emissions, the traditional
        &ldquo;courier-to-door&rdquo; model is broken.
      </p>
      <div className="bglab__row">
        <div className="bglab__img">
          <img src="/image/skya/heroshot.webp" alt="Skya hero render" />
        </div>
        <div className="bglab__card">
          <p className="bglab__stat">$5.14M</p>
          <p className="bglab__cap">Projected year one revenue</p>
        </div>
      </div>
    </div>
  )
}

export default function BgLab() {
  return (
    <main className={`bglab ${dsFontVars}`}>
      <section className="bglab__section">
        <p className="bglab__tag">方案 A · 流动渐变(你发的 Grainient,换成我们的色)</p>
        <div className="bglab__bg" aria-hidden="true">
          <GrainientBg />
        </div>
        <SampleBlock />
      </section>

      <section className="bglab__section">
        <p className="bglab__tag">方案 B · 奶油极光(你发的 Aurora,光在页面下缘流动)</p>
        <div className="bglab__bg" aria-hidden="true">
          <AuroraBg />
        </div>
        <SampleBlock />
      </section>

      <section className="bglab__section">
        <p className="bglab__tag">方案 C · 暖光柱(你发的 Beams,金色和青灰的光往上升)</p>
        <div className="bglab__bg" aria-hidden="true">
          <BeamsBg />
        </div>
        <SampleBlock />
      </section>

      <section className="bglab__section">
        <p className="bglab__tag">方案 D · Liquid Glass 毛玻璃(苹果那种,叠在流动渐变上)</p>
        <div className="bglab__bg" aria-hidden="true">
          <GrainientBg />
        </div>
        <div className="bglab__inner">
          <nav className="bglab__glassbar" aria-hidden="true">
            <span className="bglab__glassbrand">Aijia Fang</span>
            <span className="bglab__glasslinks">
              <span>WORK</span>
              <span>ABOUT</span>
              <span className="bglab__glasspill">CONTACT</span>
            </span>
          </nav>
          <div className="bglab__row" style={{ marginTop: 40 }}>
            <div className="bglab__glasscard">
              <p className="bglab__stat">$5.14M</p>
              <p className="bglab__cap">Projected year one revenue</p>
              <p className="bglab__glassnote">
                玻璃卡片:模糊 16px + 白 28% + 1px 亮边,内容透出流动的底色
              </p>
            </div>
            <div className="bglab__glasscard">
              <p className="bglab__stat">53%</p>
              <p className="bglab__cap">Of total logistics costs</p>
              <p className="bglab__glasschip">GLASS CHIP · 图注标签也能用</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bglab__section">
        <p className="bglab__tag">方案 E · 蓝图淡格(静态,上一轮你看得见的那个)</p>
        <div className="bglab__bg bg-grid" aria-hidden="true" />
        <SampleBlock />
      </section>
    </main>
  )
}
