// 少城·宽窄巷子：清代满城留下来的老街
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { FUN_NPC, FUN_TRIGGER } from '../fun.js';
import { deco } from '../deco.js';
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
    { x0: 31, y0: 10, x1: 31, y1: 11, to: 'park', tx: 1, ty: 11 },
    { x0: 0, y0: 10, x1: 0, y1: 11, to: 'qc_road', tx: 28, ty: 7 },
    { x0: 14, y0: 19, x1: 15, y1: 19, to: 'jinsha_out', tx: 14, ty: 1 },
  ],
  props: [
    { key: 'lm_kuanzhai', x: 26, y: 13, w: 4, h: 3, solid: true, name: '宽窄巷子门楼' },
    { key: 'prop_lantern', x: 6, y: 11, w: 1, h: 2, deco: true },
    { key: 'prop_lantern', x: 22, y: 11, w: 1, h: 2, deco: true },
    { key: 'prop_teatable', x: 27, y: 16, w: 2, h: 2, deco: true },
    { key: 'prop_furong', x: 18, y: 14, w: 2, h: 3, deco: true },
    deco('prop_bianlian', 22, 16, 2, 2),
    deco('prop_well', 4, 16, 2, 2),
    deco('prop_snackcart', 12, 12, 2, 1),
    deco('prop_lantern', 14, 8, 1, 2),
    deco('prop_flowerbed', 28, 17, 2, 2),
    deco('prop_bench', 2, 12, 2, 1),
  ],
  npcs: [
    at(NPC.hoopoe, 12, 9),
    at(NPC.hongzhong, 28, 3),
    at(NPC.furong_a, 17, 17),
  ],
  triggers: [
    area(TRIGGER.c1_lost, 26, 9, 29, 12),
    area(TRIGGER.hotpot, 8, 9, 9, 10),
    area(FUN_TRIGGER.c1_tanghua, 18, 9, 18, 12),
    area(FUN_TRIGGER.c1_cat, 20, 3, 20, 4),
  ],
  zones: [
    { id: 'north', bg: 'bg_north', x0: 0, y0: 0, x1: 31, y1: 19, lv: [2, 3], table: [['sparrow', 2], ['mahjong', 2]] },
  ],
  places: [],
};
