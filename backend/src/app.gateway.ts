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
import { Player, Room, State } from "./Pong/interfaces/room.interface";
import { RoomService } from "./Pong/room.service";
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
		private readonly userRepository: Repository<User>,
		private readonly roomService: RoomService
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

	@SubscribeMessage("queue")
	joinQueue(client: Socket): void {
		const p: Player = {
			ft_id: this.clientsId.get(client.id),
			socket: client,
			score: 0,
			room: null,
			position: { x: 0, y: 0 },
			heightFromCenter: 5,
		};
		this.roomService.addQueue(p);
	}

	// @SubscribeMessage("room")
	// joinRoom(client: Socket, code?: string): void {
	// 	let room: Room = this.roomService.getRoom(code);
	// 	if (!room) {
	// 		room = this.roomService.createRoom(code);
	// 	}
	// 	const p: Player = {
	// 		ft_id: this.clientsId.get(client.id),
	// 		socket: client,
	// 		room: null,
	// 		score: 0,
	// 		position: { x: 0, y: 50 },
	// 	};

	// 	this.roomService.joinRoom(room, p);
	// }

	@SubscribeMessage("ready")
	onReady(client: Socket): void {
		const player: Player = this.roomService.getPlayer(
			this.clientsId.get(client.id)
		);
		if (!player || !player.room) {
			return;
		}

		this.roomService.startGame(player.room);
	}

	@SubscribeMessage("start")
	onStart(client: Socket): void {
		const player: Player = this.roomService.getPlayer(
			this.clientsId.get(client.id)
		);
		if (!player || !player.room) {
			return;
		}
		this.roomService.startCalc(player.room);
	}
}
