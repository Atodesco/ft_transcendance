import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelService } from "./channel.service";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { Channel } from "./entities/channel.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Channel])],
	controllers: [ChatController],
	providers: [ChannelService, ChatGateway],
})
export class ChatModule {}
