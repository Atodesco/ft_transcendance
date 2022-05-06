import { Controller, Get, Request, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	@Get("username")
	getUsername(@Request() req, @Res() response: Response) {
		// console.log("aaaaaaaaaa");
		// console.log(req);
		const token: any = this.jwtService.decode(req.cookies.token);
		// console.log(token);

		response.status(200).json({
			username: token.username,
		});
		// return token.username;
	}

	@Get("picture")
	getPicture(@Request() req, @Res() response: Response) {
		const token: any = this.jwtService.decode(req.cookies.token);
		// console.log(token);
		response.status(200).json({
			picture: token.picture,
		});
	}
}
