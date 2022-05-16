import styles from "../../css/TheGame.module.css";
import * as React from "react";
import Modal from "@mui/material/Modal";
import "animate.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-animated-progress-bar";

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
        <div className={styles.endscreen}>
          <div
            className={`${styles.endscreenMessage} animate__animated animate__zoomInUp`}
            style={{ color: "gold" }}
          >
            Victory !
          </div>
          <div className={styles.endscreenStats}>
            STATS
            <ProgressBar
              className={styles.Level}
              width="200px"
              height="10px"
              rect
              fontColor="gray"
              percentage={70}
              // percentage={userData.levelProgress.toString()}
              rectPadding="1px"
              rectBorderRadius="20px"
              trackPathColor="transparent"
              bgColor="#333333"
              trackBorderColor="grey"
            />
          </div>
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
      <DropdownButton
        className={`${styles.buttons} ${styles.customBall}`}
        id="dropdown-basic-button"
        title="Customize the Ball"
      >
        <Dropdown.Item
          as="button"
          onClick={() => {
            document.getElementById("ball")?.classList.add(styles.football);
            document
              .getElementById("ball")
              ?.classList.remove(styles.basketball);
            document
              .getElementById("ball")
              ?.classList.remove(styles.volleyball);
          }}
        >
          Footall
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            document.getElementById("ball")?.classList.add(styles.basketball);
            document
              .getElementById("ball")
              ?.classList.remove(styles.volleyball);
            document.getElementById("ball")?.classList.remove(styles.football);
          }}
        >
          BasketBall
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            document.getElementById("ball")?.classList.add(styles.volleyball);
            document
              .getElementById("ball")
              ?.classList.remove(styles.basketball);
            document.getElementById("ball")?.classList.remove(styles.football);
          }}
        >
          Volley
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            document
              .getElementById("ball")
              ?.classList.remove(styles.volleyball);
            document
              .getElementById("ball")
              ?.classList.remove(styles.basketball);
            document.getElementById("ball")?.classList.remove(styles.football);
          }}
        >
          Normal
        </Dropdown.Item>
      </DropdownButton>
      <div className={styles.containerGame} id="containerGame">
        <div className={styles.score}>
          <div id="rightScore">0</div>
          <div id="leftScore">0</div>
        </div>
        <div className={`${styles.names} ${styles.leftName}`}>Lacruype</div>
        <div className={`${styles.names} ${styles.rightName}`}>Rledrin</div>
        <div id="ball" className={styles.ball}></div>
        <div className={`${styles.paddle} ${styles.leftPaddle}`}></div>
        <div className={`${styles.paddle} ${styles.rightPaddle}`}></div>
      </div>
    </div>
  );
}
