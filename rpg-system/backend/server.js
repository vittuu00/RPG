const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// managers
const { loadMap } = require("./game/mapManager");

// handlers
const registerPlayerHandlers = require("./sockets/playerHandlers");
const registerMasterHandlers = require("./sockets/masterHandlers");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔥 inicializa mapa
loadMap();

io.on("connection", (socket) => {
  console.log("🔌 conectado:", socket.id);

  // separação de responsabilidades
  registerPlayerHandlers(io, socket);
  registerMasterHandlers(io, socket);
});

server.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});