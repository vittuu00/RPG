import styles from "./Lobby.module.css";
import { socket } from "../../socket";

function Lobby({ user, players, readyPlayers }) {
  const isMaster = user?.role === "mestre";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sala de Espera</h1>

        <div className={styles.players}>
          {Object.values(players).map((player) => {
            const isReady = readyPlayers.includes(player.id);

            return (
              <div key={player.id} className={styles.player}>
                {isReady ? "🟢" : "🟡"} {player.username}
              </div>
            );
          })}
        </div>

        <button
          disabled={readyPlayers.includes(user.id)}
          onClick={() => socket.emit("playerReady")}
        >
          {readyPlayers.includes(user.id)
            ? "Pronto"
            : "Estou pronto"}
        </button>

        {isMaster && (
          <button onClick={() => socket.emit("startGame")}>
            Iniciar jogo
          </button>
        )}
      </div>
    </div>
  );
}

export default Lobby;