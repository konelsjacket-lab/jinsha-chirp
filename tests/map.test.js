import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGEND, isSolid, tileIndexAt, TALL_GRASS, mapW } from '../src/data/map.js';
import { MAPS } from '../src/data/maps/index.js';

// 会随剧情消失的 NPC（有 when）不算障碍；其余 NPC 站的格子走不过去
function reachable(m) {
  const block = new Set(m.npcs.filter(n => !n.when).map(n => `${n.x},${n.y}`));
  const seen = new Set([`${m.start.x},${m.start.y}`]);
  const q = [[m.start.x, m.start.y]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (seen.has(k) || isSolid(m, x + dx, y + dy) || block.has(k)) continue;
      seen.add(k);
      q.push([x + dx, y + dy]);
    }
  }
  return seen;
}

for (const m of Object.values(MAPS)) {
  test(`${m.name}：每行等长、字符都在图例里`, () => {
    for (const [y, row] of m.rows.entries()) {
      assert.equal(row.length, mapW(m), `第 ${y} 行长度不对`);
      for (const ch of row) assert.ok(ch in LEGEND, `第 ${y} 行有未知字符 ${ch}`);
    }
  });

  test(`${m.name}：起点可以走`, () => {
    assert.ok(!isSolid(m, m.start.x, m.start.y));
  });

  test(`${m.name}：每个 NPC 旁边都有一格能从起点走到`, () => {
    const seen = reachable(m);
    for (const n of m.npcs) {
      const ok = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${n.x + dx},${n.y + dy}`));
      assert.ok(ok, `${n.name} (${n.x},${n.y}) 走不到`);
    }
  });

  test(`${m.name}：每个奇遇区域里至少有一格能走到`, () => {
    const seen = reachable(m);
    for (const t of m.triggers) {
      let ok = false;
      for (let y = t.y0; y <= t.y1 && !ok; y++)
        for (let x = t.x0; x <= t.x1 && !ok; x++) ok = seen.has(`${x},${y}`);
      assert.ok(ok, `奇遇 ${t.id} 走不到`);
    }
  });

  test(`${m.name}：每个遇怪区域里都有能走到的高草丛`, () => {
    const seen = reachable(m);
    for (const z of m.zones) {
      let found = false;
      for (let y = z.y0; y <= z.y1 && !found; y++)
        for (let x = z.x0; x <= z.x1 && !found; x++)
          if (tileIndexAt(m, x, y) === TALL_GRASS && seen.has(`${x},${y}`)) found = true;
      assert.ok(found, `区域 ${z.id} 没有可达的高草丛`);
    }
  });
}
