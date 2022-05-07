import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router";
import styles from "../css/Login.module.css";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div>
      <a>
        <button
          className={styles.button}
          onClick={() => {
            Cookies.remove("token");
            navigate("/Login");
          }}
        >
          <span>Log out</span>
        </button>
      </a>
    </div>
  );
}
