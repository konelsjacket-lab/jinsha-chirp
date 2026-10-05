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
  gaiwan: {
    name: '盖碗茶', use: 'heal', amount: 999,
    desc: '龟大爷亲手泡的盖碗茶。喝一口，体力全满。',
  },
  larou: {
    name: '青城老腊肉', use: 'heal', amount: 80,
    desc: '野猪老板的招牌，烟熏了一整个冬天。回复 80 体力。',
  },
  furong: {
    name: '芙蓉花露', use: 'heal', amount: 60,
    desc: '芙蓉花精送的花露，清清甜甜。回复 60 体力。',
  },
  xueya: {
    name: '青城雪芽', use: 'mp', amount: 20,
    desc: '鹤道长送的山茶，清香提神。回复 20 气。',
  },

  // ---- 宝物：不能用，放在包里推动剧情 ----
  jinnang: {
    name: '锦囊', key: true,
    desc: '诸葛先生给的，里面叠着两张纸条。一张叫醒石犀用，一张“青城山上，过不去的坎再拆”。',
  },
  juanyu: {
    name: '杜鹃羽', key: true,
    desc: '草堂杜鹃送的羽毛。凑到耳边，能听见一声“不如归去”。',
  },
  xuetao_jian: {
    name: '给石犀的信', key: true,
    desc: '写在一张小小的桃红色薛涛笺上。竹婆婆留了很多年的。',
  },
  maocao: {
    name: '茅草', key: true,
    desc: '被秋风卷跑的草堂屋顶。凑齐三把交给杜鹃。',
  },
  hongzhong: {
    name: '红中', key: true,
    desc: '一张跑路被抓回来的麻将牌，还在不服气地抖。要还给龟大爷。',
  },
  yugan: {
    name: '鱼竿', key: true,
    desc: '鱼郎的竹鱼竿，上面还挂着水猴子的毛。',
  },
  yinxing_ye: {
    name: '银杏叶', key: true,
    desc: '妈妈给的，老银杏今年掉的第一片叶子。“白果落在哪里，就在哪里长成一棵树。”',
  },
  jinbo: {
    name: '金箔碎片', key: true,
    desc: '金沙太阳神鸟金箔掉下来的碎片，微微发烫。交给太阳神鸟。',
  },
};
