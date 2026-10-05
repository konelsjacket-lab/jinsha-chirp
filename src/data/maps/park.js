// 人民公园：白果的家，序章全在这里。
// 西边鹤鸣茶社，北边保路纪念碑，东边老银杏（白果的窝），东南是湖，西南是相亲角。
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { PROLOGUE_NPCS as P, PROLOGUE_TRIGGERS as PT, MONUMENT } from '../prologue.js';
import { say } from '../dsl.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

// 序章没结束之前，三个出口都出不去
const notYet = s => s.flags.intro_done;
const blocked = () => say('噪噪', '你要去哪儿？鹤鸣茶社在西边，今天先在公园里耍嘛！');

export default {
  id: 'park',
  name: '人民公园',
  region: 'chengdu',
  route: { x: 62, y: 44 },
  start: { x: 29, y: 8 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTT==TTTTTTTTTTTT",
    "T.Y..Y..Y..Y..Y..Y..==.Y..Y..Y...T",
    "T...................==...........T",
    "T.SSSSSSSSSS.SSSSSS.==.,,,.......T",
    "T.SSSSSSSSSS.SSSSSS.==.,,,.......T",
    "T.SSSSSSSSSS.SSSSSS.==.,,,.......T",
    "T.SSSSSSSSSS.SSSSSS.==.,,,.......T",
    "T.SSSSSSSSSS.SSSSSS.==.,,,.......T",
    "T.SSSSSSSSSS.SSSSSS.==....SS.....T",
    "T.SSSSSSSSSS........SS....SS.....T",
    "T.SSSSSSSSSS........SS....SS.....T",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS..T",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS..T",
    "T..............==................T",
    "T..............==................T",
    "T.ffff.fff,,,,.==..~~~~~~~~~~~,,,T",
    "T.f.......,,,,.==..~~~~~~~~~~~,,,T",
    "T.f.......,,,,.==..~~~~~~~~~~~,,,T",
    "T.f.......,,,,.==T.~~~~~~~~~~~,,,T",
    "T.f.......,,,,.==..~~~~~~~~~~~,,,T",
    "T.f.......,,,,.==..~~~~~~~~~~~,,,T",
    "T.fffffffff.Y..==.Y...........,,,T",
    "T..............==................T",
    "TTTTTTTTTTTTTTT==TTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 0, y0: 11, x1: 0, y1: 12, to: 'shaocheng', tx: 30, ty: 10, when: notYet, blocked },
    { x0: 15, y0: 23, x1: 16, y1: 23, to: 'hejiang', tx: 14, ty: 1, when: notYet, blocked },
    { x0: 20, y0: 0, x1: 21, y1: 0, to: 'panda', tx: 13, ty: 18, when: notYet, blocked },
  ],
  props: [
    { key: 'lm_heming', x: 3, y: 3, w: 7, h: 4, solid: true, name: '鹤鸣茶社' },
    { key: 'lm_baolu', x: 15, y: 3, w: 2, h: 3, solid: true, name: '保路纪念碑', script: MONUMENT },
    { key: 'lm_nest', x: 29, y: 3, w: 3, h: 3, solid: true, name: '老银杏', script: () => say('', '公园里最老的一棵银杏。白果的窝就在上面。') },
  ],
  npcs: [
    at(P.mama, 30, 7),
    at(NPC.turtle, 5, 8),
    at(P.myna, 8, 8),
    at(P.pigeon, 17, 7),
    at(NPC.magpie, 5, 18),
    at(P.maoda_lake, 18, 16),
    at(P.xiuyan, 18, 17),
    at(NPC.maoda, 12, 22),
    at(NPC.zaozao, 24, 9),
    at(NPC.mama_gate, 3, 13),
  ],
  triggers: [
    area(PT.p_ginkgo, 18, 11, 22, 12),
    area(PT.p_tea, 2, 7, 11, 10),
    area(PT.p_lake, 14, 13, 19, 15),
    area(PT.p_home, 26, 6, 32, 10),
    area(TRIGGER.koi, 20, 14, 28, 14),
  ],
  zones: [
    { id: 'park', bg: 'bg_park', x0: 0, y0: 0, x1: 33, y1: 23, lv: [1, 2], table: [['sparrow', 3], ['mosquito', 2]] },
  ],
  places: [
    { name: '鹤鸣茶社', x0: 1, y0: 2, x1: 11, y1: 10 },
    { name: '相亲角', x0: 1, y0: 14, x1: 10, y1: 22 },
  ],
};
