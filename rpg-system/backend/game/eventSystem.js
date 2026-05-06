function triggerEvent(io, type, data) {
  io.emit("gameEvent", {
    type,
    data
  });
}

function triggerPrivateEvent(io, targetId, type, data) {
  io.to(targetId).emit("gameEvent", {
    type,
    data
  });
}

module.exports = {
  triggerEvent,
  triggerPrivateEvent
};