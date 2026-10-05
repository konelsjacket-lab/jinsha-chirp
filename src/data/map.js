// 地图通用的东西：图例、图块序号、碰撞。每张地图本身在 ./maps/ 里。
//
// 图例：
//   .  草地        ,  高草丛（会遇怪）   =  路        ~  水（锦江/湖）
//   H  桥          #  川西青瓦屋顶       T  树        Y  银杏
//   S  石板地      J  金沙金砖地         f  芙蓉花丛  M  山石
//   b  竹林

// 字符 -> 图块序号（对应 tile_01..tile_13）
export const LEGEND = {
  '.': 0, ',': 1, '=': 2, '~': 3, 'H': 4, '#': 5, 'T': 6,
  'Y': 7, 'S': 8, 'J': 9, 'f': 10, 'M': 11, 'b': 12,
};
export const TILE_COUNT = 13;
export const TALL_GRASS = 1;
export const SOLID = [3, 5, 6, 7, 11, 12];
// 树、银杏是“一格一个”的物件；其他地形是能无缝平铺的大图
export const SINGLE_TILES = [6, 7];

// 每种地形在图块集里占 4×4 格（一张 128×128 的大图），相邻格子取大图的不同部分，
// 这样地面不会一格一格地重复。图块集一共 13×4 列、4 行。
export const VARIANT = 4;

export function variantIndex(t, x, y) {
  return (y % VARIANT) * TILE_COUNT * VARIANT + t * VARIANT + (x % VARIANT);
}

export function solidIndices() {
  const out = [];
  for (const t of SOLID)
    for (let sy = 0; sy < VARIANT; sy++)
      for (let sx = 0; sx < VARIANT; sx++) out.push(variantIndex(t, sx, sy));
  return out;
}

export const mapW = m => m.rows[0].length;
export const mapH = m => m.rows.length;

export function tileIndexAt(m, x, y) {
  if (y < 0 || y >= mapH(m) || x < 0 || x >= mapW(m)) return -1;
  return LEGEND[m.rows[y][x]];
}

export function isSolid(m, x, y) {
  const i = tileIndexAt(m, x, y);
  return i === -1 || SOLID.includes(i);
}

export function indexGrid(m) {
  return m.rows.map((row, y) => [...row].map((ch, x) => variantIndex(LEGEND[ch], x, y)));
}

export function placeAt(m, x, y) {
  const p = m.places.find(p => x >= p.x0 && x <= p.x1 && y >= p.y0 && y <= p.y1);
  return p ? p.name : m.name;
}
