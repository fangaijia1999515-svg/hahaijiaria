"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CardArt, cardById, DECK } from "@/components/tarot/deck"
import { localDateStr } from "@/lib/tarot/draw"
import { getToday, setToday, addEntry } from "@/lib/tarot/journal"
import { crisisCheck, CRISIS_REPLY } from "@/lib/tarot/prompt"
import { PaperGrain } from "@/components/tarot/paper-grain"
import type { DrawnCard } from "@/lib/tarot/types"

type TodayState = DrawnCard & { reading?: string; source?: string; question?: string }

const BACK_SRC = "/image/cards/moonlit-cover-md.jpg"

/* ---- 首页已抽态 essence 行(内容接口,2026-09-03)----
   英文关键词库(内容线)到货后:把 ESSENCE_PLACEHOLDER 换成完整 78 张映射——
   key = card id(components/tarot/deck.tsx),value = { light, shadow } 各三个 EN 词(逗号分隔),
   正位取 light、逆位取 shadow,词序与 lib/tarot/meanings.ts 对齐。
   未收录的卡自动降级为只显示 "{CardEN} · Upright/Reversed",不留空行。 */
const ESSENCE_PLACEHOLDER: Record<string, { light?: string; shadow?: string }> = {
  "major-17": { light: "hope, calm, rhythm" },
}

/**
 * 三屏 hi-fi 落地(2026-09-03,像素基准 scratchpad/hifi-3screens.html):
 * 屏1 晨纸问题页(大问句 + 细金线输入 + 两浮珠 + 薄纱 dock)→
 * 屏2 夜幕抽牌空间(夜色自下涌起 500ms,对角牌河缓速漂移/可拖/点选)→
 * 屏3 揭晓(选中牌飞至中央放大翻面,金辉自牌后晕开)→ 破晓回晨纸看解读。
 * 当日一张规则不变:今天抽过 → 晨纸直接显示今日牌小卡与"明天再来"。
 * 危机词分支在进入夜幕前拦截,不消耗当日一张。
 */

/* ---- 屏1 · 晨雾粉山(手绘贝塞尔,照抄 hi-fi s1-ground) ---- */
function MorningGround() {
  return (
    <div className="mgp-ground" aria-hidden="true">
      <svg viewBox="0 0 390 340" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mgpfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".42" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="mgpm1">
            <rect width="390" height="340" fill="url(#mgpfade)" />
          </mask>
        </defs>
        <g mask="url(#mgpm1)">
          <path d="M-8,168 C30,132 76,150 120,118 C168,84 224,118 268,100 C312,84 356,104 398,88 L398,348 -8,348 Z" fill="#A9BCCB" opacity=".4" filter="blur(7px)" />
          <path d="M-8,206 C44,168 92,196 146,158 C196,124 252,168 306,146 C344,132 374,148 398,134 L398,348 -8,348 Z" fill="#E9C5C1" opacity=".58" filter="blur(5px)" />
          <path d="M-8,238 C40,254 84,222 144,242 C198,260 240,228 300,248 C344,262 376,240 398,232 L398,348 -8,348 Z" fill="#F5EDE1" opacity=".72" filter="blur(9px)" />
          <path d="M-8,262 C24,238 68,258 122,226 C186,190 244,244 302,218 C342,201 372,224 398,206 L398,348 -8,348 Z" fill="#DF9C98" opacity=".52" filter="blur(2.5px)" />
          <path d="M-8,300 C48,316 108,284 176,302 C240,318 296,288 350,306 C370,312 388,306 398,300 L398,348 -8,348 Z" fill="#F5EDE1" opacity=".96" filter="blur(7px)" />
        </g>
      </svg>
    </div>
  )
}

const PETAL_D =
  "M7.4 1.2 C11.4 3.8 14 8.6 13.2 13.2 C12.6 16.4 10 18.2 7.2 17.8 C3.8 17.3 1.2 13.9 1.6 9.8 C2 5.9 4.4 2.6 7.4 1.2 Z"

