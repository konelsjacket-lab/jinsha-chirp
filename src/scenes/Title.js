import { GAME_W, GAME_H } from '../config.js';
import { txt } from '../ui/widgets.js';
import { Menu } from '../ui/Menu.js';
import { newState, loadState, hasSave } from '../state.js';
import { playMusic } from '../systems/audio.js';

export default class Title extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    this.add.image(GAME_W / 2, GAME_H / 2, 'title_bg').setDisplaySize(GAME_W, GAME_H);
    const title = txt(this, GAME_W / 2, 150, '金沙啾', {
      fontSize: '96px', fontStyle: 'bold', color: '#f6d77a', stroke: '#3b2a10', strokeThickness: 10,
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 158, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    txt(this, GAME_W / 2, 238, 'Jinsha Chirp · 一只白头鹎的巴蜀奇遇', {
      fontSize: '22px', color: '#f4efe2', stroke: '#1b1f2a', strokeThickness: 4,
    }).setOrigin(0.5);
    txt(this, GAME_W / 2, GAME_H - 22, '美术 GPT · 音乐 Gemini · 程序 Claude', {
      fontSize: '14px', color: '#a8a290',
    }).setOrigin(0.5);
    playMusic(this, 'bgm_title');
    this.mainMenu();
  }

  async mainMenu() {
    const save = hasSave();
    const items = [{ label: '新的旅程' }, { label: '继续旅程', disabled: !save }];
    const menu = new Menu(this, { x: GAME_W / 2 - 110, y: 300, w: 220, items, cancelable: false });
    if (save) menu.index = 1;
    const i = await menu.open();
    if (i === 0 && save) {
      const ok = await new Menu(this, {
        x: GAME_W / 2 - 170, y: 300, w: 340, title: '旧存档会被覆盖哦',
        items: [{ label: '重新开始' }, { label: '算了' }],
      }).open();
      if (ok !== 0) return this.mainMenu();
    }
    const state = i === 1 ? (loadState() || newState()) : newState();
    this.registry.set('state', state);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('World'));
  }
}
