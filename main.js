import { startSequencer } from "./sequencer.js";
import { loadKit, playSound, audioCtx } from "./audioEngine.js";
import { pattern } from "./pattern.js";
import { generateSequencer, makeTheButtons, playHead } from "./ui.js";
await loadKit();

const playButton = document.getElementById("play");
// const stopButton = document.getElementById("stop");

generateSequencer();
makeTheButtons();

playButton.addEventListener("click", (e) => {
  audioCtx.resume();
  startSequencer();

  // console.log(pattern.kick, pattern.hat, pattern.clap);
  // console.log("rows are ", rows);
});
