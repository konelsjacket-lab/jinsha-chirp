// 资源清单。启动时会尝试加载 file 指向的图片/音频：
//   - 文件存在 → 用真图/真音乐
//   - 文件不存在 → 图片用 placeholders.js 里现画的占位图，音频静音
// 所以美术和音乐只要按这里的文件名和尺寸放进 assets/ 就会自动生效。
import { PAINTERS } from './placeholders.js';

const img = (key, w, h = w, extra = {}) => ({ key, file: `assets/img/${key}.png`, w, h, pixel: true, ...extra });

export const IMAGES = [
  img('tiles', 13 * 32, 32),
  { key: 'player', file: 'assets/img/player.png', type: 'sheet', frameW: 32, frameH: 32, cols: 3, rows: 4, pixel: true },

  img('npc_zaozao', 32), img('npc_turtle', 32), img('npc_hoopoe', 32), img('npc_cuckoo', 32),
  img('npc_panda', 32), img('npc_gate', 32), img('npc_sunbird', 64), img('npc_rhino', 64),

  img('portrait_baiguo', 96), img('portrait_zaozao', 96), img('portrait_sunbird', 96), img('portrait_rhino', 96),
  // 表情头像：没有图就不加载占位，对话里自动退回默认头像
  ...['happy', 'surprised', 'stubborn', 'sad', 'serious'].map(e => img(`portrait_baiguo_${e}`, 96, 96, { optional: true })),
  img('portrait_turtle', 96), img('portrait_hoopoe', 96), img('portrait_cuckoo', 96), img('portrait_panda', 96),

  img('battle_player', 128),
  img('enemy_sparrow', 128), img('enemy_mosquito', 128), img('enemy_mahjong', 128), img('enemy_chili', 128),
  img('enemy_bamboorat', 128), img('enemy_watermonkey', 128), img('enemy_rhino', 160),

  img('bg_park', 960, 540, { pixel: false }), img('bg_north', 960, 540, { pixel: false }),
  img('bg_west', 960, 540, { pixel: false }), img('bg_east', 960, 540, { pixel: false }),
  img('bg_south', 960, 540, { pixel: false }), img('bg_boss', 960, 540, { pixel: false }),
  img('title_bg', 960, 540, { pixel: false }),
];

const audio = key => ({ key, files: [`assets/audio/${key}.mp3`, `assets/audio/${key}.ogg`] });

export const AUDIO = [
  audio('bgm_title'), audio('bgm_world'), audio('bgm_battle'), audio('bgm_boss'), audio('bgm_sunbird'),
  audio('sfx_select'), audio('sfx_confirm'), audio('sfx_hit'), audio('sfx_heal'),
  audio('sfx_encounter'), audio('sfx_levelup'),
];

export function makePlaceholder(scene, a) {
  const sheet = a.type === 'sheet';
  const w = sheet ? a.frameW * a.cols : a.w;
  const h = sheet ? a.frameH * a.rows : a.h;
  const tex = scene.textures.createCanvas(a.key, w, h);
  const ctx = tex.getContext();
  const paint = PAINTERS[a.key];
  if (sheet) {
    let i = 0;
    for (let r = 0; r < a.rows; r++) {
      for (let col = 0; col < a.cols; col++) {
        ctx.save(); ctx.translate(col * a.frameW, r * a.frameH);
        paint(ctx, col, r);
        ctx.restore();
        tex.add(i++, 0, col * a.frameW, r * a.frameH, a.frameW, a.frameH);
      }
    }
  } else {
    paint(ctx, w, h);
  }
  tex.refresh();
}
