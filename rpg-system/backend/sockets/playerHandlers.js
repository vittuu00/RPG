const { canPlayerMove } = require("../game/gameEngine");
const { gameMode } = require("../game/gameState");

const {
  players,
  readyPlayers
} = require("../game/gameState");

const {
  updateVision,
  getVisibleMap,
  saveMap,
  gameMap
} = require("../game/mapManager");

// fake users (depois a gente move isso)
const users = require("../data/users"); 
const rollActions = require("../data/rollActions");

module.exports = function registerPlayerHandlers(io, socket) {

  // ==========================
  // 🔐 LOGIN
  // ==========================
  socket.on("login", ({ username, password }) => {
    const user = users[username];

    if (!user || user.password !== password) {
      socket.emit("loginError", "Login inválido");
      return;
    }

    // mestre NÃO entra como player
    if (user.role === "mestre") return;

    players[socket.id] = {
      id: socket.id,
      username,
      role: user.role,

      character: user.character
        ? JSON.parse(JSON.stringify(user.character))
        : null,

      position: { x: 5, y: 5 },
      vision: { range: 3 }
    };

    socket.emit("loginSuccess", players[socket.id]);

    updateVision(socket.id, players);
    socket.emit("mapData", getVisibleMap(socket.id));

    io.emit("updatePlayers", players);
  });

  // ==========================
  // 🟢 READY
  // ==========================
  socket.on("playerReady", () => {
    if (readyPlayers.has(socket.id)) return;

    readyPlayers.add(socket.id);

    io.emit("lobbyUpdate", {
      ready: Array.from(readyPlayers),
      total: Object.keys(players).length
    });
  });

    socket.on("move", (dir) => {
    const player = players[socket.id];
    if (!player) return;

    if (!canPlayerMove(player, gameMode)) return;

    movePlayer(socket.id, dir, gameMap);
    });

  // ==========================
  // 🎲 ROLL
  // ==========================
  socket.on("rollDice", ({ actionKey }) => {
    const player = players[socket.id];
    if (!player) return;

    const action = rollActions[actionKey];
    if (!action) return;

    const attrValue = player.character.attributes[action.attribute] || 0;
    const skill = player.character.skills[action.skill] || 0;

    const rolls = [];
    for (let i = 0; i < attrValue; i++) {
      rolls.push(Math.floor(Math.random() * 20) + 1);
    }

    const bestDice = Math.max(...rolls);
    const total = bestDice + skill;

    io.emit("rollResult", {
      playerId: socket.id,
      player: player.character.name,
      action: action.label,
      rolls,
      bestDice,
      skill,
      total
    });
  });

  // ==========================
  // 🗺️ INTERAÇÃO
  // ==========================
  socket.on("interact", ({ x, y }) => {
    const player = players[socket.id];
    if (!player) return;

    // futuro: NPC, evento, item
  });

  // ==========================
  // ❌ DISCONNECT
  // ==========================
  socket.on("disconnect", () => {
    delete players[socket.id];
    readyPlayers.delete(socket.id);

    io.emit("updatePlayers", players);
  });
};