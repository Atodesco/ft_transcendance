import styles from "../../css/Leaderboard.module.css";
import { Link } from "react-router-dom";

export default function profiles({ Leaderboard }: any) {
	return <div id={styles.profile}>{Item(Leaderboard)}</div>;
}

function Item(data: any[]) {
	return (
		<>
			{data.map((value, index) => {
				let color;
				if (value.status === "Online") color = "green";
				else if (value.status === "Offline") color = "red";
				else if (value.status === "InGame") color = "orange";
				return (
					<div className={styles.flex} key={index}>
						<div className={styles.item}>
							<img src={value.picture} alt="" />

							<div className={styles.info}>
								<Link to={"/Profile/" + value.ft_id}>
									<h3 className={`${styles.name} ${styles.textDark}`}>
										{value.username}
									</h3>
								</Link>
							</div>
							<div className={styles.status} style={{ color: color }}>
								<span>{value.status}</span>
							</div>

							<div className={styles.elo}>
								<span>Elo: {value.elo}</span>
							</div>
							<div className={styles.rank}>
								<span>Rank: {index + 1}</span>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
