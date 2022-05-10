import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelService } from "./channel.service";
import { ChatController } from "./chat.controller";
import { Channel } from "./entities/channel.entity";
import { Message } from "./entities/message.entity";
import { MessageService } from "./message.service";
// import { AppGateway } from "./app.gateway";

@Module({
	imports: [TypeOrmModule.forFeature([Channel, Message])],
	controllers: [ChatController],
	providers: [ChannelService, MessageService],
})
export class ChatModule {}
