import { TILE, WORLD_ZOOM, PLAYER_SPEED, ENCOUNTER_RATE, ENCOUNTER_GRACE } from '../config.js';
import { indexGrid, MAP_W, MAP_H, SOLID, TALL_GRASS, tileIndexAt, placeAt } from '../data/map.js';
import { NPCS } from '../data/npcs.js';
import { INTRO, LOSE, objective } from '../data/story.js';
import { ITEMS } from '../data/items.js';
import { SKILLS } from '../data/skills.js';
import { zoneAt, rollEncounter } from '../data/encounters.js';
import { addItem, saveState } from '../state.js';
import { playMusic, sfx } from '../systems/audio.js';
import { txt } from '../ui/widgets.js';

const DIRS = { down: [0, 1], left: [-1, 0], right: [1, 0], up: [0, -1] };
const ROW = { down: 0, left: 1, right: 2, up: 3 };

export default class World extends Phaser.Scene {
  constructor() { super('World'); }

  create() {
    this.state = this.registry.get('state');
    this.locked = true;
    this.facing = 'down';
    this.steps = 0;
    this.grassDist = 0;
    this.place = null;

    // 地图
    const map = this.make.tilemap({ data: indexGrid(), tileWidth: TILE, tileHeight: TILE });
    const tiles = map.addTilesetImage('tiles', 'tiles', TILE, TILE, 0, 0);
    this.layer = map.createLayer(0, tiles, 0, 0);
    this.layer.setCollision(SOLID);
    const W = MAP_W * TILE, H = MAP_H * TILE;
    this.physics.world.setBounds(0, 0, W, H);

    // 白果
    this.makeAnims();
    const { x, y } = this.state.pos;
    this.player = this.physics.add.sprite(x * TILE + 16, y * TILE + 16, 'player', 0);
    this.player.body.setSize(16, 12).setOffset(8, 18);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);

