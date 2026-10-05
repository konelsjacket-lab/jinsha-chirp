// 剧情数据完整性：把每个 NPC / 奇遇在各种剧情进度下的脚本都展开一遍，
// 检查里面引用的道具、技能、怪物、地图、说话人都真实存在。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAPS } from '../src/data/maps/index.js';
import { ITEMS } from '../src/data/items.js';
import { SKILLS } from '../src/data/skills.js';
import { ENEMIES } from '../src/data/enemies.js';
import { CHARACTERS } from '../src/data/characters.js';
import { INTRO, EPILOGUE_CH2, lose, objective } from '../src/data/story.js';
import { QUESTS } from '../src/data/quests.js';
import { CODEX_BY_ID } from '../src/data/codex.js';
import { isSolid } from '../src/data/map.js';
import { newState } from '../src/state.js';

const STAGES = [
  {},
  { p_wake: 1, zaozao_party: 1 },
  { p_wake: 1, zaozao_party: 1, p_tea: 1, p_magpie: 1, p_monument: 1, maoda_p: 1 },
  { intro_done: 1 },
  { intro_done: 1, met_sunbird: 1, mj_quest: 1, fish_quest: 1, maoda_met: 1 },
  { intro_done: 1, met_sunbird: 1, rhino_beaten: 1, mj_got: 1, ad_posted: 1, hoopoe_gift: 1, got_jinnang: 1 },
  { intro_done: 1, met_sunbird: 1, rhino_beaten: 1, ch1_end: 1, zaozao_party: 1, ch2_start: 1, met_ginkgo: 1 },
  { intro_done: 1, met_sunbird: 1, rhino_beaten: 1, ch1_end: 1, zaozao_party: 1, met_crane: 1, xiaoqing_beaten: 1, axi_found: 1 },
  { intro_done: 1, met_sunbird: 1, rhino_beaten: 1, ch1_end: 1, zaozao_party: 1, axi_found: 1, ch2_end: 1, ad_posted: 1, maoda_beaten: 1, mj_done: 1 },
];
const ITEM_SETS = [{}, { jinbo: 2, hongzhong: 1, yugan: 1, jinnang: 1 }];

function walk(steps, visit, where) {
  for (const st of steps) {
    visit(st, where);
    for (const k of ['then', 'else', 'win', 'lose', 'flee']) if (Array.isArray(st[k])) walk(st[k], visit, where);
    if (st.options) for (const o of st.options) walk(o.then || [], visit, where);
  }
}

function check(st, where) {
  const ctx = `${where}: ${JSON.stringify(st).slice(0, 80)}`;
  if ('say' in st && st.say) {
    const who = st.say.split(':')[0];
    assert.ok(CHARACTERS[who], `没登记的说话人「${who}」 ${ctx}`);
  }
  if (st.give) assert.ok(ITEMS[st.give], `没有这个道具 ${ctx}`);
  if (st.take) assert.ok(ITEMS[st.take], `没有这个道具 ${ctx}`);
  if (st.learn) assert.ok(SKILLS[st.learn], `没有这个技能 ${ctx}`);
  if (st.codex) assert.ok(CODEX_BY_ID[st.codex], `没有这页见闻录 ${ctx}`);
  if (st.battle) assert.ok(ENEMIES[st.battle], `没有这个怪 ${ctx}`);
  if (st.warp) {
    const m = MAPS[st.warp.map];
    assert.ok(m, `没有这张地图 ${ctx}`);
    assert.ok(!isSolid(m, st.warp.x, st.warp.y), `传送落点是墙 ${ctx}`);
  }
  if (st.choice) assert.ok(st.options && st.options.length >= 2, `选项太少 ${ctx}`);
}

test('开场、尾声、战败剧情的引用都存在', () => {
  walk(INTRO, check, 'INTRO');
  walk(EPILOGUE_CH2, check, 'EPILOGUE_CH2');
  for (const map of Object.keys(MAPS)) walk(lose({ ...newState(), map }), check, `lose@${map}`);
});

test('所有 NPC 和奇遇在每个剧情阶段展开都没问题', () => {
  for (const m of Object.values(MAPS)) {
    for (const flags of STAGES) for (const items of ITEM_SETS) {
      const s = { ...newState(), map: m.id, flags: { ...flags }, items: { ...items } };
      for (const n of m.npcs) {
        assert.ok(n.sprite, `${n.name} 没有贴图`);
        walk(n.script(s), check, `${m.id}/${n.id}`);
      }
      for (const t of m.triggers) walk(t.script(s), check, `${m.id}/trigger:${t.id}`);
      for (const p of m.props || []) if (p.script) walk(p.script(s), check, `${m.id}/prop:${p.key}`);
      if (m.onEnter) walk(m.onEnter(s), check, `${m.id}/onEnter`);
      assert.equal(typeof objective(s), 'string');
      for (const q of QUESTS) { const st = q.status(s); if (st === 'active') assert.ok(q.hint(s)); }
    }
  }
});

test('遇怪表里的怪都存在', () => {
  for (const m of Object.values(MAPS)) for (const z of m.zones) for (const [id] of z.table) assert.ok(ENEMIES[id], `${m.id}/${z.id} 里的 ${id}`);
});
