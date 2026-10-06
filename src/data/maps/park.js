// 人民公园：白果的家，序章全在这里。
// 西边鹤鸣茶社，北边保路纪念碑，东边老银杏（白果的窝），东南是湖，西南是相亲角。
// 地形是字符画（图例见 ../map.js）。exits：走到这片格子就切到另一张图（tx, ty 是对面的落脚点）；props：地标大图。
import { NPC, TRIGGER } from '../npcs.js';
import { PROLOGUE_NPCS as P, PROLOGUE_TRIGGERS as PT, MONUMENT } from '../prologue.js';
import { say } from '../dsl.js';
import { FUN_NPC, FUN_TRIGGER } from '../fun.js';
import { deco } from '../deco.js';
import { at, area, CHENGDU_MOOD } from './helpers.js';

// 序章没结束之前，三个出口都出不去
const notYet = s => s.flags.intro_done;
const blocked = () => say('噪噪', '你要去哪儿？鹤鸣茶社在西边，今天先在公园里耍嘛！');

// 地图放大过一倍（SCALED2）：每格是原来的 2×2，坐标都按新格子算。
export default {
  id: 'park',
  name: '人民公园',
  region: 'chengdu',
  route: { x: 62, y: 44 },
  start: { x: 58, y: 16 },
  music: 'bgm_world',
  mood: CHENGDU_MOOD,
  rows: [
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTT",
    "TT..YY....YY....YY....YY....YY....YY....====..YY....YY....YY......TT",
    "TT..YY....YY....YY....YY....YY....YY....====..YY....YY....YY......TT",
    "TT......................................====......................TT",
    "TT......................................====......................TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====..,,,,,,..............TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====........SSSS..........TT",
    "TT..SSSSSSSSSSSSSSSSSSSS..SSSSSSSSSSSS..====........SSSS..........TT",
    "TT..SSSSSSSSSSSSSSSSSSSS................SSSS........SSSS..........TT",
    "TT..SSSSSSSSSSSSSSSSSSSS................SSSS........SSSS..........TT",
    "TT..SSSSSSSSSSSSSSSSSSSS................SSSS........SSSS..........TT",
    "TT..SSSSSSSSSSSSSSSSSSSS................SSSS........SSSS..........TT",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS....TT",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS....TT",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS....TT",
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS....TT",
    "TT............................====................................TT",
    "TT............................====................................TT",
    "TT............................====................................TT",
    "TT............................====................................TT",
    "TT..ffffffff..ffffff,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ffffffff..ffffff,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====TT..~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====TT..~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ff..............,,,,,,,,..====....~~~~~~~~~~~~~~~~~~~~~~,,,,,,TT",
    "TT..ffffffffffffffffff..YY....====..YY......................,,,,,,TT",
    "TT..ffffffffffffffffff..YY....====..YY......................,,,,,,TT",
    "TT............................====................................TT",
    "TT............................====................................TT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT====TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  ],
  exits: [
    { x0: 0, y0: 22, x1: 1, y1: 25, to: 'shaocheng', tx: 60, ty: 20, when: notYet, blocked },
    { x0: 30, y0: 46, x1: 33, y1: 47, to: 'hejiang', tx: 28, ty: 2, when: notYet, blocked },
    { x0: 40, y0: 0, x1: 43, y1: 1, to: 'panda', tx: 26, ty: 36, when: notYet, blocked },
  ],
  props: [
    { key: 'lm_heming', x: 6, y: 6, w: 14, h: 8, solid: true, name: '鹤鸣茶社' },
    { key: 'lm_baolu', x: 30, y: 6, w: 4, h: 6, solid: true, name: '保路纪念碑', script: MONUMENT },
    { key: 'lm_nest', x: 58, y: 6, w: 6, h: 6, solid: true, name: '老银杏', script: () => say('', '公园里最老的一棵银杏。白果的窝就在上面。') },
    { key: 'prop_mahjong', x: 4, y: 16, w: 4, h: 4, deco: true },
    { key: 'prop_teatable', x: 20, y: 16, w: 4, h: 4, deco: true },
    deco('prop_changzuihu', 12, 18, 4, 4),
    deco('prop_bike', 2, 26, 4, 2),
    deco('prop_birdcage', 26, 40, 2, 4),
    deco('prop_stonetable', 62, 24, 4, 4),
    deco('prop_bench', 46, 26, 4, 2),
    deco('prop_flowerbed', 22, 26, 4, 4),
    deco('prop_leaves', 46, 4, 4, 2),
    deco('prop_leaves', 6, 24, 4, 2),
    deco('prop_leaves', 56, 24, 4, 2),
    deco('prop_bench', 8, 42, 4, 2),
    deco('prop_flowerbed', 44, 40, 4, 4),
  ],
  npcs: [
    at(P.mama, 60, 15),
    at(NPC.turtle, 10, 17),
    at(P.myna, 16, 17),
    at(P.pigeon, 34, 15),
    at(NPC.magpie, 10, 37),
    at(P.maoda_lake, 36, 33),
    at(P.xiuyan, 36, 35),
    at(NPC.maoda, 24, 45),
    at(NPC.zaozao, 48, 19),
    at(NPC.mama_gate, 6, 27),
  ],
  triggers: [
    area(PT.p_ginkgo, 36, 22, 45, 25),
    area(PT.p_tea, 4, 14, 23, 21),
    area(PT.p_lake, 28, 26, 39, 31),
    area(PT.p_home, 52, 12, 65, 21),
    area(TRIGGER.koi, 40, 28, 57, 29),
    area(FUN_TRIGGER.p_ads, 14, 32, 19, 35),
  ],
  zones: [
    { id: 'park', bg: 'bg_park', x0: 0, y0: 0, x1: 67, y1: 47, lv: [1, 2], table: [['sparrow', 3], ['mosquito', 2]] },
  ],
  places: [
    { name: '鹤鸣茶社', x0: 2, y0: 4, x1: 23, y1: 21 },
    { name: '相亲角', x0: 2, y0: 28, x1: 21, y1: 45 },
  ],
};
