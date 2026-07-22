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

/** 每个族群一句"这类牌在讲什么",让没接触过塔罗的人也看得懂。 */
function familyLine(cardId: string): string {
  if (cardId.startsWith("major-")) return "这是一张大牌,说的是你人生此刻的大方向,不是小事"
  if (cardId.startsWith("cups-")) return "圣杯讲的是感受和关系:心里的水位"
  if (cardId.startsWith("wands-")) return "权杖讲的是行动和热情:你想做的那件事"
  if (cardId.startsWith("pentacles-")) return "星币讲的是现实层面:工作、金钱、身体和日常"
  return "宝剑讲的是脑子里的念头:想法、决定和心里打的结"
}

/** 无 API key 或调用失败时的本地模板 — 说人话版(她 2026-07-22 的意见:之前太空、看不懂)。 */
export function fallbackReading({ spread, question, cards, dateStr }: { spread: SpreadId; question?: string; cards: DrawnCard[]; dateStr: string }) {
  const s = SPREADS[spread]
  const seed = (dateStr + cards.map((c) => c.cardId).join("")).length
  const where = question ? "放在你问的这件事上" : "放在今天"
  const parts = cards.map((c, i) => {
    const card = cardById(c.cardId)
    const m = MEANINGS[c.cardId]
    const pos = cards.length > 1 ? `「${s.positions[i] ?? `第${i + 1}张`}」的位置上,` : ""
    const intro = `${pos}你抽到的是《${card.zh} · ${card.line}》${c.reversed ? ",而且它是倒过来的(影面)" : ""}。牌面上画的是:${m.imagery.slice(0, 3).join("、")}。`
    const explain = c.reversed
      ? `这张牌本来讲「${m.light[0]}」;倒过来时,它轻声提醒你:最近可能有点${m.shadow[0]},或是在${m.shadow[1] ?? m.shadow[0]}。这不是做错了什么,只是这股能量暂时堵住了,松一松就好。`
      : `它带来的是「${m.light[0]}」的能量,也在支持你${m.light[1] ?? m.light[0]}。`
    return intro + explain
  })
  const family = familyLine(cards[0].cardId)
  return `${parts.join("\n\n")}\n\n${family}。${where},它的意思是:${cardById(cards[0].cardId).line},${cards[0].reversed ? "只是此刻先别用力,先照顾好自己" : "顺着它走就好"}。今天可以试试:${ACTIONS[seed % ACTIONS.length]}。${CLOSINGS[seed % CLOSINGS.length]}`
}
