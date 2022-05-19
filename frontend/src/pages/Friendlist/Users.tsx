import styles from "../../css/Profile.module.css";
import { Link } from "react-router-dom";

export default function profiles({ Data }: any) {
	return <div id={styles.profile}>{Item(Data)}</div>;
}

function Item(data: any[]) {
	return (
		<>
			{data.map((value, index) => {
				return (
					<div className={styles.flex} key={index}>
						<div className={styles.item}>
							<img src={value.picture} alt="profile" />

							<div className={styles.info}>
								<Link to={"/Profile/" + value.ft_id}>
									<h3 className={`${styles.name} ${styles.textDark}`}>
										{value.username}
									</h3>
								</Link>
								<span>{value.status}</span>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
