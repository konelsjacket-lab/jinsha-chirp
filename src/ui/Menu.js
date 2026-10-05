import { txt, panel, icon, CONFIRM_KEYS, CANCEL_KEYS } from './widgets.js';
import { sfx } from '../systems/audio.js';

// 竖排选项菜单。open() 返回 Promise<选中序号>，取消返回 -1。
// items: [{ label, disabled, hint }]
export class Menu {
  constructor(scene, { x, y, w = 240, bottom, items, title, cancelable = true, onHover, depth = 1100, itemH = 34 }) {
    const pad = 14;
    const titleH = title ? 32 : 0;
    const h = pad * 2 + titleH + items.length * itemH;
    if (bottom !== undefined) y = bottom - h;
    Object.assign(this, { scene, items, cancelable, onHover });
    this.root = scene.add.container(0, 0).setDepth(depth);
    this.root.add(panel(scene, x, y, w, h));
    if (title) this.root.add(txt(scene, x + 18, y + pad, title, { fontSize: '17px', color: '#f2c14e' }));
    this.cursor = icon(scene, x + 12, 0, 'ui_cursor', '▶');
    this.root.add(this.cursor);
    this.labels = items.map((it, i) => {
      const t = txt(scene, x + 36, y + pad + titleH + i * itemH + 4, it.label, {
        fontSize: '20px', color: it.disabled ? '#77736a' : '#f4efe2',
      });
      t.setInteractive(new Phaser.Geom.Rectangle(-28, -4, w - 16, itemH), Phaser.Geom.Rectangle.Contains);
      t.on('pointerover', () => this.select(i));
      t.on('pointerdown', () => { this.select(i); this.confirm(); });
      this.root.add(t);
      return t;
    });
    this.index = Math.max(0, items.findIndex(it => !it.disabled));
  }

  open() {
    return new Promise(resolve => {
      this.resolve = resolve;
      this.openedAt = this.scene.time.now;
      this.onKey = e => {
        if (e.code === 'ArrowUp' || e.code === 'KeyW') this.move(-1);
        else if (e.code === 'ArrowDown' || e.code === 'KeyS') this.move(1);
        else if (CONFIRM_KEYS.includes(e.code)) this.confirm();
        else if (CANCEL_KEYS.includes(e.code) && this.cancelable) this.done(-1);
      };
      this.scene.input.keyboard.on('keydown', this.onKey);
      this.select(this.index);
    });
  }

  move(d) {
    const n = this.items.length;
    let i = this.index;
    for (let k = 0; k < n; k++) {
      i = (i + d + n) % n;
      if (!this.items[i].disabled) break;
    }
    if (i !== this.index) sfx(this.scene, 'sfx_select', 0.4);
    this.select(i);
  }

  select(i) {
    this.index = i;
    const l = this.labels[i];
    this.cursor.setPosition(l.x - 24, l.y + (l.height - this.cursor.height) / 2);
    this.onHover && this.onHover(i);
  }

  confirm() {
    if (this.scene.time.now - this.openedAt < 120) return;
    if (this.items[this.index].disabled) return;
    sfx(this.scene, 'sfx_confirm', 0.5);
    this.done(this.index);
  }

  done(v) {
    this.scene.input.keyboard.off('keydown', this.onKey);
    this.root.destroy();
    this.resolve(v);
  }
}
