import styles from "../css/Credits.module.css";

export default function Credits() {
	return (
		<div>
			<button
				onClick={() => {
					fetch(
						process.env.REACT_APP_BACK_URL +
							":" +
							process.env.REACT_APP_BACK_PORT +
							"/user/",
						{
							credentials: "include",
						}
					)
						.then((res) => res.json())
						.then((data) => {
							console.log(data);
						});
				}}
			>
				CLICK
			</button>
		</div>
	);
}
