// 少城·宽窄巷子：清代满城留下来的老街
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'shaocheng',
  name: '少城·宽窄巷子',
  region: 'chengdu',
  route: { x: 42, y: 44 },
  start: { x: 29, y: 10 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "T.........................,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "TSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "T..#######S#########S#####,,,,,T",
    "TSSSSSSSSSSSSSSSSSSSSSSSSSSSSSST",
    "=SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS=",
    "=SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS=",
    "TSSSSSSSSSSSSSSSSSSSSSSSSSSSSSST",
    "T..###########SS##########.....T",
    "T..###########SS##########.....T",
    "T..###########SS##########.....T",
    "T.,,,,,,,,,,,.SS...............T",
    "T.,,,,,,,,,,,.SS....Y...Y......T",
    "T.,,,,,,,,,,,.SS...............T",
    "TTTTTTTTTTTTTTSSTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 31, y0: 10, x1: 31, y1: 11, to: 'park', tx: 1, ty: 10 },
    { x0: 0, y0: 10, x1: 0, y1: 11, to: 'qc_road', tx: 28, ty: 7 },
    { x0: 14, y0: 19, x1: 15, y1: 19, to: 'jinsha_out', tx: 14, ty: 1 },
  ],
  props: [
    { key: 'lm_kuanzhai', x: 26, y: 13, w: 4, h: 3, solid: true, name: '宽窄巷子门楼' },
  ],
  npcs: [
    at(NPC.hoopoe, 12, 9),
    at(NPC.hongzhong, 28, 3),
  ],
  triggers: [
    area(TRIGGER.hotpot, 8, 9, 9, 10),
  ],
  zones: [
    { id: 'north', bg: 'bg_north', x0: 0, y0: 0, x1: 31, y1: 19, lv: [2, 3], table: [['sparrow', 2], ['mahjong', 2]] },
  ],
  places: [],
};
