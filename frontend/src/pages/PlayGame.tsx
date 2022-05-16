import styles from "../css/PlayGame.module.css";
import Button from "../components/Button";
import React, { Component, useState } from "react";
import { useStopwatch } from "react-timer-hook";

import Pong from "../image/Pong.png";

export default function PlayGame() {
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [booleanButton, setBooleanButton] = useState(false);
  const [textQueueButton, setTextQueueButton] = useState("Queue Up");
  return (
    <>
      <div className={styles.Pong}>
        <img src={Pong} alt="" />
      </div>
      <div className={styles.game}>
        <div className={styles.Buttons}>
          <Button
            id={styles.queueUpButton}
            onClick={() => {
              if (!booleanButton) {
                start();
                const queueTimer = document.getElementById(styles.timer);
                if (queueTimer) {
                  queueTimer.style.opacity = "1";
                }
                setTextQueueButton("Leave Queue");
              } else {
                reset();
                const queueTimer = document.getElementById(styles.timer);
                if (queueTimer) {
                  queueTimer.style.opacity = "0";
                }
                setTextQueueButton("Queue Up");
              }
              setBooleanButton(!booleanButton);
            }}
            text={textQueueButton}
          />
          <Button text="Spectate" />
        </div>
        <div>
          <div id={styles.timer}>
            <span>{minutes}</span> : <span>{seconds}</span>
          </div>
        </div>
      </div>
    </>
  );
}
