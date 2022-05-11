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
import { Repository } from "typeorm";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>
	) {}

	@WebSocketServer()
	server: Server;

	private clientsId = new Map<string, number>();
	private clientsFt = new Map<number, string>();

	// private logger: Logger = new Logger("ChatGateway");

	// @SubscribeMessage("msgToServer")
	// handleMessage(client: Socket, payload: string): void {
	// 	this.server.emit("msgToClient", payload);
	// }

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
				this.emitChannel(channel, "text", {
					message: data.message,
					user: user,
					date: data.date,
				});
			}
		}
	}

	emitChannel(channel: any, event: string, data: any): void {
		try {
			if (!channel.users) return;

			const sockets: any[] = Array.from(this.server.sockets.sockets.values());
			sockets.forEach((socket) => {
				if (
					channel.users.find(
						(user) => user.ft_id === this.clientsId.get(socket.data.user.id)
					)
				) {
					socket.emit(event, data);
				}
			});
		} catch {}
	}
}
