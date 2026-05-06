import { useEffect, useState } from "react";
import { socket } from "./socket";
import Map from "./components/Map/Map";
import Lobby from "./components/Lobby/Lobby";
import GameLayout from "./components/Layout/GameLayout";
import MasterPanel from "./components/panels/MasterPanel";
import PlayerPanel from "./components/panels/PlayerPanel";

function App() {
  const SCREENS = {
    LOGIN: "login",
    LOBBY: "lobby",
    GAME: "game"
  };

  const [players, setPlayers] = useState({});
  const [name, setName] = useState("");
  const [npcs, setNpcs] = useState({});
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState(SCREENS.LOGIN);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [pendingRoll, setPendingRoll] = useState(null);
  const [rollResults, setRollResults] = useState({});
  const [visibleTiles, setVisibleTiles] = useState({});
  const isMaster = user?.role === "mestre";
  const isPlayer = user?.role === "player";  

  useEffect(() => {
    const handlers = {
      updatePlayers: (data) => setPlayers(data),

      updateNPCs: (data) => setNpcs(data),

      lobbyUpdate: (data) => setReadyPlayers(data.ready),

      gameStarted: () => setGameState(SCREENS.GAME),

      rollRequested: (data) => {
        setPendingRoll(data);
      },

      rollResult: (data) => {
        setRollResults((prev) => ({
          ...prev,
          [data.playerId]: data
        }));
      },

      loginSuccess: (data) => {
        setUser(data);
        setGameState(SCREENS.LOBBY);
      },

      loginError: (msg) => {
        alert(msg);
      },

      mapData: (data) => setVisibleTiles(data)
    };

    // registra todos
    Object.entries(handlers).forEach(([event, fn]) => {
      socket.on(event, fn);
    });

    // cleanup
    return () => {
      Object.entries(handlers).forEach(([event, fn]) => {
        socket.off(event, fn);
      });
    };
  }, []);

  // envia login
  const handleLogin = () => {
    socket.emit("login", { username: name, password: "123" });
  };

  // movimentação (bloqueia mestre)
  const move = (dir) => {
    if (isMaster) return;

    const validDirs = ["up", "down", "left", "right"];

    if (!validDirs.includes(dir)) return;

    socket.emit("move", dir);
  };

  // interação com mapa
  const handleTileClick = (x, y) => {
    socket.emit("interact", { x, y });
  };

    // ===== TELA DE LOGIN =====
  if (gameState === SCREENS.LOGIN) {
    return (
      <div>
        <h2>Login</h2>
        <input
          placeholder="Usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }

  if (gameState === SCREENS.LOBBY) {
    return <Lobby
      user={user}
      players={players}
      readyPlayers={readyPlayers}
    />;
  }
  
  return (
  <GameLayout
    left={
      <Map
        players={players}
        npcs={npcs}
        visibleTiles={visibleTiles}
        isMaster={isMaster}
        onTileClick={handleTileClick}
        myId={user.id}
      />
    }

    right={
      isMaster
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
      isPlayer
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