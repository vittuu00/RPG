import styles from "./Lobby.module.css";
import { socket } from "../../socket";

function Lobby({ user, readyPlayers }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sala de Espera</h1>

        <div className={styles.players}>
          {readyPlayers.map((id) => (
            <div key={id} className={styles.player}>
              🧍 {id}
            </div>
          ))}
        </div>

        <button onClick={() => socket.emit("playerReady")}>
          Estou pronto
        </button>

        {user.role === "mestre" && (
          <button onClick={() => socket.emit("startGame")}>
            Iniciar jogo
          </button>
        )}
      </div>
    </div>
  );
}

export default Lobby;