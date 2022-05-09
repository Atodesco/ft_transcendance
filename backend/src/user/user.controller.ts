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
}
