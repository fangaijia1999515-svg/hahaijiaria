---
name: moonlit-tarot
description: Moonlit Garden 塔罗产品的完整交接与工作规程 — 78 张牌面生成器的风格法律、代码架构、迭代方法、验证流程,以及产品下一步。接手这个项目前必读,配合 portfolio-studio 的沟通契约使用。
---

# Moonlit Garden 塔罗 — 项目交接书(给下一个 agent,写于 2026-07-19 深夜)

## 0. 一句话定位(写文案、做解读、做任何决定时的锚)

塔罗不是预言固定的未来,而是探索无意识的自我。这个产品做**每日的情绪陪伴**:轻轻问一件事,抽一张牌,得到一段温柔、具体、带行动提示的解读。风格 = **温暖、治愈、寻找自我,带一点神圣和神秘**。这是她原话定的方向,不是网站的 quiet luxury 风格 — 两个项目气质是分开的。

## 1. 先读什么(顺序)

1. `.claude/skills/portfolio-studio/SKILL.md` — 沟通契约(中文回复/结论先行/完整链接/结尾状态行)、她的工作方式、硬约束。**那份契约对本项目同样生效。**
2. `.claude/skills/moonlit-tarot/塔罗牌美术指南.md`(与本文件同目录,已进 git)— 她认可的美术圣经:22 张大牌逐张的画面指令表、四花色的庭园转译、小牌路线二、产品定位。原件在 `~/Desktop/塔罗牌美术指南.md`;`docs/tarot/` 也有一份但 docs/ 被 gitignore,只在本机。
3. `app/lab/tarot/page.tsx` — **全部 78 张牌的唯一源文件**,纯参数化 SVG,无随机数,确定性渲染。
4. 记忆目录 `~/.claude/projects/-Users-hahaijiarah/memory/` 里的 `tarot-deck-78.md` 与 `handoff-2026-07-19-ship-tarot.md`。

## 2. 项目为什么长这样(她的痛点 = 本方案的存在理由)

她用图片 AI 出牌面时**做不到 78 张风格一致**。所以牌面改为**代码生成**:一套调色板 + 一套共享元件 + 一个卡片模板,78 张按定义一致。她看过 5 张锚点 demo 的 A/B 版后拍板:**A 版淡彩**,评价"比较可爱、有哲学的感觉、可以继续"。她的三条修改(字更小更低、去掉四角枝条、细线加粗)已全部执行。

## 3. 风格法律(违反 = 返工)

- 调色板锁定为 `P`(page.tsx 顶部):paper `#F5ECD9` / mist `#BFD4CC` / teal `#9DBDB4` / tealDeep `#7FA79E` / ink `#5E7D76` / gold `#CDB68C` / goldDeep `#B79E6F` / cream `#FAF4E6` / glow `#F3E4BD`。不加新色。
- 画布 600×900(2:3 竖版)。双细线圆角框(3 / 1.6)+ 纸纹 grain + 中轴装饰点。
- 人物一律**无脸小剪影**(`Figure`),不画五官。
- 不出现宗教符号、恐怖意象。死神/恶魔/高塔必须画得温柔(落瓣新芽/松开的结/沙塔化萤)。
- 太阳是全套唯一的日光牌,其余全部是月夜。
- 牌名 serif 29px、y = H-66,下面一条 80px 金线;编号 mono 17px、y = 104。**不要恢复四角枝条(Sprigs 已删),不要把字改大改高 — 这是她点名改过的。**
- 线宽下限:主线 ≥2,细节线 ≥1.4(600 宽的坐标系里)。她屏幕看不清更细的线。
- 严禁 `Math.random()`/`Date.now()` — 牌面必须确定性,同一张牌永远长一样。

## 4. 代码架构(app/lab/tarot/page.tsx,一个文件讲完)

