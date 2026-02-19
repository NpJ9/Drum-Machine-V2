const pattern = {
  kick: new Array(16).fill(0),
  clap: new Array(16).fill(0),
  hat: new Array(16).fill(0),
};

function displayPattern() {
  console.clear();
  for (const [key, value] of Object.entries(pattern)) {
    console.log(`${key}: ${value}`);
  }
}

export { pattern, displayPattern };
