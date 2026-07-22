/**
 * 解读语言的全部纪律都在这个文件里(来源:产品定义 v0.2 §3)。
 * 四段结构 / 意象只许来自 MEANINGS.imagery / 逆位=影面温柔语言 /
 * 禁预言生死疾病官司投资 / 危机信号不解牌只转介。
 */
import type { DrawnCard, SpreadId } from "./types"
import { MEANINGS, SPREADS } from "./meanings"
import { cardById } from "@/components/tarot/deck"

const CRISIS = /自杀|自残|不想活|活不下去|结束生命|伤害自己|想死|轻生|活着没有意义|了结自己/

export function crisisCheck(text: string): boolean {
  return CRISIS.test(text)
}

export const CRISIS_REPLY =
  "谢谢你愿意把这件事说出来,这需要很大的勇气。此刻的你,比任何一张牌都重要。这份沉重不适合由塔罗来接,它值得被真正的人稳稳接住:请联系你信任的家人或朋友,或拨打心理援助热线(中国大陆 12356,24 小时)。月光庭园会一直在这里,等你想回来的时候,再一起抽一张轻一点的牌。"

function cardBlock(c: DrawnCard, pos: string) {
  const card = cardById(c.cardId)
  const m = MEANINGS[c.cardId]
  const face = c.reversed ? "影面(逆位)" : "光面(正位)"
  const words = c.reversed ? m.shadow : m.light
  return `【${pos}】${card.zh}(${card.name})· ${face}\n牌面意象(只能引用这些,不许编造):${m.imagery.join("、")}\n关键词:${words.join("、")}`
}

export function buildPrompt({ spread, question, cards }: { spread: SpreadId; question?: string; cards: DrawnCard[] }) {
  const s = SPREADS[spread]
  const system = `你是"月光庭园"的解读者:一位温柔、懂心理学、说话具体的朋友。塔罗不是预言固定的未来,而是探索无意识的自我;你做的是每日的情绪陪伴。
写作铁律:
1. 固定四段,总长 150 到 260 字,直接输出正文,不加标题不加序号:第一段"映照",说这张牌的画面此刻映出用户处境的什么,必须扣住用户的问题;第二段"看见",牌想让用户看见的一件事,只说一件;第三段"小行动",今天就能做的一个具体小动作,门槛要低;第四段"收尾",一句不超过二十个字的轻轻的陪伴语。三张牌时,把前两段改为每张牌两三句(映照加看见),最后合写小行动与收尾。
2. 提到画面细节时,只能使用我提供的"牌面意象",一个字都不能编。
3. 逆位用"影面"语言:这股能量此刻受阻、内收或过度,语气依然温柔,绝不恐吓。
4. 禁止:预言生死、疾病、官司、怀孕、投资结果;"一定""必然""注定"式断言;制造焦虑;医疗、法律、金融建议;评判和说教。
5. 中文,第二人称"你",不用破折号,不堆玄学术语,神秘感来自画面而不是黑话。`
  const user = `${question ? `用户想问:${question}` : "用户没有具体问题,想要今天的陪伴与提醒。"}\n牌阵:${s.zh}\n\n${cards
    .map((c, i) => cardBlock(c, s.positions[i] ?? `第${i + 1}张`))
    .join("\n\n")}`
  return { system, user }
}

const ACTIONS = [
  "给最重要的那件事排出二十五分钟,只做它",
  "把心里那句话写进备忘录,睡前再读一遍",
  "给一个刚刚想到的人发条简短的问候",
  "出门走十分钟,什么也不带",
  "把桌面收拾出一小块干净的地方",
  "喝一杯温水,做三次深呼吸再继续",
  "把那件大事拆出今天能完成的最小一步",
  "睡前写下今天做到的三件小事",
]
const CLOSINGS = [
  "慢慢来,月亮也不是一夜变圆的。",
  "你已经走在路上了。",
  "今晚早点休息,交给明天的你。",
  "带着这张牌的光,去过今天。",
  "允许自己,就是答案的开始。",
]

/** 无 API key 或调用失败时的本地四段模板 — 同一天同一组牌输出恒定。 */
export function fallbackReading({ spread, question, cards, dateStr }: { spread: SpreadId; question?: string; cards: DrawnCard[]; dateStr: string }) {
  const s = SPREADS[spread]
  const seed = (dateStr + cards.map((c) => c.cardId).join("")).length
  const parts = cards.map((c, i) => {
    const card = cardById(c.cardId)
    const m = MEANINGS[c.cardId]
    const words = c.reversed ? m.shadow : m.light
    const pos = s.positions[i] ?? ""
    return `${pos}是${c.reversed ? "逆位的" : ""}${card.zh}:${m.imagery[0]},${m.imagery[1] ?? m.imagery[0]}。它在${question ? "你问的这件事里" : "今天"}提醒你留意"${words[0]}",也照看"${words[1] ?? words[0]}"的那一面。`
  })
  return `${parts.join("")}它最想让你看见的是:${cardById(cards[0].cardId).line}。今天可以试试:${ACTIONS[seed % ACTIONS.length]}。${CLOSINGS[seed % CLOSINGS.length]}`
}
