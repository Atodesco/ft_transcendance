import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Request,
	Res,
	UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@Get("me")
	getMyData(@Request() req): Promise<User> {
		const token: any = this.jwtService.decode(req.cookies.token);

		return this.userService.getUser(token.id);
	}

	@Get("/")
	getAllUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get("/:id")
	getUser(@Param("id", ParseIntPipe) id: number): Promise<User> {
		return this.userService.getUser(id);
	}

	@Get("/:id/addFriend/:friendId")
	addFriend(
		@Param("id", ParseIntPipe) id: number,
		@Param("friendId", ParseIntPipe) friendId: number
	): Promise<User> {
		return this.userService.addFriend(id, friendId);
	}

	@Get("/:id/removeFriend/:friendId")
	removeFriend(
		@Param("id", ParseIntPipe) id: number,
		@Param("friendId", ParseIntPipe) friendId: number
	): Promise<User> {
		return this.userService.removeFriend(id, friendId);
	}

	@Get("/:id/blockUser/:userId")
	blockUser(
		@Param("id", ParseIntPipe) id: number,
		@Param("userId", ParseIntPipe) userId: number
	): Promise<User> {
		return this.userService.blockUser(id, userId);
	}

	@Get("/:id/unblockUser/:userId")
	unblockUser(
		@Param("id", ParseIntPipe) id: number,
		@Param("userId", ParseIntPipe) userId: number
	): Promise<User> {
		return this.userService.unblockUser(id, userId);
	}

	@Get("/:id/setElo/:elo")
	setElo(
		@Param("id", ParseIntPipe) id: number,
		@Param("elo", ParseIntPipe) elo: number
	): Promise<User> {
		return this.userService.setElo(id, elo);
	}
}
