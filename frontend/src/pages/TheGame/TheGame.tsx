import styles from "../../css/TheGame.module.css";
import * as React from "react";
import Modal from "@mui/material/Modal";
import "animate.css";

export default function TheGame() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.page}>
      <button
        className={`${styles.buttons} ${styles.victory}`}
        onClick={handleOpen}
      >
        VICTORY
      </button>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.endscreen}> Victory !</div>
      </Modal>
      <button className={`${styles.buttons} ${styles.defeat}`}>DEFEAT</button>
      <button className={`${styles.buttons} ${styles.goal}`}>GOAL</button>
      <div className={styles.containerGame}>
        <div className={styles.score}>
          <div id="rightScore">0</div>
          <div id="leftScore">0</div>
        </div>
        <div className={`${styles.names} ${styles.leftName}`}>Lacruype</div>
        <div className={`${styles.names} ${styles.rightName}`}>Rledrin</div>
        <div className={styles.ball}></div>
        <div className={`${styles.paddle} ${styles.leftPaddle}`}></div>
        <div className={`${styles.paddle} ${styles.rightPaddle}`}></div>
      </div>
    </div>
  );
}
