import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Form from "react-bootstrap/Form";
import {
  SportsEsports,
  Block,
  AdminPanelSettings,
  VolumeOff,
  AccountCircle,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

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
  const [modalDuel, setModalDuel] = useState(false);
  const [showDropdownMute, setShowDropdownMute] = useState(false);
  const [showDropdownBan, setShowDropdownBan] = useState(false);
  const [valueTimeMute, setValueTimeMute] = useState(0);
  const [valueTimeBan, setValueTimeBan] = useState(0);
  const [booleanButtonMakeAdmin, setBooleanButtonMakeAdmin] = useState(true);

  const navigate = useNavigate();
  //   const user_id = userInfo.ft_id;

  useEffect(() => {
    console.log(valueTimeMute);
  }, [valueTimeMute]);

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
                            spacing={15}
                            direction="row"
                          >
                            <Button
                              variant="contained"
                              color={
                                !booleanButtonMakeAdmin ? "error" : "success"
                              }
                              endIcon={<AdminPanelSettings />}
                              onClick={() => {
                                setBooleanButtonMakeAdmin(
                                  !booleanButtonMakeAdmin
                                );
                              }}
                            >
                              {!booleanButtonMakeAdmin
                                ? "Remove Admin"
                                : "Make Admin"}
                            </Button>
                            <Button
                              title="Mute"
                              variant="contained"
                              color="error"
                              endIcon={<VolumeOff />}
                              onClick={() => {
                                if (showDropdownMute === false)
                                  setShowDropdownMute(true);
                                else setShowDropdownMute(false);
                              }}
                            >
                              Mute
                            </Button>
                            {showDropdownMute && (
                              <Form.Control
                                type="number"
                                placeholder="Time staying banned (in seconds)"
                                onChange={(e) =>
                                  setValueTimeMute(Number(e.target.value))
                                }
                                value={valueTimeMute}
                                className={styles.dropdownButtonMute}
                              />
                            )}
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<Block />}
                              onClick={() => {
                                if (showDropdownBan === false)
                                  setShowDropdownBan(true);
                                else setShowDropdownBan(false);
                              }}
                            >
                              Ban
                            </Button>
                            {showDropdownBan && (
                              <Form.Control
                                type="number"
                                placeholder="Time staying banned (in seconds)"
                                onChange={(e) =>
                                  setValueTimeBan(Number(e.target.value))
                                }
                                value={valueTimeBan}
                                className={styles.dropdownButtonBan}
                              />
                            )}
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
                              endIcon={<AccountCircle />}
                            >
                              Go to Profile
                            </Button>
                            <Button
                              variant="contained"
                              endIcon={<SportsEsports />}
                              onClick={() => {
                                setModalDuel(true);
                              }}
                            >
                              Duel
                            </Button>
                            {modalDuel && (
                              <div>
                                <Modal
                                  open={modalDuel}
                                  onClose={(event, reason) => {
                                    if (reason && reason == "backdropClick")
                                      return;
                                    setModalDuel(false);
                                  }}
                                  disableEscapeKeyDown={true}
                                >
                                  <Box className={styles.boxModalDuel}>
                                    <div className={styles.loader}></div>
                                    <div style={{ margin: "3% 0 0 35%" }}>
                                      Waiting for your opponent to accept ...
                                    </div>
                                    <Button
                                      style={{ margin: "5% 0 0 45%" }}
                                      variant="contained"
                                      color="error"
                                      onClick={() => {
                                        setModalDuel(false);
                                      }}
                                      endIcon={<Block />}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </Modal>
                              </div>
                            )}
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
