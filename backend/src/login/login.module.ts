import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FtStrategy } from "./ft.strategy";
import { LoginController } from "./login.controller";
import { SessionSerializer } from "./session.serializer";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "src/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: process.env.SECRET_JWT,
			signOptions: { expiresIn: "1d" },
		}),
	],
	controllers: [LoginController],
	providers: [ConfigService, FtStrategy, SessionSerializer, JwtStrategy],
})
export class LoginModule {}
