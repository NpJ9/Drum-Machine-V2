const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};
const instrumentGains = {};
const instrumentDecays = {}; // store decay value per instrument

// Available sound variants per instrument row
const soundVariants = {
  kick: ["kick"],
  clap: ["clap"],
  hat: ["hat", "hat_2"],
  hat_2: ["hat_2", "hat"],
  perc: ["perc"],
};

const currentSoundIndex = {
  kick: 0,
  clap: 0,
  hat: 0,
  hat_2: 0,
  perc: 0,
};

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

const analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 1024;
masterGain.connect(analyserNode);
analyserNode.connect(audioCtx.destination);

const instrumentMuted = {};
const instrumentVolumes = {};

function initInstrumentGains() {
  Object.keys(buffers).forEach((name) => {
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    gainNode.connect(masterGain);
    instrumentGains[name] = gainNode;
    instrumentDecays[name] = 0.5;
    instrumentMuted[name] = false;
    instrumentVolumes[name] = 1;
  });
  console.log("Buffers:", Object.keys(buffers));
  console.log("Gains:", Object.keys(instrumentGains));
}

function cycleInstrumentSound(name, direction) {
  const variants = soundVariants[name];
  if (!variants || variants.length <= 1) return variants ? variants[0] : name;
  const current = currentSoundIndex[name];
  const next =
    direction === "next"
      ? (current + 1) % variants.length
      : (current - 1 + variants.length) % variants.length;
  currentSoundIndex[name] = next;
  return variants[next];
}

function playSound(name, time = audioCtx.currentTime, velocity = 1) {
  // add velocity param
  const variants = soundVariants[name];
  const soundKey = variants ? variants[currentSoundIndex[name]] : name;
  const buffer = buffers[soundKey];
  const instrumentGain = instrumentGains[name];
  const decay = instrumentDecays[name] ?? 0.5;

  if (!buffer || !instrumentGain) {
    console.warn("Missing buffer or gain:", name);
    return;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const decayGain = audioCtx.createGain();
  decayGain.connect(instrumentGain);
  source.connect(decayGain);

  decayGain.gain.setValueAtTime(velocity, time); // was hardcoded 1, now uses velocity
  decayGain.gain.exponentialRampToValueAtTime(0.001, time + decay);

  source.start(time);
  source.stop(time + decay);
}

// Set volume for Instruments

function setInstrumentVolume(name, value) {
  instrumentVolumes[name] = value;
  if (instrumentGains[name] && !instrumentMuted[name]) {
    instrumentGains[name].gain.value = value;
  }
}

function toggleMute(name) {
  instrumentMuted[name] = !instrumentMuted[name];
  if (instrumentGains[name]) {
    instrumentGains[name].gain.value = instrumentMuted[name]
      ? 0
      : (instrumentVolumes[name] ?? 1);
  }
  return instrumentMuted[name];
}

function setInstrumentDecay(name, value) {
  const decayTime = 0.05 + (value / 100) * 1.95;
  instrumentDecays[name] = decayTime;
  console.log(`Set ${name} decay to ${decayTime.toFixed(2)}s`);
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
  setInstrumentDecay,
  cycleInstrumentSound,
  soundVariants,
  currentSoundIndex,
  toggleMute,
  analyserNode,
};
