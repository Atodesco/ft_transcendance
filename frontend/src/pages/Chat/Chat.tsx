import styles from "../../css/Chat.module.css";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import Channels from "./Channels";
import Messages from "./Messages";
import { useEffect } from "react";
import Chatabase from "./chatabase.json";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { valueToPercent } from "@mui/base";

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [channelSelected, setChannelSelected] = useState("");
  const [messages, setMessages] = useState("");
  let inputHandler = (e: any) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
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
  return (
    <div>
      <div className={styles.searchChannels}>
        <TextField
          className={styles.Search}
          variant="outlined"
          fullWidth
          label="Search Channels"
          onChange={inputHandler}
        />
      </div>
      <div className={styles.chat}>
        <div className={styles.chatHistory}>
          {messages && <Messages myMessages={JSON.parse(messages)}></Messages>}
        </div>
        <div className={styles.chatBar}>
          <TextField
            id={styles.outlinedBasic}
            variant="outlined"
            fullWidth
            label="Enter a message ..."
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className={styles.myChats}>
        <h1>My Chats</h1>
        <div className={styles.button}>
          <Button text="Create Channel">
            <FontAwesomeIcon icon={faPlusCircle} />
          </Button>
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
