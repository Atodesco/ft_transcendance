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
import DatabaseChannel from "./databaseChannels.json";
import Autocomplete from "@mui/material/Autocomplete";
import Popup from "reactjs-popup";

import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { valueToPercent } from "@mui/base";

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [displayChannel, setDisplayChannel] = useState("");
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
          {/* <TextField
            variant="outlined"
            fullWidth
            label="Search Channels"
            onChange={inputHandler}
          />
          <div className={styles.dropdown}>{displayChannel}</div> */}
        </div>
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
          <Popup
            trigger={
              <Button text="Create Channel">
                <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            }
            modal
            nested
          >
            <div className={styles.modal}>
              <TextField>NOM</TextField>
              <TextField>MOT DE PASSE</TextField>
              <Button text="Close Popup"></Button>
            </div>
          </Popup>
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

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
];
