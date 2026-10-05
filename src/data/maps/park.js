// 人民公园：白果的家。鹤鸣茶社、相亲角、保路纪念碑
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'park',
  name: '人民公园',
  region: 'chengdu',
  route: { x: 62, y: 44 },
  start: { x: 28, y: 9 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTT==TTTTTT",
    "T.......................==.....T",
    "T.Y..Y..Y..Y..Y..Y..Y...==.....T",
    "T.......................==.,,,,T",
    "T............T......T...==.,,,,T",
    "T.......................==.,,,,T",
    "T.......................==.,,Y,T",
    "T.......................==.,,,,T",
    "T.......................==.,,,,T",
    "T.......................SS.....T",
    "========SSSSSSSSSSSSSSSSSSS....T",
    "========SSSSSSSSSSSSSSSSSSS....T",
    "T..............SS..............T",
    "T..............==~~~~~~~~~~~...T",
    "T.fffffff.,,,,.==~~~~~~~~~~~...T",
    "T.f.....f.,,,,.==~~~~~~~~~~~...T",
    "T.f.....f.,,,,.==~~~~~~~~~~~...T",
    "T.f.....f.,,,,.==~~~~~~~~~~~...T",
    "T.fffffff.,,,,.==~~~~~~~~~~~...T",
    "T..............==..............T",
    "T.Y...Y...Y...Y==.Y...Y...Y...YT",
    "TTTTTTTTTTTTTTT==TTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 0, y0: 10, x1: 0, y1: 11, to: 'shaocheng', tx: 30, ty: 10 },
    { x0: 15, y0: 21, x1: 16, y1: 21, to: 'hejiang', tx: 14, ty: 1 },
    { x0: 24, y0: 0, x1: 25, y1: 0, to: 'panda', tx: 13, ty: 18 },
  ],
  props: [
    { key: 'lm_heming', x: 2, y: 4, w: 6, h: 4, solid: true, name: '鹤鸣茶社' },
    { key: 'lm_baolu', x: 11, y: 5, w: 2, h: 3, solid: true, name: '保路纪念碑' },
  ],
  npcs: [
    at(NPC.zaozao, 26, 8),
    at(NPC.turtle, 5, 8),
    at(NPC.magpie, 5, 16),
    at(NPC.maoda, 12, 13),
  ],
  triggers: [
    area(TRIGGER.koi, 18, 12, 26, 12),
  ],
  zones: [
    { id: 'park', bg: 'bg_park', x0: 0, y0: 0, x1: 31, y1: 21, lv: [1, 2], table: [['sparrow', 3], ['mosquito', 2]] },
  ],
  places: [
    { name: '鹤鸣茶社', x0: 1, y0: 3, x1: 8, y1: 9 },
    { name: '相亲角', x0: 1, y0: 13, x1: 9, y1: 19 },
  ],
};
