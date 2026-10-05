// 金沙·太阳神鸟祭坛：太阳神鸟的残光守在这里
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'jinsha_altar',
  name: '金沙·太阳神鸟祭坛',
  region: 'chengdu',
  route: { x: 24, y: 72 },
  start: { x: 17, y: 8 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "MMMMMMMMMMMMMMMMMMMM",
    "MffffffffffffffffffM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJJ",
    "MJJJJJJJJJJJJJJJJJJJ",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MJJJJJJJJJJJJJJJJJJM",
    "MffffffffffffffffffM",
    "MMMMMMMMMMMMMMMMMMMM",
  ],
  exits: [
    { x0: 19, y0: 7, x1: 19, y1: 8, to: 'jinsha_out', tx: 1, ty: 10 },
  ],
  props: [
    { key: 'lm_altar', x: 7, y: 3, w: 6, h: 5, solid: true, name: '太阳神鸟祭坛' },
    { key: 'prop_stonelamp', x: 5, y: 6, w: 1, h: 2, deco: true },
    { key: 'prop_stonelamp', x: 14, y: 6, w: 1, h: 2, deco: true },
  ],
  npcs: [
    at(NPC.sunbird, 10, 10),
    at(NPC.axi, 13, 10),
  ],
  triggers: [],
  zones: [],
  places: [],
};
