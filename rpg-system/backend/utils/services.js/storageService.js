const fs = require("fs");

function saveMap(map) {
  fs.writeFileSync("map.json", JSON.stringify(map));
}

function loadMap() {
  if (!fs.existsSync("map.json")) return null;
  return JSON.parse(fs.readFileSync("map.json"));
}

module.exports = {
  saveMap,
  loadMap
};