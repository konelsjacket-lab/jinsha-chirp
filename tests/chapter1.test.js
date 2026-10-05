// 第一章主线走一遍：不开浏览器，按剧情顺序直接执行每个 NPC / 奇遇的脚本，
// 检查主线标记一步步立起来、任务目标跟着变、最后能走到青城山。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAPS } from '../src/data/maps/index.js';
import { objective } from '../src/data/story.js';
import { newState } from '../src/state.js';

const RIGHT = new Set(['盖是天，碗是人，托是地', '少城，也叫满城', '四只']);

function cond(s, c) {
  if (typeof c === 'function') return !!c(s);
  return c.startsWith('!') ? !s.flags[c.slice(1)] : !!s.flags[c];
}

// 简化版的 World.exec：战斗一律打赢，选项优先选正确答案，否则选第一个能选的
function run(s, steps, log) {
  for (const st of steps) {
    if (st.flag) s.flags[st.flag] = true;
    if (st.unflag) delete s.flags[st.unflag];
    if (st.inc) s.flags[st.inc] = (s.flags[st.inc] || 0) + (st.n || 1);
    if (st.give) s.items[st.give] = (s.items[st.give] || 0) + (st.n || 1);
    if (st.take) {
      s.items[st.take] = (s.items[st.take] || 0) - (st.n || 1);
      assert.ok(s.items[st.take] >= 0, `交出了没有的道具 ${st.take}`);
      if (!s.items[st.take]) delete s.items[st.take];
    }
    if (st.codex) s.codex.add(st.codex);
    if (st.learn) s.player.skills.push(st.learn);
    if (st.battle) { log.push(`battle:${st.battle}`); if (run(s, st.win || [], log) === 'warp') return 'warp'; }
    if ('if' in st && st.if !== undefined) { if (run(s, cond(s, st.if) ? st.then || [] : st.else || [], log) === 'warp') return 'warp'; }
    if (st.choice) {
      const opts = st.options.filter(o => !o.when || o.when(s));
      const o = opts.find(x => RIGHT.has(x.label)) || opts[0];
      if (run(s, o.then || [], log) === 'warp') return 'warp';
    }
    if (st.warp) { s.map = st.warp.map; s.pos = { x: st.warp.x, y: st.warp.y }; run(s, st.then || [], log); return 'warp'; }
  }
  return null;
}

const npc = (s, id) => {
  const n = MAPS[s.map].npcs.find(x => x.id === id);
  assert.ok(n, `${s.map} 上没有 ${id}`);
  assert.ok(!n.when || n.when(s), `${s.map} 的 ${id} 现在不在场`);
  return n;
};
const talk = (s, id, log = []) => { run(s, npc(s, id).script(s), log); return log; };
const step = (s, id) => {
  const t = MAPS[s.map].triggers.find(x => x.id === id);
  assert.ok(t, `${s.map} 上没有奇遇 ${id}`);
  assert.ok(!t.when || t.when(s), `${s.map} 的奇遇 ${id} 现在不会触发`);
  run(s, t.script(s), []);
};
const go = (s, map) => {
  assert.ok(MAPS[map], map);
  s.map = map;
  const log = [];
  if (MAPS[map].onEnter) run(s, MAPS[map].onEnter(s), log);
  return log;
};

