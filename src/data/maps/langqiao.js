// 安顺廊桥·望江楼：锦江上的廊桥，江边的竹林
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'langqiao',
  name: '安顺廊桥·望江楼',
  region: 'chengdu',
  route: { x: 82, y: 64 },
  start: { x: 2, y: 4 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "T............,,,,,,,,,,,,,,,,T",
    "T............,,,,,,,,,,,,,,,,T",
    "T............,,,,,,,,,,,,,,,,T",
    "============.,,,,,,,,,,,,,,,,T",
    "============.,,,,,,,,,,,,,,,,T",
    "T.........=..,,,,,,,,,,,,,,,,T",
    "T.........=..................T",
    "T.........=..................T",
    "~~~~~~~~~HHH~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~HHH~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~HHH~~~~~~~~~~~~~~~~~~",
    "T.........=.......bbbbbbbbbbbT",
    "T,,,,,,,,.============.....bbT",
    "T,,,,,,,,.=============....bbT",
    "T,,,,,,,,.........bb.......bbT",
    "T,,,,,,,,.........bbbbbbbbbbbT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 0, y0: 4, x1: 0, y1: 5, to: 'hejiang', tx: 30, ty: 9 },
  ],
  props: [
    { key: 'lm_langqiao', x: 8, y: 7, w: 5, h: 6, solid: false, name: '安顺廊桥' },
    { key: 'lm_wangjiang', x: 23, y: 13, w: 3, h: 2, solid: true, name: '望江楼' },
  ],
  npcs: [
    at(NPC.zhupopo, 21, 15),
    at(NPC.furong_b, 5, 7),
  ],
  triggers: [
    area(TRIGGER.c1_bridge, 9, 9, 11, 11),
  ],
  zones: [
    { id: 'south', bg: 'bg_south', x0: 0, y0: 0, x1: 29, y1: 17, lv: [3, 4], table: [['watermonkey', 2], ['chili', 1]] },
  ],
  places: [],
};
