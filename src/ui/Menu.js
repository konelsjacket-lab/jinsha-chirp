import { txt, panel, icon, CONFIRM_KEYS, CANCEL_KEYS } from './widgets.js';
import { sfx } from '../systems/audio.js';

// 竖排选项菜单。open() 返回 Promise<选中序号>，取消返回 -1。
// items: [{ label, disabled, hint }]
// visible：一次最多显示几项，多了就滚动（方向键 / 滚轮）。
// stay：选中不关闭菜单，只调用 onConfirm（比如见闻录：点条目是查看，不是退出）。
export class Menu {
  constructor(scene, { x, y, w = 240, bottom, items, title, cancelable = true, onHover, onConfirm, stay = false,
    visible = items.length, depth = 1100, itemH = 34 }) {
    const pad = 14;
    const titleH = title ? 32 : 0;
    visible = Math.min(visible, items.length);
    const h = pad * 2 + titleH + visible * itemH;
    if (bottom !== undefined) y = bottom - h;
    Object.assign(this, { scene, items, cancelable, onHover, onConfirm, stay, visible, itemH, top: 0 });
    this.listY = y + pad + titleH + 4;
    this.root = scene.add.container(0, 0).setDepth(depth);
    this.root.add(panel(scene, x, y, w, h));
    if (title) this.root.add(txt(scene, x + 18, y + pad, title, { fontSize: '17px', color: '#f2c14e' }));
    this.cursor = icon(scene, x + 12, 0, 'ui_cursor', '▶');
    this.root.add(this.cursor);
    this.labels = items.map((it, i) => {
      const t = txt(scene, x + 36, this.listY + i * itemH, it.label, {
        fontSize: '20px', color: it.disabled ? '#77736a' : '#f4efe2',
      });
      t.setInteractive(new Phaser.Geom.Rectangle(-28, -4, w - 16, itemH), Phaser.Geom.Rectangle.Contains);
      t.on('pointerover', () => this.select(i));
      t.on('pointerdown', () => { this.select(i); this.confirm(); });
      this.root.add(t);
      return t;
    });
    // 放不下的时候，上下各一个小箭头提示还能滚
    if (visible < items.length) {
      this.upMark = txt(scene, x + w - 22, y + pad + titleH - 6, '▲', { fontSize: '12px', color: '#a8a290' });
      this.downMark = txt(scene, x + w - 22, y + h - pad - 10, '▼', { fontSize: '12px', color: '#a8a290' });
      this.root.add([this.upMark, this.downMark]);
    }
    this.index = Math.max(0, items.findIndex(it => !it.disabled));
  }

  // 按滚动位置摆放各项：窗口外的隐藏、不能点
  layout() {
    this.labels.forEach((t, i) => {
      const on = i >= this.top && i < this.top + this.visible;
      t.setVisible(on).setY(this.listY + (i - this.top) * this.itemH);
      if (t.input) t.input.enabled = on;
    });
    if (this.upMark) {
      this.upMark.setVisible(this.top > 0);
      this.downMark.setVisible(this.top + this.visible < this.items.length);
    }
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
      this.onWheel = (p, objs, dx, dy) => this.move(dy > 0 ? 1 : -1);
      if (this.visible < this.items.length) this.scene.input.on('wheel', this.onWheel);
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
    if (i < this.top) this.top = i;
    if (i >= this.top + this.visible) this.top = i - this.visible + 1;
    this.layout();
    const l = this.labels[i];
    this.cursor.setPosition(l.x - 24, l.y + (l.height - this.cursor.height) / 2);
    this.onHover && this.onHover(i);
  }

  confirm() {
    if (this.scene.time.now - this.openedAt < 120) return;
    if (this.items[this.index].disabled) return;
    sfx(this.scene, 'sfx_confirm', 0.5);
    if (this.stay) { this.onConfirm && this.onConfirm(this.index); return; }
    this.done(this.index);
  }

  done(v) {
    if (this.closed) return;
    this.closed = true;
    this.scene.input.keyboard.off('keydown', this.onKey);
    this.scene.input.off('wheel', this.onWheel);
    this.root.destroy();
    this.resolve(v);
  }
}
