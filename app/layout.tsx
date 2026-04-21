import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CustomCursor } from "@/components/custom-cursor"
import { PageTransition } from "@/components/page-transition"
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
      <CustomCursor />
        <PageTransition>{children}</PageTransition>
        <Analytics />
      </body>
    </html>
  )
}
