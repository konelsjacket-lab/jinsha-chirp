import { say } from './dsl.js';

// ===== 主角设定 =====
// 白果：一只年轻的白头鹎，住在人民公园的老银杏树上（银杏是成都市树，“白果”就是银杏果）。
// 从出生起头顶就有一撮白毛，别的鸟都喊它“小老头”。
// 成都已经四十九天没出太阳了，白果总梦到一只金色的鸟在叫它去金沙……
// 完整设定见 docs/STORY.md

export const INTRO = [
  { cg: 'cg_intro_park' },
  { fx: 'fadeIn' },
  ...say('',
    '成都，人民公园。',
    '这座城市已经连续四十九天没有出过太阳了。',
    '老成都人见怪不怪：“蜀犬吠日嘛，太阳一出来，狗都要叫唤。”',
    '可这一回，连狗都快忘记太阳长啥样了。'),
  { cg: 'cg_dream' },
  ...say('？？？', '……孩子……', '……来金沙……找我……'),
  { cg: null },
  { fx: 'flash', color: 0xf2c14e },
  { fx: 'shake' },
  ...say('白果:surprised', '哇！！'),
  ...say('',  '白果一个激灵，从银杏枝上滚了下来。'),
  ...say('噪噪', '哟，白老头醒啦？做啥子噩梦嘛，叫得比我还响。'),
  ...say('白果',
    '噪噪，我又梦到那只金色的鸟了。它喊我去金沙。'),
  ...say('噪噪', '金沙？西边那个遗址嘛。你娃怕是想太阳想疯了。'),
  ...say('白果:sad', '……我出生那天，头上就白了一撮。妈妈说，那天金沙那边亮了一下。'),
  ...say('白果:serious', '我想去看看。说不定，跟我这颗脑壳有关系。'),
  ...say('噪噪',
    '要得要得！路上草丛里的麻雀帮凶得很，你注意点。',
    '打不赢就跑，累了就去鹤鸣茶社找龟大爷歇一哈。',
    '对了——方向键或 WASD 走路，空格跟人说话，Esc 打开菜单。用手机就是左边摇杆、右边按钮。'),
  { flag: 'intro_done' },
  { save: true },
];

// 打输了：被送回这张地图的起点，回满
export function lose(s) {
  const line = s.map === 'qingcheng'
    ? say('噪噪', '你终于醒了！我把你从石阶上一路拖下山的，累死我了……', '下回打不赢就喊我，我帮你吵！')
    : say('噪噪', '你终于醒了！我喊了一群土画眉才把你抬回窝里……', '打不赢就跑嘛，莫硬撑！');
  const after = [{ heal: true }, ...line, { save: true }];
  // 在成都打输了：被抬回人民公园的窝里；在青城山：拖回山脚
  if (s.map === 'qingcheng') return [{ fx: 'fadeOut' }, { teleport: 'start' }, { fx: 'fadeIn' }, ...after];
  return [{ warp: { map: 'park', x: 28, y: 9 }, then: after }];
}

export function objective(s) {
  const f = s.flags;
  if (!f.intro_done) return '';
  if (!f.met_sunbird) return '去西边的金沙遗址，找到梦里那只金色的鸟';
  if (!f.rhino_beaten) return '去人民公园南边的锦江边，找石犀打听神鸟的下落';
  if (!f.ch1_end) return '前往城西北山道尽头的青城山山门';
  if (!f.axi_found) {
    if (s.map !== 'qingcheng') return '回到城西北的青城山山门，上山';
    if (!f.met_ginkgo) return '沿着石阶往上走，去天师洞看看';
    if (!f.met_crane) return '继续上山，去上清宫';
    if (!f.xiaoqing_beaten) return '上山的路被小青拦住了';
    return '登上山顶的老君阁，去见白蛇';
  }
  if (!f.ch2_end) return '回金沙遗址';
  return '第二章完！第三章「峨眉金顶」制作中，到处逛逛吧';
}

// 第二章尾声：带着阿曦回到金沙，成都出太阳了
export const EPILOGUE_CH2 = [
  { music: 'bgm_sunbird' },
  ...say('', '金沙遗址。阿曦从白果身后飞出来，落进太阳神鸟的光里。'),
  ...say('太阳神鸟', '……阿曦。'),
  ...say('阿曦', '姐。我回来了。……成都还是这么阴哦。'),
  ...say('太阳神鸟', '那就让它晴一下。'),
  { fx: 'flash', color: 0xf2c14e },
  { cg: 'cg_sunny_chengdu' },
  { flag: 'ch2_end' },
  { refresh: true },
  ...say('',
    '那一天下午，成都出了一个小时的太阳。',
    '先是一只狗叫了起来。然后是两只、三只……',
    '全城的狗都冲着天上叫个不停。'),
  ...say('噪噪', '蜀犬吠日！！是真的蜀犬吠日！！'),
  ...say('',
    '人民公园里，龟大爷把茶桌搬到了太阳底下。',
    '宽窄巷子的猫全都躺平在屋顶上。熊猫基地的食铁兽翻了个身，把肚皮对着太阳。',
    '锦江边，石犀身上的青苔冒出了一点点热气。'),
  ...say('白果:happy', '……原来太阳，是这个味道。'),
  { cg: null },
  ...say('太阳神鸟', '这只是第一缕光，小白头。阿曦，把你的光分一点给它。'),
  ...say('阿曦', '好嘛……就一点点哈。'),
  { fx: 'flash', color: 0xf2c14e },
  { learn: 'shine2' },
  ...say('太阳神鸟',
    '峨眉山上还有一只神鸟。它比阿曦倔多了。',
    '不过不急。今天，先晒晒太阳。'),
  { save: true },
  { card: { title: '第二章 · 青城白蛇　完', sub: '第三章「峨眉金顶」制作中……\n\n成都出太阳了，去看看大家吧' } },
];

export function chengduOnEnter(s) {
  // 带着阿曦回到金沙祭坛：第二章尾声
  return s.map === 'jinsha_altar' && s.flags.axi_found && !s.flags.ch2_end ? EPILOGUE_CH2 : [];
}
