const pattern = {
  perc: new Array(16).fill(null).map(() => ({ active: 0, velocity: 100 })),
  hat_2: new Array(16).fill(null).map(() => ({ active: 0, velocity: 100 })),
  hat: new Array(16).fill(null).map(() => ({ active: 0, velocity: 100 })),
  clap: new Array(16).fill(null).map(() => ({ active: 0, velocity: 100 })),
  kick: new Array(16).fill(null).map(() => ({ active: 0, velocity: 100 })),
};

function displayPattern() {
  console.clear();
  for (const [key, value] of Object.entries(pattern)) {
    console.log(`${key}: ${value}`);
  }
}

// function resetPattern() {
//   Object.keys(pattern).forEach((instrument) => {
//     pattern[instrument].fill(0);
//   });
// }

function resetPattern() {
  Object.keys(pattern).forEach((instrument) => {
    pattern[instrument].forEach((step) => {
      step.active = 0;
      step.velocity = 100;
    });
  });
}

// NEED TO FIND A WAY TO SAVE AND LOAD INSTURMENT VOLUMES AS WELL AS PATTERN DATA

function saveToLocalStorage() {
  localStorage.setItem("pattern", JSON.stringify(pattern));
  const savedPattern = localStorage.getItem("pattern") || {};
  console.log(`Saved Pattern is ${savedPattern}`);

  // Save data for UI to read?
}

function loadLocalStorage() {
  const loadedPattern = JSON.parse(localStorage.getItem("pattern"));
  for (const key in loadedPattern) {
    pattern[key] = loadedPattern[key];
  }
  console.log(`Loaded Pattern is ${loadedPattern}`);
}

export {
  pattern,
  displayPattern,
  resetPattern,
  saveToLocalStorage,
  loadLocalStorage,
};
