"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cardById, CardArt } from "@/components/tarot/deck"
import { SPREADS } from "@/lib/tarot/meanings"
import { listEntries, updateNote, removeEntry } from "@/lib/tarot/journal"
import type { JournalEntry } from "@/lib/tarot/types"

const SPREAD_EN: Record<string, string> = {
  daily: "Daily card",
  single: "One card",
  "triad-ppf": "Past · Present · Future",
  "triad-sab": "Situation · Obstacle · Advice",
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
function fmtDate(dateStr: string) {
  const [, m, d] = dateStr.split("-").map(Number)
  return m && d ? `${MON[m - 1]} ${d}` : dateStr
}

function fmtTime(ts: number) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

export default function GardenJournal() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    setEntries(listEntries())
  }, [])

  const del = (id: string) => {
    if (!window.confirm("Delete this entry?")) return
    removeEntry(id)
    setEntries(listEntries())
  }

  return (
    <main className="mg-main">
      <h1 className="mg-h1">Journal</h1>
      <p className="mg-sub">Every draw, kept in moonlight. Add a line about how it felt.</p>

      {entries && entries.length === 0 && (
        <div className="mg-center">
          <p className="mg-reading" style={{ textAlign: "center" }}>Nothing here yet. Today’s first card is waiting on Home.</p>
          <Link className="mg-btn" href="/garden">
            Draw today’s card
          </Link>
        </div>
      )}

      <div className="mg-entries">
        {(entries ?? []).map((e) => (
          <article key={e.id} className="mg-entry">
            <header className="mg-entryhead">
              <span className="mg-entrydate">{fmtDate(e.dateStr)} · {fmtTime(e.ts)}</span>
              <span className="mg-entryspread">{SPREAD_EN[e.spread] ?? SPREADS[e.spread]?.zh ?? e.spread}</span>
              <button type="button" className="mg-entrydel" aria-label="Delete" onClick={() => del(e.id)}>
                ×
              </button>
            </header>
            <div className="mg-entrycards">
              {e.cards.map((c, i) => {
                const card = cardById(c.cardId)
                return (
                  <figure key={i} className="mg-mini">
                    <div style={c.reversed ? { transform: "rotate(180deg)" } : undefined}>
                      <CardArt card={card} uid={`j-${e.id}-${i}`} />
                    </div>
                    <figcaption>
                      {card.name}
                      <i>{c.reversed ? "reversed" : "upright"}</i>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
            {e.question && <p className="mg-qecho" style={{ textAlign: "left" }}>“{e.question}”</p>}
            <p
              className={`mg-entrytext${open === e.id ? " is-open" : ""}`}
              onClick={() => setOpen(open === e.id ? null : e.id)}
              title={open === e.id ? "Show less" : "Show more"}
            >
              {e.reading}
            </p>
            <textarea
              className="mg-note"
              defaultValue={e.note ?? ""}
              placeholder="A line or two about how it felt"
              rows={1}
              onBlur={(ev) => {
                updateNote(e.id, ev.target.value)
              }}
            />
          </article>
        ))}
      </div>
    </main>
  )
}
