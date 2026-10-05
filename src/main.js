import { GAME_W, GAME_H } from './config.js';
import Boot from './scenes/Boot.js';
import Title from './scenes/Title.js';
import World from './scenes/World.js';
import UI from './scenes/UI.js';
import Battle from './scenes/Battle.js';

// 场景顺序 = 绘制顺序：越靠后越在上层
window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_W,
  height: GAME_H,
  backgroundColor: '#101418',
  render: { antialias: true, roundPixels: true },
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 3 },
  scene: [Boot, Title, World, UI, Battle],
});
