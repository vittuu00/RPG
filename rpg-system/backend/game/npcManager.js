const { npcs } = require("./gameState");

function createNPC(x, y) {
  const id = "npc_" + Date.now();

  npcs[id] = {
    id,
    x,
    y
  };

  return npcs[id];
}

function moveNPC(id, dir) {
  const npc = npcs[id];
  if (!npc) return;

  if (dir === "up") npc.y--;
  if (dir === "down") npc.y++;
  if (dir === "left") npc.x--;
  if (dir === "right") npc.x++;

  return npc;
}

function removeNPC(id) {
  delete npcs[id];
}

module.exports = {
  createNPC,
  moveNPC,
  removeNPC
};