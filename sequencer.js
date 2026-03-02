import { pattern } from "./pattern.js";
import { playSound } from "./audioEngine.js";
import { playHead, resetPlayHead } from "./ui.js";

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
    isPlaying = false; // Pause sequencer
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
    if (currentStep >= 16) currentStep = 0; // Change 16 to extend bar (maybe link to pattern.length)
  }, interval);

  isPlaying = true;
}

function playStep() {
  if (pattern.kick[currentStep]) playSound("kick"); // and trigger UI active
  if (pattern.hat[currentStep]) playSound("hat");
  if (pattern.clap[currentStep]) playSound("clap");
  if (pattern.hat_2[currentStep]) playSound("hat_2");
  if (pattern.perc[currentStep]) playSound("perc");
  // console.log("step: ", currentStep);
}

function stopSequencer() {
  clearInterval(intervalid);
  intervalid = null;
  isPlaying = false;
  currentStep = 0;
  resetPlayHead();
}

function setBPM(newBpm) {
  bpm = newBpm;
  if (isPlaying) {
    clearInterval(intervalid);
    startSequencer();
  }
}

export { startSequencer, playStep, stopSequencer, setBPM };
