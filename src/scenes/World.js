import { TILE, WORLD_ZOOM, PLAYER_SPEED, ENCOUNTER_RATE, ENCOUNTER_GRACE } from '../config.js';
import { indexGrid, solidIndices, mapW, mapH, TALL_GRASS, tileIndexAt, placeAt } from '../data/map.js';
import { MAPS, migrateOldChengdu } from '../data/maps/index.js';
import { INTRO, lose, objective } from '../data/story.js';
import { chatter } from '../data/companion.js';
import { ITEMS } from '../data/items.js';
import { CODEX_BY_ID } from '../data/codex.js';
import { SKILLS } from '../data/skills.js';
import { zoneAt, rollEncounter } from '../data/encounters.js';
import { addItem, saveState } from '../state.js';
import { playMusic, sfx } from '../systems/audio.js';
import { txt } from '../ui/widgets.js';

const DIRS = { down: [0, 1], left: [-1, 0], right: [1, 0], up: [0, -1] };
const ROW = { down: 0, left: 1, right: 2, up: 3 };
const STOP = 'stop'; // 剧情里切换地图后，后面的步骤不再执行

export default class World extends Phaser.Scene {
  constructor() { super('World'); }

  create() {
    this.state = this.registry.get('state');
    const s = this.state;
    migrateOldChengdu(s);
    if (!MAPS[s.map]) { s.map = 'park'; s.pos = { ...MAPS.park.start }; }
    this.map = MAPS[s.map];
    s.flags[`visit_${s.map}`] = true;
    this.locked = true;
    this.ready = false;
    this.warping = false;
    this.facing = s.facing || 'down';
    delete s.facing;
    this.steps = 0;
    this.grassDist = 0;
    this.place = null;
    this.lastTile = '';
    this.trail = [];

    // 地图
    const tm = this.make.tilemap({ data: indexGrid(this.map), tileWidth: TILE, tileHeight: TILE });
    const tiles = tm.addTilesetImage('tiles', 'tiles', TILE, TILE, 1, 2);
    this.layer = tm.createLayer(0, tiles, 0, 0);
    this.layer.setCollision(solidIndices());
    const W = mapW(this.map) * TILE, H = mapH(this.map) * TILE;
    this.physics.world.setBounds(0, 0, W, H);

    // 白果
    this.makeAnims();
    const { x, y } = s.pos;
    this.player = this.physics.add.sprite(x * TILE + 16, y * TILE + 16, 'player', 0);
    this.player.body.setSize(16, 12).setOffset(8, 18);
    this.player.setFrame(ROW[this.facing] * 3);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);

    // 地标大图（鹤鸣茶社、祭坛……）：图片底边对齐占地范围的底边；solid 的占地范围挡路，能被调查
    // deco：装饰小物件（茶桌、灯笼……），不挡路，没有图就不显示
    this.propBodies = this.physics.add.staticGroup();
    for (const p of this.map.props || []) {
      if (p.deco && !this.textures.exists(p.key)) continue;
      const left = p.x * TILE, bottom = (p.y + p.h) * TILE;
      const img = this.add.image(left + (p.w * TILE) / 2, bottom, p.key).setOrigin(0.5, 1);
      img.setDepth(p.solid || p.deco ? bottom : p.over ? 99990 : 1);
      if (p.solid) {
        const zone = this.add.zone(left + (p.w * TILE) / 2, p.y * TILE + (p.h * TILE) / 2, p.w * TILE, p.h * TILE);
        this.propBodies.add(zone);
        zone.npc = { name: p.name, script: p.script || (() => [{ say: '', text: `这里是${p.name}。` }]) };
        zone.sprite = img;
      }
    }
    this.physics.add.collider(this.player, this.propBodies);

    // NPC：贴图只负责显示，碰撞用一个 28×28 的隐形方块。随剧情出现/消失，见 refreshNpcs()
    this.npcBodies = this.physics.add.staticGroup();
    this.bumpNow = false;
    this.bumpPrev = false;
    this.physics.add.collider(this.player, this.npcBodies, (_, zone) => {
      this.bumpNow = true;
      if (zone.npc.bump && !this.bumpPrev && !this.locked) this.runScript(zone.npc.script(this.state));
    });
    this.refreshNpcs();

    // 同行的噪噪：跟在白果身后
    this.follower = this.add.image(this.player.x, this.player.y + 16, 'npc_zaozao').setOrigin(0.5, 1).setVisible(false);

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

