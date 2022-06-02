import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import styles from "../css/Login.module.css";

export default function Login() {
	const navigate = useNavigate();

	if (
		Cookies.get("token") !== undefined &&
		sessionStorage.getItem("2FA") === "true"
	) {
		navigate("/2FA");
	} else if (Cookies.get("token") !== undefined) {
		navigate("/Profile");
	}

	return (
		<div>
			<button
				onClick={async () => {
					const rawData = await fetch(
						process.env.REACT_APP_BACK_URL +
							":" +
							process.env.REACT_APP_BACK_PORT +
							"/login/42/tmp/fb72580b-27a5-4eef-8f0a-f117cac4e2b8"
					);

					if (Cookies.get("token") === undefined) {
						const data = await rawData.json();
						const paramValue = data.token;
						if (paramValue !== null) {
							Cookies.set("token", paramValue, { expires: 1 });
							sessionStorage.setItem("JustLoged", "true");
							navigate("/Profile");
						}
					}
				}}
			>
				Compte 1
			</button>
			<button
				onClick={async () => {
					const rawData = await fetch(
						process.env.REACT_APP_BACK_URL +
							":" +
							process.env.REACT_APP_BACK_PORT +
							"/login/42/tmp/5256edfd-cf1c-49e3-9463-4756474706f8"
					);
					if (Cookies.get("token") === undefined) {
						const data = await rawData.json();
						const paramValue = data.token;
						if (paramValue !== null) {
							Cookies.set("token", paramValue, { expires: 1 });
							sessionStorage.setItem("JustLoged", "true");
							navigate("/Profile");
						}
					}
				}}
			>
				Compte 2
			</button>
			<button
				onClick={async () => {
					const rawData = await fetch(
						process.env.REACT_APP_BACK_URL +
							":" +
							process.env.REACT_APP_BACK_PORT +
							"/login/42/tmp/1d7e9338-a800-4e8f-9c4b-5bd4dc707716"
					);
					if (Cookies.get("token") === undefined) {
						const data = await rawData.json();
						const paramValue = data.token;
						if (paramValue !== null) {
							Cookies.set("token", paramValue, { expires: 1 });
							navigate("/Profile");
						}
					}
				}}
			>
				Compte 3
			</button>
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
		</div>
	);
}
