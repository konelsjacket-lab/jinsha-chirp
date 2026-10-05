// 武侯祠：君臣合祀的祠堂
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'wuhou',
  name: '武侯祠',
  region: 'chengdu',
  route: { x: 62, y: 84 },
  start: { x: 13, y: 2 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTT==TTTTTTTTTTTTT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "Tbbbbbbbb....==....bbbbbbbbT",
    "T........#SSSSSSSS#........T",
    "T,,,,,,,,#SSSSSSSS#........T",
    "T,,,,,,,,#SSSSSSSS#bbbbbbbbT",
    "T,,,,,,,,#SSSSSSSS#bbbbbbbbT",
    "T,,,,,,,,#SSSSSSSS#b,,,,,,bT",
    "T,,,,,,,,#SSSSSSSS#b,,,,,,bT",
    "T,,,,,,,,#SSSSSSSS#b,,,,,,bT",
    "T........#SSSSSSSS#b,,,,,,bT",
    "=====SSSSSSSSSSSSS#b,,,,,,bT",
    "=====SSSSSSSSSSSSS#b,,,,,,bT",
    "T........#SSSSSSSS#b,,,,,,bT",
    "T........#SSSSSSSS#bbbbbbbbT",
    "T........#SSSSSSSS#bbbbbbbbT",
    "T........#SSSSSSSS#........T",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 13, y0: 0, x1: 14, y1: 0, to: 'hejiang', tx: 14, ty: 18 },
    { x0: 0, y0: 13, x1: 0, y1: 14, to: 'caotang', tx: 26, ty: 13 },
  ],
  props: [
    { key: 'lm_wuhou', x: 10, y: 3, w: 8, h: 2, solid: false, name: '武侯祠大门' },
  ],
  npcs: [
    at(NPC.owl, 13, 10),
    at(NPC.furong_c, 3, 16),
  ],
  triggers: [
    area(TRIGGER.wuhou_wall, 10, 6, 17, 6),
  ],
  zones: [
    { id: 'south', bg: 'bg_north', x0: 0, y0: 0, x1: 27, y1: 19, lv: [3, 4], table: [['chili', 2], ['mahjong', 2]] },
  ],
  places: [],
};
