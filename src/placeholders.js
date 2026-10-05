// 占位美术：全部用 Canvas 2D 现画。
// 真正的美术图放进 assets/img/ 后会自动替换掉这些（文件名和尺寸见 docs/ART_BRIEF.md）。
// 所有角色都在 32×32 的“单位格子”里画，再按需要放大。

const TAU = Math.PI * 2;

function ell(c, x, y, rx, ry, color, rot = 0) {
  c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill();
}
function circ(c, x, y, r, color) { ell(c, x, y, r, r, color); }
function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
function poly(c, pts, color) {
  c.fillStyle = color; c.beginPath(); c.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
  c.closePath(); c.fill();
}
function eye(c, x, y, r = 1.3) { circ(c, x, y, r, '#fff'); circ(c, x + r * 0.2, y, r * 0.55, '#111'); }

function mulberry32(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// 在 size×size 的区域里，以 32 单位坐标作画
// 敌人统一面朝左（对着白果），占位图里朝右画的要镜像一下
function mirrored(fn) { return c => { c.translate(32, 0); c.scale(-1, 1); fn(c); }; }

function unit(c, size, fn) {
  c.save(); c.scale(size / 32, size / 32); fn(c); c.restore();
}

// ---------- 白果（白头鹎） ----------
const BG = { back: '#7a8a4a', wing: '#5f7034', belly: '#ddd8c8', band: '#b9b29c', head: '#1d1d1f' };

function bulbulSide(c, flap = 0) {
  poly(c, [10, 19, 2, 15, 3, 23], '#56653a');            // 尾巴
  ell(c, 15, 19, 9, 7, BG.back);                          // 橄榄绿身体
  ell(c, 17, 22, 7, 4.5, BG.belly);                       // 灰白肚子
  ell(c, 13, 18 - flap * 2, 6, 3.5, BG.wing, -0.3 - flap * 0.5);
  circ(c, 22, 12, 6, BG.head);                            // 黑脑壳
  ell(c, 19.5, 9.5, 3.6, 2.8, '#fff', -0.4);              // 白头！
  ell(c, 21.5, 7.5, 2.8, 1.8, '#fff');
  circ(c, 23.8, 15.2, 1.6, '#f4f4f4');                    // 白耳斑
  eye(c, 24.6, 11.2);
  poly(c, [27, 11.4, 31, 12.8, 27, 14.2], '#2a2a2a');     // 嘴
  rect(c, 14, 25, 1, 4, '#333'); rect(c, 18, 25, 1, 4, '#333');
}

function bulbulFront(c, flap = 0, back = false) {
  ell(c, 8, 19 - flap * 2, 4, 6.5, BG.wing, -0.4 - flap * 0.4);
  ell(c, 24, 19 - flap * 2, 4, 6.5, BG.wing, 0.4 + flap * 0.4);
  if (back) poly(c, [13, 24, 19, 24, 16, 31], '#56653a');
  ell(c, 16, 20, 8, 8, back ? BG.back : BG.belly);
  if (!back) ell(c, 16, 16.5, 6.5, 2.8, BG.band);
  circ(c, 16, 10, 6.5, BG.head);
  if (back) {
    ell(c, 16, 9, 5, 4, '#fff');
  } else {
    ell(c, 16, 6, 4.2, 2.4, '#fff');
    eye(c, 13.2, 10.5); eye(c, 18.8, 10.5);
    poly(c, [14.6, 12.8, 17.4, 12.8, 16, 15.6], '#2a2a2a');
    circ(c, 10.6, 13, 1.3, '#f4f4f4'); circ(c, 21.4, 13, 1.3, '#f4f4f4');
  }
  rect(c, 13, 27, 1, 3, '#333'); rect(c, 18, 27, 1, 3, '#333');
}

// player.png：3 列 × 4 行，每帧 32×32。行：下、左、右、上；列：站立、扇翅、站立2
function paintPlayerFrame(c, col, row) {
  const flap = col === 1 ? 1 : 0;
  const bob = col === 1 ? -1.5 : 0;
  c.save(); c.translate(0, bob);
  if (row === 0) bulbulFront(c, flap, false);
  else if (row === 3) bulbulFront(c, flap, true);
  else {
    if (row === 1) { c.translate(32, 0); c.scale(-1, 1); }
    bulbulSide(c, flap);
  }
  c.restore();
}

// ---------- NPC ----------
function zaozao(c) { // 白颊噪鹛 / 土画眉
  poly(c, [9, 20, 1, 22, 4, 27], '#6e5a45');
  ell(c, 15, 20, 9, 7, '#8a7158');
  ell(c, 17, 23, 6.5, 4, '#b39a7d');
  ell(c, 13, 19, 6, 3.5, '#735d47', -0.3);
  circ(c, 22, 12, 6, '#7d6550');
  ell(c, 23, 14, 3.5, 2.5, '#f3efe6');                    // 白脸颊
  ell(c, 21, 10, 4, 1.2, '#f3efe6');                      // 白眉
  eye(c, 24.5, 11);
  poly(c, [27, 11.5, 30.5, 12.6, 27, 13.8], '#3a3a3a');
  rect(c, 14, 26, 1, 3, '#444'); rect(c, 18, 26, 1, 3, '#444');
}

function turtle(c) { // 龟大爷，背上驮着盖碗茶
  ell(c, 16, 22, 12, 7, '#4f7a3f');
  ell(c, 16, 20, 10, 7, '#6b9a52');
  c.strokeStyle = '#3e6131'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(10, 20); c.lineTo(22, 20); c.moveTo(16, 14); c.lineTo(16, 26); c.stroke();
  circ(c, 28, 20, 3.6, '#8fb37a'); eye(c, 29, 19, 1);
  ell(c, 6, 27, 3, 2, '#8fb37a'); ell(c, 24, 27, 3, 2, '#8fb37a');
  ell(c, 15, 12, 5, 1.5, '#f2efe8'); rect(c, 12, 9, 6, 3, '#f2efe8'); ell(c, 15, 9, 3.5, 1.2, '#cfe3d1');
}

function hoopoe(c) { // 戴胜
  poly(c, [10, 20, 2, 18, 3, 24], '#222');
  ell(c, 15, 20, 9, 7, '#e09a5a');
  for (let i = 0; i < 4; i++) rect(c, 8 + i * 3, 16, 1.6, 8, i % 2 ? '#222' : '#f4f4f4');
  circ(c, 22, 12, 5.5, '#e8a868');
  for (let i = 0; i < 5; i++) poly(c, [18 + i * 1.6, 9, 17 + i * 1.6, 2 + (i % 2), 20 + i * 1.6, 8], i % 2 ? '#e08a40' : '#f0a35e');
  eye(c, 23.5, 11.5);
  c.strokeStyle = '#333'; c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(26, 13); c.quadraticCurveTo(29.5, 14, 31.5, 17); c.stroke();
  rect(c, 14, 26, 1, 3, '#444'); rect(c, 18, 26, 1, 3, '#444');
}

function cuckoo(c) { // 杜鹃
  poly(c, [10, 18, 1, 20, 2, 25], '#4f5563');
  ell(c, 15, 19, 9, 6.5, '#6b7280');
  ell(c, 17, 22, 7, 4.5, '#e9e6df');
  c.strokeStyle = '#6b7280'; c.lineWidth = 0.7;
  for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(12 + i * 2, 20); c.lineTo(13 + i * 2, 25); c.stroke(); }
  circ(c, 22, 12, 5.5, '#6b7280');
  circ(c, 24.5, 11.2, 1.4, '#f2c14e'); circ(c, 24.7, 11.2, 0.7, '#111');
  poly(c, [27, 11.5, 30.5, 12.5, 27, 13.8], '#333');
  rect(c, 14, 25, 1, 4, '#444'); rect(c, 18, 25, 1, 4, '#444');
}

