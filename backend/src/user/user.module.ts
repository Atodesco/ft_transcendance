import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.SECRET_JWT,
			signOptions: { expiresIn: "1d" },
		}),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
