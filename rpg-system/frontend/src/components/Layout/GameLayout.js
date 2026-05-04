import styles from "./GameLayout.module.css";

function GameLayout({ left, right, bottom }) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.left}>{left}</div>
        <div className={styles.right}>{right}</div>
      </div>

      <div className={styles.bottom}>{bottom}</div>
    </div>
  );
}

export default GameLayout;