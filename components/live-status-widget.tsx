"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ACCENT } from "@/lib/brand"

export function LiveStatusWidget() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "··:··"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-[11px] md:text-xs uppercase tracking-[0.22em] font-mono text-muted-foreground"
    >
      <span>Santa Clara, CA</span>
      <span className="text-muted-foreground/30">/</span>
      <span className="tabular-nums">{formattedTime} PT</span>
      <span className="text-muted-foreground/30">/</span>
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-flex w-1.5 h-1.5">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-70"
            style={{ backgroundColor: ACCENT }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
        </span>
        <span className="text-foreground/85">Open to work</span>
      </span>
      <span className="text-muted-foreground/30">/</span>
      <span>EN · CN</span>
    </motion.div>
  )
}
