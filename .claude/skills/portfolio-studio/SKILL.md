---
name: portfolio-studio
description: Use for ANY work on Aijia Fang's portfolio website (this repo, hahaijia.com, dev at localhost:3000) or its in-site future projects (e.g. the Moonlit Garden tarot product). Encodes her working contract, the studio loop, the verification law, this codebase's landmines, and her design doctrine. Written by Fable 5 as a full handoff for Opus 4.8.
---

# Portfolio Studio — how to work on this site

You are working for Aijia Fang (方爱嘉), a product/service designer + AI-native
builder applying to Bay Area AI-company design roles. This site IS her job
application. The bar is award-site quality (trionn / bymonolog / salakhov /
lusion). She is taste-driven, gives feedback via screenshots and screen
recordings, and notices single-pixel problems. Treat every one of her
complaints as真 until proven otherwise — she has been right every time.

## 1 · Communication contract (violating this = a bug)

- Reply in Chinese. Plain language; gloss any English jargon in one phrase.
- Conclusion first. Then supporting detail. Never make her re-read.
- ALWAYS give full clickable links: `http://localhost:3000/...` — never bare
  route names.
- End EVERY reply with a status line: `状态:已完成…/后台运行中…/等你决定…`,
  plus an explicit list of what SHE must decide.
- When background work finishes, tell her immediately.
- When direction is clear, keep working — never idle waiting for her reply
  (she has scolded exactly this). When direction is genuinely ambiguous in
  OPPOSITE directions, pick the safest reading, implement it, and state the
  interpretation + the one-line swap if she meant the other.
- Every round of feedback from her = a numbered checklist. Execute ALL items,
  one consolidated report at the end.

## 2 · Hard constraints (never break)

- **Dev server on :3000 is NEVER restarted.** No `next build` inside this
  repo either (it would clobber the live `.next`) — production builds run in
  an rsync'd copy under the scratchpad with `node_modules` symlinked.
- **No git.** Before EVERY edit, `cp` the touched files to
  `<scratchpad>/backups/<round-name>/`. Say where backups live in memory.
- **Real facts only.** Honors: Indigo Design Awards 2026 = Silver (UX,
  Interface & Navigation for Digital Design) + Silver (Interaction Design for
  Social Change) + Bronze (Interactive Design for Digital Design); IDA 2025 =
  Honorable Mention (no category published). Education: SCAD M.A. Service
  Design; Pratt B.I.D. Industrial Design, President's List. Experience:
  SCADpro×FINRA Service Designer 2025; NANOV Industrial Design Intern 2023.
  Never invent numbers, categories, project names, or years.
- **No em dashes in shipped copy.** Use `·` or commas. Her verbatim copy is
  sacred — never rewrite approved sentences without asking.
- **Version-keeping discipline**: while she is comparing options, every
  option gets its own permanent link (query param persisted via
  sessionStorage, e.g. `?cta=a|b|c`); NEVER overwrite in place. Once she
  picks, DELETE the losers and the param plumbing.
- Her MacBook class is ~1512×982 logical. Verify at 2000×1250, 1512×982 AND
  390×844 — desktop changes must not leak into mobile and vice versa (she
  explicitly ordered mobile-only rounds with "网页版本保持原样").

## 3 · The studio loop (how to decompose and decide)

1. **Parse her message into a numbered list.** She batches 3–8 asks per
   message, often mixing bug reports, design vetoes, and new ideas.
2. **Recordings are ground truth.** Any screen recording she sends: extract
   frames FIRST (`ffmpeg -vf fps=2..6`), build labeled contact sheets, and
   find the exact frames of the thing she's describing. Do not interpret a
   reference from memory — the one time frames were skimmed, the whole
   feature was built wrong (sideways page-turn missed).
3. **Design decisions**: for a real design call (new section grammar, layout
   system), consult the `aesthetics-director` agent with file pointers, her
   verbatim verdicts, and the real-facts list; implement its spec yourself.
   Small taste calls inside the locked system: decide, ship, let her judge.
