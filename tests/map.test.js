import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAP_ROWS, MAP_W, LEGEND, START, isSolid, tileIndexAt, TALL_GRASS } from '../src/data/map.js';
import { NPCS } from '../src/data/npcs.js';
import { ZONES } from '../src/data/encounters.js';

test('地图每行等长、字符都在图例里', () => {
  for (const [y, row] of MAP_ROWS.entries()) {
    assert.equal(row.length, MAP_W, `第 ${y} 行长度不对`);
    for (const ch of row) assert.ok(ch in LEGEND, `第 ${y} 行有未知字符 ${ch}`);
  }
});

function reachable() {
  const npcTiles = new Set(NPCS.map(n => `${n.x},${n.y}`));
  const seen = new Set([`${START.x},${START.y}`]);
  const q = [[START.x, START.y]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (seen.has(k) || isSolid(x + dx, y + dy) || npcTiles.has(k)) continue;
      seen.add(k);
      q.push([x + dx, y + dy]);
    }
  }
  return seen;
}

test('出生点可以走', () => {
  assert.ok(!isSolid(START.x, START.y));
});

test('每个 NPC 旁边都有一格能从出生点走到', () => {
  const seen = reachable();
  for (const n of NPCS) {
    const ok = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${n.x + dx},${n.y + dy}`));
    assert.ok(ok, `${n.name} (${n.x},${n.y}) 走不到`);
  }
});

test('每个遇怪区域里都有能走到的高草丛', () => {
  const seen = reachable();
  for (const z of ZONES) {
    let found = false;
    for (let y = z.y0; y <= z.y1 && !found; y++)
      for (let x = z.x0; x <= z.x1 && !found; x++)
        if (tileIndexAt(x, y) === TALL_GRASS && seen.has(`${x},${y}`)) found = true;
    assert.ok(found, `区域 ${z.id} 没有可达的高草丛`);
  }
});
