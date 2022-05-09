import { useState } from "react";
import styles from "../../css/Profile.module.css";
import Button from "../../components/Button";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faMessage,
	faBan,
	faRankingStar,
} from "@fortawesome/free-solid-svg-icons";

import ProgressBar from "react-animated-progress-bar";
import { PieChart } from "react-minimal-pie-chart";

import Profiles from "./Users";
import { Data } from "../Leaderboard/database";
import { useParams } from "react-router";

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
	const [inputText, setInputText] = useState("");
	const [username, setUsername] = useState("");
	const [picture, setPicture] = useState("");
	const [win, setWin] = useState(0);
	const [lose, setLose] = useState(0);
	let inputHandler = (e: any) => {
		//convert input text to lower case
		var lowerCase = e.target.value.toLowerCase();
		setInputText(lowerCase);
	};

	const filteredData = Data.filter((el) => {
		//if no input the return the original
		if (inputText === "") {
			return el;
		}
		//return the item which contains the user input
		else {
			return el.name.toLowerCase().includes(inputText);
		}
	});

	const getData = async (id?: number) => {
		let link =
			process.env.REACT_APP_BACK_URL +
			":" +
			process.env.REACT_APP_BACK_PORT +
			"/user/";
		link += id ? id : "me";
		const rawData = await fetch(link, {
			credentials: "include", //this is what I need to tell the browser to include cookies
		});
		const data = await rawData.json();
		setPicture(data.picture);
		setLose(data.lose);
		setWin(data.win);
		setUsername(data.username);
	};
	const { id } = useParams();
	getData(Number(id));
	const status: string = "Online";
	return (
		<div className={styles.Container}>
			<div className={styles.Header}>
				{/* <img src={image} /> */}
				<img src={picture} />
				<div className={styles.Infos}>
					<div>
						{/* <h1>Lacruype</h1> */}
						<h1>{username}</h1>
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
						<FontAwesomeIcon icon={faRankingStar} />
						<h2>1</h2>
						<h3>er</h3>
					</div>
					<div className={styles.LevelProgress}>
						<span>3</span>
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
						<span>4</span>
					</div>
					<div className={styles.Ratio}>
						<PieChart
							lineWidth={60}
							label={({ dataEntry }) => Math.round(dataEntry.percentage) + "%"}
							labelPosition={100 - 60 / 2}
							labelStyle={{
								fill: "#fff",
								opacity: 0.75,
								pointerEvents: "none",
							}}
							data={[
								{ title: "Win", value: win, color: "green" },
								{ title: "Lose", value: lose, color: "red" },
							]}
						/>
					</div>
				</div>
				<div className={styles.SearchBar}>
					<TextField
						className={styles.Search}
						variant="outlined"
						fullWidth
						label="Search"
						onChange={inputHandler}
					/>
					<Profiles Leaderboard={filteredData} />
				</div>
			</div>
		</div>
	);
}
