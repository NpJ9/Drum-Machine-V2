import { pattern } from "./pattern.js";
import { playSound } from "./audioEngine.js";
import { playHead } from "./ui.js";

let currentStep = 0;
let bpm = 135;
let interval = null;
let intervalid;
let isPlaying = false;

function startSequencer() {
  const buttons = document.querySelectorAll(".grid-item");
  // Reset Interval if already playing
  if (isPlaying) {
    clearInterval(intervalid);
    intervalid = null;
    isPlaying = false;
    return;
  }

  // If an interval exists clear it first to avoid timing issues
  if (intervalid) {
    clearInterval(intervalid);
  }

  const interval = ((60 / bpm) * 1000) / 4; // Calculates step timing

  // Start loop
  intervalid = setInterval(() => {
    playStep();
    playHead(buttons, currentStep);

    currentStep++;
    if (currentStep >= 16) currentStep = 0;
  }, interval);

  isPlaying = true;
}

function playStep() {
  if (pattern.kick[currentStep]) playSound("kick"); // and trigger UI active
  if (pattern.hat[currentStep]) playSound("hat");
  if (pattern.clap[currentStep]) playSound("clap");

  console.log("step: ", currentStep);
}

export { startSequencer, playStep, currentStep };
