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
import { useState } from "react";

export default function profiles({ Data, myData }: any) {
	return <div id={styles.profile}>{Item(Data, myData)}</div>;
}

function Item(data: any[], myData: any) {
	return (
		<>
			{data.map((value, index) => {
				let addFriend = myData.friends.includes(value.ft_id);
				let blockedUser = myData.blocked.includes(value.ft_id);
				return (
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
						{/* <div className={styles.Button}>
							<Button
								text={addFriend ? " Add user" : " Remove user"}
								onClick={() => {
									const addOrRemove = addFriend
										? "/addFriend/"
										: "/removeFriend/";
									fetch(
										process.env.REACT_APP_BACK_URL +
											":" +
											process.env.REACT_APP_BACK_PORT +
											"/user/" +
											myData.ft_id +
											addOrRemove +
											value.ft_id,
										{
											credentials: "include",
										}
									);
								}}
							>
								<FontAwesomeIcon icon={faCirclePlus} />
							</Button>
							<Button text="Chat">
								<FontAwesomeIcon icon={faMessage} />
							</Button>
							<Button
								text={blockedUser ? " Block user" : " Unblock user"}
								onClick={() => {
									const blockOrUnblock = blockedUser
										? "/blockUser/"
										: "/unblockUser/";
									fetch(
										process.env.REACT_APP_BACK_URL +
											":" +
											process.env.REACT_APP_BACK_PORT +
											"/user/" +
											myData.ft_id +
											blockOrUnblock +
											value.ft_id,
										{
											credentials: "include",
										}
									);
								}}
							>
								<FontAwesomeIcon icon={faBan} />
							</Button>
						</div> */}
					</div>
				);
			})}
		</>
	);
}