function Petal({ style, w, h, rot, opacity }: { style: React.CSSProperties; w: number; h: number; rot: number; opacity: number }) {
  return (
    <svg className="mgp-petal" style={style} width={w} height={h} viewBox="0 0 15 19" aria-hidden="true">
      <path d={PETAL_D} fill="#E8C0C6" opacity={opacity} transform={`rotate(${rot} 7.5 9.5)`} />
    </svg>
  )
}

/* ---- 文案(content-deck-v1 D 表) ---- */
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"]

function dayparts(hour: number): { part: string; greet: string } {
  if (hour >= 5 && hour < 11) return { part: "MORNING", greet: "Good morning. The day is still unwritten." }
  if (hour >= 11 && hour < 17) return { part: "AFTERNOON", greet: "Good afternoon. Leave a little room for yourself." }
  if (hour >= 17 && hour < 22) return { part: "EVENING", greet: "Good evening. The garden holds the day's last light." }
  return { part: "LATE NIGHT", greet: "It's late. The garden is up with you." }
}

/* ---- 屏2 · 夜幕牌河:78 张真牌背沿对角轴缓速漂移,可拖拽,点选=抽中 ----
   近实远虚 = 按"卡中心到屏中心的轴向距离"分三桶(焦点/中景/远景),
   O(1) 数学推算不读 DOM;桶变化才写样式,CSS transition 负责平滑。 */
const RIVER_DEG = -50
const AX = Math.cos((RIVER_DEG * Math.PI) / 180)
const AY = Math.sin((RIVER_DEG * Math.PI) / 180)
const CW = 170
const STEP = CW + 26

type FlyFrom = { cx: number; cy: number; w: number; h: number; rot: number }

const BUCKETS = [
  { scale: 1.1, blur: 0, veil: 0 },
  { scale: 1, blur: 0.6, veil: 0.45 },
  { scale: 0.94, blur: 1.5, veil: 0.62 },
]

