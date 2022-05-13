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
		data: { channelId: number }
	): Promise<void> {
		const ft_id = this.clientsId.get(client.id);
		const user = await this.userRepository.findOne(
			{ ft_id: ft_id },
			{ relations: ["channels"] }
		);
		const channel = await this.channelRepository.findOne(
			{
				id: data.channelId,
			},
			{ relations: ["users"] }
		);
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

		const newChannel = await this.channelRepository.findOne({ id: channel.id });
		client.emit("myChannel", newChannel);
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
		const newChannel = await this.channelRepository.findOne({ id: channel.id });

		if (!user.channels) {
			user.channels = [newChannel.id];
		} else {
			user.channels.push(newChannel.id);
		}
		await this.userRepository.save(user);

		client.emit("myChannel", newChannel);

		const sockets: any[] = Array.from(this.server.sockets.sockets.values());
		sockets.forEach((socket) => {
			if (socket.id !== client.id) {
				socket.emit("searchChannel", newChannel);
			}
		});
	}
}
