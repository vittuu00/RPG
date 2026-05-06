const players = {};
const npcs = {};
const masters = new Set();

let gameMode = "livre";
let readyPlayers = new Set();
let gameStarted = false;

module.exports = {
  players,
  npcs,
  masters,
  readyPlayers,
  gameStarted,
  gameMode
};