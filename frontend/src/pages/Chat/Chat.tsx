import styles from "../../css/Chat.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import Channels from "./Channels";
import Messages from "./Messages";
import Chatabase from "./chatabase.json";
// import DatabaseChannel from "./databaseChannels.json";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import * as React from "react";

import { io } from "socket.io-client";
import { ftruncate } from "fs";

export default function Chat() {
	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState("");
	const [openModal, setOpenModal] = React.useState(false);
	const [password, setPassword] = useState("");
	const [channelName, setChannelName] = useState("");
	const [databaseChannel, setDatabaseChannel] = useState<any>([]);
	const [channelUserJoined, setChannelUserJoined] = useState<any>([]);
	const [channelSelected, setChannelSelected] = useState(0);
	const [searchBarState, setSearchBarState] = useState<any>();

	const p: any = { ini: 1 };
	let [userInfo, setUserInfo] = useState<any>(p);
	let ws = useRef(p);
	let flag = useRef(p);

	const getUserInfo = async () => {
		const myData = await fetch(
			process.env.REACT_APP_BACK_URL +
				":" +
				process.env.REACT_APP_BACK_PORT +
				"/user/me/",
			{
				credentials: "include", //this is what I need to tell the browser to include cookies
			}
		);
		setUserInfo(await myData.json());
	};

	useEffect(() => {
		if (flag.current.ini) {
			getUserInfo();
			flag.current = {};
		}
		getChannels();
	}, []);

	useEffect(() => {
		if (ws.current.ini && userInfo.ft_id) {
			ws.current = io("http://localhost:3000?ft_id=" + userInfo.ft_id);
		}
	}, [userInfo]);

	useEffect(() => {
		if (userInfo.ft_id) {
			let arr: any = [];
			databaseChannel.map((value: any, index: any) => {
				if (userInfo.channels.includes(value.id)) {
					arr.push(value);
				}
			});
			setChannelUserJoined(arr);

			ws.current.on("searchChannel", (channel: any) => {
				let tmp = databaseChannel.slice();
				tmp.push(channel);
				setDatabaseChannel(tmp);
			});
			setSearchBarState(
				databaseChannel.filter((channel: any) => {
					if (!userInfo.channels.includes(channel.id)) {
						return channel.channelname;
					}
				})
			);
		}
	}, [databaseChannel]);

	useEffect(() => {
		if (userInfo.ft_id) {
			ws.current.on("myChannel", (channel: any) => {
				let tmp = channelUserJoined.slice();
				tmp.push(channel);
				setChannelUserJoined(tmp);
			});
		}
	}, [channelUserJoined]);

	useEffect(() => {
		if (userInfo.ft_id) {
			ws.current.on("text", (data: any) => {
				console.log("SALUT :", data);
				let newTmp = JSON.parse(messages.slice());
				newTmp.push({
					message: data,
					user: userInfo.ft_id,
					date: "2020-01-01",
				});
				setMessages(JSON.stringify(newTmp));
			});
		}
	}, [messages]);

	let getChannels = async () => {
		const rawData = await fetch(
			process.env.REACT_APP_BACK_URL +
				":" +
				process.env.REACT_APP_BACK_PORT +
				"/chat/channel",
			{ credentials: "include" }
		);
		const data = await rawData.json();
		setDatabaseChannel(data);
	};
	let selectChannel = () => {
		Chatabase.map((value: any, index: any) => {
			if (value.channelname === channelSelected)
				setMessages(JSON.stringify(value.messages));
		});
	};
	useEffect(() => {
		selectChannel();
	}, [channelSelected]);
	const handleOpenModal = () => {
		setOpenModal(true);
	};
	const handleCloseModal = () => {
		setPassword("");
		setChannelName("");
		setOpenModal(false);
	};
	return (
		<div>
			<div className={styles.searchChannels}>
				<div className={styles.search}>
					<Autocomplete
						disablePortal
						clearOnEscape={true}
						options={searchBarState}
						sx={{ width: 673 }}
						// filterOptions={(options: any, state: object) => {
						// 	return options.filter((channel: any) => {
						// 		if (!userInfo.channels.includes(channel.id)) {
						// 			return channel.channelname;
						// 		}
						// 	});
						// }}
						getOptionLabel={(channel: any) => {
							return channel.channelname;
						}}
						value={searchBarState}
						onChange={async (event, value) => {
							if (value) {
								ws.current.emit("joinChannel", { channelId: value.id });
							}
							if (searchBarState.length) {
								const search = searchBarState.filter((channel: any) => {
									if (
										!userInfo.channels.includes(channel.id) &&
										value.id !== channel.id
									) {
										return channel;
									}
								});
								console.log(search);
								setSearchBarState(search);
							}
						}}
						renderInput={(params) => {
							return <TextField {...params} label="Search Channel" />;
						}}
					/>
				</div>
			</div>
			<div className={styles.chat}>
				<div className={styles.chatHistory}>
					{messages && <Messages myMessages={JSON.parse(messages)}></Messages>}
				</div>
				<div className={styles.chatBar}>
					<TextField
						variant="outlined"
						fullWidth
						label={channelSelected ? "Enter a message ..." : "Select a channel"}
						onChange={(e: any) => setInputText(e.target.value)}
						value={inputText}
						disabled={!channelSelected}
						onKeyDown={(e) => {
							if (e.key === "Enter" && inputText) {
								const channel = databaseChannel.find((value: any) => {
									return value.id === channelSelected;
								});
								const dataToSend = {
									channelname: channel?.channelname,
									message: inputText,
								};
								ws.current.emit("text", dataToSend);
								setInputText("");
							}
						}}
					/>
				</div>
			</div>
			<div className={styles.myChats}>
				<h1>My Chats</h1>
				<div className={styles.button}>
					<Button text="Create Channel" onClick={handleOpenModal}>
						<FontAwesomeIcon icon={faPlusCircle} />
					</Button>
					<Modal
						open={openModal}
						onClose={handleCloseModal}
						className={styles.modal}
					>
						<Box
							component="form"
							sx={{
								"& > :not(style)": { m: 1, width: "25ch" },
							}}
							autoComplete="off"
							className={styles.boxModal}
						>
							<TextField
								label="Enter a Name ..."
								variant="standard"
								onChange={(e: any) => setChannelName(e.target.value)}
								value={channelName}
							/>
							<TextField
								label="Choose a Password ..."
								variant="standard"
								type="password"
								onChange={(e: any) => setPassword(e.target.value)}
								value={password}
							/>
							<Button
								text="Create"
								className={styles.create}
								onClick={async () => {
									handleCloseModal();
									ws.current.emit("createChannel", {
										channelname: channelName,
										password: password,
									});
								}}
							/>
						</Box>
					</Modal>
				</div>
				<div className={styles.trucblanc}>
					<Channels
						myChats={channelUserJoined}
						channelState={setChannelSelected}
					></Channels>
				</div>
			</div>
		</div>
	);
}
