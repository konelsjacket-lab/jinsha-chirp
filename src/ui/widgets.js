import { FONT, COLORS } from '../config.js';

export function txt(scene, x, y, str, style = {}) {
  return scene.add.text(x, y, str, {
    fontFamily: FONT, fontSize: '20px', color: COLORS.text, ...style,
  }).setResolution(2);
}

export function panel(scene, x, y, w, h, { alpha = 0.92, edge = COLORS.panelEdge } = {}) {
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

export const CONFIRM_KEYS = ['Space', 'Enter', 'NumpadEnter', 'KeyZ'];
export const CANCEL_KEYS = ['Escape', 'KeyX', 'Backspace'];
