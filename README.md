# 金沙啾 · Jinsha Chirp

一只年纪轻轻就白了头的成都**白头鹎**，飞遍巴蜀，寻找自己头顶那撮白毛的秘密。
一路上会遇见太阳神鸟、李冰的石犀、青城山白蛇等神话生物。

- 🗺️ 自由移动的成都地图：人民公园、金沙遗址、宽窄巷子、锦江、杜甫草堂、武侯祠、大熊猫基地、青城山道
- 🐦 主角白果：白头鹎，后脑勺那撮白毛是太阳神鸟留下的光
- ✨ 路上的奇遇和 NPC
- ⚔️ 高草丛遇怪 + 回合制战斗（技能、道具、防御、逃跑、升级）

美术：GPT · 音乐：Gemini · 程序：Claude

## 运行

纯 HTML5，不需要安装依赖（Phaser 3 已放在 `vendor/`）。在项目根目录起一个静态服务器：

```bash
npm start          # 等于 python3 -m http.server 8080
# 然后打开 http://localhost:8080
```

> 直接双击 `index.html` 不行，浏览器不允许 `file://` 加载 ES 模块。

运行测试（战斗数值、地图连通性、Boss 平衡）：

```bash
npm test
```

## 操作

| | 电脑 | 手机 |
|---|---|---|
| 移动 | 方向键 / WASD | 屏幕左半边拖动（虚拟摇杆） |
| 对话 / 确认 | 空格 / 回车 / Z | 右下角「互动」/ 点屏幕 |
| 菜单 / 返回 | Esc / X | 「菜单」按钮 |

## 项目结构

```
index.html            入口
vendor/phaser.min.js  Phaser 3.90
src/
  main.js             游戏配置
  config.js           全局常量（格子大小、缩放、遇怪率……）
  assets.js           资源清单（美术/音乐的文件名都在这）
  placeholders.js     占位美术（Canvas 现画，真图到了自动替换）
  state.js            存档
  data/               ← 写内容主要改这里
    map.js            地图（字符画，直接改字符）
    npcs.js           NPC 位置 + 对话剧情
    story.js          开场、战败、任务目标
    enemies.js        怪物数值和招式
    skills.js items.js encounters.js characters.js
  systems/battle.js   战斗公式（纯逻辑，可单测）
  scenes/             Boot / Title / World / UI / Battle
  ui/                 对话框、菜单
assets/img/           美术放这里（见 docs/ART_BRIEF.md）
assets/audio/         音乐放这里（见 docs/MUSIC_BRIEF.md）
docs/                 故事设定、美术需求、音乐需求
```

## 加美术 / 音乐

按 [`docs/ART_BRIEF.md`](docs/ART_BRIEF.md) 和 [`docs/MUSIC_BRIEF.md`](docs/MUSIC_BRIEF.md) 里的文件名和尺寸丢进 `assets/`，刷新即可，不用改代码。

## 写剧情

剧情是数据驱动的，一段剧情就是一个步骤数组，例子见 `src/data/npcs.js`，可用的步骤见 `src/data/dsl.js`。
