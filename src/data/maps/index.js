// 所有地图。成都拆成一块块小地图，用出口（exits）连起来；青城山是第二章的大地图。
import park from './park.js';
import shaocheng from './shaocheng.js';
import jinsha_out from './jinsha_out.js';
import jinsha_altar from './jinsha_altar.js';
import hejiang from './hejiang.js';
import langqiao from './langqiao.js';
import wuhou from './wuhou.js';
import caotang from './caotang.js';
import panda from './panda.js';
import qc_road from './qc_road.js';
import qingcheng from './qingcheng.js';
import { NPCS as QC_NPCS, TRIGGERS as QC_TRIGGERS, onEnter as qcOnEnter } from '../qingcheng.js';
import { chengduOnEnter } from '../story.js';

const AREAS = [park, shaocheng, jinsha_out, jinsha_altar, hejiang, langqiao, wuhou, caotang, panda, qc_road];

export const MAPS = Object.fromEntries([
  ...AREAS.map(a => [a.id, { places: [], props: [], exits: [], npcs: [], triggers: [], zones: [], onEnter: chengduOnEnter, ...a }]),
  ['qingcheng', {
    ...qingcheng, region: 'qingcheng', route: { x: 6, y: 12 }, props: [], exits: [],
    npcs: QC_NPCS, triggers: QC_TRIGGERS, onEnter: qcOnEnter,
  }],
]);

// 旧存档（成都还是一整张大地图的时候）：按旧坐标所在的区域，换到对应的小地图
const OLD_PLACES = [
  ['jinsha_altar', 3, 18, 20, 31], ['shaocheng', 28, 5, 46, 14], ['park', 28, 18, 53, 32],
  ['panda', 57, 1, 70, 22], ['caotang', 2, 39, 25, 46], ['wuhou', 27, 39, 46, 46],
  ['qc_road', 0, 0, 24, 13], ['hejiang', 0, 33, 53, 35], ['langqiao', 57, 23, 70, 46],
];
export function migrateOldChengdu(s) {
  if (s.map !== 'chengdu') return;
  const { x, y } = s.pos || {};
  const hit = OLD_PLACES.find(([, x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);
  s.map = hit ? hit[0] : 'park';
  s.pos = { ...MAPS[s.map].start };
}
