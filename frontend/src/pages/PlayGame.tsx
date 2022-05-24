import styles from "../css/PlayGame.module.css";
import Button from "../components/Button";
import { useContext, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

import Pong from "../image/Pong.png";
import { context } from "../App";
import { useNavigate } from "react-router";
import {
  Stack,
  Button as ButtonMui,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function PlayGame() {
  const ws = useContext(context);
  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });
  const [booleanButton, setBooleanButton] = useState(true);
  const [ball, setBall] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    ws.on("gameFound", () => {
      navigate("/TheGame");
    });
  }, []);

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
              if (booleanButton) {
                start();
                const queueTimer = document.getElementById(styles.timer);
                if (queueTimer) {
                  queueTimer.style.opacity = "1";
                }
              } else {
                reset();
                const queueTimer = document.getElementById(styles.timer);
                if (queueTimer) {
                  queueTimer.style.opacity = "0";
                }
              }
              if (booleanButton) {
                ws.emit("queue");
              } else {
                ws.emit("removeSocket");
              }

              setBooleanButton(!booleanButton);
            }}
            text={booleanButton ? "Queue Up" : "Leave Queue"}
          />
          <Button text="Spectate" />
        </div>
        <div>
          <div id={styles.timer}>
            <span>{minutes}</span> : <span>{seconds}</span>
          </div>
        </div>
        <div className={styles.customization}>
          <Stack
            className={styles.stackButton}
            // spacing={3}
            // divider={<Divider orientation="horizontal" />}
          >
            <h1
              style={{
                fontSize: "1.5vw",
                fontWeight: "Bold",
                textDecoration: "underline overline",
                alignSelf: "center",
              }}
            >
              Customize
            </h1>
            <FormControl
              style={{ backgroundColor: "darkgrey", borderRadius: "0.2vw" }}
              fullWidth
            >
              <InputLabel color="success">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={ball}
                label="Ball Type"
                onChange={(e) => {
                  setBall(e.target.value);
                }}
              >
                <MenuItem value={10}>FootBall</MenuItem>
                <MenuItem value={20}>VolleyBall</MenuItem>
                <MenuItem value={30}>BasketBall</MenuItem>
                <MenuItem value={30}>Normal</MenuItem>
              </Select>
            </FormControl>
            {/* <Divider variant="middle" /> */}
            {/* <DropdownButton
              className={`${styles.buttons} ${styles.customBall}`}
              id="dropdown-basic-button"
              title="Customize the Ball"
            >
              <Dropdown.Item
                as="button"
                onClick={() => {
                  document
                    .getElementById("ball")
                    ?.classList.add(styles.football);
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
                  document
                    .getElementById("ball")
                    ?.classList.add(styles.basketball);
                  document
                    .getElementById("ball")
                    ?.classList.remove(styles.volleyball);
                  document
                    .getElementById("ball")
                    ?.classList.remove(styles.football);
                }}
              >
                BasketBall
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  document
                    .getElementById("ball")
                    ?.classList.add(styles.volleyball);
                  document
                    .getElementById("ball")
                    ?.classList.remove(styles.basketball);
                  document
                    .getElementById("ball")
                    ?.classList.remove(styles.football);
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
                  document
                    .getElementById("ball")
                    ?.classList.remove(styles.football);
                }}
              >
                Normal
              </Dropdown.Item>
            </DropdownButton> */}
            <div
              id="ball"
              style={{
                content:
                  "url(https://www.pngmart.com/files/21/Football-PNG-Isolated-HD.png)",
              }}
              className={styles.ball}
            ></div>
          </Stack>
        </div>
      </div>
    </>
  );
}
