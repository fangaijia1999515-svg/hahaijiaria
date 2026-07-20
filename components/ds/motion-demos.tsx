/**
 * DS MOTION DEMOS — reproduces her 动效与交互 sheet as LIVE, looping demos.
 * All animation is CSS (styles/ds-components.css), token-driven; respects
 * prefers-reduced-motion. Five rows: page transitions, hover, scroll reveal,
 * loading, parallax depth.
 */
import { Button } from "./primitives"

function Row({ n, title, meta, children }:
  { n: string; title: string; meta: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "var(--ds-space-4)",
      borderTop: "1px solid var(--ds-border)", paddingTop: "var(--ds-space-6)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--ds-space-3)" }}>
          <span className="ds-overline" style={{ color: "var(--ds-accent)" }}>{n}</span>
          <h3 className="ds-h3">{title}</h3>
        </div>
        <span className="ds-label">{meta}</span>
      </div>
      {children}
    </div>
  )
}

const HERO = "/ds/backgrounds/simplified-hero.png"

function Tile({ variant, label }: { variant: "fade" | "slide"; label: string }) {
  return (
    <div>
      <p className="ds-label" style={{ marginBottom: 8 }}>{label}</p>
      <div className={`ds-anim-tile ds-anim-${variant}`}
        style={{ backgroundImage: `url(${HERO})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <span style={{ textShadow: "0 1px 12px rgba(0,0,0,0.25)", color: "#F5F0E8", fontStyle: "italic" }}>
          Storytelling
        </span>
      </div>
    </div>
  )
}

export function MotionDemos() {
  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--ds-space-5)" }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-6)" }}>
      {/* 1 · PAGE TRANSITIONS */}
      <Row n="01" title="Page Transitions" meta="Fade · Subtle Slide · 300–600ms">
        <div style={grid2}>
          <Tile variant="fade" label="Fade" />
          <Tile variant="slide" label="Subtle Slide" />
        </div>
      </Row>

      {/* 2 · HOVER STATES */}
      <Row n="02" title="Hover States" meta="Soft shadow lift + warm shift · 320ms">
        <div style={{ display: "flex", gap: "var(--ds-space-7)", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p className="ds-label" style={{ marginBottom: 10 }}>Default</p>
            <Button variant="primary" arrow>Contact us</Button>
          </div>
          <span className="ds-h3" style={{ color: "var(--ds-text-muted)" }}>→</span>
          <div>
            <p className="ds-label" style={{ marginBottom: 10 }}>Hover</p>
            <Button variant="primary" arrow className="is-hover">Contact us</Button>
          </div>
        </div>
      </Row>

      {/* 3 · SCROLL-TRIGGERED REVEAL */}
      <Row n="03" title="Scroll-Triggered Reveal" meta="Fade-up · ease-out · 400–600ms">
        <div style={grid2}>
          {["Motion", "In view", "Revealed"].map((t, i) => (
            <div key={t} className="ds-reveal-item"
              style={{ animationDelay: `${i * 260}ms`, background: "var(--ds-surface)",
                border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)",
                padding: "var(--ds-space-5)", boxShadow: "var(--ds-shadow-sm)" }}>
              <p className="ds-label" style={{ marginBottom: 8 }}>{`Layer ${i + 1}`}</p>
              <p className="ds-h3" style={{ fontSize: "var(--ds-h3-size)" }}>{t}</p>
            </div>
          ))}
        </div>
      </Row>

      {/* 4 · LOADING STATES */}
      <Row n="04" title="Loading States" meta="Spinner · Pulse · Progress · 800–1200ms">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--ds-space-5)", alignItems: "center" }}>
          <div style={{ display: "grid", placeItems: "center", gap: 12, padding: "var(--ds-space-5)", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)" }}>
            <div className="ds-spinner" /><span className="ds-label">Spinner</span>
          </div>
          <div style={{ display: "grid", placeItems: "center", gap: 12, padding: "var(--ds-space-5)", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)" }}>
            <div className="ds-pulse-dot" /><span className="ds-label">Pulse</span>
          </div>
          <div style={{ display: "grid", gap: 14, padding: "var(--ds-space-5)", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)" }}>
            <div className="ds-progress"><div className="ds-progress__fill" /></div>
            <span className="ds-label" style={{ textAlign: "center" }}>Progress</span>
          </div>
        </div>
      </Row>

      {/* 5 · PARALLAX SCROLL DEPTH */}
      <Row n="05" title="Parallax Scroll Depth" meta="Layered depth · 0.2x / 0.5x / 0.8x / 1x">
        <div className="ds-parallax">
          {[
            { d: 9000, size: 120, top: 30, op: 0.10 },
            { d: 6500, size: 74, top: 70, op: 0.16 },
            { d: 4500, size: 44, top: 20, op: 0.22 },
            { d: 3000, size: 26, top: 92, op: 0.30 },
          ].map((l, i) => (
            <div key={i} className="ds-parallax__layer"
              style={{ animation: `ds-parallax ${l.d}ms ease-in-out infinite` }}>
              <span className="ds-parallax__blob"
                style={{ width: l.size, height: l.size, opacity: l.op, marginLeft: `${i * 140}px`, marginTop: `${l.top - 60}px` }} />
              <span className="ds-parallax__blob"
                style={{ width: l.size * 0.7, height: l.size * 0.7, opacity: l.op }} />
            </div>
          ))}
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
            <span className="ds-h3" style={{ fontStyle: "italic", color: "var(--ds-text)" }}>Depth</span>
          </div>
        </div>
      </Row>
    </div>
  )
}
