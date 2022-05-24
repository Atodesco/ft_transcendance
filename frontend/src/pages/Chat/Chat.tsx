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
  const [autocomplete, setAutocomplete] = useState("");

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
      const messagesStorage = sessionStorage.getItem("messages");
      if (messagesStorage) {
        setMessages(JSON.parse(messagesStorage));
      }
      ws.on("text", (data: any) => {
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
      ws.on("searchChannel", (channel1: any) => {
        setDatabaseChannel((dc: any) => {
          let newDatabaseChannel = dc.slice();
          newDatabaseChannel.push(channel1);
          return newDatabaseChannel;
        });
        ws.emit("GetUserData");
      });
      ws.on("myChannel", (channel2: any) => {
        const cha = {
          channelname: channel2.channelname,
          id: channel2.id,
          private: channel2.private,
        };
        if (channel2.add === true) {
          setChannelUserJoined((cj: any) => {
            let newChannelUserJoined = cj.slice();
            newChannelUserJoined.push(cha);
            return newChannelUserJoined;
          });
        } else {
          setChannelUserJoined((cj: any) => {
            let newChannelUserJoined = cj.slice();
            newChannelUserJoined.splice(newChannelUserJoined.indexOf(cha), 1);
            return newChannelUserJoined;
          });
          setChannelSelected((v: number) => {
            if (channel2.channelname === channelSelected) {
              return 0;
            }
            return v;
          });
        }
        ws.emit("GetUserData");
      });
      ws.on("userData", (data: any) => {
        setUserInfo(data);
      });
      getChannels();
      flag.current = {};
    }
  }, []);

  useEffect(() => {
    if (userInfo.ft_id) {
      let arr: any = [];
      console.log(databaseChannel);
      console.log("userInfo", userInfo);
      databaseChannel.map((value: any, index: any) => {
        if (userInfo.channels.includes(value.id)) {
          console.log("value", value);
          arr.push(value);
        }
      });
      setChannelUserJoined(arr);

      let arr2: any = [];
      databaseChannel.map((value: any, index: any) => {
        if (!userInfo.channels.includes(value.id) && value.dm === false) {
          arr2.push(value);
        }
      });
      setSearchBarState(arr2);
      // setSearchBarState(
      // 	databaseChannel.filter((channel: any) => {
      // 		if (!userInfo.channels.includes(channel.id) && channel.dm == false) {
      // 			return channel.channelname;
      // 		}
      // 	})
      // );
    }
  }, [databaseChannel]);

  useEffect(() => {
    getChannels();
  }, [userInfo]);

  useEffect(() => {
    setInputText("");
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
            autoHighlight
            options={searchBarState}
            sx={{ width: 673 }}
            getOptionLabel={(channel: any) => {
              return channel.channelname;
            }}
            inputValue={autocomplete}
            value={searchBarState}
            onChange={(event, value) => {
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
                  setAutocomplete("");
                }
              } else if (value && value.private) {
                setJoinChannel(value);
                setOpenModalJoinChannel(true);
                setAutocomplete("");
              }
            }}
            renderInput={(params) => {
              return (
                <TextField
                  onChange={(e) => {
                    setAutocomplete(e.target.value);
                  }}
                  {...params}
                  label="Search Channel"
                />
              );
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
                label="Type Password"
                variant="standard"
                type="password"
                onChange={(e: any) => setPassword(e.target.value)}
                value={password}
              />
              <Button
                text="Join"
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
