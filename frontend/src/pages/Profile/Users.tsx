import Button from "../../components/Button";
import styles from "../../css/Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faMessage,
	faBan,
	faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function profiles({ Leaderboard }: any) {
	return <div id={styles.profile}>{Item(Leaderboard)}</div>;
}

function Item(data: any[]) {
	return (
		<>
			{data.map((value, index) => (
				<div className={styles.flex} key={index}>
					<div />
					<div className={styles.item}>
						<img src={value.picture} alt="" />

						<div className={styles.info}>
							<Link to={"/Profile/" + value.ft_id}>
								<h3 className={`${styles.name} ${styles.textDark}`}>
									{value.username}
								</h3>
							</Link>
							<span>{value.status}</span>
						</div>
					</div>
					<div className={styles.Button}>
						<Button text=" Add user">
							<FontAwesomeIcon icon={faCirclePlus} />
						</Button>
						<Button text="Chat">
							<FontAwesomeIcon icon={faMessage} />
						</Button>
						<Button text="Block user">
							<FontAwesomeIcon icon={faBan} />
						</Button>
					</div>
				</div>
			))}
		</>
	);
}
