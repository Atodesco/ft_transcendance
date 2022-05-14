import styles from "../../css/TheGame.module.css";
import * as React from "react";
import Modal from "@mui/material/Modal";
import "animate.css";
import { wait } from "@testing-library/user-event/dist/utils";
import { getElementError } from "@testing-library/react";

export default function TheGame() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  return (
    <div className={styles.page}>
      <button
        className={`${styles.buttons} ${styles.victory}`}
        onClick={handleOpen}
      >
        VICTORY
      </button>
      <Modal open={open} onClose={handleClose}>
        <div
          className={`${styles.endscreen} animate__animated animate__zoomInUp`}
          style={{ color: "gold" }}
        >
          Victory !
        </div>
      </Modal>
      <button
        className={`${styles.buttons} ${styles.defeat}`}
        onClick={handleOpen1}
      >
        DEFEAT
      </button>
      <Modal open={open1} onClose={handleClose1}>
        <div
          className={`${styles.endscreen} animate__animated animate__hinge`}
          style={{ color: "red" }}
        >
          Defeat ...
        </div>
      </Modal>
      <button
        className={`${styles.buttons} ${styles.goal}`}
        onClick={() => {
          document
            .getElementById("containerGame")
            ?.classList.toggle(styles.clignoter);
        }}
      >
        GOAL
      </button>
      <div className={styles.containerGame} id="containerGame">
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
