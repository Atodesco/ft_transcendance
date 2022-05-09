import { Controller, Get, UseGuards, Request, Res } from "@nestjs/common";
import { FtOauthGuard } from "./guards/ft-oauth.guard";
import { FtStrategy } from "./ft.strategy";
import { Response } from "express";

@Controller("login")
export class LoginController {
	constructor(private ftstrategy: FtStrategy) {}
	@Get("42")
	@UseGuards(FtOauthGuard)
	ftAuth() {
		return;
	}

	@Get("42/return")
	@UseGuards(FtOauthGuard)
	async ftAuthCallback(@Request() req, @Res() response: Response) {
		const token = await this.ftstrategy.login(req.user);
		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = process.env.FRONT_PORT;
		url.pathname = "Profile";
		url.searchParams.set("code", token);

		response.status(302).redirect(url.href);
	}
}
