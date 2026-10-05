// 回合制战斗的纯逻辑（不依赖 Phaser，可以直接用 node 测试）
import { SKILLS, LEARN_AT } from '../data/skills.js';
import { ITEMS } from '../data/items.js';

const STAT_NAMES = { atk: '攻击', def: '防御', spd: '速度' };

export function stat(unit, key) {
  const s = unit.status && unit.status[key];
  return s ? Math.max(1, Math.round(unit[key] * s.mult)) : unit[key];
}

export function makeEnemy(base, lv = base.lv) {
  const k = 1 + 0.12 * (lv - base.lv);
  const sc = v => Math.max(1, Math.round(v * k));
  const hp = sc(base.hp);
  return {
    ...base, lv, hp, maxHp: hp,
    atk: sc(base.atk), def: sc(base.def), spd: sc(base.spd),
    exp: Math.max(1, Math.round(base.exp * (1 + 0.3 * (lv - base.lv)))),
    status: {}, defending: false,
  };
}

export function calcDamage(att, def, power, rng = Math.random) {
  const base = stat(att, 'atk') * power - stat(def, 'def') * 0.5;
  let dmg = Math.max(1, Math.round(base * (0.9 + rng() * 0.2)));
  const crit = rng() < 0.08;
  if (crit) dmg = Math.round(dmg * 1.5);
  if (def.defending) dmg = Math.max(1, Math.ceil(dmg / 2));
  return { dmg, crit };
}

// 执行一个招式（技能或怪物招式），直接修改双方数值，返回结果供画面播放
export function performMove(user, target, move, rng = Math.random) {
  const lines = [`${user.name}使出了「${move.name}」！`];
  const res = { lines, type: move.type, amount: 0, crit: false };
  if (move.mp) user.mp -= move.mp;

  if (move.type === 'damage') {
    const { dmg, crit } = calcDamage(user, target, move.power, rng);
    target.hp = Math.max(0, target.hp - dmg);
    if (crit) lines.push('会心一击！');
    lines.push(`${target.name}受到了 ${dmg} 点伤害。`);
    Object.assign(res, { amount: dmg, crit });
  } else if (move.type === 'heal') {
    const amt = Math.min(user.maxHp - user.hp, Math.round(user.maxHp * move.ratio));
    user.hp += amt;
    lines.push(`${user.name}回复了 ${amt} 点体力。`);
    res.amount = amt;
  } else if (move.type === 'buff') {
    user.status = user.status || {};
    user.status[move.stat] = { mult: move.mult, turns: move.turns };
    lines.push(move.text || `${user.name}的${STAT_NAMES[move.stat]}提升了！`);
  } else if (move.type === 'debuff') {
    target.status = target.status || {};
    target.status[move.stat] = { mult: move.mult, turns: move.turns };
    lines.push(move.text || `${target.name}的${STAT_NAMES[move.stat]}下降了！`);
  }
  return res;
}

export function useItem(state, user, target, id) {
  const item = ITEMS[id];
  const lines = [`${user.name}用了「${item.name}」！`];
  const res = { lines, type: item.use, amount: 0 };
  if (item.use === 'heal') {
    const amt = Math.min(user.maxHp - user.hp, item.amount);
    user.hp += amt;
    lines.push(`回复了 ${amt} 点体力。`);
    res.amount = amt;
  } else if (item.use === 'mp') {
    const amt = Math.min(user.maxMp - user.mp, item.amount);
    user.mp += amt;
    lines.push(`回复了 ${amt} 点气。`);
    res.amount = amt;
  } else if (item.use === 'throw') {
    lines[0] = `${user.name}把「${item.name}」扔了出去！`;
    const dmg = target.defending ? Math.ceil(item.amount / 2) : item.amount;
    target.hp = Math.max(0, target.hp - dmg);
    lines.push(`辣油溅了${target.name}一脸！造成 ${dmg} 点伤害。`);
    res.amount = dmg;
  }
  state.items[id] -= 1;
  if (state.items[id] <= 0) delete state.items[id];
  return res;
}

export function chooseEnemyMove(enemy, rng = Math.random) {
  // 满血时不会去回血
  const moves = enemy.moves.filter(m => !(m.type === 'heal' && enemy.hp >= enemy.maxHp));
  const total = moves.reduce((s, m) => s + m.weight, 0);
  let r = rng() * total;
  for (const m of moves) if ((r -= m.weight) < 0) return m;
  return moves[0];
}

export function playerFirst(player, enemy, rng = Math.random) {
  const ps = stat(player, 'spd') + rng() * 3;
  const es = stat(enemy, 'spd') + rng() * 3;
  return ps >= es;
}

export function fleeChance(player, enemy) {
  const c = 0.5 + (stat(player, 'spd') - stat(enemy, 'spd')) * 0.05;
  return Math.min(0.95, Math.max(0.2, c));
}

// 回合结束：削弱效果倒计时
export function tickStatus(unit) {
  const lines = [];
  for (const [k, s] of Object.entries(unit.status || {})) {
    if (--s.turns <= 0) {
      delete unit.status[k];
      lines.push(`${unit.name}的${STAT_NAMES[k]}恢复正常了。`);
    }
  }
  return lines;
}

export function expToNext(lv) {
  return 2 * lv * lv + 4 * lv + 4;
}

export function gainExp(player, exp) {
  const lines = [`${player.name}获得了 ${exp} 点经验。`];
  player.exp += exp;
  let leveled = false;
  while (player.exp >= expToNext(player.lv)) {
    player.exp -= expToNext(player.lv);
    player.lv += 1;
    player.maxHp += 8; player.maxMp += 3;
    player.atk += 2; player.def += 1; player.spd += 1;
    player.hp = player.maxHp; player.mp = player.maxMp;
    leveled = true;
    lines.push(`${player.name}升到了 Lv.${player.lv}！体力和气全满了！`);
    const learn = LEARN_AT[player.lv];
    if (learn && !player.skills.includes(learn)) {
      player.skills.push(learn);
      lines.push(`${player.name}学会了「${SKILLS[learn].name}」！`);
    }
  }
  return { lines, leveled };
}

// 同行的噪噪在战斗里帮腔：每回合有一定概率出手
export function companionAssist(player, enemy, rng = Math.random) {
  if (rng() > 0.4) return null;
  const r = rng();
  if (r < 0.35 && player.hp < player.maxHp) {
    const amt = Math.min(player.maxHp - player.hp, Math.max(3, Math.round(player.maxHp * 0.1)));
    player.hp += amt;
    return { type: 'heal', amount: amt, lines: ['噪噪：“白老头，雄起！”', `${player.name}回复了 ${amt} 点体力。`] };
  }
  if (r < 0.7) {
    enemy.status = enemy.status || {};
    enemy.status.def = { mult: 0.75, turns: 2 };
    return { type: 'debuff', amount: 0, lines: ['噪噪在旁边叭叭叭叭说个不停……', `${enemy.name}被吵得心烦意乱，防御下降了！`] };
  }
  const dmg = Math.max(2, Math.round(enemy.maxHp * 0.06));
  enemy.hp = Math.max(0, enemy.hp - dmg);
  return { type: 'damage', amount: dmg, lines: ['噪噪冲上去啄了一口！', `${enemy.name}受到了 ${dmg} 点伤害。`] };
}
