import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  SportsEsports,
  Block,
  AdminPanelSettings,
  VolumeOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

import { useState } from "react";

interface Props {
  myMessages: any;
  channelSelected: number;
  userInfo: any;
}

export default function messages(props: Props) {
  return (
    <div id={styles.message}>
      {Item(props.myMessages, props.channelSelected, props.userInfo)}
    </div>
  );
}

function Item(dataMessages: any, channelSelected: any, userInfo: any) {
  const user_id = 1;
  const [modalProfile, setModalProfile] = useState(false);
  const navigate = useNavigate();
  //   const user_id = userInfo.ft_id;
  return (
    <>
      {dataMessages.map((value: any, index: any) => {
        if (value.channelId !== channelSelected) {
          return <></>;
        }
        return (
          <div style={{ marginTop: "5%" }}>
            {value.user.ft_id !== user_id && (
              <>
                <div className={styles.chatAvatar}>
                  <Avatar
                    style={{ cursor: "pointer" }}
                    className={styles.chatAvatar}
                    name={value.user.username}
                    size="25pt"
                    round="30px"
                    src={value.user.picture}
                    onClick={() => {
                      setModalProfile(true);
                    }}
                  />
                  {modalProfile && (
                    <div>
                      <Modal
                        open={modalProfile}
                        onClose={() => {
                          setModalProfile(false);
                        }}
                      >
                        <Box className={styles.boxModalProfile}>
                          <Avatar
                            style={{ margin: "2% 0 0 2%" }}
                            className={styles.chatAvatar}
                            name={value.user.username}
                            size="7vw"
                            round="5vh"
                            src={value.user.picture}
                          />
                          <div
                            style={{
                              margin: "-6% 0 0 20%",
                              fontSize: "3vw",
                            }}
                          >
                            {value.user.username}
                          </div>
                          <br />
                          <Stack
                            className={styles.boxButtonsOwner}
                            spacing={5}
                            direction="row"
                          >
                            <Button
                              variant="contained"
                              color="success"
                              endIcon={<AdminPanelSettings />}
                            >
                              Make Admin
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<VolumeOff />}
                            >
                              Mute
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<Block />}
                            >
                              Ban
                            </Button>
                          </Stack>
                          <Stack
                            className={styles.boxButtons}
                            spacing={15}
                            direction="row"
                          >
                            <Button
                              variant="contained"
                              onClick={() => {
                                navigate("/Profile/" + value.user.ft_id);
                              }}
                            >
                              Go to Profile
                            </Button>
                            <Button
                              variant="contained"
                              endIcon={<SportsEsports />}
                            >
                              Duel
                            </Button>
                          </Stack>
                        </Box>
                      </Modal>
                    </div>
                  )}
                </div>
              </>
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
        );
      })}
    </>
  );
}
