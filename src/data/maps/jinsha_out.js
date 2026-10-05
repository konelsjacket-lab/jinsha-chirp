// 金沙遗址·外围：古蜀人祭祀过的地方
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

export default {
  id: 'jinsha_out',
  name: '金沙遗址·外围',
  region: 'chengdu',
  route: { x: 42, y: 64 },
  start: { x: 14, y: 2 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTT==TTTTTTTTTTTTTT",
    "T.............==.............T",
    "T.,,,,,,,,,...==....,,,,,,,,.T",
    "T.,,,,,,,,,...==....,,,,,,,,.T",
    "T.,,,,,,,,,...==....,,,,,,,,.T",
    "T.,,,,,,,,,...==....,,,,,,,,.T",
    "T.............SS.............T",
    "T.....SSSSSSSSSSSSSSSSSS.....T",
    "T.....SJMJJJJJJJJJJJJMJS.....T",
    "T.....SJJJJJJJJJJJJJJJJS.....T",
    "JJJJJJSJJJJJJJJJJJJJJJJS.....T",
    "JJJJJJSJJJJJJJJJJJJJJJJS.....T",
    "T.....SJMJJJJJJJJJJJJMJS.....T",
    "T.....SSSSSSSSSSSSSSSSSS.....T",
    "T............................T",
    "T..,,,,,,............,,,,,,..T",
    "T..,,,,,,............,,,,,,..T",
    "T..,,,,,,,,,,,,,,,,,,,,,,,,..T",
    "T..,,,,,,,,,,,,,,,,,,,,,,,,..T",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 14, y0: 0, x1: 15, y1: 0, to: 'shaocheng', tx: 14, ty: 18 },
    { x0: 0, y0: 10, x1: 0, y1: 11, to: 'jinsha_altar', tx: 18, ty: 7 },
  ],
  props: [],
  npcs: [],
  triggers: [
    area(TRIGGER.c1_jinsha, 13, 1, 16, 3),
    area(TRIGGER.jinbo1, 4, 3, 6, 4),
  ],
  zones: [
    { id: 'west', bg: 'bg_west', x0: 0, y0: 0, x1: 29, y1: 19, lv: [2, 3], table: [['sparrow', 2], ['mosquito', 2], ['mahjong', 1]] },
  ],
  places: [],
};
