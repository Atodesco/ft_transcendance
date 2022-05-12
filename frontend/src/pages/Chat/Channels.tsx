import styles from "../../css/Chat.module.css";
import { useState } from "react";

export default function channels({ myChats, channelState }: any) {
	return (
		<>
			{/* <div id={styles.channel}>{Item(myChats, channelState)}</div> */}
			{myChats && <div id={styles.channel}>{Item(myChats, channelState)}</div>}
		</>
	);
}

function Item(dataChannels: any, channelState: any) {
	const [selectedChat, setSelectedChat] = useState(0);
	return (
		<>
			{dataChannels.map((value: any, index: any) => {
				return (
					<div
						className={styles.flex}
						key={index}
						id={index.toString()}
						onClick={() => {
							if (value.id != selectedChat) {
								setSelectedChat(value.id);
								channelState(value.id);
							} else {
								setSelectedChat(0);
								channelState(0);
							}
						}}
						style={{
							backgroundColor:
								selectedChat === value.id ? "#38B2AC" : "#E8E8E8",
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