function NightRiver({ frozen, onPick }: { frozen: boolean; onPick: (c: DrawnCard, from: FlyFrom) => void }) {
  const [order] = useState<number[]>(() => {
    const a = Array.from({ length: DECK.length }, (_, i) => i)
    const buf = new Uint32Array(1)
    for (let i = a.length - 1; i > 0; i--) {
      crypto.getRandomValues(buf)
      const j = buf[0] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  })
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardEls = useRef<(HTMLButtonElement | null)[]>([])
  const veilEls = useRef<(HTMLDivElement | null)[]>([])
  const buckets = useRef<number[]>([])
  const tilts = useRef<number[]>([])
  const offset = useRef(-DECK.length * STEP)
  const dragging = useRef(false)
  const dragFrom = useRef({ x: 0, y: 0, start: 0 })
  const moved = useRef(false)
  const done = useRef(false)
  const frozenRef = useRef(frozen)
  frozenRef.current = frozen

  const n = DECK.length * 2
  /* 每张卡的静态摆动(确定性,不用随机) */
  const wob = useRef<{ ty: number; rot: number }[]>(
    Array.from({ length: n }, (_, i) => ({ ty: Math.sin(i * 1.7) * 10, rot: Math.sin(i * 2.3) * 2.2 })),
  )

  useEffect(() => {
    let raf = 0
    let last = 0
    const half = DECK.length * STEP
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 80) : 0
      last = now
      const track = trackRef.current
      if (track && !done.current && !frozenRef.current) {
        /* 缓速向月而行(10px/s,沿轴向右上) */
        if (!dragging.current) offset.current += dt * 0.01
        if (offset.current <= -half * 1.5) offset.current += half
        if (offset.current > -half * 0.5) offset.current -= half
        track.style.transform = `translate3d(${offset.current}px,0,0)`
        /* 分桶(近实远虚)+ 反向旋转:河的位置沿对角轴,牌面几乎立着
           (hi-fi 语法:中央 -1.5°,沿河从 -22° 渐变到 +20°)。
           倾角量化到 1°,和桶一起变化才写样式。 */
        for (let i = 0; i < n; i++) {
          const pos = offset.current + i * STEP + CW / 2
          const d = Math.abs(pos)
          const b = d < 115 ? 0 : d < 330 ? 1 : 2
          const tiltQ = Math.round(Math.max(-22, Math.min(20, pos * 0.045)))
          const key = b * 1000 + tiltQ
          tilts.current[i] = tiltQ
          if (buckets.current[i] !== key) {
            buckets.current[i] = key
            const el = cardEls.current[i]
            const veil = veilEls.current[i]
            if (el) {
              const w = wob.current[i]
              const spec = BUCKETS[b]
              el.style.transform = `translateY(${w.ty}px) rotate(${-RIVER_DEG + tiltQ + w.rot * 0.5}deg) scale(${spec.scale})`
              el.style.filter = spec.blur ? `blur(${spec.blur}px)` : "none"
              el.classList.toggle("is-focus", b === 0)
            }
            if (veil) veil.style.opacity = String(BUCKETS[b].veil)
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [n])

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (done.current || frozenRef.current) return
    dragging.current = true
    moved.current = false
    dragFrom.current = { x: e.clientX, y: e.clientY, start: offset.current }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const dx = e.clientX - dragFrom.current.x
    const dy = e.clientY - dragFrom.current.y
    /* 拖拽位移投影到河的对角轴上 */
    const proj = dx * AX + dy * AY
    if (Math.abs(proj) > 7 || Math.abs(dx) + Math.abs(dy) > 14) moved.current = true
    offset.current = dragFrom.current.start + proj
  }, [])
  const onUp = useCallback(() => {
    dragging.current = false
  }, [])

  const pick = useCallback(
    (i: number, deckIdx: number, el: HTMLButtonElement) => {
      if (moved.current || done.current || frozenRef.current) return
      done.current = true
      const r = el.getBoundingClientRect()
      const key = buckets.current[i] ?? 0
      const b = key >= 0 ? Math.floor(key / 1000) : 0
      const scale = BUCKETS[Math.max(0, Math.min(2, b))].scale
      const w = wob.current[i]
      const from: FlyFrom = {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: CW * scale,
        h: 255 * scale,
        rot: (tilts.current[i] ?? 0) + w.rot * 0.5,
      }
      el.style.visibility = "hidden"
      const buf = new Uint32Array(1)
      crypto.getRandomValues(buf)
      onPick({ cardId: DECK[deckIdx].id, reversed: buf[0] % 2 === 0 }, from)
    },
    [onPick],
  )

  return (
    <div
      className="mgn-river"
      style={frozen ? { opacity: 0, transition: "opacity 0.45s ease", pointerEvents: "none" } : undefined}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="mgn-axis">
        <div className="mgn-track" ref={trackRef}>
          {[0, 1].map((copy) =>
            order.map((deckIdx, j) => {
              const i = copy * DECK.length + j
              return (
                <button
                  key={`${copy}-${deckIdx}`}
                  type="button"
                  className="mgn-card"
                  ref={(el) => {
                    cardEls.current[i] = el
                  }}
                  onClick={(e) => pick(i, deckIdx, e.currentTarget)}
                  aria-label="Draw this card"
                  tabIndex={copy === 0 ? 0 : -1}
                >
                  <img src={BACK_SRC} alt="" draggable={false} />
                  <PaperGrain soft={0.3} blotch={0} radius={13} />
                  <div
                    className="mgn-cveil"
                    ref={(el) => {
                      veilEls.current[i] = el
                    }}
                    style={{ opacity: 0.45 }}
                  />
                </button>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}

export default function GardenHome() {
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<"ask" | "today" | "safety">("ask")
  const [question, setQuestion] = useState("")
  const [drawn, setDrawn] = useState<TodayState | null>(null)
  const [showReading, setShowReading] = useState(false)
  const [loading, setLoading] = useState(false)
  /* 夜幕沉浸层(屏2/3) */
  const [night, setNight] = useState<"off" | "river" | "fly" | "reveal">("off")
  const [up, setUp] = useState(false)
  const [nightQuestion, setNightQuestion] = useState<string | null>(null)
  const [fly, setFly] = useState<FlyFrom | null>(null)
  const [flyTo, setFlyTo] = useState(false)
  const [flyTarget, setFlyTarget] = useState<{ x: number; y: number } | null>(null)
  const [dawn, setDawn] = useState<"off" | "in" | "out">("off")
  const timers = useRef<number[]>([])

  useEffect(() => {
    setMounted(true)
    const t = getToday()
    if (t && t.dateStr === localDateStr()) {
      setDrawn(t)
      setView("today")
    }
    const list = timers.current
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  /* 浮珠:入夜(夜色自下涌起 500ms)。危机词在这里拦,不消耗当日一张。 */
  const enterNight = useCallback(
    (withQuestion: boolean) => {
      if (question && crisisCheck(question)) {
        setView("safety")
        return
      }
      setNightQuestion(withQuestion && question ? question : null)
      setNight("river")
      setUp(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setUp(true)))
    },
    [question],
  )

  const fetchReading = useCallback(async (rec: TodayState) => {
    setLoading(true)
    const dateStr = localDateStr()
    try {
      const r = await fetch("/api/garden/reading", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ spread: "daily", question: rec.question, cards: [{ cardId: rec.cardId, reversed: rec.reversed }] }),
      })
      const data = await r.json()
      const full: TodayState = { ...rec, reading: data.reading as string, source: data.source as string }
      setToday({ ...full, dateStr })
      setDrawn(full)
      addEntry({ dateStr, spread: "daily", question: rec.question, cards: [{ cardId: rec.cardId, reversed: rec.reversed }], reading: data.reading, source: data.source })
    } catch {
      const full: TodayState = { ...rec, reading: "The moonlight is a little shy. Come back in a moment to hear this card.", source: "fallback" }
      setToday({ ...full, dateStr })
      setDrawn(full)
    } finally {
      setLoading(false)
    }
  }, [])

  /* 牌河点选:记录当日一张 → 飞至中央翻面(屏3)→ 解读在后台生长 */
  const onPicked = useCallback(
    (d: DrawnCard, from: FlyFrom) => {
      const rec: TodayState = { ...d, question: nightQuestion || undefined }
      setDrawn(rec)
      setToday({ ...rec, dateStr: localDateStr() })
      setFly(from)
      setFlyTo(false)
      setFlyTarget({ x: Math.round(window.innerWidth / 2), y: Math.round(window.innerHeight * 0.4) })
      setNight("fly")
      requestAnimationFrame(() => requestAnimationFrame(() => setFlyTo(true)))
      later(() => setNight("reveal"), 900)
      void fetchReading(rec)
    },
    [nightQuestion, fetchReading],
  )

  /* 揭晓 → 破晓转场(暖光晕开 600ms)回晨纸看解读 */
  const goReading = useCallback(() => {
    setDawn("in")
    later(() => {
      setNight("off")
      setUp(false)
      setFly(null)
      setFlyTo(false)
      setView("today")
      setShowReading(true)
      setDawn("out")
      later(() => setDawn("off"), 650)
    }, 600)
  }, [])

  const now = new Date()
  const { part, greet } = dayparts(now.getHours())
  const dateLine = `${MONTHS[now.getMonth()]} ${now.getDate()} · ${part}`
  const card = drawn ? cardById(drawn.cardId) : null
  const faceWord = drawn?.reversed ? "reversed" : "upright"
  const faceTitle = drawn?.reversed ? "Reversed" : "Upright"
  const essenceWords = drawn ? (drawn.reversed ? ESSENCE_PLACEHOLDER[drawn.cardId]?.shadow : ESSENCE_PLACEHOLDER[drawn.cardId]?.light) : undefined

  return (
    <main className="mgp-page">
      <div className="mgp-bg" aria-hidden>
        <PaperGrain soft={0.6} blotch={0.15} />
      </div>
      <MorningGround />
      <Petal style={{ top: 150, left: 52 }} w={15} h={19} rot={-24} opacity={0.62} />
      <Petal style={{ top: 322, right: 44 }} w={13} h={17} rot={38} opacity={0.5} />
      <Petal style={{ top: 508, left: 34 }} w={11} h={15} rot={102} opacity={0.44} />

      <div className={`mgp-col${mounted && view === "today" ? " mgp-col--flow" : ""}`}>
        <div className="mgp-date">{mounted ? dateLine : ""}</div>

        {mounted && view === "ask" && (
          <>
            <div className="mgp-hero">
              <div className="mgp-hero-q">
                What would
                <br />
                you like to ask?
              </div>
              <div className="mgp-hero-greet">{greet}</div>
            </div>
            <div className="mgp-ask">
              <input
                className="mgp-input"
                value={question}
                maxLength={60}
                placeholder="Set your question down, gently"
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") enterNight(true)
                }}
                aria-label="Your question for today"
              />
              <div className="mgp-goldline">
                <div className="mgp-goldglow" />
              </div>
            </div>
            <div className="mgp-beads">
              <button type="button" className="mgp-bead mgp-bead--fill" onClick={() => enterNight(true)}>
                <PaperGrain soft={0.4} blotch={0} radius={999} />
                Ask &amp; draw
              </button>
              <button type="button" className="mgp-bead mgp-bead--ghost" onClick={() => enterNight(false)}>
                Hold it in mind
              </button>
            </div>
          </>
        )}

        {mounted && view === "today" && drawn && card && (
          <div className="mgp-today">
            <div className="mgp-hero-q" style={{ fontSize: 26, textAlign: "center" }}>
              Today · {card.name}, {faceWord}
            </div>
            <div className="mgp-today-card">
              <div style={drawn.reversed ? { transform: "rotate(180deg)" } : undefined}>
                <CardArt card={card} uid="today-sm" />
              </div>
            </div>
            <div className="mgp-essence">{`${card.name} · ${faceTitle}${essenceWords ? ` — ${essenceWords}` : ""}`}</div>
            {/* 闲置已抽态才在卡下说"明天";展开解读时这句移到解读末尾作收尾(她 2026-09-03 拍板) */}
            {!showReading && <div className="mgp-today-sub">Tomorrow, ask something new.</div>}
            {!showReading && (
              <button type="button" className="mgp-readlink" onClick={() => setShowReading(true)}>
                READ AGAIN
                <span className="mgp-readline" />
              </button>
            )}
            {showReading && (
              <div className="mgp-panel">
                <PaperGrain soft={0.5} blotch={0.1} radius={20} />
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div className="mgp-panel-top">READING</div>
                  <div className="mgp-panel-name">
                    {card.name} · {faceTitle}
                  </div>
                  <span className="mgp-panel-face">{drawn.question ? `“${drawn.question}”` : "held in mind"}</span>
                  <div className="mgp-panel-line">{card.line}</div>
                  {loading && (
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                      <span className="mgh-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  )}
                  {drawn.reading && <p className="mgp-panel-text">{drawn.reading}</p>}
                  {drawn.reading && !loading && (
                    <>
                      <div className="mgp-panel-close">Tomorrow, ask something new.</div>
                      <button
                        type="button"
                        className="mgp-backlink"
                        onClick={() => {
                          setShowReading(false)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                      >
                        Back to the garden
                        <span className="mgp-readline" />
                      </button>
                      <div style={{ textAlign: "center", marginTop: 12 }}>
                        <button
                          type="button"
                          className="mgp-reset"
                          onClick={() => {
                            try {
                              window.localStorage.removeItem("mg.today.v1")
                            } catch {}
                            window.location.reload()
                          }}
                        >
                          Test · reshuffle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {mounted && view === "safety" && (
          <div className="mgp-safety">
            <div className="mgp-safety-title">You matter more than any card.</div>
            <p className="mgp-safety-text">{CRISIS_REPLY}</p>
            <button
              type="button"
              className="mgp-safety-back"
              onClick={() => {
                setQuestion("")
                setView("ask")
              }}
            >
              Return to the garden
            </button>
          </div>
        )}
      </div>

      {/* 薄纱 dock(仅晨纸;夜幕/揭晓 chrome 极简)。backdrop-filter 必须内联(管线) */}
      {night === "off" && (
        <nav className="mgp-dock" style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
          <span className="is-on">Home</span>
          <Link href="/garden/ask">Draw</Link>
          <Link href="/garden/journal">Journal</Link>
          <Link href="/garden/deck">Me</Link>
        </nav>
      )}

      {/* ---- 屏2/3:夜幕沉浸层 ---- */}
      {night !== "off" && (
        <div className={`mgn-veil${up ? " is-up" : ""}`}>
          <div className="mgn-inner">
            <div className="mgn-moon" style={night !== "river" ? { opacity: 0, transition: "opacity 0.45s ease" } : undefined} />
            <NightRiver frozen={night !== "river"} onPick={onPicked} />
            <div className="mgn-q" style={night !== "river" ? { opacity: 0, transition: "opacity 0.45s ease" } : undefined}>
              {nightQuestion ? `“${nightQuestion}”` : "The garden is listening"}
            </div>
            <span className="mgn-dot" style={{ width: 3, height: 3, top: "24%", left: 66, opacity: 0.9 }} />
            <span className="mgn-dot" style={{ width: 2, height: 2, top: "34%", left: 118, opacity: 0.6 }} />
            <span className="mgn-dot" style={{ width: 2.5, height: 2.5, bottom: 186, right: 74, opacity: 0.75 }} />
            <span className="mgn-dot" style={{ width: 2, height: 2, bottom: 132, right: 132, opacity: 0.5 }} />
            <div className="mgn-hint" style={night !== "river" ? { opacity: 0, transition: "opacity 0.45s ease" } : undefined}>
              TRUST YOUR INTUITION · PICK ONE
            </div>

            {/* 屏3:金辉 + 牌名 + 进解读 */}
            <div className={`mgr-halo${night === "reveal" ? " is-on" : ""}`} />
            {night === "reveal" && card && drawn && (
              <>
                <div className="mgr-name is-on">
                  <div className="mgr-name-zh">{card.name}</div>
                  <div className="mgr-name-en">
                    {faceTitle}
                    {card.arcana === "major" ? ` · ${ROMAN[card.number ?? 0]}` : ""}
                  </div>
                </div>
                <button type="button" className="mgr-go is-on" onClick={goReading}>
                  READ TODAY&rsquo;S GUIDANCE
                  <span className="mgr-goline" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 飞行中的牌(屏2→屏3):从河中位置飞至中央放大 + 翻面 */}
      {fly && flyTarget && card && drawn && (
        <div
          className={`mgr-flywrap${flyTo ? " is-lit" : ""}`}
          style={
            flyTo
              ? { left: flyTarget.x, top: flyTarget.y, width: 252, height: 378, transform: "translate(-50%, -50%) rotate(0deg)" } /* 落定=正 0°;逆位 180° 只在 .mg-art 内层(她 2026-09-04 打回牌歪) */
              : { left: fly.cx, top: fly.cy, width: fly.w, height: fly.h, transform: `translate(-50%, -50%) rotate(${fly.rot}deg)` }
          }
        >
          <div className={`mg-flip${flyTo ? " is-flipped" : ""}`} style={{ width: "100%", height: "100%" }}>
            <div className="mg-face mg-face--back">
              <img src={BACK_SRC} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <PaperGrain soft={0.35} blotch={0} radius={14} />
            </div>
            <div className="mg-face mg-face--front">
              <div className="mg-art" style={drawn.reversed ? { transform: "rotate(180deg)" } : undefined}>
                <CardArt card={card} uid="reveal" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 破晓:暖光晕开 600ms */}
      {dawn !== "off" && <div className={`mgr-dawn${dawn === "in" ? " is-on" : ""}`} />}
    </main>
  )
}
