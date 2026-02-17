const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

// Load Sounds

async function loadSound(name, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  buffers[name] = decoded;
}

async function loadKit() {
  await Promise.all([
    loadSound("kick", "sounds/kick.wav"),
    loadSound("clap", "sounds/clap.wav"),
    loadSound("hat", "sounds/closed_hat.wav"),
  ]);
  console.log("kit loaded");
}

// Play Sounds

function playSound(name, time = audioCtx.currentTime) {
  const buffer = buffers[name];
  if (!buffer) return;
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.2;

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  source.start(time);
  console.log("is playing");
}

export { loadKit, playSound, audioCtx };
