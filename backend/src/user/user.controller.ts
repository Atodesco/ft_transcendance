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

	@Get("username")
	getUsername(@Request() req, @Res() response: Response) {
		const token: any = this.jwtService.decode(req.cookies.token);

		response.status(200).json({
			username: token.username,
		});
	}

	@Get("picture")
	getPicture(@Request() req, @Res() response: Response) {
		const token: any = this.jwtService.decode(req.cookies.token);
		response.status(200).json({
			picture: token.picture,
		});
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
