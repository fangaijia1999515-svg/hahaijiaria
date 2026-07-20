import type React from "react"
import type { Metadata } from "next"
import { Syne, Hanken_Grotesk, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { QuietCursor } from "@/components/quiet-cursor"
import { ChameleonAmbient } from "@/components/chameleon-ambient"
import { PageTransition } from "@/components/page-transition"
import { SmoothScroll } from "@/components/smooth-scroll"
import { TransitionProvider } from "@/lib/transition-context"
import { ChameleonProvider } from "@/lib/chameleon-context"
import "./globals.css"

// Design system type stack (Direction 02 — Disciplined Playful):
//   display = Bricolage Grotesque · body = Hanken Grotesk · labels = Geist Mono
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
})

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aijia Fang · AI-Native Product Designer",
  description:
    "AI-native product designer in Santa Clara, CA. Trained in industrial design at Pratt and service design at SCAD, she designs the experience and writes the software behind it.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${hanken.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <SmoothScroll>
          <ChameleonProvider>
            <TransitionProvider>
              <ChameleonAmbient />
              <QuietCursor />
              <PageTransition>{children}</PageTransition>
              <Analytics />
            </TransitionProvider>
          </ChameleonProvider>
        </SmoothScroll>
      </body>
    </html>
  )
}
