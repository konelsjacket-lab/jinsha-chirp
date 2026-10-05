// use: 'heal' 回体力 / 'mp' 回气 / 'throw' 战斗中扔出去造成固定伤害
export const ITEMS = {
  tangyou: {
    name: '糖油果子', use: 'heal', amount: 40,
    desc: '外酥里糯、裹着芝麻的成都街头甜食。回复 40 体力。',
  },
  bingfen: {
    name: '冰粉', use: 'mp', amount: 12,
    desc: '红糖冰粉，透心凉。回复 12 气。',
  },
  bobo: {
    name: '钵钵鸡', use: 'throw', amount: 30, battleOnly: true,
    desc: '白果坚决不吃。可以扔出去辣敌人一脸，造成 30 点伤害。',
  },
};
