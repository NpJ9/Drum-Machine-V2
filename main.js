import { startSequencer } from "./sequencer.js";
import { loadKit, audioCtx } from "./audioEngine.js";
import { displayPattern } from "./pattern.js";
import { generateSequencer, makeTheButtons, createStopButton } from "./ui.js";
await loadKit();

const playButton = document.getElementById("play");
const test = document.getElementById("test");

generateSequencer();
makeTheButtons();
createStopButton();

playButton.addEventListener("click", (e) => {
  audioCtx.resume();
  startSequencer();
});

// Debug/Test for pattern
test.addEventListener("click", (e) => {
  displayPattern();
});
