import { socket } from "../../socket";
import styles from "./PlayerPanel.module.css";

function PlayerPanel({
  user,
  rollResults,
  pendingRoll,
  setPendingRoll
}) {

  const character = user.character;

  const attributes = [
    ["FOR", character.attributes?.strength],
    ["AGI", character.attributes?.agility],
    ["INT", character.attributes?.intellect],
    ["VIG", character.attributes?.vigor],
    ["PRE", character.attributes?.presence]
  ];

  const stats = [
    ["HP", character.stats?.hp],
    ["SAN", character.stats?.sanity],
    ["EN", character.stats?.energy]
  ];

  return (
    <div className={styles.container}>

      <h2>{character?.name}</h2>

      {/* 🎲 ROLAGENS */}
      <h3>Rolagens</h3>

      {Object.entries(rollResults).map(([id, r]) => (
        <div key={id} className={styles.roll}>
          <strong>{r.player}</strong>: {r.total}
        </div>
      ))}

      {/* 🎯 PEDIDO DE ROLAGEM */}
      {pendingRoll && (
        <div className={styles.pendingRoll}>
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
      {character && (
        <div className={styles.sheet}>
          <h3>Atributos</h3>

          {attributes.map(([label, value]) => (
            <p key={label}>
              {label}: {value}
            </p>
          ))}

          <h3>Status</h3>

          {stats.map(([label, value]) => (
            <p key={label}>
              {label}: {value}
            </p>
          ))}
        </div>
      )}

    </div>
  );
}

export default PlayerPanel;