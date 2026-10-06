// 大熊猫基地：食铁兽的竹林
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { FUN_NPC, FUN_TRIGGER } from '../fun.js';
import { deco } from '../deco.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

// 地图放大过一倍（SCALED2）：每格是原来的 2×2，坐标都按新格子算。
export default {
  id: 'panda',
  name: '大熊猫基地',
  region: 'chengdu',
  route: { x: 62, y: 22 },
  start: { x: 26, y: 34 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTbbbbbbbbbbbbbbbb....................bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb....................bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb,,,,,,,,,,,,bbTT",
    "TTbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,..........====..........,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,..........====..........,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,..........====..........,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,..........====..........,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbb,,,,,,,,,,bb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbbbbbbbbbbbbbb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbbbbbbbbbbbbbb........====........bb,,,,,,,,,,,,bbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTbbbbbbbbbbbbbbbb........====........bbbbbbbbbbbbbbbbTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 26, y0: 38, x1: 29, y1: 39, to: 'park', tx: 40, ty: 2 },
  ],
  props: [
    { key: 'lm_panda', x: 20, y: 30, w: 16, h: 6, solid: false, name: '熊猫基地大门' },
    deco('prop_apples', 18, 10, 4, 2),
    deco('prop_bamboo', 32, 8, 4, 6),
    deco('prop_bench', 10, 26, 4, 2),
  ],
  npcs: [
    at(NPC.panda, 22, 15),
  ],
  triggers: [
    area(TRIGGER.panda_butt, 26, 18, 29, 19),
    area(TRIGGER.jinbo2, 44, 20, 49, 25),
    area(FUN_TRIGGER.c1_gungun, 30, 24, 37, 27),
  ],
  zones: [
    { id: 'east', bg: 'bg_east', x0: 0, y0: 0, x1: 55, y1: 39, lv: [3, 4], table: [['bamboorat', 3], ['chili', 2]] },
  ],
  places: [],
};
