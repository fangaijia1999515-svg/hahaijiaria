/**
 * LIVING STYLE GUIDE · /system
 * A faithful code twin of Aijia's 9 design-system spec sheets, rendered entirely
 * FROM the token layer (styles/design-tokens.css). Wrapped in `.ds` (+ font vars)
 * so it is fully isolated from the live dark site (app/page.tsx untouched).
 *
 * Fonts are substitutes: Fraunces→Canela, Hanken→Söhne, IBM Plex Mono (real).
 */
import type { Metadata } from "next"
import "@/styles/design-tokens.css"
import "@/styles/ds-components.css"
import { dsFontVars } from "@/lib/ds-fonts"
import {
  swatches, typeScale, spacingScale, layout, radius, motion, materials, moodboard, backgroundOptions,
} from "@/lib/design-tokens"
import {
  Container, Button, DsLink, Tag, Logo, LogoMark,
  Nav, ProjectCard, QuoteCard, Input, MotionDemos,
  socialIcons, uiIcons,
} from "@/components/ds"

export const metadata: Metadata = {
  title: "Design System · Aijia Fang",
  description: "Living style guide, the code source of truth for hahaijia.com.",
}

/* ---------- page-scoped layout helpers (token-only) ------------------------- */
function Block({ id, num, title, desc, wide, children }:
  { id: string; num: string; title: string; desc?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} style={{ borderTop: "1px solid var(--ds-border)", paddingBlock: "var(--ds-space-9)" }}>
      <Container wide={wide}>
        <div style={{ display: "flex", gap: "var(--ds-space-3)", alignItems: "baseline", marginBottom: "var(--ds-space-6)" }}>
          <span className="ds-overline" style={{ color: "var(--ds-accent)" }}>{num}</span>
          <h2 className="ds-h2">{title}</h2>
        </div>
        {desc && <p className="ds-body-lg" style={{ maxWidth: "62ch", marginBottom: "var(--ds-space-7)" }}>{desc}</p>}
        {children}
      </Container>
    </section>
  )
}

function Panel({ dark, label, children, pad = true }:
  { dark?: boolean; label: string; children: React.ReactNode; pad?: boolean }) {
  return (
    <div className={dark ? "ds-dark" : undefined}
      style={{ background: "var(--ds-bg)", border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-lg)", padding: pad ? "var(--ds-space-7)" : "var(--ds-space-6)",
        flex: "1 1 380px", minWidth: 320 }}>
      <p className="ds-overline" style={{ marginBottom: "var(--ds-space-5)" }}>{label}</p>
      {children}
    </div>
  )
}

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "var(--ds-space-4)" }
const stack5: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--ds-space-5)" }

/* ---------- shared component demos (used in both light + dark panels) -------- */
function ButtonSet() {
  return (
    <div style={stack5}>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "var(--ds-space-5)", alignItems: "center" }}>
        <span className="ds-label">Default</span>
        <div style={row}>
          <Button variant="primary" arrow>Contact us</Button>
          <Button variant="secondary">Learn more</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "var(--ds-space-5)", alignItems: "center" }}>
        <span className="ds-label">Hover</span>
        <div style={row}>
          <Button variant="primary" arrow className="is-hover">Contact us</Button>
          <Button variant="secondary" className="is-hover">Learn more</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "var(--ds-space-5)", alignItems: "center" }}>
        <span className="ds-label">Sizes</span>
        <div style={{ ...row, alignItems: "center" }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg" arrow>Large</Button>
        </div>
      </div>
    </div>
  )
}

function CardSet() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--ds-space-4)", alignItems: "start" }}>
      <ProjectCard title="Project Title" />
      <QuoteCard author="Steve Jobs"
        quote={<>Design is not just what it looks like and feels like. Design is how it works.</>} />
    </div>
  )
}

function InputSet() {
  return (
    <div style={stack5}>
      <Input label="Default" placeholder="Your name" />
      <Input label="Focus" placeholder="Your email" className="ds-input--focus" />
      <Input label="Filled" defaultValue="hello@aijiafang.com" />
    </div>
  )
}

