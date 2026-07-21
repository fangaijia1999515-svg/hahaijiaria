/**
 * /lab/tarot — MAJOR ARCANA, full 22 (2026-07-19, her verdicts on the anchor
 * demo: Version A 淡彩 wins; title smaller + lower; corner sprigs REMOVED;
 * hairlines thickened for legibility; "有哲学的感觉,可以继续,很可爱").
 *
 * Every card comes from ONE code template + a shared element library, so the
 * whole deck is consistent by construction. Scenes follow her art bible
 * (~/Desktop/塔罗牌美术指南.md): the Moonlit Garden told in 22 corners —
 * faceless small figures, no religious symbols, the hard cards (Death, Devil,
 * Tower) painted gently. Palette = her chosen cover card.
 */
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tarot · Major Arcana · lab",
  robots: { index: false, follow: false },
}

const P = {
  paper: "#F5ECD9",
  paperDeep: "#EFE3CA",
  mist: "#BFD4CC",
  teal: "#9DBDB4",
  tealDeep: "#7FA79E",
  ink: "#5E7D76",
  gold: "#CDB68C",
  goldDeep: "#B79E6F",
  cream: "#FAF4E6",
  glow: "#F3E4BD",
}

const W = 600
const H = 900

/* ---- shared furniture (line weights bumped per her note) ----------------- */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.26 0 0 0 0.05 0" />
        <feComposite operator="over" in2="SourceGraphic" />
      </filter>
      <radialGradient id={`halo-${id}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={P.glow} stopOpacity="0.95" />
        <stop offset="55%" stopColor={P.glow} stopOpacity="0.4" />
        <stop offset="100%" stopColor={P.glow} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`moonface-${id}`} cx="42%" cy="38%" r="70%">
        <stop offset="0%" stopColor={P.cream} />
        <stop offset="100%" stopColor={P.glow} />
      </radialGradient>
      <linearGradient id={`waterfade-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={P.mist} stopOpacity="0.85" />
        <stop offset="100%" stopColor={P.teal} stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id={`dawn-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={P.glow} stopOpacity="0.9" />
        <stop offset="100%" stopColor={P.glow} stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

function Frame() {
  return (
    <g fill="none" strokeLinecap="round">
      <rect x={26} y={26} width={W - 52} height={H - 52} rx={30} stroke={P.tealDeep} strokeWidth={3} opacity={0.9} />
      <rect x={38} y={38} width={W - 76} height={H - 76} rx={22} stroke={P.tealDeep} strokeWidth={1.6} opacity={0.55} />
    </g>
  )
}

function Axis({ ys }: { ys: number[] }) {
  return (
    <g fill={P.tealDeep} opacity={0.55}>
      {ys.map((y, i) => (
        <circle key={i} cx={W / 2} cy={y} r={i % 2 ? 3 : 4.4} />
      ))}
    </g>
  )
}

/* smaller + lower title (her note), numeral quieter up top */
function Title({ n, name }: { n: string; name: string }) {
  return (
    <g textAnchor="middle">
      <text x={W / 2} y={104} fontFamily="var(--font-ds-plex-mono), ui-monospace" fontSize={17} letterSpacing={6} fill={P.ink} opacity={0.8}>
        {n}
      </text>
      <text x={W / 2} y={H - 66} fontFamily="var(--font-ds-display), serif" fontSize={29} letterSpacing={2.4} fill={P.ink} opacity={0.95}>
        {name}
      </text>
      <line x1={W / 2 - 40} x2={W / 2 + 40} y1={H - 48} y2={H - 48} stroke={P.goldDeep} strokeWidth={1.4} opacity={0.7} />
    </g>
  )
}

function Ripples({ cx, cy, base, n, squash = 0.36, step = 22 }: { cx: number; cy: number; base: number; n: number; squash?: number; step?: number }) {
  return (
    <g fill="none" stroke={P.tealDeep} opacity={0.45}>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={base + i * step} ry={(base + i * step) * squash} strokeWidth={2} opacity={1 - i / (n + 1)} />
      ))}
    </g>
  )
}

function Hill({ y, h, tone, o = 1 }: { y: number; h: number; tone: string; o?: number }) {
  return <path d={`M40,${y} C ${W * 0.3},${y - h} ${W * 0.7},${y - h} ${W - 40},${y} L ${W - 40},${y + h} L 40,${y + h} Z`} fill={tone} opacity={o} />
}

function Tree({ x, y, s, tone }: { x: number; y: number; s: number; tone: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill={tone}>
      <rect x={-2.6} y={-6} width={5.2} height={32} rx={2.4} />
      <ellipse cx={0} cy={-26} rx={34} ry={24} />
      <ellipse cx={-20} cy={-14} rx={18} ry={13} />
      <ellipse cx={20} cy={-14} rx={18} ry={13} />
    </g>
  )
}

function Figure({ x, y, s, kneel = false }: { x: number; y: number; s: number; kneel?: boolean }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill={P.ink} opacity={0.85}>
      <circle cx={0} cy={-30} r={7.4} />
      {kneel ? (
        <path d="M-7,-22 C -9,-8 -7,0 -1,4 L 9,10 C 13,12 15,8 12,5 L 4,-2 C 8,-10 7,-18 5,-23 Z" />
      ) : (
        <path d="M-6,-23 C -8,-6 -7,8 -5,22 L -1,22 C -2,10 -1,0 0,-6 C 1,0 2,10 1,22 L 5,22 C 7,8 8,-6 6,-23 Z" />
      )}
    </g>
  )
}

function Star8({ cx, cy, r, tone, o = 1 }: { cx: number; cy: number; r: number; tone: string; o?: number }) {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const rr = i % 2 === 0 ? r : r * 0.42
    const a = (Math.PI * i) / 8 - Math.PI / 2
    pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`)
  }
  return <polygon points={pts.join(" ")} fill={tone} opacity={o} />
}

function Dust({ pts }: { pts: [number, number][] }) {
  return (
    <g fill={P.goldDeep} opacity={0.7}>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} />
      ))}
    </g>
  )
}

function Plant({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x},${y})${flip ? " scale(-1,1)" : ""}`} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.75} strokeLinecap="round">
      <path d="M0,0 C 10,-40 4,-70 20,-100" />
      <path d="M6,-32 C 16,-40 24,-42 34,-40" />
      <path d="M11,-62 C 20,-70 28,-72 37,-71" />
      <circle cx={36} cy={-41} r={3} fill={P.goldDeep} stroke="none" />
      <circle cx={39} cy={-72} r={2.6} fill={P.goldDeep} stroke="none" />
    </g>
  )
}

function Bloom({ x, y, s, tone = P.cream }: { x: number; y: number; s: number; tone?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-11} rx={6.6} ry={11.5} fill={tone} stroke={P.goldDeep} strokeWidth={0.9} opacity={0.96} transform={`rotate(${a})`} />
      ))}
      <circle r={5} fill={P.gold} />
    </g>
  )
}

function Card({ id, n, name, children }: { id: string; n: string; name: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16, boxShadow: "0 10px 30px rgba(94,80,56,0.15)" }} role="img" aria-label={name}>
      <Defs id={id} />
      <rect width={W} height={H} fill={P.paper} />
      <rect width={W} height={H} fill={P.paperDeep} opacity={0.4} filter={`url(#grain-${id})`} />
      {children}
      <Frame />
      <Title n={n} name={name} />
    </svg>
  )
}

/* ---- the 22 scenes (Version A 淡彩 throughout) ---------------------------- */

const Fool = (id: string) => (
  <Card id={id} n="0" name="The Fool">
    <circle cx={W * 0.68} cy={330} r={150} fill={`url(#halo-${id})`} />
    <path d={`M40,620 C 200,560 300,585 360,545 C 430,500 470,505 ${W - 40},470 L ${W - 40},${H - 130} L 40,${H - 130} Z`} fill={P.teal} opacity={0.5} />
    <path d={`M40,650 C 210,600 330,615 ${W - 40},540 L ${W - 40},${H - 128} L 40,${H - 128} Z`} fill={P.mist} opacity={0.7} />
    <Figure x={352} y={520} s={1.5} />
    <g transform="translate(300,560)">
      <circle r={7} fill={P.cream} stroke={P.goldDeep} strokeWidth={1.4} />
      <circle r={2.4} fill={P.goldDeep} />
      <path d="M0,7 C -2,18 -1,26 0,34" stroke={P.ink} strokeWidth={2} fill="none" />
    </g>
    <Dust pts={[[430, 260], [470, 380], [390, 300], [520, 430], [200, 240]]} />
    <Axis ys={[160, 190]} />
  </Card>
)

const Magician = (id: string) => (
  <Card id={id} n="I" name="The Magician">
    <circle cx={W / 2} cy={300} r={170} fill={`url(#halo-${id})`} />
    {/* moonbeam falling on the table */}
    <path d={`M${W / 2 - 56},142 L ${W / 2 + 56},142 L ${W / 2 + 24},556 L ${W / 2 - 24},556 Z`} fill={P.glow} opacity={0.32} />
    {/* the stone table */}
    <rect x={140} y={560} width={320} height={28} rx={14} fill={P.tealDeep} opacity={0.55} />
    <rect x={184} y={588} width={232} height={56} rx={13} fill={P.teal} opacity={0.35} />
    {/* four gifts afloat: water / branch / gold stone / feather */}
    <circle cx={170} cy={456} r={44} fill={`url(#halo-${id})`} opacity={0.9} />
    <path d="M170,420 C 188,450 188,478 170,496 C 152,478 152,450 170,420 Z" fill={P.teal} opacity={0.95} />
    <circle cx={262} cy={430} r={44} fill={`url(#halo-${id})`} opacity={0.9} />
    <path d="M258,384 C 264,420 262,452 258,484" stroke={P.goldDeep} strokeWidth={3} fill="none" strokeLinecap="round" />
    <ellipse cx={278} cy={412} rx={14} ry={6.5} fill={P.gold} transform="rotate(-16 278 412)" />
    <ellipse cx={242} cy={442} rx={13} ry={6} fill={P.gold} transform="rotate(18 242 442)" />
    <circle cx={258} cy={378} r={4.6} fill={P.goldDeep} />
    <circle cx={352} cy={442} r={44} fill={`url(#halo-${id})`} opacity={0.9} />
    <circle cx={352} cy={442} r={25} fill={P.gold} />
    <circle cx={352} cy={442} r={14} fill="none" stroke={P.goldDeep} strokeWidth={1.8} opacity={0.6} />
    <circle cx={440} cy={452} r={44} fill={`url(#halo-${id})`} opacity={0.9} />
    <path d="M440,398 C 424,432 424,466 440,500 C 454,466 454,432 440,398 Z" fill={P.cream} stroke={P.ink} strokeWidth={1.8} opacity={0.95} />
    <path d="M440,406 L 440,492 M 440,430 C 432,424 428,418 427,410 M 440,452 C 449,446 452,440 453,432" stroke={P.ink} strokeWidth={1.4} fill="none" opacity={0.7} strokeLinecap="round" />
    <Dust pts={[[150, 350], [452, 330], [210, 530], [396, 528]]} />
    <Axis ys={[690, 718]} />
  </Card>
)

