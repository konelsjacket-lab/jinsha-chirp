# 金沙啾 · Jinsha Chirp

一只成都白头鹎“白果”的巴蜀神话冒险。**故事为主，回合制为辅。全像素风。**
分工：美术 GPT、音乐 Gemini、程序 Claude。用户会把 GPT 画的图直接发到对话里。

## 运行与测试
- 线上地址（GitHub Pages，推送 main 后一两分钟自动更新）：https://konelsjacket-lab.github.io/jinsha-chirp/
- 纯静态 HTML5 + Phaser 3.90（`vendor/phaser.min.js`），没有构建步骤。
- `npm start`（= `python3 -m http.server 8080`），打开 http://localhost:8080
- `npm test`：node 自带测试，覆盖战斗公式、地图连通性、Boss 平衡。改数值或地图后必须跑。
- 改了画面就用 Playwright（`/opt/node-tools/node_modules/playwright`）实际截图看一眼。
  `window.game` 可以拿到场景：`game.scene.getScene('World')`。注意 `runScript()` 返回的 Promise 要等整段剧情结束，在 `page.evaluate` 里调用时不要 return 它。

## 代码结构
- 剧情设定（角色、章节、伏笔）在 `docs/STORY.md`，写台词前先看。语气：离谱但真诚，四川话味道。
- `src/data/` 是内容：
  - `maps/*.js`：一张小地图一个文件（成都拆成 park、shaocheng、jinsha_out、jinsha_altar、hejiang、langqiao、wuhou、caotang、panda、qc_road；第二章 qingcheng）。
    每个文件：字符画地形、`exits`（走到这片格子就切图，`tx/ty` 是对面落脚点，按偏移对齐）、`props`（地标大图，`solid` 挡路且可调查，否则只是装饰）、
    `npcs`（用 `at(NPC.xxx, x, y)` 摆放）、`triggers`（`area(TRIGGER.xxx, x0, y0, x1, y1)`）、`zones`（遇怪）、`route`（菜单路线图上的位置，0–100）。
    `maps/index.js` 汇总，并负责把旧存档（成都一整张大图）迁移到小地图。
  - `npcs.js`（成都）、`qingcheng.js`（第二章）：NPC 和奇遇的“是谁、说什么”（`when` 控制是否在场）；放在哪由地图文件决定。
  - `story.js`：开场、战败、主线目标、第二章尾声。`quests.js`：菜单里的支线任务。`companion.js`：噪噪同行时的闲聊。
  - 剧情步骤（对话、选项、条件、道具、战斗、换地图、CG……）的写法全在 `dsl.js` 顶部注释里。
- 对话说话人可带表情：`say('白果:happy', ...)` → 头像 `portrait_baiguo_happy`，没有就退回默认头像。新说话人要在 `characters.js` 登记（测试会查）。
- `src/systems/battle.js` 是纯逻辑（不依赖 Phaser），测试直接 import。噪噪帮腔是 `companionAssist`。
- `src/assets.js` 是资源清单。图片缺失时用 `src/placeholders.js` 现画的占位图；`optional: true` 的缺失就跳过。
- 地图图块：每种地形一张 128×128 的无缝平铺图，铺在 4×4 格上（`VARIANT`）；树（`SINGLE_TILES`）是单格 32×32。Boot 启动时拼成带 1px 外扩、2px 间距的图块集，防止 1.5 倍缩放时接缝出细线。
- 剧情里 `{ warp: {...}, then: [...] }` 换图后接着执行 then（存在 registry 的 pendingScript 里）。
- 测试：`tests/story.test.js` 会在各个剧情阶段展开所有 NPC/奇遇脚本，检查引用的道具、技能、怪物、地图、说话人都存在；`tests/map.test.js` 检查每张地图的连通性、出口两头对得上、落脚点能站、从人民公园能走到所有成都小地图。

## 字体与界面
- 字体：Fusion Pixel 12px（SIL OFL），`assets/fonts/fusion-pixel-12px-full.woff2` 是完整版，游戏只加载裁剪后的 `jinsha-pixel.woff2`。
  **加了新台词后运行 `python3 tools/subset_font.py`**，否则 `tests/font.test.js` 会报缺字。
- `txt()` 会把字号吸附到 12 的倍数（12/24/36/48），像素字体只有这样才清楚；不要用粗体。
- 界面皮肤：`ui_panel`（九宫格，48×48，四角 16px）、`ui_cursor`、`ui_next`、`ui_button`。有图就用图，没有就用代码画的框和符号。提示词在 `docs/美术提示词_界面.txt`。

## 美术流程
1. 提示词在 `docs/美术提示词_像素版.txt`（全部）和 `docs/美术提示词_第二批.txt`（剧情扩充的新角色）（由 scratch 脚本生成，改动时保持“每张图一段完整提示词”的格式，并同步发给用户 txt）。
2. 用户发来的原图 → 按文件名存进 `assets/raw/`（保留 webp 原件）。
3. 在 `tools/art_manifest.json` 加一条处理参数，运行 `python3 tools/process_art.py <名字>`。
   - 头像 96×96 / 48 色；CG 和标题 480×270 / 64 色（游戏里放大 2 倍）；平铺图块 128 / 32 色；单格物件 32。
   - 量化用 MAXCOVERAGE，能保住嘴里那点红之类的小面积颜色。
   - 行走图：`"sheet": [下, 左, 右, 上]` + `"frames": 3`，每张原图横排 3 帧，按空白间隔切帧、统一缩放、脚底对齐，拼成 `player.png`（3 列 × 4 行，每帧 32）。
   - 地图小人等单个角色：`"fit": true, "transparent": true`，裁到内容再缩，去白底（只去接近纯白的，保住白果的白毛）。
4. 截图验证，提交。给用户简短点评每张图（对照鸟类真实特征和剧情设定）。
- 已知问题记在 `docs/已知问题.md`。

## 约定
- 用户说中文，回复用中文；剧情台词带四川话味道。
- 直接推送到 `main`。
