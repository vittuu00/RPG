import { useEffect, useState } from "react";
import { socket } from "./socket";
import Map from "./components/Map";

function App() {
  const [players, setPlayers] = useState({});
  const [name, setName] = useState("");
  const [npcs, setNpcs] = useState({});
  const [dialog, setDialog] = useState(null);
  const [user, setUser] = useState(null);
  const [masterText, setMasterText] = useState(null); // texto selecionado pelo mestre

  // recebe players do servidor
  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data);
    });

    return () => socket.off("updatePlayers");
  }, []);

  // recebe NPCs do servidor
  useEffect(() => {
    socket.on("updateNPCs", (data) => {
      setNpcs(data);
    });

    return () => socket.off("updateNPCs");
  }, []);

  // escuta eventos de diálogo do servidor
  useEffect(() => {
    socket.on("dialog", (data) => {
      setDialog(data.text);
    });

    return () => socket.off("dialog");
  }, []);

  // login
  useEffect(() => {
    socket.on("loginSuccess", (data) => {
      setUser(data);
    });

    socket.on("loginError", (msg) => {
      alert(msg);
    });
  }, []);
  // debug login
  useEffect(() => {
    socket.on("loginSuccess", (data) => {
      console.log("LOGIN OK", data);
      setUser(data);
    });

    socket.on("loginError", (msg) => {
      console.log("LOGIN ERRO", msg);
      alert(msg);
    });
  }, []);

  // envia login
  const handleLogin = () => {
    socket.emit("login", { username: name, password: "123" });
  };

  // movimentação (bloqueia mestre)
  const move = (dir) => {
    if (user?.role === "mestre") return;

    socket.emit("move", dir);
  };

  // interação com mapa
  const handleTileClick = (x, y) => {
    socket.emit("interact", { x, y });
  };

  // textos narrativos para o mestre usar durante a sessão
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

  // ===== TELA DE LOGIN =====
  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <input
          placeholder="Usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }

  // ===== TELA DO MESTRE =====
  if (user.role === "mestre") {
    return (
      <div>
        <h1>PAINEL DO MESTRE</h1>

        <button onClick={() => socket.emit("setMode", "stop")}>
          STOP
        </button>

        <button onClick={() => socket.emit("spawnNPC", { x: 2, y: 2 })}>
          Spawn NPC
        </button>

        <Map players={players} npcs={npcs} onTileClick={handleTileClick} />

        // painel de textos narrativos do mestre
        <div style={{ marginTop: 20 }}>
          <h3>📖 Textos do Mestre</h3>

          <button onClick={() => setMasterText(masterTexts.papaiNoel[0])}>
            Papai Noel 1
          </button>

          <button onClick={() => setMasterText(masterTexts.eventos[0])}>
            Evento 1
          </button>

          <button onClick={() => setMasterText(masterTexts.climax[0])}>
            Clímax 1
          </button>
        </div>

        {/* exibe texto selecionado */}
        {masterText && (
          <div
            style={{
              marginTop: 20,
              padding: 10,
              background: "#200",
              color: "#fff"
            }}
          >
            {masterText}
          </div>
        )}
      </div>
    );
  }

  // ===== TELA DO PLAYER =====
  return (
    <div>
      <h1>Player: {user.character}</h1>

      <Map players={players} npcs={npcs} onTileClick={handleTileClick} />

      <div>
        <button onClick={() => move("up")}>↑</button>
        <button onClick={() => move("down")}>↓</button>
        <button onClick={() => move("left")}>←</button>
        <button onClick={() => move("right")}>→</button>
      </div>

      {/* exibe diálogo na tela */}
      {dialog && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: "#111",
            color: "#0f0"
          }}
        >
          {dialog}
        </div>
      )}
    </div>
  );
}

export default App;