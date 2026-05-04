import { socket } from "../../socket";

function PlayerPanel({
  user,
  rollResults,
  pendingRoll,
  setPendingRoll
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      <h2>{user.character?.name}</h2>

      {/* 🎲 ROLAGENS */}
      <h3>Rolagens</h3>

      {Object.entries(rollResults).map(([id, r]) => (
        <div key={id}>
          <strong>{r.player}</strong>: {r.total}
        </div>
      ))}

      {/* 🎯 PEDIDO DE ROLAGEM */}
      {pendingRoll && (
        <div style={{ background: "#111", padding: 10 }}>
          <p>Rolagem: {pendingRoll.action.label}</p>

          <button
            onClick={() => {
              socket.emit("rollDice", {
                actionKey: pendingRoll.actionKey
              });
              setPendingRoll(null);
            }}
          >
            Rolar
          </button>
        </div>
      )}

      {/* 📊 FICHA */}
      {user.character && (
        <div style={{
          background: "#222",
          padding: 10,
          borderRadius: 10
        }}>
          <h3>Atributos</h3>

          <p>FOR: {user.character.attributes?.strength}</p>
          <p>AGI: {user.character.attributes?.agility}</p>
          <p>INT: {user.character.attributes?.intellect}</p>
          <p>VIG: {user.character.attributes?.vigor}</p>
          <p>PRE: {user.character.attributes?.presence}</p>

          <h3>Status</h3>

          <p>HP: {user.character.stats?.hp}</p>
          <p>SAN: {user.character.stats?.sanity}</p>
          <p>EN: {user.character.stats?.energy}</p>
        </div>
      )}

    </div>
  );
}

export default PlayerPanel;