4. **Bug reports**: evidence-first. Reproduce on HER path (see §4), measure
   (pixel samples, computed styles, element geometry), name the root cause in
   one sentence, THEN fix. Never fix by vibes; never claim fixed without the
   re-measurement.
5. **Ambiguity**: implement the safest reading + say so. Her "改一下 X" with
   an attached reference = follow the reference's grammar, translated into
   her design system (learn the grammar, never copy the style).
6. **She asks "你觉得呢?"**: give ONE recommendation with a one-line reason,
   not a survey.

## 4 · Verification law (hard-won; every item cost a real regression)

- **End every round with full-viewport screenshots** at 2000 + 1512 (and 390
  for mobile rounds) and LOOK at them. Numeric probes alone missed an
  off-center nav; a top-strip crop missed a full blank screen above the hero.
- **After editing files, wait 3–5s before testing** — the dev server
  recompiles; testing early loads the stale bundle and produces false
  negatives (this happened three times: "-540 matrix", nav hide "top 14",
  cta). If a fix "didn't work", reload once more before debugging.
- **WebGL layers**: alive ≠ visible. Check BOTH `isContextLost()` AND that
  no opaque ancestor/overlay covers the canvas (EdT lost its veil to an
  opaque wrapper gradient long after the context was healthy). Always test
  the CLIENT-SIDE NAVIGATION path (home → click card), not just direct URL
  loads — context eviction only happens in transit.
- **Scroll/pin behavior**: read real geometry from `.pin-spacer` rects, ride
  the pin in steps like a human, and verify the seated/end state (e.g. track
  x must equal `scrollWidth - innerWidth` exactly while still pinned).
  Headless browsers throttle rAF in background tabs — GSAP scrub catch-up is
  slow there; poll in-page or compute from formulas, don't trust one
  screenshot's timing.
- **Pixel standards**: resting states across a change should diff ≈0.000%
  strong pixels (>18/255); animation self-noise baseline is ~0.01%. Compare
  same-position screenshots; videos/carets pollute diffs — mask or note them.
- **Color hunts**: to find "what is this band?", use
  `document.elementFromPoint(x,y)` + computed backgroundColor down a column.
- **browse CLI** (`~/.claude/skills/gstack/browse/dist/browse`): viewport
  resets between sessions — set `viewport WxH` then VERIFY with
  `js "innerWidth"`. Screenshots need `--viewport` or you get full-page
  captures (diffs become garbage). Synthetic `PointerEvent` dispatches work
  for hover/cursor testing.

## 5 · This codebase's landmines (all real, all bled for)

- **The CSS build pipeline EATS rules.** Confirmed eaten: every
  build-processed `backdrop-filter` (lab-demo.css), new rules inside
  `@layer base` in globals.css, and pseudo-element rules (`::before`) in
  v2.css. LAW: anything that MUST render goes inline on the element or into
  a runtime-injected `<style>` (see `REFRACT_CSS` / `LIVECARDS_CSS` in
  `app/work-classic/nav-lens-filter.tsx`). Plain class rules in v2.css /
  classic-ds.css have been reliable.
- **CSS import order on /v2**: zone.css loads AFTER v2.css → equal
  specificity loses. Mobile overrides of zone-owned surfaces need
  `.zone-lab.v2-cardszone { ... !important }`.
- **GSAP + ScrollTrigger**:
  - `lib/gsap.ts` is the ONLY import point (gsap, useGSAP, ScrollTrigger,
    SplitText, V2_EASE). Lenis singleton via `lib/lenis.ts`.
  - **Scrub normalization trap**: ScrollTrigger maps pin progress onto the
    timeline's own duration. A "tail" or "hold" MUST exist as timeline time —
    pad with `tl.to({}, { duration: 1 - usedTime }, usedTime)` or it is
    silently normalized away.
  - **Font-dependent geometry**: tween targets that depend on measured
    widths must be FUNCTIONS (`x: () => -(track.scrollWidth - innerWidth)`)
    with `invalidateOnRefresh: true`; fonts.ready triggers a refresh.
  - Pinned overlays/overlines collide with the fixed nav — pad pinned stages
    ~110px+ from the top.
