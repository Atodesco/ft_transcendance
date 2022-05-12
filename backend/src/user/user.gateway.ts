// import {
// 	SubscribeMessage,
// 	WebSocketGateway,
// 	OnGatewayInit,
// 	WebSocketServer,
// 	OnGatewayConnection,
// 	OnGatewayDisconnect,
// } from "@nestjs/websockets";
// import { InjectRepository } from "@nestjs/typeorm";
// import { User } from "./entities/user.entity";
// import { Repository } from "typeorm";
// import { Socket, Server } from "socket.io";

// @WebSocketGateway({
// 	cors: {
// 		origin: "*",
// 	},
// })
// export class UserGateway {
// 	constructor(
// 		@InjectRepository(User)
// 		private readonly channelRepository: Repository<User>
// 	) {}


// 	@SubscribeMessage("text")
// 	async handleMessage(
// 		client: Socket,
// 		data: { channelname: string; message: string; date: Date }
// 	): Promise<void> {
// 	}

// }