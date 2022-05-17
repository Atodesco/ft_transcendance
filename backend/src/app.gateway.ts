import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "./chat/entities/channel.entity";
import { User } from "src/User/entities/user.entity";
import { Repository } from "typeorm";
import { UserStatus } from "src/interfaces/user-status.enum";
import { Interval } from "@nestjs/schedule";
const bcrypt = require("bcrypt");

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@WebSocketServer()
	server: Server;

	private clientsId = new Map<string, number>();
	private clientsFt = new Map<number, string>();

	async handleConnection(client: Socket) {
		try {
			console.log("Client connected: ", client.id);
			console.log("Client ft_id: ", client.handshake.query.ft_id);

			const user = await this.userRepository.findOne({
				ft_id: Number(client.handshake.query.ft_id),
			});
			if (user && user.status) {
				user.status = UserStatus.ONLINE;
				await this.userRepository.save(user);

				this.clientsId.set(client.id, Number(client.handshake.query.ft_id));
				this.clientsFt.set(Number(client.handshake.query.ft_id), client.id);
			}
		} catch (error) {
			console.log("Error handleConnection: ", error);
		}
	}

	async handleDisconnect(client: Socket) {
		console.log("Client disconnected: ", client.id);
		const ft_id = this.clientsId.get(client.id);

		const user = await this.userRepository.findOne({
			ft_id: ft_id,
		});
		if (user && user.status) {
			user.status = UserStatus.OFFLINE;
			await this.userRepository.save(user);

			this.clientsId.delete(client.id);
			this.clientsFt.delete(ft_id);
		}
	}

	async emitChannel(channel: any, event: string, data: any): Promise<void> {
		if (!channel.users) return;

		const sockets: any[] = Array.from(this.server.sockets.sockets.values());
		sockets.forEach((socket) => {
			if (
				channel.users.find(
					(user) => user.ft_id === this.clientsId.get(socket.id)
				)
			) {
				socket.emit(event, data);
			}
		});
	}

	@SubscribeMessage("text")
	async handleMessage(
		client: Socket,
		data: { channelId: number; message: string; date: Date }
	): Promise<void> {
		console.log("Message received from: ", client.id);
		console.log("Message received data: ", data);
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne({ ft_id: ft_id });

		const channel = await this.channelRepository.findOne(
			{
				id: data.channelId,
			},
			{ relations: ["users"] }
		);

		if (channel && channel.users) {
			this.emitChannel(channel, "text", {
				message: data.message,
				user: user,
				date: data.date,
				channelId: data.channelId,
			});
		}
	}

	@SubscribeMessage("joinChannel")
	async joinChannel(
		client: Socket,
		data: { channelId: number; password: string }
	): Promise<void> {
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne({ ft_id: ft_id });
		const channel = await this.channelRepository.findOne(
			{
				id: data.channelId,
			},
			{ relations: ["users"] }
		);
		let isPassword = false;
		if (channel && channel.private) {
			if (!bcrypt.compare(data.password, channel.password)) {
				return;
			}
			isPassword = true;
		}

		if (!user.channels) {
			user.channels = [channel.id];
		} else {
			user.channels.push(channel.id);
		}
		if (!channel.users) {
			channel.users = [user];
		} else {
			channel.users.push(user);
		}

		await this.userRepository.save(user);
		await this.channelRepository.delete({ id: channel.id });

		channel.id = data.channelId;
		await this.channelRepository.save(channel);

		const newChannel = await this.channelRepository.findOne({ id: channel.id });

		client.emit("myChannel", {
			channelname: newChannel.channelname,
			id: newChannel.id,
			private: newChannel.private,
		});
		if (isPassword) {
			client.emit("joinedChannel", { channelId: newChannel.id });
		}
	}

	@SubscribeMessage("createChannel")
	async createChannel(
		client: Socket,
		data: { channelname: string; password: string }
	): Promise<void> {
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne({ ft_id: ft_id });
		let channel = this.channelRepository.create();
		channel.channelname = data.channelname;
		channel.owner = user;
		channel.private = data.password ? true : false;
		const saltRounds = 10;
		if (data.password) {
			channel.password = await bcrypt.hash(data.password, saltRounds);
		}

		const allChannels = await this.channelRepository.find();
		let channelId = 1;
		allChannels.forEach((c) => {
			if (c.id > channelId) {
				channelId = c.id;
			}
		});
		channelId++;
		channel.id = channelId;

		if (!channel.users) {
			channel.users = [user];
		} else {
			channel.users.push(user);
		}

		await this.channelRepository.save(channel);
		const newChannel = await this.channelRepository.findOne({
			id: channel.id,
		});

		if (!user.channels) {
			user.channels = [newChannel.id];
		} else {
			user.channels.push(newChannel.id);
		}
		await this.userRepository.save(user);

		client.emit("myChannel", {
			channelname: newChannel.channelname,
			id: newChannel.id,
			private: newChannel.private,
		});

		const sockets: any[] = Array.from(this.server.sockets.sockets.values());
		sockets.forEach((socket) => {
			if (socket.id !== client.id) {
				client.emit("searchChannel", {
					channelname: newChannel.channelname,
					id: newChannel.id,
					private: newChannel.private,
				});
			}
		});
	}

	@SubscribeMessage("GetUserData")
	async getUserData(client: Socket): Promise<void> {
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne({ ft_id: ft_id });
		client.emit("userData", user);
	}

	@SubscribeMessage("ready")
	async ready(client: Socket): Promise<void> {
		// const interval = 1000 / 60;
		// const ballSpeed = 0.03;
		// const frameTime = interval / 1000;
		// let ballPositions = { x: 50, y: 50 };
		// console.log("update!");
		// let now = Date.now();
		// let lastUpdate = Date.now();
		// setInterval(() => {
		// 	now = Date.now();
		// 	let dt = now - lastUpdate;
		// 	// client.emit("update", { p1: 50, ball: ballPositions, p2: 50 });
		// 	ballPositions.x += ballSpeed * dt;
		// 	ballPositions.y += ballSpeed * dt;
		// 	lastUpdate = now;
		// }, interval);
		// this.loop(client);
	}

	now = Date.now();
	lastUpdate = Date.now();
	ballPositions = { x: 50, y: 50 };
	ballSpeed = 0.001;
	counter = 0;

	@Interval(1000 / 5)
	loop(client: any) {
		this.now = Date.now();
		let dt = this.now - this.lastUpdate;
		// client.emit("update", { p1: 50, ball: this.ballPositions, p2: 50 });
		this.ballPositions.x += this.ballSpeed * dt;
		this.ballPositions.y += this.ballSpeed * dt;
		this.lastUpdate = this.now;
		this.counter++;
		// if (this.counter > 600) {
		// 	this.counter = 0;
		// 	return true;
		// }
	}
}
