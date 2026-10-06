import { SAVE_KEY } from './config.js';

// 放大过一倍的地图（v2 存档开始）
const SCALED_MAPS = ['park', 'shaocheng', 'jinsha_out', 'jinsha_altar', 'hejiang', 'langqiao', 'wuhou', 'caotang', 'panda', 'qc_road'];

export function newState() {
  return {
    v: 2,
    player: {
      name: '白果',
      lv: 1, exp: 0,
      hp: 40, maxHp: 40,
      mp: 12, maxMp: 12,
      atk: 9, def: 4, spd: 8,
      skills: ['peck', 'sing'],
    },
    items: { tangyou: 2 },
    flags: {},
    map: 'chengdu',
    pos: { x: 45, y: 21 }, // 人民公园，白果的窝
  };
}

export function hasSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s) return null;
    // v1 → v2：成都的小地图放大了一倍，坐标跟着翻倍
    if (s.v === 1) {
      if (SCALED_MAPS.includes(s.map) && s.pos) s.pos = { x: s.pos.x * 2, y: s.pos.y * 2 + 1 };
      s.v = 2;
    }
    return s.v === 2 ? s : null;
  } catch { return null; }
}

export function saveState(state) {
  const { status, defending, ...player } = state.player;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, player }));
    return true;
  } catch { return false; }
}

export function addItem(state, id, n = 1) {
  state.items[id] = (state.items[id] || 0) + n;
  if (state.items[id] <= 0) delete state.items[id];
}
