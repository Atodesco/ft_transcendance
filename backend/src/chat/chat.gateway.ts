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
import { Channel } from "./entities/channel.entity";
import { User } from "src/User/entities/user.entity";
import { Repository } from "typeorm";
const bcrypt = require("bcrypt");

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

	handleConnection(client: Socket) {
		console.log("Client connected: ", client.id);
		console.log("Client ft_id: ", client.handshake.query.ft_id);
		this.clientsId.set(client.id, Number(client.handshake.query.ft_id));
		this.clientsFt.set(Number(client.handshake.query.ft_id), client.id);
	}

	handleDisconnect(client: Socket) {
		console.log("Client disconnected: ", client.id);
		const ft_id = this.clientsId.get(client.id);
		this.clientsId.delete(client.id);
		this.clientsFt.delete(ft_id);
	}

	emitChannel(channel: any, event: string, data: any): void {
		try {
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
		} catch {}
	}

	@SubscribeMessage("text")
	async handleMessage(
		client: Socket,
		data: { channelname: string; message: string; date: Date }
	): Promise<void> {
		console.log("Message received from: ", client.id);
		console.log("Message received data: ", data);
		const ft_id = this.clientsId.get(client.id);

		const channel = await this.channelRepository.findOne({
			channelname: data.channelname,
		});
		if (channel && channel.users) {
			const user = channel.users.find((user) => user.ft_id === ft_id);
			if (user) {
				// this.emitChannel(channel, "text", {
				this.server.emit("text", {
					message: data.message,
					user: user,
					date: data.date,
				});
			}
		}
	}

	@SubscribeMessage("joinChannel")
	async joinChannel(
		client: Socket,
		data: { channelId: number }
	): Promise<void> {
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne({ ft_id: ft_id });
		const channel = await this.channelRepository.findOne({
			id: data.channelId,
		});
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
		await this.channelRepository.save(channel);
		client.emit(
			"myChannel",
			await this.channelRepository.findOne({ id: channel.id })
		);
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
			bcrypt.genSalt(saltRounds, function (err, salt) {
				bcrypt.hash(data.password, salt, function (err, hash) {
					// ! Store le hash dans la base de données
					hash;
				});
			});
		}

		if (!channel.users) {
			channel.users = [user];
		} else {
			channel.users.push(user);
		}
		await this.channelRepository.save(channel);

		if (!user.channels) {
			user.channels = [channel.id];
		} else {
			user.channels.push(channel.id);
		}
		await this.userRepository.save(user);
		const sockets: any[] = Array.from(this.server.sockets.sockets.values());

		sockets.forEach((socket) => {
			if (socket.id !== client.id) {
				socket.emit("searchChannel", channel);
			}
		});
		client.emit(
			"myChannel",
			await this.channelRepository.findOne({ id: channel.id })
		);
	}
}
