import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async getAllUsers(): Promise<User[]> {
		return this.userRepository.find();
	}

	async getUser(id: number): Promise<User> {
		return this.userRepository.findOne({ where: { ft_id: id } });
	}

	async addFriend(id: number, friendId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.friends.push(friendId);
		await this.userRepository.save(user);
		return user;
	}

	async removeFriend(id: number, friendId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.friends = user.friends.filter((friend) => friend !== friendId);
		await this.userRepository.save(user);
		return user;
	}

	async blockUser(id: number, blockedId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.blocked.push(blockedId);
		await this.userRepository.save(user);
		return user;
	}

	async unblockUser(id: number, unblockedId: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.blocked = user.blocked.filter(
			(blockedUser) => blockedUser !== unblockedId
		);
		await this.userRepository.save(user);
		return user;
	}

	async setElo(id: number, elo: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.elo = elo;
		await this.userRepository.save(user);
		return user;
	}

	async createChannel(id: number, channelData: any): Promise<User> {
		const user = await this.userRepository.findOne({ where: { ft_id: id } });
		user.channels.push(channelData);
		await this.userRepository.save(user);
		return user;
	}
}
