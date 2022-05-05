import { Link } from "react-router-dom";
import styles from "../css/Login.module.css";

export default function Login() {
  return (
    <div>
      <Link to="/Profile">
        <button className={styles.button}>
          <span>Log 42 </span>
        </button>
      </Link>
    </div>
  );
}
