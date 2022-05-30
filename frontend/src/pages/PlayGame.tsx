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
	const [booleanButton2, setBooleanButton2] = useState(true);
	const [ball, setBall] = useState("");
	const [ballUrl, setBallUrl] = useState("");
	const [userInfo, setUserInfo] = useState<any>();
	const navigate = useNavigate();

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

	useEffect(() => {
		ws.on("gameFound", () => {
			navigate("/TheGame");
		});

		getUserInfo();
	}, []);

	useEffect(() => {
		if (userInfo) setBallUrl(userInfo.ball);
	}, [userInfo]);

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
							if (booleanButton2) {
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
							}
						}}
						text={booleanButton ? "Queue Up" : "Leave Queue"}
					/>
					<Button
						onClick={() => {
							if (booleanButton) {
								if (booleanButton2) {
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
									ws.emit("queueSpectate");
								} else {
									ws.emit("removeSocket", { spectate: true });
								}
								setBooleanButton2(!booleanButton2);
							}
						}}
						text={booleanButton2 ? "Spectate" : "Cancel"}
					/>
				</div>
				<div>
					<div id={styles.timer}>
						<span>{minutes}</span> : <span>{seconds}</span>
					</div>
				</div>
				<div className={styles.customization}>
					<Stack className={styles.stackButton}>
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
							<InputLabel>Ball Type</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								value={ball}
								label="Ball Type"
								onChange={(e) => {
									setBall(e.target.value);
								}}
							>
								<MenuItem
									value={ball}
									onClick={async () => {
										await fetch(
											process.env.REACT_APP_BACK_URL +
												":" +
												process.env.REACT_APP_BACK_PORT +
												"/user/" +
												(await userInfo.ft_id) +
												"/setBall",
											{
												headers: { "Content-Type": "application/json" },
												method: "POST",
												body: JSON.stringify({
													link: "https://www.pngmart.com/files/21/Football-PNG-Isolated-HD.png",
												}),
											}
										);
										getUserInfo();
									}}
								>
									FootBall
								</MenuItem>
								<MenuItem
									value={ball}
									onClick={async () => {
										await fetch(
											process.env.REACT_APP_BACK_URL +
												":" +
												process.env.REACT_APP_BACK_PORT +
												"/user/" +
												(await userInfo.ft_id) +
												"/setBall",
											{
												headers: { "Content-Type": "application/json" },
												method: "POST",
												body: JSON.stringify({
													link: "https://cdn.pixabay.com/photo/2019/11/05/21/32/ball-4604616_1280.png",
												}),
											}
										);
										getUserInfo();
									}}
								>
									VolleyBall
								</MenuItem>
								<MenuItem
									value={ball}
									onClick={async () => {
										await fetch(
											process.env.REACT_APP_BACK_URL +
												":" +
												process.env.REACT_APP_BACK_PORT +
												"/user/" +
												(await userInfo.ft_id) +
												"/setBall",
											{
												headers: { "Content-Type": "application/json" },
												method: "POST",
												body: JSON.stringify({
													link: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Basketball_Clipart.svg/768px-Basketball_Clipart.svg.png",
												}),
											}
										);
										getUserInfo();
									}}
								>
									BasketBall
								</MenuItem>
								<MenuItem
									value={ball}
									onClick={async () => {
										await fetch(
											process.env.REACT_APP_BACK_URL +
												":" +
												process.env.REACT_APP_BACK_PORT +
												"/user/" +
												(await userInfo.ft_id) +
												"/setBall",
											{
												headers: { "Content-Type": "application/json" },
												method: "POST",
												body: JSON.stringify({
													link: "",
												}),
											}
										);
										getUserInfo();
									}}
								>
									Normal
								</MenuItem>
							</Select>
							<div
								id="ball"
								style={{
									content: "url(" + ballUrl + ")",
								}}
								className={styles.ball}
							></div>
						</FormControl>
					</Stack>
				</div>
			</div>
		</>
	);
}
