"use client"

import { motion } from "framer-motion"
import { Lightbulb, Users, TrendingUp } from "lucide-react"

interface Insight {
  icon: "lightbulb" | "users" | "trending"
  title: string
  description: string
  stat?: string
}

interface InsightCardsProps {
  insights: Insight[]
  accentColor?: string // Add accent color prop
}

const iconMap = {
  lightbulb: Lightbulb,
  users: Users,
  trending: TrendingUp,
}

export function InsightCards({ insights, accentColor = "#7AFEA7" }: InsightCardsProps) {
  return (
    <section id="research" className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">Key Insights</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const Icon = iconMap[insight.icon]
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-muted rounded-xl"
              >
                <Icon className="w-6 h-6 mb-4" style={{ color: accentColor }} />
                {insight.stat && (
                  <p className="text-3xl font-medium mb-2" style={{ color: accentColor }}>
                    {insight.stat}
                  </p>
                )}
                <h3 className="font-medium mb-2">{insight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
