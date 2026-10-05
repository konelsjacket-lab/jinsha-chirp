// 所有地图。每张地图 = 地形（./chengdu.js 等）+ NPC + 奇遇 + 进入时的剧情
import chengdu from './chengdu.js';
import qingcheng from './qingcheng.js';
import { NPCS as CHENGDU_NPCS, TRIGGERS as CHENGDU_TRIGGERS } from '../npcs.js';
import { NPCS as QC_NPCS, TRIGGERS as QC_TRIGGERS, onEnter as qcOnEnter } from '../qingcheng.js';
import { chengduOnEnter } from '../story.js';

export const MAPS = {
  chengdu: { ...chengdu, npcs: CHENGDU_NPCS, triggers: CHENGDU_TRIGGERS, onEnter: chengduOnEnter },
  qingcheng: { ...qingcheng, npcs: QC_NPCS, triggers: QC_TRIGGERS, onEnter: qcOnEnter },
};
