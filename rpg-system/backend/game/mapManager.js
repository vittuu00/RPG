const fs = require("fs");

const gameMap = {
  width: 20,
  height: 20,
  tiles: {}
};

function initializeMap() {
  for (let y = 0; y < gameMap.height; y++) {
    for (let x = 0; x < gameMap.width; x++) {
      gameMap.tiles[`${x},${y}`] = {
        type: "grass",
        blocked: false,
        discoveredBy: []
      };
    }
  }
}

function loadMap() {
  if (fs.existsSync("map.json")) {
    Object.assign(gameMap, JSON.parse(fs.readFileSync("map.json")));
  } else {
    initializeMap();
  }
}

function saveMap() {
  fs.writeFileSync("map.json", JSON.stringify(gameMap));
}

function updateVision(playerId, players) {
  const player = players[playerId];
  if (!player) return;

  const { x, y } = player.position;
  const range = player.vision.range;

  for (let dy = -range; dy <= range; dy++) {
    for (let dx = -range; dx <= range; dx++) {
      const tx = x + dx;
      const ty = y + dy;

      const tile = gameMap.tiles[`${tx},${ty}`];
      if (tile && !tile.discoveredBy.includes(playerId)) {
        tile.discoveredBy.push(playerId);
      }
    }
  }
}

function getVisibleMap(playerId) {
  const visibleTiles = {};

  for (const key in gameMap.tiles) {
    const tile = gameMap.tiles[key];

    if (tile.discoveredBy.includes(playerId)) {
      visibleTiles[key] = tile;
    }
  }

  return visibleTiles;
}

module.exports = {
  gameMap,
  loadMap,
  saveMap,
  updateVision,
  getVisibleMap
};