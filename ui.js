import {
  pattern,
  resetPattern,
  displayPattern,
  saveToLocalStorage,
  loadLocalStorage,
} from "./pattern.js";
import {
  updateVolume,
  setInstrumentVolume,
  setInstrumentDecay,
  cycleInstrumentSound,
  soundVariants,
  currentSoundIndex,
  toggleMute,
  analyserNode,
} from "./audioEngine.js";
import { stopSequencer, startSequencer, setBPM } from "./sequencer.js";

const sequencerGrid = document.getElementById("grid");
const controlsContainer = document.getElementById("controls-container");
const bpmInput = document.getElementById("bpm");
const instrumentWrapper = document.getElementById("instrument-wrapper");

// Control Button Config

const controlConfig = [
  {
    text: "play",
    actions: [startSequencer],
    className: "control-button",
  },
  {
    text: "stop",
    actions: [stopSequencer],
    className: "control-button",
  },
  {
    text: "reset",
    actions: [resetPattern, resetUI],
    className: "control-button",
  },
  {
    text: "save",
    actions: [saveToLocalStorage],
    className: "control-button",
  },
  {
    text: "load",
    actions: [loadLocalStorage, loadStoredUI],
    className: "control-button",
  },

  {
    text: "debug",
    actions: [displayPattern, createVolumeSliders],
    className: "control-button",
  },
];

// BPM Input

bpmInput.addEventListener("input", function (event) {
  let newBpm = Number(bpmInput.value);
  setBPM(newBpm);
  console.log(`BPM: ${newBpm}`);
  console.log(typeof newBpm);
});

function createControlButton({ text, className, actions }) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", () => {
    actions.forEach((fn) => fn());
  });
  return btn;
}

function createVolumeSliders({ instrument, instrumentVolume }) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("instrument-volume-wrapper");

  const label = document.createElement("label");
  label.classList.add("instrument-labels");
  label.textContent = instrument;

  // Sound cycling UI
  const cycleWrap = document.createElement("div");
  cycleWrap.classList.add("sound-cycle-wrap");

  const prevBtn = document.createElement("button");
  prevBtn.classList.add("sound-cycle-btn");
  prevBtn.textContent = "<";

  const soundNameEl = document.createElement("span");
  soundNameEl.classList.add("sound-name-display");
  soundNameEl.textContent =
    soundVariants[instrument]?.[currentSoundIndex[instrument]] ?? instrument;

  const nextBtn = document.createElement("button");
  nextBtn.classList.add("sound-cycle-btn");
  nextBtn.textContent = ">";

  const hasVariants = (soundVariants[instrument]?.length ?? 0) > 1;
  prevBtn.disabled = !hasVariants;
  nextBtn.disabled = !hasVariants;

  prevBtn.addEventListener("click", () => {
    soundNameEl.textContent = cycleInstrumentSound(instrument, "prev");
  });
  nextBtn.addEventListener("click", () => {
    soundNameEl.textContent = cycleInstrumentSound(instrument, "next");
  });

  cycleWrap.appendChild(prevBtn);
  cycleWrap.appendChild(soundNameEl);
  cycleWrap.appendChild(nextBtn);

  const volKnob = createKnob({
    instrument,
    initialValue: 100,
    onChange: (_, value) => {
      setInstrumentVolume(instrument, value / 100);
    },
  });
  volKnob.title = "Volume";

  const decayKnob = createKnob({
    instrument,
    initialValue: 50,
    onChange: (_, value) => {
      setInstrumentDecay(instrument, value);
    },
  });
  decayKnob.title = "Decay";

  const muteBtn = document.createElement("button");
  muteBtn.classList.add("mute-btn");
  muteBtn.textContent = "M";
  muteBtn.addEventListener("click", () => {
    const muted = toggleMute(instrument);
    muteBtn.classList.toggle("muted", muted);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(cycleWrap);
  wrapper.appendChild(volKnob);
  wrapper.appendChild(decayKnob);
  wrapper.appendChild(muteBtn);
  return wrapper;
}

function initVolumeSliders() {
  const instruments = Object.keys(pattern);
  instruments.forEach((instrument) => {
    const row = createVolumeSliders({ instrument, instrumentVolume: 1 });
    instrumentWrapper.appendChild(row);
  });
}

function initControls() {
  controlConfig.forEach((config) => {
    const button = createControlButton(config);
    controlsContainer.appendChild(button);
  });
}

function createKnob({ instrument, initialValue = 50, onChange }) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("knob-group");

  const dial = document.createElement("div");
  dial.classList.add("knob");
  dial.dataset.value = initialValue;

  const labelEl = document.createElement("span");
  labelEl.classList.add("knob-label");
  labelEl.textContent = instrument;

  function updateKnob(value) {
    const angle = -135 + (value / 100) * 270;
    dial.style.transform = `rotate(${angle}deg)`;
    dial.dataset.value = value;
    if (onChange) onChange(instrument, value);
  }

  let startY, startValue;

  dial.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    startValue = parseInt(dial.dataset.value);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onRelease);
  });

  function onDrag(e) {
    const delta = startY - e.clientY;
    const newValue = Math.min(100, Math.max(0, startValue + delta));
    updateKnob(newValue);
  }

  function onRelease() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onRelease);
  }

  wrapper.appendChild(dial);

  updateKnob(initialValue);
  return wrapper;
}

