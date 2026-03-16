import { startSequencer } from "./sequencer.js";
import { loadKit, initInstrumentGains } from "./audioEngine.js";
import {
  generateSequencer,
  makeTheButtons,
  initControls,
  initVolumeSliders,
  initVelocityPanels,
  initMasterVolumeKnob,
  initOscilloscope,
} from "./ui.js";
await loadKit();

initInstrumentGains();

// VANTA

// Store the effect in a variable so you can destroy/update it later
// let vantaEffect = VANTA.DOTS({
//   el: "#vanta-bg", // <-- target your element (CSS selector or DOM node)
//   mouseControls: false, // respond to mouse movement
//   touchControls: true, // respond to touch on mobile
//   gyroControls: false, // tilt phone to move (usually leave false)
//   minHeight: 200.0,
//   minWidth: 200.0,

//   // Visual options (use the Vanta customiser to find values you like)
//   color: 0x393e46,
//   // color2: 0x393e46, // hex col our, but written as 0x not
//   backgroundColor: 0x000000, // hex colour, but written as 0x not #
//   shininess: 30.0,
//   waveHeight: 15.0,
//   waveSpeed: 0.75,
//   size: 5,
//   zoom: 0.75,
// });

// IMPORTANT: Clean up when navigating away (prevents memory leaks)
// vantaEffect.destroy();

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
initVelocityPanels();
initMasterVolumeKnob();
initOscilloscope();
