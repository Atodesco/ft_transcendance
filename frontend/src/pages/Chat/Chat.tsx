import styles from "../../css/Chat.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import Channels from "./Channels";
import Messages from "./Messages";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { context } from "../../App";

export default function Chat() {
	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState<any>([]);
	const [openModalCreateChannel, setOpenModalCreateChannel] = useState(false);
	const [openModalJoinChannel, setOpenModalJoinChannel] = useState(false);
	const [password, setPassword] = useState("");
	const [channelName, setChannelName] = useState("");
	const [databaseChannel, setDatabaseChannel] = useState<any>([]);
	const [channelUserJoined, setChannelUserJoined] = useState<any>([]);
	const [channelSelected, setChannelSelected] = useState(0);
	const [searchBarState, setSearchBarState] = useState<any>();
	const [joinChannel, setJoinChannel] = useState<any>();

	const p: any = { ini: 1 };
	const [userInfo, setUserInfo] = useState<any>(p);
	const ws = useContext(context);
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
			const messagesStorage = sessionStorage.getItem("messages");
			if (messagesStorage) {
				setMessages(JSON.parse(messagesStorage));
			}
		}
		getChannels();
	}, []);

	useEffect(() => {
		if (userInfo.ft_id) {
			ws.on("text", (data: any) => {
				console.log("message", data.message);
				console.log("data.channelId", data.channelId);
				console.log("channelSelected", channelSelected);
				console.log("data.channelId === channelSelected");
				setMessages((message: any) => {
					let newMessage = message.slice();
					if (newMessage.length) {
						newMessage.push({
							channelId: data.channelId,
							message: data.message,
							user: data.user,
							date: data.date,
						});
					} else {
						newMessage = [
							{
								channelId: data.channelId,
								message: data.message,
								user: data.user,
								date: data.date,
							},
						];
					}
					return newMessage;
				});
				const storedMessages = sessionStorage.getItem("messages");
				let parsedMessages;
				if (storedMessages) {
					parsedMessages = JSON.parse(storedMessages);
					parsedMessages.push({
						channelId: data.channelId,
						message: data.message,
						user: data.user,
						date: data.date,
					});
				} else {
					parsedMessages = [
						{
							channelId: data.channelId,
							message: data.message,
							user: data.user,
							date: data.date,
						},
					];
				}
				sessionStorage.setItem("messages", JSON.stringify(parsedMessages));
			});
			ws.on("joinedChannel", (data: any) => {
				if (searchBarState.length) {
					setSearchBarState((searchBar: any) => {
						let newSbs = searchBar.slice();
						const search = newSbs.filter((channel: any) => {
							if (
								!userInfo.channels.includes(channel.id) &&
								data.channelId !== channel.id
							) {
								return channel;
							}
							return search;
						});
					});
				}
			});
			ws.on("userData", (data: any) => {
				setUserInfo(data);
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

			ws.on("searchChannel", (channel: any) => {
				let tmp = databaseChannel.slice();
				tmp.push(channel);
				setDatabaseChannel(tmp);
				ws.emit("GetUserData");
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
			ws.on("myChannel", (channel: any) => {
				let tmp = channelUserJoined.slice();
				tmp.push(channel);
				setChannelUserJoined(tmp);
				ws.emit("GetUserData");
			});
		}
	}, [channelUserJoined]);

	useEffect(() => {
		setInputText("");
		console.log("channelSelected à été set à: ", channelSelected);
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
		setOpenModalCreateChannel(true);
	};
	const handleCloseModal = () => {
		setPassword("");
		setChannelName("");
		setOpenModalCreateChannel(false);
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
							if (value && !value.private) {
								ws.emit("joinChannel", { channelId: value.id });
								if (searchBarState.length) {
									const search = searchBarState.filter((channel: any) => {
										if (
											!userInfo.channels.includes(channel.id) &&
											value.id !== channel.id
										) {
											return channel;
										}
									});
									setSearchBarState(search);
								}
							} else if (value && value.private) {
								setJoinChannel(value);
								setOpenModalJoinChannel(true);
							}
						}}
						renderInput={(params) => {
							return <TextField {...params} label="Search Channel" />;
						}}
					/>
					<Modal
						open={openModalJoinChannel}
						onClose={() => {
							setOpenModalJoinChannel(false);
						}}
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
									setOpenModalJoinChannel(false);
									ws.emit("joinChannel", {
										channelId: joinChannel.id,
										password: password,
									});

									setPassword("");
								}}
							/>
						</Box>
					</Modal>
				</div>
			</div>
			<div className={styles.chat}>
				<div className={styles.chatHistory}>
					{messages && (
						<Messages
							myMessages={messages}
							channelSelected={channelSelected}
							userInfo={userInfo}
						></Messages>
					)}
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
								ws.emit("text", dataToSend);
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
						open={openModalCreateChannel}
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
									ws.emit("createChannel", {
										channelname: channelName,
										password: password,
									});
									setChannelName("");
									setPassword("");
								}}
							/>
						</Box>
					</Modal>
				</div>
				<div className={styles.trucblanc}>
					<Channels
						myChats={channelUserJoined}
						setChannelState={setChannelSelected}
						channelState={channelSelected}
					/>
				</div>
			</div>
		</div>
	);
}
