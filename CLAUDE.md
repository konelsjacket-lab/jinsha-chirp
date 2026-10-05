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
- `src/data/` 是内容：`map.js`（字符画地图）、`npcs.js` / `story.js`（剧情脚本）、`enemies.js` 等。剧情步骤的写法见 `src/data/dsl.js`。
- 对话说话人可带表情：`say('白果:happy', ...)` → 头像 `portrait_baiguo_happy`，没有就退回默认头像。
- 剧情插图：`{ cg: 'cg_xxx' }` / `{ cg: null }`，`box: 'top'` 把对话框挪到上方。
- `src/systems/battle.js` 是纯逻辑（不依赖 Phaser），测试直接 import。
- `src/assets.js` 是资源清单。图片缺失时用 `src/placeholders.js` 现画的占位图；`optional: true` 的缺失就跳过。
- 地图图块：每种地形一张 128×128 的无缝平铺图，铺在 4×4 格上（`VARIANT`）；树（`SINGLE_TILES`）是单格 32×32。Boot 启动时拼成带 1px 外扩、2px 间距的图块集，防止 1.5 倍缩放时接缝出细线。

## 美术流程
1. 提示词在 `docs/美术提示词_像素版.txt`（由 scratch 脚本生成，改动时保持“每张图一段完整提示词”的格式，并同步发给用户 txt）。
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
