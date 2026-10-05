import { say } from './dsl.js';

// x, y 是格子坐标。sprite 是贴图 key；size 是贴图边长（默认 32）。
// script(state) 返回一段剧情步骤。bump: true 表示撞上去就会触发。
export const NPCS = [
  {
    id: 'zaozao', name: '噪噪', x: 43, y: 21, sprite: 'npc_zaozao',
    script: s => {
      const f = s.flags;
      if (!f.met_sunbird) return say('噪噪',
        '金沙在西边，顺着大路一直往西飞就到了。',
        '我在这儿帮你看到窝，你放心去嘛！');
      if (!f.rhino_beaten) return say('噪噪',
        '啥子？神鸟喊你去找锦江边的石犀？',
        '那个石头牛凶得很哦！你先在草丛里多练练再去。');
      return [
        ...say('噪噪', '青城山？！听说山上有条白蛇修行了一千年……'),
        ...say('白果:happy', '你怕了？'),
        ...say('噪噪', '……怕个铲铲！好嘛，下回我陪你去！'),
      ];
    },
  },
  {
    id: 'turtle', name: '龟大爷', x: 34, y: 22, sprite: 'npc_turtle',
    script: s => [
      ...(s.flags.turtle_gift ? say('龟大爷', '坐嘛坐嘛，喝碗茶再走。') : [
        ...say('龟大爷',
          '哟，白家的娃娃。来，坐。',
          '鹤鸣茶社开了一百多年，我在这儿也喝了一百多年。',
          '年轻娃娃，莫急。成都的太阳，急不来的。',
          '这几个糖油果子你揣到起，路上饿了吃。'),
        { give: 'tangyou', n: 3 },
        { flag: 'turtle_gift' },
      ]),
      { heal: true },
      { save: true },
      ...say('', '喝了一碗盖碗茶，体力和气都恢复了。（已存档）'),
    ],
  },
  {
    id: 'hoopoe', name: '戴胜师傅', x: 40, y: 11, sprite: 'npc_hoopoe',
    script: s => s.flags.hoopoe_gift
      ? say('戴胜师傅', '锦江边那头石犀，是李冰老爷子放来镇水的。它晓得的事情多得很。')
      : [
        ...say('戴胜师傅', '采耳嘛，宽窄巷子正宗采耳，十块钱一次。'),
        ...say('白果:stubborn', '……我是鸟，我耳朵在哪儿我自己都不晓得。'),
        ...say('戴胜师傅',
          '……那确实不好采。这样，我送你个消息，再送你碗冰粉：',
          '锦江边那头石犀，是两千多年前李冰老爷子放来镇水的。它晓得的事情多得很。'),
        { give: 'bingfen', n: 1 },
        { flag: 'hoopoe_gift' },
      ],
  },
  {
    id: 'sunbird', name: '太阳神鸟', x: 12, y: 25, sprite: 'npc_sunbird', size: 64,
    script: s => {
      const f = s.flags;
      if (f.rhino_beaten) return say('太阳神鸟',
        '青城山……白蛇在那里修行了很多年。',
        '她不坏，只是脾气有点大。去吧，小白头。');
      if (f.met_sunbird) return say('太阳神鸟',
        '四只神鸟散去了巴蜀各地……',
        '去锦江边找石犀问问吧。我的光，会一直跟着你。');
      return [
        { music: 'bgm_sunbird' },
        { cg: 'cg_sunbird_reveal' },
        ...say('太阳神鸟', '你来了，小白头。'),
        ...say('白果:surprised', '你……你就是梦里那只鸟？'),
        ...say('太阳神鸟',
          '我是金沙的太阳神鸟。',
          '三千年前，古蜀人把我们打成了一片薄薄的金箔：十二道光芒，四只神鸟，绕着太阳飞。',
          '可如今，那四只神鸟都飞散了。只剩我一缕残光守在这儿。',
          '神鸟一走，十二道光也跟着散了。成都的太阳，就一天比一天暗。'),
        ...say('白果:surprised', '所以成都才这么久不出太阳？！我还以为是正常天气……'),
        ...say('太阳神鸟', '（咳）成都的天气，确实一直不太好。但这回不一样。'),
        { cg: 'cg_birth_light' },
        ...say('太阳神鸟', '你出生那天，我用最后一点力气，把一道光落在了你头上。'),
        ...say('白果:serious', '所以我这撮白毛是……'),
        ...say('太阳神鸟', '是光的印记。也是……嗯，我当时准头不太好，本来是想落在一只凤凰头上的。'),
        ...say('白果:stubborn', '喂！'),
        { cg: null },
        ...say('太阳神鸟', '但既然落到了你头上，那就是你了。去把四只神鸟找回来吧，小白头。'),
        { fx: 'flash', color: 0xf2c14e },
        { learn: 'shine' },
        ...say('太阳神鸟',
          '这道「神光」先借给你。',
          '锦江边的石犀守了这座城两千多年，它会晓得神鸟的去向。'),
        { flag: 'met_sunbird' },
        { music: 'bgm_world' },
        { save: true },
      ];
    },
  },
  {
    id: 'rhino', name: '石犀', x: 39, y: 34, sprite: 'npc_rhino', size: 64,
    script: s => {
      const f = s.flags;
      if (!f.met_sunbird) return [
        ...say('', '一头石头犀牛，一动不动。好像在打瞌睡。'),
        ...say('石犀', '……锦江水深，小鸟莫在这儿耍。'),
      ];
      if (f.rhino_beaten) return say('石犀', '青城天下幽。去吧，莫让神光等太久。');
      return [
        ...say('石犀',
          '……嗯？你头上有金沙的光。',
          '我是李冰放在这里镇水的石犀，守了这座城两千两百多年。'),
        { cg: 'cg_rhino_awakes' },
        { fx: 'shake' },
        ...say('石犀', '想打听神鸟？先让我看看，你有没有本事走出成都。'),
        { cg: null },
        { battle: 'rhino', lv: 5, bg: 'bg_boss', win: [
          ...say('石犀',
            '好，好。是块好料。',
            '四只神鸟里头，有一只往西北飞去了青城山。山上的白蛇把它留下了。',
            '山门就在城西北那条山道的尽头。去吧。',
            '这两个糖油果子，是游客供在我脚边的。拿去。'),
          { give: 'tangyou', n: 2 },
          { flag: 'rhino_beaten' },
          { save: true },
        ] },
      ];
    },
  },
  {
    id: 'cuckoo', name: '杜鹃', x: 17, y: 41, sprite: 'npc_cuckoo',
    script: s => [
      ...say('杜鹃', '不如归去～不如归去～'),
      ...(s.flags.cuckoo_gift ? say('杜鹃', '古蜀的事，我都记得……只是越来越记不清了。') : [
        ...say('杜鹃',
          '小家伙，我是望帝杜宇变的杜鹃。古蜀国的事，我都记得。',
          '金沙那四只神鸟啊……我看着它们飞走的。',
          '一只往西北，去了青城；一只往西南，去了峨眉；一只往北，回了三星堆……',
          '还有一只……唉，老了，记不清了。',
          '杜甫老先生以前常在这儿喂我。这两碗冰粉，你拿去吧。'),
        { give: 'bingfen', n: 2 },
        { flag: 'cuckoo_gift' },
      ]),
    ],
  },
  {
    id: 'panda', name: '食铁兽', x: 65, y: 8, sprite: 'npc_panda',
    script: s => s.flags.panda_gift
      ? say('食铁兽', '（咔嚓咔嚓啃竹子）……莫打扰我吃饭。')
      : [
        ...say('食铁兽',
          '古时候的人喊我们「食铁兽」，说我们会啃铁锅。',
          '其实我们只吃竹子……偶尔吃个苹果。',
          '游客掉了些吃的，我不爱吃，送你。'),
        { give: 'bobo', n: 2 },
        ...say('白果:stubborn', '……你给一只鸟送钵钵鸡？'),
        ...say('食铁兽', '扔出去打怪嘛，辣得很。'),
        { flag: 'panda_gift' },
      ],
  },
  {
    id: 'gate', name: '青城山门', x: 1, y: 5, sprite: 'npc_gate', bump: true,
    script: s => s.flags.rhino_beaten
      ? [
        { cg: 'cg_qingcheng_gate' },
        ...say('', '浓雾散开了一条小路，石阶一直通向山里。', '远远地，好像有什么白色的东西在林间游动……'),
        { end: true },
        { cg: null },
      ]
      : say('', '山道被浓浓的云雾封住了。', '好像……还不是上山的时候。'),
  },
];
