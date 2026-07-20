import type { Metadata } from "next"
import {
  Fraunces,
  Hanken_Grotesk,
  Newsreader,
  Figtree,
  Archivo,
  Instrument_Sans,
  Space_Mono,
} from "next/font/google"
import styles from "@/components/directions/directions.module.css"
import { BoardAtelier } from "@/components/directions/board-atelier"
import { BoardInk } from "@/components/directions/board-ink"
import { BoardStudio } from "@/components/directions/board-studio"

/* System A · Pressed Atelier */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
})
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
})

/* System B · Ink & Mist */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
})
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
})

/* System C · Studio Modern */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
})
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})

/* shared mono for index labels */
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aijia Fang · Art Direction · Three Design Systems",
  description:
    "Three complete design systems for Aijia Fang's portfolio: Pressed Atelier, Ink & Mist, and Studio Modern.",
}

const fontVars = [
  fraunces.variable,
  hanken.variable,
  newsreader.variable,
  figtree.variable,
  archivo.variable,
  instrument.variable,
  spaceMono.variable,
].join(" ")

export default function DirectionsPage() {
  return (
    <div className={`${styles.root} ${fontVars}`}>
      <header className={styles.intro}>
        <p className={styles.introKicker}>Art Direction · Three complete systems · Pick one</p>
        <h1 className={styles.introTitle}>
          Three ways to be <em>quiet luxury</em>, with real depth.
        </h1>
        <p className={styles.introLead}>
          Not three swatch boards — three <strong>complete design systems</strong>,
          each genuinely distinct in personality, each with color ramps, a full type
          scale, spacing, live components, motion and a generated on-brand floral.
          All hold the same brief: quiet luxury WITH substance, light and healing,
          Organic × Digital. Read each one top to bottom, then tell me which is you.
        </p>
        <div className={styles.introMeta}>
          <span className={styles.introTag}>A · Pressed Atelier</span>
          <span className={styles.introTag}>B · Ink &amp; Mist 水墨</span>
          <span className={styles.introTag}>C · Studio Modern</span>
        </div>
      </header>

      <BoardAtelier />
      <BoardInk />
      <BoardStudio />

      <footer className={styles.footerNote}>
        Three systems, one designer. Each is a real starting identity — tokens,
        type, components and all. Tell me which one feels like you, and I&rsquo;ll
        build the full portfolio in it.
      </footer>
    </div>
  )
}
