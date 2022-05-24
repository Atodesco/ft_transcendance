import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(User)
		private readonly UserRepository: Repository<User>
	) {}

	async getChannels() {
		const channels = await this.channelRepository.find();
		let c = [];
		channels.forEach((channel) => {
			c.push({
				id: channel.id,
				channelname: channel.channelname,
				dm: channel.dm,
				private: channel.private,
			});
		});
		return c;
	}

	getChannelId(id: number) {
		return this.channelRepository.findOne({ id: id });
	}

	async createDm(owner_ft_id: number, user_ft_id: number) {
		const owner = await this.UserRepository.findOne({ ft_id: owner_ft_id });
		const user = await this.UserRepository.findOne({ ft_id: user_ft_id });

		const channel = new Channel();
		const alreadyExists = await this.channelRepository.findOne({
			dm: true,
			channelname: `Dm ${owner.username}-${user.username}`,
		});
		const alreadyExists2 = await this.channelRepository.findOne({
			dm: true,
			channelname: `Dm ${user.username}-${owner.username}`,
		});
		if (alreadyExists || alreadyExists2) {
			return;
		}
		channel.owner = owner;
		channel.users = [owner, user];
		channel.dm = true;
		const allChannels = await this.channelRepository.find();
		let channelId = 1;
		allChannels.forEach((c) => {
			if (c.id > channelId) {
				channelId = c.id;
			}
		});
		channelId++;
		channel.id = channelId;
		channel.channelname = `Dm ${owner.username}-${user.username}`;

		owner.channels = [...owner.channels, channelId];
		user.channels = [...user.channels, channelId];
		await owner.save();
		await user.save();

		return await this.channelRepository.save(channel);
	}
}