function panda(c) { // 食铁兽
  ell(c, 16, 22, 11, 9, '#f6f6f2');
  ell(c, 7, 22, 4, 6, '#1d1d1f'); ell(c, 25, 22, 4, 6, '#1d1d1f');
  ell(c, 11, 29, 4.5, 2.5, '#1d1d1f'); ell(c, 21, 29, 4.5, 2.5, '#1d1d1f');
  circ(c, 16, 11, 8, '#f6f6f2');
  circ(c, 9.5, 5, 3, '#1d1d1f'); circ(c, 22.5, 5, 3, '#1d1d1f');
  ell(c, 12.5, 11, 2.6, 3.2, '#1d1d1f', 0.5); ell(c, 19.5, 11, 2.6, 3.2, '#1d1d1f', -0.5);
  circ(c, 12.8, 10.8, 0.9, '#fff'); circ(c, 19.2, 10.8, 0.9, '#fff');
  ell(c, 16, 14.5, 1.8, 1.2, '#1d1d1f');
  rect(c, 23, 12, 2, 14, '#7fb04a'); ell(c, 27, 13, 3, 1.3, '#9ccc65', -0.5);
}

function sunbird(c) { // 太阳神鸟：十二道旋转光芒 + 金鸟（以 32 单位画，通常放大到 64）
  c.save(); c.translate(16, 16);
  circ(c, 0, 0, 15.5, 'rgba(242,193,78,0.25)');
  for (let i = 0; i < 12; i++) {
    c.save(); c.rotate(i * TAU / 12);
    poly(c, [0, -5, 3.5, -14.5, 1, -15, -1.8, -6], '#f2c14e');
    c.restore();
  }
  circ(c, 0, 0, 6, '#ffd86b'); circ(c, 0, 0, 3.2, '#fff3c4');
  c.restore();
  c.save(); c.translate(16, 16); c.rotate(-0.15);
  ell(c, 0, 2, 5, 2.4, '#ffcf3f');
  poly(c, [-3, 1, -10, -6, -1, -1], '#ffe17a'); poly(c, [3, 1, 10, -6, 1, -1], '#ffe17a');
  circ(c, 4.5, 0, 1.8, '#ffcf3f'); poly(c, [-5, 2, -9, 5, -5, 3.5], '#e6a92a');
  c.restore();
}

function rhino(c) { // 石犀
  ell(c, 15, 21, 12, 8, '#8d9399');
  ell(c, 15, 18, 11, 5, '#a3a9ae');
  circ(c, 26, 18, 6, '#8d9399');
  poly(c, [28, 13, 31, 6, 31, 14], '#c9cdd1');
  poly(c, [22, 12, 21, 8, 24, 11], '#8d9399');
  circ(c, 27, 16.5, 1, '#2b2f33');
  rect(c, 6, 26, 4, 5, '#7a8086'); rect(c, 12, 27, 4, 4, '#7a8086');
  rect(c, 18, 27, 4, 4, '#7a8086'); rect(c, 23, 26, 4, 5, '#7a8086');
  c.strokeStyle = '#6f757b'; c.lineWidth = 0.6;
  c.beginPath(); c.moveTo(8, 17); c.lineTo(11, 22); c.moveTo(14, 15); c.lineTo(16, 20); c.stroke();
}

