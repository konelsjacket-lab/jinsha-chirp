import { say } from './dsl.js';
import { START } from './map.js';

// ===== 主角设定 =====
// 白果：一只年轻的白头鹎，住在人民公园的老银杏树上（银杏是成都市树，“白果”就是银杏果）。
// 从出生起头顶就有一撮白毛，别的鸟都喊它“小老头”。
// 成都已经四十九天没出太阳了，白果总梦到一只金色的鸟在叫它去金沙……

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

export const LOSE = [
  { fx: 'fadeOut' },
  { teleport: START },
  { heal: true },
  { fx: 'fadeIn' },
  ...say('噪噪',
    '你终于醒了！我喊了一群土画眉才把你抬回窝里……',
    '打不赢就跑嘛，莫硬撑！'),
  { save: true },
];

export function objective(state) {
  const f = state.flags;
  if (!f.intro_done) return '';
  if (!f.met_sunbird) return '去西边的金沙遗址，找到梦里那只金色的鸟';
  if (!f.rhino_beaten) return '去人民公园南边的锦江边，找石犀打听神鸟的下落';
  if (!f.ch1_end) return '前往城西北山道尽头的青城山山门';
  return '第一章完！在成都随便逛逛吧（第二章制作中）';
}
