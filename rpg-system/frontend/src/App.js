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
      <h1>Player: {user.character?.name}</h1>

      <Map players={players} npcs={npcs} onTileClick={handleTileClick} />

      {/* exibe ficha do personagem */}
      {/* ficha do personagem em formato hexagonal */}
      {user.character && (
        <div
          style={{
            position: "fixed",
            right: 20,
            top: 80,
            width: 260,
            height: 300,
            background: "#222",
            color: "#fff",
            padding: 20,
            clipPath:
              "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <h3>{user.character.name}</h3>

          {/* atributos */}
          <div style={{ fontSize: 12 }}>
            <p>FOR: {user.character.attributes?.strength}</p>
            <p>AGI: {user.character.attributes?.agility}</p>
            <p>INT: {user.character.attributes?.intellect}</p>
            <p>VIG: {user.character.attributes?.vigor}</p>
            <p>PRE: {user.character.attributes?.presence}</p>
          </div>

          {/* status */}
          <div style={{ marginTop: 10, fontSize: 12 }}>
            <p>HP: {user.character.stats?.hp}</p>
            <p>SAN: {user.character.stats?.sanity}</p>
            <p>EN: {user.character.stats?.energy}</p>
          </div>
        </div>
      )}

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