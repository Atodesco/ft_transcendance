import styles from "../../css/Chat.module.css";
import { useState } from "react";

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
	// const [selectedChat, setSelectedChat] = useState(0);
	return (
		<>
			{dataChannels.map((value: any, index: any) => {
				return (
					<div
						className={styles.flex}
						key={index}
						id={index.toString()}
						onClick={() => {
							if (value.id != channelState) {
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
						{/* <p>
            {value.messages[value.messages.length - 1].user.username} :{" "}
            {value.messages[value.messages.length - 1].message}
          </p> */}
					</div>
				);
			})}
		</>
	);
}