- **WebGL discipline** (`app/lab/bg/flow-effects.tsx`):
  - NEVER call `loseContext()` in cleanup. Always `preventDefault()` on
    `webglcontextlost`, listen to `webglcontextrestored`, rebuild the full
    pipeline there, and nudge with `WEBGL_lose_context.restoreContext()`
    after ~400ms. Route transitions evict contexts (5 live GL layers on /v2).
  - A canvas gets ONE context ever; StrictMode remounts strand dead ones.
  - H.264 hardware decode caps at 4096px width — re-encode big videos.
- **Layout traps**: `.classic-ds` carries `min-height:100vh` (it's a page
  wrapper — as a nav-only bridge it inserts a blank screen; flatten with
  inline height 0). Composited children (`will-change`) escape ancestor
  border-radius clips — paint moving colors on the element's OWN background.
  `.v2wg-cell--throughline`'s `overflow:hidden` is LOAD-BEARING (stops the
  open line from widening the track = the strip bug).
- **The liquid-glass pill nav** (`components/navigation.tsx` + lab-demo.css):
  centered by `left:50% + translateX(-50%)` with `!important` top/left. Any
  inline transform must COMPOSE the X (`translateX(-50%) translateY(...)`);
  a bare translateY threw it off-center. The auto-hide reads scroll
  direction; mobile menu blocks hiding.
- **Next Link interception**: the global curtain transition intercepts
  internal links in the CAPTURE phase (`document.addEventListener('click',
  h, true)`) — bubble phase is too late, Link already routed.
- **Old-site tokens**: `.section-cream` sets colors AND background — never
  put it on layout wrappers; the zero-width fixed marker inside the nav
  bridge feeds Navigation's scroll-spy instead.

## 6 · Her design doctrine (the taste law — apply to ALL future sections)

- **Quiet luxury system (LOCKED)**: cream #F5F0E8 ground, ink #2D2D2D,
  taupe muted, forest/sage accent, champagne #C9A468/#9A7736 as the metal;
  Cormorant-class display serif (`--ds-font-display`, weight 500), Hanken
  body, IBM-Plex-class mono overlines. Tokens in `styles/design-tokens.css`.
  Spec sheets in `public/design system/`. Learn reference GRAMMAR, never
  copy reference STYLE (references are dark/neon; this site is not).
- **One complete theme, one memory point**: every motion continues a motif
  (dune/valley sand, water, the leaf mark, liquid glass, the hairline+plus
  rule). No isolated effects. **Animation meaning must equal copy meaning**
  (the gap-close window holds the code that closes it; the medals stagger
  like jewelry being laid down).
- **Transitions are EVENTS**: they happen only WHILE turning; resting pages
  are pixel-pristine (0.000% diff). Nothing partial-height (bands read as
  dirt). Reversible (scrub). The site's one dark moment is the cards deck;
  dark→light→dark whiplash is banned (she killed a black panel for this).
- **One idea per section.** Giant serif moments carry the voice; mono
  overlines carry structure; body text carries proof. Buttons/pills: the
  glass family or hairline ghosts — never heavy borders, never trend-chips.
