import { NextResponse } from "next/server"
import { buildPrompt, fallbackReading, crisisCheck, CRISIS_REPLY } from "@/lib/tarot/prompt"
import { localDateStr } from "@/lib/tarot/draw"
import type { DrawnCard, SpreadId } from "@/lib/tarot/types"

export async function POST(req: Request) {
  let body: { spread: SpreadId; question?: string; cards: DrawnCard[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 })
  }
  const { spread, question, cards } = body ?? {}
  if (!spread || !Array.isArray(cards) || cards.length < 1 || cards.length > 3) {
    return NextResponse.json({ error: "bad input" }, { status: 400 })
  }
  if (question && crisisCheck(question)) {
    return NextResponse.json({ reading: CRISIS_REPLY, source: "safety" })
  }
  const dateStr = localDateStr()
  const key = process.env.ANTHROPIC_API_KEY
  if (key) {
    try {
      const { system, user } = buildPrompt({ spread, question, cards })
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 700,
          temperature: 0.6,
          system,
          messages: [{ role: "user", content: user }],
        }),
        signal: AbortSignal.timeout(25000),
      })
      if (r.ok) {
        const data = await r.json()
        const text = (data?.content ?? [])
          .filter((b: { type: string }) => b.type === "text")
          .map((b: { text: string }) => b.text)
          .join("")
          .trim()
        if (text) return NextResponse.json({ reading: text, source: "ai" })
      }
    } catch {
      /* fall through to the offline template */
    }
  }
  return NextResponse.json({ reading: fallbackReading({ spread, question, cards, dateStr }), source: "fallback" })
}
