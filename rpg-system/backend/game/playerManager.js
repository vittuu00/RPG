const { players } = require("./gameState");

function createPlayer(socketId, user) {
  players[socketId] = {
    id: socketId,
    username: user.username,
    role: user.role,

    character: user.character
      ? JSON.parse(JSON.stringify(user.character))
      : null,

    position: { x: 5, y: 5 },
    vision: { range: 3 }
  };

  return players[socketId];
}

function removePlayer(socketId) {
  delete players[socketId];
}

function movePlayer(socketId, dir, gameMap) {
  const player = players[socketId];
  if (!player) return;

  if (dir === "up") player.position.y--;
  if (dir === "down") player.position.y++;
  if (dir === "left") player.position.x--;
  if (dir === "right") player.position.x++;

  player.position.x = Math.max(0, Math.min(gameMap.width - 1, player.position.x));
  player.position.y = Math.max(0, Math.min(gameMap.height - 1, player.position.y));

  return player;
}

function changeSanity(socketId, amount) {
  const player = players[socketId];
  if (!player) return;

  const stats = player.character.stats;

  stats.sanity = Math.max(
    0,
    Math.min(stats.maxSanity, stats.sanity + amount)
  );

  return stats.sanity;
}

module.exports = {
  createPlayer,
  removePlayer,
  movePlayer,
  changeSanity
};