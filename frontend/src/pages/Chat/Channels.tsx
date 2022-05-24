import styles from "../../css/Chat.module.css";
import Button from "@mui/material/Button";
import { useState, useEffect, useRef, useContext } from "react";
import { context } from "../../App";

export default function channels({
	myChats,
	setChannelState,
	channelState,
}: any) {
	return (
		<>
			{myChats && (
				<div id={styles.channel}>
					{Item(myChats, setChannelState, channelState)}
				</div>
			)}
		</>
	);
}

function Item(dataChannels: any, setChannelState: any, channelState: any) {
	const ws = useContext(context);

	return (
		<>
			{dataChannels.map((value: any, index: any) => {
				console.log("value:", value);
				return (
					<div
						className={styles.flex}
						key={index}
						id={index.toString()}
						onClick={() => {
							if (value.id !== channelState) {
								console.log("Je set SelectedChannel à:", value.id);
								setChannelState(value.id);
							} else {
								console.log("Je set SelectedChannel à: 0");
								setChannelState(0);
							}
						}}
						style={{
							backgroundColor:
								channelState === value.id ? "#38B2AC" : "#E8E8E8",
						}}
					>
						<h1> {value.channelname}</h1>
						<Button
							className={styles.buttonQuitChannel}
							variant="contained"
							color="error"
							onClick={() => {
								console.log("Je quitte le channel:", value);
								ws.emit("leaveChannel", { channelId: value.id });
							}}
						>
							Quit
						</Button>
					</div>
				);
			})}
		</>
	);
}
