// ==============================
// 📦 IMPORTS E CONFIGURAÇÃO
// ==============================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Cria servidor HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// ==============================
// 👤 USUÁRIOS (fake por enquanto)
// ==============================

const users = {
  mestre: { password: "123", role: "mestre" },
  player1: { password: "123", role: "detetive", character: "detetive" },
  player2: { password: "123", role: "medico", character: "medico" }
};

// ==============================
// 🎮 ESTADO DO JOGO
// ==============================

// players conectados
let players = {};

// NPCs no mapa
let npcs = {};

// modos do jogo:
// livre = todo mundo anda
// turno = pode evoluir depois
// stop = ninguém anda
let gameMode = "livre";

// ==============================
// 🔌 CONEXÃO SOCKET
// ==============================

io.on("connection", (socket) => {
  console.log("🔌 Novo usuário conectado:", socket.id);

  // ==========================
  // 🔐 LOGIN
  // ==========================
  socket.on("login", ({ username, password }) => {
    console.log("tentando login:", username);

    const user = users[username];

    if (!user || user.password !== password) {
      console.log("login inválido");
      socket.emit("loginError", "Login inválido");
      return;
    }

    console.log("login OK");

    // cria player no estado
    players[socket.id] = {
      id: socket.id,
      username,
      role: user.role,
      character: user.character || null,
      x: 5,
      y: 5
    };

    socket.emit("loginSuccess", players[socket.id]);
    io.emit("updatePlayers", players);
  });

  // ==========================
  // 🧭 MOVIMENTO PLAYER
  // ==========================
  socket.on("move", (dir) => {
    const player = players[socket.id];

    // bloqueios
    if (!player || gameMode === "stop") return;

    if (dir === "up") player.y--;
    if (dir === "down") player.y++;
    if (dir === "left") player.x--;
    if (dir === "right") player.x++;

    io.emit("updatePlayers", players);
  });

  // ==========================
  // 🗺️ INTERAÇÃO (NPC / MAPA)
  // ==========================
  socket.on("interact", ({ x, y }) => {
    const player = players[socket.id];
    if (!player) return;

    const npc = Object.values(npcs).find(
      (n) => n.x === x && n.y === y
    );

    if (npc) {
      socket.emit("dialog", {
        text: "O boneco te encara... algo parece errado no Natal."
      });
    } else {
      socket.emit("dialog", {
        text: "A neve está fria... e silenciosa demais."
      });
    }
  });

  // ==========================
  // 🎮 CONTROLE DO JOGO (MESTRE)
  // ==========================
  socket.on("setMode", (mode) => {
    const player = players[socket.id];

    if (player?.role !== "mestre") return;

    gameMode = mode;
    io.emit("modeChanged", gameMode);
  });

  // ==========================
  // 🎯 EVENTO PRIVADO (MESTRE)
  // ==========================
  socket.on("privateEvent", ({ targetId, data }) => {
    const player = players[socket.id];

    if (player?.role !== "mestre") return;

    io.to(targetId).emit("privateEvent", data);
  });

  // ==========================
  // 🤖 SPAWN DE NPC (MESTRE)
  // ==========================
  socket.on("spawnNPC", ({ x, y }) => {
    const player = players[socket.id];

    if (player?.role !== "mestre") return;

    const id = "npc_" + Date.now();

    npcs[id] = { id, x, y };

    io.emit("updateNPCs", npcs);
  });

  // ==========================
  // 🤖 MOVER NPC (MESTRE)
  // ==========================
  socket.on("moveNPC", ({ id, dir }) => {
    const player = players[socket.id];
    if (player?.role !== "mestre") return;

    const npc = npcs[id];
    if (!npc) return;

    if (dir === "up") npc.y--;
    if (dir === "down") npc.y++;
    if (dir === "left") npc.x--;
    if (dir === "right") npc.x++;

    io.emit("updateNPCs", npcs);
  });

  // ==========================
  // ❌ DESCONECTAR
  // ==========================
  socket.on("disconnect", () => {
    console.log("❌ Usuário desconectado:", socket.id);

    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

// ==============================
// 🚀 START SERVIDOR
// ==============================

server.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});