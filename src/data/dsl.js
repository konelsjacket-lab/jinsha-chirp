// 剧情脚本的小工具。一段剧情就是一个步骤数组，由 WorldScene.exec() 按顺序执行。
//
//   say('噪噪', '第一句', '第二句')         对话（who 为空字符串 = 旁白）
//   say('白果:happy', '……')                  冒号后面是表情，对应头像 portrait_baiguo_happy
//                                           （表情：happy surprised stubborn sad serious；没有这张图就用默认头像）
//   { flag: 'xxx' }                         设置剧情标记
//   { give: 'tangyou', n: 2 }               获得道具
//   { learn: 'shine' }                      学会技能
//   { heal: true }                          回满
//   { save: true }                          存档
//   { battle: 'rhino', lv: 5, win: [...], lose: [...] }
//   { if: 'flag', then: [...], else: [...] }
//   { fx: 'flash' | 'shake' | 'fadeOut' | 'fadeIn', color }
//   { cg: 'cg_dream' }   { cg: null }       全屏显示 / 收起剧情插图（没有图就自动跳过）
//   { music: 'bgm_world' }   { teleport: { x, y } }   { wait: 500 }
//   { end: true }                           第一章完

export function say(who, ...texts) {
  return texts.map(text => ({ say: who, text }));
}
