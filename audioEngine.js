const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};
const instrumentGains = {};

// Load single audio files and stores it

async function loadSound(name, url) {
  const response = await fetch(url); // Goes to the file (kick.wav) downloads it
  const arrayBuffer = await response.arrayBuffer(); // Converts the file into binary data
  const decoded = await audioCtx.decodeAudioData(arrayBuffer); // Coverts raw audio into usable sound buffer
  buffers[name] = decoded; // Stores audio in memory
}

// Loads all of the sounds at the same time (faster that's why we use .all())
// Waits until all sounds are loaded before continuing

async function loadKit() {
  await Promise.all([
    loadSound("kick", "sounds/kick.wav"),
    loadSound("clap", "sounds/clap.wav"),
    loadSound("hat", "sounds/closed_hat.wav"),
    loadSound("hat_2", "sounds/closed_hat_2.wav"),
    loadSound("perc", "sounds/perc.wav"),
  ]);
  console.log("kit loaded");
}
// initInstrumentGains();

// Play Sounds
let currentVolume = 0.15;
const masterGain = audioCtx.createGain();
masterGain.gain.value = currentVolume;
masterGain.connect(audioCtx.destination); //Route sound from gain node to audio output device

function initInstrumentGains() {
  Object.keys(buffers).forEach((name) => {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    gainNode.connect(masterGain);
    instrumentGains[name] = gainNode;
  });
}

function playSound(name, time = audioCtx.currentTime) {
  const buffer = buffers[name];
  const gainNode = instrumentGains[name];

  if (!buffer || !gainNode) {
    console.warn("Missing buffer or gain:", name);
    return;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  source.connect(gainNode);
  source.start(time);
}
// Set volume for Instruments

function setInstrumentVolume(name, value) {
  if (instrumentGains[name]) {
    instrumentGains[name].gain.value = value;
    console.log(`Set ${name} volume to ${value}`);
  }
}
const updateVolume = (volume) => {
  currentVolume = volume;
  masterGain.gain.value = currentVolume;
};

export {
  loadKit,
  playSound,
  audioCtx,
  updateVolume,
  initInstrumentGains,
  setInstrumentVolume,
};
