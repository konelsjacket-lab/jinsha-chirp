// 大熊猫基地：食铁兽的竹林
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'panda',
  name: '大熊猫基地',
  region: 'chengdu',
  route: { x: 62, y: 22 },
  start: { x: 13, y: 17 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "Tbbbbbbbb..........bbbbbbbbT",
    "TbbbbbbbbbbbbbbbbbbbbbbbbbbT",
    "Tbbbbbbbbbbbbbbbbbbb,,,,,,bT",
    "Tbb,,,,,.....==.....,,,,,,bT",
    "Tbb,,,,,.....==.....,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbb,,,,,b....==....b,,,,,,bT",
    "Tbbbbbbbb....==....b,,,,,,bT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "TTTTTTTTTTTTT==TTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 13, y0: 19, x1: 14, y1: 19, to: 'park', tx: 24, ty: 1 },
  ],
  props: [
    { key: 'lm_panda', x: 10, y: 15, w: 8, h: 3, solid: false, name: '熊猫基地大门' },
  ],
  npcs: [
    at(NPC.panda, 11, 7),
  ],
  triggers: [
    area(TRIGGER.panda_butt, 13, 9, 14, 9),
    area(TRIGGER.jinbo2, 22, 10, 24, 12),
  ],
  zones: [
    { id: 'east', bg: 'bg_east', x0: 0, y0: 0, x1: 27, y1: 19, lv: [3, 4], table: [['bamboorat', 3], ['chili', 2]] },
  ],
  places: [],
};
