function isValidDirection(dir) {
  return ["up", "down", "left", "right"].includes(dir);
}

module.exports = {
  isValidDirection
};