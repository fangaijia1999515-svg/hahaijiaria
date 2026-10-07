/**
 * 花锚点 · 质感三层里的两层(细颗粒+纤维 / 双尺度斑驳水痕)。
 * 用真实 div + 内联样式,不用伪元素——repo 的 CSS 管线会吃掉部分伪元素规则(portfolio-studio §5)。
 * 配方与透明度照抄花锚点活体系统页 .tex。
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.62'/%3E%3C/svg%3E\")"
const FIBER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.055 0.3' numOctaves='2' seed='9'/%3E%3C/filter%3E%3Crect width='420' height='420' filter='url(%23f)' opacity='0.42'/%3E%3C/svg%3E\")"
const BLOTCH =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.0032' numOctaves='3' seed='7'/%3E%3C/filter%3E%3Crect width='1200' height='1200' filter='url(%23b)' opacity='0.8'/%3E%3C/svg%3E\")"
const BLOTCH2 =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='210' height='210'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.028' numOctaves='3' seed='3'/%3E%3C/filter%3E%3Crect width='210' height='210' filter='url(%23c)' opacity='0.66'/%3E%3C/svg%3E\")"

export function PaperGrain({
  soft = 0.6,
  blotch = 0.15,
  radius,
}: {
  soft?: number
  blotch?: number
  radius?: number | string
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: radius,
  }
  return (
    <>
      <div aria-hidden style={{ ...base, backgroundImage: `${GRAIN},${FIBER}`, opacity: soft, mixBlendMode: "soft-light" }} />
      <div aria-hidden style={{ ...base, backgroundImage: `${BLOTCH},${BLOTCH2}`, opacity: blotch, mixBlendMode: "overlay" }} />
    </>
  )
}
