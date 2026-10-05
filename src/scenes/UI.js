import { GAME_W, GAME_H, COLORS } from '../config.js';
import { txt, panel, bar, CONFIRM_KEYS } from '../ui/widgets.js';
import { DialogBox } from '../ui/DialogBox.js';
import { Menu } from '../ui/Menu.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { saveState } from '../state.js';
import { QUESTS } from '../data/quests.js';
import { useItem, expToNext } from '../systems/battle.js';
import { sfx } from '../systems/audio.js';

// 大地图上层的界面：状态栏、目标、地名、对话框、菜单、手机虚拟摇杆。
export default class UI extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    this.state = this.registry.get('state');
    this.busy = false;
    this.lastClose = 0;
    this.registry.set('joy', { x: 0, y: 0 });

    // 左上角：白果状态
    panel(this, 12, 12, 250, 74);
    this.hudName = txt(this, 26, 20, '', { fontSize: '18px', fontStyle: 'bold' });
    this.hudBars = this.add.graphics();
    this.hudHp = txt(this, 196, 46, '', { fontSize: '13px', color: '#cfe8c9' });
    this.hudMp = txt(this, 196, 64, '', { fontSize: '13px', color: '#c4def3' });

    // 右上角：当前目标
    this.objBg = this.add.graphics();
    this.objText = txt(this, GAME_W - 24, 22, '', {
      fontSize: '16px', color: '#f4efe2', align: 'right', wordWrap: { width: 460, useAdvancedWrap: true },
    }).setOrigin(1, 0);

    // 地名横幅
    this.placeText = txt(this, GAME_W / 2, 96, '', {
      fontSize: '30px', fontStyle: 'bold', color: '#f6d77a', stroke: '#1b1f2a', strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.toastText = txt(this, GAME_W / 2, GAME_H / 2 - 40, '', {
      fontSize: '22px', backgroundColor: '#1b1f2acc', padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setAlpha(0).setDepth(2000);

    // 剧情插图（CG）：盖住地图和状态栏，但在对话框下面
    // 天色（成都的阴天 / 出太阳后的暖光）和青城山的雾，盖在地图上、界面下面
    this.moodRect = this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000, 0).setOrigin(0).setDepth(-10);
    this.fogs = Array.from({ length: 7 }, (_, i) => {
      const f = this.add.ellipse(0, 0, 420 + i * 40, 120 + (i % 3) * 30, 0xe8eef0, 0).setDepth(-9);
      f.baseX = (i * 173) % GAME_W;
      f.y = 60 + (i * 79) % (GAME_H - 80);
      f.speed = 6 + (i % 4) * 3;
      return f;
    });
    this.fogLevel = 0;

    this.cg = this.add.image(GAME_W / 2, GAME_H / 2, '__DEFAULT').setDepth(900).setVisible(false);
    this.cgKey = null;

    this.dialog = new DialogBox(this);
    this.setupTouch();
    this.refreshHUD();
    this.events.on('wake', () => this.refreshHUD());
  }

  refreshHUD() {
    const p = this.state.player;
    this.hudName.setText(`${p.name}  Lv.${p.lv}`);
    this.hudBars.clear();
    this.hudBars.fillStyle(0xffffff, 0.7);
    bar(this.hudBars, 26, 50, 160, 10, p.hp / p.maxHp, COLORS.hp);
    bar(this.hudBars, 26, 68, 160, 8, p.mp / p.maxMp, COLORS.mp);
    this.hudHp.setText(`${p.hp}/${p.maxHp}`);
    this.hudMp.setText(`气 ${p.mp}/${p.maxMp}`);
  }

  setObjective(text) {
    this.objText.setText(text ? `目标：${text}` : '');
    this.objBg.clear();
    if (!text) return;
    const b = this.objText.getBounds();
    this.objBg.fillStyle(COLORS.panel, 0.8).fillRoundedRect(b.x - 12, b.y - 8, b.width + 24, b.height + 16, 8);
  }

  showPlace(name) {
    this.placeText.setText(`— ${name} —`);
    this.tweens.killTweensOf(this.placeText);
    this.placeText.setAlpha(0);
    this.tweens.add({ targets: this.placeText, alpha: 1, duration: 400, hold: 1400, yoyo: true });
  }

  toast(text) {
    this.toastText.setText(text);
    this.tweens.killTweensOf(this.toastText);
    this.toastText.setAlpha(1);
    this.tweens.add({ targets: this.toastText, alpha: 0, delay: 900, duration: 500 });
  }

  setAtmosphere({ mood, fog }) {
    if (mood) this.moodRect.setFillStyle(mood.color, mood.alpha);
    else this.moodRect.setFillStyle(0x000000, 0);
    this.fogLevel = fog || 0;
    for (const f of this.fogs) f.setFillStyle(0xe8eef0, this.fogLevel * 0.22);
  }

  update(time) {
    if (!this.fogLevel) return;
    for (const f of this.fogs) f.x = ((f.baseX + time * f.speed / 1000) % (GAME_W + 500)) - 250;
  }

  // 选项：问题写在对话框里，选项菜单在右边。返回选中的序号
  async choose(question, labels, who = '') {
    this.busy = true;
    const d = this.dialog;
    d.setText(question);
    if (who) {
      d.name.setPosition(d.x + 20, d.y + 12).setText(who.split(':')[0]);
      d.body.setY(d.y + 44);
    }
    const w = Math.max(220, Math.min(440, Math.max(...labels.map(l => l.length)) * 21 + 70));
    const boxTop = d.y + d.root.y;
    const place = d.root.y !== 0 ? { y: boxTop + d.h + 8 } : { bottom: boxTop - 8 };
    const i = await new Menu(this, {
      x: GAME_W - w - 24, w, cancelable: false, ...place,
      items: labels.map(label => ({ label })),
    }).open();
    this.dialog.root.setVisible(false);
    this.busy = false;
    this.lastClose = this.time.now;
    return i;
  }

  async dialogue(lines) {
    this.busy = true;
    await this.dialog.play(lines);
    this.busy = false;
    this.lastClose = this.time.now;
  }

  // 显示 / 切换 / 收起剧情插图。没有这张图就直接跳过，剧情照常进行。
  // box: 'top' 时对话框挪到屏幕上方，免得挡住画面下方的角色
  showCG(key, box) {
    this.dialog.root.y = key && box === 'top' ? -(this.dialog.y - 14) : 0;
    return new Promise(resolve => {
      this.tweens.killTweensOf(this.cg);
      if (!key) {
        if (!this.cgKey) return resolve();
        this.cgKey = null;
        this.tweens.add({ targets: this.cg, alpha: 0, duration: 500, onComplete: () => { this.cg.setVisible(false); resolve(); } });
        return;
      }
      if (!this.textures.exists(key)) return resolve();
      this.cgKey = key;
      this.cg.setTexture(key).setDisplaySize(GAME_W, GAME_H).setVisible(true).setAlpha(0);
      this.tweens.add({ targets: this.cg, alpha: 1, duration: 700, onComplete: resolve });
    });
  }

  // 章节结束的大字卡片
  showCard(title, sub) {
    return new Promise(resolve => {
      this.busy = true;
      const root = this.add.container(0, 0).setDepth(3000);
      root.add(this.add.rectangle(0, 0, GAME_W, GAME_H, 0x000000, 0.88).setOrigin(0));
      root.add(txt(this, GAME_W / 2, GAME_H / 2 - 30, title, { fontSize: '40px', color: '#f6d77a', fontStyle: 'bold' }).setOrigin(0.5));
      root.add(txt(this, GAME_W / 2, GAME_H / 2 + 30, sub, { fontSize: '20px', color: '#d8d0bc', align: 'center' }).setOrigin(0.5));
      root.setAlpha(0);
      this.tweens.add({ targets: root, alpha: 1, duration: 600 });
      const opened = this.time.now;
      const close = () => {
        if (this.time.now - opened < 800) return;
        this.input.keyboard.off('keydown', onKey);
        this.input.off('pointerdown', close);
        root.destroy();
        this.busy = false;
        this.lastClose = this.time.now;
        resolve();
      };
      const onKey = e => CONFIRM_KEYS.includes(e.code) && close();
      this.input.keyboard.on('keydown', onKey);
      this.input.on('pointerdown', close);
    });
  }

  // ---------- 菜单 ----------
  async openMenu() {
    this.busy = true;
    sfx(this, 'sfx_confirm', 0.5);
    while (true) {
      this.drawStatus();
      const i = await new Menu(this, {
        x: 560, y: 110, w: 200, items: [{ label: '道具' }, { label: '任务' }, { label: '存档' }, { label: '返回' }],
      }).open();
      if (i === 0) await this.itemMenu();
      else if (i === 1) await this.questMenu();
      else if (i === 2) this.toast(saveState(this.state) ? '已存档' : '存档失败（浏览器不让存）');
      else break;
    }
    this.statusRoot && this.statusRoot.destroy();
    this.statusRoot = null;
    this.busy = false;
    this.lastClose = this.time.now;
  }

  drawStatus() {
    this.statusRoot && this.statusRoot.destroy();
    const p = this.state.player;
    const r = this.statusRoot = this.add.container(0, 0).setDepth(1050);
    r.add(panel(this, 180, 110, 360, 330));
    if (this.textures.exists('portrait_baiguo')) r.add(this.add.image(250, 180, 'portrait_baiguo').setDisplaySize(96, 96));
    r.add(txt(this, 316, 136, `${p.name}`, { fontSize: '26px', fontStyle: 'bold' }));
    r.add(txt(this, 316, 172, `白头鹎 · Lv.${p.lv}`, { fontSize: '17px', color: '#d8d0bc' }));
    r.add(txt(this, 316, 196, `经验 ${p.exp}/${expToNext(p.lv)}`, { fontSize: '15px', color: '#a8a290' }));
    const lines = [
      `体力  ${p.hp} / ${p.maxHp}`,
      `气    ${p.mp} / ${p.maxMp}`,
      `攻击 ${p.atk}    防御 ${p.def}    速度 ${p.spd}`,
      `技能  ${p.skills.map(s => SKILLS[s].name).join('、')}`,
    ];
    r.add(txt(this, 206, 250, lines.join('\n'), {
      fontSize: '18px', lineSpacing: 12, wordWrap: { width: 310, useAdvancedWrap: true },
    }));
  }

  async questMenu() {
    const s = this.state;
    const list = QUESTS.map(q => ({ q, st: q.status(s) })).filter(x => x.st);
    const r = this.add.container(0, 0).setDepth(1150);
    if (this.statusRoot) this.statusRoot.setVisible(false);
    r.add(panel(this, 180, 70, 600, 400, { alpha: 1 }));
    r.add(txt(this, 204, 86, '任务', { fontSize: '22px', color: '#f2c14e', fontStyle: 'bold' }));
    const body = list.length ? list.map(({ q, st }) =>
      `${st === 'done' ? '✔' : '◆'} ${q.name}${st === 'done' ? '（完成）' : ''}\n   ${st === 'done' ? q.doneText || '' : q.hint(s)}`).join('\n\n')
      : '还没有接到任务。到处找人聊聊天吧。';
    r.add(txt(this, 204, 126, body, {
      fontSize: '16px', lineSpacing: 6, wordWrap: { width: 550, useAdvancedWrap: true },
    }));
    r.add(txt(this, 756, 446, '按任意键返回', { fontSize: '13px', color: '#a8a290' }).setOrigin(1, 1));
    await new Promise(resolve => {
      const opened = this.time.now;
      const close = () => {
        if (this.time.now - opened < 200) return;
        this.input.keyboard.off('keydown', close);
        this.input.off('pointerdown', close);
        resolve();
      };
      this.input.keyboard.on('keydown', close);
      this.input.on('pointerdown', close);
    });
    r.destroy();
    if (this.statusRoot) this.statusRoot.setVisible(true);
  }

  async itemMenu() {
    while (true) {
      const ids = Object.keys(this.state.items).filter(id => this.state.items[id] > 0);
      if (!ids.length) { this.toast('什么道具都没有'); return; }
      const hint = txt(this, 180, 452, '', {
        fontSize: '16px', color: '#d8d0bc', backgroundColor: '#1b1f2acc', padding: { x: 10, y: 6 },
        wordWrap: { width: 580, useAdvancedWrap: true },
      }).setDepth(1200);
      const i = await new Menu(this, {
        x: 560, y: 110, w: 260, title: '道具',
        items: ids.map(id => ({ label: `${ITEMS[id].name} ×${this.state.items[id]}`, disabled: ITEMS[id].battleOnly || ITEMS[id].key })),
        onHover: k => hint.setText(ITEMS[ids[k]].desc),
      }).open();
      hint.destroy();
      if (i < 0) return;
      const id = ids[i];
      const p = this.state.player;
      const full = ITEMS[id].use === 'heal' ? p.hp >= p.maxHp : p.mp >= p.maxMp;
      if (full) { this.toast(ITEMS[id].use === 'heal' ? '体力已经是满的了' : '气已经是满的了'); continue; }
      const res = useItem(this.state, p, null, id);
      sfx(this, 'sfx_heal');
      this.toast(res.lines[1]);
      this.drawStatus();
      this.refreshHUD();
    }
  }

  // ---------- 手机触控 ----------
  setupTouch() {
    if (!this.sys.game.device.input.touch) return;
    const base = this.add.circle(120, 420, 60, 0xffffff, 0.1).setStrokeStyle(2, 0xffffff, 0.3);
    const thumb = this.add.circle(120, 420, 26, 0xffffff, 0.35);
    const home = { x: 120, y: 420 };
    const btnA = this.add.circle(860, 430, 46, 0xf2c14e, 0.3).setStrokeStyle(3, 0xf2c14e, 0.8).setInteractive();
    txt(this, 860, 430, '互动', { fontSize: '20px' }).setOrigin(0.5);
    const btnMenu = this.add.circle(860, 320, 30, 0xffffff, 0.15).setStrokeStyle(2, 0xffffff, 0.5).setInteractive();
    txt(this, 860, 320, '菜单', { fontSize: '15px' }).setOrigin(0.5);

    btnA.on('pointerdown', () => { if (!this.busy) this.game.events.emit('action'); });
    btnMenu.on('pointerdown', () => { if (!this.busy) this.game.events.emit('menu'); });

    let joyId = null;
    const reset = () => {
      joyId = null;
      base.setPosition(home.x, home.y);
      thumb.setPosition(home.x, home.y);
      this.registry.set('joy', { x: 0, y: 0 });
    };
    this.input.on('pointerdown', p => {
      if (joyId !== null || this.busy || p.x > GAME_W * 0.5 || p.y < 120) return;
      joyId = p.id;
      base.setPosition(p.x, p.y);
      thumb.setPosition(p.x, p.y);
    });
    this.input.on('pointermove', p => {
      if (p.id !== joyId) return;
      const dx = p.x - base.x, dy = p.y - base.y;
      const len = Math.hypot(dx, dy);
      const k = len > 50 ? 50 / len : 1;
      thumb.setPosition(base.x + dx * k, base.y + dy * k);
      this.registry.set('joy', len < 8 ? { x: 0, y: 0 } : { x: (dx * k) / 50, y: (dy * k) / 50 });
    });
    this.input.on('pointerup', p => { if (p.id === joyId) reset(); });
    this.events.on('sleep', reset);
  }
}