test('第一章主线能从头走到青城山', () => {
  const s = { ...newState(), map: 'park', codex: new Set() };
  s.flags = { p_wake: true, intro_done: true, zaozao_party: true, maoda_p: true, maoda_beaten: true };
  s.items = { tangyou: 2, yinxing_ye: 1 };
  const goals = [objective(s)];
  const mark = () => { const o = objective(s); assert.ok(o); goals.push(o); };

  // 少城：迷路，问戴胜
  go(s, 'shaocheng'); mark();
  step(s, 'c1_lost'); talk(s, 'hoopoe');
  assert.ok(s.flags.c1_hoopoe);
  // 金沙：太阳神鸟，噪噪回家
  go(s, 'jinsha_out'); step(s, 'c1_jinsha');
  go(s, 'jinsha_altar'); mark(); talk(s, 'sunbird');
  assert.ok(s.flags.met_sunbird && !s.flags.zaozao_party);
  assert.ok(s.player.skills.includes('shine'));
  // 公园：妈妈在西门口
  go(s, 'park'); talk(s, 'mama_gate'); talk(s, 'zaozao');
  // 合江亭：石犀叫不醒
  go(s, 'hejiang'); mark(); talk(s, 'rhino'); talk(s, 'kingfisher');
  assert.ok(s.flags.c1_quest); mark();
  // 草堂：捡茅草，修屋顶
  go(s, 'caotang'); step(s, 'c1_caotang'); mark();
  step(s, 'maocao1'); step(s, 'maocao2'); step(s, 'maocao3');
  talk(s, 'cuckoo');
  assert.ok(s.items.juanyu && !s.items.maocao && s.flags.c1_roof); mark();
  // 武侯祠：三问
  go(s, 'wuhou'); talk(s, 'owl');
  assert.ok(s.items.jinnang); mark();
  // 望江楼：竹婆婆，写信
  go(s, 'langqiao'); step(s, 'c1_bridge'); talk(s, 'zhupopo');
  assert.ok(s.items.xuetao_jian && s.flags.letter_1);
  // 回合江亭：麻老大救人，叫醒石犀，打一架
  const enter = go(s, 'hejiang');
  assert.deepEqual(enter, ['battle:monkey_gang']);
  assert.ok(s.flags.maoda_rescue); mark();
  const fight = talk(s, 'rhino');
  assert.deepEqual(fight, ['battle:rhino']);
  assert.ok(s.flags.c1_woke && s.flags.rhino_beaten && !s.items.xuetao_jian && s.items.jinnang); mark();
  // 青城山门：还没道别，进不去
  go(s, 'qc_road'); talk(s, 'gate');
  assert.ok(!s.flags.ch1_end);
  // 回家：龟大爷、喜鹊大妈、妈妈
  go(s, 'park'); talk(s, 'turtle'); talk(s, 'magpie'); talk(s, 'mama'); talk(s, 'maoda');
  assert.ok(s.flags.c1_turtle && s.flags.c1_magpie && s.flags.c1_farewell); mark();
  // 青城山门：噪噪追上来，第一章完
  go(s, 'qc_road'); talk(s, 'gate');
  assert.ok(s.flags.ch1_end && s.flags.zaozao_party);
  assert.equal(s.map, 'qingcheng');

  // 任务目标一路都在变，没有原地打转
  for (let i = 1; i < goals.length; i++) assert.notEqual(goals[i], goals[i - 1], `目标没变：${goals[i]}`);
  // 主线上解锁的见闻录
  for (const id of ['shaocheng', 'xiangya', 'taiyang', 'liangjiang', 'jinguan', 'dufu', 'chunye', 'wangdi',
    'wuhou', 'chushi', 'langqiao', 'xuetao', 'libing', 'shixi', 'guicheng', 'qixi', 'qingcheng']) {
    assert.ok(s.codex.has(id), `主线没解锁见闻录 ${id}`);
  }
});

test('芙蓉花精三处找齐给见闻录', () => {
  const s = { ...newState(), codex: new Set(), flags: { intro_done: true }, items: {} };
  for (const [map, id] of [['shaocheng', 'furong_a'], ['langqiao', 'furong_b'], ['wuhou', 'furong_c']]) {
    s.map = map; talk(s, id);
  }
  assert.ok(s.flags.furong_done && s.codex.has('furong') && s.items.furong === 2);
});

test('诸葛先生的考题答错也能过关', () => {
  const owl = MAPS.wuhou.npcs.find(n => n.id === 'owl');
  const s = { ...newState(), map: 'wuhou', codex: new Set(), flags: { intro_done: true }, items: {} };
  // 一直选错：每题最多再答两回，然后诸葛先生直接告诉你
  const wrongRun = steps => {
    for (const st of steps) {
      if (st.flag) s.flags[st.flag] = true;
      if (st.give) s.items[st.give] = 1;
      if (st.choice) wrongRun(st.options.find(o => !RIGHT.has(o.label)).then);
    }
  };
  wrongRun(owl.script(s));
  assert.ok(s.flags.got_jinnang && s.items.jinnang);
});
