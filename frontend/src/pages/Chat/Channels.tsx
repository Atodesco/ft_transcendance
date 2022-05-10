import styles from "../../css/Chat.module.css";
import { useState } from "react";

export default function channels({ myChats, channelState }: any) {
  return <div id={styles.channel}>{Item(myChats, channelState)}</div>;
}

function Item(dataChannels: any, channelState: any) {
  const [selectedChat, setSelectedChat] = useState("");
  return (
    <>
      {dataChannels.map((value: any, index: any) => (
        <div
          className={styles.flex}
          key={index}
          id={index.toString()}
          onClick={() => {
            setSelectedChat(value.channelname);
            channelState(value.channelname);
          }}
          style={{
            backgroundColor:
              selectedChat === value.channelname ? "#38B2AC" : "#E8E8E8",
          }}
        >
          <h1> {value.channelname}</h1>
          <p>
            {value.messages[value.messages.length - 1].user.username} :{" "}
            {value.messages[value.messages.length - 1].message}
          </p>
        </div>
      ))}
    </>
  );
}
