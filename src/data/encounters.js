// 遇怪：每张地图的 zones 里写了哪片区域出什么怪（见 ./maps/*.js）

export function zoneAt(m, x, y) {
  return m.zones.find(z => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) || m.zones[0];
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
