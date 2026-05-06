const {
  players,
  npcs,
  masters,
  gameMode
} = require("../game/gameState");

const rollActions = require("../data/rollActions");

module.exports = function registerMasterHandlers(io, socket) {

  // ==========================
  // 🔐 LOGIN MESTRE
  // ==========================
  socket.on("login", ({ username, password }) => {
    const users = require("../data/users");
    const user = users[username];

    if (!user || user.password !== password) return;

    if (user.role === "mestre") {
      masters.add(socket.id);

      socket.emit("loginSuccess", {
        id: socket.id,
        username,
        role: "mestre"
      });
    }
  });

  // ==========================
  // 🎮 START GAME
  // ==========================
  socket.on("startGame", () => {
    if (!masters.has(socket.id)) return;

    io.emit("gameStarted");
  });

  // ==========================
  // 🎯 REQUEST ROLL
  // ==========================
  socket.on("requestRoll", ({ targetId, actionKey }) => {
    if (!masters.has(socket.id)) return;

    const action = rollActions[actionKey];
    if (!action) return;

    io.to(targetId).emit("rollRequested", {
      actionKey,
      action
    });
  });

  // ==========================
  // 🎮 GAME MODE
  // ==========================
  socket.on("setMode", (mode) => {
    if (!masters.has(socket.id)) return;

    gameMode = mode;
    io.emit("modeChanged", gameMode);
  });

  // ==========================
  // 🎯 EVENTO PRIVADO
  // ==========================
  socket.on("privateEvent", ({ targetId, data }) => {
    if (!masters.has(socket.id)) return;

    io.to(targetId).emit("privateEvent", data);
  });

  // ==========================
  // 🤖 SPAWN NPC
  // ==========================
  socket.on("spawnNPC", ({ x, y }) => {
    if (!masters.has(socket.id)) return;

    const id = "npc_" + Date.now();

    npcs[id] = { id, x, y };

    io.emit("updateNPCs", npcs);
  });

  // ==========================
  // 🤖 MOVE NPC
  // ==========================
  socket.on("moveNPC", ({ id, dir }) => {
    if (!masters.has(socket.id)) return;

    const npc = npcs[id];
    if (!npc) return;

    if (dir === "up") npc.y--;
    if (dir === "down") npc.y++;
    if (dir === "left") npc.x--;
    if (dir === "right") npc.x++;

    io.emit("updateNPCs", npcs);
  });

  // ==========================
  // ❌ DISCONNECT
  // ==========================
  socket.on("disconnect", () => {
    masters.delete(socket.id);
  });
};