function gate(c) { // 青城山石碑
  rect(c, 6, 4, 20, 26, '#6d6a62'); rect(c, 4, 2, 24, 4, '#57544d'); rect(c, 4, 28, 24, 3, '#57544d');
  c.fillStyle = '#e9e2cf'; c.font = 'bold 7px sans-serif'; c.textAlign = 'center';
  c.fillText('青', 16, 13); c.fillText('城', 16, 20); c.fillText('山', 16, 27);
}

// ---------- 怪物（以 32 单位画，放大到 128） ----------
function eSparrow(c) {
  poly(c, [9, 19, 2, 16, 3, 23], '#6b4e33');
  ell(c, 15, 19, 9, 7, '#8b6a46');
  ell(c, 17, 22, 7, 4.5, '#d9cdb8');
  ell(c, 12, 18, 6, 3.5, '#6b4e33', -0.3);
  for (let i = 0; i < 3; i++) rect(c, 9 + i * 3, 17, 1, 3, '#2f2418');
  circ(c, 22, 12, 6, '#7a4a2a'); ell(c, 23, 14, 3.5, 2.5, '#efe8da');
  circ(c, 24, 16.5, 1.6, '#222');
  eye(c, 24.5, 11, 1.5);
  poly(c, [22.5, 8.5, 27, 9.5, 23, 10.2], '#222'); // 凶眉
  poly(c, [27, 11.5, 31, 12.8, 27, 14], '#3a3a3a');
  rect(c, 14, 25, 1, 4, '#444'); rect(c, 18, 25, 1, 4, '#444');
}

function eMosquito(c) {
  c.strokeStyle = '#222'; c.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    c.beginPath(); c.moveTo(14 + i * 3, 20); c.lineTo(10 + i * 4, 30); c.stroke();
    for (let k = 0; k < 3; k++) rect(c, 11.5 + i * 4 + k * 0.6, 23 + k * 2.4, 1.2, 0.9, '#fff');
  }
  ell(c, 11, 10, 7, 3, 'rgba(200,220,255,0.6)', -0.5); ell(c, 19, 9, 7, 3, 'rgba(200,220,255,0.6)', 0.5);
  ell(c, 12, 18, 7, 3, '#333', 0.3);
  for (let i = 0; i < 3; i++) rect(c, 8 + i * 3, 16.5, 1.2, 3, '#ddd');
  circ(c, 20, 15, 3.5, '#333'); eye(c, 21, 14, 1.3);
  c.beginPath(); c.moveTo(22, 16); c.lineTo(30, 20); c.stroke();
}

function eMahjong(c) {
  rect(c, 7, 4, 18, 24, '#d8d2bf'); rect(c, 6, 3, 18, 24, '#f6f1e2');
  c.strokeStyle = '#2e7d4f'; c.lineWidth = 1; c.strokeRect(7.5, 4.5, 15, 21);
  c.fillStyle = '#c62828'; c.font = 'bold 13px serif'; c.textAlign = 'center'; c.fillText('中', 15, 18.5);
  eye(c, 11, 23, 1.4); eye(c, 19, 23, 1.4);
  rect(c, 4, 14, 2, 1.2, '#f6f1e2'); rect(c, 24, 14, 2, 1.2, '#f6f1e2');
  rect(c, 10, 27, 2, 4, '#f6f1e2'); rect(c, 18, 27, 2, 4, '#f6f1e2');
}

function eChili(c) {
  c.save(); c.translate(16, 17); c.rotate(0.35);
  ell(c, 0, 2, 6, 12, '#d62d20');
  ell(c, -2, -2, 2, 6, '#ff6b5a');
  poly(c, [-4, -9, 4, -9, 0, -14], '#3f8f2f'); rect(c, -0.8, -16, 1.6, 4, '#3f8f2f');
  c.restore();
  eye(c, 14, 15, 1.6); eye(c, 19.5, 16.5, 1.6);
  poly(c, [12, 12, 16, 13.5, 12.5, 13.5], '#4a0c08'); poly(c, [21.5, 13.5, 17.5, 14.5, 21, 15], '#4a0c08');
  c.strokeStyle = '#4a0c08'; c.lineWidth = 0.8;
  c.beginPath(); c.arc(17, 21, 2.5, 0.2, Math.PI - 0.2); c.stroke();
}

function eBambooRat(c) {
  ell(c, 15, 20, 12, 9, '#a07d5b');
  ell(c, 16, 23, 8, 5, '#c9a988');
  circ(c, 7, 11, 3, '#a07d5b'); circ(c, 7, 11, 1.6, '#e6b8a2');
  circ(c, 23, 11, 3, '#a07d5b'); circ(c, 23, 11, 1.6, '#e6b8a2');
  eye(c, 12, 16, 1.3); eye(c, 18, 16, 1.3);
  ell(c, 15, 19, 2, 1.4, '#e58b8b');
  rect(c, 13.5, 21, 1.4, 2, '#fff'); rect(c, 15.2, 21, 1.4, 2, '#fff');
  poly(c, [24, 18, 31, 6, 29, 20], '#e3d9a1'); poly(c, [25, 15, 31, 6, 28, 14], '#9ccc65');
}

