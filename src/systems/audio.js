// 音频小工具：没有音频文件时安静地什么都不做。
let current = null;
let currentKey = null;

export function playMusic(scene, key, volume = 0.5) {
  if (currentKey === key && current && current.isPlaying) return;
  stopMusic();
  currentKey = key;
  if (!scene.cache.audio.exists(key)) return;
  const start = () => {
    if (currentKey !== key) return;
    current = scene.sound.add(key, { loop: true, volume });
    current.play();
  };
  if (scene.sound.locked) scene.sound.once('unlocked', start);
  else start();
}

export function stopMusic() {
  if (current) { current.stop(); current.destroy(); }
  current = null;
  currentKey = null;
}

export function sfx(scene, key, volume = 0.7) {
  if (scene.cache.audio.exists(key) && !scene.sound.locked) scene.sound.play(key, { volume });
}
