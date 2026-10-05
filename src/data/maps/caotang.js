// 浣花溪·杜甫草堂：杜甫住过快四年的地方
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'caotang',
  name: '浣花溪·杜甫草堂',
  region: 'chengdu',
  route: { x: 40, y: 88 },
  start: { x: 26, y: 13 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TbbbbbbbbbbbbbbbbbbbbbbbbbbT",
    "Tb.........................T",
    "Tb.,,,,,,,........,,,,,,,,.T",
    "Tb.,,,,,,,........,,,,,,,,.T",
    "Tb.,,,,,,,........,,,,,,,,.T",
    "Tb.,,,,,,,........,,,,,,,,.T",
    "Tb.,,,,,,,........,,,,,,,,.T",
    "Tb.,,,,,,,..==....,,,,,,,,.T",
    "Tb.,,,,,,,..==.............T",
    "Tb.fffff....==.ffffff......T",
    "Tb.fffff....==.ffffff......T",
    "Tb.fffff....==.ffffff......T",
    "Tb.fffff....================",
    "Tb..........================",
    "Tb~~~~~~~~~~HH~~~~~~~......T",
    "Tb~~~~~~~~~~HH~~~~~~~......T",
    "Tbbbbbbbbbbbbbbbbbbbbbbbbb.T",
    "TbbbbbbbbbbbbbbbbbbbbbbbbbbT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 27, y0: 13, x1: 27, y1: 14, to: 'wuhou', tx: 1, ty: 13 },
  ],
  props: [
    { key: 'lm_caotang', x: 13, y: 3, w: 5, h: 4, solid: true, name: '草堂茅屋' },
  ],
  npcs: [
    at(NPC.cuckoo, 16, 8),
  ],
  triggers: [],
  zones: [
    { id: 'caotang', bg: 'bg_east', x0: 0, y0: 0, x1: 27, y1: 19, lv: [3, 4], table: [['bamboorat', 2], ['chili', 2]] },
  ],
  places: [],
};
