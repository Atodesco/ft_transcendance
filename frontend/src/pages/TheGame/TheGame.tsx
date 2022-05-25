import styles from "../../css/TheGame.module.css";
import * as React from "react";
import Modal from "@mui/material/Modal";
import "animate.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-animated-progress-bar";
import { PieChart } from "react-minimal-pie-chart";
import Countdown from "react-countdown";
import { context } from "../../App";

export default function TheGame() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    ws.emit("start");
    setOpen2(false);
  };
  const [userInfo, setUserInfo] = React.useState<any>();

  const [usernames, setUsernames] = React.useState({ p1: "", p2: "" });
  const [score, setScore] = React.useState({ p1: 0, p2: 0 });

  const ws = React.useContext(context);

  const getUserInfo = async () => {
    const myData = await fetch(
      process.env.REACT_APP_BACK_URL +
        ":" +
        process.env.REACT_APP_BACK_PORT +
        "/user/me/",
      {
        credentials: "include",
      }
    );
    setUserInfo(await myData.json());
  };

  React.useEffect(() => {
    const ball = document.getElementById("ball");
    ws.on(
      "room",
      (data: { code: string; p1Username: string; p2Username: string }) => {
        setUsernames({ p1: data.p1Username, p2: data.p2Username });
      }
    );
    ws.on("ball", () => {});
    ws.on("score", (data: { p1: number; p2: number }) => {
      setScore({ p1: data.p1, p2: data.p2 });
    });
    ws.emit("ready");
    ws.on("ball", (data: { x: number; y: number }) => {
      const ball = document.getElementById("ball");
      console.log("ici");
      if (ball) {
        ball.style.setProperty("--x", data.x + "%");
        ball.style.setProperty("--y", data.y + "%");
        console.log(data.x, data.y);
      }
    });
    getUserInfo();
  }, []);

  const renderer = ({ formatted: { hours, minutes, seconds } }: any) => {
    return <span>{seconds}</span>;
  };

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
            <div className={styles.stats}>STATS</div>
            <div className={styles.level}>
              <ProgressBar
                trackWidth="0.5vh"
                height="3vh"
                rect
                fontColor="white"
                percentage={70}
                rectPadding="0.1vh"
                rectBorderRadius="2vh"
                trackPathColor="transparent"
                bgColor="#333333"
                trackBorderColor="white"
              />
            </div>
            <div className={styles.fromlevel}>From Level 3</div>
            <div className={styles.ratioWinLoose}>
              <PieChart
                lineWidth={60}
                label={({ dataEntry }) =>
                  Math.round(dataEntry.percentage) + "%"
                }
                labelPosition={100 - 60 / 2}
                labelStyle={{
                  fill: "#fff",
                  opacity: 0.75,
                  pointerEvents: "none",
                }}
                data={[
                  { title: "Win", value: 10, color: "green" },
                  { title: "Lose", value: 5, color: "red" },
                ]}
              />
            </div>
            <div className={styles.ratioWinLoosePhrase}>
              {" <= Ratio Win/Loose "}
            </div>
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
        <div className={styles.endscreen}>
          <div
            className={`${styles.endscreenMessage} animate__animated animate__hinge ${styles.defeat}`}
            style={{ color: "red" }}
          >
            Defeat ...
          </div>
          <div className={styles.endscreenStats}>
            <div className={styles.stats}>STATS</div>
            <div className={styles.level}>
              <ProgressBar
                trackWidth="0.5vh"
                height="3vh"
                rect
                fontColor="white"
                percentage={70}
                rectPadding="0.1vh"
                rectBorderRadius="2vh"
                trackPathColor="transparent"
                bgColor="#333333"
                trackBorderColor="white"
              />
            </div>
            <div className={styles.fromlevel}>From Level 3</div>
            <div className={styles.ratioWinLoose}>
              <PieChart
                lineWidth={60}
                label={({ dataEntry }) =>
                  Math.round(dataEntry.percentage) + "%"
                }
                labelPosition={100 - 60 / 2}
                labelStyle={{
                  fill: "#fff",
                  opacity: 0.75,
                  pointerEvents: "none",
                }}
                data={[
                  { title: "Win", value: 10, color: "green" },
                  { title: "Lose", value: 5, color: "red" },
                ]}
              />
            </div>
            <div className={styles.ratioWinLoosePhrase}>
              {" <= Ratio Win/Loose "}
            </div>
          </div>
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
      <button
        className={`${styles.buttons} ${styles.countdown}`}
        onClick={handleOpen2}
      >
        Countdown
      </button>
      <Modal disableEscapeKeyDown open={open2}>
        <div className={`${styles.endscreen} ${styles.endscreenCountdown}`}>
          <Countdown
            date={Date.now() + 3000}
            daysInHours={true}
            zeroPadTime={1}
            onComplete={() => {
              handleClose2();
              ws.emit("start");
            }}
            renderer={renderer}
          />
        </div>
      </Modal>
      <button
        className={styles.buttons}
        onClick={() => {
          ws.emit("stop");
        }}
      >
        Exit
      </button>
      <div className={styles.containerGame} id="containerGame">
        <div className={styles.score}>
          <div id="leftScore">{score.p1}</div>
          <div id="rightScore">{score.p2}</div>
        </div>
        <div className={`${styles.names} ${styles.leftName}`}>
          {usernames.p1}
        </div>
        <div className={`${styles.names} ${styles.rightName}`}>
          {usernames.p2}
        </div>
        {userInfo && (
          <div
            id="ball"
            className={styles.ball}
            style={{ content: "url(" + userInfo.ball + ")" }}
          ></div>
        )}
        <div
          id="leftPaddle"
          className={`${styles.paddle} ${styles.leftPaddle}`}
        ></div>
        <div
          id="rightPaddle"
          className={`${styles.paddle} ${styles.rightPaddle}`}
        ></div>
      </div>
    </div>
  );
}