function eWaterMonkey(c) {
  ell(c, 16, 21, 9, 8, '#4e6b66');
  circ(c, 16, 11, 7, '#4e6b66');
  ell(c, 16, 12.5, 5, 4, '#8fa8a0');
  circ(c, 9, 10, 2.5, '#4e6b66'); circ(c, 23, 10, 2.5, '#4e6b66');
  circ(c, 13.5, 11, 1.4, '#e8f04a'); circ(c, 18.5, 11, 1.4, '#e8f04a');
  circ(c, 13.5, 11, 0.6, '#111'); circ(c, 18.5, 11, 0.6, '#111');
  c.strokeStyle = '#2a3a37'; c.lineWidth = 0.8; c.beginPath(); c.arc(16, 14, 2, 0.2, Math.PI - 0.2); c.stroke();
  ell(c, 6, 21, 2.5, 6, '#4e6b66', 0.4); ell(c, 26, 21, 2.5, 6, '#4e6b66', -0.4);
  for (const [x, y] of [[8, 28], [14, 30], [22, 29], [26, 26]]) ell(c, x, y, 1, 1.6, '#7fc4e8');
  ell(c, 16, 30, 13, 2, 'rgba(90,169,230,0.6)');
}

// ---------- 图块 tiles.png：13 格 × 32px，一行 ----------
function paintTiles(c) {
  const T = 32;
  const r = mulberry32(42);
  const at = (i, fn) => { c.save(); c.translate(i * T, 0); c.beginPath(); c.rect(0, 0, T, T); c.clip(); fn(); c.restore(); };
  const grass = () => {
    rect(c, 0, 0, T, T, '#7cae5a');
    for (let k = 0; k < 14; k++) rect(c, Math.floor(r() * 31), Math.floor(r() * 31), 1, 2, k % 2 ? '#6c9c4c' : '#8fc06a');
  };
  at(0, grass);
  at(1, () => { // 高草丛
    rect(c, 0, 0, T, T, '#5e9444');
    for (let k = 0; k < 9; k++) {
      const x = 2 + (k % 3) * 10 + r() * 3, y = 6 + Math.floor(k / 3) * 9;
      poly(c, [x, y + 8, x + 2, y, x + 4, y + 8], '#3f7a2e');
      poly(c, [x + 3, y + 8, x + 6, y + 1, x + 7, y + 8], '#4e8a37');
    }
  });
  at(2, () => { // 路
    rect(c, 0, 0, T, T, '#cdb68a');
    for (let k = 0; k < 6; k++) ell(c, r() * 32, r() * 32, 2 + r() * 2, 1.5, '#b9a073');
  });
  at(3, () => { // 水
    rect(c, 0, 0, T, T, '#4f8fc0');
    c.strokeStyle = '#7fb4dc'; c.lineWidth = 1.5;
    for (const [x, y] of [[4, 8], [18, 16], [6, 25]]) { c.beginPath(); c.arc(x + 4, y, 4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  });
  at(4, () => { // 桥
    rect(c, 0, 0, T, T, '#4f8fc0');
    rect(c, 0, 0, T, T, '#9c6b3f');
    for (let x = 0; x < T; x += 6) rect(c, x, 0, 1, T, '#7d5230');
    rect(c, 0, 0, T, 3, '#5c3b20'); rect(c, 0, 29, T, 3, '#5c3b20');
  });
  at(5, () => { // 川西青瓦屋顶
    rect(c, 0, 0, T, T, '#4a5560');
    for (let y = 0; y < T; y += 5) rect(c, 0, y, T, 1, '#3a434c');
    for (let x = 0; x < T; x += 4) rect(c, x, 0, 1, T, '#56626e');
  });
  at(6, () => { grass(); rect(c, 14, 20, 4, 10, '#6b4a2b'); circ(c, 16, 14, 11, '#3e7a3a'); circ(c, 12, 11, 6, '#4f8f45'); });
  at(7, () => { grass(); rect(c, 14, 20, 4, 10, '#6b4a2b'); circ(c, 16, 14, 11, '#e2b93b'); circ(c, 12, 11, 6, '#f2d061'); for (let k = 0; k < 5; k++) circ(c, 6 + r() * 20, 6 + r() * 16, 1.4, '#c99a25'); });
  at(8, () => { // 石板
    rect(c, 0, 0, T, T, '#a9a59b');
    c.strokeStyle = '#8d897f'; c.lineWidth = 1; c.strokeRect(0.5, 0.5, 15, 15); c.strokeRect(16.5, 0.5, 15, 15);
    c.strokeRect(8.5, 16.5, 15, 15); c.strokeRect(-7.5, 16.5, 15, 15); c.strokeRect(24.5, 16.5, 15, 15);
  });
  at(9, () => { // 金沙金砖
    rect(c, 0, 0, T, T, '#c9a043');
    c.strokeStyle = '#a8822c'; c.lineWidth = 1; c.strokeRect(0.5, 0.5, 31, 31);
    c.strokeStyle = '#e6c46a'; c.beginPath(); c.arc(16, 16, 9, 0, TAU); c.stroke();
  });
  at(10, () => { grass(); for (let k = 0; k < 6; k++) { const x = 4 + r() * 24, y = 4 + r() * 24; circ(c, x, y, 3, k % 2 ? '#f4a6c0' : '#f7c6d6'); circ(c, x, y, 1, '#fff1a8'); } });
  at(11, () => { // 山石
    rect(c, 0, 0, T, T, '#6f7d68');
    poly(c, [0, 32, 10, 6, 20, 32], '#5d6a57'); poly(c, [12, 32, 24, 2, 34, 32], '#55624f');
    poly(c, [22, 8, 24, 2, 26, 8], '#e9ecef');
  });
  at(12, () => { // 竹林
    rect(c, 0, 0, T, T, '#5f9a48');
    for (const x of [3, 11, 19, 26]) {
      rect(c, x, 0, 3, T, '#7fb04a');
      for (let y = 4; y < T; y += 9) rect(c, x, y, 3, 1, '#4f7d2f');
      ell(c, x + 5, 6 + (x % 7), 4, 1.3, '#9ccc65', -0.5);
    }
  });
}

// ---------- 背景 960×540 ----------
function sky(c, w, h, top, bottom, ground, groundHi) {
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top); g.addColorStop(0.62, bottom); g.addColorStop(0.62, ground); g.addColorStop(1, groundHi);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
}
function platform(c, x, y, rx, ry, color) { ell(c, x, y, rx, ry, color); ell(c, x, y - 4, rx * 0.92, ry * 0.8, 'rgba(255,255,255,0.12)'); }

function makeBattleBg(top, bottom, ground, groundHi, deco) {
  return (c, w, h) => {
    sky(c, w, h, top, bottom, ground, groundHi);
    deco && deco(c, w, h);
    platform(c, 700, 300, 170, 34, 'rgba(0,0,0,0.18)');
    platform(c, 250, 420, 190, 38, 'rgba(0,0,0,0.18)');
  };
}

const ginkgoRow = (c, w) => { for (let x = 30; x < w; x += 110) { rect(c, x + 18, 250, 8, 85, '#5d4127'); circ(c, x + 22, 230, 46, '#d9b23a'); } };
const roofs = (c, w) => { for (let x = 0; x < w; x += 160) { poly(c, [x, 300, x + 80, 240, x + 160, 300], '#3e4852'); rect(c, x + 15, 300, 130, 35, '#8b7355'); } };
const bamboo = (c, w) => { for (let x = 10; x < w; x += 38) { rect(c, x, 80, 9, 260, '#6fa043'); for (let y = 100; y < 330; y += 40) rect(c, x, y, 9, 2, '#4f7d2f'); } };
const river = (c, w) => { rect(c, 0, 290, w, 46, '#4f8fc0'); for (let x = 0; x < w; x += 50) rect(c, x, 305 + (x % 3) * 8, 26, 2, '#8cc0e6'); };
const hills = (c, w) => { for (let x = -100; x < w; x += 260) poly(c, [x, 335, x + 150, 150, x + 300, 335], '#5d6f62'); };
const sunMotif = (c, w, h, alpha = 0.35) => {
  c.save(); c.translate(w / 2, h * 0.36); c.globalAlpha = alpha;
  for (let i = 0; i < 12; i++) { c.save(); c.rotate(i * TAU / 12); poly(c, [0, -40, 26, -130, 8, -134, -12, -46], '#f2c14e'); c.restore(); }
  circ(c, 0, 0, 44, '#f2c14e');
  c.restore();
};


// ---------- 第一章支线 / 第二章新角色（占位） ----------
function simpleBird(c, { body, belly, head, wing, beak = '#333', tail, crest, longBeak = false }) {
  poly(c, [10, 19, 1, 15, 2, 24], tail || wing);
  ell(c, 15, 19, 9, 7, body);
  ell(c, 17, 22, 7, 4.5, belly);
  ell(c, 13, 18, 6, 3.5, wing, -0.3);
  circ(c, 22, 12, 6, head);
  if (crest) crest(c);
  eye(c, 24, 11);
  if (longBeak) poly(c, [27, 11.5, 32, 13, 27, 14], beak);
  else poly(c, [27, 11.5, 30.5, 12.6, 27, 13.8], beak);
  rect(c, 14, 25, 1, 4, '#444'); rect(c, 18, 25, 1, 4, '#444');
}
const magpie = c => { simpleBird(c, { body: '#1e2230', belly: '#f2f2f2', head: '#14161e', wing: '#3d5a8a', tail: '#2c3f66' }); ell(c, 13, 18, 3, 2, '#f2f2f2'); };
const kingfisher = c => simpleBird(c, { body: '#2f8fc4', belly: '#e58a3a', head: '#2a7fb0', wing: '#3aa0d8', tail: '#2577a8', beak: '#1d1d1d', longBeak: true });
const axi = c => {
  circ(c, 16, 17, 13, 'rgba(242,193,78,0.25)');
  simpleBird(c, { body: '#ffcf3f', belly: '#fff0b0', head: '#ffd86b', wing: '#ffe17a', tail: '#f2b632', beak: '#c98a1a' });
};
function owl(c) {
  ell(c, 16, 19, 10, 11, '#8a6a48');
  ell(c, 16, 22, 7, 7, '#c9a982');
  circ(c, 12, 12, 4.5, '#f2e6c8'); circ(c, 20, 12, 4.5, '#f2e6c8');
  circ(c, 12, 12, 2.4, '#f2c14e'); circ(c, 20, 12, 2.4, '#f2c14e');
  circ(c, 12, 12, 1.2, '#111'); circ(c, 20, 12, 1.2, '#111');
  poly(c, [15, 14, 17, 14, 16, 17], '#4a3a28');
  poly(c, [8, 6, 10, 10, 12, 8], '#8a6a48'); poly(c, [24, 6, 22, 10, 20, 8], '#8a6a48');
  for (let i = 0; i < 5; i++) { c.save(); c.translate(27, 22); c.rotate(-0.9 + i * 0.25); ell(c, 0, -5, 1.6, 5, '#f4f1ea'); c.restore(); }
}
function boar(c) {
  ell(c, 15, 20, 12, 8, '#6b4a33');
  ell(c, 25, 17, 6, 5, '#7d5a40');
  ell(c, 29, 18, 2.5, 2, '#d9a38a');
  poly(c, [26, 20, 29, 23, 27, 20], '#f4f1ea');
  eye(c, 25, 15, 1.1);
  poly(c, [20, 12, 22, 8, 23, 13], '#5a3d2a');
  for (let i = 0; i < 6; i++) rect(c, 6 + i * 3, 12, 1, 3, '#4a3020');
  rect(c, 7, 26, 3, 4, '#4a3020'); rect(c, 21, 26, 3, 4, '#4a3020');
}
function crane(c) {
  ell(c, 14, 17, 8, 6, '#f4f4f0');
  poly(c, [6, 16, 1, 20, 7, 19], '#1d1d1d');
  rect(c, 19, 6, 2, 11, '#f4f4f0');
  circ(c, 21, 6, 3.2, '#f4f4f0'); circ(c, 21, 3.6, 1.5, '#d23a2a');
  rect(c, 20, 7, 2, 4, '#1d1d1d');
  eye(c, 22, 5.5, 0.9);
  poly(c, [23.5, 5.5, 29, 6.5, 23.5, 7.2], '#c9b27a');
  rect(c, 14, 22, 1, 9, '#2b2b2b');
}
function snake(c, color = '#3fa24a', light = '#9bdc6a') {
  ell(c, 16, 25, 12, 4.5, color);
  ell(c, 16, 21, 9, 3.5, light);
  ell(c, 16, 18, 7, 3, color);
  rect(c, 19, 8, 5, 11, color);
  ell(c, 22, 8, 5, 3.6, color);
  eye(c, 23.5, 7, 1.1);
  poly(c, [27, 9, 30, 8, 30, 10], '#d23a2a');
}
const xiaoqing = c => { snake(c, '#2f9e6a', '#8be0a8'); circ(c, 19, 4.5, 2, '#1d5c3f'); circ(c, 25, 4.5, 2, '#1d5c3f'); };
const baishe = c => { snake(c, '#eef0f2', '#ffffff'); rect(c, 21, 2, 1, 4, '#5fb8a0'); circ(c, 21, 2, 1.2, '#7fd6be'); c.strokeStyle = '#c8ccd2'; c.lineWidth = 0.6; c.beginPath(); c.ellipse(16, 25, 12, 4.5, 0, 0, TAU); c.stroke(); };
function ginkgoSpirit(c) {
  rect(c, 13, 16, 6, 15, '#6b4a2b');
  circ(c, 16, 11, 11, '#e2b93b'); circ(c, 9, 13, 6, '#f2d061'); circ(c, 23, 13, 6, '#d9a92e'); circ(c, 16, 5, 6, '#f2d061');
  rect(c, 14, 20, 1.4, 1.4, '#2b1d10'); rect(c, 17, 20, 1.4, 1.4, '#2b1d10');
  c.strokeStyle = '#2b1d10'; c.lineWidth = 0.7; c.beginPath(); c.arc(16, 23, 1.6, 0.2, Math.PI - 0.2); c.stroke();
  rect(c, 12, 18, 2.5, 0.6, '#efe6d0'); rect(c, 17.5, 18, 2.5, 0.6, '#efe6d0');
}
function leech(c) {
  ell(c, 16, 21, 12, 6, '#4a3626');
  for (let i = 0; i < 5; i++) rect(c, 7 + i * 4, 16, 1, 10, '#3a2a1c');
  circ(c, 27, 18, 4, '#5a4230'); eye(c, 27, 17, 1.3);
  ell(c, 29.5, 20, 1.6, 1.1, '#b04040');
}
function mist(c) {
  for (const [x, y, r] of [[10, 18, 7], [17, 14, 8], [23, 18, 7], [16, 21, 8]]) circ(c, x, y, r, 'rgba(232,238,240,0.92)');
  eye(c, 14, 16, 1.6); eye(c, 20, 16, 1.6);
  c.strokeStyle = '#7a8a94'; c.lineWidth = 0.8; c.beginPath(); c.arc(17, 20, 2, 0.2, Math.PI - 0.2); c.stroke();
}
function larou(c) {
  rect(c, 15, 1, 1.2, 7, '#7a5a3a');
  c.save(); c.translate(16, 18); c.rotate(-0.1);
  rect(c, -9, -10, 18, 20, '#7a2e1a');
  for (let i = 0; i < 4; i++) rect(c, -9, -8 + i * 5, 18, 1.6, '#f0dcc0');
  rect(c, -9, -10, 18, 3, '#3a1a10');
  c.restore();
  eye(c, 13, 14, 1.4); eye(c, 19, 14, 1.4);
  poly(c, [11, 11, 15, 12.5, 11.5, 12.5], '#1d1d1d'); poly(c, [21, 12.5, 17, 12.5, 20.5, 11], '#1d1d1d');
}
const qingchengBg = (c, w) => {
  for (let x = -60; x < w; x += 220) poly(c, [x, 335, x + 110, 120, x + 240, 335], '#4f6f5c');
  for (let x = 20; x < w; x += 46) { rect(c, x, 140, 7, 200, '#5f9a48'); for (let y = 160; y < 330; y += 36) rect(c, x, y, 7, 2, '#3f6f2f'); }
  for (let i = 0; i < 6; i++) ell(c, (i * 197) % w, 120 + (i * 61) % 180, 220, 40, 'rgba(232,238,240,0.35)');
};

// ---------- 地标占位：一座带名字的小建筑。真图到了就替换 ----------
function landmark(label, { roof = '#3e4852', wall = '#8b6a4a', accent = '#f2c14e', kind = 'house' } = {}) {
  return (c, w, h) => {
    if (kind === 'stele') {
      rect(c, w * 0.3, h * 0.15, w * 0.4, h * 0.8, '#7a7a72'); rect(c, w * 0.2, h * 0.88, w * 0.6, h * 0.1, '#5a5a52');
      poly(c, [w * 0.3, h * 0.15, w * 0.5, 0, w * 0.7, h * 0.15], '#8a8a80');
    } else if (kind === 'arch') {
      rect(c, w * 0.08, h * 0.3, w * 0.1, h * 0.7, wall); rect(c, w * 0.82, h * 0.3, w * 0.1, h * 0.7, wall);
      poly(c, [0, h * 0.32, w * 0.5, h * 0.05, w, h * 0.32], roof); rect(c, w * 0.1, h * 0.3, w * 0.8, h * 0.08, accent);
    } else if (kind === 'altar') {
      rect(c, w * 0.05, h * 0.55, w * 0.9, h * 0.45, '#b8862e'); rect(c, w * 0.15, h * 0.35, w * 0.7, h * 0.25, '#d9a53c');
      c.save(); c.translate(w / 2, h * 0.25); for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); poly(c, [0, -6, 4, -h * 0.22, -2, -h * 0.22], accent); } c.restore();
      circ(c, w / 2, h * 0.25, 8, '#fff3c4');
    } else if (kind === 'bridge') {
      rect(c, 0, h * 0.35, w, h * 0.45, '#7a5230'); for (let x = 6; x < w; x += 18) rect(c, x, h * 0.2, 4, h * 0.3, '#5c3b20');
      poly(c, [0, h * 0.25, w / 2, 0, w, h * 0.25], roof);
    } else if (kind === 'pavilion') {
      rect(c, w * 0.2, h * 0.4, w * 0.08, h * 0.6, wall); rect(c, w * 0.72, h * 0.4, w * 0.08, h * 0.6, wall);
      poly(c, [0, h * 0.45, w / 2, 0, w, h * 0.45], roof); rect(c, w * 0.1, h * 0.85, w * 0.8, h * 0.15, '#9a968a');
    } else {
      rect(c, w * 0.06, h * 0.35, w * 0.88, h * 0.65, wall);
      poly(c, [0, h * 0.4, w * 0.12, h * 0.08, w * 0.88, h * 0.08, w, h * 0.4], roof);
      rect(c, w * 0.42, h * 0.62, w * 0.16, h * 0.38, '#3a2a1c');
    }
    c.fillStyle = '#fff'; c.strokeStyle = '#1b1f2a'; c.lineWidth = 3;
    c.font = 'bold 13px sans-serif'; c.textAlign = 'center';
    c.strokeText(label, w / 2, h - 6); c.fillText(label, w / 2, h - 6);
  };
}

