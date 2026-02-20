import {
  pattern,
  resetPattern,
  saveToLocalStorage,
  loadLocalStorage,
} from "./pattern.js";
import { stopSequencer } from "./sequencer.js";

const sequencerGrid = document.getElementById("grid");
const buttonContainer = document.getElementById("button-container");

// Create Media Control Buttons

function createStopButton() {
  const stopButton = document.createElement("stopButton");
  buttonContainer.appendChild(stopButton);
  stopButton.classList.add("stop-button");
  stopButton.textContent = "Stop";
  stopButton.addEventListener("click", (e) => {
    stopSequencer();
  });
}

function createSaveButton() {
  const saveButton = document.createElement("saveButton");
  buttonContainer.appendChild(saveButton);
  saveButton.classList.add("stop-button");
  saveButton.textContent = "save";
  saveButton.addEventListener("click", (e) => {
    saveToLocalStorage();
  });
}

function createLoadButton() {
  const loadButton = document.createElement("loadButton");
  buttonContainer.appendChild(loadButton);
  loadButton.classList.add("stop-button");
  loadButton.textContent = "load";
  loadButton.addEventListener("click", (e) => {
    loadLocalStorage();
    loadStoredUI();
  });
}

function createResetButton() {
  const resetButton = document.createElement("resetButton");
  buttonContainer.append(resetButton);
  resetButton.classList.add("stop-button");
  resetButton.textContent = "reset";
  resetButton.addEventListener("click", () => {
    const buttons = document.querySelectorAll(".grid-item");
    buttons.forEach((button) => {
      button.classList.remove("stepOn");
    });
    resetPattern();
  });
}

// Generate buttons, assign values and indexes

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
      if (pattern[button.dataset.type][button.dataset.step]) {
        // Assigns pattern for sequencer
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
  createStopButton,
  createResetButton,
  createSaveButton,
  createLoadButton,
};
