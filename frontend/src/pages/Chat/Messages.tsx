import { red } from "@mui/material/colors";
import { flexbox } from "@mui/system";
import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import Chatabase from "./chatabase.json";

export default function messages({ myMessages }: any) {
  return <div id={styles.message}>{Item(myMessages)}</div>;
}

function Item(dataMessages: any) {
  const user_id = 1;
  return (
    <>
      {dataMessages.map((value: any, index: any) => (
        <div style={{ marginTop: "5%" }}>
          {value.user.ft_id !== user_id && (
            <Link to={"/Profile/" + value.user.ft_id.toString()}>
              <Avatar
                name={value.user.username}
                size="25pt"
                round="30px"
                src={value.user.picture}
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
                  value.user.ft_id === user_id ? "lightGreen" : "lightBlue",
                alignSelf:
                  value.user.ft_id === user_id ? "flex-end" : "flex-start",
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