function IconSet() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-6)" }}>
      <div>
        <p className="ds-label" style={{ marginBottom: "var(--ds-space-4)" }}>Social</p>
        <div style={row}>
          {socialIcons.map(({ name, Icon }) => (
            <button key={name} className="ds-icon-btn" aria-label={name}><Icon /></button>
          ))}
        </div>
      </div>
      <div>
        <p className="ds-label" style={{ marginBottom: "var(--ds-space-4)" }}>UI actions</p>
        <div style={row}>
          {uiIcons.map(({ name, Icon }) => (
            <button key={name} className="ds-icon-btn" aria-label={name}><Icon /></button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================ */
export default function SystemPage() {
  return (
    <main className={`ds ${dsFontVars}`} style={{ minHeight: "100vh" }}>
      {/* ============ HERO / TITLE ============ */}
      <header style={{ paddingTop: "var(--ds-space-9)", paddingBottom: "var(--ds-space-8)" }}>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--ds-space-6)" }}>
            <div style={{ maxWidth: "60ch" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--ds-space-3)", marginBottom: "var(--ds-space-6)", color: "var(--ds-accent)" }}>
                <LogoMark size={44} />
                <span className="ds-overline">Design System · v1.0</span>
              </div>
              <h1 className="ds-h1">Aijia Fang</h1>
              <p className="ds-body-lg" style={{ marginTop: "var(--ds-space-5)" }}>
                A living style guide, rendered from code. <span className="ds-italic" style={{ fontFamily: "var(--ds-font-display)" }}>Organic × Digital</span>:
                her flower rendered through system and grid. Every value below reads from a single token layer.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="ds-label">Timeless</p>
              <p className="ds-label" style={{ marginTop: 4 }}>Refined</p>
              <p className="ds-label" style={{ marginTop: 4 }}>Natural</p>
            </div>
          </div>
        </Container>
      </header>

      {/* ============ 01 · COLOR ============ */}
      <Block id="color" num="01" title="Color" desc="A refined, understated palette inspired by quiet luxury, natural materials, and timeless design. Nine values: warm cream base, sage & forest greens, taupe / terracotta / amber earth tones, deep charcoal for text and dark sections.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--ds-space-4)" }}>
          {swatches.map((s) => (
            <div key={s.hex} style={{ border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)", overflow: "hidden", boxShadow: "var(--ds-shadow-sm)" }}>
              <div style={{ background: s.hex, height: 104 }} />
              <div style={{ padding: "var(--ds-space-4)" }}>
                <p className="ds-label" style={{ color: "var(--ds-text)" }}>{s.hex}</p>
                <p className="ds-label" style={{ marginTop: 6, color: "var(--ds-text-secondary)" }}>{s.name.toUpperCase()}</p>
                <p className="ds-body-sm" style={{ marginTop: 8, color: "var(--ds-text-muted)" }}>{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* ============ 02 · TYPOGRAPHY ============ */}
      <Block id="type" num="02" title="Typography" desc="Display = Cormorant (standing in for Canela). Body = Hanken Grotesk (standing in for Söhne). Labels & captions = IBM Plex Mono. Scale per her 字体系统 sheet; swapping to the licensed originals is a one-token change.">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-7)" }}>
          {typeScale.map((t) => {
            const isDisplay = t.token.startsWith("H")
            const isMono = t.font.includes("Mono")
            const cls = t.token === "H1" ? "ds-h1" : t.token === "H2" ? "ds-h2" : t.token === "H3" ? "ds-h3"
              : t.token === "Label" ? "ds-label" : t.token === "Overline" ? "ds-overline"
              : t.token === "Body Small" ? "ds-body-sm" : t.token === "Body Large" ? "ds-body-lg" : "ds-body"
            return (
              <div key={t.token} className="ds-typerow">
                <p className={cls} style={{ color: "var(--ds-text)" }}>
                  {isDisplay ? "Elevate the Everyday" : isMono ? "LABEL / INFORMATION" : "Designed for clarity and elegance."}
                </p>
                <dl className="ds-body-sm" style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "var(--ds-space-4)", rowGap: 4, margin: 0 }}>
                  <dt className="ds-label">Token</dt><dd style={{ margin: 0, color: "var(--ds-text)" }}>{t.token}</dd>
                  <dt className="ds-label">Font</dt><dd style={{ margin: 0 }}>{t.font}</dd>
                  <dt className="ds-label">Size</dt><dd style={{ margin: 0 }}>{t.size}</dd>
                  <dt className="ds-label">LH / LS</dt><dd style={{ margin: 0 }}>{t.lh} / {t.ls}</dd>
                </dl>
              </div>
            )
          })}
        </div>
      </Block>

      {/* ============ 03 · SPACING & GRID ============ */}
      <Block id="grid" num="03" title="Spacing & Grid" desc="A 4px base unit. A 12-column grid with 24px gutter and 80px side margin on a 1440 frame. Section-padding presets and a soft radius set keep rhythm consistent across every page.">
        {/* spacing scale */}
        <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Spacing scale · 4px base</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--ds-space-4)", flexWrap: "wrap", marginBottom: "var(--ds-space-8)" }}>
          {spacingScale.map((v, i) => (
            <div key={v} style={{ textAlign: "center" }}>
              <div style={{ width: v, height: v, background: "var(--ds-accent-soft)", borderRadius: "var(--ds-radius-sm)" }} />
              <p className="ds-label" style={{ marginTop: 8 }}>{v}{i === 0 ? " (base)" : ""}</p>
            </div>
          ))}
        </div>
        {/* 12-col grid */}
        <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>12-column grid · {layout.gutter} gutter · {layout.marginDesktop} margin</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: layout.gutter, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-space-4)", marginBottom: "var(--ds-space-8)" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ height: 148, background: "color-mix(in srgb, var(--ds-accent) 12%, transparent)", borderRadius: "var(--ds-radius-sm)", display: "grid", placeItems: "start center", paddingTop: "var(--ds-space-3)" }}>
              <span className="ds-label">{i + 1}</span>
            </div>
          ))}
        </div>
        {/* containers + section padding + radii */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--ds-space-7)" }}>
          <div>
            <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Container max-widths</p>
            {Object.entries(layout.containers).map(([name, v]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid var(--ds-border)", padding: "10px 0" }}>
                <span className="ds-body-sm" style={{ color: "var(--ds-text)", textTransform: "capitalize" }}>{name}</span>
                <span className="ds-label" style={{ textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Section padding (top / bottom)</p>
            {Object.entries(layout.section).map(([name, v]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--ds-border)", padding: "10px 0" }}>
                <span className="ds-body-sm" style={{ color: "var(--ds-text)", textTransform: "capitalize" }}>{name}</span>
                <span className="ds-label">{v.top} / {v.bottom}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Radii</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ds-space-5)", alignItems: "center" }}>
              {Object.entries(radius).map(([k, v]) => (
                <div key={k} style={{ textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, background: "var(--ds-surface)", border: "1px solid var(--ds-border-strong)", borderRadius: v }} />
                  <p className="ds-label" style={{ marginTop: 8 }}>{k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* summary strip — the footer band on her 间距与网格 sheet */}
        <div style={{ marginTop: "var(--ds-space-8)", border: "1px solid var(--ds-border)",
          borderRadius: "var(--ds-radius-lg)", padding: "var(--ds-space-5) var(--ds-space-6)",
          display: "flex", flexWrap: "wrap", gap: "var(--ds-space-6)", justifyContent: "space-between" }}>
          {[
            ["Base Unit", "4px"],
            ["Grid Columns", String(layout.gridCols)],
            ["Gutter", layout.gutter],
            ["Side Margin (Desktop)", layout.marginDesktop],
            ["Container (Desktop)", "1200–1440px"],
            ["Section Padding (Default)", "64px"],
            ["Baseline Grid", "4px"],
          ].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", flex: "1 1 120px" }}>
              <p className="ds-body-sm" style={{ color: "var(--ds-text)" }}>{k}</p>
              <p className="ds-label" style={{ marginTop: 6 }}>{v}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* ============ 04 · BUTTONS ============ */}
      <Block id="buttons" num="04" title="Buttons" desc="Pill-shaped and softly raised. Buttons are the same color as their ground, lifted by a warm shadow: Primary and Secondary both raise, with Secondary a touch lighter on a hairline. Hover adds a gentle warm shift, a deeper shadow, and an arrow nudge. Shown default and hover, in light and dark.">
        <div style={row}>
          <Panel label="Light"><ButtonSet /></Panel>
          <Panel dark label="Dark"><ButtonSet /></Panel>
        </div>
      </Block>

      {/* ============ 05 · NAVIGATION ============ */}
      <Block id="nav" num="05" title="Navigation" wide desc="A gently rounded rectangle bar, the same color as its ground and softly raised: wordmark left, links, and a solid 'Book a call' pill on the right. Spans the wide 1440 frame, close to the page edges. Same component, light and dark.">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-5)" }}>
          <Nav />
          <Nav dark />
        </div>
      </Block>

      {/* ============ 06 · CARDS ============ */}
      <Block id="cards" num="06" title="Cards & Containers" desc="Project card (image · Fraunces title · description · 'View project →' in sans with an amber arrow) and quote card (large mark · upright sans quote · attribution). Each surface is the same color as its ground, softly raised, with rounded corners.">
        <div style={row}>
          <Panel label="Light" pad={false}><CardSet /></Panel>
          <Panel dark label="Dark" pad={false}><CardSet /></Panel>
        </div>
      </Block>

      {/* ============ 07 · INPUTS ============ */}
      <Block id="inputs" num="07" title="Input Fields" desc="Labelled fields: default, focus (warm-gold ring), and filled, in light and dark.">
        <div style={row}>
          <Panel label="Light"><InputSet /></Panel>
          <Panel dark label="Dark"><InputSet /></Panel>
        </div>
      </Block>

      {/* ============ 08 · ICONS ============ */}
      <Block id="icons" num="08" title="Iconography" desc="Clean, standard glyphs: 1.5px stroke on a 24px grid, round caps, inheriting text color. Social (Instagram · LinkedIn) plus a UI action set.">
        <div style={row}>
          <Panel label="Light"><IconSet /></Panel>
          <Panel dark label="Dark"><IconSet /></Panel>
        </div>
      </Block>

      {/* ============ 09 · LOGO ============ */}
      <Block id="logo" num="09" title="Logo" desc="Primary serif wordmark with a botanical sprout on the 'i', a stacked lockup, and the organic monogram: a fern sprig beside a soft seed and mound ('organic × digital'). Reversed versions for dark grounds.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--ds-space-4)" }}>
          <Panel label="Primary wordmark">
            <div style={{ display: "grid", placeItems: "center", minHeight: 120 }}><Logo tagline="PORTFOLIO" size={30} /></div>
          </Panel>
          <Panel label="Stacked lockup">
            <div style={{ display: "grid", placeItems: "center", minHeight: 120 }}><Logo stacked tagline="PRODUCT · UX DESIGN" size={28} /></div>
          </Panel>
          <Panel label="Monogram / icon">
            <div style={{ display: "grid", placeItems: "center", minHeight: 120, color: "var(--ds-text)" }}><LogoMark size={72} /></div>
          </Panel>
        </div>
        <div style={{ ...row, marginTop: "var(--ds-space-4)" }}>
          <Panel dark label="Wordmark (reversed)">
            <div style={{ display: "grid", placeItems: "center", minHeight: 100 }}><Logo tagline="PORTFOLIO" size={30} /></div>
          </Panel>
          <Panel dark label="Stacked (reversed)">
            <div style={{ display: "grid", placeItems: "center", minHeight: 100 }}><Logo stacked tagline="PRODUCT · UX DESIGN" size={26} /></div>
          </Panel>
          <Panel dark label="Monogram (reversed)">
            <div style={{ display: "grid", placeItems: "center", minHeight: 100, color: "var(--ds-text)" }}><LogoMark size={72} /></div>
          </Panel>
        </div>
      </Block>

      {/* ============ 10 · MOTION ============ */}
      <Block id="motion" num="10" title="Motion & Interaction"
        desc={`Subtle, luxury motion. Easing ${motion.ease.standard}. Durations: hover ${motion.duration.hover}ms · base ${motion.duration.base}ms · reveal ${motion.duration.reveal}ms · loader ${motion.duration.loader}ms. Demos below are live and loop.`}>
        <MotionDemos />
      </Block>

      {/* ============ 11 · TEXTURE & MATERIALS ============ */}
      <Block id="textures" num="11" title="Texture & Materials" desc="The material language beneath the palette: paper, shadow, stone, water, linen, mineral, plus the mood-board directions that guide photography and backgrounds. Every image below is cropped directly from her spec sheets.">
        <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Materials</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ds-space-4)", marginBottom: "var(--ds-space-8)" }}>
          {materials.map((m) => (
            <div key={m.slug} style={{ width: 150, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius-md)", overflow: "hidden", boxShadow: "var(--ds-shadow-sm)" }}>
              <div style={{ aspectRatio: "9 / 8", backgroundImage: `url(/ds/textures/${m.slug}.png)`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: "var(--ds-space-3) var(--ds-space-4)" }}>
                <p className="ds-label" style={{ color: "var(--ds-text-secondary)" }}>{m.name.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Mood board directions</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-6)", marginBottom: "var(--ds-space-8)" }}>
          {moodboard.map((c, ci) => (
            <div key={c.name}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--ds-space-3)", marginBottom: "var(--ds-space-3)" }}>
                <span className="ds-label" style={{ color: "var(--ds-text)" }}>{ci + 1}. {c.name.toUpperCase()}</span>
                <span className="ds-body-sm" style={{ color: "var(--ds-text-muted)" }}>{c.note}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ds-space-3)" }}>
                {c.images.map((img) => (
                  <img key={img} src={`/ds/moodboard/${img}.png`} alt={c.name}
                    style={{ height: 180, width: "auto", borderRadius: "var(--ds-radius-sm)",
                      border: "1px solid var(--ds-border)", display: "block" }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="ds-overline" style={{ marginBottom: "var(--ds-space-4)" }}>Landscape background options (optional; she selects one for the live hero)</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--ds-space-4)" }}>
          {backgroundOptions.map((b) => (
            <div key={b.slug} style={{ borderRadius: "var(--ds-radius-md)", overflow: "hidden", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-sm)" }}>
              <div style={{ height: 116, backgroundImage: `url(/ds/backgrounds/${b.slug}.png)`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <p className="ds-body-sm" style={{ padding: "var(--ds-space-3) var(--ds-space-4)", color: "var(--ds-text)" }}>{b.name}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* ============ 12 · TAGS (bonus) ============ */}
      <Block id="tags" num="12" title="Tags & Chips" desc="Mono-label chips for taxonomy: outline, soft, and solid.">
        <div style={{ ...row, alignItems: "center" }}>
          <Tag>Product Design</Tag>
          <Tag variant="soft">UX Research</Tag>
          <Tag variant="solid">AI-Native</Tag>
          <Tag>Design Systems</Tag>
          <DsLink href="#" style={{ marginLeft: "var(--ds-space-4)" }}>View project</DsLink>
        </div>
      </Block>

      {/* ============ FOOTER ============ */}
      <footer style={{ borderTop: "1px solid var(--ds-border)", paddingBlock: "var(--ds-space-7)" }}>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--ds-space-4)" }}>
            <p className="ds-label">Aijia Fang · Design System v1.0</p>
            <p className="ds-label">Timeless · Refined · Natural</p>
          </div>
        </Container>
      </footer>
    </main>
  )
}
