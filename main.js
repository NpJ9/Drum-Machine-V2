import { startSequencer, stopSequencer } from "./sequencer.js";
import { loadKit, playSound, audioCtx } from "./audioEngine.js";
import { pattern } from "./pattern.js";

await loadKit();

const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");

playButton.addEventListener("click", (e) => {
  audioCtx.resume();
  startSequencer();
  console.log(pattern.kick, pattern.hat, pattern.clap);

  console.log("clicked");
});

stopButton.addEventListener("click", (e) => {
  stopSequencer();

  console.log("stopped");
});
