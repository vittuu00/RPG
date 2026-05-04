import { socket } from "../../socket";
import { useState } from "react";

function MasterPanel({ players, rollResults, setRollResults }) {
  const [masterText, setMasterText] = useState(null);

  const removeRoll = (playerId) => {
    setRollResults((prev) => {
      const updated = { ...prev };
      delete updated[playerId];
      return updated;
    });
  };

  const masterTexts = {
    papaiNoel: [
      "Ho ho ho... vocês foram bons este ano?",
      "Eu trouxe presentes... mas não são o que esperavam."
    ],
    eventos: [
      "As luzes piscam violentamente.",
      "Um sino ecoa pela noite."
    ],
    climax: [
      "O corpo cai... mas o sorriso permanece.",
      "O Natal acabou. Para sempre."
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      
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
        <div key={id}>
          <strong>{r.player}</strong> → {r.total}
          <button onClick={() => removeRoll(id)}>X</button>
        </div>
      ))}

      {/* 🎯 SOLICITAR ROLAGEM */}
      <h3>Solicitar Rolagem</h3>

      {Object.entries(players).map(([id, p]) =>
        p.role === "player" ? (
          <div key={id}>
            <span>{p.character?.name}</span>

            <button
              onClick={() =>
                socket.emit("requestRoll", {
                  targetId: id,
                  actionKey: "investigacao"
                })
              }
            >
              Investigação
            </button>

            <button
              onClick={() =>
                socket.emit("requestRoll", {
                  targetId: id,
                  actionKey: "percepcao"
                })
              }
            >
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
        <div style={{ background: "#200", padding: 10 }}>
          {masterText}
        </div>
      )}
    </div>
  );
}

export default MasterPanel;