import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENEMIES } from '../src/data/enemies.js';
import { SKILLS } from '../src/data/skills.js';
import { ITEMS } from '../src/data/items.js';
import { newState } from '../src/state.js';
import {
  makeEnemy, calcDamage, performMove, useItem, chooseEnemyMove, gainExp, expToNext, tickStatus, stat,
} from '../src/systems/battle.js';

const fixed = v => () => v;

test('伤害至少为 1，防御减半', () => {
  const att = { atk: 1, status: {} };
  const def = { def: 100, status: {}, defending: false };
  assert.equal(calcDamage(att, def, 1, fixed(0.5)).dmg, 1);
  const a = { atk: 20, status: {} };
  const d = { def: 4, status: {}, defending: false };
  const normal = calcDamage(a, d, 1, fixed(0.5)).dmg;
  d.defending = true;
  assert.equal(calcDamage(a, d, 1, fixed(0.5)).dmg, Math.ceil(normal / 2));
});

test('敌人按等级缩放', () => {
  const lo = makeEnemy(ENEMIES.sparrow, 1);
  const hi = makeEnemy(ENEMIES.sparrow, 4);
  assert.ok(hi.maxHp > lo.maxHp && hi.atk > lo.atk && hi.exp > lo.exp);
  assert.equal(lo.hp, ENEMIES.sparrow.hp);
});

test('技能消耗气、回血不超过上限', () => {
  const s = newState();
  const p = s.player;
  p.hp = p.maxHp - 2;
  performMove(p, makeEnemy(ENEMIES.sparrow), SKILLS.sing, fixed(0.5));
  assert.equal(p.hp, p.maxHp);
  assert.equal(p.mp, 12 - SKILLS.sing.mp);
});

test('削弱效果会生效并在回合后恢复', () => {
  const p = newState().player;
  p.status = {};
  const move = ENEMIES.mosquito.moves.find(m => m.type === 'debuff');
  performMove(makeEnemy(ENEMIES.mosquito), p, move);
  assert.ok(stat(p, 'atk') < p.atk);
  for (let i = 0; i < move.turns; i++) tickStatus(p);
  assert.equal(stat(p, 'atk'), p.atk);
});

test('道具会被消耗，钵钵鸡造成伤害', () => {
  const s = newState();
  s.items.bobo = 1;
  const e = makeEnemy(ENEMIES.rhino);
  useItem(s, s.player, e, 'bobo');
  assert.equal(e.hp, e.maxHp - ITEMS.bobo.amount);
  assert.equal(s.items.bobo, undefined);
});

test('升级加属性并在 Lv3 学会振翅风', () => {
  const p = newState().player;
  const { leveled } = gainExp(p, expToNext(1) + expToNext(2));
  assert.ok(leveled);
  assert.equal(p.lv, 3);
  assert.ok(p.skills.includes('gust'));
  assert.equal(p.hp, p.maxHp);
});

test('满血的敌人不会选回血招', () => {
  const e = makeEnemy(ENEMIES.bamboorat);
  for (let i = 0; i < 50; i++) assert.notEqual(chooseEnemyMove(e).type, 'heal');
});

test('每个怪物和技能的数据都完整', () => {
  for (const [id, e] of Object.entries(ENEMIES)) {
    assert.ok(e.name && e.hp > 0 && e.moves.length, id);
    for (const m of e.moves) assert.ok(['damage', 'heal', 'debuff', 'buff'].includes(m.type) && m.weight > 0, `${id}.${m.name}`);
  }
  for (const [id, s] of Object.entries(SKILLS)) assert.ok(s.name && s.mp >= 0, id);
});

// 平衡性：Lv4、学会神光、带着几个糖油果子的白果，打石犀应该大多能赢
test('石犀 Boss 平衡：Lv4 白果胜率在合理范围', () => {
  let wins = 0;
  const N = 400;
  for (let n = 0; n < N; n++) {
    const s = newState();
    const p = s.player;
    gainExp(p, expToNext(1) + expToNext(2) + expToNext(3));
    p.skills.push('shine');
    p.status = {};
    s.items = { tangyou: 3, bingfen: 1 };
    const e = makeEnemy(ENEMIES.rhino, 5);
    for (let turn = 0; turn < 60 && p.hp > 0 && e.hp > 0; turn++) {
      if (p.hp < p.maxHp * 0.35 && s.items.tangyou) useItem(s, p, e, 'tangyou');
      else if (p.mp < 8 && s.items.bingfen) useItem(s, p, e, 'bingfen');
      else performMove(p, e, p.mp >= 8 ? SKILLS.shine : SKILLS.peck);
      if (e.hp <= 0) break;
      performMove(e, p, chooseEnemyMove(e));
      tickStatus(p); tickStatus(e);
    }
    if (e.hp <= 0) wins++;
  }
  const rate = wins / N;
  assert.ok(rate > 0.6 && rate < 1.0001, `胜率 ${rate}`);
});

test('小青 Boss 平衡：Lv7 带几块腊肉、有噪噪帮腔，大多能赢', async () => {
  const { companionAssist } = await import('../src/systems/battle.js');
  let wins = 0;
  const N = 300;
  for (let n = 0; n < N; n++) {
    const s = newState();
    const p = s.player;
    gainExp(p, [1, 2, 3, 4, 5, 6].reduce((a, l) => a + expToNext(l), 0));
    p.skills.push('shine');
    p.status = {};
    s.items = { larou: 3, xueya: 2 };
    const e = makeEnemy(ENEMIES.xiaoqing, 8);
    for (let t = 0; t < 80 && p.hp > 0 && e.hp > 0; t++) {
      if (p.hp < p.maxHp * 0.35 && s.items.larou) useItem(s, p, e, 'larou');
      else if (p.mp < 8 && s.items.xueya) useItem(s, p, e, 'xueya');
      else performMove(p, e, p.mp >= 8 ? SKILLS.shine : SKILLS.peck);
      if (e.hp <= 0) break;
      performMove(e, p, chooseEnemyMove(e));
      if (p.hp > 0) companionAssist(p, e);
      tickStatus(p); tickStatus(e);
    }
    if (e.hp <= 0 && p.hp > 0) wins++;
  }
  assert.ok(wins / N > 0.8, `胜率 ${wins / N}`);
});
