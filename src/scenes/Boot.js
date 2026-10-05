import { IMAGES, AUDIO, makePlaceholder } from '../assets.js';
import { GAME_W, GAME_H, TILE } from '../config.js';
import { TILE_COUNT, VARIANT, SINGLE_TILES } from '../data/map.js';
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
    this.composeTiles();
    this.scene.start('Title');
  }

  // 把 13 种地形拼成一张图块集：每种地形占 4×4 格。有真图用真图，没有就用占位图重复填满。
  // 每格之间留 2px 空隙并把边缘像素向外扩 1px（TILE_PAD），否则镜头缩放 1.5 倍时
  // 格子边上会采样到隔壁地形的像素，出现细线。
  composeTiles() {
    const P = TILE + 2;
    const cols = TILE_COUNT * VARIANT;
    const tex = this.textures.createCanvas('tiles', cols * P, VARIANT * P);
    const ctx = tex.getContext();
    ctx.imageSmoothingEnabled = false;
    const ph = this.textures.get('tiles_ph').getSourceImage();
    const put = (img, sx, sy, sw, sh, col, row) => {
      const x = col * P + 1, y = row * P + 1;
      for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]]) {
        ctx.drawImage(img, sx, sy, sw, sh, x + ox, y + oy, TILE, TILE);
      }
    };
    for (let t = 0; t < TILE_COUNT; t++) {
      const key = `tile_${String(t + 1).padStart(2, '0')}`;
      const real = this.textures.exists(key) ? this.textures.get(key).getSourceImage() : null;
      for (let sy = 0; sy < VARIANT; sy++) {
        for (let sx = 0; sx < VARIANT; sx++) {
          const col = t * VARIANT + sx;
          if (real && !SINGLE_TILES.includes(t)) {
            const w = real.width / VARIANT, h = real.height / VARIANT;
            put(real, sx * w, sy * h, w, h, col, sy);
          } else if (real) {
            // 树是透明背景的单个物件：先铺一层草地，再把树盖上去
            const grass = this.textures.exists('tile_01') ? this.textures.get('tile_01').getSourceImage() : null;
            if (grass) put(grass, sx * grass.width / VARIANT, sy * grass.height / VARIANT, grass.width / VARIANT, grass.height / VARIANT, col, sy);
            else put(ph, 0, 0, TILE, TILE, col, sy);
            ctx.drawImage(real, 0, 0, real.width, real.height, col * (TILE + 2) + 1, sy * (TILE + 2) + 1, TILE, TILE);
          } else {
            put(ph, t * TILE, 0, TILE, TILE, col, sy);
          }
        }
      }
    }
    tex.refresh();
    tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
}
