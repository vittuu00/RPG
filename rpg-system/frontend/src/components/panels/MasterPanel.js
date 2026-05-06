import { socket } from "../../socket";
import { useState } from "react";
import { masterTexts } from "../../data/masterTexts";
import styles from "./MasterPanel.module.css";


function MasterPanel({ players, rollResults, setRollResults }) {
  const [masterText, setMasterText] = useState(null);

  const removeRoll = (playerId) => {
    setRollResults((prev) => {
      const updated = { ...prev };
      delete updated[playerId];
      return updated;
    });
  };

  const requestRoll = (targetId, actionKey) => {
    socket.emit("requestRoll", {
      targetId,
      actionKey
    });
  };

  const spawnNPC = () => {
    socket.emit("spawnNPC", { x: 2, y: 2 });
  };  

  return (
    <div className={styles.container}>
      
      <h2>Painel do Mestre</h2>

      <button onClick={() => socket.emit("setMode", "stop")}>
        STOP
      </button>

      <button onClick={() => socket.emit("spawnNPC", { x: 2, y: 2 })}>
        Spawn NPC
      </button>

      {/* 🎲 ROLAGENS */}
      <h3>Rolagens</h3>

      {Object.entries(rollResults).map(([id, r]) => (
        <div key={id} className={styles.roll}>
          <strong>{r.player}</strong>
            🎲 [{r.rolls.join(", ")}]
            + {r.skill}

            = {r.total}
          <button onClick={() => removeRoll(id)}>X</button>
        </div>
      ))}

      {/* 🎯 SOLICITAR ROLAGEM */}
      <h3>Solicitar Rolagem</h3>

      {Object.entries(players).map(([id, p]) =>
        p.role === "player" ? (
          <div key={id} className={styles.playerRow}>
            <span>{p.character?.name}</span>

            <button onClick={requestRoll }>
              Investigação
            </button>

            <button onClick={requestRoll}>
              Percepção
            </button>
          </div>
        ) : null
      )}

      {/* 📖 TEXTOS */}
      <h3>Textos Narrativos</h3>

      <button onClick={() => setMasterText(masterTexts.eventos[0])}>
        Evento
      </button>

      <button onClick={() => setMasterText(masterTexts.climax[0])}>
        Clímax
      </button>

      {masterText && (
        <div className={styles.narration}>
          {masterText}
        </div>
      )}
    </div>
  );
}

export default MasterPanel;