import styles from "../css/PlayGame.module.css";
import Button from "../components/Button";
import { useContext, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

import Pong from "../image/Pong.png";
import { context } from "../App";
import { useNavigate } from "react-router";

export default function PlayGame() {
	const ws = useContext(context);
	const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });
	const [booleanButton, setBooleanButton] = useState(false);
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
							if (!booleanButton) {
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
						text={booleanButton ? "Leave Queue" : "Queue Up"}
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
