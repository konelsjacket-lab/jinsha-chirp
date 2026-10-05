import { GAME_W, GAME_H, COLORS } from '../config.js';
import { ENEMIES } from '../data/enemies.js';
import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import {
  makeEnemy, performMove, useItem, chooseEnemyMove, playerFirst, fleeChance, tickStatus, gainExp, companionAssist,
} from '../systems/battle.js';
import { addItem } from '../state.js';
import { txt, panel, bar } from '../ui/widgets.js';
import { DialogBox } from '../ui/DialogBox.js';
import { Menu } from '../ui/Menu.js';
import { playMusic, sfx } from '../systems/audio.js';

const DROPS = [['tangyou', 0.12], ['bingfen', 0.08]];

export default class Battle extends Phaser.Scene {
  constructor() { super('Battle'); }

  init(data) { this.opts = data; }

  create() {
    this.state = this.registry.get('state');
    this.p = this.state.player;
    this.p.status = {};
    this.p.defending = false;
    const base = ENEMIES[this.opts.enemy];
    this.e = makeEnemy(base, this.opts.lv ?? base.lv);
    this.boss = !!base.boss || !!this.opts.noFlee;
    this.party = !!this.state.flags.zaozao_party;

    this.add.image(GAME_W / 2, GAME_H / 2, this.opts.bg || 'bg_park').setDisplaySize(GAME_W, GAME_H);
    this.eSprite = this.add.image(700, 305, this.e.sprite).setOrigin(0.5, 1).setScale((base.scale || 1) * (this.boss ? 1.5 : 1.3));
    if (base.tint) this.eSprite.setTint(base.tint);
    this.baseTint = base.tint;
    if (this.party && this.textures.exists('npc_zaozao')) {
      this.ally = this.add.image(120, 430, 'npc_zaozao').setOrigin(0.5, 1).setScale(2.2);
      this.tweens.add({ targets: this.ally, y: 424, duration: 500, yoyo: true, repeat: -1 });
    }
    this.pSprite = this.add.image(250, 425, 'battle_player').setOrigin(0.5, 1).setScale(1.4);
    this.tweens.add({ targets: this.eSprite, y: this.eSprite.y - 6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.pSprite, y: this.pSprite.y - 4, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // 双方信息
    panel(this, 24, 22, 330, 78);
    this.eName = txt(this, 40, 32, '', { fontSize: '20px', fontStyle: 'bold' });
    this.eHpText = txt(this, 300, 64, '', { fontSize: '14px', color: '#cfe8c9' }).setOrigin(1, 0);
    panel(this, 600, 286, 336, 86);
    this.pName = txt(this, 616, 294, '', { fontSize: '20px', fontStyle: 'bold' });
    this.pHpText = txt(this, 920, 322, '', { fontSize: '14px', color: '#cfe8c9' }).setOrigin(1, 0);
    this.pMpText = txt(this, 920, 344, '', { fontSize: '14px', color: '#c4def3' }).setOrigin(1, 0);
    this.bars = this.add.graphics();

    this.log = new DialogBox(this, { x: 20, y: 412, w: 600, h: 116, portraits: false, persist: true });
    this.refresh();

    playMusic(this, this.boss ? 'bgm_boss' : 'bgm_battle');
    this.cameras.main.fadeIn(250);
    this.run();
  }

  refresh() {
    const { p, e } = this;
    this.eName.setText(`${e.name}  Lv.${e.lv}`);
    this.eHpText.setText(`${e.hp}/${e.maxHp}`);
    this.pName.setText(`${p.name}  Lv.${p.lv}`);
    this.pHpText.setText(`体力 ${p.hp}/${p.maxHp}`);
    this.pMpText.setText(`气 ${p.mp}/${p.maxMp}`);
    this.bars.clear();
    bar(this.bars, 40, 66, 200, 12, e.hp / e.maxHp, e.hp / e.maxHp < 0.3 ? 0xe0594a : COLORS.hp);
    bar(this.bars, 616, 326, 200, 12, p.hp / p.maxHp, p.hp / p.maxHp < 0.3 ? 0xe0594a : COLORS.hp);
    bar(this.bars, 616, 348, 200, 9, p.mp / p.maxMp, COLORS.mp);
  }

  say(...texts) {
    return this.log.play(texts.map(text => ({ who: '', text })), { auto: 900 });
  }

  wait(ms) { return new Promise(r => this.time.delayedCall(ms, r)); }

  // ---------- 主流程 ----------
  async run() {
    await this.say(this.e.intro || `${this.e.name}出现了！`);
    while (true) {
      this.p.defending = false;
      this.e.defending = false;
      const act = await this.chooseAction();
      let over = false;

      if (act.type === 'flee') {
        if (this.boss) {
          await this.say(`${this.e.name}挡住了去路，逃不掉！`);
        } else if (Math.random() < fleeChance(this.p, this.e)) {
          await this.say(`${this.p.name}拍拍翅膀，溜了！`);
          return this.finish('flee');
        } else {
          await this.say('没跑掉！');
        }
        over = await this.enemyTurn();
      } else if (act.type === 'defend') {
        this.p.defending = true;
        await this.say(`${this.p.name}收起羽毛，摆好了架势。`);
        over = await this.enemyTurn();
      } else if (act.type === 'item') {
        const res = useItem(this.state, this.p, this.e, act.id);
        await this.animate(this.p, this.e, res);
        await this.say(...res.lines);
        over = (await this.checkEnd()) || (await this.enemyTurn());
      } else {
        const move = SKILLS[act.id];
        if (playerFirst(this.p, this.e)) {
          over = (await this.act(this.p, this.e, move)) || (await this.enemyTurn());
        } else {
          over = (await this.enemyTurn()) || (await this.act(this.p, this.e, move));
        }
      }
      if (over) return;

      if (this.party) {
        const res = companionAssist(this.p, this.e);
        if (res) {
          if (this.ally) this.tweens.add({ targets: this.ally, x: this.ally.x + 30, duration: 120, yoyo: true });
          if (res.type === 'damage') this.popup(this.eSprite, `-${res.amount}`, '#ffffff');
          if (res.type === 'heal') this.popup(this.pSprite, `+${res.amount}`, '#8fff8f');
          this.refresh();
          await this.say(...res.lines);
          if (await this.checkEnd()) return;
        }
      }

      const ticks = [...tickStatus(this.p), ...tickStatus(this.e)];
      if (ticks.length) await this.say(...ticks);
    }
  }

  async chooseAction() {
    while (true) {
      this.log.setText(`${this.p.name}要怎么做？`);
      const usable = Object.keys(this.state.items).filter(id => !ITEMS[id].key);
      const hasItems = usable.length > 0;
      const i = await new Menu(this, {
        x: 636, w: 300, bottom: 528, cancelable: false, itemH: 30,
        items: [{ label: '技能' }, { label: '道具', disabled: !hasItems }, { label: '收羽防御' }, { label: '逃跑' }],
      }).open();
      if (i === 0) {
        const ids = this.p.skills;
        const j = await new Menu(this, {
          x: 636, w: 300, bottom: 528, itemH: 30,
          items: ids.map(id => ({
            label: `${SKILLS[id].name}${SKILLS[id].mp ? `  ${SKILLS[id].mp}气` : ''}`,
            disabled: this.p.mp < SKILLS[id].mp,
          })),
          onHover: k => this.log.setText(SKILLS[ids[k]].desc),
        }).open();
        if (j >= 0) return { type: 'skill', id: ids[j] };
      } else if (i === 1) {
        const ids = usable;
        const j = await new Menu(this, {
          x: 636, w: 300, bottom: 528, itemH: 30,
          items: ids.map(id => ({ label: `${ITEMS[id].name} ×${this.state.items[id]}` })),
          onHover: k => this.log.setText(ITEMS[ids[k]].desc),
        }).open();
        if (j >= 0) return { type: 'item', id: ids[j] };
      } else if (i === 2) {
        return { type: 'defend' };
      } else {
        return { type: 'flee' };
      }
    }
  }

  async act(user, target, move) {
    const res = performMove(user, target, move);
    await this.animate(user, target, res, move);
    await this.say(...res.lines);
    return this.checkEnd();
  }

  async enemyTurn() {
    return this.act(this.e, this.p, chooseEnemyMove(this.e));
  }

  async checkEnd() {
    if (this.e.hp <= 0) { await this.win(); return true; }
    if (this.p.hp <= 0) { await this.lose(); return true; }
    return false;
  }

  async win() {
    sfx(this, 'sfx_levelup', 0.5);
    this.tweens.killTweensOf(this.eSprite);
    this.tweens.add({ targets: this.eSprite, alpha: 0, y: this.eSprite.y + 20, duration: 500 });
    await this.say(`${this.e.name}被打败了！`);
    const { lines, leveled } = gainExp(this.p, this.e.exp);
    if (leveled) {
      sfx(this, 'sfx_levelup');
      this.cameras.main.flash(400, 242, 193, 78);
    }
    this.refresh();
    await this.say(...lines);
    if (!this.boss) {
      for (const [id, chance] of this.e.drop ? [this.e.drop, ...DROPS] : DROPS) {
        if (Math.random() < chance) {
          addItem(this.state, id);
          await this.say(`${this.e.name}掉下了「${ITEMS[id].name}」！`);
          break;
        }
      }
    }
    this.finish('win');
  }

  async lose() {
    this.tweens.killTweensOf(this.pSprite);
    this.tweens.add({ targets: this.pSprite, alpha: 0.3, angle: 80, duration: 600 });
    await this.say(`${this.p.name}眼前一黑……`);
    this.finish('lose');
  }

  finish(result) {
    this.p.status = {};
    this.p.defending = false;
    this.cameras.main.fadeOut(300);
    this.time.delayedCall(320, () => this.opts.onEnd(result));
  }

  // ---------- 表现 ----------
  async animate(user, target, res, move) {
    const isPlayer = user === this.p;
    const uS = isPlayer ? this.pSprite : this.eSprite;
    const tS = isPlayer ? this.eSprite : this.pSprite;
    if (res.type === 'damage' || res.type === 'throw') {
      const dir = isPlayer ? 1 : -1;
      await new Promise(r => this.tweens.add({ targets: uS, x: uS.x + 40 * dir, duration: 110, yoyo: true, onComplete: r }));
      if (move && move === SKILLS.shine) {
        this.cameras.main.flash(350, 242, 193, 78);
        const glow = this.add.circle(tS.x, tS.y - tS.displayHeight / 2, 20, 0xf2c14e, 0.8);
        this.tweens.add({ targets: glow, radius: 120, alpha: 0, duration: 450, onComplete: () => glow.destroy() });
      }
      sfx(this, 'sfx_hit');
      tS.setTint(0xff7777);
      this.tweens.add({ targets: tS, x: tS.x + 8, duration: 50, yoyo: true, repeat: 2 });
      if (!isPlayer || res.crit) this.cameras.main.shake(res.crit ? 220 : 140, res.crit ? 0.012 : 0.006);
      this.popup(tS, `-${res.amount}`, res.crit ? '#ffd23f' : '#ffffff');
      await this.wait(260);
      tS === this.eSprite && this.baseTint ? tS.setTint(this.baseTint) : tS.clearTint();
    } else if (res.type === 'heal' || res.type === 'mp') {
      sfx(this, 'sfx_heal');
      uS.setTint(0x99ff99);
      this.popup(uS, `+${res.amount}`, res.type === 'mp' ? '#8fd0ff' : '#8fff8f');
      await this.wait(300);
      uS === this.eSprite && this.baseTint ? uS.setTint(this.baseTint) : uS.clearTint();
    } else if (res.type === 'buff') {
      sfx(this, 'sfx_heal');
      uS.setTint(0xffe08a);
      this.popup(uS, '↑', '#ffe08a');
      await this.wait(300);
      uS === this.eSprite && this.baseTint ? uS.setTint(this.baseTint) : uS.clearTint();
    } else if (res.type === 'debuff') {
      tS.setTint(0xb48cff);
      this.popup(tS, '↓', '#c9a6ff');
      await this.wait(300);
      tS === this.eSprite && this.baseTint ? tS.setTint(this.baseTint) : tS.clearTint();
    }
    this.refresh();
  }

  popup(sprite, text, color) {
    const t = txt(this, sprite.x, sprite.y - sprite.displayHeight * 0.7, text, {
      fontSize: '30px', fontStyle: 'bold', color, stroke: '#1b1f2a', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 800, ease: 'Cubic.easeOut', onComplete: () => t.destroy() });
  }
}
