import { pattern } from "./pattern.js";

const sequencerGrid = document.getElementById("grid");

// Generate buttons, assign values and indexes

function generateSequencer() {
  Object.keys(pattern).forEach((instrument) => {
    pattern[instrument].forEach((value, stepIndex) => {
      const button = document.createElement("button");
      sequencerGrid.appendChild(button);
      button.value = instrument;
      button.dataset.type = instrument;
      button.dataset.step = stepIndex;
      button.classList.add("grid-item");
      //   button.dataset.value = Object.values(pattern);
    });
  });
}

// Make buttons interactive

function makeTheButtons() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button, buttonIndex) => {
    button.addEventListener("click", (e) => {
      console.log(button.value, "you pressed");
      button.classList.toggle("activeStep");
      console.log("Step Index is ", button.dataset.step);
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
// building grid

// button clicks

// visual step lights later

// toggling classes

// UI = visual + interaction only.

export { generateSequencer, makeTheButtons, playHead };
