import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelService } from "./channel.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "../app.gateway";
import { Channel } from "./entities/channel.entity";
import { User } from "src/user/entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Channel, User])],
	controllers: [ChatController],
	providers: [ChannelService, ChatGateway],
})
export class ChatModule {}
