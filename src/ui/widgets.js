import { FONT, COLORS } from '../config.js';

// 像素字体是 12px 画的，只有在 12 的整数倍大小下才清楚，所以字号统一吸附到 12 / 24 / 36 / 48……
export function pixelSize(px) {
  const n = parseFloat(px);
  if (n < 18) return 12;
  if (n < 30) return 24;
  return Math.round(n / 12) * 12;
}

export function txt(scene, x, y, str, style = {}) {
  const fontSize = `${pixelSize(style.fontSize || '24px')}px`;
  const t = scene.add.text(x, y, str, {
    fontFamily: FONT, color: COLORS.text, ...style, fontSize, fontStyle: '',
  }).setResolution(1);
  t.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  return t;
}

// 界面边框：有 GPT 画的 ui_panel（九宫格，四角各 16px）就用它，没有就用代码画的圆角框
export const UI_SLICE = 16;

export function panel(scene, x, y, w, h, { alpha = 0.92, edge = COLORS.panelEdge } = {}) {
  if (scene.textures.exists('ui_panel')) {
    const s = UI_SLICE;
    return scene.add.nineslice(x, y, 'ui_panel', undefined, Math.max(w, s * 2), Math.max(h, s * 2), s, s, s, s)
      .setOrigin(0).setAlpha(Math.min(1, alpha + 0.06));
  }
  const g = scene.add.graphics();
  g.fillStyle(COLORS.panel, alpha).fillRoundedRect(x, y, w, h, 10);
  g.lineStyle(2, edge, 0.9).strokeRoundedRect(x + 1, y + 1, w - 2, h - 2, 10);
  return g;
}

export function bar(g, x, y, w, h, ratio, color) {
  g.fillStyle(0x000000, 0.5).fillRoundedRect(x, y, w, h, h / 2);
  const r = Math.max(0, Math.min(1, ratio));
  if (r > 0) g.fillStyle(color, 1).fillRoundedRect(x, y, Math.max(h, w * r), h, h / 2);
}

// 小图标：有图用图，没图用文字符号
export function icon(scene, x, y, key, fallback, color = '#f2c14e') {
  if (scene.textures.exists(key)) return scene.add.image(x, y, key).setOrigin(0, 0);
  return txt(scene, x, y, fallback, { fontSize: '12px', color });
}

export const CONFIRM_KEYS = ['Space', 'Enter', 'NumpadEnter', 'KeyZ'];
export const CANCEL_KEYS = ['Escape', 'KeyX', 'Backspace'];