- `P` 调色板、`W=600 H=900`。
- `Defs`(grain/halo/moonface/waterfade/dawn 渐变,按卡 id 命名空间隔离)。
- 共享元件:`Frame` `Axis` `Title` `Ripples` `Hill` `Tree` `Figure(kneel?)` `Star8` `Dust` `Plant` `Bloom`(五瓣花)。
- `Card` 模板 = 纸底 + grain + 场景 children + Frame + Title。
- **大牌**:22 个场景函数(`Fool`…`World`),每个是共享元件 + 少量专属图形的组合;`MAJORS` 数组(key/render/zh)驱动渲染。
- **小牌**:
  - `Glyph`:四个花色符号只画了这一次 — 圣杯=水波杯、权杖=枝条、星币=金石(金圆+八角星)、宝剑=**风羽**(羽毛:弯羽轴伸出羽面成裸羽管+羽须,整体斜 9°;她否决过第一版"像树叶"的对称杏仁形,别改回去)。
  - `PIP_SCENES`:**她的定law — 数字牌不许"几就摆几个"**("感觉不用心、要有意义"是她原话)。40 张数字牌每张都是含义驱动的小构图(圣杯五=三杯倾倒两杯仍立、权杖八=八枝乘风、星币一=金币半埋沙丘如种子、宝剑十=羽毛落地+黎明第一线光),含义词就在每张的 `zh` 字段和页面 caption 上。改哪张 = 改 `PIP_SCENES[花色][n-1].render`。
  - `COURTS` + `CourtCard`:侍从=幼芽、骑士=掠过的风、王后=盛放的花(大 Bloom)、国王=沉稳的老树(大 Tree),花色符号悬浮其上。
- 页面分五区:大阿卡纳 / 圣杯 / 权杖 / 星币 / 宝剑,每张卡下有中文 caption。

**改一张牌** = 改对应场景函数或参数;**改全套** = 改共享元件/Title/Frame 一处。她的每条意见先判断属于哪一层,层选对了就是一行改动。

## 5. 迭代与验证流程(每轮必走,一步不省)

1. 改前 `cp` 备份到 scratchpad/backups/(portfolio-studio 契约)。
2. 改码 → `npx tsc --noEmit` 必须 0。
3. dev 站 `http://localhost:3000/lab/tarot`(**:3000 永不重启**;改完等 3-5 秒再测,防 stale bundle 假阴性)。
4. browse CLI(`~/.claude/skills/gstack/browse/dist/browse`)1512×982 截图,**逐张用眼睛看**,不许"编译过了就算过"。我这轮 22 张里第一版有 10 张构图不成立(魔术师元素太散/女皇的花像泡泡/力量像鸭子/节制像鱼钩…),全部是截图肉眼发现的,tsc 和 hook 都不会报这种错。
5. 汇报:结论先行 + 完整链接 + 让她"逐张挑毛病" + 结尾状态行。

## 6. 当前状态(2026-07-19 夜)

- ✅ 78/78 张全部完成并逐张目检过:22 大牌场景 + 40 数字牌 + 16 宫廷牌,全在 `/lab/tarot` 一页。
- ✅ 她的三条修改意见已全套执行(字小放低/去枝条/线加粗)。
- ⏳ **等她对 78 张逐张挑毛病** — 她的反馈就是下一轮工作清单。
- 牌背 = 她选定的封面图 `public/image/cards/moonlit-cover.png`(md 版 moonlit-cover-md.jpg 用于首页 work 卡)。

## 7. 下一步队列(按顺序)

1. **她的 78 张审阅意见** → 参数级修改。
2. **导出管线**:SVG → 高清 PNG(建议:puppeteer/browse 对每张卡截 2×,或写个小脚本把每个 `<svg>` serialize 后用 resvg/sharp 转 1200×1800)。导出物放 `public/image/cards/deck/`。
3. **产品本体**(抽卡 + AI 解读 App):任务 #20 还挂着 brainstorm(逐轮提问→方案→设计文档→她审→writing-plans→再写码)。**不要跳过她的审批直接写 app 代码。**解读文案的语气锚定 §0 那句话。
4. 首页 work 区的 Moonlit Garden 卡片后续接到真实 case study / demo。

## 8. 老坑清单(踩过的,别再踩)

- dev :3000 永不重启;repo 内严禁 `next build`(会毁 .next;要构建去 scratchpad rsync 副本,node_modules 用 `cp -Rc` 克隆)。
- 她家网络推不动大传输:部署 = 改码后 git 小提交 push 到 GitHub(`fangaijia1999515-svg/hahaijiaria`,本地分支 `ship` → 远端 `main`),Vercel 云端自动构建。绝不本地 `vercel deploy`。
- git push 用 `timeout 90` 包裹防挂死;zsh 里 `${sha}':refs/heads/main'` 写法(裸 `$sha:refs` 会被 zsh 修饰符吃掉)。
- 网站(hahaijia.com,项目 aijia-portfolio)已上线,域名 alias 到部署;每次 push 后新部署需要确认 alias 是否自动跟随(Production 分支 push 会自动),改动大先发 preview 链接给她。
- lab 路由已 noindex,别去掉。
