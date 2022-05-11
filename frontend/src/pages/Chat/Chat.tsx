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
  const [databaseChannel, setDatabaseChannel] = useState<any>();
  const [channelSelected, setChannelSelected] = useState(0);

  const p: any = { ini: 1 };
  let ws = useRef(p);

  useEffect(() => {
    if (ws.current.ini) {
      ws.current = io("http://localhost:3000?ft_id=57832");
      ws.current.on("text", (data: any) => {
        setMessages((messages: any) => {
          let newMessage = JSON.parse(messages);
          newMessage.push({
            message: data,
            user: {
              ft_id: 57832,
              username: "VraiRemi",
              picture: "avatarRemi.jpeg",
            },
            date: "2020-01-01",
          });
          return JSON.stringify(newMessage);
        });
      });
    }
    getChannels();
  }, []);
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
    setOpenModal(false);
  };
  return (
    <div>
      <div className={styles.searchChannels}>
        <div className={styles.search}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={databaseChannel}
            sx={{ width: 673 }}
            getOptionLabel={(option: any) => option.channelname}
            onChange={async (event, value) => {
              if (value) {
                const myData = await fetch(
                  process.env.REACT_APP_BACK_URL +
                    ":" +
                    process.env.REACT_APP_BACK_PORT +
                    "/user/me/",
                  {
                    credentials: "include", //this is what I need to tell the browser to include cookies
                  }
                );
                const data = await myData.json();
                const TOTALCHANNEL = await fetch(
                  process.env.REACT_APP_BACK_URL +
                    ":" +
                    process.env.REACT_APP_BACK_PORT +
                    "/" +
                    data.ft_id +
                    "/joinChannel/" +
                    value.id,
                  { credentials: "include" }
                );
                console.log("SALUTCESTMOI");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search Channel" />
            )}
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
                  const me = await fetch("http://localhost:3000/user/me/", {
                    credentials: "include",
                  });
                  const myData = await me.json();
                  const channel = await fetch(
                    "http://localhost:3000/user/" +
                      myData.ft_id +
                      "/createChannel",
                    {
                      credentials: "include",
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        channelname: channelName,
                        password: password,
                      }),
                    }
                  );
                  setPassword("");
                  setChannelName("");
                }}
              />
            </Box>
          </Modal>
        </div>
        <div className={styles.trucblanc}>
          <Channels
            myChats={Chatabase}
            channelState={setChannelSelected}
          ></Channels>
        </div>
      </div>
    </div>
  );
}
