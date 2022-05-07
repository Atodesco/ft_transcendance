import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { User } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {
		super({
			secretOrKey: process.env.SECRET_JWT,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					let accessToken = request?.cookies["token"];
					return accessToken;
				},
			]),
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload;
		const user = await this.userRepository.findOne({ where: { id } });

		if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

		return user;
	}
}
