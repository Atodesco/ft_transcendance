import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/login/constants";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "1d" },
		}),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
