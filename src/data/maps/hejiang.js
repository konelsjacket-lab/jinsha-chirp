// 合江亭·锦江：府河、南河在这里汇合
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { FUN_NPC, FUN_TRIGGER } from '../fun.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'hejiang',
  name: '合江亭·锦江',
  region: 'chengdu',
  route: { x: 62, y: 64 },
  start: { x: 14, y: 2 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTT==TTTTTT~~~TTTTTTT",
    "T.............==......~~~......T",
    "T.............==......~~~.,,,,,T",
    "T.,,,,,,,,,...==......~~~.,,,,,T",
    "T.,,,,,,,,,...==......~~~.,,,,,T",
    "T.,,,,,,,,,...==......~~~.,,,,,T",
    "T.,,,,,,,,,...==......~~~.,,,,,T",
    "T.,,,,,,,,,...==......~~~.,,,,,T",
    "T.,,,,,,,,,...SSSSSSSS~~~......T",
    "T.............SSSSSSSSHHH=======",
    "T.............SSSSSSSSHHH=======",
    "T...............SSSSSS~~~......T",
    "~~~~~~~~~~~~~~HH~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~HH~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~HH~~~~~~~~~~~~~~~~",
    "T.............==...............T",
    "T.,,,,,,,,,,,.==..,,,,,,,,,,,,.T",
    "T.,,,,,,,,,,,.==..,,,,,,,,,,,,.T",
    "T.,,,,,,,,,,,.==..,,,,,,,,,,,,.T",
    "TTTTTTTTTTTTTT==TTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 14, y0: 0, x1: 15, y1: 0, to: 'park', tx: 15, ty: 20 },
    { x0: 31, y0: 9, x1: 31, y1: 10, to: 'langqiao', tx: 1, ty: 4 },
    { x0: 14, y0: 19, x1: 15, y1: 19, to: 'wuhou', tx: 13, ty: 1 },
  ],
  props: [
    { key: 'lm_hejiang', x: 18, y: 8, w: 3, h: 2, solid: true, name: '合江亭' },
    { key: 'prop_boat', x: 5, y: 13, w: 2, h: 1, deco: true },
    { key: 'prop_boat', x: 24, y: 13, w: 2, h: 1, deco: true },
  ],
  npcs: [
    at(NPC.rhino, 19, 11),
    at(NPC.kingfisher, 11, 10),
    at(NPC.monkey_boss, 5, 11),
  ],
  triggers: [
    area(TRIGGER.river_note, 15, 11, 17, 11),
    area(FUN_TRIGGER.c1_dance, 6, 9, 8, 10),
  ],
  zones: [
    { id: 'south', bg: 'bg_south', x0: 0, y0: 0, x1: 31, y1: 19, lv: [3, 5], table: [['chili', 2], ['watermonkey', 2], ['mahjong', 1]] },
  ],
  places: [],
};