    // NPC：贴图只负责显示，碰撞用一个 28×28 的隐形方块
    this.npcBodies = this.physics.add.staticGroup();
    for (const n of NPCS) {
      const cx = n.x * TILE + 16, cy = n.y * TILE + 16;
      const spr = this.add.image(cx, cy + 16, n.sprite).setOrigin(0.5, 1).setDepth(cy + 16);
      if ((n.size || 32) > 32) {
        this.tweens.add({ targets: spr, y: spr.y - 3, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      const zone = this.add.zone(cx, cy, 28, 28);
      this.npcBodies.add(zone);
      zone.npc = n;
      zone.sprite = spr;
    }
    this.bumpNow = false;
    this.bumpPrev = false;
    this.physics.add.collider(this.player, this.npcBodies, (_, zone) => {
      this.bumpNow = true;
      if (zone.npc.bump && !this.bumpPrev && !this.locked) this.runScript(zone.npc.script(this.state));
    });

    this.bubble = txt(this, 0, 0, '…', {
      fontSize: '14px', color: '#1b1f2a', backgroundColor: '#f4efe2', padding: { x: 4, y: 0 },
    }).setOrigin(0.5, 1).setVisible(false).setDepth(99999);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, W, H).setZoom(WORLD_ZOOM).setRoundPixels(true);
    cam.startFollow(this.player, true, 0.15, 0.15);

    // 输入
    const kb = this.input.keyboard;
    this.cursors = kb.createCursorKeys();
    this.wasd = kb.addKeys('W,A,S,D');
    this.actionKeys = Object.values(kb.addKeys('SPACE,ENTER,Z'));
    this.menuKeys = Object.values(kb.addKeys('ESC,X,M'));
    const onAction = () => this.onAction();
    const onMenu = () => this.onMenu();
    this.game.events.on('action', onAction);
    this.game.events.on('menu', onMenu);
    this.events.once('shutdown', () => {
      this.game.events.off('action', onAction);
      this.game.events.off('menu', onMenu);
    });

    this.scene.launch('UI');
    this.ui = this.scene.get('UI');
    this.ui.events.once('create', () => this.begin());
  }

  begin() {
    this.ready = true;
    this.locked = false;
    this.ui.setObjective(objective(this.state));
    playMusic(this, 'bgm_world');
    if (!this.state.flags.intro_done) this.runScript(INTRO);
  }

  makeAnims() {
    if (this.anims.exists('walk-down')) return;
    for (const [dir, row] of Object.entries(ROW)) {
      this.anims.create({
        key: `walk-${dir}`, frameRate: 8, repeat: -1,
        frames: this.anims.generateFrameNumbers('player', { frames: [row * 3, row * 3 + 1, row * 3 + 2, row * 3 + 1] }),
      });
    }
  }

  update(time, delta) {
    this.bumpPrev = this.bumpNow;
    this.bumpNow = false;
    if (!this.ready) return;

    const p = this.player;
    const tx = Math.floor(p.x / TILE), ty = Math.floor((p.y + 10) / TILE);
    this.state.pos = { x: tx, y: ty };
    p.setDepth(p.y + 16);

    // 每帧都读一次，免得对话期间按下的键在对话结束后“补触发”
    const act = this.actionKeys.map(k => Phaser.Input.Keyboard.JustDown(k)).some(Boolean);
    const menu = this.menuKeys.map(k => Phaser.Input.Keyboard.JustDown(k)).some(Boolean);

    if (this.locked) {
      p.setVelocity(0, 0);
      p.anims.stop();
      this.bubble.setVisible(false);
      return;
    }
    if (act) return this.onAction();
    if (menu) return this.onMenu();

    // 移动：键盘 + 虚拟摇杆
    const joy = this.registry.get('joy') || { x: 0, y: 0 };
    const c = this.cursors, w = this.wasd;
    let vx = (c.right.isDown || w.D.isDown ? 1 : 0) - (c.left.isDown || w.A.isDown ? 1 : 0) + joy.x;
    let vy = (c.down.isDown || w.S.isDown ? 1 : 0) - (c.up.isDown || w.W.isDown ? 1 : 0) + joy.y;
    const len = Math.hypot(vx, vy);
    const moving = len > 0.2;
    if (moving) {
      if (len > 1) { vx /= len; vy /= len; }
      p.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);
      this.facing = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : (vy < 0 ? 'up' : 'down');
      p.anims.play(`walk-${this.facing}`, true);
    } else {
      p.setVelocity(0, 0);
      p.anims.stop();
      p.setFrame(ROW[this.facing] * 3);
    }

    // 地名
    const place = placeAt(tx, ty);
    if (place !== this.place) {
      if (this.place !== null) this.ui.showPlace(place);
      this.place = place;
    }

    // 高草丛遇怪
    const actuallyMoving = p.body.speed > 10;
    if (actuallyMoving && tileIndexAt(tx, ty) === TALL_GRASS && this.state.flags.intro_done) {
      this.grassDist += (p.body.speed * delta) / 1000;
      if (this.grassDist >= TILE) {
        this.grassDist -= TILE;
        this.steps += 1;
        if (this.steps > ENCOUNTER_GRACE && Math.random() < ENCOUNTER_RATE) {
          const enc = rollEncounter(zoneAt(tx, ty));
          this.runScript([{ battle: enc.enemy, lv: enc.lv, bg: enc.bg }]);
          return;
        }
      }
    }

    // 附近 NPC 头上冒个气泡
    const near = this.npcInFront(48);
    this.bubble.setVisible(!!near);
    if (near) this.bubble.setPosition(near.sprite.x, near.sprite.y - near.sprite.displayHeight - 2);
  }

  npcInFront(range = 34) {
    const [dx, dy] = DIRS[this.facing];
    const px = this.player.x + dx * 20, py = this.player.y + 6 + dy * 20;
    let best = null, bd = range;
    for (const z of this.npcBodies.getChildren()) {
      const d = Phaser.Math.Distance.Between(px, py, z.x, z.y);
      if (d < bd) { bd = d; best = z; }
    }
    return best;
  }

  onAction() {
    if (!this.ready || this.locked || this.ui.busy || this.time.now - this.ui.lastClose < 200) return;
    const z = this.npcInFront();
    if (z) this.runScript(z.npc.script(this.state));
  }

