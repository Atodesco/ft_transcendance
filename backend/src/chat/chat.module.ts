import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { ChannelService } from './channel.service';
import { MessageService } from './message.service';

@Module({
 imports: [],
 controllers: [],
 providers: [ChannelService, MessageService, ChatGateway],
})
export class AppModule {}