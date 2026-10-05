// 剧情脚本的小工具。一段剧情就是一个步骤数组，由 WorldScene.exec() 按顺序执行。
//
//   say('噪噪', '第一句', '第二句')         对话（who 为空字符串 = 旁白）
//   say('白果:happy', '……')                  冒号后面是表情，对应头像 portrait_baiguo_happy
//                                           （表情：happy surprised stubborn sad serious；没有这张图就用默认头像）
//   { flag: 'xxx' }   { unflag: 'xxx' }     设置 / 清除剧情标记
//   { inc: 'xxx', n: 1 }                    计数（存在 flags 里）
//   { give: 'tangyou', n: 2 }               获得道具      { take: 'hongzhong', n: 1 }  交出道具
//   { learn: 'shine' }                      学会技能
//   { codex: 'gaiwan' }                     解锁一页成都见闻录（内容在 codex.js）
//   { stat: { maxHp: 6, def: 3 } }          永久提升属性
//   { heal: true }   { save: true }         回满 / 存档
//   { battle: 'rhino', lv: 5, bg, noFlee, win: [...], lose: [...], flee: [...] }
//   { if: 'flag' | '!flag' | s => 布尔, then: [...], else: [...] }
//   { choice: '问题', who: '白蛇', options: [{ label, then: [...], when? }] }   选项
//   { cg: 'cg_dream' }   { cg: null }       全屏显示 / 收起剧情插图（没有图就自动跳过）
//   { cg: 'cg_xxx', box: 'top' }            对话框挪到上方，别挡住画面下方的角色
//   { fx: 'flash' | 'shake' | 'fadeOut' | 'fadeIn', color }
//   { music: 'bgm_world' }   { wait: 500 }
//   { teleport: { x, y } | 'start' }        在当前地图里瞬移
//   { warp: { map: 'qingcheng', x, y } }    换地图（后面的步骤不再执行）
//   { card: { title, sub } }                章节大字卡片
//   { refresh: true }                       立刻刷新 NPC 和天色

export function say(who, ...texts) {
  return texts.map(text => ({ say: who, text }));
}
