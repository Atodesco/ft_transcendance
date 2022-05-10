import { Controller, Get } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { MessageService } from "./message.service";

@Controller("chat")
export class ChatController {
	constructor(
		private readonly channelService: ChannelService,
		private readonly messageService: MessageService
	) {}

	@Get("channels")
	async getChannels() {
		return await this.channelService.getChannels();
	}
}
