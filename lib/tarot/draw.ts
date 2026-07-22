import type { DrawnCard } from "./types"
import { DECK } from "@/components/tarot/deck"

export function localDateStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** 同一天永远同一张(种子 = 日期),当天不重抽。 */
export function todayCard(dateStr: string): DrawnCard {
  const rnd = mulberry32(hash("moonlit-" + dateStr))
  return { cardId: DECK[Math.floor(rnd() * DECK.length)].id, reversed: rnd() < 0.5 }
}

/** 不重复抽 n 张,正逆各半。 */
export function drawUnique(n: number): DrawnCard[] {
  const idx = new Set<number>()
  const buf = new Uint32Array(1)
  while (idx.size < n) {
    crypto.getRandomValues(buf)
    idx.add(buf[0] % DECK.length)
  }
  return [...idx].map((i) => {
    crypto.getRandomValues(buf)
    return { cardId: DECK[i].id, reversed: buf[0] % 2 === 0 }
  })
}
