import {
  pattern,
  resetPattern,
  displayPattern,
  saveToLocalStorage,
  loadLocalStorage,
} from "./pattern.js";
import { updateVolume, setInstrumentVolume } from "./audioEngine.js";
import { stopSequencer, startSequencer, setBPM } from "./sequencer.js";

const sequencerGrid = document.getElementById("grid");
const controlsContainer = document.getElementById("controls-container");
const bpmInput = document.getElementById("bpm");
const volumeSlider = document.getElementById("volume");
const instrumentVolumeSliderContainer = document.getElementById(
  "volume-slider-container ",
);

// Control Button Config

const controlConfig = [
  {
    text: "play",
    actions: [startSequencer],
    className: "control-button",
  },
  {
    text: "stop",
    actions: [stopSequencer],
    className: "control-button",
  },
  {
    text: "reset",
    actions: [resetPattern, resetUI],
    className: "control-button",
  },
  {
    text: "save",
    actions: [saveToLocalStorage],
    className: "control-button",
  },
  {
    text: "load",
    actions: [loadLocalStorage, loadStoredUI],
    className: "control-button",
  },

  {
    text: "debug",
    actions: [displayPattern, createVolumeSliders],
    className: "control-button",
  },
];

// Volume Input

volumeSlider.addEventListener("input", function (event) {
  let volume = Number(this.value) / 100;
  console.log(`Volume: ${volume}, ${typeof volume} `);
  updateVolume(volume);
  // Change volume for all gainNodes in audioEngine
});

// BPM Input

bpmInput.addEventListener("input", function (event) {
  let newBpm = Number(bpmInput.value);
  setBPM(newBpm);
  console.log(`BPM: ${newBpm}`);
  console.log(typeof newBpm);
});

function createControlButton({ text, className, actions }) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", () => {
    actions.forEach((fn) => fn());
  });
  return btn;
}

function createVolumeSliders({ instrument, instrumentVolume }) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("instrument-volume-wrapper");

  const label = document.createElement("label");
  label.classList.add("instrument-labels");
  label.textContent = instrument;

  const slider = document.createElement("input");
  slider.classList.add("vol-slider-instrument");
  slider.instrument = instrument;
  slider.instrumentVolume = instrumentVolume;
  slider.type = "range";
  slider.min = "0";
  slider.max = "1";
  slider.step = "0.1";
  slider.value = instrumentVolume;

  wrapper.appendChild(label);
  wrapper.appendChild(slider);

  slider.addEventListener("input", function (event) {
    // Take input of slider
    setInstrumentVolume(instrument, this.value);
  });
  return wrapper;
}

function initVolumeSliders() {
  const instruments = Object.keys(pattern);

  instruments.forEach((instrument) => {
    const instrumentVolSlider = createVolumeSliders({
      instrument,
      instrumentVolume: 1,
    });
    instrumentVolumeSliderContainer.appendChild(instrumentVolSlider);
  });
}

function initControls() {
  controlConfig.forEach((config) => {
    const button = createControlButton(config);
    controlsContainer.appendChild(button);
  });
}

function resetUI() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    button.classList.remove("stepOn");
  });
}

// Generate Sequencer Buttons, assign values and indexes

function generateSequencer() {
  console.log("GENERATING GRID");
  Object.keys(pattern).forEach((instrument) => {
    pattern[instrument].forEach((value, stepIndex) => {
      const button = document.createElement("button");
      sequencerGrid.appendChild(button);
      button.value = instrument;
      button.dataset.type = instrument;
      button.dataset.step = stepIndex;
      button.classList.add("grid-item");
      if (stepIndex % 4 === 0) {
        button.classList.add("fourth-note");
      }
      //   button.dataset.value = Object.values(pattern);
    });
  });
}

// Make buttons interactive

function makeTheButtons() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.classList.toggle("stepOn");
      // Assigns pattern for sequencer
      if (pattern[button.dataset.type][button.dataset.step]) {
        pattern[button.dataset.type][button.dataset.step] = 0;
      } else {
        pattern[button.dataset.type][button.dataset.step] = 1;
      }
    });
  });
}

function playHead(buttons, currentStep) {
  buttons.forEach((button) => {
    const step = Number(button.dataset.step);
    if (step === currentStep) {
      console.log("I AM ACTIVE STEP:", currentStep);
      button.classList.add("activeStep");
    } else {
      button.classList.remove("activeStep");
    }
  });
}

function resetPlayHead() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    button.classList.remove("activeStep");
  });
}

function loadStoredUI() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    const type = button.dataset.type;
    const step = Number(button.dataset.step);
    if (pattern[type][step] === 1) {
      button.classList.add("stepOn");
    } else {
      button.classList.remove("stepOn");
    }
  });
}

// Create Name tags for each Instrument
// Create Decay Knob to change Envelope of Sound

export {
  generateSequencer,
  makeTheButtons,
  playHead,
  resetPlayHead,
  initControls,
  initVolumeSliders,
};
