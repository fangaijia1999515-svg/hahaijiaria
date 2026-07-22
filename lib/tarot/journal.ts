import type { DrawnCard, JournalEntry } from "./types"

const TODAY_KEY = "mg.today.v1"
const JOURNAL_KEY = "mg.journal.v1"

type TodayRecord = DrawnCard & { dateStr: string; reading?: string; source?: string }

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked — the garden forgives */
  }
}

export function getToday(): TodayRecord | null {
  return safeGet<TodayRecord>(TODAY_KEY)
}

export function setToday(v: TodayRecord) {
  safeSet(TODAY_KEY, v)
}

export function listEntries(): JournalEntry[] {
  return safeGet<JournalEntry[]>(JOURNAL_KEY) ?? []
}

export function addEntry(e: Omit<JournalEntry, "id" | "ts">): JournalEntry {
  const entry: JournalEntry = {
    ...e,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ts: Date.now(),
  }
  safeSet(JOURNAL_KEY, [entry, ...listEntries()])
  return entry
}

export function updateNote(id: string, note: string) {
  safeSet(JOURNAL_KEY, listEntries().map((e) => (e.id === id ? { ...e, note } : e)))
}

export function removeEntry(id: string) {
  safeSet(JOURNAL_KEY, listEntries().filter((e) => e.id !== id))
}
