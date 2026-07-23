"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cardById, CardArt, displayName } from "@/components/tarot/deck"
import { SPREADS } from "@/lib/tarot/meanings"
import { listEntries, updateNote, removeEntry } from "@/lib/tarot/journal"
import type { JournalEntry } from "@/lib/tarot/types"

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
    if (!window.confirm("删除这一条手记?")) return
    removeEntry(id)
    setEntries(listEntries())
  }

  return (
    <main className="mg-main">
      <h1 className="mg-h1">手记</h1>
      <p className="mg-sub">月光替你记住的每一次抽牌,可以补写两句当时的感受</p>

      {entries && entries.length === 0 && (
        <div className="mg-center">
          <p className="mg-reading" style={{ textAlign: "center" }}>还没有手记。抽一张牌,月光会替你记住今天。</p>
          <Link className="mg-btn" href="/garden">
            去抽一张
          </Link>
        </div>
      )}

      <div className="mg-entries">
        {(entries ?? []).map((e) => (
          <article key={e.id} className="mg-entry">
            <header className="mg-entryhead">
              <span className="mg-entrydate">{e.dateStr} · {fmtTime(e.ts)}</span>
              <span className="mg-entryspread">{SPREADS[e.spread]?.zh ?? e.spread}</span>
              <button type="button" className="mg-entrydel" aria-label="删除" onClick={() => del(e.id)}>
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
                      {displayName(card)}
                      <i>{c.reversed ? "逆位" : "正位"}</i>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
            {e.question && <p className="mg-qecho" style={{ textAlign: "left" }}>「{e.question}」</p>}
            <p
              className={`mg-entrytext${open === e.id ? " is-open" : ""}`}
              onClick={() => setOpen(open === e.id ? null : e.id)}
              title={open === e.id ? "收起" : "展开全文"}
            >
              {e.reading}
            </p>
            <textarea
              className="mg-note"
              defaultValue={e.note ?? ""}
              placeholder="写两句此刻的感受…"
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
