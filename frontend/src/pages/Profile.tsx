import styles from "../css/Profile.module.css";
import image from "../image/JAKEHEARPHONES.jpg";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faMessage,
	faBan,
} from "@fortawesome/free-solid-svg-icons";

import ProgressBar from "react-animated-progress-bar";
import { PieChart } from "react-minimal-pie-chart";

interface History {
	username: string;
	score: string;
	win: boolean;
}

const history: History[] = [
	{ username: "Rledrin", score: "5:7", win: false },
	{ username: "Atodesco", score: "7:0", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
	{ username: "Jake", score: "7:1", win: true },
];

export default function Profile() {
	console.log("url: ", window.location.href);
	const params = new URLSearchParams(window.location.search);
	const paramValue = params.get("code");
	console.log("paramValue: ", paramValue);

	const status: string = "Online";
	return (
		<>
			<div className={styles.Header}>
				<img src={image} />
				<div className={styles.Infos}>
					<div>
						<h1>Lacruype</h1>
						<h2>Status: {status} </h2>
					</div>
					<div className={styles.Buttons}>
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
			</div>
			<div className={styles.ProfileInfo}>
				<div className={styles.MatchHistory}>
					{history.map((item, index) => {
						let col = "red";
						if (item.win) {
							col = "green";
						}

						return (
							<div key={index} style={{ backgroundColor: col }}>
								{item.username} {item.score} {item.win}
							</div>
						);
					})}
				</div>
				<div className={styles.Stats}>
					<div className={styles.Rank}>
						Rank
						<hr />
						Leaderboard
					</div>
					<div>
						Current Level
						<ProgressBar
							className={styles.Level}
							width="200px"
							height="10px"
							rect
							fontColor="gray"
							percentage="70"
							rectPadding="1px"
							rectBorderRadius="20px"
							trackPathColor="transparent"
							bgColor="#333333"
							trackBorderColor="grey"
						/>
						Level to Reach
					</div>
					<PieChart
						className={styles.Ratio}
						radius={4}
						lineWidth={10}
						data={[
							{ title: "Win", value: 100, color: "green" },
							{ title: "Lose", value: 75, color: "red" },
						]}
					/>
				</div>
				{/* <div className={styles.Achievements}></div> */}
			</div>
		</>
	);
}