  async onMenu() {
    if (!this.ready || this.locked || this.ui.busy || this.time.now - this.ui.lastClose < 200) return;
    this.locked = true;
    await this.ui.openMenu();
    this.locked = false;
  }

  // ---------- 剧情脚本 ----------
  async runScript(steps) {
    if (this.locked) return;
    this.locked = true;
    this.player.setVelocity(0, 0);
    try {
      await this.exec(steps);
    } catch (e) {
      console.error('[剧情脚本出错]', e);
    } finally {
      this.locked = false;
      this.ui.lastClose = this.time.now;
      this.ui.refreshHUD();
      this.ui.setObjective(objective(this.state));
    }
  }

  async exec(steps) {
    const s = this.state;
    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      if ('say' in st) {
        // 连续的台词合并成一次对话
        const lines = [];
        while (i < steps.length && 'say' in steps[i]) {
          lines.push({ who: steps[i].say, text: steps[i].text });
          i++;
        }
        i--;
        await this.ui.dialogue(lines);
      } else if (st.flag) {
        s.flags[st.flag] = true;
      } else if (st.give) {
        const n = st.n || 1;
        addItem(s, st.give, n);
        sfx(this, 'sfx_heal');
        await this.ui.dialogue([{ who: '', text: `获得了「${ITEMS[st.give].name}」×${n}！` }]);
      } else if (st.learn) {
        if (!s.player.skills.includes(st.learn)) s.player.skills.push(st.learn);
        sfx(this, 'sfx_levelup');
        await this.ui.dialogue([{ who: '', text: `白果学会了「${SKILLS[st.learn].name}」！` }]);
      } else if (st.heal) {
        s.player.hp = s.player.maxHp;
        s.player.mp = s.player.maxMp;
        this.ui.refreshHUD();
      } else if (st.save) {
        saveState(s);
      } else if (st.battle) {
        const res = await this.startBattle(st);
        if (res === 'win') await this.exec(st.win || []);
        else if (res === 'lose') await this.exec(st.lose || LOSE);
      } else if ('if' in st) {
        await this.exec(s.flags[st.if] ? (st.then || []) : (st.else || []));
      } else if (st.fx) {
        await this.fx(st);
      } else if (st.music) {
        playMusic(this, st.music);
      } else if (st.teleport) {
        this.player.setPosition(st.teleport.x * TILE + 16, st.teleport.y * TILE + 16);
        this.facing = 'down';
        this.player.setFrame(0);
      } else if (st.wait) {
        await this.wait(st.wait);
      } else if (st.end) {
        s.flags.ch1_end = true;
        saveState(s);
        await this.ui.showCard('第一章 · 金沙之光　完', '第二章「青城白蛇」制作中……\n\n（可以继续在成都到处逛逛）');
      }
    }
  }

  wait(ms) {
    return new Promise(r => this.time.delayedCall(ms, r));
  }

  fx({ fx, color = 0xffffff }) {
    const cam = this.cameras.main;
    const r = (color >> 16) & 255, g = (color >> 8) & 255, b = color & 255;
    if (fx === 'flash') { cam.flash(600, r, g, b); return this.wait(600); }
    if (fx === 'shake') { cam.shake(350, 0.008); return this.wait(350); }
    if (fx === 'fadeOut') { cam.fadeOut(600, 0, 0, 0); return this.wait(650); }
    if (fx === 'fadeIn') { cam.fadeIn(700, 0, 0, 0); return this.wait(700); }
    return Promise.resolve();
  }

  startBattle({ battle, lv, bg }) {
    return new Promise(resolve => {
      sfx(this, 'sfx_encounter');
      this.cameras.main.flash(300, 255, 255, 255);
      this.time.delayedCall(320, () => {
        this.player.setVelocity(0, 0);
        this.scene.sleep('UI');
        this.scene.launch('Battle', {
          enemy: battle, lv, bg,
          onEnd: res => {
            this.scene.stop('Battle');
            this.scene.wake('UI');
            this.scene.resume();
            playMusic(this, 'bgm_world');
            this.steps = 0;
            resolve(res);
          },
        });
        this.scene.pause();
      });
    });
  }
}