function initMasterVolumeKnob() {
  const container = document.getElementById("volume-container");
  const knob = createKnob({
    instrument: "master",
    initialValue: 50,
    onChange: (_, value) => {
      updateVolume((value / 100) * 0.25);
    },
  });
  container.appendChild(knob);
}

function resetUI() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    button.classList.remove("stepOn");
  });
}

// Generate Sequencer Buttons, assign values and indexes

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

// function makeTheButtons() {
//   const buttons = document.querySelectorAll(".grid-item");
//   buttons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       button.classList.toggle("stepOn");
//       // Assigns pattern for sequencer
//       if (pattern[button.dataset.type][button.dataset.step]) {
//         pattern[button.dataset.type][button.dataset.step] = 0;
//       } else {
//         pattern[button.dataset.type][button.dataset.step] = 1;
//       }
//     });
//   });
// }

function makeTheButtons() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const step = pattern[button.dataset.type][button.dataset.step];
      step.active = step.active ? 0 : 1; // toggle
      button.classList.toggle("stepOn");
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

// function loadStoredUI() {
//   const buttons = document.querySelectorAll(".grid-item");
//   buttons.forEach((button) => {
//     const type = button.dataset.type;
//     const step = Number(button.dataset.step);
//     if (pattern[type][step] === 1) {
//       button.classList.add("stepOn");
//     } else {
//       button.classList.remove("stepOn");
//     }
//   });
// }

function loadStoredUI() {
  const buttons = document.querySelectorAll(".grid-item");
  buttons.forEach((button) => {
    const type = button.dataset.type;
    const step = Number(button.dataset.step);
    if (pattern[type][step].active === 1) {
      button.classList.add("stepOn");
    } else {
      button.classList.remove("stepOn");
    }
  });
}
// Create Name tags for each Instrument
// Create Decay Knob to change Envelope of Sound

function createVelocityPanel(instrument) {
  const panel = document.createElement("div");
  panel.classList.add("velocity-panel");
  panel.id = `vel-panel-${instrument}`;

  pattern[instrument].forEach((step, i) => {
    const barWrap = document.createElement("div");
    barWrap.classList.add("vel-bar-wrap");

    const bar = document.createElement("div");
    bar.classList.add("vel-bar");
    bar.dataset.step = i;
    bar.dataset.instrument = instrument;
    // height reflects velocity
    bar.style.height = `${step.velocity}%`;
    // dim if step is inactive
    bar.classList.toggle("vel-bar--inactive", !step.active);

    // drag to set velocity
    barWrap.addEventListener("mousedown", startVelDrag);

    barWrap.appendChild(bar);
    panel.appendChild(barWrap);
  });

  return panel;
}

function initVelocityPanels() {
  const container = document.getElementById("velocity-container");
  const tabContainer = document.getElementById("instrument-tabs");
  const instruments = Object.keys(pattern);
  const reversed = [...instruments].reverse();

  instruments.forEach((instrument) => {
    const panel = createVelocityPanel(instrument);
    container.appendChild(panel);
  });

  reversed.forEach((instrument) => {
    const tab = document.createElement("button");
    tab.textContent = instrument;
    tab.classList.add("vel-tab");
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".vel-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showVelocityPanel(instrument);
    });
    tabContainer.appendChild(tab);
  });

  showVelocityPanel(reversed[0]);
  tabContainer.firstChild.classList.add("active");
}
function showVelocityPanel(instrument) {
  document
    .querySelectorAll(".velocity-panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(`vel-panel-${instrument}`).classList.add("active");
}

function startVelDrag(e) {
  const wrap = e.currentTarget; // change: listener is on wrap, not bar
  const bar = wrap.querySelector(".vel-bar");
  const instrument = bar.dataset.instrument;
  const step = bar.dataset.step;

  function setVelocityFromEvent(e) {
    const rect = wrap.getBoundingClientRect();
    const relY = rect.bottom - e.clientY;
    const velocity = Math.min(100, Math.max(1, (relY / rect.height) * 100));
    pattern[instrument][step].velocity = Math.round(velocity);
    bar.style.height = `${velocity}%`;
  }

  setVelocityFromEvent(e);

  function onDrag(e) {
    setVelocityFromEvent(e);
  }

  function onRelease() {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onRelease);
  }

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", onRelease);
}

function initOscilloscope() {
  const canvas = document.getElementById("oscilloscope");
  const ctx = canvas.getContext("2d");
  const bufferLength = analyserNode.frequencyBinCount; // fftSize / 2 = 512
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyserNode.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // centre line when silent
    ctx.strokeStyle = "#1a4a4a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // waveform
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  }

  draw();
}

export {
  generateSequencer,
  makeTheButtons,
  playHead,
  resetPlayHead,
  initControls,
  initVolumeSliders,
  initVelocityPanels,
  initMasterVolumeKnob,
  initOscilloscope,
};
