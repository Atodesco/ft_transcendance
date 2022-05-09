import { red } from "@mui/material/colors";
import { flexbox } from "@mui/system";
import styles from "../../css/Chat.module.css";

export default function messages({ myMessages }: any) {
  return <div id={styles.message}>{Item(myMessages)}</div>;
}

function Item(
  dataMessages: [
    { sender: { username: string; ft_id: number }; message: string }
  ]
) {
  const user_id = 1;
  return (
    <>
      {dataMessages.map((value, index) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <span
            className={styles.singleMessage}
            key={index}
            id={index.toString()}
            style={{
              backgroundColor: value.sender.ft_id === user_id ? "blue" : "red",
              alignSelf: value.sender.ft_id === user_id ? "flex-end" : "none",
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
            }}
          >
            {value.message}
          </span>
        </div>
      ))}
    </>
  );
}
