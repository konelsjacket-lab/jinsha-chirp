// 安顺廊桥·望江楼：锦江上的廊桥，江边的竹林
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { FUN_NPC, FUN_TRIGGER, WANGJIANG } from '../fun.js';
import { deco } from '../deco.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

// 地图放大过一倍（SCALED2）：每格是原来的 2×2，坐标都按新格子算。
export default {
  id: 'langqiao',
  name: '安顺廊桥·望江楼',
  region: 'chengdu',
  route: { x: 82, y: 64 },
  start: { x: 4, y: 8 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT........................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "========================..,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "========================..,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "========================..,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "========================..,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT..................==....,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT..................==....,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT",
    "TT..................==....................................TT",
    "TT..................==....................................TT",
    "TT..................==....................................TT",
    "TT..................==....................................TT",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~~~~HHHHHH~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "TT..................==..............bbbbbbbbbbbbbbbbbbbbbbTT",
    "TT..................==..............bbbbbbbbbbbbbbbbbbbbbbTT",
    "TT,,,,,,,,,,,,,,,,..========================..........bbbbTT",
    "TT,,,,,,,,,,,,,,,,..========================..........bbbbTT",
    "TT,,,,,,,,,,,,,,,,..==========================........bbbbTT",
    "TT,,,,,,,,,,,,,,,,..==========================........bbbbTT",
    "TT,,,,,,,,,,,,,,,,..................bbbb..............bbbbTT",
    "TT,,,,,,,,,,,,,,,,..................bbbb..............bbbbTT",
    "TT,,,,,,,,,,,,,,,,..................bbbbbbbbbbbbbbbbbbbbbbTT",
    "TT,,,,,,,,,,,,,,,,..................bbbbbbbbbbbbbbbbbbbbbbTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 0, y0: 8, x1: 1, y1: 11, to: 'hejiang', tx: 60, ty: 18 },
  ],
  props: [
    { key: 'lm_langqiao', x: 16, y: 14, w: 10, h: 12, solid: false, name: '安顺廊桥' },
    { key: 'lm_wangjiang', x: 46, y: 26, w: 6, h: 4, solid: true, name: '望江楼', script: WANGJIANG },
    { key: 'prop_boat', x: 6, y: 20, w: 4, h: 2, deco: true },
    { key: 'prop_furong', x: 4, y: 10, w: 4, h: 6, deco: true },
    { key: 'prop_lantern', x: 26, y: 14, w: 2, h: 4, deco: true },
    deco('prop_zhubian', 10, 30, 4, 4),
    deco('prop_bamboo', 50, 12, 4, 6),
    deco('prop_bench', 6, 14, 4, 2),
    deco('prop_lotus', 40, 30, 4, 2),
  ],
  npcs: [
    at(NPC.zhupopo, 42, 31),
    at(NPC.furong_b, 10, 15),
  ],
  triggers: [
    area(TRIGGER.c1_bridge, 18, 18, 23, 23),
  ],
  zones: [
    { id: 'south', bg: 'bg_south', x0: 0, y0: 0, x1: 59, y1: 35, lv: [3, 4], table: [['watermonkey', 2], ['chili', 1]] },
  ],
  places: [],
};
