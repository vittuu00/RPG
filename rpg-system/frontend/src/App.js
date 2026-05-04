import { useEffect, useState } from "react";
import { socket } from "./socket";
import Map from "./components/Map/Map";
import Lobby from "./components/Lobby/Lobby";
import GameLayout from "./components/Layout/GameLayout";
import MasterPanel from "./components/panels/MasterPanel";
import PlayerPanel from "./components/panels/PlayerPanel";

function App() {
  const [players, setPlayers] = useState({});
  const [name, setName] = useState("");
  const [npcs, setNpcs] = useState({});
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState("lobby");
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [pendingRoll, setPendingRoll] = useState(null);
  const [rollResults, setRollResults] = useState({});
  const [visibleTiles, setVisibleTiles] = useState({});

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

  useEffect(() => {
    socket.on("lobbyUpdate", (data) => {
      setReadyPlayers(data.ready);
    });

    socket.on("gameStarted", () => {
      setGameState("game");
    });
    
    return () => {
      socket.off("lobbyUpdate");
      socket.off("gameStarted");
    };
  }, []);

  useEffect(() => {
    socket.on("rollRequested", (data) => {
      console.log("ROLL RECEBIDO:", data);
      setPendingRoll(data);
    });

    return () => socket.off("rollRequested");
  }, []);

  useEffect(() => {
    const handler = (data) => {
      setRollResults((prev) => ({
        ...prev,
        [data.playerId]: data
      }));
    };

    socket.on("rollResult", handler);

    return () => {
      socket.off("rollResult", handler);
    };
  }, []);

  // debug login
  useEffect(() => {
    const success = (data) => {
      console.log("LOGIN OK", data);
      setUser(data);
    };

    const error = (msg) => {
      console.log("LOGIN ERRO", msg);
      alert(msg);
    };

    socket.on("loginSuccess", success);
    socket.on("loginError", error);

    return () => {
      socket.off("loginSuccess", success);
      socket.off("loginError", error);
    };
  }, []);

  //fog
  useEffect(() => {
  socket.on("mapData", (data) => {
    setVisibleTiles(data);
  });

  return () => socket.off("mapData");
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

  if (gameState === "lobby") {
    return <Lobby user={user} readyPlayers={readyPlayers} />;
  }
  
  return (
  <GameLayout
    left={
      <Map
        players={players}
        npcs={npcs}
        visibleTiles={visibleTiles}
        isMaster={user.role === "mestre"}
        onTileClick={handleTileClick}
      />
    }

    right={
      user.role === "mestre"
        ? (
          <MasterPanel
            players={players}
            rollResults={rollResults}
            setRollResults={setRollResults}
          />
        )
        : (
          <PlayerPanel
            user={user}
            rollResults={rollResults}
            pendingRoll={pendingRoll}
            setPendingRoll={setPendingRoll}
          />
        )
    }

    bottom={
      user.role === "player"
        ? (
          <div>
            <button onClick={() => move("up")}>↑</button>
            <button onClick={() => move("down")}>↓</button>
            <button onClick={() => move("left")}>←</button>
            <button onClick={() => move("right")}>→</button>
          </div>
        )
        : null
    }
  />
);}

export default App;