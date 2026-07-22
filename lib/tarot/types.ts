export type SpreadId = "daily" | "single" | "triad-sab" | "triad-ppf"

export type DrawnCard = { cardId: string; reversed: boolean }

export type JournalEntry = {
  id: string
  ts: number
  dateStr: string
  spread: SpreadId
  question?: string
  cards: DrawnCard[]
  reading: string
  source: "ai" | "fallback" | "safety"
  note?: string
}

export type CardMeaning = { light: string[]; shadow: string[]; imagery: string[] }
