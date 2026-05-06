function canPlayerMove(player, gameMode) {
  if (gameMode === "stop") return false;
  return true;
}

function applyPostMoveEffects(player) {
  // depois: sanidade, eventos, triggers
}

module.exports = {
  canPlayerMove,
  applyPostMoveEffects
};