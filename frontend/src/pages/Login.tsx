import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import styles from "../css/Login.module.css";
import Button from "@mui/material/Button";

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

<<<<<<< HEAD
	return (
		<div>
			<button
				onClick={async () => {
					const rawData = await fetch(
						process.env.REACT_APP_BACK_URL +
							":" +
							process.env.REACT_APP_BACK_PORT +
							"/login/42/tmp/5ea71532-188f-495b-be2b-21c3f03ddab7"
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
							"/login/42/tmp/76cc4e25-fb64-4216-a2a2-0512ae2cd517"
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
							"/login/42/tmp/cab7b7a2-1a1f-4533-ac91-319a50019dfd"
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
=======
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
>>>>>>> 7fed22f40b9d2db091b94ad4b4ed3060a66fc5c6
}
