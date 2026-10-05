// 怪物基础数值（在 lv 级时的数值，遇到更高/更低级会按比例缩放）
// moves: weight 是出招权重；debuff 会降低白果的某项属性若干回合
export const ENEMIES = {
  sparrow: {
    name: '抢食麻雀', lv: 1, hp: 18, atk: 6, def: 2, spd: 7, exp: 5,
    sprite: 'enemy_sparrow',
    intro: '一只麻雀盯上了你嘴边的面包屑！',
    moves: [
      { name: '猛啄', type: 'damage', power: 1.0, weight: 3 },
      { name: '叽叽喳喳', type: 'debuff', stat: 'def', mult: 0.7, turns: 2, weight: 1,
        text: '吵得白果脑壳嗡嗡响，防御下降了！' },
    ],
  },
  mosquito: {
    name: '花脚蚊子', lv: 1, hp: 13, atk: 7, def: 1, spd: 11, exp: 5,
    sprite: 'enemy_mosquito',
    intro: '嗡——成都的花脚蚊子飞过来了！',
    moves: [
      { name: '叮一口', type: 'damage', power: 1.1, weight: 3 },
      { name: '嗡嗡魔音', type: 'debuff', stat: 'atk', mult: 0.75, turns: 2, weight: 1,
        text: '白果被吵得心烦意乱，攻击下降了！' },
    ],
  },
  mahjong: {
    name: '麻将精', lv: 3, hp: 30, atk: 9, def: 5, spd: 5, exp: 9,
    sprite: 'enemy_mahjong',
    intro: '一张红中从茶馆桌上蹦了下来，要拉你凑一桌！',
    moves: [
      { name: '碰！', type: 'damage', power: 1.0, weight: 3 },
      { name: '杠上开花', type: 'damage', power: 1.7, weight: 1 },
    ],
  },
  chili: {
    name: '辣椒小妖', lv: 3, hp: 26, atk: 10, def: 3, spd: 7, exp: 9,
    sprite: 'enemy_chili',
    intro: '一根二荆条成精了，红得发亮！',
    moves: [
      { name: '辣椒冲撞', type: 'damage', power: 1.2, weight: 3 },
      { name: '辣出眼泪', type: 'debuff', stat: 'atk', mult: 0.7, turns: 2, weight: 1,
        text: '白果被辣得眼泪汪汪，攻击下降了！' },
    ],
  },
  bamboorat: {
    name: '偷笋竹鼠', lv: 3, hp: 34, atk: 8, def: 6, spd: 4, exp: 10,
    sprite: 'enemy_bamboorat',
    intro: '一只圆滚滚的竹鼠抱着竹笋挡住了路！',
    moves: [
      { name: '啃', type: 'damage', power: 1.0, weight: 3 },
      { name: '啃竹笋', type: 'heal', ratio: 0.25, weight: 1 },
    ],
  },
  watermonkey: {
    name: '水猴子', lv: 4, hp: 36, atk: 11, def: 4, spd: 9, exp: 13,
    sprite: 'enemy_watermonkey',
    intro: '锦江里冒出一只湿漉漉的水猴子！',
    moves: [
      { name: '泼水', type: 'damage', power: 1.0, weight: 2 },
      { name: '拖下水', type: 'damage', power: 1.4, weight: 2 },
    ],
  },
  rhino: {
    name: '石犀', lv: 5, hp: 120, atk: 14, def: 8, spd: 3, exp: 40,
    sprite: 'enemy_rhino', boss: true,
    intro: '石犀缓缓站了起来，地面都在震！',
    moves: [
      { name: '镇水', type: 'damage', power: 1.0, weight: 3 },
      { name: '犀角冲撞', type: 'damage', power: 1.6, weight: 2 },
      { name: '石化凝视', type: 'debuff', stat: 'spd', mult: 0.5, turns: 2, weight: 1,
        text: '白果被盯得浑身发僵，速度下降了！' },
    ],
  },
};
