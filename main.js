import { startSequencer } from "./sequencer.js";
import { loadKit } from "./audioEngine.js";
import {
  generateSequencer,
  makeTheButtons,
  initControls,
  initVolumeSliders,
} from "./ui.js";
await loadKit();

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    startSequencer();
    console.log("Pressed space");
    playButton.classList.add("active_state");
    event.preventDefault(); // Prevent scrolling
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    console.log("released space");
    playButton.classList.remove("active_state");
  }
});

generateSequencer();
makeTheButtons();
initControls();
initVolumeSliders();
