import Link from "next/link"
import { PaperGrain } from "@/components/tarot/paper-grain"

/**
 * 开屏(小样-8):天空四段渐变(开屏专属特例)+ 她的大花主视觉原图。
 * 返工轮(她 2026-09 意见):实心深绿块删除,改为 1px 细框文字钮
 * (组件图版"次按钮"的几何:细描边 + 方圆角 + 透明底,天空从框后透出);
 * 落位 = 上方粉天空空白区(墨绿字 + 细绿框),花整朵完整不被挡。
 * 花瓣 3-5、光点 3-6(装饰预算)。
 */
export default function GardenWelcome() {
  /* 主视觉顶端渐隐融进渐变天空(紫蓝段透出),构图贴近小样-8 */
  const artMask = "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,1) 40%)"
  return (
    <main className="mgw-page">
      <div className="mgw-bg" aria-hidden>
        <PaperGrain soft={0.5} blotch={0.12} />
        <span className="mgw-petal" style={{ width: 12, height: 15, left: "18%", top: "12%", transform: "rotate(-24deg)", opacity: 0.55 }} />
        <span className="mgw-petal" style={{ width: 9, height: 12, left: "74%", top: "8%", transform: "rotate(30deg)", opacity: 0.5 }} />
        <span className="mgw-petal" style={{ width: 11, height: 14, left: "86%", top: "26%", transform: "rotate(52deg)", opacity: 0.6 }} />
        <span className="mgw-petal" style={{ width: 8, height: 11, left: "9%", top: "33%", transform: "rotate(12deg)", opacity: 0.5 }} />
        <span className="mgw-dot" style={{ width: 4, height: 4, left: "30%", top: "20%", opacity: 0.8 }} />
        <span className="mgw-dot" style={{ width: 3, height: 3, left: "63%", top: "15%", opacity: 0.7 }} />
        <span className="mgw-dot" style={{ width: 5, height: 5, left: "44%", top: "34%", opacity: 0.75 }} />
        <span className="mgw-dot" style={{ width: 3, height: 3, left: "80%", top: "40%", opacity: 0.6 }} />
      </div>
      <img
        className="mgw-art"
        src="/image/garden/key-flower.png"
        alt=""
        draggable={false}
        style={{ WebkitMaskImage: artMask, maskImage: artMask }}
      />
      <div className="mgw-content">
        <Link href="/garden" className="mgw-ghost">
          Start the journey
        </Link>
        <p className="mgw-tag mgw-tag--en">
          <i />Let intuition unfold, petal by petal<i />
        </p>
      </div>
    </main>
  )
}
