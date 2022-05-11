import { Controller, Get } from "@nestjs/common";
import { ChannelService } from "./channel.service";

@Controller("chat")
export class ChatController {
	constructor(private readonly channelService: ChannelService) {}

	@Get("channel")
	async getChannels() {
		return await this.channelService.getChannels();
	}
}
