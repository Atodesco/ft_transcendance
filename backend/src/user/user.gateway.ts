import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class UserGateway {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage("text")
	async handleMessage(
		client: Socket,
		data: { channelname: string; message: string; date: Date }
	): Promise<void> {}
}
