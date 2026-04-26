import { useEffect, useState } from "react";
import { socket } from "./socket";
import Map from "./components/Map";

function App() {
  const [players, setPlayers] = useState({});
  const [name, setName] = useState("");
  const [role, setRole] = useState("player");
  const [npcs, setNpcs] = useState({});

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, []);
  
  // estados
  const setMode = (mode) => {
    socket.emit("setMode", mode);
  };

  const handleLogin = () => {
    socket.emit("login", { username: name, password: "123" });
  };

  useEffect(() => {
    socket.on("loginSuccess", (data) => {
      setUser(data);
    });

    socket.on("loginError", (msg) => {
      alert(msg);
    });
  }, []);

  const move = (dir) => {
    socket.emit("move", dir);
  };

  const spawnNPC = () => {
    socket.emit("spawnNPC", { x: 2, y: 2 });
  };

  const moveNPC = (dir) => {
    const npcId = Object.keys(npcs)[0];
    if (!npcId) return;

    socket.emit("moveNPC", { id: npcId, dir });
  };
  const [user, setUser] = useState(null);

  {role === "mestre" && (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setMode("livre")}>Modo Livre</button>
      <button onClick={() => setMode("turno")}>Modo Turno</button>
      <button onClick={() => setMode("stop")}>STOP</button>
    </div>
  )}
  {role === "mestre" && (
    <div>
      <button onClick={spawnNPC}>Spawn NPC</button>

      <div>
        <button onClick={() => moveNPC("up")}>↑ NPC</button>
        <button onClick={() => moveNPC("down")}>↓ NPC</button>
        <button onClick={() => moveNPC("left")}>← NPC</button>
        <button onClick={() => moveNPC("right")}>→ NPC</button>
      </div>
    </div>
  )}  

  useEffect(() => {
    socket.on("updateNPCs", (data) => {
      setNpcs(data);
    });

    return () => {
      socket.off("updateNPCs");
    };
  }, []);    

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

        <Map players={players} npcs={npcs} />
      </div>
    );
  }

  return (
    <div>
      <h1>Player: {user.character}</h1>

      <Map players={players} npcs={npcs} />

      <div>
        <button onClick={() => move("up")}>↑</button>
        <button onClick={() => move("down")}>↓</button>
        <button onClick={() => move("left")}>←</button>
        <button onClick={() => move("right")}>→</button>
      </div>
    </div>
  );
}

export default App;