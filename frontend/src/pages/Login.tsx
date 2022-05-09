import Cookies from "js-cookie";
import { Navigate } from "react-router";
import styles from "../css/Login.module.css";

export default function Login() {
	return (
		<div>
			<a
				href={
					process.env.REACT_APP_BACK_URL +
					":" +
					process.env.REACT_APP_BACK_PORT +
					"/login/42"
				}
			>
				<button className={styles.button}>
					<span>Log 42 </span>
				</button>
			</a>
			{Cookies.get("token") !== undefined && <Navigate to="/Profile" />}
		</div>
	);
}