// ---------- 清单 ----------
export const PAINTERS = {
  tiles_ph: paintTiles,
  player: paintPlayerFrame,

  npc_zaozao: (c, w) => unit(c, w, zaozao),
  npc_turtle: (c, w) => unit(c, w, turtle),
  npc_hoopoe: (c, w) => unit(c, w, hoopoe),
  npc_cuckoo: (c, w) => unit(c, w, cuckoo),
  npc_panda: (c, w) => unit(c, w, panda),
  npc_sunbird: (c, w) => unit(c, w, sunbird),
  npc_rhino: (c, w) => unit(c, w, rhino),
  npc_gate: (c, w) => unit(c, w, gate),

  portrait_baiguo: (c, w) => { rect(c, 0, 0, w, w, '#2b3340'); unit(c, w, cc => bulbulFront(cc, 0, false)); },
  portrait_zaozao: (c, w) => { rect(c, 0, 0, w, w, '#3a2f28'); unit(c, w, zaozao); },
  portrait_sunbird: (c, w) => { rect(c, 0, 0, w, w, '#3b2a10'); unit(c, w, sunbird); },
  portrait_rhino: (c, w) => { rect(c, 0, 0, w, w, '#2e3236'); unit(c, w, rhino); },
  portrait_turtle: (c, w) => { rect(c, 0, 0, w, w, '#26352a'); unit(c, w, turtle); },
  portrait_hoopoe: (c, w) => { rect(c, 0, 0, w, w, '#3a2a1c'); unit(c, w, hoopoe); },
  portrait_cuckoo: (c, w) => { rect(c, 0, 0, w, w, '#2c2b3a'); unit(c, w, cuckoo); },
  portrait_panda: (c, w) => { rect(c, 0, 0, w, w, '#2a3a26'); unit(c, w, panda); },

  battle_player: (c, w) => unit(c, w, cc => bulbulSide(cc, 1)),
  enemy_sparrow: (c, w) => unit(c, w, mirrored(eSparrow)),
  enemy_mosquito: (c, w) => unit(c, w, mirrored(eMosquito)),
  enemy_mahjong: (c, w) => unit(c, w, eMahjong),
  enemy_chili: (c, w) => unit(c, w, mirrored(eChili)),
  enemy_bamboorat: (c, w) => unit(c, w, mirrored(eBambooRat)),
  enemy_watermonkey: (c, w) => unit(c, w, eWaterMonkey),
  enemy_rhino: (c, w) => unit(c, w, mirrored(rhino)),
  enemy_snake: (c, w) => unit(c, w, mirrored(c2 => snake(c2))),
  enemy_leech: (c, w) => unit(c, w, mirrored(leech)),
  enemy_mist: (c, w) => unit(c, w, mist),
  enemy_larou: (c, w) => unit(c, w, larou),
  enemy_xiaoqing: (c, w) => unit(c, w, mirrored(xiaoqing)),

  npc_magpie: (c, w) => unit(c, w, magpie),
  npc_maoda: (c, w) => unit(c, w, eSparrow),
  npc_owl: (c, w) => unit(c, w, owl),
  npc_kingfisher: (c, w) => unit(c, w, kingfisher),
  npc_monkey: (c, w) => unit(c, w, eWaterMonkey),
  npc_hongzhong: (c, w) => unit(c, w, eMahjong),
  npc_boar: (c, w) => unit(c, w, boar),
  npc_ginkgo: (c, w) => unit(c, w, ginkgoSpirit),
  npc_crane: (c, w) => unit(c, w, crane),
  npc_xiaoqing: (c, w) => unit(c, w, xiaoqing),
  npc_baishe: (c, w) => unit(c, w, baishe),
  npc_axi: (c, w) => unit(c, w, axi),

  portrait_magpie: (c, w) => { rect(c, 0, 0, w, w, '#262c3a'); unit(c, w, magpie); },
  portrait_maoda: (c, w) => { rect(c, 0, 0, w, w, '#3a2e24'); unit(c, w, eSparrow); },
  portrait_owl: (c, w) => { rect(c, 0, 0, w, w, '#3a1f1f'); unit(c, w, owl); },
  portrait_kingfisher: (c, w) => { rect(c, 0, 0, w, w, '#1f3340'); unit(c, w, kingfisher); },
  portrait_boar: (c, w) => { rect(c, 0, 0, w, w, '#33281f'); unit(c, w, boar); },
  portrait_ginkgo: (c, w) => { rect(c, 0, 0, w, w, '#2e2a1a'); unit(c, w, ginkgoSpirit); },
  portrait_crane: (c, w) => { rect(c, 0, 0, w, w, '#26303a'); unit(c, w, crane); },
  portrait_xiaoqing: (c, w) => { rect(c, 0, 0, w, w, '#1d3329'); unit(c, w, xiaoqing); },
  portrait_baishe: (c, w) => { rect(c, 0, 0, w, w, '#2a3036'); unit(c, w, baishe); },
  portrait_axi: (c, w) => { rect(c, 0, 0, w, w, '#3b2a10'); unit(c, w, axi); },
  lm_heming: landmark('鹤鸣茶社', { wall: '#9a7b55' }),
  lm_baolu: landmark('保路纪念碑', { kind: 'stele' }),
  lm_kuanzhai: landmark('宽窄巷子', { kind: 'arch', wall: '#6b5040' }),
  lm_altar: landmark('太阳神鸟祭坛', { kind: 'altar' }),
  lm_hejiang: landmark('合江亭', { kind: 'pavilion', wall: '#8a3a2a' }),
  lm_langqiao: landmark('安顺廊桥', { kind: 'bridge' }),
  lm_wangjiang: landmark('望江楼', { wall: '#8a3a2a', roof: '#2f5a4a' }),
  lm_wuhou: landmark('武侯祠', { kind: 'arch', wall: '#a23a2a' }),
  lm_caotang: landmark('草堂', { roof: '#b8a060', wall: '#8b7355' }),
  lm_panda: landmark('熊猫基地', { kind: 'arch', wall: '#3f6f2f', roof: '#2a4a20' }),
  bg_qingcheng: makeBattleBg('#a9b8b4', '#d2dbd6', '#6e8f62', '#4f6f45', qingchengBg),

  bg_park: makeBattleBg('#9fb3bf', '#c8d2cf', '#7cae5a', '#5e8f44', ginkgoRow),
  bg_north: makeBattleBg('#a3adb8', '#cfd2cf', '#b8a27a', '#9a845e', roofs),
  bg_west: makeBattleBg('#b7ab8a', '#ddd0a6', '#7cae5a', '#5e8f44', (c, w, h) => sunMotif(c, w, h, 0.18)),
  bg_east: makeBattleBg('#8fae94', '#c3d6b6', '#6e9a4e', '#4f7d37', bamboo),
  bg_south: makeBattleBg('#8da2b0', '#bccbd2', '#7a9a6a', '#5a7a4a', river),
  bg_boss: makeBattleBg('#4b5563', '#7b8794', '#5f6b62', '#3f4a42', (c, w) => { hills(c, w); river(c, w); }),

  title_bg: (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#3b4252'); g.addColorStop(0.7, '#6b6f72'); g.addColorStop(1, '#2e3a2e');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    sunMotif(c, w, h, 0.5);
    c.save(); c.translate(w / 2, h * 0.36);
    for (let i = 0; i < 4; i++) {
      c.save(); c.rotate(i * TAU / 4 + 0.3); c.translate(0, -175); c.rotate(Math.PI / 2);
      ell(c, 0, 0, 22, 8, 'rgba(242,193,78,0.55)'); poly(c, [-6, 0, -30, -18, 4, -2], 'rgba(242,193,78,0.55)');
      c.restore();
    }
    c.restore();
    for (let i = 0; i < 9; i++) ell(c, (i * 137) % w, 60 + (i * 53) % 160, 120, 24, 'rgba(200,205,210,0.18)');
    for (let x = 0; x < w; x += 70) { rect(c, x + 30, h - 120, 7, 80, '#2a2218'); circ(c, x + 33, h - 135, 30, 'rgba(201,160,50,0.85)'); }
    rect(c, 0, h - 45, w, 45, '#1f271f');
  },
};
