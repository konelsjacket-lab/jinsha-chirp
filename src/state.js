import { SAVE_KEY } from './config.js';

export function newState() {
  return {
    v: 1,
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
    return s && s.v === 1 ? s : null;
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
