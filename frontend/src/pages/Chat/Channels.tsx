import styles from "../../css/Chat.module.css";
import Data from "databaseChannels.json";
import { useState } from "react";

export default function channels({ myChats }: any) {
  return <div id={styles.channel}>{Item(myChats)}</div>;
}

function changeColor() {}

function Item(
  data: [{ name: string; nameOfLast: string; lastMessage: string }]
) {
  const [selectedChat, setSelectedChat] = useState("");
  return (
    <>
      {data.map((value, index) => (
        <div
          className={styles.flex}
          key={index}
          id={index.toString()}
          onClick={() => {
            setSelectedChat(JSON.stringify(value));
          }}
          style={{
            backgroundColor:
              selectedChat === JSON.stringify(value) ? "#38B2AC" : "#E8E8E8",
          }}
        >
          <h1> {value.name}</h1>
          <p>
            {value.nameOfLast} : {value.lastMessage}
          </p>
        </div>
      ))}
    </>
  );
}
