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
  // ---- 第一章支线 ----
  maoda_p: {
    name: '麻老大', lv: 1, hp: 26, atk: 6, def: 2, spd: 6, exp: 10,
    sprite: 'enemy_sparrow', tint: 0xd8a070, scale: 1.25,
    intro: '麻老大把胸脯一挺：“小老头，今天让你晓得哪个是老大！”',
    moves: [
      { name: '猛啄', type: 'damage', power: 1.0, weight: 3 },
      { name: '“小老头！”', type: 'debuff', stat: 'atk', mult: 0.8, turns: 2, weight: 1,
        text: '白果被喊得心头冒火，反而发挥失常，攻击下降了！' },
    ],
  },
  maoda: {
    name: '麻老大', lv: 3, hp: 58, atk: 11, def: 5, spd: 9, exp: 20,
    sprite: 'enemy_sparrow', tint: 0xd8a070, scale: 1.25,
    intro: '麻老大把胸脯一挺：“小老头，今天让你晓得哪个是老大！”',
    moves: [
      { name: '猛啄', type: 'damage', power: 1.1, weight: 3 },
      { name: '“小老头！”', type: 'debuff', stat: 'atk', mult: 0.75, turns: 2, weight: 1,
        text: '白果被喊得心头冒火，反而发挥失常，攻击下降了！' },
      { name: '喊小弟', type: 'debuff', stat: 'def', mult: 0.75, turns: 2, weight: 1,
        text: '一群麻雀围上来叽叽喳喳，白果的防御下降了！' },
    ],
  },
  hongzhong: {
    name: '红中', lv: 4, hp: 72, atk: 12, def: 7, spd: 6, exp: 24,
    sprite: 'enemy_mahjong', scale: 1.15,
    intro: '“我不回去！龟老头天天杠上开花，我都被他摸秃噜皮了！”',
    moves: [
      { name: '碰！', type: 'damage', power: 1.0, weight: 3 },
      { name: '杠上开花', type: 'damage', power: 1.8, weight: 1 },
      { name: '自摸', type: 'heal', ratio: 0.2, weight: 1 },
    ],
  },
  monkey_gang: {
    name: '水猴子群', lv: 4, hp: 64, atk: 11, def: 4, spd: 9, exp: 22,
    sprite: 'enemy_watermonkey', scale: 1.1,
    intro: '江里一下子冒出来好几只水猴子，七手八脚地扑了上来！',
    moves: [
      { name: '泼水', type: 'damage', power: 1.0, weight: 3 },
      { name: '拖下水', type: 'damage', power: 1.4, weight: 2 },
    ],
  },
  monkey_boss: {
    name: '水猴子头头', lv: 5, hp: 95, atk: 14, def: 7, spd: 9, exp: 32,
    sprite: 'enemy_watermonkey', tint: 0x9fc9b8, scale: 1.2,
    intro: '“鱼竿？啥子鱼竿？……好嘛是我拿的，有本事来抢！”',
    moves: [
      { name: '泼水', type: 'damage', power: 1.0, weight: 3 },
      { name: '拖下水', type: 'damage', power: 1.5, weight: 2 },
      { name: '水里打滚', type: 'debuff', stat: 'spd', mult: 0.6, turns: 2, weight: 1,
        text: '白果的羽毛被溅湿了，速度下降了！' },
    ],
  },

  // ---- 第二章：青城山 ----
  zhuyeqing: {
    name: '竹叶青', lv: 5, hp: 34, atk: 13, def: 5, spd: 11, exp: 15,
    sprite: 'enemy_snake', drop: ['xueya', 0.1],
    intro: '竹叶里窜出一条碧绿的竹叶青！',
    moves: [
      { name: '咬', type: 'damage', power: 1.1, weight: 3 },
      { name: '毒牙', type: 'damage', power: 1.4, weight: 1 },
      { name: '盘起来', type: 'buff', stat: 'def', mult: 1.5, turns: 2, weight: 1, text: '竹叶青盘成一团，防御提升了！' },
    ],
  },
  mahuang: {
    name: '山蚂蟥', lv: 5, hp: 42, atk: 10, def: 7, spd: 4, exp: 15,
    sprite: 'enemy_leech',
    intro: '一条山蚂蟥扭着身子爬了过来……爬山的人都怕它。',
    moves: [
      { name: '吸', type: 'damage', power: 1.0, weight: 3 },
      { name: '吸饱了', type: 'heal', ratio: 0.25, weight: 1 },
    ],
  },
  wujing: {
    name: '雾精', lv: 6, hp: 38, atk: 12, def: 4, spd: 10, exp: 17,
    sprite: 'enemy_mist',
    intro: '一团雾长出了眼睛，慢慢飘了过来。',
    moves: [
      { name: '雾刃', type: 'damage', power: 1.3, weight: 3 },
      { name: '迷雾', type: 'debuff', stat: 'atk', mult: 0.7, turns: 2, weight: 1, text: '四周白茫茫一片，白果看不清方向，攻击下降了！' },
    ],
  },
  larou_jing: {
    name: '腊肉精', lv: 6, hp: 52, atk: 12, def: 8, spd: 3, exp: 20,
    sprite: 'enemy_larou', drop: ['larou', 0.35],
    intro: '一块挂了三年的老腊肉成精了，烟熏味冲得白果直流眼泪！',
    moves: [
      { name: '油滴', type: 'damage', power: 1.2, weight: 3 },
      { name: '烟熏', type: 'debuff', stat: 'spd', mult: 0.6, turns: 2, weight: 1, text: '白果被熏得睁不开眼，速度下降了！' },
    ],
  },
  xiaoqing: {
    name: '小青', lv: 8, hp: 200, atk: 19, def: 11, spd: 12, exp: 90,
    sprite: 'enemy_xiaoqing', boss: true,
    intro: '小青甩开辫子，蛇尾在石阶上一扫：“想见我姐姐？先过我这关！”',
    moves: [
      { name: '青蛇缠', type: 'damage', power: 1.0, weight: 3 },
      { name: '蛇尾扫', type: 'damage', power: 1.5, weight: 2 },
      { name: '吐信', type: 'debuff', stat: 'def', mult: 0.7, turns: 2, weight: 1, text: '小青嘶嘶吐信，白果吓得羽毛都炸了，防御下降了！' },
      { name: '蜕皮', type: 'heal', ratio: 0.15, weight: 1 },
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
