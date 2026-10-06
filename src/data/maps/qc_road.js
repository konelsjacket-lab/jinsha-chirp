// 青城山道：通往青城山的山路
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { deco } from '../deco.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

// 地图放大过一倍（SCALED2）：每格是原来的 2×2，坐标都按新格子算。
export default {
  id: 'qc_road',
  name: '青城山道',
  region: 'chengdu',
  route: { x: 18, y: 30 },
  start: { x: 54, y: 14 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMM......................MMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMM......................MMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..............................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..............................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..,,,,,,,,,,..................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..,,,,,,,,,,..................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..,,,,,,,,,,..................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..,,,,,,,,,,..................MMMMMMMMMMMMTT",
    "TT==========================================================",
    "TT==========================================================",
    "TT==========================================================",
    "TT==========================================================",
    "TTMMMMMMMMMMMMMM..................,,,,,,,,,,..MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..................,,,,,,,,,,..MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..................,,,,,,,,,,..MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..................,,,,,,,,,,..MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..............................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMM..............................MMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMM......................MMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMM......................MMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 58, y0: 14, x1: 59, y1: 17, to: 'shaocheng', tx: 2, ty: 20 },
  ],
  props: [
    deco('prop_beidou', 30, 10, 4, 4),
    deco('prop_bamboo', 40, 18, 4, 6),
    deco('prop_stonetable', 20, 20, 4, 4),
  ],
  npcs: [
    at(NPC.gate, 2, 15),
  ],
  triggers: [
    area(TRIGGER.little_snake, 18, 14, 25, 17),
  ],
  zones: [
    { id: 'qc', bg: 'bg_east', x0: 0, y0: 0, x1: 59, y1: 31, lv: [4, 5], table: [['chili', 2], ['watermonkey', 1], ['bamboorat', 1]] },
  ],
  places: [],
};
