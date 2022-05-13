import styles from "../../css/Chat.module.css";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import Channels from "./Channels";
import Messages from "./Messages";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { io } from "socket.io-client";

export default function Chat() {
	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState<any>([]);
	const [openModal, setOpenModal] = useState(false);
	const [password, setPassword] = useState("");
	const [channelName, setChannelName] = useState("");
	const [databaseChannel, setDatabaseChannel] = useState<any>([]);
	const [channelUserJoined, setChannelUserJoined] = useState<any>([]);
	const [channelSelected, setChannelSelected] = useState(0);
	const [searchBarState, setSearchBarState] = useState<any>();

	const p: any = { ini: 1 };
	const [userInfo, setUserInfo] = useState<any>(p);
	const ws = useRef(p);
	const flag = useRef(p);

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
		if (flag.current.ini) {
			getUserInfo();
			flag.current = {};
		}
		getChannels();
	}, []);

	useEffect(() => {
		if (ws.current.ini && userInfo.ft_id) {
			ws.current = io("http://localhost:3000?ft_id=" + userInfo.ft_id);
			ws.current.on("text", (data: any) => {
				setMessages((message: any) => {
					let newMessage = message.slice();
					if (newMessage.length) {
						newMessage.push({
							message: data.message,
							user: data.user,
							date: data.date,
						});
					} else {
						newMessage = [
							{
								message: data.message,
								user: data.user,
								date: data.date,
							},
						];
					}
					return newMessage;
				});
				const storedMessages = sessionStorage.getItem(
					"messages" + data.channelId
				);
				let parsedMessages;
				if (storedMessages) {
					parsedMessages = JSON.parse(storedMessages);
					parsedMessages.push({
						message: data.message,
						user: data.user,
						date: data.date,
					});
				} else {
					parsedMessages = [
						{
							message: data.message,
							user: data.user,
							date: data.date,
						},
					];
				}
				sessionStorage.setItem(
					"messages" + data.channelId,
					JSON.stringify(parsedMessages)
				);
			});
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
		setInputText("");

		const messagesStorage = sessionStorage.getItem(
			"messages" + channelSelected
		);
		if (messagesStorage) {
			setMessages(JSON.parse(messagesStorage));
		} else {
			setMessages([]);
		}
	}, [channelSelected]);

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
					{messages && <Messages myMessages={messages}></Messages>}
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
								let channel = databaseChannel.find((value: any) => {
									return value.id === channelSelected;
								});
								if (!channel) {
									channel = channelUserJoined.find((value: any) => {
										return value.id === channelSelected;
									});
								}
								const dataToSend = {
									channelId: channel?.id,
									message: inputText,
									date: new Date(),
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
