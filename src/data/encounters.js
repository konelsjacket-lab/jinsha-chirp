// 高草丛遇怪表：按区域划分，先匹配到的优先。lv: [最低, 最高]
export const ZONES = [
  { id: 'park', bg: 'bg_park', x0: 28, y0: 18, x1: 53, y1: 32, lv: [1, 2],
    table: [['sparrow', 3], ['mosquito', 2]] },
  { id: 'north', bg: 'bg_north', x0: 28, y0: 0, x1: 53, y1: 15, lv: [2, 3],
    table: [['sparrow', 2], ['mahjong', 2]] },
  { id: 'west', bg: 'bg_west', x0: 0, y0: 0, x1: 27, y1: 32, lv: [2, 3],
    table: [['sparrow', 2], ['mosquito', 2], ['mahjong', 1]] },
  { id: 'east', bg: 'bg_east', x0: 57, y0: 0, x1: 71, y1: 47, lv: [3, 4],
    table: [['bamboorat', 3], ['chili', 2]] },
  { id: 'south', bg: 'bg_south', x0: 0, y0: 33, x1: 56, y1: 47, lv: [3, 5],
    table: [['chili', 2], ['watermonkey', 2], ['mahjong', 1]] },
];

export function zoneAt(x, y) {
  return ZONES.find(z => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) || ZONES[0];
}

export function rollEncounter(zone, rng = Math.random) {
  const total = zone.table.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  let id = zone.table[0][0];
  for (const [eid, w] of zone.table) {
    if ((r -= w) < 0) { id = eid; break; }
  }
  const [lo, hi] = zone.lv;
  const lv = lo + Math.floor(rng() * (hi - lo + 1));
  return { enemy: id, lv, bg: zone.bg };
}
