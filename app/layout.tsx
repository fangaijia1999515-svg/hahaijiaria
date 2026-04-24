import type React from "react"
import type { Metadata } from "next"
import {
  Inter,
  Playfair_Display,
  Instrument_Serif,
  Caveat,
  Fraunces,
  Space_Grotesk,
  DM_Serif_Display,
  Cormorant_Garamond,
  Kalam,
  Manrope,
  Nunito,
  Plus_Jakarta_Sans,
  Quicksand,
  Urbanist,
  Lexend,
  DM_Sans,
  Red_Hat_Display,
  Bricolage_Grotesque,
  Unbounded,
  Syne,
  Grandstander,
  Gabarito,
  Outfit,
  Figtree,
  Jost,
  Rubik,
  Sora,
  Onest,
  Poppins,
  Familjen_Grotesk,
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CustomCursor } from "@/components/custom-cursor"
import { PageTransition } from "@/components/page-transition"
import { TransitionProvider } from "@/lib/transition-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal", "italic"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  weight: ["400", "700"],
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
})

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-redhat",
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
})

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
})

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
})

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
})

export const metadata: Metadata = {
  title: "Aijia Fang — Service Designer & Systems Thinker",
  description:
    "Multidisciplinary Service Designer bridging physical products and digital services. Specializing in Systems Thinking and experience design.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${instrumentSerif.variable} ${caveat.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${cormorant.variable} ${kalam.variable} ${manrope.variable} ${nunito.variable} ${plusJakarta.variable} ${quicksand.variable} ${urbanist.variable} ${lexend.variable} ${dmSans.variable} ${redHat.variable} ${bricolage.variable} ${unbounded.variable} ${syne.variable} ${grandstander.variable} ${gabarito.variable} ${outfit.variable} ${figtree.variable} ${jost.variable} ${rubik.variable} ${sora.variable} ${onest.variable} ${poppins.variable} ${familjen.variable}`}
    >
      <body className="font-sans antialiased">
        <TransitionProvider>
          <CustomCursor />
          <PageTransition>{children}</PageTransition>
          <Analytics />
        </TransitionProvider>
      </body>
    </html>
  )
}
