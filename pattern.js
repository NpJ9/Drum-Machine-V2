const pattern = {
  hat: new Array(16).fill(0),
  clap: new Array(16).fill(0),
  kick: new Array(16).fill(0),
};

function displayPattern() {
  console.clear();
  for (const [key, value] of Object.entries(pattern)) {
    console.log(`${key}: ${value}`);
  }
}

function resetPattern() {
  Object.keys(pattern).forEach((instrument) => {
    pattern[instrument].fill(0);
  });
}

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
