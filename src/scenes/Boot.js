import { IMAGES, AUDIO, makePlaceholder } from '../assets.js';
import { GAME_W, GAME_H } from '../config.js';
import { txt } from '../ui/widgets.js';

export default class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const label = txt(this, GAME_W / 2, GAME_H / 2 - 30, '金沙啾 · 加载中', { fontSize: '22px' }).setOrigin(0.5);
    const bar = this.add.rectangle(GAME_W / 2 - 200, GAME_H / 2 + 10, 0, 8, 0xf2c14e).setOrigin(0, 0.5);
    this.load.on('progress', v => { bar.width = 400 * v; });
    // 缺少的美术/音频文件会走到这里，之后用占位图代替，不算错误
    this.missing = [];
    this.load.on('loaderror', f => this.missing.push(f.key));
    for (const a of IMAGES) {
      if (a.type === 'sheet') this.load.spritesheet(a.key, a.file, { frameWidth: a.frameW, frameHeight: a.frameH });
      else this.load.image(a.key, a.file);
    }
    for (const a of AUDIO) this.load.audio(a.key, a.files);
    this.load.on('complete', () => label.destroy());
  }

  create() {
    for (const a of IMAGES) {
      if (!this.textures.exists(a.key)) {
        if (a.optional) continue;
        makePlaceholder(this, a);
      }
      if (a.pixel) this.textures.get(a.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    const optional = new Set(IMAGES.filter(a => a.optional).map(a => a.key));
    this.missing = this.missing.filter(k => !optional.has(k));
    if (this.missing.length) console.info(`[金沙啾] ${this.missing.length} 个资源未找到，已使用占位图/静音：`, this.missing.join(', '));
    this.scene.start('Title');
  }
}
