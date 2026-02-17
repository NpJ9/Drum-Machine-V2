import { pattern } from "./pattern.js";
import { playSound } from "./audioEngine.js";

let currentStep = 0;
let bpm = 135;
let interval = null;
let intervalid;

function startSequencer() {
  if (intervalid) {
    clearInterval(intervalid);
  }
  const interval = ((60 / bpm) * 1000) / 4;

  intervalid = setInterval(() => {
    playStep();
    currentStep++;

    if (currentStep >= 16) currentStep = 0;
  }, interval);
}

function stopSequencer() {
  clearInterval(intervalid);
  intervalid = null;
}
function playStep() {
  if (pattern.kick[currentStep]) {
    playSound("kick");
  }

  if (pattern.hat[currentStep]) {
    playSound("hat");
  }

  if (pattern.clap[currentStep]) {
    playSound("clap");
  }

  console.log("step: ", currentStep);
}

export { startSequencer, playStep, stopSequencer };
