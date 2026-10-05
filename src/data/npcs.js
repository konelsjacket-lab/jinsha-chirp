import { say } from './dsl.js';

// 成都的 NPC 和踩点奇遇（只写“是谁、说什么”；放在哪张图的哪一格，写在 maps/*.js 里）。
// NPC：sprite 是贴图 key；size 是贴图边长（默认 32）。
//   script(state) 返回一段剧情；when(state) 为假时这个 NPC 不在场；bump: true 撞上去就触发。
// 奇遇（TRIGGERS）：走进地图上指定的那片格子时触发一次（once: false 可以反复触发）。

export const NPCS = [
  {
    id: 'zaozao', name: '噪噪', x: 43, y: 21, sprite: 'npc_zaozao',
    when: s => !s.flags.zaozao_party,
    script: s => {
      const f = s.flags;
      if (!f.met_sunbird) return say('噪噪',
        '金沙在西边，顺着大路一直往西飞就到了。',
        '我在这儿帮你看到窝，你放心去嘛！');
      if (!f.rhino_beaten) return say('噪噪',
        '啥子？神鸟喊你去找锦江边的石犀？',
        '那个石头牛凶得很哦！你先在草丛里多练练再去。',
        '对了，公园里那个麻老大又在到处说你坏话。你莫理它……算了，你还是去理一下它。');
      return [
        ...say('噪噪', '青城山？！听说山上有条白蛇修行了一千年……'),
        ...say('白果:happy', '你怕了？'),
        ...say('噪噪', '……怕个铲铲！你先去山门那儿，我收拾一下东西就来！'),
      ];
    },
  },
  {
    id: 'turtle', name: '龟大爷', x: 34, y: 22, sprite: 'npc_turtle',
    script: s => {
      const f = s.flags;
      const rest = [
        { heal: true },
        { save: true },
        ...say('', '喝了一碗盖碗茶，体力和气都恢复了。（已存档）'),
      ];
      if (f.ch2_end) return [
        ...say('龟大爷',
          '娃娃，你看，太阳！',
          '我把茶桌搬到太阳底下了。一百多年了，头一回晒着太阳打麻将。',
          '……莫急，莫急。慢慢来，剩下的光，总会回来的。'),
        ...rest,
      ];
      if (!f.turtle_gift) return [
        ...say('龟大爷',
          '哟，白家的娃娃。来，坐。',
          '鹤鸣茶社开了一百多年，我在这儿也喝了一百多年。',
          '年轻娃娃，莫急。成都的太阳，急不来的。',
          '这几个糖油果子你揣到起，路上饿了吃。'),
        { give: 'tangyou', n: 3 },
        { flag: 'turtle_gift' },
        ...rest,
      ];
      if (s.items.hongzhong) return [
        ...say('龟大爷', '……红中！我的红中！'),
        { take: 'hongzhong' },
        ...say('', '红中在龟大爷手心里抖了抖，小声说：“……下回莫杠上开花了嘛。”'),
        ...say('龟大爷',
          '要得要得，下回不杠了。（他肯定还要杠）',
          '娃娃，谢谢你。这碗盖碗茶是我压箱底的手艺，拿去，关键时候喝。'),
        { give: 'gaiwan', n: 2 },
        { flag: 'mj_done' },
        ...rest,
      ];
      if (f.met_sunbird && !f.mj_quest) return [
        ...say('龟大爷',
          '唉……娃娃，帮大爷一个忙嘛。',
          '我们这桌麻将，三缺一——不是缺人，是缺牌。',
          '那张红中，昨天晚上自己长脚跑了。',
          '有人看到它往宽窄巷子东边的草丛里钻进去了。'),
        ...say('白果:surprised', '……麻将牌还会跑？'),
        ...say('龟大爷', '在成都，啥子都会成精。上个月公园门口的共享单车还离家出走了一辆。'),
        { flag: 'mj_quest' },
        ...rest,
      ];
      return [...say('龟大爷', '坐嘛坐嘛，喝碗茶再走。'), ...rest];
    },
  },
  {
    id: 'magpie', name: '喜鹊大妈', x: 31, y: 25, sprite: 'npc_magpie',
    script: s => {
      const f = s.flags;
      if (f.ch2_end && f.ad_posted && !f.ad_reply) return [
        ...say('喜鹊大妈',
          '白果白果！你的征婚启事有回信了！',
          '对方说：“在下乃凤凰，生于丹穴之山。那年有一道金光本该落在我头上，不知所踪，我寻它很多年了。”',
          '“听闻贵处有一位头顶白光的少年，想约个时间喝茶。”'),
        ...say('白果:surprised', '……'),
        ...say('白果:stubborn', '不约！'),
        ...say('喜鹊大妈', '哎呀凤凰诶！条件多好的！我先帮你回个“考虑一下”哈！'),
        { flag: 'ad_reply' },
      ];
      if (f.ad_posted || f.p_magpie) return say('喜鹊大妈', '莫急，好姻缘都是等来的。你那张启事我贴在最显眼的位置了！');
      return [
        ...say('', '人民公园的相亲角。树上、绳子上挂满了征婚启事，好多老鸟在帮自家娃娃张罗。'),
        ...say('喜鹊大妈',
          '哎哟，这个小娃娃长得好乖！年纪轻轻的，咋个头发就白了？',
          '没得关系！少白头说明心思细！来来来，大妈帮你写一张，保证有人看上！'),
        { flag: 'p_magpie' },
        {
          choice: '要让喜鹊大妈帮你写征婚启事吗？',
          who: '喜鹊大妈',
          options: [
            { label: '写嘛，反正闲着', then: [
              ...say('喜鹊大妈', '好嘞！我念给你听哈——'),
              ...say('', '【征婚】白头鹎一只，年方一岁，有房（人民公园银杏树上一间，带阳台），性格开朗，会唱“巧克力”。头发少白，但是是天生的光。'),
              ...say('白果:stubborn', '“天生的光”是啥子……'),
              ...say('喜鹊大妈', '包装！这叫包装！'),
              { flag: 'ad_posted' },
            ] },
            { label: '不要不要不要', then: [
              ...say('喜鹊大妈', '哎呀，害羞了害羞了。想通了随时来找大妈哈！'),
            ] },
          ],
        },
      ];
    },
  },
  {
    id: 'maoda', name: '麻老大', sprite: 'npc_maoda',
    // 序章在湖边打过一架（prologue.js 的 p_lake），之后就是嘴硬的对头
    when: s => s.flags.intro_done,
    script: s => (s.flags.ch2_end
      ? say('麻老大', '……太阳出来了哈。', '我、我又没说谢谢你！我是说今天天气好！')
      : say('麻老大', '哼，小老头，又出去耍啊？', '……路上莫被水猴子拖下河了。我是说，被拖下去了我好笑你。')),
  },
  {
    id: 'hoopoe', name: '戴胜师傅', x: 40, y: 11, sprite: 'npc_hoopoe',
    script: s => {
      const f = s.flags;
      if (!f.hoopoe_gift) return [
        ...say('戴胜师傅', '采耳嘛，宽窄巷子正宗采耳，十块钱一次。'),
        ...say('白果:stubborn', '……我是鸟，我耳朵在哪儿我自己都不晓得。'),
        ...say('戴胜师傅',
          '……那确实不好采。这样，我送你个消息，再送你碗冰粉：',
          '锦江边那头石犀，是两千多年前李冰老爷子放来镇水的。它晓得的事情多得很。'),
        { give: 'bingfen', n: 1 },
        { flag: 'hoopoe_gift' },
      ];
      if (!f.hoopoe_ear) return [
        ...say('戴胜师傅', '我研究了一晚上，终于找到你们鸟的耳朵在哪儿了！就在眼睛后面那撮毛底下！'),
        {
          choice: '要不要采个耳？',
          options: [
            { label: '采！', then: [
              ...say('', '戴胜师傅拿出鹅毛棒，在白果耳边轻轻一转……'),
              { fx: 'flash' },
              ...say('白果:happy', '……！！！好舒服！！我听到了！我听到三条街外有人在喊“三缺一”！'),
              ...say('戴胜师傅', '耳聪目明，耳聪目明。这一下，你反应都要快点。'),
              { stat: { spd: 1 } },
              { flag: 'hoopoe_ear' },
            ] },
            { label: '算了，有点怕', then: say('戴胜师傅', '不痛的！想通了再来！') },
          ],
        },
      ];
      return say('戴胜师傅', '下回带你那个话痨朋友来，它那个耳朵，一看就好久没掏过了。');
    },
  },
  {
    id: 'owl', name: '诸葛先生', x: 37, y: 41, sprite: 'npc_owl',
    script: s => s.flags.got_jinnang
      ? say('诸葛先生', '锦囊收好。不到过不去的坎，莫拆。', '……拆早了，就不灵了。')
      : [
        ...say('诸葛先生',
          '（羽扇轻摇）这位小友，印堂发亮……不对，是头顶发亮。',
          '老夫在武侯祠看了一千多年的天象。天上的光，少了四缕。',
          '你此去，必有一坎过不去。'),
        ...say('白果:surprised', '那、那咋办？'),
        ...say('诸葛先生', '老夫赠你锦囊一个。遇到实在答不上来的事，再拆开看。'),
        { give: 'jinnang' },
        ...say('诸葛先生', '另外，看相二十，锦囊五十。'),
        ...say('白果:stubborn', '……你刚才说“赠”！'),
        ...say('诸葛先生', '（羽扇遮脸）……老夫说的是赠。你听错了。'),
        { flag: 'got_jinnang' },
      ],
  },
  {
    id: 'kingfisher', name: '鱼郎', x: 20, y: 35, sprite: 'npc_kingfisher',
    script: s => {
      const f = s.flags;
      if (f.fish_done) return say('鱼郎', '今天又是空军的一天。', '……但是心情好。钓鱼嘛，钓的是心情。');
      if (s.items.yugan) return [
        ...say('鱼郎', '我的鱼竿！！'),
        { take: 'yugan' },
        ...say('鱼郎',
          '兄弟，够意思。我没得啥子送你，教你一招吧。',
          '我们翠鸟抓鱼，靠的就是这一下——飞高，看准，一头扎下去！'),
        { learn: 'dive' },
        { flag: 'fish_done' },
      ];
      if (f.fish_quest) return say('鱼郎', '水猴子头头就在锦江西头那片岸边。它浑身湿漉漉的，好认得很。');
      return [
        ...say('鱼郎',
          '唉……',
          '我在锦江边钓了三年鱼，一条都没钓到过。',
          '今天终于有鱼咬钩了，结果水里冒出个水猴子，连鱼带竿一起抢走了！'),
        ...say('白果:surprised', '水猴子？那不是吓小娃娃的吗？'),
        ...say('鱼郎', '成都啥子都会成精，水猴子算啥子。它就在锦江西头。帮我把鱼竿抢回来嘛！'),
        { flag: 'fish_quest' },
      ];
    },
  },
  {
    id: 'monkey_boss', name: '水猴子头头', x: 6, y: 35, sprite: 'npc_monkey',
    when: s => s.flags.fish_quest && !s.flags.monkey_beaten,
    script: () => [
      ...say('水猴子头头', '嘿嘿嘿……这根鱼竿归我了！'),
      { battle: 'monkey_boss', lv: 5, win: [
        ...say('水猴子头头', '哎哟喂……还你还你！一根破鱼竿嘛，那么凶做啥子！', '（扑通一声跳回了锦江里）'),
        { give: 'yugan' },
        { flag: 'monkey_beaten' },
      ] },
    ],
  },
  {
    id: 'hongzhong', name: '红中', x: 50, y: 10, sprite: 'npc_hongzhong',
    when: s => s.flags.mj_quest && !s.flags.mj_got,
    script: () => [
      ...say('红中', '你是龟老头派来的？我不回去！'),
      { battle: 'hongzhong', lv: 4, win: [
        ...say('红中', '……好嘛好嘛，回去就回去。', '但是你要跟他说，下回莫老是杠上开花了，我都被摸秃了。'),
        { give: 'hongzhong' },
        { flag: 'mj_got' },
      ] },
    ],
  },
  {
    id: 'sunbird', name: '太阳神鸟', x: 12, y: 25, sprite: 'npc_sunbird', size: 64,
    script: s => {
      const f = s.flags;
      const n = s.items.jinbo || 0;
      const jinbo = n ? [
        ...say('太阳神鸟', '……你身上有我的碎片。'),
        { take: 'jinbo', n },
        { inc: 'jinbo_given', n },
        { fx: 'flash', color: 0xf2c14e },
        ...say('太阳神鸟', '三千年了，金箔也会掉渣。谢谢你，小白头。这点光，还给你。'),
        { stat: { maxHp: 6 * n, maxMp: 3 * n } },
      ] : [];
      if (f.ch2_end) return [...jinbo, ...say('太阳神鸟',
        '阿曦回来了，第一缕光也回来了。',
        '还有三只……峨眉、三星堆，还有一只，我也说不清在哪儿。',
        '慢慢来，小白头。你已经做得很好了。')];
      if (f.rhino_beaten) return [...jinbo, ...say('太阳神鸟',
        '青城山……白蛇在那里修行了很多年。',
        '她不坏，只是脾气有点大。去吧，小白头。')];
      if (f.met_sunbird) return [...jinbo, ...say('太阳神鸟',
        '四只神鸟散去了巴蜀各地……',
        '去锦江边找石犀问问吧。我的光，会一直跟着你。')];
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
          '锦江边的石犀守了这座城两千多年，它会晓得神鸟的去向。',
          '还有……我的金箔这些年掉了些碎片在城里。你要是捡到了，拿回来给我。'),
        { flag: 'met_sunbird' },
        { music: 'bgm_world' },
        { save: true },
      ];
    },
  },
  {
    id: 'axi', name: '阿曦', x: 14, y: 25, sprite: 'npc_axi',
    when: s => s.flags.ch2_end,
    script: () => say('阿曦', '……zzZ', '（它在姐姐的光里睡着了，还在小声说梦话：“靠窗……”）'),
  },
  {
    id: 'rhino', name: '石犀', x: 39, y: 34, sprite: 'npc_rhino', size: 64,
    script: s => {
      const f = s.flags;
      if (!f.met_sunbird) return [
        ...say('', '一头石头犀牛，一动不动。好像在打瞌睡。'),
        ...say('石犀', '……锦江水深，小鸟莫在这儿耍。'),
      ];
      if (f.ch2_end) return say('石犀', '……今天的江水，有太阳的味道。', '两千年了，我还是头一回觉得热。');
      if (f.rhino_beaten) return say('石犀', '青城天下幽。去吧，莫让神光等太久。');
      return [
        ...say('石犀',
          '……嗯？你头上有金沙的光。',
          '我是李冰放在这里镇水的石犀，守了这座城两千两百多年。'),
        { cg: 'cg_rhino_awakes', box: 'top' },
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
    script: s => {
      const f = s.flags;
      if (!f.cuckoo_gift) return [
        ...say('杜鹃', '不如归去～不如归去～'),
        ...say('杜鹃',
          '小家伙，我是望帝杜宇变的杜鹃。古蜀国的事，我都记得。',
          '金沙那四只神鸟啊……我看着它们飞走的。',
          '一只往西北，去了青城；一只往西南，去了峨眉；一只往北，回了三星堆……',
          '还有一只……唉，老了，记不清了。',
          '杜甫老先生以前常在这儿喂我。这两碗冰粉，你拿去吧。'),
        { give: 'bingfen', n: 2 },
        { flag: 'cuckoo_gift' },
      ];
      if (f.rhino_beaten && !f.cuckoo_story) return [
        ...say('杜鹃',
          '你见过石犀了？那给你讲个老故事吧。',
          '我当望帝那时候，蜀地年年发大水。有个叫鳖灵的人，从荆楚逆水漂来，凿开了玉垒山，把水引走了。',
          '我把王位让给了他。后来的人说我是后悔了，才夜夜啼血，喊“不如归去”。',
          '其实不是的。我只是……想家了。',
          '再后来，李冰来了，修了都江堰，放下五头石犀镇水。你见到的，就是其中一头。',
          '成都这座城啊，是一代一代人，一点一点，从水里捞起来的。'),
        ...say('白果:serious', '……那太阳，也可以一点一点找回来。'),
        ...say('杜鹃', '……嗯。不如归去，不如归去——等你把它们都带回家。'),
        { flag: 'cuckoo_story' },
      ];
      return say('杜鹃', '不如归去～', '古蜀的事，我都记得……只是越来越记不清了。');
    },
  },
  {
    id: 'panda', name: '食铁兽', x: 65, y: 8, sprite: 'npc_panda',
    script: s => s.flags.panda_gift
      ? (s.flags.ch2_end
        ? say('食铁兽', '（翻了个身，把肚皮对着太阳）……莫挡到我晒太阳。')
        : say('食铁兽', '（咔嚓咔嚓啃竹子）……莫打扰我吃饭。'))
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
    script: s => {
      const f = s.flags;
      if (!f.rhino_beaten) return say('', '山道被浓浓的云雾封住了。', '好像……还不是上山的时候。');
      // 第一章结尾（第 4 步会按新大纲重写：噪噪正式入队的场景）
      if (!f.ch1_end) return [
        { cg: 'cg_qingcheng_gate', box: 'top' },
        ...say('', '浓雾散开了一条小路，石阶一直通向山里。', '远远地，好像有什么白色的东西在林间游动……'),
        ...say('噪噪', '等一哈！等一哈！！'),
        ...say('', '噪噪扑腾着翅膀追了上来，背上还背着一个小包袱。'),
        ...say('噪噪',
          '呼……呼……你、你一个人去，被蛇吃了咋个办？',
          '我跟你去！我嘴巴快，吵架从来没输过！'),
        ...say('白果:happy', '……好嘛。那你莫拖后腿哈。'),
        ...say('噪噪', '哪个拖后腿！我带了三斤瓜子！'),
        { flag: 'zaozao_party' },
        { card: { title: '第一章 · 金沙之光　完', sub: '噪噪加入了队伍！' } },
        { flag: 'ch1_end' },
        { save: true },
        { cg: null },
        { warp: { map: 'qingcheng', x: 19, y: 53 } },
      ];
      return [{
        choice: '石阶一直通向青城山里。要上山吗？',
        options: [
          { label: '上山', then: [{ warp: { map: 'qingcheng', x: 19, y: 53 } }] },
          { label: '再逛逛成都', then: [] },
        ],
      }];
    },
  },
];

export const TRIGGERS = [
  {
    id: 'koi', x0: 40, y0: 25, x1: 46, y1: 25,
    when: s => s.flags.intro_done,
    script: () => [
      ...say('', '湖里一条胖锦鲤探出头来，吐了个泡泡。'),
      ...say('锦鲤', '小鸟小鸟，我是人民公园的许愿锦鲤。给你许一个愿，免费的。'),
      {
        choice: '许个啥子愿？',
        options: [
          { label: '让成都出太阳', then: say('锦鲤', '……这个有点大。我只是一条鱼。', '你自己努力一下嘛，我精神上支持你。') },
          { label: '天天有糖油果子吃', then: [
            ...say('锦鲤', '这个可以。'),
            ...say('', '锦鲤吐出一个糖油果子。……它是从哪里拿出来的？'),
            { give: 'tangyou' },
          ] },
          { label: '头发变黑', then: say('锦鲤', '……', '这个我管不了。你那个是光，不是头发。') },
        ],
      },
    ],
  },
  {
    id: 'hotpot', x0: 28, y0: 8, x1: 29, y1: 8,
    when: s => s.flags.intro_done,
    script: () => [
      ...say('', '一阵牛油火锅的香味从巷子里飘出来。白果的肚子“咕——”地叫了一声。'),
      {
        choice: '要不要循着香味去看看？',
        options: [
          { label: '去看看', then: [
            ...say('', '白果探头往火锅店里一看：毛肚七上八下，鸭肠在锅里翻滚，一桌人吃得满头大汗。'),
            ...say('火锅店老板', '哎哎哎！鸟不准进来！'),
            ...say('', '白果被赶了出来。门口地上掉了一个糖油果子，白果捡起来就跑。'),
            { give: 'tangyou' },
          ] },
          { label: '忍住', then: say('白果:serious', '……我是要去找太阳的鸟。我忍得住。', '……咕——') },
        ],
      },
    ],
  },
  {
    id: 'wuhou_wall', x0: 30, y0: 40, x1: 44, y1: 40,
    script: () => say('',
      '武侯祠的红墙上，有人写了四个大字：“鞠躬尽瘁”。',
      '下面有只鸟用爪子歪歪扭扭补了一行：“死而后已，但是先吃饭。”'),
  },
  {
    id: 'panda_butt', x0: 62, y0: 12, x1: 63, y1: 12,
    script: () => say('',
      '一群游客举着手机，对着竹林里的食铁兽“咔嚓咔嚓”猛拍。',
      '食铁兽慢慢翻了个身，把屁股对准了他们。',
      '游客们：“哇——好可爱！！”'),
  },
  {
    id: 'river_note', x0: 36, y0: 35, x1: 37, y1: 35,
    when: s => s.flags.met_sunbird,
    script: () => [
      ...say('', '锦江上漂过来一张湿漉漉的纸条，被白果一把叼住了。'),
      ...say('', '纸条上的字歪歪扭扭：“救命！我被困在三星堆了！谁看到了请——”', '后面的字被水泡花了，看不清。'),
      ...say('白果:surprised', '三星堆？……这、这该不会是……'),
      ...say('白果:serious', '……先收着。'),
    ],
  },
  {
    id: 'little_snake', x0: 8, y0: 5, x1: 12, y1: 6,
    when: s => s.flags.met_sunbird && !s.flags.ch1_end,
    script: () => say('',
      '石头缝里探出一条小小的青蛇，冲白果吐了吐信子。',
      '它盯着白果头顶的白毛看了好一会儿，“嗖”地一下钻进了山里。'),
  },
  {
    id: 'jinbo1', x0: 21, y0: 27, x1: 22, y1: 28,
    when: s => s.flags.met_sunbird,
    script: () => [
      ...say('', '草丛里有什么东西在闪光……'),
      { give: 'jinbo' },
    ],
  },
  {
    id: 'jinbo2', x0: 65, y0: 43, x1: 66, y1: 44,
    when: s => s.flags.met_sunbird,
    script: () => [
      ...say('', '草根底下埋着一小片亮晶晶的东西。'),
      { give: 'jinbo' },
    ],
  },
];


// 按 id 查：地图文件里用 NPC.turtle、TRIGGER.koi 来摆放
export const NPC = Object.fromEntries(NPCS.map(n => [n.id, n]));
export const TRIGGER = Object.fromEntries(TRIGGERS.map(t => [t.id, t]));
