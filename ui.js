import {
  pattern,
  resetPattern,
  displayPattern,
  saveToLocalStorage,
  loadLocalStorage,
} from "./pattern.js";
import { updateVolume } from "./audioEngine.js";
import { stopSequencer, startSequencer, setBPM } from "./sequencer.js";

const sequencerGrid = document.getElementById("grid");
const controlsContainer = document.getElementById("controls-container");
const bpmInput = document.getElementById("bpm");
const volumeSlider = document.getElementById("volume");

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
    actions: [displayPattern],
    className: "control-button",
  },
];

function createControlButton({ text, className, actions }) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;

  btn.addEventListener("click", () => {
    actions.forEach((fn) => fn());
  });

  return btn;
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

// BPM Input

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
      // console.log(
      //   `You made step ${button.dataset.type} ${button.dataset.active} active`,
      // );
      // console.log("Step Index is ", button.dataset.step);
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

export {
  generateSequencer,
  makeTheButtons,
  playHead,
  resetPlayHead,
  initControls,
};
