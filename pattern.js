const pattern = {
  kick: new Array(16).fill(0),
  clap: new Array(16).fill(0),
  hat: new Array(16).fill(0),
};

pattern.kick[0] = 1;
pattern.kick[4] = 1;
pattern.hat[3] = 1;
pattern.clap[8] = 1;

export { pattern };
