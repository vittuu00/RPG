let npcs = {};

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const users = {
  mestre: { password: "123", role: "mestre" },
  player1: { password: "123", role: "player", character: "detetive" },
  player2: { password: "123", role: "player", character: "medico" }
};

// Estado simples (depois você melhora)
let players = {};
let gameMode = "livre"; // livre | turno | stop

io.on("connection", (socket) => {
  
  socket.on("login", ({ username, password }) => {
    const user = users[username];

    if (!user || user.password !== password) {
      socket.emit("loginError", "Login inválido");
      return;
    }

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

  // MOVIMENTO
  socket.on("move", (dir) => {
    const player = players[socket.id];
    if (!player || gameMode === "stop") return;

    if (dir === "up") player.y--;
    if (dir === "down") player.y++;
    if (dir === "left") player.x--;
    if (dir === "right") player.x++;

    io.emit("updatePlayers", players);
  });

  // MUDAR MODO (só mestre)
  socket.on("setMode", (mode) => {
    const player = players[socket.id];
    if (player?.role !== "mestre") return;

    gameMode = mode;
    io.emit("modeChanged", gameMode);
  });

  // 🎯 EVENTO PRIVADO (ESSENCIAL)
  socket.on("privateEvent", ({ targetId, data }) => {
    const player = players[socket.id];
    if (player?.role !== "mestre") return;

    io.to(targetId).emit("privateEvent", data);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });

  socket.on("spawnNPC", ({ x, y }) => {
    const player = players[socket.id];
    if (player?.role !== "mestre") return;

    const id = "npc_" + Date.now();

    npcs[id] = {
      id,
      x,
      y
    };

    io.emit("updateNPCs", npcs);
  });
  
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
});



server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});