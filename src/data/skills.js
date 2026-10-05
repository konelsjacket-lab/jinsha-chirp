// 白果的技能。type: damage 伤害 / heal 回血 / debuff 削弱对手
export const SKILLS = {
  peck: {
    name: '啄一口', type: 'damage', power: 1.0, mp: 0,
    desc: '朴实无华的啄。',
  },
  sing: {
    name: '巧克力之歌', type: 'heal', ratio: 0.35, mp: 3,
    desc: '白头鹎的招牌叫声“巧克力～巧克力～”，回复体力。',
  },
  gust: {
    name: '振翅风', type: 'damage', power: 1.5, mp: 4,
    desc: '使劲扑腾翅膀，刮起一阵小旋风。',
  },
  shine: {
    name: '神光', type: 'damage', power: 2.4, mp: 8,
    desc: '头顶白羽里藏着的金沙之光。',
  },
  dive: {
    name: '俯冲', type: 'damage', power: 1.8, mp: 5,
    desc: '跟鱼郎学的，从高处一头扎下去。',
  },
  ginkgo: {
    name: '银杏护体', type: 'buff', stat: 'def', mult: 1.7, turns: 3, mp: 4,
    text: '金黄的银杏叶绕着白果打转，防御大幅提升！',
    desc: '银杏爷爷教的。三回合内防御大幅提升。',
  },
  shine2: {
    name: '双神光', type: 'damage', power: 3.2, mp: 11,
    desc: '阿曦回来以后，头上的光亮了一倍。',
  },
};

// 升到某级时自动学会的技能
export const LEARN_AT = { 3: 'gust' };
