// 青城山道：通往青城山的山路
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { deco } from '../deco.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'qc_road',
  name: '青城山道',
  region: 'chengdu',
  route: { x: 18, y: 30 },
  start: { x: 27, y: 7 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TMMMMMMMMMMMMMMMMMMMMMMMMMMMMT",
    "TMMMMMMMMMMMMMMMMMMMMMMMMMMMMT",
    "TMMMMMMMMM...........MMMMMMMMT",
    "TMMMMMMM...............MMMMMMT",
    "TMMMMMMM.,,,,,.........MMMMMMT",
    "TMMMMMMM.,,,,,.........MMMMMMT",
    "T=============================",
    "T=============================",
    "TMMMMMMM.........,,,,,.MMMMMMT",
    "TMMMMMMM.........,,,,,.MMMMMMT",
    "TMMMMMMM...............MMMMMMT",
    "TMMMMMMMMM...........MMMMMMMMT",
    "TMMMMMMMMMMMMMMMMMMMMMMMMMMMMT",
    "TMMMMMMMMMMMMMMMMMMMMMMMMMMMMT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 29, y0: 7, x1: 29, y1: 8, to: 'shaocheng', tx: 1, ty: 10 },
  ],
  props: [
    deco('prop_beidou', 15, 5, 2, 2),
    deco('prop_bamboo', 20, 9, 2, 3),
    deco('prop_stonetable', 10, 10, 2, 2),
  ],
  npcs: [
    at(NPC.gate, 1, 7),
  ],
  triggers: [
    area(TRIGGER.little_snake, 9, 7, 12, 8),
  ],
  zones: [
    { id: 'qc', bg: 'bg_east', x0: 0, y0: 0, x1: 29, y1: 15, lv: [4, 5], table: [['chili', 2], ['watermonkey', 1], ['bamboorat', 1]] },
  ],
  places: [],
};
