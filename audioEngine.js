const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

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
  ]);
  console.log("kit loaded");
}

// Play Sounds
let currentVolume = 0.15;

function playSound(name, time = audioCtx.currentTime) {
  const buffer = buffers[name]; //Checks buffer to retrieve correct sound

  if (!buffer) return;
  const source = audioCtx.createBufferSource(); // Create a sound source node
  source.buffer = buffer; // Attach audio date to the source

  const gainNode = audioCtx.createGain(); // Add volume control
  gainNode.gain.value = currentVolume;
  // gainNode.gain.value = volume;

  source.connect(gainNode); // Route sound from soruce to gain node
  gainNode.connect(audioCtx.destination); //Route sound from gain node to audio output device

  source.start(time); // Play sound
  console.log("is playing");
}

const updateVolume = (volume) => (currentVolume = volume);

export { loadKit, playSound, audioCtx, updateVolume };
