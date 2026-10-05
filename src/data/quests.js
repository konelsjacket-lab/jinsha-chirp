// 菜单里的“任务”：status(state) 返回 'active' / 'done'，或者 null（还没接）
const jinbo = s => (s.items.jinbo || 0) + (s.flags.jinbo_given || 0);

export const QUESTS = [
  {
    id: 'mahjong', name: '三缺一',
    status: s => (s.flags.mj_done ? 'done' : s.flags.mj_quest ? 'active' : null),
    hint: s => (s.items.hongzhong ? '把红中还给鹤鸣茶社的龟大爷。' : '龟大爷的红中跑了，听说钻进了宽窄巷子东边的草丛。'),
    doneText: '红中回家了。龟大爷说下回不杠了（他肯定还要杠）。',
  },
  {
    id: 'fish', name: '鱼郎的鱼竿',
    status: s => (s.flags.fish_done ? 'done' : s.flags.fish_quest ? 'active' : null),
    hint: s => (s.items.yugan ? '把鱼竿还给锦江边的鱼郎。' : '水猴子头头抢走了鱼郎的鱼竿，它在锦江西头的岸边。'),
    doneText: '鱼郎教了你「俯冲」。',
  },
  {
    id: 'maoda', name: '麻老大',
    status: s => (s.flags.maoda_beaten ? 'done' : s.flags.maoda_met ? 'active' : null),
    hint: () => '人民公园湖边的麻老大天天喊你小老头。去会会它。',
    doneText: '不打不相识。',
  },
  {
    id: 'jinbo', name: '金箔碎片',
    status: s => (jinbo(s) >= 3 && !s.items.jinbo ? 'done' : jinbo(s) > 0 ? 'active' : null),
    hint: s => `找到了 ${jinbo(s)} / 3 片。${s.items.jinbo ? '拿去金沙交给太阳神鸟。' : '剩下的可能藏在草丛深处。'}`,
    doneText: '太阳神鸟的金箔补齐了一点点。',
  },
  {
    id: 'furong', name: '芙蓉花精',
    status: s => (s.flags.furong_done ? 'done' : (s.flags.furong_a || s.flags.furong_b || s.flags.furong_c) ? 'active' : null),
    hint: s => `城里藏着三棵会说话的芙蓉树，找到了 ${['furong_a', 'furong_b', 'furong_c'].filter(k => s.flags[k]).length} / 3 棵。宽窄巷子、廊桥边、武侯祠……`,
    doneText: '成都为啥子叫“蓉城”，你现在晓得了。',
  },
  {
    id: 'ad', name: '征婚启事',
    status: s => (s.flags.ad_reply ? 'done' : s.flags.ad_posted ? 'active' : null),
    hint: () => '喜鹊大妈把你的征婚启事贴在了相亲角。等回信吧……',
    doneText: '回信的是一只凤凰。你说“不约”。',
  },
];
