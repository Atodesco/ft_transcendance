import styles from "../../css/Chat.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import Channels from "./Channels";
import Messages from "./Messages";
import Chatabase from "./chatabase.json";
import DatabaseChannel from "./databaseChannels.json";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import * as React from "react";

import { io } from "socket.io-client";

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [channelSelected, setChannelSelected] = useState("");
  const [messages, setMessages] = useState("");
  const [openModal, setOpenModal] = React.useState(false);

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
  }, []);

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
            options={DatabaseChannel}
            sx={{ width: 673 }}
            getOptionLabel={(option) => option.channelname}
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
                const channel = DatabaseChannel.find((value: any) => {
                  return value.channelname === channelSelected;
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
              <TextField label="Enter a Name ..." variant="standard" />
              <TextField
                label="Choose a Password ..."
                variant="standard"
                type="password"
              />
              <Button
                text="Create"
                className={styles.create}
                onClick={handleCloseModal}
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
