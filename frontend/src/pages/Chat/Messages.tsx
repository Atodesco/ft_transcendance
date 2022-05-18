import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Dropdown, FormControl } from "react-bootstrap";
import { useState } from "react";

interface Props {
	myMessages: any;
	channelSelected: number;
	userInfo: any;
}

export default function messages(props: Props) {
	return (
		<div id={styles.message}>
			{Item(props.myMessages, props.channelSelected, props.userInfo)}
		</div>
	);
}

const showMenu = () => {
	return (
		<Dropdown.Menu>
			<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
			<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
			<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
		</Dropdown.Menu>
	);
};

function Item(dataMessages: any, channelSelected: any, userInfo: any) {
	// const user_id = userInfo.ft_id;
	const [menuShown, setMenuShown] = useState(false);
	const user_id = 1;
	return (
		<>
			{dataMessages.map((value: any, index: any) => {
				if (value.channelId !== channelSelected) {
					return <></>;
				}
				return (
					<div style={{ marginTop: "5%" }}>
						{value.user.ft_id !== user_id && (
							<>
								<div
									className={styles.chatAvatar}
									onMouseEnter={() => setMenuShown(true)}
									onMouseLeave={() => setMenuShown(false)}
								>
									<Link to={"/Profile/" + value.user.ft_id}>
										<Avatar
											className={styles.chatAvatar}
											name={value.user.username}
											size="25pt"
											round="30px"
											src={value.user.picture}
										/>
									</Link>
								</div>
								{menuShown && (
									<div className={styles.dropdownMenuAvatar}>
										<Dropdown
											onMouseEnter={() => setMenuShown(true)}
											onMouseLeave={() => setMenuShown(false)}
										>
											<Dropdown.Menu show={true}>
												<Dropdown.Item eventKey="1">Action</Dropdown.Item>
												<Dropdown.Item eventKey="2">
													Another action
												</Dropdown.Item>
												<Dropdown.Item eventKey="3">
													Something else here
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								)}
							</>
						)}
						<div
							style={{
								display: "flex",
								flexDirection: "column-reverse",
							}}
						>
							<span
								className={styles.singleMessage}
								key={index}
								id={index.toString()}
								style={{
									backgroundColor:
										value.user.ft_id === user_id ? "lightGreen" : "lightBlue",
									alignSelf:
										value.user.ft_id === user_id ? "flex-end" : "flex-start",
									borderRadius: "20px",
									padding: "5px 15px",
									maxWidth: "75%",
								}}
							>
								{value.message}
							</span>
						</div>
					</div>
				);
			})}
		</>
	);
}
