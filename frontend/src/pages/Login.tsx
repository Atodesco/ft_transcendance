import { Link } from "react-router-dom";
import styles from "../css/Login.module.css";

export default function Login() {
  return (
    <div>
      <a href="http://localhost:3000/login/42">
        <button className={styles.button}>
          <span>Log 42 </span>
        </button>
      </a>
    </div>
  );
}
