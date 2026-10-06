import { say } from './dsl.js';
import { prologueObjective } from './prologue.js';
import { hasThree, MAODA_RESCUE } from './npcs.js';
import { NEW_SONG } from './fun.js';

// ===== 主角设定 =====
// 白果：一只年轻的白头鹎，住在人民公园的老银杏树上（银杏是成都市树，“白果”就是银杏果）。
// 从出生起头顶就有一撮白毛，别的鸟都喊它“小老头”。
// 成都已经四十九天没出太阳了，白果总梦到一只金色的鸟在叫它去金沙……
// 完整设定见 docs/STORY.md

// 开场就是序章（prologue.js）。保留 INTRO 这个名字给旧代码和测试用
export { PROLOGUE_OPEN as INTRO } from './prologue.js';

// 打输了：被送回这张地图的起点，回满
export function lose(s) {
  const line = s.map === 'qingcheng'
    ? say('噪噪', '你终于醒了！我把你从石阶上一路拖下山的，累死我了……', '下回打不赢就喊我，我帮你吵！')
    : say('噪噪', '你终于醒了！我喊了一群土画眉才把你抬回窝里……', '打不赢就跑嘛，莫硬撑！');
  const after = [{ heal: true }, ...line, { save: true }];
  // 在成都打输了：被抬回人民公园的窝里；在青城山：拖回山脚
  if (s.map === 'qingcheng') return [{ fx: 'fadeOut' }, { teleport: 'start' }, { fx: 'fadeIn' }, ...after];
  return [{ warp: { map: 'park', x: 56, y: 18 }, then: after }];
}

export function objective(s) {
  const f = s.flags;
  if (!f.intro_done) return prologueObjective(s);
  if (!f.ch1_end) return chapter1Objective(s);
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

// 第一章：一步一步告诉玩家下一步去哪
function chapter1Objective(s) {
  const f = s.flags, it = s.items;
  if (!f.met_sunbird) {
    if (s.map === 'shaocheng' && !f.c1_hoopoe) return '迷路了……问问巷子里的戴胜师傅';
    if (s.map === 'jinsha_out' || s.map === 'jinsha_altar') return '往西走，去金沙的祭坛，找到梦里那只金色的鸟';
    return '去金沙遗址：从公园西门出去，穿过宽窄巷子往南走';
  }
  if (!f.c1_quest) return '去人民公园南边的锦江·合江亭，找石犀';
  if (!f.c1_woke) {
    if (s.map === 'caotang' && f.c1_caotang && !f.c1_roof) return `找回被风卷走的茅草（${it.maocao || 0} / 3），交给杜鹃`;
    const need = [];
    if (!it.juanyu) need.push('草堂杜鹃的啼声');
    if (!it.jinnang) need.push('武侯祠的锦囊');
    if (!it.xuetao_jian) need.push('望江楼的一封信');
    if (need.length) return `叫醒石犀，还差：${need.join('、')}`;
    return '三样东西齐了！回合江亭，叫醒石犀';
  }
  if (!f.rhino_beaten) return '打败石犀，证明你走得出成都';
  if (!f.c1_farewell) return '回人民公园的老银杏，跟妈妈道个别';
  return '去城西北的青城山道：出宽窄巷子往西，山门就在尽头';
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
  const f = s.flags;
  // 三样东西凑齐了回到锦江边：水猴子偷袭，麻老大救人
  if (s.map === 'hejiang' && f.met_sunbird && hasThree(s) && !f.maoda_rescue && !f.c1_woke) return MAODA_RESCUE;
  // 打赢石犀回到公园：麻雀帮的新歌谣
  if (s.map === 'park' && f.rhino_beaten && !f.c1_song && !f.ch1_end) return NEW_SONG;
  // 带着阿曦回到金沙祭坛：第二章尾声
  return s.map === 'jinsha_altar' && f.axi_found && !f.ch2_end ? EPILOGUE_CH2 : [];
}
