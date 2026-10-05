import { GAME_W, GAME_H } from './config.js';
import Boot from './scenes/Boot.js';
import Title from './scenes/Title.js';
import World from './scenes/World.js';
import UI from './scenes/UI.js';
import Battle from './scenes/Battle.js';

// 先等像素字体加载完，不然第一屏的字会先用系统字体画出来
const fontReady = document.fonts
  ? Promise.race([document.fonts.load('12px JinshaPixel', '金沙啾'), new Promise(r => setTimeout(r, 3000))])
  : Promise.resolve();
await fontReady;

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

// 手机转屏、进出全屏、地址栏收起时，浏览器给的尺寸会变；稍等一下再让画面重新铺满
const refit = () => setTimeout(() => window.game.scale.refresh(), 250);
window.addEventListener('resize', refit);
window.addEventListener('orientationchange', refit);
document.addEventListener('fullscreenchange', refit);
document.addEventListener('webkitfullscreenchange', refit);
if (window.visualViewport) window.visualViewport.addEventListener('resize', refit);
