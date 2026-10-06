// 资源清单。启动时会尝试加载 file 指向的图片/音频：
//   - 文件存在 → 用真图/真音乐
//   - 文件不存在 → 图片用 placeholders.js 里现画的占位图，音频静音
// 所以美术和音乐只要按这里的文件名和尺寸放进 assets/ 就会自动生效。
import { PAINTERS } from './placeholders.js';
import { SPRITE, BIG_SPRITE } from './config.js';

const img = (key, w, h = w, extra = {}) => ({ key, file: `assets/img/${key}.png`, w, h, pixel: true, ...extra });

export const IMAGES = [
  // 地图图块：tiles_ph 是占位（13 格 × 32px 一行）；tile_01..tile_13 是真图（128×128 平铺大图，树是 32×32），
  // 启动时由 Boot 拼成最终的 'tiles' 图块集
  img('tiles_ph', 13 * 32, 32),
  ...Array.from({ length: 13 }, (_, i) => img(`tile_${String(i + 1).padStart(2, '0')}`, 128, 128, { optional: true })),
  { key: 'player', file: 'assets/img/player.png', type: 'sheet', frameW: SPRITE, frameH: SPRITE, cols: 3, rows: 4, pixel: true },

  img('npc_zaozao', SPRITE), img('npc_turtle', SPRITE), img('npc_hoopoe', SPRITE), img('npc_cuckoo', SPRITE),
  img('npc_panda', SPRITE), img('npc_gate', SPRITE), img('npc_sunbird', BIG_SPRITE), img('npc_rhino', BIG_SPRITE),

  img('portrait_baiguo', 96), img('portrait_zaozao', 96), img('portrait_sunbird', 96), img('portrait_rhino', 96),
  // 表情头像：没有图就不加载占位，对话里自动退回默认头像
  ...['happy', 'surprised', 'stubborn', 'sad', 'serious'].map(e => img(`portrait_baiguo_${e}`, 96, 96, { optional: true })),
  img('portrait_turtle', 96), img('portrait_hoopoe', 96), img('portrait_cuckoo', 96), img('portrait_panda', 96),

  // 第一章支线、第二章的新角色
  ...['magpie', 'maoda', 'owl', 'kingfisher', 'monkey', 'hongzhong', 'boar', 'crane', 'xiaoqing', 'axi'].map(k => img(`npc_${k}`, SPRITE)),
  img('npc_ginkgo', BIG_SPRITE), img('npc_baishe', BIG_SPRITE),
  ...['magpie', 'maoda', 'owl', 'kingfisher', 'boar', 'ginkgo', 'crane', 'xiaoqing', 'baishe', 'axi'].map(k => img(`portrait_${k}`, 96)),

  // 界面：对话框/菜单边框（九宫格）、选择光标、“继续”箭头、手机按钮。没有就用代码画的
  img('ui_panel', 48, 48, { optional: true }), img('ui_cursor', 16, 16, { optional: true }),
  img('ui_next', 16, 16, { optional: true }), img('ui_button', 64, 64, { optional: true }),

  // 地标：宽 = 占地格数×32，高 = 占地高度×32 再多一截（屋顶伸到上面）。地图放大一倍以后，地标和摆件都是原来的两倍大
  img('npc_mama', SPRITE), img('npc_myna', SPRITE), img('npc_pigeon', SPRITE), img('npc_xiuyan', SPRITE), img('portrait_mama', 96),
  img('npc_zhupopo', SPRITE), img('npc_furong', SPRITE), img('npc_huangli', SPRITE),
  ...['zhupopo', 'furong', 'myna'].map(k => img(`portrait_${k}`, 96, 96, { optional: true })),
  // 装饰小物件（地图里写 deco: true）：没有图就不显示
  img('prop_teatable', 128, 128, { optional: true }), img('prop_mahjong', 128, 128, { optional: true }),
  img('prop_lantern', 64, 128, { optional: true }), img('prop_stonelamp', 64, 128, { optional: true }),
  img('prop_furong', 128, 192, { optional: true }), img('prop_boat', 128, 64, { optional: true }),
  // 第四批：更多装饰（docs/美术提示词_第四批.txt）
  ...[['apples', 128, 64], ['bamboo', 128, 192], ['beidou', 128, 128], ['bench', 128, 64], ['bianlian', 128, 128], ['bike', 128, 64], ['birdcage', 64, 128], ['chaimen', 128, 128], ['changzuihu', 128, 128], ['flowerbed', 128, 128], ['goldmask', 128, 128], ['leaves', 128, 64], ['lion', 64, 96], ['lotus', 128, 64], ['shujin', 128, 128], ['snackcart', 128, 64], ['stele', 128, 192], ['stonetable', 128, 128], ['tongliren', 64, 128], ['well', 128, 128], ['zhubian', 128, 128]]
    .map(([k, w, h]) => img(`prop_${k}`, w, h, { optional: true })),
  img('lm_nest', 192, 320),
  img('lm_heming', 448, 320), img('lm_baolu', 128, 256), img('lm_kuanzhai', 256, 256),
  img('lm_altar', 384, 384), img('lm_hejiang', 192, 224), img('lm_langqiao', 320, 384),
  img('lm_wangjiang', 192, 256), img('lm_wuhou', 512, 192), img('lm_caotang', 320, 320), img('lm_panda', 512, 224),

  img('battle_player', 128),
  img('enemy_sparrow', 128), img('enemy_mosquito', 128), img('enemy_mahjong', 128), img('enemy_chili', 128),
  img('enemy_bamboorat', 128), img('enemy_watermonkey', 128), img('enemy_rhino', 160),
  img('enemy_snake', 128), img('enemy_leech', 128), img('enemy_mist', 128), img('enemy_larou', 128), img('enemy_xiaoqing', 160),

  img('bg_park', 960, 540, { pixel: true }), img('bg_north', 960, 540, { pixel: true }),
  img('bg_west', 960, 540, { pixel: true }), img('bg_east', 960, 540, { pixel: true }),
  img('bg_south', 960, 540, { pixel: true }), img('bg_boss', 960, 540, { pixel: true }),
  img('bg_qingcheng', 960, 540, { pixel: true }),
  img('title_bg', 960, 540),

  // 剧情插图：480×270 的像素图，放大 2 倍全屏显示。没有图就跳过
  ...['cg_intro_park', 'cg_dream', 'cg_sunbird_reveal', 'cg_birth_light', 'cg_rhino_awakes', 'cg_qingcheng_gate',
    'cg_baishe', 'cg_sunny_chengdu', 'cg_caotang_wind', 'cg_maoda_rescue', 'cg_guicheng', 'cg_mama_farewell']
    .map(k => img(k, 480, 270, { optional: true })),
];

const audio = key => ({ key, files: [`assets/audio/${key}.mp3`, `assets/audio/${key}.ogg`] });

export const AUDIO = [
  audio('bgm_title'), audio('bgm_world'), audio('bgm_battle'), audio('bgm_boss'), audio('bgm_sunbird'),
  audio('bgm_qingcheng'), audio('bgm_baishe'),
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
        ctx.save(); ctx.translate(col * a.frameW, r * a.frameH); ctx.scale(a.frameW / 32, a.frameH / 32);
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