    // 界面场景只启动一次；换地图时 World 重启，界面留着
    this.ui = this.scene.get('UI');
    if (this.scene.isActive('UI') || this.scene.isSleeping('UI')) {
      this.time.delayedCall(10, () => this.begin());
    } else {
      this.scene.launch('UI');
      this.ui.events.once('create', () => this.begin());
    }
  }

  begin() {
    this.ready = true;
    this.locked = false;
    this.refreshAtmosphere();
    this.ui.setObjective(objective(this.state));
    this.ui.showPlace(placeAt(this.map, this.state.pos.x, this.state.pos.y));
    playMusic(this, this.map.music || 'bgm_world');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    // 换地图前剧情里还没走完的步骤（{ warp, then }）
    const pending = this.registry.get('pendingScript');
    this.registry.set('pendingScript', null);
    if (pending && pending.length) return this.runScript(pending);
    if (this.map.id === 'park' && !this.state.flags.p_wake && !this.state.flags.intro_done) return this.runScript(INTRO);
    if (this.map.onEnter) {
      const steps = this.map.onEnter(this.state);
      if (steps && steps.length) this.runScript(steps);
    }
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

  // 按剧情标记决定哪些 NPC 在场（npc.when(state)），每段剧情结束后重算一次
  refreshNpcs() {
    for (const z of this.npcBodies.getChildren()) z.sprite.destroy();
    this.npcBodies.clear(true, true);
    for (const n of this.map.npcs || []) {
      if (n.when && !n.when(this.state)) continue;
      const cx = n.x * TILE + 16, cy = n.y * TILE + 16;
      const spr = this.add.image(cx, cy + 16, n.sprite).setOrigin(0.5, 1).setDepth(cy + 16);
      if (n.flip) spr.setFlipX(true);
      if ((n.size || 32) > 32) {
        this.tweens.add({ targets: spr, y: spr.y - 3, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      const zone = this.add.zone(cx, cy, 28, 28);
      this.npcBodies.add(zone);
      zone.npc = n;
      zone.sprite = spr;
    }
  }

  refreshAtmosphere() {
    const m = this.map;
    this.ui.setAtmosphere({
      mood: m.mood ? m.mood(this.state) : null,
      fog: m.fog ? m.fog(this.state) : 0,
    });
  }

  update(time, delta) {
    this.bumpPrev = this.bumpNow;
    this.bumpNow = false;
    // 换地图淡出的这几帧里不要再记位置，不然会把出口那一格存成新地图的落脚点
    if (!this.ready || this.warping) return;

    const p = this.player;
    const tx = Math.floor(p.x / TILE), ty = Math.floor((p.y + 10) / TILE);
    this.state.pos = { x: tx, y: ty };
    p.setDepth(p.y + 16);
    this.updateFollower();

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
    if (len > 0.2) {
      if (len > 1) { vx /= len; vy /= len; }
      p.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);
      this.facing = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'left' : 'right') : (vy < 0 ? 'up' : 'down');
      p.anims.play(`walk-${this.facing}`, true);
    } else {
      p.setVelocity(0, 0);
      p.anims.stop();
      p.setFrame(ROW[this.facing] * 3);
    }

    // 走进新的一格：地名、踩点奇遇
    const key = `${tx},${ty}`;
    if (key !== this.lastTile) {
      this.lastTile = key;
      const place = placeAt(this.map, tx, ty);
      if (place !== this.place) {
        if (this.place !== null) this.ui.showPlace(place);
        this.place = place;
      }
      if (this.checkTriggers(tx, ty)) return;
    }

    // 高草丛遇怪
    if (p.body.speed > 10 && tileIndexAt(this.map, tx, ty) === TALL_GRASS && this.state.flags.intro_done) {
      this.grassDist += (p.body.speed * delta) / 1000;
      if (this.grassDist >= TILE) {
        this.grassDist -= TILE;
        this.steps += 1;
        if (this.steps > ENCOUNTER_GRACE && Math.random() < ENCOUNTER_RATE) {
          const enc = rollEncounter(zoneAt(this.map, tx, ty));
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

  checkTriggers(tx, ty) {
    const s = this.state;
    // 出口：走到地图边上的出口格子，就换到相邻的那张图（沿着出口方向保持偏移）
    for (const e of this.map.exits || []) {
      if (tx < e.x0 || tx > e.x1 || ty < e.y0 || ty > e.y1) continue;
      if (e.when && !e.when(s)) {
        if (e.blocked) this.runScript(e.blocked(s));
        continue;
      }
      this.goTo(e.to, e.tx + (tx - e.x0), e.ty + (ty - e.y0));
      return true;
    }
    for (const t of this.map.triggers || []) {
      if (tx < t.x0 || tx > t.x1 || ty < t.y0 || ty > t.y1) continue;
      const once = t.once !== false;
      if (once && s.flags[`trig_${t.id}`]) continue;
      if (t.when && !t.when(s)) continue;
      if (once) s.flags[`trig_${t.id}`] = true;
      this.runScript(t.script(s));
      return true;
    }
    return false;
  }

  updateFollower() {
    const on = !!this.state.flags.zaozao_party;
    this.follower.setVisible(on);
    if (!on) return;
    const p = this.player;
    const last = this.trail[this.trail.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 2) this.trail.push({ x: p.x, y: p.y });
    if (this.trail.length > 40) this.trail.shift();
    const target = this.trail.length > 12 ? this.trail[this.trail.length - 12] : { x: p.x - 18, y: p.y };
    const f = this.follower;
    if (Math.abs(target.x - f.x) > 0.5) f.setFlipX(target.x < f.x);
    f.setPosition(target.x, target.y + 16).setDepth(target.y + 15);
  }

  // 面前（NPC 或可调查的地标）。按到碰撞方块边缘的距离算，大地标也能从侧面调查
  npcInFront(range = 34) {
    const [dx, dy] = DIRS[this.facing];
    const px = this.player.x + dx * 20, py = this.player.y + 6 + dy * 20;
    let best = null, bd = range;
    for (const z of [...this.npcBodies.getChildren(), ...this.propBodies.getChildren()]) {
      // NPC 按中心点算；地标很大，按到边缘的距离算
      const big = z.width > 28 || z.height > 28;
      const hw = big ? z.width / 2 : 0, hh = big ? z.height / 2 : 0;
      const cx = Phaser.Math.Clamp(px, z.x - hw, z.x + hw), cy = Phaser.Math.Clamp(py, z.y - hh, z.y + hh);
      const d = Phaser.Math.Distance.Between(px, py, cx, cy) + (big ? 4 : 0);
      if (d < bd) { bd = d; best = z; }
    }
    return best;
  }

  // 走出地图边缘，去相邻的地图
  goTo(map, x, y) {
    this.locked = true;
    this.player.setVelocity(0, 0);
    this.warping = true;
    const s = this.state;
    s.map = map;
    s.pos = { x, y };
    s.facing = this.facing;
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { saveState(s); this.scene.restart(); });
  }

  onAction() {
    if (!this.ready || this.locked || this.ui.busy || this.time.now - this.ui.lastClose < 200) return;
    const z = this.npcInFront();
    if (z) return this.runScript(z.npc.script(this.state));
    // 前面没人，就跟同行的噪噪聊两句
    if (this.state.flags.zaozao_party) {
      const place = placeAt(this.map, this.state.pos.x, this.state.pos.y);
      this.runScript(chatter(this.state, place));
    }
  }

  async onMenu() {
    if (!this.ready || this.locked || this.ui.busy || this.time.now - this.ui.lastClose < 200) return;
    this.locked = true;
    await this.ui.openMenu();
    this.locked = false;
  }

  // ---------- 剧情脚本（步骤说明见 src/data/dsl.js） ----------
  async runScript(steps) {
    if (this.locked) return;
    this.locked = true;
    this.player.setVelocity(0, 0);
    try {
      await this.exec(steps);
    } catch (e) {
      console.error('[剧情脚本出错]', e);
    } finally {
      if (!this.warping) {
        this.locked = false;
        this.ui.lastClose = this.time.now;
        this.ui.refreshHUD();
        this.ui.setObjective(objective(this.state));
        this.refreshNpcs();
        this.refreshAtmosphere();
      }
    }
  }

  check(cond) {
    const s = this.state;
    if (typeof cond === 'function') return !!cond(s);
    if (typeof cond === 'string') return cond.startsWith('!') ? !s.flags[cond.slice(1)] : !!s.flags[cond];
    return !!cond;
  }

  async exec(steps) {
    const s = this.state;
    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      let r;
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
      } else if (st.inc) {
        s.flags[st.inc] = (s.flags[st.inc] || 0) + (st.n || 1);
      } else if (st.codex) {
        if (!s.flags[`codex_${st.codex}`]) {
          s.flags[`codex_${st.codex}`] = true;
          sfx(this, 'sfx_confirm');
          this.ui.toast(`见闻录新增：《${CODEX_BY_ID[st.codex].title}》`);
        }
      } else if (st.unflag) {
        delete s.flags[st.unflag];
      } else if (st.give) {
        const n = st.n || 1;
        addItem(s, st.give, n);
        sfx(this, 'sfx_heal');
        await this.ui.dialogue([{ who: '', text: `获得了「${ITEMS[st.give].name}」×${n}！` }]);
      } else if (st.take) {
        addItem(s, st.take, -(st.n || 1));
        await this.ui.dialogue([{ who: '', text: `交出了「${ITEMS[st.take].name}」。` }]);
      } else if (st.learn) {
        if (!s.player.skills.includes(st.learn)) s.player.skills.push(st.learn);
        sfx(this, 'sfx_levelup');
        await this.ui.dialogue([{ who: '', text: `白果学会了「${SKILLS[st.learn].name}」！` }]);
      } else if (st.stat) {
        const p = s.player;
        const names = { maxHp: '体力上限', maxMp: '气上限', atk: '攻击', def: '防御', spd: '速度' };
        const lines = [];
        for (const [k, v] of Object.entries(st.stat)) {
          p[k] += v;
          if (k === 'maxHp') p.hp += v;
          if (k === 'maxMp') p.mp += v;
          lines.push({ who: '', text: `${names[k]}提升了 ${v}！` });
        }
        sfx(this, 'sfx_levelup');
        await this.ui.dialogue(lines);
      } else if (st.heal) {
        s.player.hp = s.player.maxHp;
        s.player.mp = s.player.maxMp;
        this.ui.refreshHUD();
      } else if (st.save) {
        saveState(s);
      } else if (st.battle) {
        const res = await this.startBattle(st);
        if (res === 'win') r = await this.exec(st.win || []);
        else if (res === 'lose') r = await this.exec(st.lose || lose(s));
        else r = await this.exec(st.flee || []);
      } else if ('if' in st) {
        r = await this.exec(this.check(st.if) ? (st.then || []) : (st.else || []));
      } else if (st.choice) {
        const opts = st.options.filter(o => !o.when || this.check(o.when));
        const k = await this.ui.choose(st.choice, opts.map(o => o.label), st.who);
        r = await this.exec(opts[k].then || []);
      } else if ('cg' in st) {
        await this.ui.showCG(st.cg, st.box);
      } else if (st.fx) {
        await this.fx(st);
      } else if (st.music) {
        playMusic(this, st.music);
      } else if (st.teleport) {
        const t = st.teleport === 'start' ? this.map.start : st.teleport;
        this.player.setPosition(t.x * TILE + 16, t.y * TILE + 16);
        this.trail = [];
        this.facing = 'down';
        this.player.setFrame(0);
      } else if (st.warp) {
        await this.fx({ fx: 'fadeOut' });
        await this.ui.showCG(null);
        s.map = st.warp.map;
        s.pos = { x: st.warp.x, y: st.warp.y };
        if (st.then) this.registry.set('pendingScript', st.then);
        saveState(s);
        this.warping = true;
        this.scene.restart();
        return STOP;
      } else if (st.wait) {
        await this.wait(st.wait);
      } else if (st.card) {
        await this.ui.showCard(st.card.title, st.card.sub || '');
      } else if (st.refresh) {
        this.refreshNpcs();
        this.refreshAtmosphere();
      }
      if (r === STOP) return STOP;
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

  startBattle({ battle, lv, bg, noFlee }) {
    return new Promise(resolve => {
      sfx(this, 'sfx_encounter');
      this.cameras.main.flash(300, 255, 255, 255);
      this.time.delayedCall(320, () => {
        this.player.setVelocity(0, 0);
        this.scene.sleep('UI');
        this.scene.launch('Battle', {
          enemy: battle, lv, bg, noFlee,
          onEnd: res => {
            this.scene.stop('Battle');
            this.scene.wake('UI');
            this.scene.resume();
            playMusic(this, this.map.music || 'bgm_world');
            this.steps = 0;
            resolve(res);
          },
        });
        this.scene.pause();
      });
    });
  }
}