const Priestess = (id: string) => (
  <Card id={id} n="II" name="The High Priestess">
    {/* the veil, parted a hand's width */}
    <path d={`M84,140 C 150,180 190,320 178,620 L 84,620 Z`} fill={P.mist} opacity={0.75} />
    <path d={`M${W - 84},140 C ${W - 150},180 ${W - 190},320 ${W - 178},620 L ${W - 84},620 Z`} fill={P.mist} opacity={0.75} />
    <path d={`M84,140 C 150,180 190,320 178,620`} fill="none" stroke={P.tealDeep} strokeWidth={2} opacity={0.5} />
    <path d={`M${W - 84},140 C ${W - 150},180 ${W - 190},320 ${W - 178},620`} fill="none" stroke={P.tealDeep} strokeWidth={2} opacity={0.5} />
    {/* the moon seen only in the water between */}
    <circle cx={W / 2} cy={520} r={120} fill={`url(#halo-${id})`} />
    <ellipse cx={W / 2} cy={560} rx={120} ry={34} fill={`url(#waterfade-${id})`} />
    <circle cx={W / 2} cy={548} r={34} fill={`url(#moonface-${id})`} opacity={0.95} />
    <Ripples cx={W / 2} cy={560} base={48} n={2} squash={0.26} />
    {/* the closed book, waiting */}
    <g transform={`translate(${W / 2},664)`}>
      <rect x={-46} y={-13} width={92} height={26} rx={5} fill={P.cream} stroke={P.goldDeep} strokeWidth={1.6} />
      <line x1={0} y1={-13} x2={0} y2={13} stroke={P.goldDeep} strokeWidth={1.4} />
    </g>
    <Dust pts={[[150, 250], [450, 250], [180, 430], [420, 430]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Empress = (id: string) => (
  <Card id={id} n="III" name="The Empress">
    <circle cx={W / 2} cy={430} r={190} fill={`url(#halo-${id})`} />
    {/* the throne-mound, overflowing */}
    <Hill y={560} h={120} tone={P.teal} o={0.45} />
    <Hill y={620} h={90} tone={P.mist} o={0.6} />
    {/* blossoms cascading down the throne-mound */}
    <Bloom x={W / 2} y={424} s={1.9} tone={P.glow} />
    <Bloom x={W / 2 - 74} y={466} s={1.35} />
    <Bloom x={W / 2 + 72} y={460} s={1.5} tone={P.glow} />
    <Bloom x={W / 2 - 128} y={514} s={1.05} />
    <Bloom x={W / 2 + 128} y={508} s={1.1} />
    <Bloom x={W / 2 - 34} y={506} s={1.15} tone={P.glow} />
    <Bloom x={W / 2 + 36} y={504} s={1.0} />
    {/* leaves tucked between */}
    <ellipse cx={W / 2 - 104} cy={478} rx={16} ry={7} fill={P.teal} transform={`rotate(-24 ${W / 2 - 104} 478)`} opacity={0.85} />
    <ellipse cx={W / 2 + 106} cy={480} rx={16} ry={7} fill={P.teal} transform={`rotate(22 ${W / 2 + 106} 480)`} opacity={0.85} />
    <Dust pts={[[170, 300], [430, 290], [140, 520], [460, 520], [300, 250]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Emperor = (id: string) => (
  <Card id={id} n="IV" name="The Emperor">
    {/* straight moonlight */}
    <rect x={W / 2 - 34} y={130} width={68} height={430} fill={P.glow} opacity={0.4} />
    {/* stepped stone terrace */}
    <rect x={130} y={560} width={340} height={30} rx={6} fill={P.tealDeep} opacity={0.55} />
    <rect x={170} y={590} width={260} height={30} rx={6} fill={P.tealDeep} opacity={0.4} />
    <rect x={210} y={620} width={180} height={30} rx={6} fill={P.tealDeep} opacity={0.28} />
    {/* geometric trees, clipped to order */}
    <g fill={P.teal} opacity={0.85}>
      <circle cx={200} cy={500} r={38} />
      <rect x={196} y={530} width={8} height={30} rx={4} fill={P.ink} />
      <circle cx={400} cy={500} r={38} />
      <rect x={396} y={530} width={8} height={30} rx={4} fill={P.ink} />
    </g>
    <circle cx={W / 2} cy={300} r={54} fill={`url(#moonface-${id})`} opacity={0.9} />
    <Dust pts={[[150, 240], [450, 240], [150, 420], [450, 420]]} />
    <Axis ys={[700, 728]} />
  </Card>
)

const Hierophant = (id: string) => (
  <Card id={id} n="V" name="The Hierophant">
    {/* light pouring through the gate, down the path */}
    <circle cx={W / 2} cy={400} r={150} fill={`url(#halo-${id})`} />
    <path d={`M${W / 2 - 44},426 L ${W / 2 + 44},426 L ${W / 2 + 70},664 L ${W / 2 - 70},664 Z`} fill={P.glow} opacity={0.45} />
    {/* the stone gate, feet on the ground */}
    <g transform={`translate(${W / 2},430)`}>
      <path d="M-78,130 L -78,-14 C -78,-78 78,-78 78,-14 L 78,130" fill="none" stroke={P.tealDeep} strokeWidth={9} opacity={0.85} strokeLinecap="round" />
    </g>
    {/* avenue of trees, walking you toward it */}
    <Tree x={122} y={620} s={1.15} tone={P.teal} />
    <Tree x={W - 122} y={620} s={1.15} tone={P.teal} />
    <Tree x={186} y={568} s={0.85} tone={P.teal} />
    <Tree x={W - 186} y={568} s={0.85} tone={P.teal} />
    <Tree x={232} y={528} s={0.6} tone={P.tealDeep} />
    <Tree x={W - 232} y={528} s={0.6} tone={P.tealDeep} />
    {/* the path's two soft edges */}
    <path d={`M182,668 C 230,600 262,568 ${W / 2 - 52},556 M${W - 182},668 C ${W - 230},600 ${W - 262},568 ${W / 2 + 52},556`} stroke={P.gold} strokeWidth={2.6} fill="none" opacity={0.7} strokeLinecap="round" />
    <Dust pts={[[150, 230], [450, 220], [300, 172]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Lovers = (id: string) => (
  <Card id={id} n="VI" name="The Lovers">
    <circle cx={W / 2} cy={360} r={170} fill={`url(#halo-${id})`} />
    {/* two trees, leaning until their crowns just touch */}
    <path d="M196,634 C 200,552 216,478 246,424" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
    <ellipse cx={248} cy={388} rx={58} ry={46} fill={P.teal} opacity={0.92} />
    <path d={`M${W - 196},634 C ${W - 200},552 ${W - 216},478 ${W - 246},424`} stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
    <ellipse cx={W - 248} cy={388} rx={58} ry={46} fill={P.tealDeep} opacity={0.55} />
    {/* the one glowing fruit, born exactly where they meet */}
    <circle cx={W / 2} cy={412} r={34} fill={`url(#halo-${id})`} />
    <circle cx={W / 2} cy={412} r={13} fill={P.gold} stroke={P.goldDeep} strokeWidth={1.8} />
    <path d={`M${W / 2},399 C ${W / 2 - 2},390 ${W / 2 + 3},384 ${W / 2 + 6},380`} stroke={P.goldDeep} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Hill y={640} h={60} tone={P.mist} o={0.6} />
    <Dust pts={[[160, 260], [440, 250], [300, 190], [180, 500], [420, 500]]} />
    <Axis ys={[700, 728]} />
  </Card>
)

const Chariot = (id: string) => (
  <Card id={id} n="VII" name="The Chariot">
    {/* stardust sweeping up and forward — what pulls the cart */}
    <circle cx={430} cy={300} r={130} fill={`url(#halo-${id})`} opacity={0.85} />
    <path d="M336,436 C 380,400 404,364 424,318" fill="none" stroke={P.goldDeep} strokeWidth={2.6} strokeDasharray="1 13" strokeLinecap="round" opacity={0.95} />
    <g fill={P.goldDeep}>
      {[[430, 302, 4], [456, 280, 3], [412, 268, 2.6], [478, 306, 2.4], [444, 330, 2.8], [468, 250, 2], [408, 236, 1.8]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={0.9} />
      ))}
    </g>
    <Star8 cx={432} cy={296} r={11} tone={P.gold} />
    {/* the little cart, mid-journey */}
    <Hill y={608} h={66} tone={P.teal} o={0.42} />
    <g transform="translate(282,502)">
      <rect x={-72} y={-58} width={144} height={76} rx={16} fill={P.cream} stroke={P.tealDeep} strokeWidth={2.8} />
      <path d="M-72,-26 L 72,-26" stroke={P.tealDeep} strokeWidth={1.6} opacity={0.5} />
      <circle cx={-38} cy={38} r={26} fill={P.paper} stroke={P.ink} strokeWidth={3} />
      <circle cx={38} cy={38} r={26} fill={P.paper} stroke={P.ink} strokeWidth={3} />
      <circle cx={-38} cy={38} r={5} fill={P.ink} />
      <circle cx={38} cy={38} r={5} fill={P.ink} />
      <path d="M72,-14 C 96,-24 112,-44 122,-64" stroke={P.goldDeep} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
    {/* glowing wheel-tracks left behind */}
    <path d="M96,600 C 160,586 210,578 244,556 M110,632 C 180,618 232,608 268,584" stroke={P.glow} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.95} />
    <Dust pts={[[160, 250], [300, 196], [150, 420]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Strength = (id: string) => (
  <Card id={id} n="VIII" name="Strength">
    <circle cx={W / 2} cy={430} r={180} fill={`url(#halo-${id})`} />
    {/* the great gentle beast, curled at rest */}
    <g fill={P.teal} opacity={0.92}>
      <path d="M172,584 C 168,500 232,446 330,448 C 424,450 476,502 478,584 Z" />
      <circle cx={212} cy={498} r={48} />
      <circle cx={184} cy={458} r={13} />
      <circle cx={226} cy={452} r={13} />
    </g>
    {/* its starlight eye, half-dreaming */}
    <Star8 cx={202} cy={492} r={8.5} tone={P.cream} />
    {/* the small friend whose hand rests on its brow */}
    <Figure x={128} y={568} s={1.3} kneel />
    <path d="M142,540 C 156,528 172,516 186,506" stroke={P.ink} strokeWidth={2.8} fill="none" strokeLinecap="round" />
    <Hill y={640} h={50} tone={P.mist} o={0.55} />
    <Dust pts={[[440, 300], [180, 280], [470, 420]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Hermit = (id: string) => (
  <Card id={id} n="IX" name="The Hermit">
    {/* the hill he climbed alone */}
    <Hill y={560} h={150} tone={P.teal} o={0.5} />
    <Hill y={620} h={100} tone={P.mist} o={0.6} />
    {/* the lantern with a star inside, held out ahead */}
    <circle cx={W / 2 + 52} cy={414} r={104} fill={`url(#halo-${id})`} />
    <Figure x={W / 2 - 20} y={452} s={1.5} />
    <path d={`M${W / 2 - 12},416 C ${W / 2 + 4},410 ${W / 2 + 22},406 ${W / 2 + 36},404`} stroke={P.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    <g transform={`translate(${W / 2 + 52},424)`}>
      <path d="M-9,-24 C -9,-34 9,-34 9,-24" fill="none" stroke={P.goldDeep} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={-17} y={-24} width={34} height={44} rx={8} fill={P.cream} stroke={P.goldDeep} strokeWidth={2.6} opacity={0.96} />
      <Star8 cx={0} cy={-2} r={9.5} tone={P.gold} />
    </g>
    <Dust pts={[[170, 250], [430, 230], [140, 420], [470, 400]]} />
    <Axis ys={[700, 728]} />
  </Card>
)

const Wheel = (id: string) => (
  <Card id={id} n="X" name="Wheel of Fortune">
    <circle cx={W / 2} cy={410} r={200} fill={`url(#halo-${id})`} />
    {/* the great ring of petals and stars, mid-turn */}
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12
        const x = W / 2 + Math.cos(a) * 150
        const y = 410 + Math.sin(a) * 150
        return i % 2 === 0 ? (
          <g key={i} transform={`translate(${x},${y}) rotate(${(a * 180) / Math.PI + 90})`}>
            <path d="M0,-16 C 9,-6 9,6 0,16 C -9,6 -9,-6 0,-16 Z" fill={P.gold} opacity={0.95} />
          </g>
        ) : (
          <Star8 key={i} cx={x} cy={y} r={8} tone={P.tealDeep} o={0.8} />
        )
      })}
      <circle cx={W / 2} cy={410} r={104} fill="none" stroke={P.tealDeep} strokeWidth={2} opacity={0.5} strokeDasharray="2 10" />
    </g>
    {/* the still garden at the hub */}
    <circle cx={W / 2} cy={410} r={34} fill={P.mist} opacity={0.8} />
    <Tree x={W / 2} y={422} s={0.42} tone={P.ink} />
    <Dust pts={[[150, 220], [450, 210], [140, 620], [460, 620]]} />
    <Axis ys={[690, 718]} />
  </Card>
)

const Justice = (id: string) => (
  <Card id={id} n="XI" name="Justice">
    {/* the moonlight balance over still water */}
    <path d={`M${W / 2},170 L ${W / 2},250`} stroke={P.goldDeep} strokeWidth={2.4} />
    <path d={`M${W / 2 - 130},250 L ${W / 2 + 130},250`} stroke={P.goldDeep} strokeWidth={3} strokeLinecap="round" />
    <path d={`M${W / 2 - 130},250 L ${W / 2 - 130},330 M${W / 2 + 130},250 L ${W / 2 + 130},330`} stroke={P.goldDeep} strokeWidth={1.8} />
    <path d={`M${W / 2 - 168},330 C ${W / 2 - 154},364 ${W / 2 - 106},364 ${W / 2 - 92},330 Z`} fill={P.cream} stroke={P.goldDeep} strokeWidth={1.8} />
    <path d={`M${W / 2 + 92},330 C ${W / 2 + 106},364 ${W / 2 + 154},364 ${W / 2 + 168},330 Z`} fill={P.cream} stroke={P.goldDeep} strokeWidth={1.8} />
    {/* a flower weighed against a stone — both held level */}
    <g transform={`translate(${W / 2 - 130},322)`}>
      <circle r={9} fill={P.glow} stroke={P.goldDeep} strokeWidth={1.4} />
      <circle r={3} fill={P.gold} />
    </g>
    <circle cx={W / 2 + 130} cy={322} r={9} fill={P.teal} />
    <ellipse cx={W / 2} cy={560} rx={190} ry={46} fill={`url(#waterfade-${id})`} />
    <Ripples cx={W / 2} cy={560} base={60} n={3} squash={0.22} />
    <Dust pts={[[170, 420], [430, 420], [300, 640]]} />
    <Axis ys={[690, 718]} />
  </Card>
)

const Hanged = (id: string) => (
  <Card id={id} n="XII" name="The Hanged Man">
    {/* the branch he chose to hang from */}
    <path d={`M110,240 C 240,210 360,210 490,240`} stroke={P.ink} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
    <path d={`M${W / 2},232 L ${W / 2},334`} stroke={P.goldDeep} strokeWidth={2.2} />
    {/* upside-down, at peace */}
    <circle cx={W / 2} cy={392} r={96} fill={`url(#halo-${id})`} opacity={0.85} />
    <g transform={`translate(${W / 2},368) scale(1.7) rotate(180)`} fill={P.ink} opacity={0.88}>
      <circle cx={0} cy={-30} r={7.4} />
      <path d="M-6,-23 C -8,-6 -7,8 -5,22 L -1,22 C -2,10 -1,0 0,-6 C 1,0 2,10 1,22 L 5,22 C 7,8 8,-6 6,-23 Z" />
    </g>
    {/* the water shows him upright */}
    <ellipse cx={W / 2} cy={600} rx={170} ry={40} fill={`url(#waterfade-${id})`} />
    <g transform={`translate(${W / 2},614) scale(1.25)`} opacity={0.5}>
      <circle cx={0} cy={-30} r={7.4} fill={P.ink} />
      <path d="M-6,-23 C -8,-6 -7,8 -5,22 L -1,22 C -2,10 -1,0 0,-6 C 1,0 2,10 1,22 L 5,22 C 7,8 8,-6 6,-23 Z" fill={P.ink} />
    </g>
    <Ripples cx={W / 2} cy={600} base={56} n={2} squash={0.2} />
    <Dust pts={[[160, 300], [440, 300], [180, 480], [420, 480]]} />
    <Axis ys={[700, 728]} />
  </Card>
)

const Death = (id: string) => (
  <Card id={id} n="XIII" name="Death">
    <path d="M300,240 C 316,258 316,286 300,304 C 284,286 284,258 300,240 Z" fill={P.gold} opacity={0.95} transform="rotate(18 300 272)" />
    <path d="M330,180 C 340,192 338,206 328,214" fill="none" stroke={P.goldDeep} strokeWidth={1.8} opacity={0.6} />
    <line x1={110} x2={W - 110} y1={470} y2={470} stroke={P.tealDeep} strokeWidth={2.2} opacity={0.7} />
    <Ripples cx={300} cy={470} base={34} n={3} squash={0.22} step={26} />
    <g opacity={0.92}>
      <circle cx={300} cy={620} r={84} fill={`url(#halo-${id})`} />
      <path d="M300,668 C 298,640 299,616 300,596 M300,616 C 288,606 282,594 281,580 M300,604 C 312,596 318,586 319,572" fill="none" stroke={P.ink} strokeWidth={2.4} strokeLinecap="round" />
      <ellipse cx={281} cy={577} rx={7} ry={11} fill={P.teal} transform="rotate(-24 281 577)" />
      <ellipse cx={319} cy={569} rx={7} ry={11} fill={P.teal} transform="rotate(24 319 569)" />
    </g>
    <rect x={42} y={472} width={W - 84} height={H - 472 - 128} fill={`url(#waterfade-${id})`} opacity={0.35} />
    <Dust pts={[[420, 320], [180, 300], [440, 560], [170, 540]]} />
    <Axis ys={[160, 190]} />
  </Card>
)

const Temperance = (id: string) => (
  <Card id={id} n="XIV" name="Temperance">
    <circle cx={W / 2} cy={430} r={160} fill={`url(#halo-${id})`} />
    {/* two cups, tipped toward each other */}
    <g transform="translate(178,296) rotate(34)">
      <path d="M-34,-14 C -34,26 34,26 34,-14 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2.8} />
      <ellipse cx={0} cy={-14} rx={34} ry={7.5} fill={P.mist} stroke={P.tealDeep} strokeWidth={2.2} opacity={0.95} />
      <path d="M-10,26 L 10,26 L 14,38 L -14,38 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2} />
    </g>
    <g transform={`translate(${W - 178},296) rotate(-34)`}>
      <path d="M-34,-14 C -34,26 34,26 34,-14 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2.8} />
      <ellipse cx={0} cy={-14} rx={34} ry={7.5} fill={P.mist} stroke={P.tealDeep} strokeWidth={2.2} opacity={0.95} />
      <path d="M-10,26 L 10,26 L 14,38 L -14,38 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2} />
    </g>
    {/* two waters spilling from the lips, finding each other */}
    <path d={`M206,278 C 244,340 272,404 296,460`} stroke={P.teal} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
    <path d={`M${W - 206},278 C ${W - 244},340 ${W - 272},404 ${W - 296},460`} stroke={P.teal} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
    {/* braided into one band of light */}
    <path d={`M${W / 2},470 C ${W / 2 - 30},540 ${W / 2 + 30},600 ${W / 2},660`} stroke={P.glow} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.95} />
    <path d={`M${W / 2},470 C ${W / 2 + 30},540 ${W / 2 - 30},600 ${W / 2},660`} stroke={P.gold} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
    <ellipse cx={W / 2} cy={666} rx={62} ry={14} fill={`url(#waterfade-${id})`} />
    <Ripples cx={W / 2} cy={666} base={24} n={2} squash={0.22} step={16} />
    <Dust pts={[[160, 260], [440, 260], [170, 560], [430, 560]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Devil = (id: string) => (
  <Card id={id} n="XV" name="The Devil">
    {/* the moon still shines on this card too */}
    <circle cx={300} cy={330} r={130} fill={`url(#halo-${id})`} opacity={0.8} />
    <Hill y={600} h={64} tone={P.mist} o={0.55} />
    {/* vine passing behind the two shadows */}
    <path d="M158,472 C 220,428 380,428 442,472" fill="none" stroke={P.tealDeep} strokeWidth={4} opacity={0.75} />
    {/* two shadows, standing close */}
    <g fill={P.ink} opacity={0.7}>
      <circle cx={252} cy={432} r={11.5} />
      <path d="M242,446 C 240,478 241,512 244,542 L 251,542 C 251,516 251,496 252,480 C 253,496 253,516 253,542 L 260,542 C 263,512 264,478 262,446 C 256,440 248,440 242,446 Z" />
      <circle cx={348} cy={432} r={11.5} />
      <path d="M338,446 C 336,478 337,512 340,542 L 347,542 C 347,516 347,496 348,480 C 349,496 349,516 349,542 L 356,542 C 359,512 360,478 358,446 C 352,440 344,440 338,446 Z" />
    </g>
    {/* vine passing in front — the binding you can see */}
    <path d="M158,472 C 220,516 380,516 442,472" fill="none" stroke={P.tealDeep} strokeWidth={4.6} opacity={0.9} />
    <ellipse cx={210} cy={498} rx={13} ry={6} fill={P.teal} transform="rotate(24 210 498)" />
    <ellipse cx={390} cy={498} rx={13} ry={6} fill={P.teal} transform="rotate(-24 390 498)" />
    <ellipse cx={300} cy={514} rx={13} ry={6} fill={P.teal} />
    {/* and the knot on the right — already loosening, gold */}
    <path d="M442,472 C 476,458 492,462 500,440 C 508,418 486,404 470,416" fill="none" stroke={P.goldDeep} strokeWidth={3.4} strokeLinecap="round" />
    <circle cx={470} cy={416} r={4.6} fill={P.gold} />
    <Dust pts={[[170, 250], [430, 240], [300, 200]]} />
    <Axis ys={[690, 718]} />
  </Card>
)

const Tower = (id: string) => (
  <Card id={id} n="XVI" name="The Tower">
    <circle cx={370} cy={300} r={130} fill={`url(#halo-${id})`} opacity={0.7} />
    {/* a sand tower, tapering as it goes back to the wind */}
    <path d="M258,650 C 262,540 270,470 282,414 L 318,414 C 330,470 338,540 342,650 Z" fill={P.gold} opacity={0.92} />
    <path d="M282,414 L 288,368 L 312,368 L 318,414 Z" fill={P.gold} opacity={0.8} />
    <path d="M266,560 C 292,554 310,558 334,554 M272,486 C 294,480 308,484 328,480" stroke={P.paper} strokeWidth={4.6} fill="none" opacity={0.75} />
    {/* the crown is not falling — it is leaving, grain by grain */}
    <g fill={P.goldDeep}>
      {[
        [316, 344, 3.4], [336, 320, 3], [360, 296, 2.7], [388, 274, 2.4], [416, 254, 2.1],
        [340, 356, 2.6], [368, 336, 2.3], [398, 314, 2], [428, 292, 1.8], [452, 268, 1.6],
        [304, 322, 2.2], [326, 288, 1.9], [352, 258, 1.7], [382, 234, 1.5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={0.9} />
      ))}
    </g>
    <Hill y={660} h={54} tone={P.teal} o={0.4} />
    <Dust pts={[[150, 480], [456, 500]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

const Star = (id: string) => (
  <Card id={id} n="XVII" name="The Star">
    <circle cx={W / 2} cy={280} r={170} fill={`url(#halo-${id})`} />
    <Star8 cx={W / 2} cy={280} r={64} tone={P.gold} o={0.95} />
    <Star8 cx={W / 2} cy={280} r={30} tone={P.cream} />
    <Star8 cx={168} cy={200} r={13} tone={P.goldDeep} o={0.6} />
    <Star8 cx={438} cy={176} r={10} tone={P.goldDeep} o={0.5} />
    <ellipse cx={W / 2} cy={620} rx={190} ry={64} fill={`url(#waterfade-${id})`} />
    <Ripples cx={W / 2} cy={620} base={46} n={3} />
    <Star8 cx={W / 2} cy={620} r={22} tone={P.cream} o={0.75} />
    <Figure x={200} y={600} s={1.35} kneel />
    <Dust pts={[[150, 320], [460, 300], [180, 450], [430, 430], [300, 160]]} />
    <Axis ys={[430, 462, 494]} />
  </Card>
)

const Moon = (id: string) => (
  <Card id={id} n="XVIII" name="The Moon">
    <circle cx={W / 2} cy={300} r={190} fill={`url(#halo-${id})`} />
    <circle cx={W / 2} cy={300} r={92} fill={`url(#moonface-${id})`} opacity={0.98} />
    <g fill={P.mist}>
      <ellipse cx={200} cy={470} rx={150} ry={26} opacity={0.6} />
      <ellipse cx={410} cy={520} rx={160} ry={24} opacity={0.55} />
      <ellipse cx={230} cy={575} rx={140} ry={22} opacity={0.5} />
    </g>
    <path d={`M ${W / 2},640 C ${W / 2 - 40},560 ${W / 2 + 46},500 ${W / 2 - 10},420`} fill="none" stroke={P.goldDeep} strokeWidth={2.6} strokeDasharray="1 14" strokeLinecap="round" opacity={0.9} />
    <Plant x={120} y={640} />
    <Plant x={W - 120} y={640} flip />
    <Dust pts={[[170, 200], [450, 210], [140, 420], [470, 400]]} />
    <Axis ys={[660, 688]} />
  </Card>
)

const Sun = (id: string) => (
  <Card id={id} n="XIX" name="The Sun">
    <rect x={40} y={40} width={W - 80} height={330} fill={`url(#dawn-${id})`} opacity={0.85} />
    <circle cx={W / 2} cy={330} r={150} fill={`url(#halo-${id})`} />
    <circle cx={W / 2} cy={330} r={64} fill={P.glow} />
    <g stroke={P.goldDeep} strokeWidth={1.8} opacity={0.85} strokeLinecap="round">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12
        return (
          <line
            key={i}
            x1={W / 2 + Math.cos(a) * 84}
            y1={330 + Math.sin(a) * 84}
            x2={W / 2 + Math.cos(a) * (i % 2 ? 112 : 130)}
            y2={330 + Math.sin(a) * (i % 2 ? 112 : 130)}
          />
        )
      })}
    </g>
    <Hill y={600} h={70} tone={P.gold} o={0.5} />
    <Hill y={650} h={46} tone={P.teal} o={0.4} />
    <g fill={P.cream} stroke={P.goldDeep} strokeWidth={1.2}>
      {[[150, 620], [220, 646], [300, 630], [380, 650], [452, 624], [258, 594], [340, 596]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 5 : 6.6} />
      ))}
    </g>
    <Tree x={W / 2} y={560} s={1.05} tone={P.tealDeep} />
    <Axis ys={[160, 190]} />
  </Card>
)

const Judgement = (id: string) => (
  <Card id={id} n="XX" name="Judgement">
    {/* the column of light that calls */}
    <circle cx={W / 2} cy={250} r={120} fill={`url(#halo-${id})`} opacity={0.9} />
    <path d={`M${W / 2 - 70},140 L ${W / 2 + 70},140 L ${W / 2 + 34},640 L ${W / 2 - 34},640 Z`} fill={P.glow} opacity={0.48} />
    {/* every bud answers at once */}
    {[
      [200, 600, 0.9], [300, 585, 1.1], [400, 600, 0.9], [250, 620, 0.8], [350, 622, 0.8],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
        <path d="M0,44 C -1,26 -1,12 0,0" stroke={P.ink} strokeWidth={2.2} fill="none" />
        <path d="M0,2 C -12,-6 -13,-22 0,-30 C 13,-22 12,-6 0,2 Z" fill={P.cream} stroke={P.goldDeep} strokeWidth={1.6} />
        <circle cx={0} cy={-13} r={4} fill={P.gold} />
      </g>
    ))}
    {/* pollen rising like small yeses */}
    <g fill={P.goldDeep}>
      {[
        [280, 520, 2.4], [320, 480, 2], [296, 430, 2.2], [330, 380, 1.8], [305, 330, 1.9],
        [322, 280, 1.6], [298, 240, 1.6], [316, 200, 1.4],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={0.9 - i * 0.07} />
      ))}
    </g>
    <Hill y={660} h={44} tone={P.mist} o={0.6} />
    <Dust pts={[[160, 300], [440, 300]]} />
    <Axis ys={[700, 728]} />
  </Card>
)

const World = (id: string) => (
  <Card id={id} n="XXI" name="The World">
    <circle cx={W / 2} cy={420} r={210} fill={`url(#halo-${id})`} />
    {/* the four elements close the circle: branch / water / dune / stars */}
    <g fill="none" strokeLinecap="round">
      <path d={`M${W / 2 - 160},420 A 160,160 0 0 1 ${W / 2},260`} stroke={P.goldDeep} strokeWidth={4} />
      <path d={`M${W / 2},260 A 160,160 0 0 1 ${W / 2 + 160},420`} stroke={P.teal} strokeWidth={5} strokeDasharray="18 10" />
      <path d={`M${W / 2 + 160},420 A 160,160 0 0 1 ${W / 2},580`} stroke={P.gold} strokeWidth={6} />
    </g>
    <g fill={P.tealDeep}>
      {Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI * (0.55 + (0.4 * i) / 6)
        return <circle key={i} cx={W / 2 + Math.cos(a + Math.PI / 2) * 160} cy={420 + Math.sin(a + Math.PI / 2) * 160} r={i % 2 ? 3 : 4.4} />
      })}
    </g>
    {/* leaf-buds on the branch arc */}
    <circle cx={W / 2 - 158} cy={402} r={4} fill={P.goldDeep} />
    <circle cx={W / 2 - 132} cy={330} r={3.4} fill={P.goldDeep} />
    {/* the whole garden, small and complete, at the center */}
    <ellipse cx={W / 2} cy={470} rx={84} ry={22} fill={`url(#waterfade-${id})`} />
    <Tree x={W / 2} y={430} s={0.72} tone={P.tealDeep} />
    <Ripples cx={W / 2} cy={470} base={26} n={2} squash={0.24} step={16} />
    <Dust pts={[[150, 230], [450, 220], [140, 640], [460, 640]]} />
    <Axis ys={[170, 200]} />
  </Card>
)

/* ---- minor arcana (route 2 of the art bible): 40 pips + 16 courts --------- */

type Suit = "cups" | "wands" | "pentacles" | "swords"

const SUITS: { key: Suit; en: string; zh: string; line: string }[] = [
  { key: "cups", en: "Cups", zh: "圣杯", line: "水与情感 · 夜湖的语言" },
  { key: "wands", en: "Wands", zh: "权杖", line: "枝条与生长 · 行动的语言" },
  { key: "pentacles", en: "Pentacles", zh: "星币", line: "金石与沙丘 · 果实的语言" },
  { key: "swords", en: "Swords", zh: "宝剑", line: "风羽与月光 · 思绪的语言" },
]

/** one suit glyph, centered on (x,y), ~76 tall at s=1 — designed ONCE, reused 56× */
function Glyph({ suit, x, y, s, r = 0 }: { suit: Suit; x: number; y: number; s: number; r?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
      {suit === "cups" && (
        <g>
          <path d="M-26,-24 C -26,8 26,8 26,-24 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2.6} />
          <ellipse cx={0} cy={-24} rx={26} ry={6.5} fill={P.mist} stroke={P.tealDeep} strokeWidth={2} opacity={0.95} />
          <path d="M-13,-14 C -5,-9 5,-9 13,-14" fill="none" stroke={P.tealDeep} strokeWidth={1.6} opacity={0.7} />
          <path d="M-8,8 L 8,8 L 12,20 L -12,20 Z" fill={P.cream} stroke={P.tealDeep} strokeWidth={2} />
        </g>
      )}
      {suit === "wands" && (
        <g>
          <path d="M0,-32 C 3,-12 2,12 0,34" fill="none" stroke={P.goldDeep} strokeWidth={3.2} strokeLinecap="round" />
          <ellipse cx={11} cy={-12} rx={11.5} ry={5.5} fill={P.gold} transform="rotate(-24 11 -12)" />
          <ellipse cx={-10} cy={8} rx={10.5} ry={5} fill={P.gold} transform="rotate(22 -10 8)" />
          <circle cx={0} cy={-35} r={3.8} fill={P.goldDeep} />
        </g>
      )}
      {suit === "pentacles" && (
        <g>
          <circle cx={0} cy={0} r={23} fill={P.gold} />
          <Star8 cx={0} cy={0} r={11} tone={P.cream} />
        </g>
      )}
      {suit === "swords" && (
        <g transform="rotate(9)">
          {/* a wind-feather: leaning vane, bare quill tip, combed barbs */}
          <path d="M1,-36 C -13,-18 -15,8 -5,26 C 4,12 6,-16 1,-36 Z" fill={P.cream} stroke={P.ink} strokeWidth={1.9} />
          <path d="M1,-31 C -1,-10 -2,10 -8,37" fill="none" stroke={P.ink} strokeWidth={1.7} strokeLinecap="round" />
          <path d="M-2,-17 C -7,-19 -10,-22 -11,-26 M-3,-3 C -8,-5 -11,-8 -12,-12 M-4,11 C -9,9 -11,6 -12,3" fill="none" stroke={P.ink} strokeWidth={1.1} opacity={0.7} strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

const NUM_EN = ["", "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
const NUM_RO = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

/**
 * Every number card is its own small composition that carries the card's
 * meaning (her note: "不能一个就放一个、两个就放两个 — 每张要有意义").
 * Same furniture, same glyphs — but arranged to TELL the number's story.
 */
const PIP_SCENES: Record<Suit, { zh: string; render: (id: string) => React.ReactNode }[]> = {
  cups: [
    { zh: "心动初至", render: (id) => (<g>
      <circle cx={300} cy={386} r={150} fill={`url(#halo-${id})`} />
      <ellipse cx={300} cy={636} rx={214} ry={30} fill={`url(#waterfade-${id})`} />
      <Ripples cx={300} cy={636} base={56} n={2} squash={0.16} step={30} />
      <ellipse cx={158} cy={598} rx={84} ry={11} fill={P.mist} opacity={0.45} />
      <ellipse cx={446} cy={608} rx={76} ry={10} fill={P.mist} opacity={0.4} />
      <Glyph suit="cups" x={300} y={376} s={2.0} />
      <path d="M264,404 C 226,462 220,532 244,594 M336,404 C 374,462 380,532 356,594" fill="none" stroke={P.teal} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      <Axis ys={[168, 196]} />
    </g>) },
    { zh: "相遇", render: (id) => (<g>
      <circle cx={300} cy={396} r={130} fill={`url(#halo-${id})`} />
      <ellipse cx={300} cy={300} rx={150} ry={16} fill={P.mist} opacity={0.4} />
      <ellipse cx={300} cy={618} rx={196} ry={26} fill={`url(#waterfade-${id})`} />
      <Ripples cx={222} cy={608} base={22} n={2} squash={0.2} step={16} />
      <Ripples cx={378} cy={608} base={22} n={2} squash={0.2} step={16} />
      <Glyph suit="cups" x={222} y={428} s={1.35} />
      <Glyph suit="cups" x={378} y={428} s={1.35} />
      <path d="M252,402 C 280,374 320,374 348,402" fill="none" stroke={P.teal} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
      <Star8 cx={300} cy={368} r={10} tone={P.gold} />
      <Axis ys={[170, 198]} />
    </g>) },
    { zh: "举杯同庆", render: (id) => (<g>
      <circle cx={300} cy={400} r={140} fill={`url(#halo-${id})`} />
      <ellipse cx={300} cy={588} rx={200} ry={20} fill={`url(#waterfade-${id})`} opacity={0.6} />
      <Hill y={648} h={48} tone={P.mist} o={0.55} />
      <Glyph suit="cups" x={300} y={318} s={1.25} />
      <Glyph suit="cups" x={214} y={462} s={1.25} r={-14} />
      <Glyph suit="cups" x={386} y={462} s={1.25} r={14} />
      <Star8 cx={300} cy={424} r={9} tone={P.goldDeep} o={0.85} />
      <Dust pts={[[258, 388], [344, 384], [300, 250]]} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "小小的倦怠", render: (id) => (<g>
      <circle cx={300} cy={302} r={96} fill={`url(#halo-${id})`} opacity={0.6} />
      <Glyph suit="cups" x={300} y={302} s={1.05} />
      <ellipse cx={300} cy={434} rx={164} ry={18} fill={P.mist} opacity={0.55} />
      <ellipse cx={300} cy={472} rx={200} ry={14} fill={P.mist} opacity={0.35} />
      <Hill y={636} h={48} tone={P.mist} o={0.55} />
      <ellipse cx={300} cy={700} rx={190} ry={18} fill={`url(#waterfade-${id})`} opacity={0.5} />
      <Glyph suit="cups" x={202} y={582} s={1.1} />
      <Glyph suit="cups" x={300} y={582} s={1.1} />
      <Glyph suit="cups" x={398} y={582} s={1.1} />
      <Axis ys={[170, 198]} />
    </g>) },
    { zh: "洒了三杯,还有两杯", render: (id) => (<g>
      <circle cx={300} cy={368} r={110} fill={`url(#halo-${id})`} />
      <ellipse cx={300} cy={452} rx={180} ry={14} fill={P.mist} opacity={0.4} />
      <Glyph suit="cups" x={250} y={372} s={1.05} />
      <Glyph suit="cups" x={350} y={372} s={1.05} />
      <Glyph suit="cups" x={206} y={556} s={1.05} r={-96} />
      <Glyph suit="cups" x={300} y={574} s={1.05} r={102} />
      <Glyph suit="cups" x={394} y={556} s={1.05} r={96} />
      <path d="M228,576 C 236,606 246,628 262,646 M300,596 C 300,620 302,638 308,652 M372,576 C 364,606 354,628 338,646" fill="none" stroke={P.teal} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <ellipse cx={300} cy={664} rx={206} ry={24} fill={`url(#waterfade-${id})`} />
      <Ripples cx={300} cy={664} base={48} n={2} squash={0.15} step={26} />
      <Axis ys={[170, 198]} />
    </g>) },
    { zh: "温柔的回忆", render: (id) => (<g>
      <circle cx={296} cy={436} r={140} fill={`url(#halo-${id})`} />
      <circle cx={170} cy={236} r={20} fill={`url(#moonface-${id})`} opacity={0.8} />
      <Hill y={636} h={46} tone={P.mist} o={0.5} />
      <ellipse cx={434} cy={646} rx={110} ry={15} fill={`url(#waterfade-${id})`} opacity={0.7} />
      <Glyph suit="cups" x={238} y={496} s={1.5} />
      <Glyph suit="cups" x={382} y={516} s={1.0} />
      <Bloom x={238} y={428} s={1.15} tone={P.glow} />
      <Bloom x={382} y={468} s={0.8} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "太多的选择", render: (id) => (<g>
      <ellipse cx={300} cy={352} rx={180} ry={20} fill={P.mist} opacity={0.5} />
      <ellipse cx={300} cy={476} rx={204} ry={22} fill={P.mist} opacity={0.4} />
      <circle cx={300} cy={258} r={84} fill={`url(#halo-${id})`} />
      <Glyph suit="cups" x={300} y={254} s={1.05} />
      <Glyph suit="cups" x={190} y={296} s={0.9} />
      <Glyph suit="cups" x={410} y={296} s={0.9} />
      <Glyph suit="cups" x={235} y={420} s={0.9} />
      <Glyph suit="cups" x={365} y={420} s={0.9} />
      <Glyph suit="cups" x={190} y={544} s={0.9} />
      <Glyph suit="cups" x={410} y={544} s={0.9} />
      <ellipse cx={300} cy={650} rx={225} ry={26} fill={`url(#waterfade-${id})`} opacity={0.55} />
      <Ripples cx={300} cy={650} base={60} n={2} squash={0.14} step={30} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "转身去寻找", render: (id) => (<g>
      <ellipse cx={360} cy={470} rx={160} ry={18} fill={`url(#waterfade-${id})`} opacity={0.35} />
      {[180, 260, 340, 420].map((x, i) => <Glyph key={i} suit="cups" x={x} y={568} s={0.8} />)}
      {[220, 300, 380].map((x, i) => <Glyph key={i} suit="cups" x={x} y={644} s={0.8} />)}
      <Glyph suit="cups" x={460} y={644} s={0.8} />
      <Hill y={706} h={26} tone={P.mist} o={0.5} />
      <path d="M300,516 C 320,436 370,356 424,296" fill="none" stroke={P.goldDeep} strokeWidth={2.4} strokeDasharray="1 13" strokeLinecap="round" opacity={0.9} />
      <circle cx={444} cy={260} r={64} fill={`url(#halo-${id})`} />
      <circle cx={444} cy={260} r={24} fill={`url(#moonface-${id})`} />
      <Axis ys={[180, 208]} />
    </g>) },
    { zh: "心满意足", render: (id) => (<g>
      <circle cx={300} cy={426} r={130} fill={`url(#halo-${id})`} />
      {[[136, 466], [163, 388], [206, 326], [252, 292], [300, 282], [348, 292], [394, 326], [437, 388], [464, 466]].map(([x, y], i) => (
        <Glyph key={i} suit="cups" x={x} y={y} s={0.82} />
      ))}
      <Star8 cx={300} cy={426} r={11} tone={P.gold} />
      <ellipse cx={300} cy={604} rx={212} ry={26} fill={`url(#waterfade-${id})`} />
      <Ripples cx={300} cy={604} base={44} n={2} squash={0.16} step={26} />
      <Star8 cx={300} cy={604} r={8} tone={P.cream} o={0.6} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "圆满的一家", render: (id) => (<g>
      {[[132, 544], [158, 452], [200, 376], [252, 326], [287, 306], [313, 306], [348, 326], [400, 376], [442, 452], [468, 544]].map(([x, y], i) => (
        <Glyph key={i} suit="cups" x={x} y={y} s={0.78} />
      ))}
      <circle cx={300} cy={466} r={110} fill={`url(#halo-${id})`} />
      <Hill y={630} h={54} tone={P.teal} o={0.45} />
      <Tree x={300} y={588} s={0.95} tone={P.tealDeep} />
      <ellipse cx={300} cy={688} rx={150} ry={16} fill={`url(#waterfade-${id})`} opacity={0.7} />
      <Ripples cx={300} cy={688} base={34} n={2} squash={0.16} step={20} />
      <Axis ys={[176, 204]} />
    </g>) },
  ],
  wands: [
    { zh: "灵感发芽", render: (id) => (<g>
      <circle cx={300} cy={420} r={150} fill={`url(#halo-${id})`} />
      <Hill y={620} h={64} tone={P.teal} o={0.45} />
      <Hill y={668} h={36} tone={P.mist} o={0.5} />
      <Glyph suit="wands" x={300} y={496} s={2.2} />
      <ellipse cx={328} cy={420} rx={15} ry={7} fill={P.gold} transform="rotate(-30 328 420)" />
      <ellipse cx={274} cy={556} rx={13} ry={6} fill={P.gold} transform="rotate(24 274 556)" />
      <g fill={P.goldDeep}>{[[300, 342, 2.6], [318, 300, 2.2], [292, 262, 1.8], [310, 224, 1.5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.85} />)}</g>
      <Axis ys={[168, 196]} />
    </g>) },
    { zh: "凭窗眺望", render: (id) => (<g>
      <circle cx={300} cy={346} r={110} fill={`url(#halo-${id})`} />
      <circle cx={300} cy={338} r={24} fill={`url(#moonface-${id})`} />
      <ellipse cx={300} cy={508} rx={190} ry={16} fill={P.mist} opacity={0.45} />
      <Hill y={584} h={58} tone={P.teal} o={0.4} />
      <Glyph suit="wands" x={228} y={470} s={1.55} />
      <Glyph suit="wands" x={372} y={470} s={1.55} />
      <Axis ys={[672, 700]} />
    </g>) },
    { zh: "眺望成果", render: (id) => (<g>
      <circle cx={300} cy={324} r={100} fill={`url(#halo-${id})`} opacity={0.7} />
      <ellipse cx={300} cy={560} rx={200} ry={14} fill={P.mist} opacity={0.4} />
      <Hill y={496} h={88} tone={P.teal} o={0.5} />
      <Glyph suit="wands" x={222} y={424} s={1.2} />
      <Glyph suit="wands" x={300} y={394} s={1.3} />
      <Glyph suit="wands" x={378} y={424} s={1.2} />
      <ellipse cx={300} cy={618} rx={176} ry={28} fill={`url(#waterfade-${id})`} />
      <Ripples cx={300} cy={618} base={46} n={2} squash={0.18} step={26} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "搭起花棚", render: (id) => (<g>
      <circle cx={300} cy={376} r={120} fill={`url(#halo-${id})`} opacity={0.8} />
      <Hill y={606} h={50} tone={P.teal} o={0.4} />
      <Hill y={648} h={34} tone={P.mist} o={0.5} />
      {[180, 260, 340, 420].map((x, i) => <Glyph key={i} suit="wands" x={x} y={516} s={1.1} />)}
      <path d="M180,464 C 220,494 260,494 300,466 C 340,494 380,494 420,464" fill="none" stroke={P.ink} strokeWidth={2.2} opacity={0.75} />
      <Bloom x={240} y={484} s={0.62} tone={P.glow} />
      <Bloom x={360} y={484} s={0.62} tone={P.glow} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "小小的切磋", render: (id) => (<g>
      <circle cx={300} cy={440} r={130} fill={`url(#halo-${id})`} opacity={0.6} />
      <Glyph suit="wands" x={252} y={404} s={1.15} r={24} />
      <Glyph suit="wands" x={352} y={398} s={1.15} r={-28} />
      <Glyph suit="wands" x={300} y={474} s={1.15} r={64} />
      <Glyph suit="wands" x={232} y={524} s={1.15} r={-52} />
      <Glyph suit="wands" x={372} y={524} s={1.15} r={42} />
      <Star8 cx={300} cy={428} r={7} tone={P.goldDeep} o={0.8} />
      <Hill y={636} h={44} tone={P.mist} o={0.5} />
      <Dust pts={[[262, 356], [346, 352], [300, 566]]} />
      <Axis ys={[172, 200]} />
    </g>) },
    { zh: "被看见", render: (id) => (<g>
      <circle cx={300} cy={364} r={120} fill={`url(#halo-${id})`} />
      <Glyph suit="wands" x={300} y={376} s={1.5} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
        return <circle key={i} cx={300 + Math.cos(a) * 74} cy={348 + Math.sin(a) * 74} r={4.6} fill={P.gold} />
      })}
      <Hill y={664} h={52} tone={P.teal} o={0.4} />
      <Glyph suit="wands" x={186} y={600} s={0.95} r={16} />
      <Glyph suit="wands" x={244} y={620} s={0.95} r={8} />
      <Glyph suit="wands" x={300} y={626} s={0.95} />
      <Glyph suit="wands" x={356} y={620} s={0.95} r={-8} />
      <Glyph suit="wands" x={414} y={600} s={0.95} r={-16} />
      <Axis ys={[172, 200]} />
    </g>) },
    { zh: "站稳高处", render: (id) => (<g>
      <Hill y={496} h={108} tone={P.teal} o={0.5} />
      <circle cx={300} cy={356} r={100} fill={`url(#halo-${id})`} />
      <Glyph suit="wands" x={300} y={388} s={1.35} />
      <ellipse cx={300} cy={636} rx={200} ry={16} fill={P.mist} opacity={0.45} />
      {[[196, 570], [266, 592], [336, 596], [404, 574], [232, 642], [368, 644]].map(([x, y], i) => (
        <Glyph key={i} suit="wands" x={x} y={y} s={0.92} r={74} />
      ))}
      <Axis ys={[168, 196]} />
    </g>) },
    { zh: "疾风而至", render: (id) => (<g>
      <path d="M110,326 C 220,296 380,356 500,318 M100,466 C 230,434 390,494 504,454 M126,240 C 230,214 384,262 490,232" fill="none" stroke={P.tealDeep} strokeWidth={2.6} opacity={0.4} strokeLinecap="round" />
      {[[176, 512], [244, 458], [312, 404], [380, 350], [204, 596], [272, 542], [340, 488], [408, 434]].map(([x, y], i) => (
        <Glyph key={i} suit="wands" x={x} y={y} s={1.0} r={-38} />
      ))}
      <Hill y={692} h={24} tone={P.mist} o={0.4} />
      <circle cx={452} cy={256} r={80} fill={`url(#halo-${id})`} opacity={0.6} />
      <Dust pts={[[448, 316], [472, 376], [420, 276]]} />
      <Axis ys={[652, 680]} />
    </g>) },
    { zh: "疲惫,但还立着", render: (id) => (<g>
      <circle cx={262} cy={462} r={96} fill={`url(#halo-${id})`} opacity={0.6} />
      <ellipse cx={300} cy={462} rx={210} ry={16} fill={P.mist} opacity={0.35} />
      <Hill y={608} h={44} tone={P.teal} o={0.4} />
      {[140, 180, 220, 300, 340, 380, 420, 460].map((x, i) => <Glyph key={i} suit="wands" x={x} y={516} s={1.02} />)}
      <Glyph suit="wands" x={262} y={528} s={1.02} r={10} />
      <Hill y={656} h={30} tone={P.mist} o={0.5} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "负重前行", render: (id) => (<g>
      <circle cx={300} cy={330} r={90} fill={`url(#halo-${id})`} opacity={0.5} />
      <ellipse cx={300} cy={562} rx={130} ry={14} fill={P.mist} opacity={0.5} />
      <g transform="rotate(9 300 470)">
        {[-36, -28, -20, -12, -4, 4, 12, 20, 28, 36].map((dx, i) => (
          <Glyph key={i} suit="wands" x={300 + dx} y={470 + (i % 2 ? 6 : -4)} s={1.1} r={12} />
        ))}
        <path d="M252,432 C 288,420 324,420 350,436 M252,506 C 288,518 324,518 350,502" fill="none" stroke={P.goldDeep} strokeWidth={3} strokeLinecap="round" />
      </g>
      <Hill y={626} h={54} tone={P.teal} o={0.45} />
      <Hill y={668} h={32} tone={P.mist} o={0.5} />
      <Axis ys={[176, 204]} />
    </g>) },
  ],
  pentacles: [
    { zh: "种下一颗机会", render: (id) => (<g>
      <circle cx={300} cy={456} r={140} fill={`url(#halo-${id})`} />
      <Glyph suit="pentacles" x={300} y={506} s={2.0} />
      <Hill y={580} h={68} tone={P.gold} o={0.5} />
      <Hill y={636} h={38} tone={P.gold} o={0.35} />
      <g fill={P.goldDeep}>{[[300, 356, 2.6], [322, 314, 2.2], [286, 278, 1.8]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.85} />)}</g>
      <Axis ys={[168, 196]} />
    </g>) },
    { zh: "两头都要顾", render: (id) => (<g>
      <circle cx={300} cy={426} r={120} fill={`url(#halo-${id})`} opacity={0.55} />
      <Glyph suit="pentacles" x={238} y={392} s={1.2} />
      <Glyph suit="pentacles" x={362} y={474} s={1.2} />
      <path d="M176,416 C 226,332 306,340 330,428 C 352,512 424,518 442,448" fill="none" stroke={P.goldDeep} strokeWidth={2.6} opacity={0.75} strokeLinecap="round" />
      <Hill y={624} h={52} tone={P.gold} o={0.4} />
      <ellipse cx={300} cy={688} rx={160} ry={14} fill={P.mist} opacity={0.4} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "一起打磨", render: (id) => (<g>
      <circle cx={300} cy={396} r={120} fill={`url(#halo-${id})`} />
      <Glyph suit="pentacles" x={300} y={348} s={1.15} />
      <Glyph suit="pentacles" x={244} y={448} s={1.1} />
      <Glyph suit="pentacles" x={356} y={448} s={1.1} />
      <rect x={196} y={536} width={208} height={22} rx={11} fill={P.tealDeep} opacity={0.55} />
      <rect x={230} y={558} width={140} height={42} rx={11} fill={P.teal} opacity={0.35} />
      <Hill y={664} h={38} tone={P.mist} o={0.5} />
      <Axis ys={[172, 200]} />
    </g>) },
    { zh: "紧紧握住", render: (id) => (<g>
      <circle cx={300} cy={436} r={122} fill={`url(#halo-${id})`} opacity={0.4} />
      <Glyph suit="pentacles" x={252} y={388} s={1.05} />
      <Glyph suit="pentacles" x={348} y={388} s={1.05} />
      <Glyph suit="pentacles" x={252} y={484} s={1.05} />
      <Glyph suit="pentacles" x={348} y={484} s={1.05} />
      <circle cx={300} cy={436} r={122} fill="none" stroke={P.goldDeep} strokeWidth={2.8} opacity={0.75} />
      <Hill y={648} h={46} tone={P.gold} o={0.35} />
      <Dust pts={[[170, 300], [430, 300]]} />
      <Axis ys={[170, 198]} />
    </g>) },
    { zh: "匮乏中有一扇亮窗", render: (id) => (<g>
      <ellipse cx={300} cy={448} rx={170} ry={16} fill={P.mist} opacity={0.5} />
      <Hill y={648} h={44} tone={P.gold} o={0.3} />
      <g opacity={0.55}>
        <Glyph suit="pentacles" x={206} y={562} s={0.95} />
        <Glyph suit="pentacles" x={278} y={590} s={0.95} />
        <Glyph suit="pentacles" x={352} y={588} s={0.95} />
        <Glyph suit="pentacles" x={422} y={558} s={0.95} />
        <Glyph suit="pentacles" x={300} y={516} s={0.95} />
      </g>
      <circle cx={300} cy={326} r={110} fill={`url(#halo-${id})`} />
      <path d="M258,380 L 258,340 C 258,286 342,286 342,340 L 342,380" fill="none" stroke={P.gold} strokeWidth={4} strokeLinecap="round" />
      <path d="M258,380 L 342,380" stroke={P.gold} strokeWidth={4} strokeLinecap="round" />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "给予与流动", render: (id) => (<g>
      <circle cx={300} cy={416} r={130} fill={`url(#halo-${id})`} opacity={0.7} />
      <Glyph suit="pentacles" x={232} y={316} s={1.0} />
      <Glyph suit="pentacles" x={300} y={288} s={1.0} />
      <Glyph suit="pentacles" x={368} y={316} s={1.0} />
      {[[232, 368, 232, 496], [300, 340, 300, 524], [368, 368, 368, 496]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1},${y1} L ${x2},${y2}`} stroke={P.goldDeep} strokeWidth={2} strokeDasharray="1 10" strokeLinecap="round" opacity={0.85} />
      ))}
      <Glyph suit="pentacles" x={232} y={548} s={1.0} />
      <Glyph suit="pentacles" x={300} y={576} s={1.0} />
      <Glyph suit="pentacles" x={368} y={548} s={1.0} />
      <Hill y={668} h={40} tone={P.gold} o={0.35} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "耐心等果实", render: (id) => (<g>
      <circle cx={300} cy={416} r={130} fill={`url(#halo-${id})`} opacity={0.45} />
      <path d="M300,658 C 288,566 306,474 296,392" fill="none" stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" opacity={0.8} />
      <ellipse cx={268} cy={556} rx={16} ry={7} fill={P.teal} transform="rotate(-24 268 556)" />
      <ellipse cx={330} cy={466} rx={16} ry={7} fill={P.teal} transform="rotate(22 330 466)" />
      {[[248, 424, 0.85], [352, 410, 0.85], [226, 504, 0.8], [372, 494, 0.8], [258, 574, 0.78], [344, 566, 0.78], [298, 364, 0.9]].map(([x, y, s], i) => (
        <Glyph key={i} suit="pentacles" x={x} y={y} s={s} />
      ))}
      <Hill y={648} h={52} tone={P.teal} o={0.4} />
      <Hill y={686} h={26} tone={P.mist} o={0.55} />
      <Axis ys={[172, 200]} />
    </g>) },
    { zh: "手艺日进", render: (id) => (<g>
      <circle cx={344} cy={552} r={58} fill={`url(#halo-${id})`} />
      {[[220, 356], [300, 356], [380, 356], [220, 454], [300, 454], [380, 454], [260, 552]].map(([x, y], i) => (
        <Glyph key={i} suit="pentacles" x={x} y={y} s={0.92} />
      ))}
      <Glyph suit="pentacles" x={344} y={552} s={1.05} />
      <circle cx={344} cy={552} r={36} fill="none" stroke={P.goldDeep} strokeWidth={1.8} strokeDasharray="2 8" opacity={0.8} />
      <Hill y={652} h={40} tone={P.gold} o={0.35} />
      <ellipse cx={300} cy={708} rx={170} ry={12} fill={P.mist} opacity={0.4} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "自足的花园", render: (id) => (<g>
      <circle cx={300} cy={426} r={140} fill={`url(#halo-${id})`} />
      <Hill y={646} h={50} tone={P.teal} o={0.35} />
      <Bloom x={300} y={424} s={2.1} tone={P.glow} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 9 - Math.PI / 2
        return <Glyph key={i} suit="pentacles" x={300 + Math.cos(a) * 138} y={426 + Math.sin(a) * 138} s={0.76} />
      })}
      <Dust pts={[[170, 250], [430, 250]]} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "丰盛的传承", render: (id) => (<g>
      <circle cx={300} cy={416} r={140} fill={`url(#halo-${id})`} opacity={0.5} />
      <Hill y={630} h={62} tone={P.teal} o={0.45} />
      <Hill y={676} h={30} tone={P.gold} o={0.35} />
      <Tree x={300} y={554} s={1.7} tone={P.tealDeep} />
      {[[255, 446, 0.7], [300, 426, 0.72], [345, 446, 0.7], [230, 480, 0.66], [370, 480, 0.66], [300, 480, 0.68]].map(([x, y, s], i) => (
        <Glyph key={i} suit="pentacles" x={x} y={y} s={s} />
      ))}
      {[[206, 608, 0.7], [394, 608, 0.7], [258, 640, 0.7], [342, 640, 0.7]].map(([x, y, s], i) => (
        <Glyph key={i} suit="pentacles" x={x} y={y} s={s} />
      ))}
      <Axis ys={[176, 204]} />
    </g>) },
  ],
  swords: [
    { zh: "清明的一念", render: (id) => (<g>
      <path d={`M266,150 L 334,150 L 320,560 L 280,560 Z`} fill={P.glow} opacity={0.35} />
      <circle cx={300} cy={396} r={130} fill={`url(#halo-${id})`} />
      <ellipse cx={300} cy={584} rx={170} ry={16} fill={P.mist} opacity={0.5} />
      <ellipse cx={300} cy={636} rx={215} ry={20} fill={P.mist} opacity={0.35} />
      <Glyph suit="swords" x={300} y={404} s={2.1} />
      <Star8 cx={300} cy={246} r={10} tone={P.gold} />
      <Axis ys={[688, 716]} />
    </g>) },
    { zh: "悬而未决", render: (id) => (<g>
      <circle cx={300} cy={252} r={30} fill={`url(#moonface-${id})`} opacity={0.85} />
      <ellipse cx={300} cy={288} rx={140} ry={20} fill={P.mist} opacity={0.6} />
      <circle cx={300} cy={416} r={110} fill={`url(#halo-${id})`} opacity={0.5} />
      <Glyph suit="swords" x={258} y={426} s={1.5} r={-32} />
      <Glyph suit="swords" x={342} y={426} s={1.5} r={32} />
      <ellipse cx={300} cy={596} rx={164} ry={28} fill={`url(#waterfade-${id})`} />
      <Axis ys={[688, 716]} />
    </g>) },
    { zh: "轻轻的痛", render: (id) => (<g>
      <ellipse cx={300} cy={306} rx={92} ry={26} fill={P.mist} opacity={0.75} />
      <ellipse cx={250} cy={324} rx={58} ry={18} fill={P.mist} opacity={0.6} />
      <ellipse cx={356} cy={328} rx={48} ry={14} fill={P.mist} opacity={0.5} />
      {[[268, 382], [300, 394], [332, 382]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y} L ${x - 6},${y + 34}`} stroke={P.tealDeep} strokeWidth={1.8} opacity={0.6} strokeLinecap="round" />
      ))}
      <Glyph suit="swords" x={232} y={496} s={1.1} r={28} />
      <Glyph suit="swords" x={312} y={524} s={1.1} r={-18} />
      <Glyph suit="swords" x={382} y={474} s={1.1} r={14} />
      <Hill y={640} h={38} tone={P.mist} o={0.5} />
      <ellipse cx={300} cy={694} rx={190} ry={14} fill={P.mist} opacity={0.35} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "好好休息", render: (id) => (<g>
      <circle cx={300} cy={238} r={20} fill={`url(#moonface-${id})`} opacity={0.6} />
      <circle cx={300} cy={396} r={110} fill={`url(#halo-${id})`} opacity={0.5} />
      {[[276, 392], [322, 436], [270, 480], [318, 524]].map(([x, y], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={1.05} r={86} />
      ))}
      <ellipse cx={300} cy={596} rx={190} ry={30} fill={P.mist} opacity={0.6} />
      <ellipse cx={300} cy={646} rx={150} ry={20} fill={P.mist} opacity={0.4} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "放手离场", render: (id) => (<g>
      <Hill y={676} h={30} tone={P.mist} o={0.45} />
      <Glyph suit="swords" x={222} y={582} s={1.0} r={72} />
      <Glyph suit="swords" x={306} y={600} s={1.0} r={84} />
      <Glyph suit="swords" x={388} y={578} s={1.0} r={-70} />
      <path d="M300,466 C 350,426 400,388 452,358 M280,406 C 330,368 378,334 428,306 M264,530 C 320,498 372,470 424,444" fill="none" stroke={P.tealDeep} strokeWidth={2.2} opacity={0.45} strokeLinecap="round" />
      <Glyph suit="swords" x={402} y={326} s={0.95} r={-28} />
      <Glyph suit="swords" x={462} y={272} s={0.9} r={-24} />
      <circle cx={438} cy={296} r={90} fill={`url(#halo-${id})`} opacity={0.5} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "摆渡向前", render: (id) => (<g>
      <circle cx={446} cy={296} r={70} fill={`url(#halo-${id})`} />
      <circle cx={446} cy={296} r={20} fill={`url(#moonface-${id})`} />
      <ellipse cx={300} cy={620} rx={230} ry={30} fill={`url(#waterfade-${id})`} opacity={0.8} />
      <path d="M196,556 C 238,602 362,602 404,556 C 362,578 238,578 196,556 Z" fill={P.tealDeep} opacity={0.65} />
      {[232, 260, 288, 316, 344, 372].map((x, i) => (
        <Glyph key={i} suit="swords" x={x} y={514} s={0.78} r={i % 2 ? 4 : -4} />
      ))}
      <Ripples cx={300} cy={588} base={50} n={2} squash={0.16} step={26} />
      <path d="M226,636 C 270,648 330,648 374,636" fill="none" stroke={P.tealDeep} strokeWidth={1.8} opacity={0.4} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "独自上路", render: (id) => (<g>
      <ellipse cx={240} cy={446} rx={160} ry={18} fill={P.mist} opacity={0.4} />
      {[[196, 496], [252, 482], [200, 562], [258, 552], [214, 628], [268, 616]].map(([x, y], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={0.9} r={6} />
      ))}
      <path d="M310,466 C 350,428 390,400 430,380" fill="none" stroke={P.goldDeep} strokeWidth={2.2} strokeDasharray="1 12" strokeLinecap="round" opacity={0.9} />
      <circle cx={428} cy={366} r={84} fill={`url(#halo-${id})`} />
      <Glyph suit="swords" x={428} y={364} s={1.15} r={-24} />
      <Hill y={700} h={22} tone={P.mist} o={0.4} />
      <Axis ys={[176, 204]} />
    </g>) },
    { zh: "出口一直都在", render: (id) => (<g>
      <circle cx={300} cy={448} r={170} fill={`url(#halo-${id})`} opacity={0.4} />
      <Bloom x={300} y={448} s={1.05} tone={P.glow} />
      {[[404, 448, 104], [372, 528, 148], [300, 560, 187], [228, 528, 227], [196, 448, 270], [228, 368, 315], [300, 336, 358], [372, 368, 44]].map(([x, y, rr], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={0.85} r={rr} />
      ))}
      <path d="M382,326 C 412,292 444,264 478,244" fill="none" stroke={P.goldDeep} strokeWidth={2} strokeDasharray="1 10" opacity={0.85} strokeLinecap="round" />
      <Dust pts={[[452, 264], [478, 236]]} />
      <Hill y={702} h={20} tone={P.mist} o={0.35} />
      <Axis ys={[692, 720]} />
    </g>) },
    { zh: "深夜的思绪", render: (id) => (<g>
      <circle cx={186} cy={206} r={54} fill={`url(#halo-${id})`} opacity={0.6} />
      {[[220, 240], [300, 228], [380, 240]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y} L ${x},${y + 28}`} stroke={P.tealDeep} strokeWidth={1.2} opacity={0.4} />
      ))}
      {[[220, 300], [300, 288], [380, 300], [244, 396], [356, 396], [220, 492], [300, 480], [380, 492], [300, 384]].map(([x, y], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={0.85} r={176 + (i % 3) * 4} />
      ))}
      <ellipse cx={300} cy={610} rx={190} ry={26} fill={P.mist} opacity={0.6} />
      <ellipse cx={300} cy={654} rx={150} ry={18} fill={P.mist} opacity={0.4} />
      <Axis ys={[700, 728]} />
    </g>) },
    { zh: "长夜将明", render: (id) => (<g>
      <Star8 cx={186} cy={238} r={6} tone={P.goldDeep} o={0.5} />
      <Star8 cx={414} cy={212} r={5} tone={P.goldDeep} o={0.4} />
      <ellipse cx={300} cy={556} rx={240} ry={44} fill={`url(#dawn-${id})`} opacity={0.7} />
      <path d="M120,556 L 480,556" stroke={P.goldDeep} strokeWidth={1.8} opacity={0.6} />
      <Hill y={648} h={40} tone={P.mist} o={0.45} />
      {[[160, 602], [216, 614], [272, 622], [328, 622], [384, 614], [440, 602]].map(([x, y], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={0.85} r={i < 3 ? 80 : -80} />
      ))}
      {[[236, 664], [300, 670], [364, 664], [300, 612]].map(([x, y], i) => (
        <Glyph key={i} suit="swords" x={x} y={y} s={0.85} r={i % 2 ? 84 : -84} />
      ))}
      <Star8 cx={300} cy={516} r={8} tone={P.gold} o={0.9} />
      <Axis ys={[176, 204]} />
    </g>) },
  ],
}

function PipCard({ suit, count }: { suit: (typeof SUITS)[number]; count: number }) {
  const id = `${suit.key}-${count}`
  return (
    <Card id={id} n={`${suit.en.toUpperCase()} · ${NUM_RO[count]}`} name={`${NUM_EN[count]} of ${suit.en}`}>
      {PIP_SCENES[suit.key][count - 1].render(id)}
      <Dust pts={[[150, 210], [450, 214]]} />
    </Card>
  )
}

const COURTS = [
  { rank: "Page", zh: "侍从", motif: "幼芽" },
  { rank: "Knight", zh: "骑士", motif: "掠过的风" },
  { rank: "Queen", zh: "王后", motif: "盛放的花" },
  { rank: "King", zh: "国王", motif: "沉稳的老树" },
]

function CourtCard({ suit, rank }: { suit: (typeof SUITS)[number]; rank: string }) {
  const id = `${suit.key}-${rank.toLowerCase()}`
  return (
    <Card id={id} n={suit.en.toUpperCase()} name={`${rank} of ${suit.en}`}>
      {rank === "Page" && (
        <g>
          <circle cx={300} cy={340} r={104} fill={`url(#halo-${id})`} />
          <Glyph suit={suit.key} x={300} y={330} s={1.25} />
          <Hill y={620} h={70} tone={P.mist} o={0.6} />
          {/* the seedling just breaking ground */}
          <path d="M300,614 C 298,570 299,538 300,506" fill="none" stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
          <ellipse cx={283} cy={528} rx={10} ry={15} fill={P.teal} transform="rotate(-26 283 528)" />
          <ellipse cx={317} cy={516} rx={10} ry={15} fill={P.teal} transform="rotate(26 317 516)" />
          <circle cx={300} cy={500} r={5.2} fill={P.gold} />
        </g>
      )}
      {rank === "Knight" && (
        <g>
          <circle cx={330} cy={400} r={120} fill={`url(#halo-${id})`} />
          {/* wind passing through */}
          <path d="M104,318 C 210,296 390,338 496,310 M96,412 C 220,388 400,436 504,404 M116,506 C 224,484 384,522 488,498" fill="none" stroke={P.tealDeep} strokeWidth={3} opacity={0.5} strokeLinecap="round" />
          <g transform="translate(330,404) rotate(16)">
            <Glyph suit={suit.key} x={0} y={0} s={1.3} />
          </g>
          <Dust pts={[[210, 372], [252, 430], [172, 396]]} />
        </g>
      )}
      {rank === "Queen" && (
        <g>
          <circle cx={300} cy={410} r={130} fill={`url(#halo-${id})`} />
          {/* in full bloom */}
          <path d="M300,652 C 297,590 298,530 300,472" fill="none" stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
          <ellipse cx={278} cy={560} rx={15} ry={7} fill={P.teal} transform="rotate(-22 278 560)" />
          <ellipse cx={322} cy={528} rx={15} ry={7} fill={P.teal} transform="rotate(22 322 528)" />
          <Bloom x={300} y={412} s={3.1} tone={P.glow} />
          <Glyph suit={suit.key} x={300} y={252} s={0.98} />
        </g>
      )}
      {rank === "King" && (
        <g>
          <circle cx={300} cy={380} r={112} fill={`url(#halo-${id})`} />
          <Hill y={610} h={78} tone={P.teal} o={0.5} />
          {/* the old tree, unhurried */}
          <Tree x={300} y={560} s={1.62} tone={P.tealDeep} />
          <Glyph suit={suit.key} x={300} y={330} s={1.08} />
        </g>
      )}
      <Dust pts={[[160, 216], [440, 212], [160, 700], [440, 696]]} />
    </Card>
  )
}

/* ---- sheet ---------------------------------------------------------------- */

const MAJORS: { key: string; render: (id: string) => React.ReactNode; zh: string }[] = [
  { key: "fool", render: Fool, zh: "0 愚人 · 新的开始" },
  { key: "magician", render: Magician, zh: "I 魔术师 · 资源在手" },
  { key: "priestess", render: Priestess, zh: "II 女祭司 · 直觉" },
  { key: "empress", render: Empress, zh: "III 女皇 · 丰饶" },
  { key: "emperor", render: Emperor, zh: "IV 皇帝 · 秩序" },
  { key: "hierophant", render: Hierophant, zh: "V 教皇 · 引导" },
  { key: "lovers", render: Lovers, zh: "VI 恋人 · 选择与结合" },
  { key: "chariot", render: Chariot, zh: "VII 战车 · 前进" },
  { key: "strength", render: Strength, zh: "VIII 力量 · 温柔的勇气" },
  { key: "hermit", render: Hermit, zh: "IX 隐士 · 内省" },
  { key: "wheel", render: Wheel, zh: "X 命运之轮 · 周期" },
  { key: "justice", render: Justice, zh: "XI 正义 · 平衡" },
  { key: "hanged", render: Hanged, zh: "XII 倒吊人 · 换个角度" },
  { key: "death", render: Death, zh: "XIII 死神 · 结束与新生" },
  { key: "temperance", render: Temperance, zh: "XIV 节制 · 调和" },
  { key: "devil", render: Devil, zh: "XV 恶魔 · 松开的结" },
  { key: "tower", render: Tower, zh: "XVI 高塔 · 温柔的骤变" },
  { key: "star", render: Star, zh: "XVII 星星 · 希望疗愈" },
  { key: "moon", render: Moon, zh: "XVIII 月亮 · 雾中前行" },
  { key: "sun", render: Sun, zh: "XIX 太阳 · 喜悦清朗" },
  { key: "judgement", render: Judgement, zh: "XX 审判 · 一起绽放" },
  { key: "world", render: World, zh: "XXI 世界 · 圆满" },
]

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 26, marginTop: 28 }
const H2: React.CSSProperties = { fontFamily: "var(--font-ds-display), serif", fontWeight: 500, fontSize: "clamp(1.5rem,2.6vw,2.2rem)", margin: "72px 0 0", letterSpacing: "0.01em" }
const SUB: React.CSSProperties = { margin: "6px 0 0", opacity: 0.65, fontSize: 14 }

export default function TarotLab() {
  return (
    <main style={{ minHeight: "100svh", background: "#EFE7D6", padding: "64px clamp(20px,4vw,72px) 120px", fontFamily: "var(--font-ds-hanken), sans-serif", color: "#4A463C" }}>
      <h1 style={{ fontFamily: "var(--font-ds-display), serif", fontWeight: 500, fontSize: "clamp(2rem,4vw,3.2rem)", margin: 0 }}>
        Moonlit Garden · 全套 78 张
      </h1>
      <p style={{ margin: "10px 0 0", opacity: 0.75, maxWidth: 680 }}>
        淡彩方向(你选的 A),全部代码生成、同一模板。22 张大牌 = 22 幕小场景;40 张数字牌 = 四个花色符号 × 数量的排布(马赛塔罗正统);16 张宫廷牌 = 幼芽/风/花/老树四种气质。逐张挑毛病即可 — 每条意见都是参数,改一处全套同步。
      </p>

      <h2 style={H2}>大阿卡纳 · Major Arcana</h2>
      <p style={SUB}>22 幕月光庭园的故事</p>
      <div style={GRID}>
        {MAJORS.map(({ key, render, zh }) => (
          <figure key={key} style={{ margin: 0 }}>
            {render(key)}
            <figcaption style={{ fontSize: 12.5, marginTop: 8, opacity: 0.7, textAlign: "center" }}>{zh}</figcaption>
          </figure>
        ))}
      </div>

      {SUITS.map((suit) => (
        <section key={suit.key}>
          <h2 style={H2}>{suit.zh} · {suit.en}</h2>
          <p style={SUB}>{suit.line}</p>
          <div style={GRID}>
            {Array.from({ length: 10 }, (_, i) => (
              <figure key={i} style={{ margin: 0 }}>
                <PipCard suit={suit} count={i + 1} />
                <figcaption style={{ fontSize: 12.5, marginTop: 8, opacity: 0.7, textAlign: "center" }}>
                  {suit.zh} {NUM_RO[i + 1]} · {PIP_SCENES[suit.key][i].zh}
                </figcaption>
              </figure>
            ))}
            {COURTS.map(({ rank, zh, motif }) => (
              <figure key={rank} style={{ margin: 0 }}>
                <CourtCard suit={suit} rank={rank} />
                <figcaption style={{ fontSize: 12.5, marginTop: 8, opacity: 0.7, textAlign: "center" }}>
                  {suit.zh}{zh} · {motif}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
