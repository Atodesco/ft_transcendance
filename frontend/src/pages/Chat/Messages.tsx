import { red } from "@mui/material/colors";
import { flexbox } from "@mui/system";
import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

export default function messages({ myMessages }: any) {
  return <div id={styles.message}>{Item(myMessages)}</div>;
}

function Item(
  dataMessages: [
    {
      sender: { username: string; ft_id: number; avatar: string };
      message: string;
    }
  ]
) {
  const user_id = 1;
  return (
    <>
      {dataMessages.map((value, index) => (
        <div style={{ marginTop: "5%" }}>
          {value.sender.ft_id !== user_id && (
            <Link to={"/Profile/" + value.sender.ft_id.toString()}>
              <Avatar
                name={value.sender.username}
                size="25pt"
                round="30px"
                src={value.sender.avatar}
              />
            </Link>
          )}
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
                backgroundColor:
                  value.sender.ft_id === user_id ? "lightGreen" : "lightBlue",
                alignSelf:
                  value.sender.ft_id === user_id ? "flex-end" : "flex-start",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {value.message}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
