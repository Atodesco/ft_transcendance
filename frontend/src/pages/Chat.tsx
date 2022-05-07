import styles from "../css/Chat.module.css";

export default function Chat() {
	return (
		<div>
			<button
				onClick={() => {
					fetch("http://localhost:3000/user/", {
						credentials: "include",
					})
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
