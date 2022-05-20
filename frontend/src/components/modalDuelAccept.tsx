import styles from "../css/App.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Block, TaskAlt } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ModalDuelAccept() {
  const [modalDuelAccept, setModalDuelAccept] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => {
          setModalDuelAccept(true);
        }}
      >
        CLICK ME
      </Button>
      <Modal
        open={modalDuelAccept}
        onClose={(event, reason) => {
          if (reason && reason == "backdropClick") return;
          setModalDuelAccept(false);
        }}
        disableEscapeKeyDown={true}
      >
        <Box className={styles.boxModalDuelAccept}>
          <div style={{ margin: "10% 0 0 30%", fontSize: "1vw" }}>
            Lacruype has challenged you to play Pong !
          </div>
          <Button
            style={{ margin: "15% 0 0 40%" }}
            variant="contained"
            color="success"
            onClick={() => {
              setModalDuelAccept(false);
              navigate("/thegame");
            }}
            endIcon={<TaskAlt />}
          >
            Accept Duel
          </Button>
          <Button
            style={{ margin: "5% 0 0 40%" }}
            variant="contained"
            color="error"
            onClick={() => {
              setModalDuelAccept(false);
            }}
            endIcon={<Block />}
          >
            Refuse Duel
          </Button>
        </Box>
      </Modal>
    </>
  );
}
