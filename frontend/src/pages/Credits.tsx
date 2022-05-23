export default function Credits() {
	return (
		<div>
			Credits
			<button
				onClick={async () => {
					const username = await fetch("http://localhost:3000/user/", {
						credentials: "include",
					});
					const data = await username.json();
					console.log(data);
				}}
			>
				Fetch User Data
			</button>
			<button
				onClick={async () => {
					const channelsRaw = await fetch(
						"http://localhost:3000/chat/channel",
						{
							credentials: "include",
						}
					);
					const data = await channelsRaw.json();
					console.log(data);
				}}
			>
				Fetch channels
			</button>
			<button
				onClick={async () => {
					const me = await fetch("http://localhost:3000/user/me/", {
						credentials: "include",
					});
					const myData = await me.json();
					const channel = await fetch(
						"http://localhost:3000/user/" + myData.ft_id + "/createChannel",
						{
							credentials: "include",
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								channelname: "testChannelName",
								password: "testPassword",
							}),
						}
					);
					console.log(await channel.json());
				}}
			>
				create channels
			</button>
		</div>
	);
}
