import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEGEND, isSolid, tileIndexAt, TALL_GRASS, mapW } from '../src/data/map.js';
import { MAPS } from '../src/data/maps/index.js';

// 会随剧情消失的 NPC（有 when）不算障碍；其余 NPC 站的格子走不过去
function propTiles(m) {
  const out = new Set();
  for (const p of m.props || []) if (p.solid)
    for (let y = p.y; y < p.y + p.h; y++) for (let x = p.x; x < p.x + p.w; x++) out.add(`${x},${y}`);
  return out;
}

function reachable(m, from = m.start) {
  const block = new Set([...m.npcs.filter(n => !n.when).map(n => `${n.x},${n.y}`), ...propTiles(m)]);
  m = { ...m, start: from };
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

const inExit = (m, x, y) => (m.exits || []).some(e => x >= e.x0 && x <= e.x1 && y >= e.y0 && y <= e.y1);

for (const m of Object.values(MAPS)) {
  test(`${m.name}：出口都走得到，落脚点能站、不在对面的出口上，而且对面有路回来`, () => {
    const seen = reachable(m);
    for (const e of m.exits || []) {
      const t = MAPS[e.to];
      assert.ok(t, `${m.id} 的出口通向不存在的地图 ${e.to}`);
      let ok = false;
      for (let y = e.y0; y <= e.y1; y++) for (let x = e.x0; x <= e.x1; x++) {
        if (seen.has(`${x},${y}`)) ok = true;
        const dx = e.tx + (x - e.x0), dy = e.ty + (y - e.y0);
        assert.ok(!isSolid(t, dx, dy) && !propTiles(t).has(`${dx},${dy}`), `${m.id}→${e.to} 落在墙里 (${dx},${dy})`);
        assert.ok(!inExit(t, dx, dy), `${m.id}→${e.to} 落在对面的出口上 (${dx},${dy})，会来回弹`);
        assert.ok(reachable(t, { x: dx, y: dy }).has(`${t.start.x},${t.start.y}`), `${m.id}→${e.to} 落脚点走不到 ${e.to} 的主区域`);
      }
      assert.ok(ok, `${m.id} 通往 ${e.to} 的出口走不到`);
      assert.ok((t.exits || []).some(b => b.to === m.id), `${e.to} 没有回 ${m.id} 的出口`);
    }
  });

  test(`${m.name}：NPC 不站在墙里或地标里`, () => {
    const props = propTiles(m);
    for (const n of m.npcs) assert.ok(!isSolid(m, n.x, n.y) && !props.has(`${n.x},${n.y}`), `${n.name} (${n.x},${n.y})`);
  });
}

test('从人民公园出发，能走到成都所有的小地图', () => {
  const seen = new Set(['park']);
  const q = ['park'];
  while (q.length) for (const e of MAPS[q.shift()].exits || []) if (!seen.has(e.to)) { seen.add(e.to); q.push(e.to); }
  for (const m of Object.values(MAPS)) if (m.region === 'chengdu') assert.ok(seen.has(m.id), `${m.name} 走不到`);
});
