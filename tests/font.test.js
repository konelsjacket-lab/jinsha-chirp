import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// 像素字体是按游戏里用到的字裁出来的。新台词里有新字的话，要重新运行 tools/subset_font.py
function files(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.js') ? [p] : [];
  });
}

test('像素字体里包含游戏用到的所有字', () => {
  const have = new Set(readFileSync('assets/fonts/charset.txt', 'utf8'));
  const missing = new Set();
  for (const f of [...files('src'), 'index.html']) {
    for (const ch of readFileSync(f, 'utf8')) {
      if (ch.charCodeAt(0) > 0x2000 && !have.has(ch)) missing.add(ch);
    }
  }
  assert.equal(missing.size, 0, `字体缺字：${[...missing].join('')}，请运行 python3 tools/subset_font.py`);
});
