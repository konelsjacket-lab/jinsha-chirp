import { CHARACTERS } from '../data/characters.js';
import { txt, panel, CONFIRM_KEYS } from './widgets.js';
import { sfx } from '../systems/audio.js';

// 打字机效果的对话框。play(lines) 返回 Promise，所有台词播完后 resolve。
// lines: [{ who, text }]，who 为空字符串时是旁白。
export class DialogBox {
  constructor(scene, { x = 20, y = 380, w = 920, h = 146, portraits = true, persist = false, depth = 1000 } = {}) {
    Object.assign(this, { scene, x, y, w, h, portraits, persist });
    this.root = scene.add.container(0, 0).setDepth(depth).setVisible(persist);
    this.root.add(panel(scene, x, y, w, h));
    this.portrait = scene.add.image(x + 14 + 48, y + h / 2, '__DEFAULT').setVisible(false);
    this.name = txt(scene, x + 20, y + 12, '', { fontSize: '19px', fontStyle: 'bold' });
    this.body = txt(scene, x + 20, y + 42, '', {
      fontSize: '21px', lineSpacing: 6, wordWrap: { width: w - 50, useAdvancedWrap: true },
    });
    this.arrow = txt(scene, x + w - 34, y + h - 32, '▼', { fontSize: '16px', color: '#f2c14e' }).setVisible(false);
    this.root.add([this.portrait, this.name, this.body, this.arrow]);
    scene.tweens.add({ targets: this.arrow, alpha: 0.2, duration: 450, yoyo: true, repeat: -1 });
  }

  // 在框里显示一段不需要确认的文字（比如战斗里的技能说明）
  setText(text) {
    this.root.setVisible(true);
    this.portrait.setVisible(false);
    this.name.setText('');
    this.body.setPosition(this.x + 20, this.y + 20).setColor('#d8d0bc').setText(text);
    this.arrow.setVisible(false);
  }

  play(lines, { auto = 0 } = {}) {
    return new Promise(resolve => {
      this.queue = [...lines];
      this.resolve = resolve;
      this.auto = auto;
      this.openedAt = this.scene.time.now;
      this.root.setVisible(true);
      this.onKey = e => { if (CONFIRM_KEYS.includes(e.code)) this.advance(); };
      this.onPtr = () => this.advance();
      this.scene.input.keyboard.on('keydown', this.onKey);
      this.scene.input.on('pointerdown', this.onPtr);
      this.next();
    });
  }

  next() {
    const line = this.queue.shift();
    if (!line) return this.close();
    const ch = CHARACTERS[line.who];
    const pkey = this.portraits && ch && ch.portrait;
    const hasPortrait = pkey && this.scene.textures.exists(pkey);
    const left = this.x + (hasPortrait ? 130 : 20);
    this.portrait.setVisible(!!hasPortrait);
    if (hasPortrait) this.portrait.setTexture(pkey).setDisplaySize(96, 96);
    this.name.setPosition(left, this.y + 12).setText(line.who || '').setColor(ch ? ch.color : '#f4efe2');
    const narration = !line.who;
    this.body.setPosition(left, this.y + (narration ? 24 : 44))
      .setColor(narration ? '#d8d0bc' : '#f4efe2')
      .setWordWrapWidth(this.x + this.w - left - 40, true)
      .setText('');
    this.full = line.text;
    this.shown = 0;
    this.typing = true;
    this.arrow.setVisible(false);
    this.timer && this.timer.remove();
    this.timer = this.scene.time.addEvent({
      delay: 26, loop: true,
      callback: () => {
        this.shown += 1;
        this.body.setText(this.full.slice(0, this.shown));
        if (this.shown >= this.full.length) this.finishTyping();
      },
    });
  }

  finishTyping() {
    this.timer && this.timer.remove();
    this.timer = null;
    this.typing = false;
    this.body.setText(this.full);
    this.arrow.setVisible(true);
    if (this.auto) this.autoTimer = this.scene.time.delayedCall(this.auto, () => this.next());
  }

  advance() {
    // 刚打开时忽略输入，避免“触发对话的那一下”把第一句直接跳过
    if (this.scene.time.now - this.openedAt < 150) return;
    if (this.typing) return this.finishTyping();
    this.autoTimer && this.autoTimer.remove();
    sfx(this.scene, 'sfx_select', 0.4);
    this.next();
  }

  close() {
    this.scene.input.keyboard.off('keydown', this.onKey);
    this.scene.input.off('pointerdown', this.onPtr);
    this.autoTimer && this.autoTimer.remove();
    this.arrow.setVisible(false);
    if (!this.persist) this.root.setVisible(false);
    const r = this.resolve;
    this.resolve = null;
    r && r();
  }
}
