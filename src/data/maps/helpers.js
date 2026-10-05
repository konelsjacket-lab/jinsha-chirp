// 地图文件共用的小工具

// 把 npcs.js 里定义的 NPC 放到这张图的某一格
export const at = (def, x, y, extra = {}) => ({ ...def, x, y, ...extra });

// 把 npcs.js 里定义的奇遇放到这张图的某片格子
export const area = (def, x0, y0, x1, y1) => ({ ...def, x0, y0, x1, y1 });

// 成都的天色：太阳没回来之前蒙着一层灰，第二章结束后变暖
export const CHENGDU_MOOD = s => (s.flags.ch2_end ? { color: 0xffd36b, alpha: 0.07 } : { color: 0x8a96a8, alpha: 0.16 });
