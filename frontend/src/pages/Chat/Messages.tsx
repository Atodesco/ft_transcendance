import styles from "../../css/Chat.module.css";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

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

function Item(dataMessages: any, channelSelected: any, userInfo: any) {
	const user_id = userInfo.ft_id;
	return (
		<>
			{dataMessages.map((value: any, index: any) => {
				if (value.channelId !== channelSelected) {
					console.log("value.channel_id !== channelSelected");
					console.log("value.channel_id", value.channelId);
					console.log("channelSelected", channelSelected);
					return <></>;
				}
				return (
					<div style={{ marginTop: "5%" }}>
						{value.user.ft_id !== user_id && (
							<Link to={"/Profile/" + value.user.ft_id}>
								<Avatar
									name={value.user.username}
									size="25pt"
									round="30px"
									src={value.user.picture}
								/>
							</Link>
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