- Her decisions are FINAL once stated ("定了/确定/可以") — do not relitigate.
  A retracted feature stays dead (list: rounded-corner statement rise, 换季
  colour glide, seams 1–6, rise/wipe turns, brown flower transition, 3D
  monogram cursor, exclusion-blend cursor, frost-vs-liquid comparison,
  Shape/System/Software standalone section, footer sunken mark, "Open to
  roles" line, counting-braggy intro line).

## 7 · Site map (final composition as shipped 2026-07-19)

/v2 (THE site; `/` 301s here in prod via next.config.ts):
1. **Hero** `components/v2/hero.tsx` — LOCKED valley photo, serif title, CTA
   pill (material variants `?cta=`, pending her pick), pearl cursor.
2. **Statement** `statement.tsx` — light panel, dune-soft ground
   (`DuneSoftScoped`), word-by-word read, hairline+plus, credo = "Shape, /
   system, / software.", plain square arrival (NO entrance treatment).
3. **WorkGallery** `work-gallery.tsx` — pinned horizontal track: lead cell +
   3 project cards (Nuzzle → Skya → Eau de Toi, each with recruiter tag
   pills) + Moonlit Garden card (tarot, `zoom` art) + **throughline panel**
   (full-viewport cell, cream + DuneSoft ground): sideways page-turn, then
   the LiveCode window (self-typing gap-close source) squeezes to one word
   space as "Designed to feel, built to ship." closes; sub-claim lands;
   settle beat; unpin. Timeline math: hold 0.15ih → pan (functional target)
   → closeSpan 1.2ih → tail 0.5ih, padded to duration 1.
4. **Background** `postwork.tsx` RecordSection — pinned 130% with scroll-step
   tabs Education/Experience/Honors (uneven zones 0.42/0.84; pending queue +
   blur-dissolve switches; clicking a tab scrolls to its zone), trionn
   client-stories grammar, intro line "A short record of where this practice
   comes from." sharing the right column's left edge.
5. **Cards deck** `V2CardsZone` in story.tsx + `app/lab/zone/*` — the dark
   moment (noir + dune backs, default; `?cards=`/`?back=` comparison params
   still live pending her final pick). Cream feather div masks the top seam;
   entry runway 42vh, exit 36vh; mobile: zone painted #191713 to the water.
6. **WaterClose** `water-close.tsx` + `app/lab/water/*` — full-viewport
   monument footer on the live ripple sim (mobile 62svh, single-column bar):
   Contact / big line / links / Santa Clara clock / echo line "The organic
   made digital." (the bookend).
- **Global**: liquid-glass pill Navigation (auto-hide down/show up) +
  NavLensFilter (Snell refraction, Chromium-gated) + QuietCursor (cream
  pearl; `?cursor=off`) + sand curtain route transition (capture-phase link
  interceptor) mounted app-wide.

/work-classic/{nuzzle,skya,eau-de-toi}: the real case studies (indexable).
veil-new ground + liquid glass nav/cards; surface cards all share
`bg-[var(--cl-surface)]` + `--cl-well-ring` inset (auto-joins the glass
register); NEXT PROJECT triangle nuzzle→edt→skya cycle (via each page's
tail); minimal © rail (no border line); `.cl-hero-media` full-bleed 4/3 on
mobile. EdT: transparent body gradient (veil must show), dual award links
top-right, ledger panels for Business Viability.

Old site: `app/page.tsx` + old components — retired in place, reachable only
if the root redirect is removed. Don't spend effort there.

## 8 · Current state, params, and pending her-decisions

- Live comparison params: `?cta=a|b|c` (hero CTA material — SHE MUST PICK,
  then hard-code the winner and delete the plumbing), `?cards=` / `?back=`
  (deck style — default noir+dune pending final verdict), `?cursor=off`.
- Deployment: Vercel project `aijia-portfolio` (`.vercel/project.json`).
  Deploy = `npx vercel --prod` from the repo (login is hers). Production
  build must be validated in the scratchpad COPY first (never in-repo).
- Resume at `public/aijia-fang-resume.pdf` = her 2026C Product Designer PDF.
- The tarot product (Moonlit Garden): full brainstorm + locked decisions in
  auto-memory (`portfolio-loop-system.md` and the tarot memory entries), art
  bible at `~/Desktop/塔罗牌美术指南.md`, deck backs in `public/image/cards/`.
  Process gate: design doc → her review → writing-plans BEFORE any code.
- Auto-memory (`~/.claude/projects/-Users-hahaijiarah/memory/`) holds the
  full chronicle — read `portfolio-loop-system.md` before big rounds; append
  every round's decisions/lessons there (bash heredoc append, not Edit).

## 9 · Report template (end of every round)

```
已完成 ✅ <一句话总结>

## <每个编号项的结果,结论先行,配 http://localhost:3000/... 链接>

**等你决定**:<她要拍板的事,逐条>
**状态:已完成,等你验收 / 后台运行中(何时回报)**
```
