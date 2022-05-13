import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/chat/entities/channel.entity";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>
	) {}

	async getAllUsers(): Promise<User[]> {
		return this.userRepository.find();
	}

	async getUser(id: number): Promise<User> {
		return await this.userRepository.findOne({ ft_id: id });
	}

	async addFriend(id: number, friendId: number): Promise<User> {
		const user = await this.userRepository.findOne({ ft_id: id });
		user.friends.push(friendId);
		await this.userRepository.save(user);
		return user;
	}

	async removeFriend(id: number, friendId: number): Promise<User> {
		const user = await this.userRepository.findOne({ ft_id: id });
		user.friends = user.friends.filter((friend) => friend !== friendId);
		await this.userRepository.save(user);
		return user;
	}

	async blockUser(id: number, blockedId: number): Promise<User> {
		const user = await this.userRepository.findOne({ ft_id: id });
		user.blocked.push(blockedId);
		await this.userRepository.save(user);
		return user;
	}

	async unblockUser(id: number, unblockedId: number): Promise<User> {
		const user = await this.userRepository.findOne({ ft_id: id });
		user.blocked = user.blocked.filter(
			(blockedUser) => blockedUser !== unblockedId
		);
		await this.userRepository.save(user);
		return user;
	}

	async setElo(id: number, elo: number): Promise<User> {
		const user = await this.userRepository.findOne({ ft_id: id });
		user.elo = elo;
		await this.userRepository.save(user);
		return user;
	}

	async joinChannel(id, channelId): Promise<Channel> {
		const user = await this.userRepository.findOne({ ft_id: id });
		const channel = await this.channelRepository.findOne({ id: channelId });
		if (!user.channels) {
			user.channels = [channel.id];
		} else {
			user.channels.push(channel.id);
		}
		if (!channel.users) {
			channel.users = [user];
		} else {
			channel.users.push(user);
		}
		await this.userRepository.save(user);
		await this.channelRepository.save(channel);
		return channel;
	}
}
