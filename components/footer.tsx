"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/")
    }
  }

  return (
    <footer
      id="contact"
      className="scroll-mt-16 border-t-section py-24 md:py-32 px-6 md:px-12 lg:px-24 relative"
    >
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Get in Touch</span>
          <h2 className="font-sans font-extrabold tracking-tighter text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-6 leading-[1.15] text-foreground pb-2 whitespace-nowrap">
            {"Let's untangle the "}
            <span className="animate-color-cycle-fast inline-block">complexity.</span>
          </h2>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <a
              href="mailto:hahaijiarah@gmail.com"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-[0.15em] hover:bg-[var(--proj-green)] hover:shadow-[0_0_30px_rgba(122,254,167,0.4)] transition-all duration-300"
              data-cursor-hover
              data-cursor-color="#7AFEA7"
            >
              hahaijiarah@gmail.com
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://www.linkedin.com/in/aijia-fang"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-foreground/40 text-sm uppercase tracking-[0.15em] text-foreground hover:border-[var(--proj-blue)] hover:text-[var(--proj-blue)] hover:shadow-[0_0_20px_rgba(150,193,255,0.2)] transition-all duration-300"
              data-cursor-hover
              data-cursor-color="#96C1FF"
            >
              LinkedIn
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>

        <div className="mt-20 pt-8 border-t-section-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <button
              onClick={handleNameClick}
              className="font-sans font-extrabold tracking-tighter text-lg animate-color-cycle text-left"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-hover
              data-cursor-color="#E692FF"
            >
              Aijia Fang
            </button>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="/#work"
                className="hover:text-[var(--proj-yellow)] transition-colors"
                data-cursor-hover
                data-cursor-color="#FFC973"
              >
                Work
              </Link>
              <Link
                href="/#about"
                className="hover:text-[var(--proj-pink)] transition-colors"
                data-cursor-hover
                data-cursor-color="#FF9992"
              >
                About
              </Link>
            </nav>
          </div>
          <p className="text-sm text-muted-foreground">© 2026</p>
        </div>
      </div>
    </footer>
  )
}
